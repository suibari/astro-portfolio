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
      // 画像は基本的にリンク先のOGP画像を自動で使う。image は取れなかったときの予備
      image: image().optional(),
      // false にすると、リンク先のOGP画像を使わず image（手元の画像）を使う
      ogp: z.boolean().default(true),
      // ended: 公開終了（一覧に印を出し、リンク先のOGPは取りに行かない）
      status: z.enum(["active", "ended"]).default("active"),
      // true にすると一覧から隠す（下書きなど）
      hidden: z.boolean().default(false),
    }),
});

export const collections = { projects };
