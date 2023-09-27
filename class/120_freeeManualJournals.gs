/**
 * class ManualJournals
 * freee振替伝票一覧に関するクラス
 * 
 * プロパティ
 * apiRequest - freeeAPIリクエストオブジェクト
 * url - リクエストURL
 * accessToken - アクセストークン
 * company_id - 事業所ID
 * queries - 絞り込み条件
 * 
 * メソッド
 * getURL() - 指定した条件の振替伝票一覧のリクエストURLを返すメソッド
 * getAllManualJournals() - 指定した条件の全ての振替伝票一覧を配列で取得するメソッド
 * getManualJournals2Sheet(sheetName) - アクティブなスプレッドシートのシート名で指定したシートに振替伝票一覧を取得するメソッド
 * 
 */

/* = = = = = = = = = = = = = = = = = = = = = = = = = = = = */


class ManualJournals {

  /**
   * 振替伝票一覧操作のためのリクエストURLを定義するコンストラクタ
   * @parama  {string}  accessToken - アクセストークン
   * @params  {number}  company_id - 事業所ID
   */

  constructor(accessToken, company_id) {
    this.apiRequest = new ApiRequest(accessToken);
    this.url = this.apiRequest.urlAccount + '/api/1/manual_journals';
    this.accessToken = accessToken;
    this.company_id = company_id;
    const dateAYearAgo = new CalDate().aYearAgo(); // カレンダーの色々な日付を生成するクラスを利用して1年前のDateオブジェクトを取得
    this.queries = {
      start_issue_date: new DateFormat(dateAYearAgo).string, // デフォルトの取得振替伝票開始日を1年前に設定
      end_issue_date: '',
      entry_side: '',
      account_item_id: '',
      min_amount: '',
      max_amount: '',
      partner_id: '',
      partner_code: '',
      item_id: '',
      section_id: '',
      segment_1_tag_id: '',
      segment_2_tag_id: '',
      segment_3_tag_id: '',
      comment_status: '',
      comment_important: '',
      adjustment: '',
      txn_number: '',
      offset: '',
      limit: '500' // 取得レコードの件数 (デフォルト: 20, 最小: 1, 最大: 500)
    }
  }

  /**
   * 指定した条件の振替伝票一覧のリクエストURLを返すメソッド
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
   * 全ての振替伝票一覧を配列で取得するメソッド
   * @return  {Array.<Object>}  aryManualJournals - freee振替伝票オブジェクトの一覧を格納した配列
   */

  getAllManualJournals() {

    /* QUERY 絞り込み条件：取得レコードの件数上限のデータ型を変換 */
    let limit = Number();
    if (typeof this.queries.limit === 'number') { limit = this.queries.limit };
    if (typeof this.queries.limit === 'string') { limit = Number(this.queries.limit) };
    this.queries.limit = limit.toString();

    /* 指定した条件の振替伝票オブジェクト一覧を配列で取得 */

    // 振替伝票オブジェクト一覧を格納する空の配列
    let aryManualJournals = [];

    // 振替伝票取得件数の上限以上の振替伝票の登録がある場合にオフセット（ずらし）を行い全件を取得
    for (let offset = 0; offset === aryManualJournals.length; offset += limit) {
      this.queries.offset = offset;
      const url = this.getURL();
      const paramsGet = this.apiRequest.paramsGet;
      const ary = this.apiRequest.fetchResponse(url, paramsGet).manual_journals;
      aryManualJournals = aryManualJournals.concat(ary);
      Utilities.sleep(300);
    }
    return aryManualJournals;
  }

  /**
   * アクティブなスプレッドシートのシート名で指定したシートの振替伝票一覧を更新するメソッド
   * @param   {string}  sheetName - 振替伝票一覧を更新したいシート名
   * @return  {SpreadsheetApp.Range} データ更新した範囲のRangeオブジェクト
   */

