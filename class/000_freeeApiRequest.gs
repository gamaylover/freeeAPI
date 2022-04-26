/**
 * class ApiRequest
 * APIリクエストに関するクラス
 * 
 * プロパティ
 * accessToken - アクセストークン
 * urlAccount - freee会計共通APIエンドポイント 
 * paramsGet - GETリクエスト用パラメータ
 * paramsPost - POSTリクエスト用パラメータ
 * paramsPut - PUTリクエスト用パラメータ
 * 
 * メソッド
 * fetchResponse(url, params)  - レスポンスのJSONをオブジェクトで返すメソッド
 * 
 * freee公式リファレンス
 * https://developer.freee.co.jp/docs/accounting/reference
 */

/* = = = = = = = = = = = = = = = = = = = = = = = = = = = = */

class ApiRequest {

  /**
   * APIリクエストのための各プロパティを定義するコンストラクタ
   * @constructor
   */
  constructor(accessToken) {
    this.accessToken = accessToken;
    this.urlAccount = 'https://api.freee.co.jp/';

    this.paramsGet = {
      headers: { Authorization: `Bearer ${this.accessToken}` },
      method: 'get',
      muteHttpExceptions: false
    }

    this.paramsPost = {
      contentType: 'application/json',
      headers: { Authorization: `Bearer ${this.accessToken}` },
      method: 'post',
      payload: '',
      muteHttpExceptions: false
    }

    this.paramsPut = {
      contentType: 'application/json',
      headers: { Authorization: `Bearer ${this.accessToken}` },
      method: 'put',
      payload: '',
      muteHttpExceptions: false
    }
  }

  /**
   * レスポンスのJSONをオブジェクトで返すメソッド
   * @param   {string}  url
   * @param   {string}  params
   * @return  {Object}  JSONオブジェクト 
   */
  fetchResponse(url, params) {
    const response = UrlFetchApp.fetch(url, params).getContentText();
    return JSON.parse(response);
  }

}

