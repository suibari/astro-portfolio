import fetchPixivArtworks from "../services/illust/fetchPixivArtworks";
import { fetchRSS } from "../services/blog/fetchRSS";
import { fetchQiitaArticles } from "../services/blog/fetchQiitaArticles";
import { fetchNagiArticles } from "../services/blog/fetchNagiArticles";

export interface Illustration {
  title: string;
  image: string;
  link: string;
  date: string;
}

export interface BlogPost {
  title: string;
  link: string;
  date: string; // ISO 8601
  source: "note" | "Qiita" | "Nagi";
  image?: string | null;
}

// 1つの取得元が落ちてもビルド全体は止めない
async function safely<T>(label: string, task: () => Promise<T[]>): Promise<T[]> {
  try {
    return await task();
  } catch (error) {
    console.error(`[feeds] ${label} の取得に失敗しました`, error);
    return [];
  }
}

let illustrationsCache: Promise<Illustration[]> | undefined;
export function getIllustrations(): Promise<Illustration[]> {
  illustrationsCache ??= safely("pixiv", fetchPixivArtworks);
  return illustrationsCache;
}

let blogCache: Promise<BlogPost[]> | undefined;
export function getBlogPosts(): Promise<BlogPost[]> {
  blogCache ??= (async () => {
    const tag = (source: BlogPost["source"]) => (items: { title?: string; link?: string; date: string; image?: string | null }[]) =>
      items.map((item) => ({ title: item.title ?? "", link: item.link ?? "", date: item.date, image: item.image, source }));
    const [note, qiita, nagi] = await Promise.all([
      safely("note", () => fetchRSS("https://note.com/suibari/rss").then(tag("note"))),
      safely("Qiita", async () => {
        const token = import.meta.env.QIITA_ACCESS_TOKEN;
        if (!token) throw new Error("QIITA_ACCESS_TOKEN が未設定です");
        return tag("Qiita")(await fetchQiitaArticles("Suibari_cha", token));
      }),
      safely("Nagi", () => fetchNagiArticles().then(tag("Nagi"))),
    ]);
    return [...note, ...qiita, ...nagi].sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
  })();
  return blogCache;
}

export function formatDate(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return date.toLocaleDateString("sv-SE", { timeZone: "Asia/Tokyo" }); // YYYY-MM-DD
}
