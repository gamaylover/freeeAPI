/**
 * class Tags
 * freeeメモタグ一覧に関するクラス
 * 
 * プロパティ
 * apiRequest - freeeAPIリクエストオブジェクト
 * url - リクエストURL
 * company_id - 事業所ID
 * 
 * メソッド
 * getURL() - 指定した条件のメモタグ一覧のリクエストURLを返すメソッド
 * getAllTags() - メモタグ一覧を配列で取得するメソッド
 * mapIdName() - freeeAPIのIDとメモタグ名が列挙されたMapオブジェクトを生成するメソッド
 * getTags2Sheet(sheetName) - アクティブなスプレッドシートのシート名で指定したシートのメモタグ一覧を更新するメソッド
 *  
 */


/* = = = = = = = = = = = = = = = = = = = = = = = = = = = = */


class Tags {

  /**
   * メモタグ操作のためのリクエストURLを定義するコンストラクタ
   * @constructor
   * @parama  {string}  accessToken - アクセストークン
   * @params  {number}  company_id - 事業所ID
   */

  constructor(accessToken, company_id) {
    this.apiRequest = new ApiRequest(accessToken);
    this.url = this.apiRequest.urlAccount + 'api/1/tags';
    this.company_id = company_id;
    this.queries = {
      start_update_date: '',
      end_update_date: '',
      offset: '',
      limit: '3000' // 取得レコードの件数 (デフォルト: 50, 最小: 1, 最大: 3000)
    }
  }

  /**
   * 指定した条件のメモタグ一覧のリクエストURLを返すメソッド
   * @return  {string}  url - メモタグ一覧リクエストURL
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
   * メモタグ一覧を全てを配列で取得するメソッド
   * @return  {Array.<Object>}   aryTags  freeeメモタグオブジェクトの一覧を格納した配列
   */

  getAllTags() {

    /* QUERY 絞り込み条件：取得レコードの件数上限のデータ型を変換 */
    let limit = Number();
    if (typeof this.queries.limit === 'number') { limit = this.queries.limit };
    if (typeof this.queries.limit === 'string') { limit = Number(this.queries.limit) };
    this.queries.limit = limit.toString();

    /* 指定した条件のメモタグオブジェクト一覧を配列で取得 */

    // メモタグオブジェクト一覧を格納する空の配列
    let aryTags = [];

    // メモタグ取得件数の上限以上のメモタグの登録がある場合にオフセット（ずらし）を行い全件を取得
    for (let offset = 0; offset === aryTags.length; offset += limit) {
      this.queries.offset = offset;
      const url = this.getURL();
      const paramsGet = this.apiRequest.paramsGet;
      const ary = this.apiRequest.fetchResponse(url, paramsGet).tags;
      aryTags = aryTags.concat(ary);
      Utilities.sleep(300);
    }
    return aryTags;
  }

  /**
   * freeeAPIのIDとメモタグ名が列挙されたMapオブジェクトを生成するメソッド
   * @return  {Array.<Map>}   mapIdName - freeeAPIのIDとメモタグ名が列挙されたMapオブジェクト
   */

  mapIdName() {
    const aryTags = this.getAllTags();
    const mapIdName = new Map();
    aryTags.forEach(tag => mapIdName.set(tag.id, tag.name));
    return mapIdName;
  }

  /**
   * アクティブなスプレッドシートのシート名で指定したシートのメモタグ一覧を更新するメソッド
   * @param   {string}  sheetName - メモタグ一覧を更新したいシート名
   * @return  {SpreadsheetApp.Range} データ更新した範囲のRangeオブジェクト
   */

  getTags2Sheet(sheetName) {
    
    const aryTags = this.getAllTags();
    const objHeader = {
      id: 'タグID',
      company_id: '事業所ID',
      name: 'メモタグ名 (30文字以内)',
      update_date: '更新日(yyyy-MM-dd)',
      shortcut1: 'ショートカット1 (255文字以内)',
      shortcut2: 'ショートカット2 (255文字以内)'
    };

    const headerKeys = Object.keys(objHeader);
    const headerValues = headerKeys.map(key => objHeader[key]);
    const ary2D = aryTags.map(obj => headerKeys.map(key => obj[key]));
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
 * freeeメモタグ一覧クラスのインスタンスを生成するファクトリ関数
 * @params  {string}  accessToken - アクセストークン
 * @params  {number}  company_id - 事業所ID
 * @return  {Tags}  freeeメモタグ一覧オブジェクト
 */

function tags(accessToken, company_id) {
  return new Tags(accessToken, company_id);
}

