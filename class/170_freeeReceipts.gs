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
 * getAllReceipts() - 指定した条件の証憑一覧全てを配列で取得するメソッド
 * getReceipts2Sheet(sheetName)  - シート名で指定したシートに証憑一覧を取得するメソッド
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
    const dateAYearAgo = new CalDate().aYearAgo(); // カレンダーの色々な日付を生成するクラスを利用して1年前のDateオブジェクトを取得
    this.queries = {
      start_date: new DateFormat(dateAYearAgo).string, // 1年前から
      end_date: new DateFormat(new Date()).string, // 当日まで
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
   * 指定した条件の証憑一覧全てを配列で取得するメソッド
   * @return  {Array.<Object>}   aryReceipts  freee証憑オブジェクトの一覧を格納した配列
   */

  getAllReceipts() {

    /* QUERY 絞り込み条件：取得レコードの件数上限のデータ型を変換 */
    let limit = Number();
    if (typeof this.queries.limit === 'number') { limit = this.queries.limit };
    if (typeof this.queries.limit === 'string') { limit = Number(this.queries.limit) };
    this.queries.limit = limit.toString();

    /* 指定した条件の証憑オブジェクト一覧を配列で取得 */

    // 証憑オブジェクト一覧を格納する空の配列
    let aryReceipts = [];

    // 証憑取得件数の上限以上の証憑の登録がある場合にオフセット（ずらし）を行い全件を取得
    for (let offset = 0; offset === aryReceipts.length; offset += limit) {
      this.queries.offset = offset;
      const url = this.getURL();
      const paramsGet = this.apiRequest.paramsGet;
      const ary = this.apiRequest.fetchResponse(url, paramsGet).receipts;
      aryReceipts = aryReceipts.concat(ary);
      Utilities.sleep(300);
    }
    return aryReceipts;
  }

  /**
   * 証憑ファイルIDと証憑メモがペアとなったMapオブジェクトを生成するメソッド
   * @return  {Array.<Map>}   mapIdName - 証憑ファイルIDと証憑メモが列挙されたMapオブジェクト
   */

  mapIdName() {
    const aryReceipts = this.getAllReceipts();
    const mapIdName = new Map();
    aryReceipts.forEach(receipt => mapIdName.set(receipt.id, receipt.description));
    return mapIdName;
  }

  /**
   * シート名で指定したシートに証憑一覧を取得するメソッド
   * @param   {string}  sheetName - 証憑一覧を取得したいシート名
   * @return  {SpreadsheetApp.Range} データ取得した範囲のRangeオブジェクト
   */

  getReceipts2Sheet(sheetName) {

    // 収支区分が列挙されたMapオブジェクト
    const mapRECEIPT_STATUS = new Enum().RECEIPT_STATUS;

    const aryReceipts = this.getAllReceipts();
    const objHeader = {
      id: '証憑ファイルID',
      status: 'ステータス',
      description: 'メモ',
      mime_type: 'MIMEタイプ',
      issue_date: '発生日',
      origin: 'アップロード元種別',
      created_at: '作成日時（ISO8601形式）',
      user: {
        id: 'ユーザーID',
        email: 'メールアドレス',
        display_name: '表示名'
      }
    };
    const objHeaderFlat = ObjectJSON.flatObj(objHeader);
    const headerKeys = Object.keys(objHeaderFlat);
    const headerValues = headerKeys.map(key => objHeaderFlat[key]);
    const ary2D = aryReceipts.map(obj => {
      const objReceiptFlat = ObjectJSON.flatObj(obj);
      return headerKeys.map(key => {
        if (objHeaderFlat[key] === 'ステータス') { return mapRECEIPT_STATUS.get(objReceiptFlat[key]) };
        return objReceiptFlat[key]
      });
    });
    ary2D.unshift(headerValues);

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    if (ss.getSheets().filter(sheet => sheet.getName() === sheetName).length === 0) { ss.insertSheet(sheetName, 0); } // 同一のシート名がなければ新規作成する
    const sheet = ss.getSheetByName(sheetName);
    sheet.getDataRange().clearContent();
    const range = sheet.getRange(1, 1, ary2D.length, ary2D[0].length);
    return range.setValues(ary2D);
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
