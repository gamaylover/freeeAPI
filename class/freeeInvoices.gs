/**
 * 請求書一覧に関するクラス
 * @extends {ApiRequest} 
 * 
 * getURL
 * 
 */

/* = = = = = = = = = = = = = = = = = = = = = = = = = = = = */


class Invoices extends ApiRequest {

  /**
   * 請求書操作のためのURLを定義するコンストラクタ
   * @constructor
   * @params  {integer}  company_id
   */

  constructor(company_id) {
    super();
    this.url = this.urlAccount + 'invoices';
    this.company_id = company_id;
    this.queries = {
      partner_id: '',
      partner_code: '',
      start_issue_date: '',
      end_issue_date: '',
      start_due_date: '',
      end_due_date: '',
      start_renew_date: '',
      end_renew_date: '',
      invoice_number: '',
      description: '',
      invoice_status: '',
      payment_status: '',
      offset: '',
      limit: ''
    }
  }

  /**
   * 指定した条件の請求書のリクエストURLを返すメソッド
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