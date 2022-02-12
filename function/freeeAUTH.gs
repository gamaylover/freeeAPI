// OAuth2ライブラリ
// 1B7FSrk5Zi6L1rSxxTDgDEUsPzlukDsi4KGuTMorsTQHhGBzBkMun4iDF

/* freeeAPI */
const CLIENT_ID = PropertiesService.getUserProperties().getProperty('CLIENT_ID')
const CLIENT_SECRET = PropertiesService.getUserProperties().getProperty('CLIENT_SECRET');

/**
 * freeeの認証用URLをダイアログボックスに表示させる関数
 */

function freeeAUTH() {

  //認証URLを取得
  const authUrl = getService().getAuthorizationUrl();
  const ui = SpreadsheetApp.getUi();
  ui.alert(`認証用URLをブラウザに貼り付けて認証を完了してください。\n ${authUrl}`, ui.ButtonSet.OK);

}

//freeeAPIのサービスを取得する関数
function getService() {
  return OAuth2.createService('freee')
    .setAuthorizationBaseUrl('https://accounts.secure.freee.co.jp/public_api/authorize')
    .setTokenUrl('https://accounts.secure.freee.co.jp/public_api/token')
    .setClientId(CLIENT_ID)
    .setClientSecret(CLIENT_SECRET)
    .setCallbackFunction('authCallback')
    .setPropertyStore(PropertiesService.getUserProperties())
}

//認証コールバック関数
function authCallback(request) {
  const service = getService();
  const isAuthorized = service.handleCallback(request);
  if (isAuthorized) {
    return HtmlService.createHtmlOutput('認証に成功しました。タブを閉じてください。');
  } else {
    return HtmlService.createHtmlOutput('認証に失敗しました。');
  };
}

