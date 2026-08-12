# スマートエンカウント (smaen)

Yahoo Japan主催のHack Day 2019内ハッカソンにて作成。

ふたりがそれぞれの駅を入力すると、Yahoo!乗換案内の経路から到着時刻の差が最も小さい途中駅を「集合場所」として提案します。位置情報から最寄り駅の自動入力（HeartRails Express API）と、相手への共有リンク機能付き。

## 技術構成

- [SvelteKit](https://svelte.dev/docs/kit) — フロントエンド + APIルート（旧 Nuxt.js + Flask を統合）
- [Bun](https://bun.sh) — ランタイム / パッケージマネージャ
- SQLite ([bun:sqlite](https://bun.sh/docs/api/sqlite)) — 駅名サジェスト + 経路検索キャッシュ
- [daisyUI](https://daisyui.com) (Tailwind CSS) — UI
- [Biome](https://biomejs.dev) — lint / format

## 開発

```sh
bun install
bun run dev
```

## コマンド

| コマンド | 内容 |
| --- | --- |
| `bun run dev` | 開発サーバー起動 |
| `bun run build` | プロダクションビルド |
| `bun run start` | ビルド済みサーバー起動 (port 3000) |
| `bun run lint` | Biomeでチェック |
| `bun run format` | Biomeで整形 |
| `bun run check` | svelte-check |

## API

- `GET /api/search?first=新宿&second=大宮` — 集合場所と両者の経路
- `GET /api/stations?q=新` — 駅名サジェスト
- `GET /api/nearest?x=139.7&y=35.6` — 最寄り駅 (HeartRails Express中継)

©HeartRails Express
