/**
 * class Walletables
 * freee口座一覧に関するクラス
 * 
 * プロパティ
 * apiRequest - freeeAPIリクエストオブジェクト
 * url - リクエストURL
 * company_id - 事業所ID
 * queries - 絞り込み条件
 * 
 * メソッド
 * getURL() - 指定した条件の口座一覧のリクエストURLを返すメソッド
 * getAllWalletables() - 全ての口座一覧を配列で取得するメソッド
 * mapIdName() - freeeAPIのIDと口座名が列挙されたMapオブジェクトを生成するメソッド
 * getIdByName(name) - 口座名からfreeeAPIのIDを取得するメソッド
 * getWalletables2Sheet(sheetName) - アクティブなスプレッドシートのシート名で指定したシートの口座一覧を更新するメソッド
 * 
 * 
 */

/* = = = = = = = = = = = = = = = = = = = = = = = = = = = = */


class Walletables {

  /**
   * 口座一覧操作のためのリクエストURLを定義するコンストラクタ
   * @constructor
   * @parama  {string}  accessToken - アクセストークン
   * @params  {number}  company_id - 事業所ID
   */

  constructor(accessToken, company_id) {
    this.apiRequest = new ApiRequest(accessToken);
    this.url = this.apiRequest.urlAccount + 'api/1/walletables';
    this.company_id = company_id;
    this.queries = {
      with_balance: '',
      type: ''
    }
  }

  /**
   * 指定した条件の口座一覧のリクエストURLを返すメソッド
   * @return  {string}  url
   */
  getURL() {
    const baseURL = `${this.url}?`
      + `company_id=${this.company_id}`;

    let paramsURL = '';
    for (const querie in this.queries) {
      const value = this.queries[querie];
      if (value) {
        paramsURL += `&${querie}=${value}`;
      }
    }
    const url = baseURL + paramsURL;
    return url;
  }

  /**
   * 全ての口座一覧を配列で取得するメソッド
   * @return  {Array.<Object>}   aryWalletables  freee口座オブジェクトの一覧を格納した配列
   */

  getAllWalletables() {

    const url = this.getURL();
    const paramsGet = this.apiRequest.paramsGet;
    const aryWalletables = this.apiRequest.fetchResponse(url, paramsGet).walletables;
    return aryWalletables;
  }

  /**
   * freeeAPIのIDと口座名が列挙されたMapオブジェクトを生成するメソッド
   * @return  {Array.<Map>}   mapIdName - freeeAPIのIDと口座名が列挙されたMapオブジェクト
   */

  mapIdName() {
    const aryWallets = this.getAllWalletables();
    const mapIdName = new Map();
    aryWallets.forEach(wallet => mapIdName.set(wallet.id, wallet.name));
    return mapIdName;
  }

  /**
   * freeeAPIの口座IDと口座区分値が列挙されたMapオブジェクトを生成するメソッド
   * @return  {Array.<Map>}   mapIdType - freeeAPIの口座IDと口座区分値が列挙されたMapオブジェクト
   */

  mapIdType() {
    const aryWallets = this.getAllWalletables();
    const mapIdType = new Map();
    aryWallets.forEach(wallet => mapIdType.set(wallet.id, wallet.type));
    return mapIdType;
  }

  /**
   * 口座名からfreeeAPIのIDを取得するメソッド
   * @param   {string}  name - 口座名
   * @return  {string}  id - 口座ID
   */

  getIdByName(name) {
    const mapIdName = this.mapIdName();
    const id = MapObject.convertValue2Key(mapIdName, name);
    return id;
  }

  /**
   * アクティブなスプレッドシートのシート名で指定したシートの口座一覧を更新するメソッド
   * @param   {string}  sheetName - 口座一覧を更新したいシート名
   * @return  {SpreadsheetApp.Range} データ更新した範囲のRangeオブジェクト
   */

  getWalletables2Sheet(sheetName) {

    // freeeAPIのIDと口座区分が列挙されたMapオブジェクト
    const mapWALLET_TYPE = new Enum().WALLET_TYPE;

    // ここから必要なプロパティから値を取り出し、場合によっては変換していくメインの処理
    const aryWalletables = this.getAllWalletables();
    const objHeader = {
      id: '口座ID',
      name: '口座名 (255文字以内)',
      bank_id: 'サービスID',
      type: '口座区分',
      last_balance: '同期残高',
      walletable_balance: '登録残高'
    }

    const headerKeys = Object.keys(objHeader);
    const headerValues = headerKeys.map(key => objHeader[key]);
    const ary2D = aryWalletables.map(obj => headerKeys.map(key => {
      if (objHeader[key] === '口座区分') { return mapWALLET_TYPE.get(obj[key]) };
      return obj[key]
    }));
    ary2D.unshift(headerValues);

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    if (ss.getSheets().filter(sheet => sheet.getName() === sheetName).length === 0) { ss.insertSheet(sheetName, 0); } // 同一のシート名がなければ新規作成する
    const sheet = ss.getSheetByName(sheetName);
    sheet.getDataRange().clearContent();
    const range = sheet.getRange(1, 1, ary2D.length, ary2D[0].length);
    return range.setValues(ary2D);
  }
}

/**
 * freee口座一覧クラスのインスタンスを生成するファクトリ関数
 * @params  {string}  accessToken - アクセストークン
 * @params  {number}  company_id - 事業所ID
 * @return  {Walletables}  freee口座一覧オブジェクト
 */

function walletables(accessToken, company_id) {
  return new Walletables(accessToken, company_id);
}

