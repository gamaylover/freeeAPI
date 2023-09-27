/**
 * class Invoice
 * freee個別請求書の取得・作成・更新に関するクラス
 * 
 * プロパティ
 * apiRequest - freeeAPIリクエストオブジェクト
 * url - リクエストURL
 * accessToken - アクセストークン
 * company_id - 事業所ID
 * objPost - POST用のキー項目
 * 
 * メソッド
 * getInvoice() - 指定したIDの請求書を取得するメソッド
 * postInvoice(payload) - JSONオブジェクトから請求書を登録するメソッド
 * postInvoicesFromSheet(sheetName, groupKey) - シート名で指定したシートの請求データから一括して請求書を作成するメソッド
 * putInvoice(invoice_id, payload) - JSONオブジェクトから請求書を更新するメソッド
 * renewInvoicesFromSheet(sheetName, folderId = '') - シート名で指定したシートの請求書データから一括して請求書を更新するメソッド
 * 
 */

/* = = = = = = = = = = = = = = = = = = = = = = = = = = = = */


class Invoice {

  /**
   * 請求書操作のためのURLを定義するコンストラクタ
   * @constructor
   * @param  {string}  accessToken - アクセストークン
   * @param  {number}  company_id - 事業所ID
   
   */

  constructor(accessToken, company_id) {
    this.apiRequest = new ApiRequest(accessToken);
    this.url = this.apiRequest.urlAccount + 'api/1/invoices';
    this.accessToken = accessToken;
    this.company_id = company_id;
    this.objPost = {
      company_id: '事業所ID',
      issue_date: '請求日 (yyyy-MM-dd)',
      partner_id: '取引先',
      partner_code: '取引先コード',
      invoice_number: '請求書番号',
      title: 'タイトル',
      due_date: '期日 (yyyy-MM-dd)',
      booking_date: '売上計上日',
      description: '概要',
      invoice_status: '請求書ステータス',
      partner_display_name: '請求書に表示する取引先名',
      partner_title: '敬称（御中、様、(空白)の3つから選択）',
      partner_contact_info: '取引先担当者名',
      partner_zipcode: '取引先郵便番号',
      partner_prefecture_code: '取引先都道府県',
      partner_address1: '取引先市区町村・番地 ',
      partner_address2: '取引先建物名・部屋番号など',
      company_name: '事業所名',
      company_zipcode: '事業所郵便番号',
      company_prefecture_code: '事業所都道府県',
      company_address1: '事業所市区町村・番地',
      company_address2: '事業所建物名・部屋番号など',
      company_contact_info: '事業所担当者名',
      payment_type: '支払方法',
      payment_bank_info: '支払口座',
      use_virtual_transfer_account: '振込専用口座の利用',
      message: 'メッセージ',
      notes: '請求書備考',
      invoice_layout: '請求書レイアウト',
      tax_entry_method: '請求書の消費税計算方法',
      invoice_contents: [{
        order: '順序',
        type: '行の種類',
        qty: '数量',
        unit: '単位',
        unit_price: '単価',
        vat: '消費税額',
        description: '備考',
        account_item_id: '勘定科目',
        tax_code: '税区分',
        item_id: '品目',
        section_id: '部門',
        tag_ids: 'メモタグ',
        segment_1_tag_id: 'セグメント１ID',
        segment_2_tag_id: 'セグメント２ID',
        segment_3_tag_id: 'セグメント３ID'
      }]
    };
    this.objPut = {
      company_id: '事業所ID',
      issue_date: '請求日 (yyyy-MM-dd)',
      partner_id: '取引先',
      partner_code: '取引先コード',
      invoice_number: '請求書番号',
      title: 'タイトル',
      due_date: '期日 (yyyy-MM-dd)',
      booking_date: '売上計上日',
      description: '概要',
      invoice_status: '請求書ステータス',
      partner_display_name: '請求書に表示する取引先名',
      partner_title: '敬称（御中、様、(空白)の3つから選択）',
      partner_contact_info: '取引先担当者名',
      partner_zipcode: '取引先郵便番号',
      partner_prefecture_code: '取引先都道府県',
      partner_address1: '取引先市区町村・番地 ',
      partner_address2: '取引先建物名・部屋番号など',
      company_name: '事業所名',
      company_zipcode: '事業所郵便番号',
      company_prefecture_code: '事業所都道府県',
      company_address1: '事業所市区町村・番地',
      company_address2: '事業所建物名・部屋番号など',
      company_contact_info: '事業所担当者名',
      payment_type: '支払方法',
      payment_bank_info: '支払口座',
      use_virtual_transfer_account: '振込専用口座の利用',
      message: 'メッセージ',
      notes: '請求書備考',
      invoice_layout: '請求書レイアウト',
      tax_entry_method: '請求書の消費税計算方法',
      invoice_contents: [{
        id: '請求内容ID',
        order: '順序',
        type: '行の種類',
        qty: '数量',
        unit: '単位',
        unit_price: '単価',
        vat: '消費税額',
        description: '備考',
        account_item_id: '勘定科目',
        tax_code: '税区分',
        item_id: '品目',
        section_id: '部門',
        tag_ids: 'メモタグ',
        segment_1_tag_id: 'セグメント１ID',
        segment_2_tag_id: 'セグメント２ID',
        segment_3_tag_id: 'セグメント３ID'
      }]
    };

  }

