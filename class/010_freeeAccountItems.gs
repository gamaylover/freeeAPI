/**
 * class AccountItems
 * freee勘定科目一覧に関するクラス
 * 
 * プロパティ
 * apiRequest - freeeAPIリクエストオブジェクト
 * url - リクエストURL
 * company_id - 事業所ID
 * queries - 絞り込み条件
 * 
 * メソッド
 * getURL() - 指定した条件の勘定科目一覧のリクエストURLを返すメソッド
 * getAllAccountItems() - 勘定科目一覧を全てを配列で取得するメソッド
 * getAccountItemId(accountItem_name) - 指定した名前の勘定科目のIDを返すメソッド
 * mapIdName() - freeeAPIのIDと勘定科目名が列挙されたMapオブジェクトを生成するメソッド
 * updateAccountItemsSheet(sheetName) - アクティブなスプレッドシートのシート名で指定したシートの勘定科目一覧を更新するメソッド
 * 
 */

/* = = = = = = = = = = = = = = = = = = = = = = = = = = = = */

class AccountItems {

  /**
   * 勘定科目一覧操作のためのリクエストURLを定義するコンストラクタ
   * @constructor
   * @parama  {string}  accessToken - アクセストークン
   * @params  {number}  company_id - 事業所ID
   */

  constructor(accessToken, company_id) {
    this.apiRequest = new ApiRequest(accessToken);
    this.url = this.apiRequest.urlAccount + 'api/1/account_items';
    this.company_id = company_id;
    this.queries = {
      base_date: ''
    }
  }

  /**
   * 指定した条件の勘定科目一覧のリクエストURLを返すメソッド
   * @return  {string}  url - 勘定科目一覧リクエストURL
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
   * 勘定科目一覧を配列で取得するメソッド
   * @return  {Array.<Object>}   aryAccountItems - freee勘定科目オブジェクトの一覧を格納した配列
   */

  getAllAccountItems() {
    const url = this.getURL();
    const paramsGet = this.apiRequest.paramsGet;
    const aryAccountItems = this.apiRequest.fetchResponse(url, paramsGet).account_items;
    return aryAccountItems;
  }

  /**
   * 指定した名前の勘定科目のIDを返すメソッド
   * @param   {string}  accountItem_name - 勘定科目名
   * @return  {number}  accountItem_id - 勘定科目ID
   */

  getAccountItemId(accountItem_name) {
    const aryAccountItems = this.getAllAccountItems();
    const accountItem = aryAccountItems.filter(accountItem => accountItem.name === accountItem_name);
    if (accountItem.length === 0) { throw new Error('該当する勘定科目がありません') };
    if (accountItem.length === 1) { return accountItem[0].id };
  }


  /**
   * freeeAPIのIDと勘定科目名が列挙されたMapオブジェクトを生成するメソッド
   * @return  {Array.<Map>}   mapIdName - freeeAPIのIDと勘定科目名が列挙されたMapオブジェクト
   */

  mapIdName() {
    const aryAccountItems = this.getAllAccountItems();
    const mapIdName = new Map();
    aryAccountItems.forEach(accountItem => mapIdName.set(accountItem.id, accountItem.name));
    return mapIdName;
  }

  /**
   * アクティブなスプレッドシートのシート名で指定したシートの勘定科目一覧を更新するメソッド
   * @param   {string}  sheetName - 勘定科目一覧を更新したいシート名
   * @return  {SpreadsheetApp.Range} データ更新した範囲のRangeオブジェクト
   */

  updateAccountItemsSheet(sheetName) {
    
    const aryAccountItems = this.getAllAccountItems();
    const objHeader = {
      id: '勘定科目ID',
      name: '勘定科目名(30文字以内)',
      tax_code: '税区分コード',
      shortcut: 'ショートカット1(20文字以内)',
      shortcut_num: 'ショートカット2(勘定科目コード)(20文字以内)',
      default_tax_id: 'デフォルト設定がされている税区分ID',
      default_tax_code: 'デフォルト設定がされている税区分コード',
      account_category: '勘定科目カテゴリー',
      account_category_id: '勘定科目のカテゴリーID',
      categories: '勘定科目カテゴリー',
      available: '勘定科目の使用設定（true:使用する、false:使用しない）',
      walletable_id: '口座ID',
      group_name: '決算書表示名（小カテゴリー）',
      group_id: '決算書表示名ID',
      corresponding_income_name: '収入取引相手勘定科目名',
      corresponding_income_id: '収入取引相手勘定科目ID',
      corresponding_expense_name: '支出取引相手勘定科目名',
      corresponding_expense_id: '支出取引相手勘定科目ID'
    };

    const headerKeys = Object.keys(objHeader);
    const headerValues = headerKeys.map(key => objHeader[key]);
    const ary2D = aryAccountItems.map(obj => headerKeys.map(key => obj[key]));
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
 * freee勘定科目一覧クラスのインスタンスを生成するファクトリ関数
 * @params  {string}  accessToken - アクセストークン
 * @params  {number}  company_id - 事業所ID
 * @return  {AccountItems}  freee勘定科目一覧オブジェクト
 */

function accountItems(accessToken, company_id) {
  return new AccountItems(accessToken, company_id);
}






