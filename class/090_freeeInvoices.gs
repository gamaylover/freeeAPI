/**
 * class Invoices
 * freee請求書一覧に関するクラス
 * 
 * プロパティ
 * apiRequest - freeeAPIリクエストオブジェクト
 * url - リクエストURL
 * accessToken - アクセストークン
 * company_id - 事業所ID
 * queries - 絞り込み条件
 * 
 * メソッド
 * getURL() - 指定した条件の請求書一覧のリクエストURLを返すメソッド
 * getAllInvoices() - 請求書一覧を配列で取得するメソッド
 * getInvoices2Sheet(sheetName) - アクティブなスプレッドシートのシート名で指定したシートの請求書一覧を取得するメソッド
 * 
 */

/* = = = = = = = = = = = = = = = = = = = = = = = = = = = = */



class Invoices {

  /**
   * 請求書一覧操作のためのリクエストURLを定義するコンストラクタ
   * @parama  {string}  accessToken - アクセストークン
   * @params  {number}  company_id - 事業所ID
   */

  constructor(accessToken, company_id) {
    this.apiRequest = new ApiRequest(accessToken);
    this.url = this.apiRequest.urlAccount + 'api/1/invoices';
    this.accessToken = accessToken;
    this.company_id = company_id;
    const dateAYearAgo = new CalDate().aYearAgo(); // カレンダーの色々な日付を生成するクラスを利用して1年前のDateオブジェクトを取得
    this.queries = {
      partner_id: '',
      partner_code: '',
      start_issue_date: new DateFormat(dateAYearAgo).string, // デフォルトの取得取引開始日を1年前に設定
      end_issue_date: '',
      start_due_date: '',
      end_due_date: '',
      start_renew_date: '',
      end_renew_date: '',
      invoice_number: '',
      description: '',
      invoice_status: '',
      payment_status: '',
      offset: '',　//
      limit: '100' // 取得レコードの件数 (デフォルト: 20, 最大: 100)
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

  /**
   * 全ての請求書一覧を配列で取得するメソッド
   * @return  {Array.<Object>}  aryInvoices - freee請求書オブジェクトの一覧を格納した配列
   */

  getAllInvoices() {

    /* QUERY 絞り込み条件：取得レコードの件数上限のデータ型を変換 */
    let limit = Number();
    if (typeof this.queries.limit === 'number') { limit = this.queries.limit };
    if (typeof this.queries.limit === 'string') { limit = Number(this.queries.limit) };
    this.queries.limit = limit.toString();

    /* 指定した条件の請求書オブジェクト一覧を配列で取得 */

    // 請求書オブジェクト一覧を格納する空の配列
    let aryInvoices = [];

    // 請求書取得件数の上限以上の請求書の登録がある場合にオフセット（ずらし）を行い全件を取得
    for (let offset = 0; offset === aryInvoices.length; offset += limit) {
      this.queries.offset = offset;
      const url = this.getURL();
      const paramsGet = this.apiRequest.paramsGet;
      const ary = this.apiRequest.fetchResponse(url, paramsGet).invoices;
      aryInvoices = aryInvoices.concat(ary);
      Utilities.sleep(300);
    }
    return aryInvoices;
  }

  /**
   * アクティブなスプレッドシートのシート名で指定したシートの請求書一覧を取得するメソッド
   * @param   {string}  sheetName - 請求書一覧を取得するシート名
   * @return  {SpreadsheetApp.Range} データ更新した範囲のRangeオブジェクト
   */

  getInvoices2Sheet(sheetName) {

    // freeeAPIのIDと請求書ステータスがペアになったMapオブジェクト
    const mapINVOICE_STATUS = new Enum().INVOICE_STATUS;

    // freeeAPIのIDと入金ステータスがペアになったMapオブジェクト
    const mapPAYMENT_STATUS = new Enum().PAYMENT_STATUS;

    // freeeAPIのIDと郵送ステータスがペアになったMapオブジェクト
    const mapPOSTING_STATUS = new Enum().POSTING_STATUS;

    // freeeAPIのIDと支払方法種別がペアになったMapオブジェクト
    const mapPAYMENT_TYPE = new Enum().PAYMENT_TYPE;

    // freeeAPIのIDと請求書レイアウトがペアになったMapオブジェクト
    const mapINVOICE_LAYOUT = new Enum().INVOICE_LAYOUT;

    // freeeAPIのIDと請求明細行の種類がペアになったMapオブジェクト
    const mapINVOICE_CONTENTS_TYPE = new Enum().INVOICE_CONTENTS_TYPE;

    // freeeAPIのIDと請求書の消費税計算方法がペアになったMapオブジェクト
    const mapTAX_ENTRY_METHOD = new Enum().TAX_ENTRY_METHOD;

    // freeeAPIのコードと税区分名が列挙されたMapオブジェクト
    const mapTaxes = new Taxes(this.accessToken, this.company_id).mapCodeName();

    // ここから必要なプロパティから値を取り出し、場合によっては変換していくメインの処理
    const aryInvoices = this.getAllInvoices();
    const objHeader = {

      id: '請求書ID',
      company_id: '事業所ID',
      issue_date: '請求日 (yyyy-MM-dd)',
      partner_id: '取引先ID',
      partner_code: '取引先コード',
      invoice_number: '請求書番号',
      title: 'タイトル',
      due_date: '期日 (yyyy-MM-dd)',
      total_amount: '合計金額',
      total_vat: '合計消費税額',
      sub_total: '小計',
      booking_date: '売上計上日',
      description: '概要',
      invoice_status: '請求書ステータス',
      payment_status: '入金ステータス',
      payment_date: '入金日',
      web_published_at: 'Web共有日時(最新)',
      web_downloaded_at: 'Web共有ダウンロード日時(最新)',
      web_confirmed_at: 'Web共有取引先確認日時(最新)',
      mail_sent_at: 'メール送信日時(最新)',
      posting_status: '郵送ステータス',
      partner_name: '取引先名',
      partner_display_name: '請求書に表示する取引先名',
      partner_title: '敬称（御中、様、(空白)の3つから選択）',
      partner_zipcode: '郵便番号',
      partner_prefecture_code: '都道府県コード',
      partner_prefecture_name: '都道府県',
      partner_address1: '市区町村・番地',
      partner_address2: '建物名・部屋番号など',
      partner_contact_info: '取引先担当者名',
      company_name: '事業所名',
      company_zipcode: '郵便番号',
      company_prefecture_code: '都道府県コード',
      company_prefecture_name: '都道府県',
      company_address1: '市区町村・番地',
      company_address2: '建物名・部屋番号など',
      company_contact_info: '事業所担当者名',
      payment_type: '支払方法',
      payment_bank_info: '支払口座',
      message: 'メッセージ',
      notes: '備考',
      invoice_layout: '請求書レイアウト',
      tax_entry_method: '請求書の消費税計算方法',
      deal_id: '取引ID',

      invoice_contents: {
        id: '請求内容ID',
        order: '順序',
        type: '行の種類',
        qty: '数量',
        unit: '単位',
        unit_price: '単価',
        amount: '小計',
        vat: '消費税額',
        reduced_vat: '軽減税率区分',
        description: '備考',
        account_item_id: '勘定科目ID',
        account_item_name: '勘定科目名',
        tax_code: '税区分',
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
        segment_3_tag_name: 'セグメント３'
      },
      payments: {
        vat_5: '税率5%の税込み金額合計',
        vat_8: '税率8%の税込み金額合計',
        reduced_vat_8: '軽減税率5%の税込み金額合計',
        vat_10: '税率10%の税込み金額合計'
      }
    };

    // オブジェクトをフラット化し、階層に応じてキーを連結して新しいオブジェクトを生成し、それを2次元配列化
    const objHeaderFlat = ObjectJSON.flatObj(objHeader);
    const headerKeys = Object.keys(objHeaderFlat);
    const headerValues = headerKeys.map(key => objHeaderFlat[key]);
    const aryObjs = aryInvoices.flatMap(obj => ObjectJSON.obj2DataObjs(obj)); // 子階層にオブジェクトの配列があるデータを行単位に展開
    const ary2D = aryObjs.map(obj => headerKeys.map(key => {
      if (objHeaderFlat[key] === '請求書ステータス') { return mapINVOICE_STATUS.get(obj[key]) };
      if (objHeaderFlat[key] === '入金ステータス') { return mapPAYMENT_STATUS.get(obj[key]) };
      if (objHeaderFlat[key] === '郵送ステータス') { return mapPOSTING_STATUS.get(obj[key]) };
      if (objHeaderFlat[key] === '支払方法') { return mapPAYMENT_TYPE.get(obj[key]) };
      if (objHeaderFlat[key] === '請求書レイアウト') { return mapINVOICE_LAYOUT.get(obj[key]) };
      if (objHeaderFlat[key] === '請求書の消費税計算方法') { return mapTAX_ENTRY_METHOD.get(obj[key]) };
      if (objHeaderFlat[key] === '行の種類') { return mapINVOICE_CONTENTS_TYPE.get(obj[key]) };
      if (objHeaderFlat[key] === '税区分') { return mapTaxes.get(obj[key]) };
      if (objHeaderFlat[key] === 'メモタグID' && Array.isArray(obj[key])) { return obj[key].join('/') };
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
 * freee請求書一覧クラスのインスタンスを生成するファクトリ関数
 * @params  {string}  accessToken - アクセストークン
 * @params  {number}  company_id - 事業所ID
 * @return  {Invoices}   freee請求書一覧オブジェクト
 */

function invoices(accessToken, company_id) {
  return new Invoices(accessToken, company_id);
}

