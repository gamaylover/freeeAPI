/**
 * class NewInvoices
 * freee請求書一覧の取得に関するクラス
 * 
 * プロパティ
 * apiRequest - freeeAPIリクエストオブジェクト
 * url - リクエストURL
 * accessToken - アクセストークン
 * company_id - 事業所ID
 * queries - 請求書取得のためのクエリパラメータのセット
 * 
 * メソッド
 * getURL() - APIのURLを取得するメソッド
 * getInvoice(invoice_id) - 指定したIDの請求書を取得するメソッド
 * getAllInvoices() - 指定された条件の全ての請求書オブジェクトを取得するメソッド
 * getAllTemplates() - 登録されている全ての帳票テンプレートを取得するメソッド
 * mapIdName() - freeeAPIのIDとテンプレート名が列挙されたMapオブジェクトを生成するメソッド
 * getIdByName(name) - テンプレート名からfreeeAPIのIDを取得するメソッド
 * getTemplates2Sheet(sheetName) - 指定したシート名のスプレッドシートに全ての帳票テンプレート情報を出力するメソッド
 * getInvoiceSummary2Sheet(sheetName) - 請求書の概要を指定したシートに書き出すメソッド
 * getInvoices2Sheet(sheetName)  - 請求書の詳細一覧を指定したシートに書き出すメソッド
 * postInvoice(payload) - 請求書情報をPOSTリクエストとして送信するメソッド
 * postInvoicesFromSheet(sheetName, groupKey = 'グループキー') - スプレッドシートの指定したシートから請求書データを取得し、それをPOSTリクエストとして送信するメソッド
 * 
 */


class NewInvoices {

  /**
   * 請求書一覧操作のためのリクエストURLを定義するコンストラクタ
   * @param {string} accessToken - アクセストークン
   * @param {number} company_id - 事業所ID。
   */

  constructor(accessToken, company_id) {
    this.apiRequest = new ApiRequest(accessToken);
    this.url = this.apiRequest.urlAccount + 'iv/invoices';
    this.accessToken = accessToken;
    this.company_id = company_id;
    const dateAYearAgo = new CalDate().aYearAgo(); // カレンダーの色々な日付を生成するクラスを利用して1年前のDateオブジェクトを取得
    this.queries = {
      invoice_number: '',
      subject: '',
      partner_ids: '',
      payment_status: '',
      deal_status: '',
      sending_status: '',
      cancel_status: '',
      start_billing_date: new DateFormat(dateAYearAgo).string, // デフォルトの取得請求開始日を1年前に設定
      end_billing_date: '',
      start_payment_date: '',
      end_payment_date: '',
      limit: '100', // 取得レコードの件数 (デフォルト: 20, 最大: 100)
      offset: ''
    }
    this.objPost = {
      company_id: '事業所ID',
      template_id: '帳票テンプレート',
      invoice_number: '請求書番号',
      branch_no: '枝番',
      billing_date: '請求日',
      payment_date: '期日',
      payment_type: '入金方法',
      subject: '件名',
      tax_entry_method: '消費税の内税・外税区分',
      tax_fraction: '消費税端数の計算方法',
      withholding_tax_entry_method: '源泉徴収の計算方法',
      invoice_note: '備考',
      memo: '社内メモ',
      partner_id: '取引先',
      partner_title: '敬称',
      partner_address_zipcode: '郵便番号',
      partner_address_prefecture_code: '都道府県',
      partner_address_street_name1: '取引先 市区町村・番地',
      partner_address_street_name2: '取引先 建物名・部屋番号など',
      partner_contact_department: '取引先部署',
      partner_contact_name: '取引先担当者名',
      partner_display_name: '取引先宛名',
      partner_bank_account: '取引先口座',
      lines: [
        {
          type: '明細の種類',
          description: '摘要（品名）',
          sales_date: '取引日',
          unit: '明細の単位名',
          quantity: '明細の数量',
          unit_price: '明細の単価',
          tax_rate: '税率（%）',
          reduced_tax_rate: '軽減税率対象',
          withholding: '源泉徴収対象',
          account_item_id: '勘定科目',
          tax_code: '税区分',
          item_id: '品目',
          section_id: '部門',
          tag_ids: 'メモタグ',
          segment_1_tag_id: 'セグメント１ID',
          segment_2_tag_id: 'セグメント２ID',
          segment_3_tag_id: 'セグメント３ID'
        }
      ]
    }

  }

