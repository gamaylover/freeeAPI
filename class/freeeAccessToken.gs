/**
 * class AccessToken
 * アクセストークン取得に関するクラス
 * 
 * getMyAccessToken
 * getService_
 * 
 */

/* = = = = = = = = = = = = = = = = = = = = = = = = = = = = */

class AccessToken {

  /**
   * clientId,clientSecretプロパティを定義するコンストラクタ
   * @constructor
   */

  constructor() {
    this.clientId = PropertiesService.getUserProperties().getProperty('CLIENT_ID')
    this.clientSecret = PropertiesService.getUserProperties().getProperty('CLIENT_SECRET');
  }

  /**
   * アクセストークンを取得するメソッド
   * @return {string} アクセストークン
   */

  getMyAccessToken() {
    return this.getService_().getAccessToken();
  }

  /**
   * OAuth2ライブラリからオブジェクトを取得するメソッド
   * @return {Object} freeeOAuthオブジェクト
   */

  getService_() {
    return OAuth2.createService('freee')
      .setAuthorizationBaseUrl('https://accounts.secure.freee.co.jp/public_api/authorize')
      .setTokenUrl('https://accounts.secure.freee.co.jp/public_api/token')
      .setClientId(this.clientId)
      .setClientSecret(this.clientSecret)
      .setCallbackFunction('authCallback')
      .setPropertyStore(PropertiesService.getUserProperties());
  }

}
