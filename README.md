# Yahoo Finance Tracker

Yahoo Finance Japanから株価、指数、為替データをリアルタイムで取得・表示するWebアプリケーションです。

## 機能

- 📊 リアルタイム株価表示
- 🔄 自動更新機能（30秒間隔）
- 🌓 ダークモード対応
- 📱 レスポンシブデザイン
- 💾 ローカルストレージでの設定保存

## 技術スタック

- **バックエンド**: Rust + Cloudflare Workers
- **フロントエンド**: HTML + CSS + JavaScript（バニラ）
- **デプロイ**: Cloudflare Workers

## 起動方法

### ローカル開発サーバー

```bash
npx wrangler dev
```

サーバーが起動したら、ブラウザで `http://localhost:8787` にアクセスしてください。

### Cloudflareへのデプロイ

```bash
npx wrangler deploy
```

## 使い方

### 銘柄の追加

1. 検索バーに銘柄コードを入力（例: `7203.T`, `^DJI`, `USDJPY=X`）
2. 「追加」ボタンをクリック
3. または、クイック追加ボタンから選択

### 対応銘柄コード

- **日本株**: `7203.T`（トヨタ）、`9984.T`（ソフトバンク）など
- **海外指数**: `^DJI`（ダウ平均）、`^N225`（日経平均）など
- **為替**: `USDJPY=X`（米ドル/円）など

### 設定

右上の⚙️アイコンから以下を設定できます:
- APIエンドポイント
- 自動更新間隔（10-300秒）

## API仕様

### エンドポイント

```
GET /?code=CODE1,CODE2,...
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

## プロジェクト構造

```
preloaded_state/
├── src/
│   └── lib.rs              # Rustバックエンドコード
├── public/
│   ├── index.html          # フロントエンドHTML
│   ├── style.css           # スタイルシート
│   └── app.js              # JavaScriptロジック
├── wrangler.toml           # Cloudflare Workers設定
├── Cargo.toml              # Rust依存関係
└── README.md               # このファイル
```

## ライセンス

MIT License