  /**
   * APIのURLを取得するメソッド
   * @returns {string} url - 生成されたURL
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
   * 指定したIDの請求書を取得するメソッド
   *
   * @param {number|string} invoice_id - 取得する請求書のID
   * @returns {Object} - 指定したIDの請求書オブジェクト
   */

  getInvoice(invoice_id) {
    const url = `${this.url}/${invoice_id}`
      + `?company_id=${this.company_id}`;
    const response = this.apiRequest.fetchResponse(url, this.apiRequest.paramsGet);
    Utilities.sleep(300);
    return response.invoice;
  }

  /**
   * 指定された条件の全ての請求書オブジェクトを取得するメソッド
   * @returns {Array<Object>} aryInvoices - 請求書オブジェクトの配列
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
   * 登録されている全ての帳票テンプレートを取得するメソッド
   *
   * @returns {Array} - 全ての帳票テンプレートの配列
   */

  getAllTemplates() {
    const url = `${this.url}/templates`
      + `?company_id=${this.company_id}`;
    const response = this.apiRequest.fetchResponse(url, this.apiRequest.paramsGet);
    Utilities.sleep(300);
    return response.templates;
  }

  /**
   * freeeAPIのIDとテンプレート名が列挙されたMapオブジェクトを生成するメソッド
   * @return  {Array.<Map>}   mapIdName - freeeAPIのIDとテンプレート名が列挙されたMapオブジェクト
   */

  mapIdName() {
    const aryTemplates = this.getAllTemplates();
    const mapIdName = new Map();
    aryTemplates.forEach(template => mapIdName.set(template.id, template.name));
    return mapIdName;
  }

  /**
   * テンプレート名からfreeeAPIのIDを取得するメソッド
   * @param   {string}  name - テンプレート名
   * @return  {string}  id - テンプレートID
   */

  getIdByName(name) {
    const mapIdName = this.mapIdName();
    const id = MapObject.convertValue2Key(mapIdName, name);
    return id;
  }

  /**
   * 指定したシート名のスプレッドシートに全ての帳票テンプレート情報を出力するメソッド
   *
   * @param {string} sheetName - 出力するスプレッドシートのシート名
   * @returns {GoogleAppsScript.Spreadsheet.Range} - 出力した帳票テンプレート情報の範囲
   */

  getTemplates2Sheet(sheetName) {
    const aryTemplates = this.getAllTemplates();
    const objHeader = {
      id: '帳票テンプレートID',
      name: '帳票テンプレート名'
    };

    const headerKeys = Object.keys(objHeader);
    const headerValues = headerKeys.map(key => objHeader[key]);
    const ary2D = aryTemplates.map(obj => headerKeys.map(key => obj[key]));
    ary2D.unshift(headerValues);

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    if (ss.getSheets().filter(sheet => sheet.getName() === sheetName).length === 0) { ss.insertSheet(sheetName, 0); } // 同一のシート名がなければ新規作成する
    const sheet = ss.getSheetByName(sheetName);
    sheet.getDataRange().clearContent();
    const range = sheet.getRange(1, 1, ary2D.length, ary2D[0].length);
    return range.setValues(ary2D);
  }

  /**
   * 請求書の概要を指定したシートに書き出すメソッド
   * @param {string} sheetName - 書き出すスプレッドシートの名前
   * @returns {GoogleAppsScript.Spreadsheet.Range} 書き出された範囲
   */

