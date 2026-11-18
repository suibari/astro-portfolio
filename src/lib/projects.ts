import { getCollection, type CollectionEntry } from "astro:content";

export type Project = CollectionEntry<"projects">;

export async function getProjects(): Promise<Project[]> {
  const entries = await getCollection("projects", ({ data }) => !data.hidden);
  return entries.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/** 公開リポジトリで、かつメインのリンクと別のときだけリポジトリURLを返す */
export function publicRepoUrl(project: Project): string | undefined {
  const { repo, private: isPrivate, link } = project.data;
  if (!repo || isPrivate) return undefined;
  const url = `https://github.com/${repo}`;
  return link.replace(/\/+$/, "") === url ? undefined : url;
}
