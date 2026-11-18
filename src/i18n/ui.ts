export const languages = { ja: "日本語", en: "English" } as const;
export type Lang = keyof typeof languages;
export const defaultLang: Lang = "ja";

const ui = {
  ja: {
    "site.description": "すいばりのウェブサイト。開発・イラスト・ブログなどの活動をまとめています。",
    "nav.label": "メインメニュー",
    "nav.manifesto": "Manifesto",
    "nav.projects": "Projects",
    "nav.illust": "Illustrations",
    "nav.blog": "Blog",
    "nav.about": "About",
    "nav.characters": "Characters",
    "nav.open": "メニューを開く",
    "nav.close": "メニューを閉じる",
    "lang.switch": "English",
    "hero.subtitle": "世界を大いに盛り上げるための\nすいばり のサイト",
    "hero.intro": "Bluesky / AT Protocol まわりのWebアプリやbotを作ったり、イラストを描いたりしています。",
    "section.more": "もっと見る",
    "section.all": "すべて見る",
    "nexus.label": "活動憲章",
    "nexus.read": "活動憲章を読む",
    "nexus.moreProjects": "Projects",
    "nexus.moreIllust": "Illustrations",
    "nexus.nagi": "Nagi",
    "projects.description": "すいばりが作ったWebアプリ・bot・ツールなどの一覧",
    "projects.filter": "技術タグで絞り込む",
    "projects.repo": "のGitHubリポジトリ",
    "projects.ended": "公開終了",
    "illust.description": "すいばりのイラスト一覧",
    "illust.empty": "イラストを読み込めませんでした。pixiv で見られます。",
    "blog.description": "note / Qiita / Nagi に書いた記事の一覧",
    "blog.empty": "記事を読み込めませんでした。",
    "about.description": "すいばりについて",
    "about.top": "トップへ",
  },
  en: {
    "site.description": "suibari's website: web apps, bots, illustrations and writing.",
    "nav.label": "Main menu",
    "nav.manifesto": "Manifesto",
    "nav.projects": "Projects",
    "nav.illust": "Illustrations",
    "nav.blog": "Blog",
    "nav.about": "About",
    "nav.characters": "Characters",
    "nav.open": "Open menu",
    "nav.close": "Close menu",
    "lang.switch": "日本語",
    "hero.subtitle": "suibari's site for making\nthe world a lot more exciting",
    "hero.intro": "I build web apps and bots around Bluesky / AT Protocol, and I draw illustrations.",
    "section.more": "More",
    "section.all": "See all",
    "nexus.label": "My manifesto",
    "nexus.read": "Read the manifesto",
    "nexus.moreProjects": "Projects",
    "nexus.moreIllust": "Illustrations",
    "nexus.nagi": "Nagi",
    "projects.description": "Web apps, bots and tools made by suibari",
    "projects.filter": "Filter by tag",
    "projects.repo": " GitHub repository",
    "projects.ended": "Ended",
    "illust.description": "Illustrations by suibari",
    "illust.empty": "Couldn't load the illustrations. You can see them on pixiv.",
    "blog.description": "Articles on note / Qiita / Nagi (mostly in Japanese)",
    "blog.empty": "Couldn't load the articles.",
    "about.description": "About suibari",
    "about.top": "Home",
  },
} as const;

export type UIKey = keyof (typeof ui)["ja"];

export function langOf(locale: string | undefined): Lang {
  return locale === "en" ? "en" : "ja";
}

export function useTranslations(lang: Lang) {
  return (key: UIKey) => ui[lang][key];
}

/** "/projects" → "/en/projects"（日本語はプレフィックスなし） */
export function localizePath(lang: Lang, path: string): string {
  const clean = path.replace(/^\/en(?=\/|$)/, "") || "/";
  if (lang === "ja") return clean;
  return clean === "/" ? "/en/" : `/en${clean}`;
}
