#!/usr/bin/env node
// check-limits.mjs: count characters in the launch pack so nothing is cut off when pasted.
//
//   node check-limits.mjs [launch-dir-or-files...]      (default: ./launch)
//
// It checks fenced blocks whose info string carries a limit:
//
//   ```text limit=60          plain count, in Unicode code points
//   ```text limit=280 x       counted like X/Twitter: every URL = 23, wide characters and emoji = 2
//   ```text topics            GitHub topics, one per line: lowercase, a-z 0-9 and "-", max 50 chars, max 20 topics
//
// Exit code 1 when anything is over its limit or a topic is invalid. Zero dependencies.

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, relative } from 'node:path';
import { pathToFileURL } from 'node:url';

const URL_RE = /https?:\/\/[^\s<>()]+/g;
const X_URL_LENGTH = 23;
// Code points X counts as 1 (twitter-text v3 weighting); everything else counts as 2.
const X_LIGHT = [
  [0x0000, 0x10ff],
  [0x2000, 0x200d],
  [0x2010, 0x201f],
  [0x2032, 0x2037],
];
const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });

export function plainLength(text) {
  return Array.from(text).length;
}

export function xLength(text) {
  let total = 0;
  const rest = text.replace(URL_RE, () => {
    total += X_URL_LENGTH;
    return '';
  });
  for (const { segment } of segmenter.segment(rest)) {
    if (/\p{Extended_Pictographic}/u.test(segment)) {
      total += 2;
      continue;
    }
    for (const ch of segment) {
      const cp = ch.codePointAt(0);
      total += X_LIGHT.some(([lo, hi]) => cp >= lo && cp <= hi) ? 1 : 2;
    }
  }
  return total;
}

export function checkTopics(text) {
  const topics = text.split(/[\s,]+/).filter(Boolean);
  const problems = [];
  if (topics.length > 20) problems.push(`${topics.length} topics (GitHub allows 20)`);
  for (const t of topics) {
    if (t.length > 50) problems.push(`"${t}" is longer than 50 characters`);
    else if (!/^[a-z0-9][a-z0-9-]*$/.test(t)) problems.push(`"${t}" must be lowercase letters, numbers and hyphens`);
  }
  const dupes = topics.filter((t, i) => topics.indexOf(t) !== i);
  if (dupes.length) problems.push(`duplicates: ${[...new Set(dupes)].join(', ')}`);
  return { count: topics.length, problems };
}

// Returns one entry per checked block: { line, label, kind, count, limit, ok, problems }.
// The label is the nearest heading, plus a bold line under it ("**1/ Hook**") when there is one.
export function checkMarkdown(markdown) {
  const lines = markdown.split(/\r?\n/);
  const results = [];
  let heading = '';
  let bold = '';
  for (let i = 0; i < lines.length; i++) {
    const h = lines[i].match(/^#{1,6}\s+(.+?)\s*$/);
    if (h) {
      heading = h[1];
      bold = '';
      continue;
    }
    const b = lines[i].match(/^\*\*(.+?)\*\*/);
    if (b) {
      bold = b[1];
      continue;
    }
    const open = lines[i].match(/^(\s*)(```+|~~~+)\s*(\S*)(.*)$/);
    if (!open) continue;
    const info = `${open[3]} ${open[4]}`;
    const limit = info.match(/\blimit=(\d+)/);
    const topics = /(^|\s)topics(\s|$)/.test(info);
    // Find the closing fence and collect the body.
    const body = [];
    let j = i + 1;
    while (j < lines.length && !lines[j].trim().startsWith(open[2])) body.push(lines[j++]);
    const text = body.join('\n').replace(/\s+$/, '');
    const label = [heading, bold].filter(Boolean).join(' › ');
    if (limit) {
      const max = Number(limit[1]);
      const counter = /(^|\s)x(\s|$)/.test(open[4]) ? 'x' : 'plain';
      const count = counter === 'x' ? xLength(text) : plainLength(text);
      results.push({ line: i + 1, label, kind: counter, count, limit: max, ok: count <= max, problems: [] });
    } else if (topics) {
      const { count, problems } = checkTopics(text);
      results.push({ line: i + 1, label, kind: 'topics', count, limit: 20, ok: problems.length === 0, problems });
    }
    i = j;
  }
  return results;
}

function markdownFiles(target) {
  const st = statSync(target);
  if (st.isFile()) return [target];
  return readdirSync(target, { withFileTypes: true })
    .filter((e) => e.isFile() && /\.md$/i.test(e.name))
    .map((e) => join(target, e.name))
    .sort();
}

function main(argv) {
  const targets = argv.slice(2).filter((a) => !a.startsWith('-'));
  if (argv.includes('--help') || argv.includes('-h')) {
    process.stdout.write('Usage: node check-limits.mjs [launch-dir-or-files...]\n');
    return 0;
  }
  let files;
  try {
    files = (targets.length ? targets : ['launch']).flatMap((t) => markdownFiles(resolve(t)));
  } catch (err) {
    process.stderr.write(`check-limits: ${err.message}\n`);
    return 1;
  }
  let failed = 0;
  let checked = 0;
  for (const file of files) {
    const name = relative(process.cwd(), file) || file;
    for (const r of checkMarkdown(readFileSync(file, 'utf8'))) {
      checked += 1;
      if (!r.ok) failed += 1;
      const what = r.kind === 'topics' ? `${r.count} topics` : `${r.count}/${r.limit}${r.kind === 'x' ? ' (X count)' : ''}`;
      process.stdout.write(`${r.ok ? 'ok  ' : 'OVER'}  ${name}:${r.line}  ${r.label || '(no heading)'}  ${what}\n`);
      for (const p of r.problems) process.stdout.write(`      - ${p}\n`);
    }
  }
  process.stdout.write(`\n${checked} block(s) checked, ${failed} over the limit or invalid.\n`);
  return failed ? 1 : 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  process.exitCode = main(process.argv);
}
