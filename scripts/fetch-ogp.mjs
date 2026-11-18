#!/usr/bin/env node
// 作品のリンク先から OGP 画像をダウンロードして src/generated/ogp/<slug>.<ext> に置く（git 管理外）。
// npm run build / npm run dev の前に自動で動く。サイトは取れた画像を優先し、なければ手元の image を使う。
//
// 取りに行かないもの:
//   - ogp: false の作品
//   - status: ended（公開終了）の作品
//   - Bluesky / X など、どのページでも同じような画像（アイコンやロゴ）しか返さないサイト

import { mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

const PROJECTS_DIR = path.resolve("src/content/projects");
const OUT_DIR = path.resolve("src/generated/ogp");
const GENERIC_OGP_HOSTS = ["bsky.app", "x.com", "twitter.com"];
const EXTENSIONS = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp", "image/gif": "gif", "image/avif": "avif" };
const MAX_BYTES = 10 * 1024 * 1024;
const UA = "Mozilla/5.0 (compatible; suibari.com site builder)";
// dev では、前回取ってから時間が経っていなければ取り直さない
const MAX_AGE_MS = process.argv.includes("--cached") ? 24 * 60 * 60 * 1000 : 0;

function frontmatter(slug) {
  const text = readFileSync(path.join(PROJECTS_DIR, slug, "index.md"), "utf8");
  const block = text.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? "";
  const field = (key) => block.match(new RegExp(`^${key}:\\s*(.*)$`, "m"))?.[1]?.trim().replace(/^["']|["']$/g, "");
  return { link: field("link"), ogp: field("ogp") !== "false", status: field("status") ?? "active", hidden: field("hidden") === "true" };
}

function isGeneric(link) {
  const host = new URL(link).hostname.replace(/^www\./, "");
  return GENERIC_OGP_HOSTS.some((generic) => host === generic || host.endsWith(`.${generic}`));
}

async function findOgpImage(link) {
  const response = await fetch(link, { headers: { "User-Agent": UA }, redirect: "follow", signal: AbortSignal.timeout(10_000) });
  if (!response.ok) throw new Error(`ページ ${response.status}`);
  const html = await response.text();
  for (const key of ["og:image", "twitter:image"]) {
    for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
      const attr = (name) => tag.match(new RegExp(`\\b${name}\\s*=\\s*["']([^"']*)["']`, "i"))?.[1];
      if ((attr("property") ?? attr("name")) === key) {
        const content = attr("content")?.replace(/&amp;/g, "&").trim();
        if (content) return new URL(content, response.url).href;
      }
    }
  }
  return undefined;
}

async function download(slug, url) {
  const response = await fetch(url, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(15_000) });
  if (!response.ok) throw new Error(`画像 ${response.status}`);
  const ext = EXTENSIONS[(response.headers.get("content-type") ?? "").split(";")[0].trim()];
  if (!ext) throw new Error(`画像ではない（${response.headers.get("content-type")}）`);
  const data = Buffer.from(await response.arrayBuffer());
  if (data.length > MAX_BYTES) throw new Error("画像が大きすぎる");
  for (const old of readdirSync(OUT_DIR).filter((file) => file.startsWith(`${slug}.`))) rmSync(path.join(OUT_DIR, old));
  writeFileSync(path.join(OUT_DIR, `${slug}.${ext}`), data);
}

function freshFile(slug) {
  const file = readdirSync(OUT_DIR).find((name) => name.startsWith(`${slug}.`));
  return file && Date.now() - statSync(path.join(OUT_DIR, file)).mtimeMs < MAX_AGE_MS;
}

mkdirSync(OUT_DIR, { recursive: true });
const slugs = readdirSync(PROJECTS_DIR).filter((slug) => {
  try {
    statSync(path.join(PROJECTS_DIR, slug, "index.md"));
    return true;
  } catch {
    return false;
  }
});

const results = { ok: 0, skipped: 0, failed: [] };
const queue = [...slugs];
async function worker() {
  for (let slug = queue.shift(); slug; slug = queue.shift()) {
    const { link, ogp, status, hidden } = frontmatter(slug);
    const unwanted = !link || !ogp || status !== "active" || hidden || isGeneric(link);
    if (unwanted) {
      // 対象外になった作品の古い画像は消しておく
      for (const old of readdirSync(OUT_DIR).filter((file) => file.startsWith(`${slug}.`))) rmSync(path.join(OUT_DIR, old));
      results.skipped++;
      continue;
    }
    if (MAX_AGE_MS && freshFile(slug)) {
      results.ok++;
      continue;
    }
    try {
      const image = await findOgpImage(link);
      if (!image) throw new Error("og:image なし");
      await download(slug, image);
      results.ok++;
    } catch (error) {
      results.failed.push(`${slug}（${error.message}）`);
    }
  }
}
await Promise.all(Array.from({ length: 6 }, worker));

console.log(`[ogp] 取得 ${results.ok} 件 / 対象外 ${results.skipped} 件 / 取れず ${results.failed.length} 件`);
if (results.failed.length) console.log(`[ogp] 取れなかったもの（手元の画像を使います）: ${results.failed.join(", ")}`);
