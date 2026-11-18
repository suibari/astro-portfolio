# S.O.S.!! — suibari.com

すいばりのポートフォリオサイト（Astro / Cloudflare Pages）。

```sh
npm install
npm run dev      # http://localhost:4321
npm run build
```

## 作品（Projects）を追加する

1作品 = `src/content/projects/<slug>/index.md`。画像は同じフォルダに `cover.png` などで置く。

```sh
# GitHubのリポジトリから（プライベートでも可。gh CLI のログイン情報か GITHUB_TOKEN を使う）
npm run new:project https://github.com/suibari/bsky_meyasuat

# GitHubがない作品は、公開ページのURLから（OGPのタイトル・説明・画像を取得）
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
| `image` | | `./cover.png` など。なければ `>_` の代わりの絵になる |
| `hidden` | | `true` で一覧から隠す |

書き間違いは `npm run build` / `npm run dev` で型エラーとして出る（`src/content.config.ts`）。

## 環境変数

| 名前 | 用途 |
| --- | --- |
| `PIXIV_REFRESH_TOKEN` | Illustrations（pixiv） |
| `QIITA_ACCESS_TOKEN` | Blog（Qiita） |

未設定・取得失敗でもビルドは止まらず、その取得元だけ空になる。
