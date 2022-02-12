/**
 * 勘定科目一覧に関するクラス
 * @extends {ApiRequest} 
 * 
 * リファレンス
 * https://developer.freee.co.jp/docs/accounting/reference#/Account%2520items
 * 
 * 継承プロパティ
 * accessToken
 * urlAccount
 * paramsGet
 * paramsPost
 * paramsPut
 * 
 * プロパティ
 * url
 * company_id
 * queries
 * 
 * メソッド
 * getURL
 * getAllAccountItems
 * 
 */

/* = = = = = = = = = = = = = = = = = = = = = = = = = = = = */


class AccountItems extends ApiRequest {

  /**
   * 勘定科目一覧操作のためのURLを定義するコンストラクタ
   * @constructor
   * @params  {integer}  company_id
   */

  constructor(company_id) {
    super();
    this.url = this.urlAccount + 'account_items';
    this.company_id = company_id;
    this.queries = {
      base_date: ''
    }
  }

  /**
   * 指定した条件の勘定科目一覧のリクエストURLを返すメソッド
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
   * 勘定科目一覧を全てを配列で取得するメソッド
   * @return  {array}   aryAccountItems  freee勘定科目オブジェクトの一覧を格納した配列
   */

  getAllAccountItems() {
    const url = this.getURL();
    const paramsGet = this.paramsGet;
    const aryAccountItems = this.fetchResponse(url, paramsGet).account_items;
    return aryAccountItems;
  }
}