  /**
   * 指定したIDの請求書を取得するメソッド
   * @param  {number}  invoice_id - 請求書ID
   * @return  {Object}  response - 請求書情報を格納したオブジェクト
   */

  getInvoice(invoice_id) {
    const url = `${this.url}/${invoice_id}`
      + `?company_id=${this.company_id}`;
    const response = this.apiRequest.fetchResponse(url, this.apiRequest.paramsGet);
    Utilities.sleep(300);
    return response.invoice;
  }

  /**
   * JSONオブジェクトから請求書を登録するメソッド
   * @param  {Object}  payload - 登録する内容のJSONオブジェクト
   * @return  {Object}  response - 請求書情報を格納したオブジェクト
   */

  postInvoice(payload) {
    const url = this.url;
    this.apiRequest.paramsPost.payload = JSON.stringify(payload);
    const response = this.apiRequest.fetchResponse(url, this.apiRequest.paramsPost);
    Utilities.sleep(300);
    return response.invoice;
  }

  /**
   * シート名で指定したシートの請求データから一括して請求書を作成するメソッド
   * @param   {string}  sheetName - 請求データを格納したシート名
   * @param   {string}  groupKey - 複数の請求データを取りまとめるキーとなるヘッダー項目（デフォルト：請求番号）
   * @return  {SpreadsheetApp.Range} データ登録した範囲のRangeオブジェクト
   */

  postInvoicesFromSheet(sheetName, groupKey = '請求書番号') {

    /* 日本語で記述した値をシステム指定の値に変換 */

    // freeeAPIのIDと取引先名が列挙されたMapオブジェクト
    const mapPartners = new Partners(this.accessToken, this.company_id).mapIdName();

    // freeeAPIのIDと勘定科目名が列挙されたMapオブジェクト
    const mapAccountItems = new AccountItems(this.accessToken, this.company_id).mapIdName();

    // freeeAPIのコードと税区分名が列挙されたMapオブジェクト
    const mapTaxes = new Taxes(this.accessToken, this.company_id).mapCodeName();

    // freeeAPIのIDと品目名が列挙されたMapオブジェクト
    const mapItems = new Items(this.accessToken, this.company_id).mapIdName();

    // freeeAPIのIDと部門名が列挙されたMapオブジェクト
    const mapSections = new Sections(this.accessToken, this.company_id).mapIdName();

    // freeeAPIのIDとメモタグ名が列挙されたMapオブジェクト
    const mapTags = new Tags(this.accessToken, this.company_id).mapIdName();


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

      // 請求日
      newPostObj.issue_date =
        new DateFormat(newPostObj.issue_date).string

      // 期日
      newPostObj.due_date =
        new DateFormat(newPostObj.due_date).string

      // 売上計上日
      newPostObj.booking_date =
        new DateFormat(newPostObj.booking_date).string

      // 取引先
      newPostObj.partner_id =
        MapObject.convertValue2Key(mapPartners, newPostObj.partner_id);

      // 請求書ステータス
      newPostObj.invoice_status =
        new Enum().convertValue2Key('INVOICE_STATUS', newPostObj.invoice_status);

      // 取引先都道府県
      newPostObj.partner_prefecture_code =
        new Enum().convertValue2Key('PREFECTURE_CODES', newPostObj.partner_prefecture_code);

      // 事業所都道府県
      newPostObj.company_prefecture_code =
        new Enum().convertValue2Key('PREFECTURE_CODES', newPostObj.company_prefecture_code);

      // 支払方法種別
      newPostObj.payment_type =
        new Enum().convertValue2Key('PAYMENT_TYPE', newPostObj.payment_type);

      // 請求書レイアウト
      newPostObj.invoice_layout =
        new Enum().convertValue2Key('INVOICE_LAYOUT', newPostObj.invoice_layout);

      // 請求書の消費税計算方法
      newPostObj.tax_entry_method =
        new Enum().convertValue2Key('TAX_ENTRY_METHOD', newPostObj.tax_entry_method);

      // 請求明細
      newPostObj.invoice_contents.forEach(content => {
        content.type = new Enum().convertValue2Key('INVOICE_CONTENTS_TYPE', content.type);
        content.account_item_id = MapObject.convertValue2Key(mapAccountItems, content.account_item_id);
        content.tax_code = MapObject.convertValue2Key(mapTaxes, content.tax_code);
        content.item_id = MapObject.convertValue2Key(mapItems, content.item_id);
        content.section_id = MapObject.convertValue2Key(mapSections, content.section_id);
        if (content.tag_ids) { content.tag_ids = content.tag_ids.split(',').map(tagName => MapObject.convertValue2Key(mapTags, tagName)) };
      });

      /* ブランク等不要なプロパティを削除 */
      ObjectJSON.deleteBlankProperties(newPostObj);
      return this.postInvoice(newPostObj);
    }

