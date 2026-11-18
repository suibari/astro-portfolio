import { getCollection, type CollectionEntry } from "astro:content";
import { getImage } from "astro:assets";

type Entry = CollectionEntry<"projects">;

export interface Cover {
  src: string;
  srcset?: string;
  from: "ogp" | "local";
}

export type Project = Entry & { cover?: Cover };

// scripts/fetch-ogp.mjs がビルド前にダウンロードした、リンク先の OGP 画像
const ogpImages = import.meta.glob<ImageMetadata>("/src/generated/ogp/*.{png,jpg,webp,gif,avif}", {
  eager: true,
  import: "default",
});
const ogpBySlug = new Map(
  Object.entries(ogpImages).map(([file, image]) => [file.split("/").pop()!.replace(/\.[^.]+$/, ""), image]),
);

const COVER_WIDTHS = [160, 320];

/** 作品の画像：リンク先の OGP 画像 → 手元の image の順に使う */
async function resolveCover(entry: Entry): Promise<Cover | undefined> {
  const ogp = entry.data.ogp && entry.data.status === "active" ? ogpBySlug.get(entry.id) : undefined;
  const image = ogp ?? entry.data.image;
  if (!image) return undefined;
  const result = await getImage({ src: image, widths: COVER_WIDTHS, format: "webp" });
  return { src: result.src, srcset: result.srcSet.attribute, from: ogp ? "ogp" : "local" };
}

let projectsCache: Promise<Project[]> | undefined;

export function getProjects(): Promise<Project[]> {
  projectsCache ??= (async () => {
    const entries = await getCollection("projects", ({ data }) => !data.hidden);
    const projects = await Promise.all(entries.map(async (entry) => ({ ...entry, cover: await resolveCover(entry) })));
    return projects.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
  })();
  return projectsCache;
}

/** 公開リポジトリで、かつメインのリンクと別のときだけリポジトリURLを返す */
export function publicRepoUrl(project: Project): string | undefined {
  const { repo, private: isPrivate, link } = project.data;
  if (!repo || isPrivate) return undefined;
  const url = `https://github.com/${repo}`;
  return link.replace(/\/+$/, "") === url ? undefined : url;
}
