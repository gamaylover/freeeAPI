/**
 * 勘定科目一覧に関するクラス
 * @extends {ApiRequest} 
 * 
 * リファレンス
 * https://developer.freee.co.jp/docs/accounting/reference#/Sections
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
 * 
 * メソッド
 * getURL
 * getAllSections
 * 
 */

/* = = = = = = = = = = = = = = = = = = = = = = = = = = = = */


class Sections extends ApiRequest {

  /**
   * 勘定科目一覧操作のためのURLを定義するコンストラクタ
   * @constructor
   * @params  {integer}  company_id
   */

  constructor(company_id) {
    super();
    this.url = this.urlAccount + 'sections';
    this.company_id = company_id;
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
   * @return  {array}   arySections  freee勘定科目オブジェクトの一覧を格納した配列
   */

  getAllSections() {
    const url = this.getURL();
    const paramsGet = this.paramsGet;
    const arySections = this.fetchResponse(url, paramsGet).sections;
    return arySections;
  }
}