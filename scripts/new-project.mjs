#!/usr/bin/env node
// 作品の雛形を作る
//   npm run new:project https://github.com/suibari/bsky_meyasuat
//   npm run new:project https://example.com/            （GitHubがない作品）
//   npm run new:project <URL> -- --slug meyasuat --link https://meyasuat.suibari.com/
//
// GitHubのURLなら、説明・言語・使っているライブラリ・最初のコミット日・公開サイトを取得する。
// 認証は `gh auth token`（gh CLIのログイン）か環境変数 GITHUB_TOKEN を使うので、
// プライベートリポジトリも読める。
// 画像はビルド時にリンク先の OGP 画像を自動で取るので、ここではダウンロードしない
// （OGP がないサイトだけ、あとで cover.png などを置いて image: ./cover.png を足す）。

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";

const { values: opts, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    slug: { type: "string" },
    link: { type: "string" },
    title: { type: "string" },
  },
});
const input = positionals[0];
if (!input) {
  console.error("使い方: npm run new:project <GitHubのURL | サイトのURL> [-- --slug 名前 --link 公開URL --title タイトル]");
  process.exit(1);
}

const PROJECTS_DIR = path.resolve("src/content/projects");

// 表記ゆれをそろえる（キーは小文字）
const TAG_NAMES = {
  typescript: "TypeScript", javascript: "JavaScript", python: "Python", kotlin: "Kotlin", java: "Java",
  "c++": "C++", svelte: "Svelte", sveltekit: "SvelteKit", astro: "Astro", react: "React", nextjs: "Next.js",
  vue: "Vue", atproto: "ATProtocol", atprotocol: "ATProtocol", bluesky: "Bluesky", "node.js": "Node.js",
  nodejs: "Node.js", vercel: "Vercel", "cloudflare-pages": "CloudflarePages", "cloudflare-workers": "CloudflareWorkers",
  unity: "Unity", "c#": "C#", gemini: "Gemini", ollama: "Ollama",
};
// package.json の依存関係 → タグ
const DEPENDENCY_TAGS = [
  ["@sveltejs/kit", "SvelteKit"], ["astro", "Astro"], ["next", "Next.js"], ["react", "React"], ["vue", "Vue"],
  ["@atproto/api", "ATProtocol"], ["@atproto/oauth-client-browser", "ATProtocol"], ["@atproto/oauth-client-node", "ATProtocol"],
  ["@sveltejs/adapter-cloudflare", "CloudflarePages"], ["@sveltejs/adapter-vercel", "Vercel"],
  ["wrangler", "Cloudflare"], ["@google/genai", "Gemini"], ["@google/generative-ai", "Gemini"],
];
const normalizeTag = (tag) => TAG_NAMES[tag.toLowerCase()] ?? tag;
// 年月日を日本時間で
const toJstDate = (iso) => new Date(iso).toLocaleDateString("sv-SE", { timeZone: "Asia/Tokyo" });
const slugify = (s) =>
  s.toLowerCase().replace(/^bsky[_-](feed[_-])?/, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function githubToken() {
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN;
  try {
    return execFileSync("gh", ["auth", "token"], { encoding: "utf8" }).trim();
  } catch {
    return undefined;
  }
}

async function github(pathname, token) {
  const response = await fetch(`https://api.github.com${pathname}`, {
    headers: {
      Accept: "application/vnd.github+json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!response.ok) {
    const hint = response.status === 404 && !token ? "（プライベートなら `gh auth login` か GITHUB_TOKEN が必要です）" : "";
    throw new Error(`GitHub API ${pathname} → ${response.status}${hint}`);
  }
  return response;
}

async function firstCommitDate(fullName, branch, token) {
  const response = await github(`/repos/${fullName}/commits?sha=${branch}&per_page=1`, token);
  const last = response.headers.get("link")?.match(/<([^>]+)>;\s*rel="last"/)?.[1];
  const commits = last ? await (await github(new URL(last).pathname + new URL(last).search, token)).json() : await response.json();
  return commits.at(-1)?.commit?.author?.date;
}

async function readPackageJson(fullName, token) {
  try {
    const response = await github(`/repos/${fullName}/contents/package.json`, token);
    const { content } = await response.json();
    return JSON.parse(Buffer.from(content, "base64").toString("utf8"));
  } catch {
    return undefined;
  }
}

async function fromGitHub(owner, name) {
  const token = githubToken();
  const repo = await (await github(`/repos/${owner}/${name}`, token)).json();
  const [languages, createdAt, pkg] = await Promise.all([
    github(`/repos/${repo.full_name}/languages`, token).then((r) => r.json()),
    firstCommitDate(repo.full_name, repo.default_branch, token).catch(() => undefined),
    readPackageJson(repo.full_name, token),
  ]);
  const deps = { ...pkg?.dependencies, ...pkg?.devDependencies };
  const tags = [
    ...Object.keys(languages).slice(0, 2),
    ...DEPENDENCY_TAGS.filter(([dep]) => dep in deps).map(([, tag]) => tag),
    ...(repo.topics ?? []),
  ].map(normalizeTag);
  return {
    slug: slugify(repo.name),
    title: repo.name,
    description: repo.description ?? "",
    date: toJstDate(createdAt ?? repo.created_at),
    link: repo.homepage || repo.html_url,
    repo: repo.full_name,
    private: repo.private,
    tags: [...new Set(tags)],
  };
}

// サイトのOGP情報（og:title / og:description / og:image）
async function readOgp(url) {
  try {
    const response = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (new-project script)" }, redirect: "follow" });
    if (!response.ok) return {};
    const html = await response.text();
    const meta = (key) => {
      for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
        const attr = (n) => tag.match(new RegExp(`${n}\\s*=\\s*["']([^"']*)["']`, "i"))?.[1];
        if (attr("property") === key || attr("name") === key) return attr("content");
      }
    };
    const title = meta("og:title") ?? html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1];
    const image = meta("og:image") ?? meta("twitter:image");
    return {
      title: title?.trim(),
      description: meta("og:description") ?? meta("description"),
      image: image ? new URL(image, response.url).href : undefined,
    };
  } catch {
    return {};
  }
}

const github_ = input.match(/^https?:\/\/github\.com\/([^/]+)\/([^/#?]+)/);
const base = github_
  ? await fromGitHub(github_[1], github_[2].replace(/\.git$/, ""))
  : { slug: slugify(new URL(input).hostname.split(".")[0]), title: "", description: "", date: toJstDate(new Date()), link: input, private: false, tags: [] };

if (opts.link) base.link = opts.link;
const ogp = base.link.startsWith("https://github.com/") ? {} : await readOgp(base.link);
const project = {
  ...base,
  slug: opts.slug ?? base.slug,
  // 「めやすあっと - ひとことも…」のようなOGPタイトルは区切りより前だけ使う
  title: opts.title ?? ogp.title?.split(/\s+[-|｜–—]\s+/)[0] ?? base.title,
  description: base.description || ogp.description || "",
};

const dir = path.join(PROJECTS_DIR, project.slug);
if (existsSync(dir)) {
  console.error(`すでにあります: ${path.relative(process.cwd(), dir)}（--slug で別の名前を指定してください）`);
  process.exit(1);
}
mkdirSync(dir, { recursive: true });


const q = JSON.stringify;
const frontmatter = [
  "---",
  `title: ${q(project.title)}`,
  `description: ${q(project.description)}`,
  `date: ${project.date}`,
  `link: ${q(project.link)}`,
  project.repo && `repo: ${project.repo}`,
  project.private && "private: true",
  `tags: [${project.tags.map(q).join(", ")}]`,
  "---",
  "",
].filter((line) => line !== undefined && line !== false && line !== "").join("\n") + "\n";
writeFileSync(path.join(dir, "index.md"), frontmatter);

const rel = path.relative(process.cwd(), dir);
const imageNote = ogp.image
  ? `画像: リンク先の OGP 画像をビルド時に自動で使います（${ogp.image}）`
  : `画像: リンク先に OGP 画像が見つかりませんでした。必要なら ${rel}/cover.png を置いて image: ./cover.png を足してください`;
console.log(`\n作成しました: ${rel}/index.md\n${imageNote}\n`);
console.log(frontmatter);
if (project.private && project.link.startsWith("https://github.com/")) {
  console.warn("⚠ プライベートリポジトリで公開サイトが見つかりませんでした。link を公開URLに書き換えてください（--link でも指定できます）。");
}
console.log("タイトル・説明・タグを確認して、そのままコミットしてください。");
