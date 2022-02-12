/**
 * 取引先一覧に関するクラス
 * @extends {ApiRequest} 
 * 
 * リファレンス
 * https://developer.freee.co.jp/docs/accounting/reference#/Partners
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
 * getAllPartners
 * 
 */

/* = = = = = = = = = = = = = = = = = = = = = = = = = = = = */


class Partners extends ApiRequest {

  /**
   * 取引先操作のためのURLを定義するコンストラクタ
   * @constructor
   * @params  {integer}  company_id
   */

  constructor(company_id) {
    super();
    this.url = this.urlAccount + 'partners';
    this.company_id = company_id;
    this.queries = {
      start_update_date: '',
      end_update_date: '',
      offset: '',
      limit: '',
      keyword: ''
    }
  }

  /**
   * 指定した条件の取引先一覧のリクエストURLを返すメソッド
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
   * 取引先一覧を全てを配列で取得するメソッド
   * @return  {array}   aryPartners  freee取引先オブジェクトの一覧を格納した配列
   */

  getAllPartners() {

    /* QUERY 絞り込み条件：取引先取得件数の上限を指定 */
    const limit = 3000; // 取得レコードの件数 (デフォルト: 50, 最小: 1, 最大: 3000)
    this.queries.limit = limit.toString();

    /* 指定した条件の取引先オブジェクト一覧を配列で取得 */

    // 取引先オブジェクト一覧を格納する空の配列
    let aryPartners = [];

    // 取引先取得件数の上限以上の取引先の登録がある場合にオフセット（ずらし）を行い全件を取得
    for (let offset = 0; offset === aryPartners.length; offset += limit) {
      this.queries.offset = offset;
      const url = this.getURL();
      const paramsGet = this.paramsGet;
      const ary = this.fetchResponse(url, paramsGet).partners;
      aryPartners = aryPartners.concat(ary);
      Utilities.sleep(1000);
    }
    return aryPartners;
  }
}