    /* シートの指定した同一のgroupKeyごとにPOSTしていく処理 */

    const postInvoices_DataSheet = new DataSheet(sheetName);
    const uniqueKeys = postInvoices_DataSheet.getUniqueKeys(groupKey);
    const invoicesObjs = postInvoices_DataSheet.rangeToDataObjs();

    uniqueKeys.forEach(key => {
      const invoiceContents = invoicesObjs.filter(content => content[groupKey] === key);
      postInvoiceFromData(invoiceContents);
    });

    // 戻り値として更新したセル範囲
    return postInvoices_DataSheet.rangeData;

  }

  /**
   * JSONオブジェクトから請求書を更新するメソッド
   * @param  {number}  invoice_id - 請求書ID
   * @param  {Object}  payload - 更新内容
   * @return  {Object}  response - 更新された請求書オブジェクト
   */

  putInvoice(invoice_id, payload) {
    const url = `${this.url}/${invoice_id}`
    this.apiRequest.paramsPut.payload = JSON.stringify(payload);
    const response = this.apiRequest.fetchResponse(url, this.apiRequest.paramsPut);
    Utilities.sleep(300);
    return response;
  }

  /**
   * シート名で指定したシートの請求書データから一括して請求書を更新するメソッド
   * @param   {string}  sheetName -請求書データを格納したシート名
   * @param  {string}  folderId - 更新前の請求書一覧のバックアップを保存したフォルダのID（デフォルト：ルートフォルダに保存）
   * @return  {SpreadsheetApp.Range} データ登録した範囲のRangeオブジェクト
   */

  renewInvoicesFromSheet(sheetName, folderId = '') {

    /* 日本語で記述した値をシステム指定の値に変換 */

    // 収支区分が列挙されたMapオブジェクト
    const mapDEAL_TYPE = new Enum().DEAL_TYPE;

    // 取引先名が列挙されたMapオブジェクト
    const mapPartners = new Partners(this.accessToken, this.company_id).mapIdName();

    // 勘定科目名が列挙されたMapオブジェクト
    const mapAccountItems = new AccountItems(this.accessToken, this.company_id).mapIdName();

    // 税区分名が列挙されたMapオブジェクト
    const mapTaxes = new Taxes(this.accessToken, this.company_id).mapCodeName();

    // 品目名が列挙されたMapオブジェクト
    const mapItems = new Items(this.accessToken, this.company_id).mapIdName();

    // 部門名が列挙されたMapオブジェクト
    const mapSections = new Sections(this.accessToken, this.company_id).mapIdName();

    // メモタグ名が列挙されたMapオブジェクト
    const mapTags = new Tags(this.accessToken, this.company_id).mapIdName();

    /* 請求書IDごとに更新していく関数 */

    const putInvoiceFromData = (invoice_id, invoiceContents) => {

      // PUT用のオブジェクトを明細行オブジェクトを結合して作成
      const newPutObjs = invoiceContents.map(objContent => {
        objContent['事業所ID'] = this.company_id;
        return ObjectJSON.overwriteValueLinkObj(this.objPut, objContent)
      });
      const newPutObj = ObjectJSON.combineObjs(this.objPut, newPutObjs);


      // 請求書番号
      newPutObj.invoice_number =
        newPutObj.invoice_number.toString();

      // 請求日 (yyyy-MM-dd)
      newPutObj.issue_date =
        new DateFormat(newPutObj.issue_date).string;

      // 支払期日 (yyyy-MM-dd)
      if (newPutObj.due_date) { newPutObj.due_date = new DateFormat(newPutObj.due_date).string };

      // 売上計上日
      if (newPutObj.booking_date) { newPutObj.booking_date = new DateFormat(newPutObj.booking_date).string };

      // 取引先
      newPutObj.partner_id =
        MapObject.convertValue2Key(mapPartners, newPutObj.partner_id);

      // 請求書ステータス
      newPutObj.invoice_status =
        new Enum().convertValue2Key('INVOICE_STATUS', newPutObj.invoice_status);

      // 取引先都道府県
      newPutObj.partner_prefecture_code =
        new Enum().convertValue2Key('PREFECTURE_CODES', newPutObj.partner_prefecture_code);

      // 事業所都道府県
      newPutObj.company_prefecture_code =
        new Enum().convertValue2Key('PREFECTURE_CODES', newPutObj.company_prefecture_code);

      // 支払方法種別
      newPutObj.payment_type =
        new Enum().convertValue2Key('PAYMENT_TYPE', newPutObj.payment_type);

      // 請求書レイアウト
      newPutObj.invoice_layout =
        new Enum().convertValue2Key('INVOICE_LAYOUT', newPutObj.invoice_layout);

      // 請求書の消費税計算方法
      newPutObj.tax_entry_method =
        new Enum().convertValue2Key('TAX_ENTRY_METHOD', newPutObj.tax_entry_method);


      // 請求書明細
      newPutObj.invoice_contents.forEach(content => {
        content.type = new Enum().convertValue2Key('INVOICE_CONTENTS_TYPE', content.type);
        content.account_item_id = MapObject.convertValue2Key(mapAccountItems, content.account_item_id);
        content.tax_code = MapObject.convertValue2Key(mapTaxes, content.tax_code);
        content.item_id = MapObject.convertValue2Key(mapItems, content.item_id);
        content.section_id = MapObject.convertValue2Key(mapSections, content.section_id);
        if (content.tag_ids) { content.tag_ids = content.tag_ids.split(',').map(tagName => MapObject.convertValue2Key(mapTags, tagName)) };
      });


      /* ブランク等不要なプロパティを削除 */
      ObjectJSON.deleteBlankProperties(newPutObj);
      return this.putInvoice(invoice_id, newPutObj);
    }

    /* シートから更新用のデータをオブジェクトで取得 */
    const groupKey = '請求書ID' // 更新の場合はソートするキーは請求書ID以外は考えない
    const putInvoices_DataSheet = new DataSheet(sheetName);
    const uniqueKeys = putInvoices_DataSheet.getUniqueKeys(groupKey);
    const invoicesObjs = putInvoices_DataSheet.rangeToDataObjs();

    /* 更新前の請求書データをバックアップ用に配列に格納 */
    const oldInvoices = uniqueKeys.map(key => {
      const oldInvoice = this.getInvoice(key);
      return oldInvoice;
    });

    /* 更新前の請求書データをGoogleドライブの指定したIDのフォルダ（デフォルト：ルート）に事業所IDとタイムスタンプをつけてバックアップ */
    const timeStamp = new DateFormat(new Date(), 'yyyyMMddhhmmss').string;
    const fileName = `${this.company_id}_invoices_${timeStamp}.txt`;

    if (folderId === '') {
      DriveApp.getRootFolder().createFile(fileName, JSON.stringify(oldInvoices))
    }
    else {
      DriveApp.getFolderById(folderId).createFile(fileName, JSON.stringify(oldInvoices))
    };

    /* 同一の請求書IDごとにPUTしていく処理 */
    uniqueKeys.forEach(key => {
      const invoiceContents = invoicesObjs.filter(content => content[groupKey] === key);
      putInvoiceFromData(key, invoiceContents);
    });

    Browser.msgBox(`
    ${sheetName}シートの内容で請求書を更新しました。
    更新前の内容は、${fileName}にバックアップされています。
    `);
  }
}

/**
 * freee個別請求書クラスのインスタンスを生成するファクトリ関数
 * 
 * @param  {string}  accessToken - アクセストークン
 * @param  {number}  company_id - 事業所ID
 * @return  {Partner}  freee個別請求書オブジェクト
 */

function invoice(accessToken, company_id) {
  return new Invoice(accessToken, company_id);
}
