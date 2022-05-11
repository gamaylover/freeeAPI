/**
 * class Receipts
 * freeeファイルボックスに関するクラス
 * 
 * プロパティ
 * apiRequest - freeeAPIリクエストオブジェクト
 * url - リクエストURL
 * company_id - 事業所ID
 * queries - 絞り込み条件
 * 
 * メソッド
 * getURL() - 指定した条件のファイルボックスのリクエストURLを返すメソッド
 * postReceipt(receipt, description, issue_date) - ファイルボックスに指定したファイルをアップロードするメソッド
 * 
 * リファレンス
 * https://developer.freee.co.jp/docs/accounting/reference#/Partners
 * 
 */

/* = = = = = = = = = = = = = = = = = = = = = = = = = = = = */

class Receipts {

  /**
   * ファイルボックス操作のためのリクエストURLを定義するコンストラクタ
   * @constructor
   * @parama  {string}  accessToken - アクセストークン
   * @params  {number}  company_id - 事業所ID
   */

  constructor(accessToken, company_id) {
    this.apiRequest = new ApiRequest(accessToken);
    this.url = this.apiRequest.urlAccount + 'api/1/receipts';
    this.company_id = company_id;
    this.queries = {
      start_date: '',
      end_date: '',
      user_name: '',
      number: '',
      comment_type: '',
      comment_important: '',
      category: '',
      offset: '',
      limit: '3000' // 取得レコードの件数 (デフォルト: 50, 最小: 1, 最大: 3000)
    }
  }

  /**
   * 指定した条件のファイルボックスのリクエストURLを返すメソッド
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
   * ファイルボックスに指定したファイルをアップロードするメソッド
   * @parama  {Blob}  receipt - ファイルボックスにアップロードしたいファイル（Blob形式）
   * @parama  {string}  description - メモ (255文字以内)
   * @parama  {string}  issue_date - 取引日 (yyyy-MM-dd)
   * @return  {HTTPResponse}   response  - ファイルボックスへのアップロード結果に関するレスポンス
   */

  postReceipt(receipt, description = '', issue_date = '') {
    const url = this.url;
    const payload = {
      company_id: this.company_id.toString(),
      description: description,
      issue_date: issue_date,
      receipt: receipt
    };
    delete this.apiRequest.paramsPost.contentType;
    this.apiRequest.paramsPost.headers.accept = 'application/json';
    this.apiRequest.paramsPost.headers.contentType = 'multipart/form-data';
    this.apiRequest.paramsPost.payload = payload;
    this.apiRequest.paramsPost.muteHttpExceptions = true;
    const response = this.apiRequest.fetchResponse(url, this.apiRequest.paramsPost);
    return response;
  }
}

/**
 * freeeファイルボックスクラスのインスタンスを生成するファクトリ関数
 * @params  {string}  accessToken - アクセストークン
 * @params  {number}  company_id - 事業所ID
 * @return  {Partners}  freeeファイルボックスオブジェクト
 */

function receipts(accessToken, company_id) {
  return new Receipts(accessToken, company_id);
}
