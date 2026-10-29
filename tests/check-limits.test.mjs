import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { plainLength, xLength, checkTopics, checkMarkdown } from '../skills/launch-kit/scripts/check-limits.mjs';

const SCRIPT = fileURLToPath(new URL('../skills/launch-kit/scripts/check-limits.mjs', import.meta.url));
const FENCE = '```';

test('plainLength counts code points, not UTF-16 units', () => {
  assert.equal(plainLength('abc'), 3);
  assert.equal(plainLength('مرحبا'), 5);
  assert.equal(plainLength('𝔸'), 1);
});

test('xLength weighs links, emoji and wide characters like X does', () => {
  assert.equal(xLength('hello'), 5);
  assert.equal(xLength('see https://example.com/a/very/long/path/that/is/longer/than/23'), 4 + 23);
  assert.equal(xLength('🚀'), 2);
  assert.equal(xLength('👩‍💻'), 2, 'a joined emoji sequence counts once');
  assert.equal(xLength('日本'), 4);
  assert.equal(xLength('café'), 4);
});

test('checkTopics enforces GitHub topic rules', () => {
  assert.deepEqual(checkTopics('claude-code\nopen-source\ncli').problems, []);
  assert.equal(checkTopics('claude-code\nopen-source').count, 2);
  assert.match(checkTopics('Open_Source').problems[0], /lowercase/);
  assert.match(checkTopics('a'.repeat(51)).problems[0], /longer than 50/);
  assert.match(checkTopics(Array.from({ length: 21 }, (_, i) => `t${i}`).join('\n')).problems[0], /21 topics/);
  assert.match(checkTopics('cli\ncli').problems[0], /duplicates/);
});

test('checkMarkdown finds limited blocks and labels them with the heading', () => {
  const md = [
    '# Product Hunt',
    '## Tagline',
    `${FENCE}text limit=10`,
    'short one',
    FENCE,
    '## Description',
    `${FENCE}text limit=5`,
    'too long for five',
    FENCE,
    '## Plain block is ignored',
    `${FENCE}bash`,
    'npm test',
    FENCE,
    '## Topics',
    `${FENCE}text topics`,
    'cli',
    'Bad Topic',
    FENCE,
  ].join('\n');
  const results = checkMarkdown(md);
  assert.equal(results.length, 3);
  assert.deepEqual(
    results.map((r) => [r.label, r.count, r.ok]),
    [
      ['Tagline', 9, true],
      ['Description', 17, false],
      ['Topics', 3, false],
    ],
  );
});

test('checkMarkdown uses X weighting only when the block is marked x', () => {
  const link = 'https://example.com/' + 'p'.repeat(60);
  const md = `${FENCE}text limit=30 x\n${link}\n${FENCE}\n${FENCE}text limit=30\n${link}\n${FENCE}\n`;
  const [weighted, plain] = checkMarkdown(md);
  assert.equal(weighted.count, 23);
  assert.equal(weighted.ok, true);
  assert.equal(plain.ok, false);
});

test('CLI exits 1 when a block is over its limit and 0 when all fit', () => {
  const dir = mkdtempSync(join(tmpdir(), 'check-limits-'));
  try {
    writeFileSync(join(dir, 'ok.md'), `## A\n${FENCE}text limit=60\nfits\n${FENCE}\n`);
    const ok = spawnSync(process.execPath, [SCRIPT, dir], { encoding: 'utf8' });
    assert.equal(ok.status, 0, ok.stdout);
    assert.match(ok.stdout, /1 block\(s\) checked, 0 over/);

    writeFileSync(join(dir, 'bad.md'), `## B\n${FENCE}text limit=3\ntoo long\n${FENCE}\n`);
    const bad = spawnSync(process.execPath, [SCRIPT, dir], { encoding: 'utf8' });
    assert.equal(bad.status, 1);
    assert.match(bad.stdout, /OVER {2}.*bad\.md:2 {2}B {2}8\/3/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
