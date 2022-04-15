# freeeAPI Library
A library for manipulating the freee API with Google Apps Script.

ノンプログラマー（ITを専門職としない人材）が作成した Google Apps Script（以下GAS）でfreee APIを簡単に操作するためのライブラリです。

[ノンプログラマーのためのスキルアップ研究会](https://tonari-it.com/community-nonpro-semi-2/)（以下ノンプロ研）で受講したfreee API講座の内容をベースに作成しています。

## サポート
開発者のモチベーションアップのためにAmazon欲しい物リストを公開しております。
Amazon欲しい物リスト：
https://www.amazon.jp/hz/wishlist/ls/2SFC0DDCAAH1B?ref_=wl_share

## スクリプトID
1ElufoYGO1vJKDyGawAvpXjkJ5nlH3846eeAEP1mRfUV1LYk8IwfpAfpX

## 使用上の注意
2022/04/14 現在こちらのライブラリはBeta版です（おそらくずっと…）。
本ライブラリを使用したことによって発生したいかなる結果の責任は負いかねますので、使用者の自己責任にてのみご使用ください。

## 事前準備
このライブラリの使用には、freee APIを使用するための連携用のアプリの作成・設定、アプリとGASの認証設定を完了させておく必要があります。
連携用のアプリの作成・設定・認証に関しては、ノンプロ研での講座受講時の講師であるもりさんの以下ブログを参照

[【freee×GAS】GoogleAppsScriptでfreeeAPIと連携認証する（サンプルコードあり）](https://moripro.net/freee-gas-api/)

## 現時点で対応しているAPI
自分自身が使用する機能（API）を中心に実装しています。

- Account items 勘定科目
  - 勘定科目一覧の取得（GET）
- Companies 事業所
  - 事業所一覧の取得（GET）
- Deals 取引（収入／支出）
  - 取引（収入／支出）一覧の取得（GET）
