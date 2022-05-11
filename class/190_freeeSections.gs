/**
 * class Sections
 * freee部門一覧に関するクラス
 * 
 * プロパティ
 * apiRequest - freeeAPIリクエストオブジェクト
 * url - リクエストURL
 * company_id - 事業所ID
 * 
 * メソッド
 * getURL() - 指定した条件の部門一覧のリクエストURLを返すメソッド
 * getAllSections() - 部門一覧を配列で取得するメソッド
 * mapIdName() - freeeAPIのIDと部門名が列挙されたMapオブジェクトを生成するメソッド
 * updateSectionsSheet(sheetName) - アクティブなスプレッドシートのシート名で指定したシートの部門一覧を更新するメソッド
 * 
 */

/* = = = = = = = = = = = = = = = = = = = = = = = = = = = = */


class Sections {

  /**
   * 部門一覧操作のためのリクエストURLを定義するコンストラクタ
   * @constructor
   * @parama  {string}  accessToken - アクセストークン
   * @params  {number}  company_id - 事業所ID
   */

  constructor(accessToken, company_id) {
    this.apiRequest = new ApiRequest(accessToken);
    this.url = this.apiRequest.urlAccount + 'api/1/sections';
    this.company_id = company_id;
  }

  /**
   * 指定した条件の部門一覧のリクエストURLを返すメソッド
   * @return  {string}  url - 部門一覧リクエストURL
   */

  getURL() {
    const url = `${this.url}?` + `company_id=${this.company_id}`;
    return url;
  }

  /**
   * 部門一覧を全てを配列で取得するメソッド
   * @return  {Array.<Object>}   arySections - freee部門オブジェクトの一覧を格納した配列
   */

  getAllSections() {
    const url = this.getURL();
    const paramsGet = this.apiRequest.paramsGet;
    const arySections = this.apiRequest.fetchResponse(url, paramsGet).sections;
    return arySections;
  }

  /**
   * freeeAPIのIDと部門名が列挙されたMapオブジェクトを生成するメソッド
   * @return  {Array.<Map>}   mapIdName - freeeAPIのIDと部門名が列挙されたMapオブジェクト
   */

  mapIdName() {
    const arySections = this.getAllSections();
    const mapIdName = new Map();
    arySections.forEach(section => mapIdName.set(section.id, section.name));
    return mapIdName;
  }

  /**
   * アクティブなスプレッドシートのシート名で指定したシートの部門一覧を更新するメソッド
   * @param   {string}  sheetName - 部門一覧を更新したいシート名
   * @return  {SpreadsheetApp.Range} データ更新した範囲のRangeオブジェクト
   */

  updateSectionsSheet(sheetName) {
    
    const arySections = this.getAllSections();
    const objHeader = {
      id: '部門ID',
      name: '部門名 (30文字以内)',
      available: '部門の使用設定（true: 使用する、false: 使用しない）',
      long_name: '正式名称（255文字以内）',
      company_id: '事業所ID',
      shortcut1: 'ショートカット１ (20文字以内)',
      shortcut2: 'ショートカット２ (20文字以内)',
      indent_count: '部門階層',
      parent_id: '親部門ID'
    };

    const headerKeys = Object.keys(objHeader);
    const headerValues = headerKeys.map(key => objHeader[key]);
    const ary2D = arySections.map(obj => headerKeys.map(key => obj[key]));
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
 * freee部門一覧クラスのインスタンスを生成するファクトリ関数
 * @params  {string}  accessToken - アクセストークン
 * @params  {number}  company_id - 事業所ID
 * @return  {Sections}  freee部門一覧オブジェクト
 */

function sections(accessToken, company_id) {
  return new Sections(accessToken, company_id);
}
