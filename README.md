# S.O.S.!! — suibari.com

すいばりのポートフォリオサイト（Astro / Cloudflare Pages）。

```sh
npm install
npm run dev      # http://localhost:4321
npm run build
```

## 作品（Projects）を追加する

1作品 = `src/content/projects/<slug>/index.md`。画像は**リンク先の OGP 画像をビルド時に自動で使う**ので、基本的に置かなくてよい。

```sh
# GitHubのリポジトリから（プライベートでも可。gh CLI のログイン情報か GITHUB_TOKEN を使う）
npm run new:project https://github.com/suibari/bsky_meyasuat

# GitHubがない作品は、公開ページのURLから（OGPのタイトル・説明を取得）
npm run new:project https://example.com/

# 名前や公開URLを指定する
npm run new:project https://github.com/suibari/xxx -- --slug xxx --link https://xxx.suibari.com/
```

できた `index.md` のタイトル・説明・タグを確認してコミットすれば一覧に載る。

| 項目 | 必須 | 内容 |
| --- | --- | --- |
| `title` | ○ | 作品名 |
| `description` | ○ | 一言説明 |
| `date` | ○ | 開発開始日（雛形では最初のコミット日・日本時間） |
| `link` | ○ | 一覧から飛ぶ先 |
| `repo` | | `owner/name`。公開リポジトリなら一覧にGitHubアイコンが出る |
| `private` | | `true` ならリポジトリへのリンクを出さない |
| `tags` | | 技術タグ。Projectsページの絞り込みに使う |
| `image` | | `./cover.png` など。OGP 画像が取れなかったときの予備。どちらもなければ `>_` の絵になる |
| `ogp` | | `false` にするとリンク先の OGP 画像を使わず `image` を使う |
| `status` | | `ended` で「公開終了」の印を出す（OGP は取りに行かない） |
| `hidden` | | `true` で一覧から隠す |

書き間違いは `npm run build` / `npm run dev` で型エラーとして出る（`src/content.config.ts`）。

### 作品の画像の決まり方

`npm run build` / `npm run dev` の前に `scripts/fetch-ogp.mjs` が動き、各作品のリンク先から OGP 画像を `src/generated/ogp/`（git 管理外）にダウンロードする。

1. リンク先の OGP 画像
2. 取れなかったとき・対象外のときは、手元の `image`

Bluesky / X のリンク、`ogp: false`、`status: ended` の作品は OGP を取りに行かない（どのページでも同じアイコンやロゴしか返らないため）。手動で取り直すときは `npm run fetch:ogp`。

## 環境変数

| 名前 | 用途 |
| --- | --- |
| `PIXIV_REFRESH_TOKEN` | Illustrations（pixiv） |
| `QIITA_ACCESS_TOKEN` | Blog（Qiita） |

未設定・取得失敗でもビルドは止まらず、その取得元だけ空になる。
