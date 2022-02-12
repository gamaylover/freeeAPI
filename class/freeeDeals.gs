/**
 * 取引一覧に関するクラス
 * @extends {ApiRequest} 
 * 
 * getURL
 * 
 */

/* = = = = = = = = = = = = = = = = = = = = = = = = = = = = */


class Deals extends ApiRequest {

  /**
   * 取引一覧操作のためのURLを定義するコンストラクタ
   * @constructor
   * @params  {integer}  company_id
   */

  constructor(company_id) {
    super();
    this.url = this.urlAccount + 'deals';
    this.company_id = company_id;
    this.queries = {
      partner_id: '',
      account_item_id: '',
      partner_code: '',
      status: '',
      type: '',
      start_issue_date: '',
      end_issue_date: '',
      start_due_date: '',
      end_due_date: '',
      start_renew_date: '',
      end_renew_date: '',
      offset: '',
      limit: '',
      registered_from: '',
      accruals:''
    }
  }

  /**
   * 指定した条件の取引一覧のリクエストURLを返すメソッド
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
}