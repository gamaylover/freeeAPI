/**
 * ユーザープロパティにfreee認証に必要なクライアントID・クライアントシークレットを格納する関数
 */

function setClientInfo() {
  Properties.clearProperties();
  Properties.addUserProperty('CLIENT_ID', 'クライアントID');
  Properties.addUserProperty('CLIENT_SECRET', 'クライアントシークレット');
}
