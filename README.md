
# このプロジェクトの目的
日本において、広範囲におよぶ災害が発生した際に、ひと目で日本全体の被害状況を把握できるようにする

  - 災害関連のニュースのみを選別し、地図上に可視化する
  - ニュース以外の災害関連の情報も可能な限り地図上に可視化する
    - 自衛隊災害派遣情報
    - 消防出動情報
    - 災害ボランティアセンター
    - etc...


# このプロジェクトに協力する方法

## 不具合を発見した場合、改善案を提案したい場合
  - githubのアカウントを登録する
  - 以下のURLを開き、緑色の [New issue] ボタンを押す
    - https://github.com/yuiseki/crisis-news-mapper/issues


## 運営費を支援したい場合
### Polcaで支援する
  - Polcaのアプリをインストールする
    - https://play.google.com/store/apps/details?id=jp.camp_fire.app.android.polca&hl=ja
    - https://apps.apple.com/jp/app/id1230285916?l=ja
  - Polcaのユーザー登録をする
  - Polcaにクレジットカードを登録する
  - 以下のURLを開いて支援する
https://polca.jp/projects/gRNhd5LhkQ6

### Kyashで送金する
  - Kyashのアプリをインストールする
    - https://play.google.com/store/apps/details?id=co.kyash&hl=ja
    - https://apps.apple.com/jp/app/kyash/id1084264883?l=ja
  - Kyashのユーザー登録をする
  - Kyashにクレジットカードを登録する または コンビニでKyashのアカウントにチャージする
  - Kyashでyuisekiを検索する または 以下のリンクをスマートフォンで開く
    - kyash://qr/u/4235924052635520477
  - 任意の額を送金する




# このプロジェクトを開発する方法

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
### Linux/Windowsの場合
```
npm install -g firebase-tools
firebase login
```

### macOSの場合
```
curl -sL firebase.tools | bash
firebase login
```

## GOOGLE_APPLICATION_CREDENTIALS環境変数をセットする
  - `news-mapper/key.json` というファイルが必要
  - Windows 10 の場合
    - `$env:GOOGLE_APPLICATION_CREDENTIALS="C:\Users\yuise\crisis-news-mapper\key.json"`
  - macOS の場合
    - `export GOOGLE_APPLICATION_CREDENTIALS="/Users/yuiseki/src/github.com/yuiseki/crisis-news-mapper/key.json"`


## 依存関係をインストール
```
npm run setup
```

## 開発環境で起動
```
npm run start
```

## ブラウザで確認
  - http://localhost:5000/

## テストの実行
```
cd functions
npm test
```
