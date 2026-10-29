import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import {
  collectFacts,
  toMarkdown,
  detectLicense,
  parseGitHubUrl,
  analyzeReadme,
  gitignoreMatcher,
} from '../skills/launch-kit/scripts/repo-facts.mjs';

const SCRIPT = fileURLToPath(new URL('../skills/launch-kit/scripts/repo-facts.mjs', import.meta.url));

const MIT = `MIT License

Copyright (c) 2026 Someone

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction.`;

// Builds a throwaway repository from a { 'path/to/file': 'content' } map.
function fixture(files) {
  const root = mkdtempSync(join(tmpdir(), 'repo-facts-'));
  for (const [path, content] of Object.entries(files)) {
    const full = join(root, path);
    mkdirSync(dirname(full), { recursive: true });
    writeFileSync(full, content);
  }
  return root;
}

function withFixture(files, fn) {
  const root = fixture(files);
  try {
    return fn(root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

const NODE_REPO = {
  'package.json': JSON.stringify({
    name: 'tiny-cli',
    version: '1.2.3',
    description: 'A tiny CLI that does one thing well.',
    license: 'MIT',
    keywords: ['CLI', 'tiny'],
    bin: { tiny: 'bin/tiny.js' },
    scripts: { test: 'node --test' },
    repository: { type: 'git', url: 'git+https://github.com/acme/tiny-cli.git' },
  }),
  LICENSE: MIT,
  'README.md': [
    '# tiny-cli',
    '',
    '[![CI](https://github.com/acme/tiny-cli/actions/workflows/ci.yml/badge.svg)](https://github.com/acme/tiny-cli/actions)',
    '[![npm](https://img.shields.io/npm/v/tiny-cli)](https://npmjs.com/package/tiny-cli)',
    '',
    'Turn long shell pipelines into one readable command.',
    '',
    '![Demo](docs/demo.gif)',
    '',
    '## Why',
    'Because pipelines are hard to read.',
    '',
    '## Install',
    '```bash',
    'npm install -g tiny-cli',
    '# Not a heading',
    '```',
    '',
    '## Usage',
    'Run `tiny`.',
    '',
    '## License',
    'MIT',
  ].join('\n'),
  'bin/tiny.js': 'console.log("tiny");\n',
  'src/index.ts': 'export const answer: number = 42;\n'.repeat(20),
  'test/index.test.js': 'import test from "node:test";\n',
  '.github/workflows/ci.yml': 'name: CI\non: push\n',
  'docs/demo.gif': 'GIF89a',
  'CONTRIBUTING.md': '# Contributing\n',
  '.github/ISSUE_TEMPLATE/bug.yml': 'name: Bug\n',
  'node_modules/huge/index.js': 'x'.repeat(100000),
  '.git/HEAD': 'ref: refs/heads/main\n',
  '.git/config': '[core]\n\tbare = false\n[remote "origin"]\n\turl = https://user:secret-token@github.com/acme/tiny-cli.git\n\tfetch = +refs/heads/*:refs/remotes/origin/*\n',
  '.git/refs/tags/v1.0.0': 'abc\n',
  '.git/packed-refs': '# pack-refs with: peeled\n' + 'a'.repeat(40) + ' refs/tags/v1.2.3\n^' + 'b'.repeat(40) + '\n',
};

test('collects the core facts of a Node.js repository', () => {
  withFixture(NODE_REPO, (root) => {
    const f = collectFacts(root);
    assert.equal(f.name, 'tiny-cli');
    assert.equal(f.description, 'A tiny CLI that does one thing well.');
    assert.equal(f.project_version, '1.2.3');
    assert.deepEqual(f.github, { owner: 'acme', repo: 'tiny-cli', url: 'https://github.com/acme/tiny-cli' });
    assert.equal(f.license.file, 'LICENSE');
    assert.equal(f.license.spdx, 'MIT');
    assert.equal(f.license.manifest, 'MIT');
    assert.equal(f.tests.has_tests, true);
    assert.equal(f.tests.command, 'npm test');
    assert.deepEqual(f.ci.providers, ['GitHub Actions']);
    assert.equal(f.demo.has_demo_media, true);
    assert.equal(f.demo.has_gif, true);
    assert.deepEqual(f.demo.repo_media_files, ['docs/demo.gif']);
    assert.equal(f.has_cli, true);
    assert.deepEqual(f.keywords, ['cli', 'tiny']);
    assert.equal(f.community.contributing, 'CONTRIBUTING.md');
    assert.equal(f.community.issue_templates, 1);
    assert.equal(f.git.branch, 'main');
    assert.equal(f.git.tags, 2);
  });
});

test('ignores vendored folders when measuring languages', () => {
  withFixture(NODE_REPO, (root) => {
    const f = collectFacts(root);
    assert.equal(f.languages.primary, 'TypeScript');
    assert.ok(f.languages.breakdown.every((l) => l.bytes < 100000), 'node_modules must not be counted');
    assert.ok(!f.files.top_level.includes('node_modules/'));
  });
});

test('skips files the root .gitignore excludes', () => {
  const files = {
    '.gitignore': '# reports\n/reports/\n*.log\ngenerated\n!keep.log\n',
    'src/app.py': 'print("hi")\n',
    'reports/index.html': '<html></html>'.repeat(10000),
    'src/generated/big.js': 'x'.repeat(50000),
    'debug.log': 'x',
  };
  withFixture(files, (root) => {
    const f = collectFacts(root);
    assert.equal(f.languages.primary, 'Python');
    assert.deepEqual(f.files.top_level, ['.gitignore', 'src/']);
  });
});

test('gitignoreMatcher supports anchored, unanchored, directory-only and glob rules', () => {
  const ignored = gitignoreMatcher('/dist\nbuild/\n*.tmp\ndocs/**/*.pdf\n');
  assert.equal(ignored('dist', true), true);
  assert.equal(ignored('src/dist', true), false);
  assert.equal(ignored('a/build', true), true);
  assert.equal(ignored('build', false), false, 'build/ only matches directories');
  assert.equal(ignored('x/y.tmp', false), true);
  assert.equal(ignored('docs/a/b/c.pdf', false), true);
  assert.equal(ignored('src/index.js', false), false);
});

test('never prints credentials stored in a git remote URL', () => {
  withFixture(NODE_REPO, (root) => {
    const json = JSON.stringify(collectFacts(root));
    assert.ok(!json.includes('secret-token'));
    assert.equal(collectFacts(root).git.remotes.origin, 'https://github.com/acme/tiny-cli.git');
  });
});

test('reads a Python project from pyproject.toml', () => {
  const files = {
    'pyproject.toml': [
      '[build-system]',
      'requires = ["hatchling"]',
      '',
      '[project]',
      'name = "snake-tool"',
      'version = "0.4.0"',
      'description = "Parse things quickly."',
      'license = { text = "Apache-2.0" }',
      'keywords = ["parsing", "Text"]',
      '',
      '[project.scripts]',
      'snake = "snake_tool.cli:main"',
      '',
      '[tool.pytest.ini_options]',
      'testpaths = ["tests"]',
    ].join('\n'),
    'LICENSE': 'Apache License\nVersion 2.0, January 2004\nhttp://www.apache.org/licenses/',
    'snake_tool/__init__.py': 'VERSION = "0.4.0"\n',
    'tests/test_cli.py': 'def test_ok():\n    assert True\n',
  };
  withFixture(files, (root) => {
    const f = collectFacts(root);
    assert.equal(f.name, 'snake-tool');
    assert.equal(f.project_version, '0.4.0');
    assert.equal(f.license.spdx, 'Apache-2.0');
    assert.equal(f.license.manifest, 'Apache-2.0');
    assert.deepEqual(f.keywords, ['parsing', 'text']);
    assert.equal(f.languages.primary, 'Python');
    assert.equal(f.has_cli, true);
    assert.equal(f.tests.has_tests, true);
    assert.equal(f.tests.command, 'pytest');
    assert.equal(f.ci.has_ci, false);
    assert.equal(f.readme, null);
    assert.equal(f.github, null);
  });
});

test('handles an empty folder without crashing', () => {
  withFixture({}, (root) => {
    const f = collectFacts(root);
    assert.equal(f.languages.primary, null);
    assert.equal(f.license.spdx, null);
    assert.equal(f.tests.has_tests, false);
    assert.equal(f.git.is_repo, false);
    assert.equal(f.files.count, 0);
    assert.match(toMarkdown(f), /README \| missing/);
  });
});

test('the same repository always gives the same output', () => {
  withFixture(NODE_REPO, (root) => {
    assert.equal(JSON.stringify(collectFacts(root)), JSON.stringify(collectFacts(root)));
  });
});

test('does not leak the absolute path of the scanned folder', () => {
  withFixture(NODE_REPO, (root) => {
    const out = JSON.stringify(collectFacts(root)) + toMarkdown(collectFacts(root));
    assert.ok(!out.includes(tmpdir()), 'output must not contain the temp path');
  });
});

test('detectLicense recognizes common licenses', () => {
  assert.equal(detectLicense(MIT), 'MIT');
  assert.equal(detectLicense('GNU GENERAL PUBLIC LICENSE\nVersion 3, 29 June 2007'), 'GPL-3.0');
  assert.equal(detectLicense('GNU GENERAL PUBLIC LICENSE\nVersion 2, June 1991'), 'GPL-2.0');
  assert.equal(detectLicense('GNU AFFERO GENERAL PUBLIC LICENSE\nVersion 3'), 'AGPL-3.0');
  assert.equal(detectLicense('Mozilla Public License Version 2.0'), 'MPL-2.0');
  assert.equal(
    detectLicense('Redistribution and use in source and binary forms, with or without modification. Neither the name of the copyright holder'),
    'BSD-3-Clause',
  );
  assert.equal(detectLicense('Redistribution and use in source and binary forms, with or without modification.'), 'BSD-2-Clause');
  assert.equal(detectLicense('This is free and unencumbered software released into the public domain.'), 'Unlicense');
  assert.equal(detectLicense('All rights reserved.'), 'Other');
  assert.equal(detectLicense(''), null);
});

test('parseGitHubUrl handles https, ssh and non-GitHub remotes', () => {
  const want = { owner: 'acme', repo: 'tool', url: 'https://github.com/acme/tool' };
  assert.deepEqual(parseGitHubUrl('https://github.com/acme/tool.git'), want);
  assert.deepEqual(parseGitHubUrl('git@github.com:acme/tool.git'), want);
  assert.deepEqual(parseGitHubUrl('git+https://github.com/acme/tool'), want);
  assert.equal(parseGitHubUrl('https://gitlab.com/acme/tool.git'), null);
  assert.equal(parseGitHubUrl(null), null);
});

test('analyzeReadme separates badges from demo media and skips code blocks', () => {
  const r = analyzeReadme(NODE_REPO['README.md']);
  assert.equal(r.title, 'tiny-cli');
  assert.equal(r.badges, 2);
  assert.deepEqual(r.media, ['docs/demo.gif']);
  assert.equal(r.first_paragraph, 'Turn long shell pipelines into one readable command.');
  assert.ok(!r.headings.includes('# Not a heading'), 'lines inside code blocks are not headings');
  assert.equal(r.code_blocks, 1);
  assert.equal(r.sections.install, true);
  assert.equal(r.sections.quick_start, true);
  assert.equal(r.sections.why, true);
  assert.equal(r.sections.comparison, false);
});

test('analyzeReadme counts GitHub video attachments and <img> tags as demo media', () => {
  const r = analyzeReadme(
    '# x\n\n<p align="center"><img src="assets/screenshot.png" width="600"></p>\n\nhttps://github.com/user-attachments/assets/1234-abcd\n',
  );
  assert.deepEqual(r.media, ['assets/screenshot.png', 'https://github.com/user-attachments/assets/1234-abcd']);
  assert.equal(r.has_gif, false);
});

test('CLI prints JSON by default and markdown with --format md', () => {
  withFixture(NODE_REPO, (root) => {
    const json = JSON.parse(execFileSync(process.execPath, [SCRIPT, root], { encoding: 'utf8' }));
    assert.equal(json.name, 'tiny-cli');
    const md = execFileSync(process.execPath, [SCRIPT, root, '--format', 'md'], { encoding: 'utf8' });
    assert.match(md, /^# Repo facts: tiny-cli/);
    assert.match(md, /\| License \| MIT \(LICENSE\) \|/);
    assert.match(md, /- \[x\] CI/);
    assert.match(md, /- \[ \] CODE_OF_CONDUCT/);
  });
});

test('CLI fails cleanly on a missing folder or an unknown format', () => {
  const missing = spawnSync(process.execPath, [SCRIPT, join(tmpdir(), 'does-not-exist-launch-kit')], { encoding: 'utf8' });
  assert.equal(missing.status, 1);
  assert.match(missing.stderr, /Not a directory/);
  const badFormat = spawnSync(process.execPath, [SCRIPT, '.', '--format', 'xml'], { encoding: 'utf8' });
  assert.equal(badFormat.status, 2);
});