  getInvoiceSummary2Sheet(sheetName) {

    // freeeAPIのIDと各ステータスがペアになったMapオブジェクトのインスタンス化
    const enums = new Enum();
    const mapPAYMENT_TYPE = enums.PAYMENT_TYPE; // 入金方法
    const mapPAYMENT_STATUS = enums.PAYMENT_STATUS; // 入金ステータス
    const mapDEAL_STATUS = enums.DEAL_STATUS; // 取引ステータス
    const mapSENDING_STATUS = enums.SENDING_STATUS; // 送付ステータス
    const mapCANCEL_STATUS = enums.CANCEL_STATUS; // 取消済み

    // ここから必要なプロパティから値を取り出し、場合によっては変換していくメインの処理
    const aryInvoices = this.getAllInvoices();
    const objHeader = {
      id: '請求書ID',
      company_id: '事業所ID',
      invoice_number: '請求書番号',
      subject: '件名',
      template_id: '帳票テンプレートID',
      billing_date: '請求日',
      payment_date: '期日',
      payment_type: '入金方法',
      memo: '社内メモ',
      sending_status: '送付ステータス',
      payment_status: '入金ステータス',
      cancel_status: '取消済み',
      deal_status: '取引ステータス',
      deal_id: '取引ID',
      total_amount: '合計金額',
      amount_withholding_tax: '源泉徴収税',
      amount_including_tax: '税込金額',
      amount_excluding_tax: '小計',
      amount_tax: '消費税額',
      partner_id: '請求先ID',
      partner_name: '取引先名',
      partner_display_name: '取引先宛名'
    }

    //キーを連結して新しいオブジェクトを生成し、それを2次元配列化
    const headerKeys = Object.keys(objHeader);
    const headerValues = headerKeys.map(key => objHeader[key]);
    const ary2D = aryInvoices.map(obj => headerKeys.map(key => {
      if (objHeader[key] === '入金ステータス') { return mapPAYMENT_STATUS.get(obj[key]) };
      if (objHeader[key] === '取引ステータス') { return mapDEAL_STATUS.get(obj[key]) };
      if (objHeader[key] === '送付ステータス') { return mapSENDING_STATUS.get(obj[key]) };
      if (objHeader[key] === '入金方法') { return mapPAYMENT_TYPE.get(obj[key]) };
      if (objHeader[key] === '取消済み') { return mapCANCEL_STATUS.get(obj[key]) };
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

  /**
   * 請求書の詳細一覧を指定したシートに書き出すメソッド
   *
   * @param {string} sheetName - 出力するスプレッドシートのシート名。
   * @returns {GoogleAppsScript.Spreadsheet.Range} - 出力した請求書情報の範囲。
   */

  getInvoices2Sheet(sheetName) {

    // 取得対象の請求書データを配列で取得
    const aryInvoiceSummary = this.getAllInvoices();
    const aryInvoiceId = aryInvoiceSummary.map(invoice => invoice.id);
    const aryInvoices = aryInvoiceId.map(invoice_id => this.getInvoice(invoice_id));

    // freeeAPIのIDと各ステータスがペアになったMapオブジェクトのインスタンス化
    const enums = new Enum();
    const mapPAYMENT_TYPE = enums.PAYMENT_TYPE; // 入金方法
    const mapSENDING_STATUS = enums.SENDING_STATUS; // 送付ステータス
    const mapPAYMENT_STATUS = enums.PAYMENT_STATUS; // 入金ステータス
    const mapCANCEL_STATUS = enums.CANCEL_STATUS; // 取消済み
    const mapDEAL_STATUS = enums.DEAL_STATUS; // 取引ステータス
    const mapTAX_ENTRY_METHOD = enums.NEW_TAX_ENTRY_METHOD; // 消費税の内税・外税区分 NOTE:旧API廃止後改修予定
    const mapTAX_FRACTION = enums.TAX_FRACTION; // 消費税端数の計算方法
    const mapWITHHOLDING_TAX_ENTRY_METHOD = enums.WITHHOLDING_TAX_ENTRY_METHOD; // 源泉徴収の計算方法
    const mapPREFECTURE_CODES = enums.PREFECTURE_CODES;// 都道府県コード
    const mapLINES_TYPE = enums.LINES_TYPE; // 明細の種類
    const mapLINES_TAX_RATE = enums.LINES_TAX_RATE; // 明細の税率

    // シートに書き出す際のヘッダー項目の定義
    const objHeader = {
      id: '請求書ID',
      company_id: '事業所ID',
      invoice_number: '請求書番号',
      branch_no: '枝番',
      subject: '件名',
      template_id: '帳票テンプレートID',
      template_name: '帳票テンプレート名',
      billing_date: '請求日',
      payment_date: '期日',
      payment_type: '入金方法',
      invoice_note: '備考',
      memo: '社内メモ',
      sending_status: '送付ステータス',
      payment_status: '入金ステータス',
      cancel_status: '取消済み',
      deal_status: '取引ステータス',
      deal_id: '取引ID',
      tax_entry_method: '消費税の内税・外税区分',
      tax_fraction: '消費税端数の計算方法',
      withholding_tax_entry_method: '源泉徴収の計算方法',
      total_amount: '合計金額',
      created_at: '作成日時',
      amount_withholding_tax: '源泉徴収税',
      amount_including_tax: '税込金額',
      amount_excluding_tax: '小計（税別）',
      amount_tax: '消費税額',
      amount_including_tax_10: '10%対象 税込',
      amount_excluding_tax_10: '10%対象 税抜',
      amount_tax_10: '10%対象 消費税',
      amount_including_tax_8: '8%対象 税込',
      amount_excluding_tax_8: '8%対象 税抜',
      amount_tax_8: '8%対象 消費税',
      amount_including_tax_8_reduced: '軽減税率8%対象 税込',
      amount_excluding_tax_8_reduced: '軽減税率8%対象 税抜',
      amount_tax_8_reduced: '軽減税率8%対象 消費税',
      amount_including_tax_0: '0%対象 税込',
      amount_excluding_tax_0: '0%対象 税抜',
      amount_tax_0: '0%対象 消費税',
      partner_id: '取引先ID',
      partner_name: '取引先名',
      partner_title: '敬称',
      partner_address_zipcode: '郵便番号',
      partner_address_prefecture_code: '都道府県コード',
      partner_address_street_name1: '取引先 市区町村・番地',
      partner_address_street_name2: '取引先 建物名・部屋番号など',
      partner_contact_department: '取引先部署',
      partner_contact_name: '取引先担当者名',
      partner_display_name: '取引先宛名',
      partner_bank_account: '取引先口座',
      company_contact_name: '自社担当者名',
      template: {
        title: '請求書タイトル',
        invoice_registration_number: 'インボイス制度適格請求書発行事業者登録番号',
        company_name: '自社名',
        company_description: '自社情報',
        bank_account_to_transfer: '振込先',
        message: 'メッセージ'
      },
      lines: [
        {
          id: '明細行ID',
          type: '明細の種類',
          description: '摘要（品名）',
          sales_date: '取引日',
          unit: '明細の単位名',
          quantity: '明細の数量',
          unit_price: '明細の単価',
          tax_rate: '明細の税率',
          tax_type: '内税・外税区分',
          tax_exemption: '免税区分',
          amount_excluding_tax: '税抜額',
          amount_tax: '消費税額'
        }
      ]
    }

    // オブジェクトをフラット化し、階層に応じてキーを連結して新しいオブジェクトを生成し、それを2次元配列化
    const objHeaderFlat = ObjectJSON.flatObj(objHeader);
    const headerKeys = Object.keys(objHeaderFlat);
    const headerValues = headerKeys.map(key => objHeaderFlat[key]);
    const aryObjs = aryInvoices.flatMap(obj => ObjectJSON.obj2DataObjs(obj)); // 子階層にオブジェクトの配列があるデータを行単位に展開
    const ary2D = aryObjs.map(obj => headerKeys.map(key => {
      if (objHeaderFlat[key] === '入金方法') { return mapPAYMENT_TYPE.get(obj[key]); }
      if (objHeaderFlat[key] === '送付ステータス') { return mapSENDING_STATUS.get(obj[key]); }
      if (objHeaderFlat[key] === '入金ステータス') { return mapPAYMENT_STATUS.get(obj[key]); }
      if (objHeaderFlat[key] === '取消済み') { return mapCANCEL_STATUS.get(obj[key]); }
      if (objHeaderFlat[key] === '取引ステータス') { return mapDEAL_STATUS.get(obj[key]); }
      if (objHeaderFlat[key] === '消費税の内税・外税区分') { return mapTAX_ENTRY_METHOD.get(obj[key]); } // NOTE: 旧API廃止後改修予定
      if (objHeaderFlat[key] === '消費税端数の計算方法') { return mapTAX_FRACTION.get(obj[key]); }
      if (objHeaderFlat[key] === '源泉徴収の計算方法') { return mapWITHHOLDING_TAX_ENTRY_METHOD.get(obj[key]); }
      if (objHeaderFlat[key] === '都道府県コード') { return mapPREFECTURE_CODES.get(obj[key]); }
      if (objHeaderFlat[key] === '明細の種類') { return mapLINES_TYPE.get(obj[key]); }
      if (objHeaderFlat[key] === '明細の税率') { return mapLINES_TAX_RATE.get(obj[key]); }
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

  /**
   * 請求書情報をPOSTリクエストとして送信するメソッド
   *
   * @param {Object} payload - POSTリクエストに必要な請求書データ
   * @returns {Object} - 応答として返された請求書情報
   */

  postInvoice(payload) {
    const url = this.url;
    this.apiRequest.paramsPost.payload = JSON.stringify(payload);
    const response = this.apiRequest.fetchResponse(url, this.apiRequest.paramsPost);
    Utilities.sleep(300);
    return response.invoice;
  }

  /**
   * スプレッドシートの指定したシートから請求書データを取得し、それをPOSTリクエストとして送信するメソッド
   *
   * @param {string} sheetName - データを取得するスプレッドシートのシート名
   * @param {string} [groupKey='グループキー'] - グルーピングのためのキー名
   * @returns {Object} - 登録に成功したキーと失敗したキーを格納したオブジェクト
   */

  postInvoicesFromSheet(sheetName, groupKey = 'グループキー') {

    // freeeAPIのIDと各ステータスがペアになったMapオブジェクトのインスタンス化
    const enums = new Enum();
    const mapPartners = new Partners(this.accessToken, this.company_id).mapIdName(); // freeeAPIのIDと取引先名が列挙されたMapオブジェクト
    const mapAccountItems = new AccountItems(this.accessToken, this.company_id).mapIdName(); // freeeAPIのIDと勘定科目名が列挙されたMapオブジェクト
    const mapTaxes = new Taxes(this.accessToken, this.company_id).mapCodeName(); // freeeAPIのコードと税区分名が列挙されたMapオブジェクト
    const mapItems = new Items(this.accessToken, this.company_id).mapIdName(); // freeeAPIのIDと品目名が列挙されたMapオブジェクト
    const mapSections = new Sections(this.accessToken, this.company_id).mapIdName(); // freeeAPIのIDと部門名が列挙されたMapオブジェクト
    const mapTags = new Tags(this.accessToken, this.company_id).mapIdName(); // freeeAPIのIDとメモタグ名が列挙されたMapオブジェクト


    /**
     * 日本語ヘッダー項目をプロパティに持つオブジェクトの配列から請求書1件（複数明細対応）ごとに登録していく関数
     * @param  {Array.<Object>}  invoiceContents - this.objPostの各値（日本語）をプロパティにしたオブジェクト（請求明細）を格納した配列
     * @return  {Object}  response - 請求書情報を格納したオブジェクト
     */

    const postInvoiceFromData = invoiceContents => {

      // POST用のオブジェクトを明細行オブジェクトを結合して作成

      const newPostObjs = invoiceContents.map(objContent => {
        objContent['事業所ID'] = this.company_id;
        return ObjectJSON.overwriteValueLinkObj(this.objPost, objContent)
      });
      const newPostObj = ObjectJSON.combineObjs(this.objPost, newPostObjs);

      // 帳票テンプレート名からIDを取得
      newPostObj.template_id = this.getIdByName(newPostObj.template_id);

      // 請求日
      newPostObj.billing_date =
        new DateFormat(newPostObj.billing_date).string

      // 期日
      newPostObj.payment_date =
        new DateFormat(newPostObj.payment_date).string

      // 　入金方法
      newPostObj.payment_type =
        enums.convertValue2Key('PAYMENT_TYPE', newPostObj.payment_type);

      // 消費税の内税・外税区分
      newPostObj.tax_entry_method =
        enums.convertValue2Key('NEW_TAX_ENTRY_METHOD', newPostObj.tax_entry_method);

      // 消費税端数の計算方法
      newPostObj.tax_fraction =
        enums.convertValue2Key('TAX_FRACTION', newPostObj.tax_fraction);

      // 源泉徴収の計算方法
      newPostObj.withholding_tax_entry_method =
        enums.convertValue2Key('WITHHOLDING_TAX_ENTRY_METHOD', newPostObj.withholding_tax_entry_method);

      // 取引先ID
      newPostObj.partner_id =
        MapObject.convertValue2Key(mapPartners, newPostObj.partner_id);

      // 取引先都道府県コード
      newPostObj.partner_address_prefecture_code =
        enums.convertValue2Key('PREFECTURE_CODES', newPostObj.partner_address_prefecture_code);

      // 請求明細
      newPostObj.lines.forEach(line => {
        line.type = enums.convertValue2Key('LINES_TYPE', line.type);
        line.tax_rate = enums.convertValue2Key('LINES_TAX_RATE', line.tax_rate);
        line.account_item_id = MapObject.convertValue2Key(mapAccountItems, line.account_item_id);
        line.item_id = MapObject.convertValue2Key(mapItems, line.item_id);
        line.unit_price = String(line.unit_price);
        line.tax_code = MapObject.convertValue2Key(mapTaxes, line.tax_code);
        line.section_id = MapObject.convertValue2Key(mapSections, line.section_id);
        if (line.tag_ids) { line.tag_ids = line.tag_ids.split(',').map(tagName => MapObject.convertValue2Key(mapTags, tagName)) };
      });

      /* ブランク等不要なプロパティを削除 */
      ObjectJSON.deleteBlankProperties(newPostObj);
      return this.postInvoice(newPostObj);
    }

    /* シートの指定した同一のgroupKeyごとにPOSTしていく処理 */

    const postInvoices_DataSheet = new DataSheet(sheetName);
    const uniqueKeys = postInvoices_DataSheet.getUniqueKeys(groupKey);
    const invoicesObjs = postInvoices_DataSheet.rangeToDataObjs();

    let arySuccessKey = new Array(); // 正常に完了したkeyを格納するための配列
    let aryErrorKey = new Array(); // エラーになったkeyを格納するための配列

    uniqueKeys.forEach(key => {
      const invoiceContents = invoicesObjs.filter(content => content[groupKey] === key);
      postInvoiceFromData(invoiceContents);
      // try {
      //   postInvoiceFromData(invoiceContents);
      //   arySuccessKey.push(key); // 登録が成功した場合のkeyを配列に追加
      // } catch (error) {
      //   aryErrorKey.push(key); // エラーになった場合のkeyを配列に追加
      //   console.log(error.message);
      // }
    });

    const objResults = {
      success: arySuccessKey,
      error: aryErrorKey
    };

    // 戻り値として登録に成功したキーと失敗したキーを格納したオブジェクトを返す
    return objResults;
  }

}





/**
 * 新請求書クラスのインスタンスを生成する。
 * @param {string} accessToken - アクセストークン
 * @param {number} company_id - 事業所ID
 * @returns {NewInvoices} NewInvoicesのインスタンス
 */

function newInvoices(accessToken, company_id) {
  return new NewInvoices(accessToken, company_id);
}