  getManualJournals2Sheet(sheetName) {

    // 勘定科目名が列挙されたMapオブジェクト
    const mapAccountItems = new AccountItems(this.accessToken, this.company_id).mapIdName();

    // 税区分名が列挙されたMapオブジェクト
    const mapTaxes = new Taxes(this.accessToken, this.company_id).mapCodeName();

    // 貸借が列挙されたMapオブジェクト
    const mapENTRY_SIDE = new Enum().ENTRY_SIDE;

    // ここから必要なプロパティから値を取り出し、場合によっては変換していくメインの処理
    const aryManualJournals = this.getAllManualJournals();
    const objHeader = {
      id: '振替伝票ID',
      issue_date: '発生日 (yyyy-MM-dd)',
      adjustment: '仕訳種別',
      txn_number: '仕訳番号',
      details: {
        id: '貸借行ID',
        entry_side: '貸借',
        account_item_id: '勘定科目',
        tax_code: '税区分',
        partner_id: '取引先ID',
        partner_name: '取引先名',
        partner_code: '取引先コード',
        partner_long_name: '正式名称（255文字以内）',
        item_id: '品目ID',
        item_name: '品目',
        section_id: '部門ID',
        section_name: '部門',
        tag_ids: 'メモタグID',
        tag_names: 'メモタグ',
        segment_1_tag_id: 'セグメント１ID',
        segment_1_tag_name: 'セグメント１',
        segment_2_tag_id: 'セグメント２ID',
        segment_2_tag_name: 'セグメント２',
        segment_3_tag_id: 'セグメント３ID',
        segment_3_tag_name: 'セグメント３',
        amount: '取引金額（税込）',
        vat: '消費税額',
        description: '備考'
      },
      receipt_ids: '証憑ファイルID'
    };
    // オブジェクトをフラット化し、階層に応じてキーを連結して新しいオブジェクトを生成し、それを2次元配列化
    const objHeaderFlat = ObjectJSON.flatObj(objHeader);
    const headerKeys = Object.keys(objHeaderFlat);
    const headerValues = headerKeys.map(key => objHeaderFlat[key]);
    const aryObjs = aryManualJournals.flatMap(obj => ObjectJSON.obj2DataObjs(obj)); // 子階層にオブジェクトの配列があるデータを行単位に展開
    const ary2D = aryObjs.map(obj => headerKeys.map(key => {
      if (objHeaderFlat[key] === '貸借') { return mapENTRY_SIDE.get(obj[key]) };
      if (objHeaderFlat[key] === '勘定科目') { return mapAccountItems.get(obj[key]) };
      if (objHeaderFlat[key] === '税区分') { return mapTaxes.get(obj[key]) };
      if (objHeaderFlat[key] === 'メモタグID' && Array.isArray(obj[key])) { return obj[key].join(',') };
      if (objHeaderFlat[key] === 'メモタグ' && Array.isArray(obj[key])) { return obj[key].join(',') };
      if (objHeaderFlat[key] === '証憑ファイルID' && Array.isArray(obj[key])) { return obj[key].join(',') };
      return obj[key];
    }));
    ary2D.unshift(headerValues);

    // 生成した2次元配列を事前にクリアしたスプレッドシートに追加
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    if (ss.getSheets().filter(sheet => sheet.getName() === sheetName).length === 0) { ss.insertSheet(sheetName, 0); } // 同一のシート名がなければ新規作成する
    const sheet = ss.getSheetByName(sheetName);
    sheet.getDataRange().clearContent();
    const range = sheet.getRange(1, 1, ary2D.length, ary2D[0].length);
    return range.setValues(ary2D);
  }
}

/**
 * freee振替伝票一覧クラスのインスタンスを生成するファクトリ関数
 * @params  {string}  accessToken - アクセストークン
 * @params  {number}  company_id - 事業所ID
 * @return  {ManualJournals}   freee振替伝票一覧オブジェクト
 */

function manualJournals(accessToken, company_id) {
  return new ManualJournals(accessToken, company_id);
}

