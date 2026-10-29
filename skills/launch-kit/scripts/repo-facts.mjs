#!/usr/bin/env node
// repo-facts.mjs: collect launch-relevant facts about a repository, deterministically.
//
//   node repo-facts.mjs [repo-dir] [--format json|md] [--out file]
//
// Zero dependencies. It reads files only: it never runs git, never touches the network,
// and writes nothing except the --out file (UTF-8, unlike PowerShell 5.1's `>` redirect).
// The same repository always gives the same output.

import { readFileSync, readdirSync, statSync, existsSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, basename, extname, resolve, isAbsolute, dirname } from 'node:path';
import { pathToFileURL } from 'node:url';

const MAX_FILES = 50000;

const SKIP_DIRS = new Set([
  '.git', 'node_modules', 'bower_components', 'vendor', 'third_party', 'dist', 'build', 'out',
  'target', '.next', '.nuxt', '.svelte-kit', '.turbo', '.cache', '.parcel-cache', 'coverage',
  '.venv', 'venv', '__pycache__', '.tox', '.mypy_cache', '.pytest_cache', 'site-packages',
  '.gradle', 'Pods', 'DerivedData', '.idea', '.vscode', '.yarn', '.pnpm-store', '.terraform',
]);

const LANGUAGES = {
  '.js': 'JavaScript', '.mjs': 'JavaScript', '.cjs': 'JavaScript', '.jsx': 'JavaScript',
  '.ts': 'TypeScript', '.tsx': 'TypeScript', '.mts': 'TypeScript', '.cts': 'TypeScript',
  '.py': 'Python', '.rb': 'Ruby', '.go': 'Go', '.rs': 'Rust', '.java': 'Java',
  '.kt': 'Kotlin', '.kts': 'Kotlin', '.swift': 'Swift', '.m': 'Objective-C', '.mm': 'Objective-C',
  '.c': 'C', '.h': 'C', '.cc': 'C++', '.cpp': 'C++', '.cxx': 'C++', '.hpp': 'C++', '.hh': 'C++',
  '.cs': 'C#', '.fs': 'F#', '.php': 'PHP', '.scala': 'Scala', '.dart': 'Dart',
  '.ex': 'Elixir', '.exs': 'Elixir', '.erl': 'Erlang', '.hs': 'Haskell', '.lua': 'Lua',
  '.r': 'R', '.jl': 'Julia', '.clj': 'Clojure', '.zig': 'Zig', '.nim': 'Nim', '.ml': 'OCaml',
  '.pl': 'Perl', '.groovy': 'Groovy', '.sol': 'Solidity', '.elm': 'Elm', '.tf': 'HCL',
  '.sh': 'Shell', '.bash': 'Shell', '.zsh': 'Shell', '.ps1': 'PowerShell',
  '.vue': 'Vue', '.svelte': 'Svelte', '.astro': 'Astro', '.html': 'HTML',
  '.css': 'CSS', '.scss': 'SCSS', '.sass': 'SCSS', '.less': 'Less', '.sql': 'SQL',
};

const IMAGE_EXT = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.avif']);
const VIDEO_EXT = new Set(['.mp4', '.webm', '.mov']);

const CI_PROVIDERS = [
  [/^\.github\/workflows\/[^/]+\.ya?ml$/, 'GitHub Actions'],
  [/^\.gitlab-ci\.ya?ml$/, 'GitLab CI'],
  [/^\.circleci\/config\.ya?ml$/, 'CircleCI'],
  [/^\.travis\.ya?ml$/, 'Travis CI'],
  [/^azure-pipelines\.ya?ml$/, 'Azure Pipelines'],
  [/^bitbucket-pipelines\.ya?ml$/, 'Bitbucket Pipelines'],
  [/^Jenkinsfile$/, 'Jenkins'],
  [/^\.buildkite\/.+\.ya?ml$/, 'Buildkite'],
  [/^\.woodpecker(\.ya?ml|\/.+\.ya?ml)$/, 'Woodpecker'],
  [/^\.drone\.ya?ml$/, 'Drone'],
];

