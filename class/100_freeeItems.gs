/**
 * class Items
 * freee品目一覧に関するクラス
 * 
 * プロパティ
 * apiRequest - freeeAPIリクエストオブジェクト
 * url - リクエストURL
 * company_id - 事業所ID
 * 
 * メソッド
 * getURL() - 指定した条件の品目一覧のリクエストURLを返すメソッド
 * getAllItems() - 品目一覧を配列で取得するメソッド
 * mapIdName() - freeeAPIのIDと品目名が列挙されたMapオブジェクトを生成するメソッド
 * getIdByName(name) - 品目名からfreeeAPIのIDを取得するメソッド
 * getItems2Sheet(sheetName) - アクティブなスプレッドシートのシート名で指定したシートの品目一覧を更新するメソッド
 *  
 */


/* = = = = = = = = = = = = = = = = = = = = = = = = = = = = */


class Items {

  /**
   * 品目操作のためのリクエストURLを定義するコンストラクタ
   * @constructor
   * @parama  {string}  accessToken - アクセストークン
   * @params  {number}  company_id - 事業所ID
   */

  constructor(accessToken, company_id) {
    this.apiRequest = new ApiRequest(accessToken);
    this.url = this.apiRequest.urlAccount + 'api/1/items';
    this.company_id = company_id;
    this.queries = {
      start_update_date: '',
      end_update_date: '',
      offset: '',
      limit: 3000
    }
  }

  /**
   * 指定した条件の品目一覧のリクエストURLを返すメソッド
   * @return  {string}  url - 品目一覧リクエストURL
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
   * 品目一覧を全てを配列で取得するメソッド
   * @return  {Array.<Object>}   aryItems  freee品目オブジェクトの一覧を格納した配列
   */

  getAllItems() {

    /* QUERY 絞り込み条件：取得レコードの件数上限のデータ型を変換 */
    let limit = Number();
    if (typeof this.queries.limit === 'number') { limit = this.queries.limit };
    if (typeof this.queries.limit === 'string') { limit = Number(this.queries.limit) };
    this.queries.limit = limit.toString();

    /* 指定した条件の品目オブジェクト一覧を配列で取得 */

    // 品目オブジェクト一覧を格納する空の配列
    let aryItems = [];

    // 品目取得件数の上限以上の品目の登録がある場合にオフセット（ずらし）を行い全件を取得
    for (let offset = 0; offset === aryItems.length; offset += limit) {
      this.queries.offset = offset;
      const url = this.getURL();
      const paramsGet = this.apiRequest.paramsGet;
      const ary = this.apiRequest.fetchResponse(url, paramsGet).items;
      aryItems = aryItems.concat(ary);
      Utilities.sleep(300);
    }
    return aryItems;
  }

  /**
   * freeeAPIのIDと品目名ペアとなったMapオブジェクトを生成するメソッド
   * @return  {Array.<Map>}   mapIdName - freeeAPIのIDと品目名が列挙されたMapオブジェクト
   */

  mapIdName() {
    const aryItems = this.getAllItems();
    const mapIdName = new Map();
    aryItems.forEach(item => mapIdName.set(item.id, item.name));
    return mapIdName;
  }

  /**
   * 品目名からfreeeAPIのIDを取得するメソッド
   * @param   {string}  name - 品目名
   * @return  {string}  id - 品目ID
   */

  getIdByName(name) {
    const mapIdName = this.mapIdName();
    const id = MapObject.convertValue2Key(mapIdName, name);
    return id;
  }

  /**
   * アクティブなスプレッドシートのシート名で指定したシートの品目一覧を更新するメソッド
   * @param   {string}  sheetName - 品目一覧を更新したいシート名
   * @return  {SpreadsheetApp.Range} データ更新した範囲のRangeオブジェクト
   */

  getItems2Sheet(sheetName) {

    const aryItems = this.getAllItems();
    const objHeader = {
      id: '品目ID',
      company_id: '事業所ID',
      name: '品目名(30文字以内)',
      update_date: '更新日(yyyy-MM-dd)',
      available: '品目の使用設定（true: 使用する、false: 使用しない）',
      shortcut1: 'ショートカット1 (255文字以内)',
      shortcut2: 'ショートカット2 (255文字以内)'
    };

    const headerKeys = Object.keys(objHeader);
    const headerValues = headerKeys.map(key => objHeader[key]);
    const ary2D = aryItems.map(obj => headerKeys.map(key => obj[key]));
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
 * freee品目一覧クラスのインスタンスを生成するファクトリ関数
 * @params  {string}  accessToken - アクセストークン
 * @params  {number}  company_id - 事業所ID
 * @return  {Items}  freee品目一覧オブジェクト
 */

function items(accessToken, company_id) {
  return new Items(accessToken, company_id);
}

