
# How to contribute

## nodejs 10.16.3 をセットアップする

Firebaseでサポートされているのは
`nodejs v8系` または `nodejs v10系` なので、
`10.16.3 LTS` を使う

### Linux の場合
```
apt install nodejs
npm install n
n install 10.16.3
apt remove nodejs
```

### Windows10 の場合
```
choco uninstall nodejs nodejs.install
choco install nodejs-lts
```

## `firebase-tools` をセットアップする
```
npm install -g firebase-tools
firebase login
```

## GOOGLE_APPLICATION_CREDENTIALS環境変数をセットする
  - `news-mapper/key.json` というファイルが必要
  - Windows 10 の場合
    - `$env:GOOGLE_APPLICATION_CREDENTIALS="C:\Users\yuise\crisis-news-mapper\key.json"`
  - Linux の場合
    - `export GOOGLE_APPLICATION_CREDENTIALS="/home/yuiseki/crisis-news-mapper/key.json"`


## 依存関係をインストールしてビルド
```
cd functions
npm install
npm run build
```

## 開発環境で起動
```
cd ..
firebase serve
```

## ブラウザで確認
  - http://localhost:5000/

## テストの実行
```
cd functions
npm test
```
