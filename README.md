
# Yahoo Finance Tracker

Yahoo Finance Japanから株価、指数、為替データをリアルタイムで取得・表示するWebアプリケーションです。

## 機能

- 📊 リアルタイム株価表示
- 🔄 自動更新機能（30秒間隔）
- 🌓 ダークモード対応
- 📱 レスポンシブデザイン
- 💾 ローカルストレージでの設定保存

## 技術スタック

- **バックエンド (API)**: Rust + Cloudflare Workers
- **フロントエンド (UI)**: HTML + CSS + JavaScript（バニラ） + Cloudflare Pages
- **データベース**: Cloudflare D1 (SQLite)

## セットアップとデプロイ

ルートディレクトリから `npm` コマンドを使用してデプロイを行います。

###　バージョンアップコマンド
npm install -D wrangler@latest 



### 1. 初回準備（D1 データベース）

Cloudflare D1 データベースを作成し、IDを `backend/wrangler.toml` に設定してください。

```bash
npx wrangler d1 create preloaded_state_db
```

### 2. デプロイ

| コマンド | 内容 |
| :--- | :--- |
| `npm run deploy:backend` | APIを Cloudflare Workers にデプロイ |
| `npm run deploy:frontend` | UIを Cloudflare Pages にデプロイ |
| `npm run deploy:all` | APIとUIを両方一括でデプロイ |

### 3. APIエンドポイントの設定

UIをデプロイした後、ブラウザでアプリを開き：
1. 右上の⚙️アイコン（設定）をクリック
2. **API Endpoint** にデプロイした Worker の URL (例: `https://preloaded_state-api.xxx.workers.dev`) を入力して保存

これで UI と API が連携されます。

### 4. GitHub 連携（自動デプロイ）の設定

GitHub にプッシュした際に自動でフロントエンドが更新されるように設定する場合：

1.  **Cloudflare Dashboard** にログインし、「Workers & Pages」>「Create」>「Pages」>「Connect to Git」を選択。
2.  対象の GitHub リポジトリを選択。
3.  **ビルド設定**で以下を入力：
    *   **Project name**: `preloaded-state` (任意)
    *   **Production branch**: `main`
    *   **Framework preset**: `None`
    *   **Root directory**: `/frontend` (重要：モノレポ構成のため)
    *   **Build command**: (なし)
    *   **Build output directory**: `public`
4.  「Save and Deploy」をクリック。

以降、`git push` を行うだけでフロントエンドが自動デプロイされます。

## 開発（ローカル）

### APIの起動
```bash
cd backend
npx wrangler dev
```

### UIの起動
`frontend/public/index.html` をブラウザで直接開くか、任意の静的サーバーで起動してください。
設定画面から API Endpoint を `http://localhost:8787` に向けることでローカルの API と通信できます。

## 使い方

### 銘柄の追加

1. 検索バーに銘柄コードを入力（例: `7203.T`, `^DJI`, `USDJPY=X`）
2. 「追加」ボタンをクリック
3. または、クイック追加ボタンから選択

### 対応銘柄コード

- **日本株**: `7203.T`（トヨタ）、`9984.T`（ソフトバンク）など
- **海外指数**: `^DJI`（ダウ平均）、`998407.O`（日経平均）など
- **為替**: `USDJPY=X`（米ドル/円）など

### 設定

右上の⚙️アイコンから以下を設定できます:
- APIエンドポイント
- 自動更新間隔（10-300秒）
- テーマ（ライト/ダーク）

## API仕様

### エンドポイント

```
GET /api/scrape?code=CODE1,CODE2,...
```

### パラメータ

- `code` (必須): 銘柄コード（カンマ区切りで複数指定可能）
- `keys` (オプション): 取得するデータキー（カンマ区切り）

### レスポンス例

```json
[
  {
    "code": "7203.T",
    "data": {
      "code": "7203.T",
      "name": "トヨタ自動車",
      "price": "2500.0",
      "price_change": "50.0",
      "price_change_rate": "2.04",
      "update_time": "15:00",
      "status": "OK",
      "source": "json_predefined"
    },
    "error": null
  }
]
```

## ディレクトリ構成

```text
preloaded_state/
├── backend/            # API (Cloudflare Worker)
│   ├── src/           # Rustコード
│   ├── Cargo.toml     # Rust依存関係
│   └── wrangler.toml  # Worker用設定
├── frontend/           # UI (Cloudflare Pages)
│   ├── public/        # HTML/CSS/JS (静的ファイル)
│   └── wrangler.toml  # Pages用設定
└── package.json        # 全体管理用スクリプト
```

## ライセンス

MIT License
