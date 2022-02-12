/**
 * class ApiRequest
 * APIリクエストに関するクラス
 * 
 * プロパティ
 * accessToken
 * urlAccount
 * paramsGet
 * paramsPost
 * paramsPut
 * 
 * メソッド
 * fetchResponse
 * 
 */

/* = = = = = = = = = = = = = = = = = = = = = = = = = = = = */

class ApiRequest {

  /**
   * APIリクエストのための各プロパティを定義するコンストラクタ
   * @constructor
   */
  constructor() {
    this.accessToken = new AccessToken().getMyAccessToken();
    this.urlAccount = 'https://api.freee.co.jp/api/1/';

    this.paramsGet = {
      headers: { Authorization: `Bearer ${this.accessToken}` },
      method: 'get'
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
   * @return  {object}  JSONオブジェクト 
   */
  fetchResponse(url, params) {
    const response = UrlFetchApp.fetch(url, params).getContentText();
    return JSON.parse(response);
  }

}

