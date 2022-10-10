---
title: "Todo リスト"
date: "2022-10-10"
category: "todo"
toc: "none"
---

## 機能追加したいものリスト

- [x] ドキュメント一覧に表示しないもの(exclude)を設定できるようにする
- [x] ドキュメントサーチ機能の改善
  - [x] 検索hit件数を表示
  - [x] bug: セットしたcategory検索オプションが残り続ける
  - [x] CategoryとTagのautocompleteをcase insensitiveにソートする
  - [x] 全文検索(lunr)がうまく動いていない問題の解消
- [x] バンドルサイズの縮小
- [x] Tagボタンのリンク化
- [ ] Refactoring
  - [x] style.scssで`@include mat.all-component-themes`を使用して不必要なスタイルもすべてincludeしていたのを、必要な分だけincludeするように変更
  - [x] loading componentのNGRX対応
  - [x] Lazy loading対応
  - [x] markdownのtableが表示できていない: <https://takumura.github.io/tech-log/doc/angular/fluent-ui-web-components-with-angular>
  - [x] scssの色指定を変数化する
  - [ ] 大きすぎるファイルをutilやserviceに分割する
  - [ ] mobileの見た目を調整
- [ ] markdown-document displayコンポーネントのレイアウトをcss gridからflexに変更

## サイトの更新

- [ ] Welcome
- [ ] Getting Started
- [ ] Features - 標準的なmarkdownシンタックス
- [ ] Features - カスタムシンタックス