const TEST_DIRS = new Set(['test', 'tests', '__tests__', 'spec', 'specs']);
const TEST_FILE = [
  /\.(test|spec)\.[cm]?[jt]sx?$/,
  /_test\.(go|py|rb|exs?)$/,
  /(^|\/)test_[^/]+\.py$/,
  /_spec\.rb$/,
  /Tests?\.(java|kt|cs|swift|scala)$/,
];
const NPM_DEFAULT_TEST = 'echo "Error: no test specified" && exit 1';

// Community health files: GitHub looks in the root, .github/ and docs/.
const COMMUNITY = {
  contributing: /^contributing(\.(md|rst|txt))?$/i,
  code_of_conduct: /^code[_-]of[_-]conduct(\.(md|rst|txt))?$/i,
  security: /^security(\.(md|rst|txt))?$/i,
  support: /^support(\.(md|rst|txt))?$/i,
  codeowners: /^codeowners$/i,
  pr_template: /^pull_request_template(\.md)?$/i,
};

// ---------- small helpers ----------

const byName = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

function readText(path) {
  try {
    return readFileSync(path, 'utf8').replace(/^﻿/, '');
  } catch {
    return null;
  }
}

function readJson(path) {
  const text = readText(path);
  if (text == null) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function isDir(path) {
  try {
    return statSync(path).isDirectory();
  } catch {
    return false;
  }
}

// The common subset of the root .gitignore: `name`, `dir/`, `/anchored`, `*` and `**` globs.
// Negations (`!keep`) are not supported; generated files are what matter here.
export function gitignoreMatcher(text) {
  const rules = [];
  for (const raw of (text || '').split(/\r?\n/)) {
    let line = raw.trim();
    if (!line || line.startsWith('#') || line.startsWith('!')) continue;
    const dirOnly = line.endsWith('/');
    line = line.replace(/\/+$/, '');
    const anchored = line.includes('/');
    line = line.replace(/^\//, '');
    const body = line
      .split('**')
      .map((part) => part.replace(/[.+^${}()|\\]/g, '\\$&').replace(/\*/g, '[^/]*').replace(/\?/g, '[^/]'))
      .join('.*');
    rules.push({ re: new RegExp(anchored ? `^${body}$` : `(^|/)${body}$`), dirOnly });
  }
  return (relPath, isDirectory) => rules.some((r) => (!r.dirOnly || isDirectory) && r.re.test(relPath));
}

function walk(root) {
  const files = [];
  let truncated = false;
  const ignored = gitignoreMatcher(readText(join(root, '.gitignore')));
  const visit = (dir, rel) => {
    let entries;
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    entries.sort((a, b) => byName(a.name, b.name));
    for (const entry of entries) {
      if (files.length >= MAX_FILES) {
        truncated = true;
        return;
      }
      const relPath = rel ? `${rel}/${entry.name}` : entry.name;
      if (ignored(relPath, entry.isDirectory())) continue;
      if (entry.isDirectory()) {
        if (!SKIP_DIRS.has(entry.name)) visit(join(dir, entry.name), relPath);
      } else if (entry.isFile()) {
        let size = 0;
        try {
          size = statSync(join(dir, entry.name)).size;
        } catch {}
        files.push({ path: relPath, size });
      }
    }
  };
  visit(root, '');
  return { files, truncated };
}

// Tiny TOML reader: enough for `key = "value"` and `key = ["a", "b"]` inside one [section].
function tomlSection(text, section) {
  const out = [];
  let inside = false;
  for (const line of text.split(/\r?\n/)) {
    const header = line.match(/^\s*\[\[?([^\]]+)\]\]?\s*$/);
    if (header) {
      inside = header[1].trim() === section;
      continue;
    }
    if (inside) out.push(line);
  }
  return out.length ? out.join('\n') : null;
}

function tomlValue(body, key) {
  if (!body) return null;
  const str = body.match(new RegExp(`^\\s*${key}\\s*=\\s*["']([^"'\\n]*)["']`, 'm'));
  if (str) return str[1];
  const arr = body.match(new RegExp(`^\\s*${key}\\s*=\\s*\\[([^\\]]*)\\]`, 'm'));
  if (arr) return [...arr[1].matchAll(/["']([^"']+)["']/g)].map((m) => m[1]);
  const table = body.match(new RegExp(`^\\s*${key}\\s*=\\s*\\{[^}]*text\\s*=\\s*["']([^"']+)["']`, 'm'));
  if (table) return table[1];
  return null;
}

// ---------- detectors ----------

export function detectLicense(text) {
  if (!text) return null;
  const t = text.replace(/\s+/g, ' ');
  if (/GNU AFFERO GENERAL PUBLIC LICENSE/i.test(t)) return 'AGPL-3.0';
  if (/GNU LESSER GENERAL PUBLIC LICENSE/i.test(t)) return /Version 2\.1/i.test(t) ? 'LGPL-2.1' : 'LGPL-3.0';
  if (/GNU GENERAL PUBLIC LICENSE/i.test(t)) return /Version 2,/i.test(t) ? 'GPL-2.0' : 'GPL-3.0';
  if (/Apache License/i.test(t) && /Version 2\.0/i.test(t)) return 'Apache-2.0';
  if (/Mozilla Public License,? (Version|v\.?) ?2\.0/i.test(t)) return 'MPL-2.0';
  if (/free and unencumbered software released into the public domain/i.test(t)) return 'Unlicense';
  if (/CC0 1\.0 Universal/i.test(t)) return 'CC0-1.0';
  if (/Permission to use, copy, modify, and\/or distribute this software for any purpose/i.test(t)) return 'ISC';
  if (/Permission is hereby granted, free of charge/i.test(t)) return 'MIT';
  if (/Redistribution and use in source and binary forms/i.test(t)) {
    return /Neither the name/i.test(t) ? 'BSD-3-Clause' : 'BSD-2-Clause';
  }
  if (/Boost Software License/i.test(t)) return 'BSL-1.0';
  return 'Other';
}

export function parseGitHubUrl(url) {
  if (!url) return null;
  const m = String(url).trim().match(/github\.com[:/]+([^/\s:]+)\/([^/\s]+?)(?:\.git)?\/?$/i);
  if (!m) return null;
  return { owner: m[1], repo: m[2], url: `https://github.com/${m[1]}/${m[2]}` };
}

const BADGE = /shields\.io|badgen\.net|badge\.fury\.io|badge|codecov\.io|coveralls\.io|travis-ci\.(org|com)/i;

function stripInline(md) {
  return md
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]*)\]\[[^\]]*\]/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[*_`~]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function analyzeReadme(text) {
  const lines = text.split(/\r?\n/);
  const headings = [];
  const media = [];
  let badges = 0;
  let codeBlocks = 0;
  let firstCodeLine = null;
  let firstMediaLine = null;
  let fence = null;
  const prose = [];

  lines.forEach((line, i) => {
    const fenceMatch = line.match(/^\s*(```+|~~~+)/);
    if (fenceMatch) {
      if (!fence) {
        fence = fenceMatch[1][0];
        codeBlocks += 1;
        if (firstCodeLine == null) firstCodeLine = i + 1;
      } else if (fenceMatch[1][0] === fence) {
        fence = null;
      }
      prose.push('');
      return;
    }
    if (fence) {
      prose.push('');
      return;
    }
    const h = line.match(/^\s{0,3}(#{1,6})\s+(.+?)\s*#*\s*$/);
    if (h) headings.push({ level: h[1].length, text: stripInline(h[2]) });

    const urls = [
      ...[...line.matchAll(/!\[[^\]]*\]\(\s*<?([^)\s>]+)/g)].map((m) => m[1]),
      ...[...line.matchAll(/<(?:img|video|source)\b[^>]*\bsrc=["']([^"']+)["']/gi)].map((m) => m[1]),
    ];
    const bare = line.trim().match(/^https:\/\/github\.com\/user-attachments\/assets\/\S+$/);
    if (bare) urls.push(bare[0]);
    for (const url of urls) {
      if (BADGE.test(url)) {
        badges += 1;
      } else {
        media.push(url);
        if (firstMediaLine == null) firstMediaLine = i + 1;
      }
    }
    prose.push(h ? '' : line);
  });

  // First real paragraph of prose: skips badge rows, image-only lines and raw HTML.
  let firstParagraph = null;
  let paragraph = [];
  const flush = () => {
    const text = stripInline(paragraph.join(' '));
    paragraph = [];
    if (!firstParagraph && text.split(' ').filter((w) => /\p{L}/u.test(w)).length >= 3) {
      firstParagraph = text.length > 300 ? `${text.slice(0, 297)}...` : text;
    }
  };
  for (const line of prose) {
    const trimmed = line.trim();
    if (!trimmed) {
      flush();
      continue;
    }
    if (/^(\[?!\[|<\/?\w|\|)/.test(trimmed) || /^[-=*_]{3,}$/.test(trimmed)) continue;
    paragraph.push(trimmed.replace(/^>\s?/, ''));
  }
  flush();

  const words = prose.join(' ').replace(/<[^>]+>/g, ' ').match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu) || [];
  const has = (re) => headings.some((h) => re.test(h.text));
  const h1 = headings.find((h) => h.level === 1);

  return {
    title: h1 ? h1.text : null,
    first_paragraph: firstParagraph,
    word_count: words.length,
    headings: headings.map((h) => `${'#'.repeat(h.level)} ${h.text}`),
    badges,
    media,
    has_gif: media.some((u) => /\.gif([?#]|$)/i.test(u)),
    code_blocks: codeBlocks,
    first_code_block_line: firstCodeLine,
    first_media_line: firstMediaLine,
    sections: {
      install: has(/install|setup|set up|getting started/i),
      quick_start: has(/quick ?start|getting started|usage|how to use|example|tl;?dr/i),
      why: has(/\bwhy\b|motivation|background|the problem/i),
      features: has(/features|what it does|what you get|highlights/i),
      comparison: has(/compar|alternatives?|\bvs\.?(\s|$)|versus|similar projects/i),
      faq: has(/\bfaq\b|questions/i),
      contributing: has(/contribut/i),
      license: has(/licen[cs]e/i),
    },
  };
}

// Never print credentials that sometimes live in remote URLs (https://user:token@host/...).
function redactUrl(url) {
  return url.replace(/^(\w+:\/\/)[^@/\s]+@/, '$1');
}

function readGit(root) {
  let gitDir = join(root, '.git');
  const none = { is_repo: false, branch: null, remotes: {}, tags: 0 };
  if (!existsSync(gitDir)) return none;
  let commonDir = gitDir;
  if (!isDir(gitDir)) {
    // Worktrees and submodules: .git is a file that points at the real git dir.
    const pointer = (readText(gitDir) || '').match(/^gitdir:\s*(.+)$/m);
    if (!pointer) return none;
    const target = pointer[1].trim();
    gitDir = isAbsolute(target) ? target : resolve(root, target);
    const common = readText(join(gitDir, 'commondir'));
    commonDir = common ? resolve(gitDir, common.trim()) : gitDir;
  }

  const head = readText(join(gitDir, 'HEAD')) || '';
  const branch = head.match(/^ref:\s*refs\/heads\/(.+)$/m)?.[1].trim() ?? null;

  const remotes = {};
  let current = null;
  for (const line of (readText(join(commonDir, 'config')) || '').split(/\r?\n/)) {
    const section = line.match(/^\s*\[remote\s+"([^"]+)"\]\s*$/);
    if (section) {
      current = section[1];
      continue;
    }
    if (/^\s*\[/.test(line)) current = null;
    const url = line.match(/^\s*url\s*=\s*(.+?)\s*$/);
    if (current && url) remotes[current] = redactUrl(url[1]);
  }

  const tags = new Set();
  const visit = (dir, prefix) => {
    let entries = [];
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch {}
    for (const e of entries) {
      if (e.isDirectory()) visit(join(dir, e.name), `${prefix}${e.name}/`);
      else tags.add(`${prefix}${e.name}`);
    }
  };
  visit(join(commonDir, 'refs', 'tags'), '');
  for (const line of (readText(join(commonDir, 'packed-refs')) || '').split(/\r?\n/)) {
    const m = line.match(/^[0-9a-f]{40,64} refs\/tags\/(.+)$/);
    if (m) tags.add(m[1]);
  }

  const sorted = {};
  for (const key of Object.keys(remotes).sort(byName)) sorted[key] = remotes[key];
  return { is_repo: true, branch, remotes: sorted, tags: tags.size };
}

function readManifests(root, has, rootFiles) {
  const found = [];
  const add = (manifest, ecosystem, fields = {}) => found.push({ manifest, ecosystem, ...fields });

  const pkg = readJson(join(root, 'package.json'));
  if (pkg) {
    const testScript = pkg.scripts?.test && pkg.scripts.test !== NPM_DEFAULT_TEST;
    add('package.json', 'npm', {
      name: pkg.name ?? null,
      version: pkg.version ?? null,
      description: pkg.description ?? null,
      license: typeof pkg.license === 'string' ? pkg.license : pkg.license?.type ?? null,
      keywords: Array.isArray(pkg.keywords) ? pkg.keywords : [],
      homepage: pkg.homepage ?? null,
      repository: typeof pkg.repository === 'string' ? pkg.repository : pkg.repository?.url ?? null,
      private: pkg.private === true,
      cli: Boolean(pkg.bin),
      test_command: testScript ? 'npm test' : null,
    });
  }

  const pyproject = readText(join(root, 'pyproject.toml'));
  if (pyproject) {
    const project = tomlSection(pyproject, 'project') || tomlSection(pyproject, 'tool.poetry');
    const keywords = tomlValue(project, 'keywords');
    add('pyproject.toml', 'PyPI', {
      name: tomlValue(project, 'name'),
      version: tomlValue(project, 'version'),
      description: tomlValue(project, 'description'),
      license: tomlValue(project, 'license'),
      keywords: Array.isArray(keywords) ? keywords : [],
      cli: Boolean(tomlSection(pyproject, 'project.scripts') || tomlSection(pyproject, 'tool.poetry.scripts')),
      test_command: /pytest/.test(pyproject) ? 'pytest' : null,
    });
  } else if (has('setup.py') || has('setup.cfg')) {
    const setup = readText(join(root, 'setup.py')) || '';
    const cfg = tomlSection(readText(join(root, 'setup.cfg')) || '', 'metadata');
    const name = setup.match(/\bname\s*=\s*["']([^"']+)["']/)?.[1] ?? cfg?.match(/^\s*name\s*=\s*(\S+)/m)?.[1] ?? null;
    add(has('setup.py') ? 'setup.py' : 'setup.cfg', 'PyPI', { name });
  }

  const cargo = readText(join(root, 'Cargo.toml'));
  if (cargo) {
    const pack = tomlSection(cargo, 'package');
    const keywords = tomlValue(pack, 'keywords');
    add('Cargo.toml', 'crates.io', {
      name: tomlValue(pack, 'name'),
      version: tomlValue(pack, 'version'),
      description: tomlValue(pack, 'description'),
      license: tomlValue(pack, 'license'),
      keywords: Array.isArray(keywords) ? keywords : [],
      homepage: tomlValue(pack, 'homepage'),
      repository: tomlValue(pack, 'repository'),
      cli: has('src/main.rs') || /^\s*\[\[bin\]\]/m.test(cargo),
      test_command: 'cargo test',
    });
  }

  const gomod = readText(join(root, 'go.mod'));
  if (gomod) {
    const module = gomod.match(/^module\s+(\S+)/m)?.[1] ?? null;
    add('go.mod', 'Go modules', {
      name: module ? module.split('/').pop() : null,
      cli: has('main.go') || has('cmd/', true),
      test_command: 'go test ./...',
    });
  }

  const composer = readJson(join(root, 'composer.json'));
  if (composer) {
    add('composer.json', 'Packagist', {
      name: composer.name ?? null,
      description: composer.description ?? null,
      license: Array.isArray(composer.license) ? composer.license.join(' OR ') : composer.license ?? null,
      keywords: Array.isArray(composer.keywords) ? composer.keywords : [],
    });
  }

  const pubspec = readText(join(root, 'pubspec.yaml'));
  if (pubspec) {
    const top = (key) => pubspec.match(new RegExp(`^${key}:\\s*["']?([^"'\\n#]+?)["']?\\s*$`, 'm'))?.[1] ?? null;
    add('pubspec.yaml', 'pub.dev', { name: top('name'), version: top('version'), description: top('description') });
  }

  const denoFile = ['deno.json', 'jsr.json'].find((f) => has(f));
  const deno = denoFile ? readJson(join(root, denoFile)) : null;
  if (deno) add(denoFile, 'JSR', { name: deno.name ?? null, version: deno.version ?? null });

  const gemspec = rootFiles.find((f) => f.endsWith('.gemspec'));
  if (gemspec) {
    const spec = readText(join(root, gemspec)) || '';
    add(gemspec, 'RubyGems', {
      name: spec.match(/\.name\s*=\s*["']([^"']+)["']/)?.[1] ?? null,
      description: spec.match(/\.summary\s*=\s*["']([^"']+)["']/)?.[1] ?? null,
      license: spec.match(/\.license\s*=\s*["']([^"']+)["']/)?.[1] ?? null,
    });
  }

  const pom = readText(join(root, 'pom.xml'));
  if (pom) {
    const body = pom.replace(/<parent>[\s\S]*?<\/parent>/, '').replace(/<dependencies>[\s\S]*<\/dependencies>/, '');
    add('pom.xml', 'Maven', {
      name: body.match(/<artifactId>([^<]+)<\/artifactId>/)?.[1] ?? null,
      description: body.match(/<description>([^<]+)<\/description>/)?.[1]?.trim() ?? null,
    });
  }

  const gradle = ['build.gradle', 'build.gradle.kts'].find((f) => has(f));
  if (gradle) add(gradle, 'Gradle');
  const csproj = rootFiles.find((f) => f.endsWith('.csproj'));
  if (csproj) add(csproj, 'NuGet');
  if (has('Package.swift')) add('Package.swift', 'Swift Package Manager');
  if (has('mix.exs')) add('mix.exs', 'Hex');

  return found;
}

// ---------- main collector ----------

export function collectFacts(dir = '.') {
  const root = resolve(dir);
  if (!isDir(root)) throw new Error(`Not a directory: ${dir}`);

  const { files, truncated } = walk(root);
  const paths = files.map((f) => f.path);
  const pathSet = new Set(paths);
  const rootFiles = paths.filter((p) => !p.includes('/'));
  const has = (p, isDirectory = false) => (isDirectory ? paths.some((x) => x.startsWith(p)) : pathSet.has(p));
  const findIn = (prefixes, re) =>
    prefixes
      .map((prefix) => paths.find((p) => p.startsWith(prefix) && !p.slice(prefix.length).includes('/') && re.test(p.slice(prefix.length))))
      .find(Boolean) || null;

  // Languages, by bytes like GitHub; prose and data files are left out.
  const bytes = {};
  for (const f of files) {
    const lang = LANGUAGES[extname(f.path).toLowerCase()];
    if (lang) bytes[lang] = (bytes[lang] || 0) + f.size;
  }
  const total = Object.values(bytes).reduce((a, b) => a + b, 0);
  const breakdown = Object.entries(bytes)
    .sort((a, b) => b[1] - a[1] || byName(a[0], b[0]))
    .map(([language, size]) => ({ language, bytes: size, percent: total ? Math.round((size / total) * 1000) / 10 : 0 }));

  // README: root first, then .github/ and docs/.
  const readmePath = findIn(['', '.github/', 'docs/'], /^readme(\.(md|markdown|mdx|rst|txt))?$/i);
  const readmeText = readmePath ? readText(join(root, readmePath)) : null;
  const readme = readmeText != null ? { path: readmePath, ...analyzeReadme(readmeText) } : null;

  const manifests = readManifests(root, has, rootFiles);
  const first = (key) => manifests.map((m) => m[key]).find((v) => v != null && v !== '') ?? null;

  const git = readGit(root);
  const github =
    parseGitHubUrl(git.remotes.origin) ||
    Object.values(git.remotes).map(parseGitHubUrl).find(Boolean) ||
    manifests.map((m) => parseGitHubUrl(m.repository)).find(Boolean) ||
    null;

  // License: the file wins; the manifest field is kept so a mismatch is visible.
  const licenseFile = rootFiles.find((p) => /^(un)?licen[cs]e([-._].*)?$|^copying(\..*)?$/i.test(p)) || null;
  const license = {
    file: licenseFile,
    spdx: licenseFile ? detectLicense(readText(join(root, licenseFile))) : first('license'),
    manifest: first('license'),
  };

  const testFiles = paths.filter(
    (p) =>
      LANGUAGES[extname(p).toLowerCase()] &&
      (p.split('/').slice(0, -1).some((seg) => TEST_DIRS.has(seg.toLowerCase())) || TEST_FILE.some((re) => re.test(p))),
  );
  const tests = {
    has_tests: testFiles.length > 0,
    test_files: testFiles.length,
    command: testFiles.length ? first('test_command') : null,
  };

  const ciFiles = paths.filter((p) => CI_PROVIDERS.some(([re]) => re.test(p)));
  const ci = {
    has_ci: ciFiles.length > 0,
    providers: [...new Set(ciFiles.map((p) => CI_PROVIDERS.find(([re]) => re.test(p))[1]))].sort(byName),
    files: ciFiles,
  };

  // Demo media: images or videos shown in the README, plus demo-looking files in the repo.
  const repoMedia = paths.filter((p) => {
    const ext = extname(p).toLowerCase();
    return (IMAGE_EXT.has(ext) || VIDEO_EXT.has(ext)) && /demo|screenshot|screencast|preview|showcase/i.test(p);
  });
  const demo = {
    has_demo_media: Boolean(readme?.media.length),
    readme_media: readme ? readme.media.slice(0, 10) : [],
    has_gif: Boolean(readme?.has_gif),
    repo_media_files: repoMedia.slice(0, 10),
  };

  const community = {};
  for (const [key, re] of Object.entries(COMMUNITY)) community[key] = findIn(['', '.github/', 'docs/'], re);
  community.changelog = rootFiles.find((p) => /^(changelog|changes|history|news)(\.(md|rst|txt))?$/i.test(p)) || null;
  community.issue_templates = paths.filter((p) => /^\.github\/ISSUE_TEMPLATE(\/|\.md$)/i.test(p)).length;
  community.funding = pathSet.has('.github/FUNDING.yml') ? '.github/FUNDING.yml' : null;

  const topLevel = [...new Set(paths.map((p) => (p.includes('/') ? `${p.split('/')[0]}/` : p)))].sort(byName);

  return {
    schema: 1,
    directory: basename(root),
    name: first('name') || github?.repo || basename(root),
    description: first('description'),
    project_version: first('version'),
    keywords: [...new Set(manifests.flatMap((m) => m.keywords || []).map((k) => String(k).toLowerCase()))],
    homepage: first('homepage'),
    github,
    git,
    languages: { primary: breakdown[0]?.language ?? null, breakdown: breakdown.slice(0, 6) },
    ecosystems: manifests.map((m) => ({ manifest: m.manifest, ecosystem: m.ecosystem, name: m.name ?? null, private: m.private ?? false })),
    has_cli: manifests.some((m) => m.cli),
    license,
    readme,
    tests,
    ci,
    demo,
    community,
    docs: {
      has_docs_dir: has('docs/', true) || has('documentation/', true) || has('website/', true),
      has_examples_dir: has('examples/', true) || has('example/', true) || has('demo/', true) || has('samples/', true),
      has_dockerfile: pathSet.has('Dockerfile') || rootFiles.some((p) => /^(docker-)?compose\.ya?ml$/.test(p)),
    },
    files: { count: files.length, truncated, top_level: topLevel.slice(0, 40) },
  };
}

// ---------- markdown output ----------

const cell = (v) => String(v).replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
const yes = (v) => (v ? 'yes' : 'no');
const box = (v) => (v ? '[x]' : '[ ]');
const num = (n) => Number(n).toLocaleString('en-US');

export function toMarkdown(f) {
  const r = f.readme;
  const c = f.community;
  const rows = [
    ['Name', f.name],
    ['Description (manifest)', f.description || '—'],
    ['README first paragraph', r?.first_paragraph || '—'],
    ['GitHub', f.github ? `${f.github.owner}/${f.github.repo}` : '— (no GitHub remote)'],
    ['Version', f.project_version || '—'],
    ['Primary language', f.languages.primary || '—'],
    ['Languages', f.languages.breakdown.map((l) => `${l.language} ${l.percent}%`).join(', ') || 'none detected'],
    ['Ecosystems', f.ecosystems.map((e) => `${e.ecosystem} (${e.manifest}${e.private ? ', private' : ''})`).join(', ') || '—'],
    ['CLI entry point', yes(f.has_cli)],
    ['License', f.license.spdx ? `${f.license.spdx} (${f.license.file || 'manifest only'})` : 'none'],
    ['Tests', f.tests.has_tests ? `yes, ${num(f.tests.test_files)} files${f.tests.command ? ` (\`${f.tests.command}\`)` : ''}` : 'no'],
    ['CI', f.ci.has_ci ? f.ci.providers.join(', ') : 'no'],
    ['Demo media in README', f.demo.has_demo_media ? `yes, ${f.demo.readme_media.length}${f.demo.has_gif ? ' (has a GIF)' : ''}` : 'no'],
    ['README', r ? `${r.path}: ${num(r.word_count)} words, ${r.headings.length} headings, ${r.badges} badges, ${r.code_blocks} code blocks` : 'missing'],
    ['Release tags', num(f.git.tags)],
    ['Keywords', f.keywords.join(', ') || '—'],
    ['Files scanned', `${num(f.files.count)}${f.files.truncated ? ' (truncated)' : ''}`],
  ];
  const checks = [
    [Boolean(f.license.file), 'LICENSE file'],
    [Boolean(r), 'README'],
    [Boolean(r?.sections.install), 'README: install section'],
    [Boolean(r?.sections.quick_start), 'README: quick start or usage section'],
    [Boolean(r?.sections.why), 'README: "why" section'],
    [f.demo.has_demo_media, 'README: demo image, GIF or video'],
    [Boolean(r?.first_media_line && r.first_media_line <= 40), 'README: demo media in the first 40 lines'],
    [Boolean(r?.badges), 'README: badges'],
    [f.tests.has_tests, 'Tests'],
    [f.ci.has_ci, 'CI'],
    [Boolean(c.contributing), 'CONTRIBUTING'],
    [Boolean(c.code_of_conduct), 'CODE_OF_CONDUCT'],
    [Boolean(c.security), 'SECURITY policy'],
    [c.issue_templates > 0, 'Issue templates'],
    [Boolean(c.pr_template), 'Pull request template'],
    [Boolean(c.changelog), 'CHANGELOG'],
    [f.git.tags > 0, 'At least one release tag'],
  ];

  return [
    `# Repo facts: ${f.name}`,
    '',
    '_Generated by `repo-facts.mjs` from the files on disk. Re-run it instead of editing this file._',
    '',
    '| Fact | Value |',
    '| --- | --- |',
    ...rows.map(([k, v]) => `| ${cell(k)} | ${cell(v)} |`),
    '',
    '## Launch readiness',
    '',
    ...checks.map(([ok, label]) => `- ${box(ok)} ${label}`),
    '',
    "_Community files can also come from the owner's `.github` repository. Check the repo's Insights → Community standards page on GitHub before adding duplicates._",
    ...(r ? ['', '## README outline', '', ...r.headings.map((h) => `- \`${h}\``)] : []),
    '',
  ].join('\n');
}

// ---------- CLI ----------

function main(argv) {
  const args = argv.slice(2);
  if (args.includes('--help') || args.includes('-h')) {
    process.stdout.write('Usage: node repo-facts.mjs [repo-dir] [--format json|md] [--out file]\n');
    return 0;
  }
  let format = 'json';
  let out = null;
  const dirs = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--format') format = args[++i];
    else if (args[i].startsWith('--format=')) format = args[i].slice('--format='.length);
    else if (args[i] === '--out') out = args[++i];
    else if (args[i].startsWith('--out=')) out = args[i].slice('--out='.length);
    else if (args[i] === '--md') format = 'md';
    else if (args[i] === '--json') format = 'json';
    else dirs.push(args[i]);
  }
  if (!['json', 'md'].includes(format)) {
    process.stderr.write(`repo-facts: unknown format "${format}" (use json or md)\n`);
    return 2;
  }
  let facts;
  try {
    facts = collectFacts(dirs[0] || '.');
  } catch (err) {
    process.stderr.write(`repo-facts: ${err.message}\n`);
    return 1;
  }
  const text = format === 'md' ? toMarkdown(facts) : `${JSON.stringify(facts, null, 2)}\n`;
  if (!out) {
    process.stdout.write(text);
    return 0;
  }
  try {
    mkdirSync(dirname(resolve(out)), { recursive: true });
    writeFileSync(out, text, 'utf8');
  } catch (err) {
    process.stderr.write(`repo-facts: cannot write ${out}: ${err.message}\n`);
    return 1;
  }
  process.stdout.write(`Wrote ${out}\n`);
  return 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  process.exitCode = main(process.argv);
}
