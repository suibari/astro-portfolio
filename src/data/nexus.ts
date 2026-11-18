// 活動憲章「Creative Nexus」
// 原文: https://nagi.suibari.com/blog/did:plc:uixgxpiqf4i63p6rgpu7ytmx/3mzeh6lueb22i
// 英語版は原文からの翻訳（下書き）
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
  philosophy: Section & { body: string[] };
  mission: Section & { statement: string; body: string };
  vision: Section & { statement: string; body: string };
  values: Section & { items: { key: NexusKey; title: string; body: string }[] };
  principles: Section & { items: { title: string; body: string }[] };
  closing: Section & { body: string[] };
  source: string;
}

export const charter: Record<Lang, Charter> = {
  ja: {
    pageTitle: "すいばりのみちしるべ：活動憲章",
    lead: "Creative Nexus という言葉を定義し、私のこれからのみちしるべにします。",
    tagline: "技術と創作をむすび、誰かの日常を大いに盛り上げるために。",
    keywords: { technology: "技術", creativity: "創作", community: "コミュニティ" },
    philosophy: {
      label: "Philosophy",
      sub: "基本理念",
      body: [
        "私がやりたいことは、技術を極めることでも、最先端を追い続けることでも、優れた作品を生み出すことだけでもないことに気づきました。",
        "技術と創作、そしてコミュニティ。それぞれの領域を自由に行き来し、むすびつけることで、人を楽しませ、心を動かし、人と人がつながる体験を作りたいです。",
        "それが、私の考える Creative Nexus です。",
      ],
    },
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
        {
          title: "手段よりも目的を大切にする",
          body: "最新技術を使うことも、表現を極めることも、それ自体を目的にしません。「それは誰かを楽しませるだろうか？」迷ったときは、この問いに立ち返ります。",
        },
        {
          title: "他人の尺度で自分の活動を測らない",
          body: "技術力、画力、知名度、ユーザー数。それらは活動の一面を表す指標であって、活動の価値そのものではありません。他人との比較ではなく、自分が実現したかった体験に近づいているかを大切にします。",
        },
        {
          title: "小さなつながりを大切にする",
          body: "大勢に届くことだけが成功ではありません。たとえ少人数でも、楽しみにしてくれる人がいること、居場所だと感じてくれる人がいることを大切にします。",
        },
        {
          title: "自分の「作りたい」を忘れない",
          body: "誰かを楽しませるために、自分自身が創作の楽しさを失ってしまっては本末転倒です。他人の期待に応えることだけを考えず、自分の好奇心や作りたい気持ちを尊重します。",
        },
        {
          title: "無理なく、長く続ける",
          body: "活動を続けることは大切だが、活動を守るために自分の生活や健康を犠牲にしません。休むこと、立ち止まること、方向転換することも認めます。自分自身も、安心して過ごせる場所を持ち続けます。",
        },
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
    pageTitle: "suibari's Guidepost: Activity Charter",
    lead: "I define the words Creative Nexus as the guidepost for everything I make from here on.",
    tagline: "Connecting technology and creativity to make someone's everyday life a lot more exciting.",
    keywords: { technology: "Technology", creativity: "Creativity", community: "Community" },
    philosophy: {
      label: "Philosophy",
      sub: "Core idea",
      body: [
        "I realized that what I want isn't to master technology, to keep chasing the cutting edge, or only to produce outstanding work.",
        "Technology, creativity, and community. By moving freely between these fields and connecting them, I want to create experiences that entertain people, move their hearts, and bring people together.",
        "That is what I call Creative Nexus.",
      ],
    },
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
        {
          title: "Put purpose before means",
          body: "Using the latest technology or perfecting my craft is never a goal in itself. \"Will this bring someone joy?\" Whenever I'm unsure, I come back to this question.",
        },
        {
          title: "Don't measure my work by other people's yardsticks",
          body: "Technical skill, drawing skill, recognition, user counts — these show one side of my work, not its worth. Instead of comparing myself to others, I care about whether I'm getting closer to the experience I set out to create.",
        },
        {
          title: "Cherish small connections",
          body: "Reaching a crowd isn't the only kind of success. Even if it's only a few people, I treasure those who look forward to what I make and those who feel at home in the places I build.",
        },
        {
          title: "Never forget what I want to make",
          body: "If I lose the joy of creating while trying to entertain others, I've missed the point. I don't only try to meet other people's expectations — I respect my own curiosity and my urge to create.",
        },
        {
          title: "Keep going, sustainably",
          body: "Continuing matters, but I won't sacrifice my life or health to protect my work. Resting, pausing, and changing direction are all allowed. I'll keep a place where I, too, can feel at ease.",
        },
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
