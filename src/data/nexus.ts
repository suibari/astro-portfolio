// 活動憲章「Creative Nexus」
// 原文: https://nagi.suibari.com/blog/did:plc:uixgxpiqf4i63p6rgpu7ytmx/3mzeh6lueb22i
// 英語版は原文からの翻訳（下書き）。サイトでは要約版を載せている（Philosophy は lead に統合、Principles は見出しのみ）
import type { Lang } from "../i18n/ui";

export const NEXUS_SOURCE_URL =
  "https://nagi.suibari.com/blog/did:plc:uixgxpiqf4i63p6rgpu7ytmx/3mzeh6lueb22i";

export type NexusKey = "technology" | "creativity" | "community";

interface Section {
  label: string;
  sub: string;
}

interface Charter {
  pageTitle: string;
  lead: string;
  tagline: string;
  keywords: Record<NexusKey, string>;
  mission: Section & { statement: string; body: string };
  vision: Section & { statement: string; body: string };
  values: Section & { items: { key: NexusKey; title: string; body: string }[] };
  principles: Section & { items: string[] };
  closing: Section & { body: string[] };
  source: string;
}

export const charter: Record<Lang, Charter> = {
  ja: {
    pageTitle: "すいばりのみちしるべ：活動憲章",
    lead: "Creative Nexus という言葉を定義し、私のこれからのみちしるべにします。技術と創作、そしてコミュニティ。それぞれの領域を自由に行き来し、むすびつけることで、人を楽しませ、心を動かし、人と人がつながる体験を作りたいです。",
    tagline: "技術と創作をむすび、誰かの日常を大いに盛り上げるために。",
    keywords: { technology: "技術", creativity: "創作", community: "コミュニティ" },
    mission: {
      label: "Mission",
      sub: "使命",
      statement: "異なる領域をむすびつけ、誰かの日常を大いに盛り上げます。",
      body: "技術と創作を組み合わせ、楽しさや驚き、励まし、つながりを生み出す体験を届けます。",
    },
    vision: {
      label: "Vision",
      sub: "目指す姿",
      statement: "誰もが自分らしくあり、安心してつながれる世界。",
      body: "人と人、人とキャラクターが自然に関わり合い、日々の暮らしに小さな楽しみや心の支えが生まれる。そんな体験や居場所を、少しずつ増やしていきたいです。",
    },
    values: {
      label: "Values",
      sub: "大切にする価値観",
      items: [
        {
          key: "technology",
          title: "技術は、誰かを楽しませるために",
          body: "技術の新しさや高度さよりも、それによって何が実現できるかを大切にします。枯れた技術でも、誰かを楽しませることができるなら、それは十分に価値があります。",
        },
        {
          key: "creativity",
          title: "創作は、誰かの心を動かすために",
          body: "技術や表現の巧拙だけにとらわれず、楽しさ、驚き、感動、親しみを生み出すことを大切にします。自分が作りたいと思えるものを、自分なりの方法で形にします。",
        },
        {
          key: "community",
          title: "コミュニティは、安心してつながるために",
          body: "規模や賑わいだけを追い求めず、一人ひとりが安心して過ごせることを大切にします。誰かにとっての居場所を作り、その場所を大切に育てていきます。",
        },
      ],
    },
    principles: {
      label: "Principles",
      sub: "迷ったときのみちしるべ",
      items: [
        "手段よりも目的を大切にする",
        "他人の尺度で自分の活動を測らない",
        "小さなつながりを大切にする",
        "自分の「作りたい」を忘れない",
        "無理なく、長く続ける",
      ],
    },
    closing: {
      label: "Afterword",
      sub: "おわりに",
      body: [
        "私は、技術者としても、創作者としても、コミュニティ運営者としても、何か一つの分野は極められていません。けれど、それぞれをむすびつけることに、自分なりの意味を見いだしたいと思っています。",
        "どこか一つの領域で一番になる必要はないのだと思います。誰かと競うためではなく、誰かの日常を少しでも楽しくするためにこれからも作ります。そして、その活動を自分自身も楽しめることを忘れません。",
      ],
    },
    source: "原文（Nagi）",
  },
  en: {
    pageTitle: "suibari's Guidepost: A Manifesto",
    lead: "I define the words Creative Nexus as the guidepost for everything I make from here on. Technology, creativity, and community — by moving freely between these fields and connecting them, I want to create experiences that entertain people, move their hearts, and bring people together.",
    tagline: "Connecting technology and creativity to make someone's everyday life a lot more exciting.",
    keywords: { technology: "Technology", creativity: "Creativity", community: "Community" },
    mission: {
      label: "Mission",
      sub: "What I do",
      statement: "Connect different fields to make someone's everyday life a lot more exciting.",
      body: "By combining technology and creativity, I deliver experiences that spark fun, surprise, encouragement, and connection.",
    },
    vision: {
      label: "Vision",
      sub: "Where I'm headed",
      statement: "A world where everyone can be themselves and connect without worry.",
      body: "A world where people engage naturally with each other — and with characters — and small joys and emotional support grow out of daily life. I want to add more of those experiences and places, little by little.",
    },
    values: {
      label: "Values",
      sub: "What I care about",
      items: [
        {
          key: "technology",
          title: "Technology is for bringing someone joy",
          body: "I care more about what technology makes possible than about how new or advanced it is. Even well-worn technology is worth plenty if it can bring someone joy.",
        },
        {
          key: "creativity",
          title: "Creativity is for moving someone's heart",
          body: "Rather than getting caught up in skill or polish alone, I value creating fun, surprise, emotion, and warmth. I make what I genuinely want to make, in my own way.",
        },
        {
          key: "community",
          title: "Community is for connecting without worry",
          body: "Rather than chasing size or buzz, I value making sure each person can feel at ease. I build places where someone can belong, and I nurture them with care.",
        },
      ],
    },
    principles: {
      label: "Principles",
      sub: "When I'm unsure",
      items: [
        "Put purpose before means",
        "Don't measure my work by other people's yardsticks",
        "Cherish small connections",
        "Never forget what I want to make",
        "Keep going, sustainably",
      ],
    },
    closing: {
      label: "Afterword",
      sub: "",
      body: [
        "I haven't mastered any single field — not as an engineer, not as a creator, not as someone who runs a community. But I want to find my own meaning in connecting them.",
        "I don't think I need to be number one in any one field. Not to compete with anyone, but to make someone's day a little more fun, I'll keep on making things — and I won't forget to enjoy it myself.",
      ],
    },
    source: "Original (Japanese, on Nagi)",
  },
};
