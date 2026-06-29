// scripts/export-screenshots.mjs
//
// Runs in GitHub Actions (see .github/workflows/export-screenshots.yml).
// Reads public/screens-manifest.json from the deployed site, captures a full-page
// screenshot of each screen using a real headless browser, and uploads each one to
// the "screenshots" bucket in Supabase Storage, named exactly after its viewName.
//
// Required environment variables (set as GitHub Actions secrets):
//   SUPABASE_URL               — e.g. https://wdagqijnktvnfwzwiukc.supabase.co
//   SUPABASE_SERVICE_ROLE_KEY  — the SERVICE ROLE key (full write access) — never the
//                                 anon/publishable key, and never commit this anywhere.
//
// Optional:
//   BASE_URL — defaults to the production GitHub Pages URL below.

import { chromium } from 'playwright';
import { createClient } from '@supabase/supabase-js';

const BASE_URL = process.env.BASE_URL || 'https://flatfield-collab.github.io/titan-ux';
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = 'screenshots';
const VIEWPORT_WIDTH = 393; // must match the reference width used by the tracker and analysis tool

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function waitForUrl(url, retries = 24, delayMs = 5000) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, { method: 'GET' });
      if (res.ok) return true;
    } catch (e) {
      // ignore and retry — the Pages deploy may still be propagating
    }
    console.log(`Waiting for ${url} to come up... (${i + 1}/${retries})`);
    await new Promise((r) => setTimeout(r, delayMs));
  }
  return false;
}

async function main() {
  console.log('Waiting for site to be live:', BASE_URL);
  const live = await waitForUrl(BASE_URL);
  if (!live) {
    console.error('Site never came up within the retry window — aborting.');
    process.exit(1);
  }

  const manifestUrl = `${BASE_URL}/screens-manifest.json`;
  console.log('Fetching manifest:', manifestUrl);
  const manifestRes = await fetch(manifestUrl);
  if (!manifestRes.ok) {
    console.error(
      `Could not fetch screens-manifest.json (HTTP ${manifestRes.status}). Has the Lovable prompt that adds it been run and deployed yet?`
    );
    process.exit(1);
  }
  const manifest = await manifestRes.json();
  if (!Array.isArray(manifest) || manifest.length === 0) {
    console.error('screens-manifest.json was empty or not an array — nothing to capture.');
    process.exit(1);
  }
  console.log(`Manifest has ${manifest.length} screen(s).`);

  const browser = await chromium.launch();
  const results = [];

  for (const screen of manifest) {
    if (!screen.path || !screen.viewName) {
      console.warn('Skipping malformed manifest entry:', JSON.stringify(screen));
      continue;
    }
    const page = await browser.newPage({ viewport: { width: VIEWPORT_WIDTH, height: 1000 } });
    const sep = screen.path.includes('?') ? '&' : '?';
    const url = `${BASE_URL}${screen.path}${sep}flatten=1`;
    console.log(`Capturing "${screen.viewName}" -> ${url}`);

    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      // Brief settle time for any client-side data fetch / flatten-mode layout shift
      // to finish after networkidle fires.
      await page.waitForTimeout(800);
      const buffer = await page.screenshot({ fullPage: true });

      const objectPath = `${encodeURIComponent(screen.viewName)}.png`;
      const { error } = await supabase.storage.from(BUCKET).upload(objectPath, buffer, {
        contentType: 'image/png',
        upsert: true,
      });

      if (error) {
        console.error(`Upload failed for "${screen.viewName}":`, error.message);
        results.push({ viewName: screen.viewName, ok: false, error: error.message });
      } else {
        console.log(`Uploaded ${objectPath}`);
        results.push({ viewName: screen.viewName, ok: true });
      }
    } catch (e) {
      console.error(`Capture failed for "${screen.viewName}":`, e.message);
      results.push({ viewName: screen.viewName, ok: false, error: e.message });
    } finally {
      await page.close();
    }
  }

  await browser.close();

  const failed = results.filter((r) => !r.ok);
  console.log(`\nDone. ${results.length - failed.length}/${results.length} screen(s) captured successfully.`);
  if (failed.length) {
    console.log('Failed:', failed.map((f) => `${f.viewName} (${f.error})`).join('; '));
    process.exitCode = 1; // surface as a failed run in the Actions tab, without blocking the screens that did succeed
  }
}

main();
