import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// 1作品 = src/content/projects/<slug>/index.md（画像は同じフォルダに置く）
// 追加は `npm run new:project <GitHubのURL or サイトのURL>` で雛形を作れる
const projects = defineCollection({
  loader: glob({
    pattern: "*/index.md",
    base: "./src/content/projects",
    generateId: ({ entry }) => entry.split("/")[0],
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      link: z.string().url(),
      // "owner/name"。private: true のときはサイトにリポジトリのリンクを出さない
      repo: z.string().regex(/^[\w.-]+\/[\w.-]+$/).optional(),
      private: z.boolean().default(false),
      tags: z.array(z.string()).default([]),
      image: image().optional(),
      // true にすると一覧から隠す（下書き・公開終了など）
      hidden: z.boolean().default(false),
    }),
});

export const collections = { projects };
