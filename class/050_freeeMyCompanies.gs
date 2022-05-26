/**
 * class MyCompanies
 * freee事業所情報に関するクラス
 * 
 * プロパティ
 * apiRequest - freeeAPIリクエストオブジェクト
 * url - リクエストURL
 * 
 * メソッド
 * getMyCompanies() - 全ての事業所情報を配列で返すメソッド
 * getMyCompanyId(company_name) - 指定した名称の事業所IDを返すメソッド
 * getMyCompanies2Sheet(sheetName) - 指定したシート名のシートに事業所情報一覧を取得するメソッド
 * 
 */

/* = = = = = = = = = = = = = = = = = = = = = = = = = = = = */

class MyCompanies {

  /**
   * 事業所情報取得のためのリクエストURLを定義するコンストラクタ
   * @constructor
   * @parama  {string}  accessToken - アクセストークン
   */

  constructor(accessToken) {
    this.apiRequest = new ApiRequest(accessToken);
    this.url = this.apiRequest.urlAccount + 'api/1/companies';
  }

  /**
   * 全ての事業所情報を配列で返すメソッド
   * @return  {Array.<Object>}  aryCompanies - 全ての事業所オブジェクトを格納した配列
   */

  getMyCompanies() {
    const objCompanies = this.apiRequest.fetchResponse(this.url, this.apiRequest.paramsGet);
    const aryCompanies = objCompanies.companies;
    return aryCompanies;
  }

  /**
   * 指定した名称の事業所IDを返すメソッド
   * @param   {string}  company_name - 事業所名（表示名）
   * @return  {number}  company_id - 事業所ID
   */

  getMyCompanyId(company_name) {
    const aryCompanies = this.getMyCompanies();
    const company = aryCompanies.filter(company => company.display_name === company_name);
    if (company.length === 0) { throw new Error('該当する事業所がありません') };
    if (company.length === 1) { return company[0].id };
  }

  /**
   * 指定したシート名のシートに事業所情報一覧を取得するメソッド
   * @param   {string}  sheetName - 事業所情報を更新したいシート名
   * @return  {SpreadsheetApp.Range} データ更新した範囲のRangeオブジェクト
   */

  getMyCompanies2Sheet(sheetName) {
    
    const aryCompanies = this.getMyCompanies();
    const objHeader = {
      id: '事業所ID',
      name: '事業所名',
      name_kana: '事業所名（カナ）',
      display_name: '事業所名（表示名）',
      role: '実行ユーザー権限'
    };

    const headerKeys = Object.keys(objHeader);
    const headerValues = headerKeys.map(key => objHeader[key]);
    const ary2D = aryCompanies.map(obj => headerKeys.map(key => obj[key]));
    ary2D.unshift(headerValues);

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(sheetName);
    sheet.getDataRange().clearContent();
    const range = sheet.getRange(1, 1, ary2D.length, ary2D[0].length);
    return range.setValues(ary2D);

  }

}

/**
 * freee事業所情報クラスのインスタンスを生成するファクトリ関数
 * @params  {string}  accessToken - アクセストークン
 * @return  {MyCompanies}  freee事業所情報オブジェクト
 */

function myCompanies(accessToken) {
  return new MyCompanies(accessToken);
}
