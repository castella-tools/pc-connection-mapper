# PC Connection Mapper 公開版

このフォルダは、一般ユーザー向けにWeb公開するための静的サイト一式です。

## 利用者側に必要なもの

- Chrome / Edge / Firefox / Safari などのWebブラウザ
- PythonやNode.jsのインストールは不要です

## 公開方法

### GitHub Pages
1. GitHubで新しいリポジトリを作成
2. このフォルダ内のファイルをすべてアップロード
3. Settings → Pages
4. Deploy from a branch を選択
5. Branch: main / root を指定
6. 発行されたURLを利用者に共有

### Cloudflare Pages
このフォルダを静的サイトとしてアップロードすれば公開できます。

## PWA

公開URLをChrome/Edgeなどで開くと、対応環境では
「アプリをインストール」からPC Connection Mapperをアプリ風にインストールできます。

一度読み込んだ後は、Service Workerによりオフラインでも利用しやすい構成です。

## 保存

構成データは各利用者のブラウザ内（LocalStorage）に自動保存されます。
データは運営者のサーバーには送信されません。

バックアップにはJSON保存を利用できます。
