/**
 * class Deal
 * freee個別取引に関するクラス
 * 
 * プロパティ
 * apiRequest - freeeAPIリクエストオブジェクト
 * url - リクエストURL
 * accessToken - アクセストークン
 * company_id - 事業所ID
 * objPut - PUT用のキー項目
 * 
 * メソッド
 * getDeal(deal_id) - 指定したIDの取引を取得するメソッド
 * postDeal(payload) - JSONオブジェクトから取引を登録するメソッド
 * postDealsFromSheet(sheetName, groupKey) - シート名で指定したシートの取引データから一括して取引を登録するメソッド
 * putDeal(deal_id, payload) - JSONオブジェクトから取引を更新するメソッド
 * renewDealsFromSheet(sheetName) - シート名で指定したシートの取引データから一括して取引を更新するメソッド
 * 
 */

/* = = = = = = = = = = = = = = = = = = = = = = = = = = = = */


class Deal {

  /**
   * 個別取引操作のためのリクエストURLを定義するコンストラクタ
   * @parama  {string}  accessToken - アクセストークン
   * @params  {number}  company_id - 事業所ID
   */

  constructor(accessToken, company_id) {
    this.apiRequest = new ApiRequest(accessToken);
    this.url = this.apiRequest.urlAccount + 'api/1/deals';
    this.accessToken = accessToken;
    this.company_id = company_id;
    this.objPost = {
      issue_date: '発生日 (yyyy-MM-dd)',
      type: '収支区分',
      company_id: '事業所ID',
      due_date: '支払期日 (yyyy-MM-dd)',
      partner_id: '取引先',
      partner_code: '取引先コード',
      ref_number: '管理番号',
      details: [{
        tax_code: '税区分',
        account_item_id: '勘定科目',
        amount: '取引金額',
        item_id: '品目',
        section_id: '部門',
        tag_ids: 'メモタグ',
        segment_1_tag_id: 'セグメント１ID',
        segment_2_tag_id: 'セグメント２ID',
        segment_3_tag_id: 'セグメント３ID',
        description: '備考',
        vat: '消費税額'
      }],
      payments:
        [{
          amount: '支払金額',
          from_walletable_id: '口座',
          from_walletable_type: '口座区分',
          date: '支払日'
        }],
      receipt_ids: '証憑ファイルメモ'
    }


    this.objPut = {
      company_id: '事業所ID',
      type: '収支区分',
      ref_number: '管理番号',
      issue_date: '発生日 (yyyy-MM-dd)',
      due_date: '支払期日 (yyyy-MM-dd)',
      partner_id: '取引先',
      details: [{
        id: '明細ID',
        account_item_id: '勘定科目',
        tax_code: '税区分',
        amount: '取引金額',
        vat: '消費税額',
        description: '備考',
        item_id: '品目',
        section_id: '部門',
        tag_ids: 'メモタグ',
      }],
      receipt_ids: '証憑ファイルメモ'
    }
  }

  /**
   * 指定したIDの取引を取得するメソッド
   * @params  {number}  deal_id - 取引ID
   * @return  {Object}  response - 取引情報を格納したオブジェクト
   */

  getDeal(deal_id) {
    const url = `${this.url}/${deal_id}`
      + `?company_id=${this.company_id}`;
    const response = this.apiRequest.fetchResponse(url, this.apiRequest.paramsGet);
    Utilities.sleep(300);
    return response.deal;
  }

  /**
   * JSONオブジェクトから取引を登録するメソッド
   * @params  {Object}  payload - 登録する内容のJSONオブジェクト
   * @return  {Object}  response - 取引情報を格納したオブジェクト
   */

  postDeal(payload) {
    const url = this.url;
    this.apiRequest.paramsPost.payload = JSON.stringify(payload);
    const response = this.apiRequest.fetchResponse(url, this.apiRequest.paramsPost);
    Utilities.sleep(300);
    return response;
  }

  /**
   * シート名で指定したシートの取引データから一括して取引を登録するメソッド
   * @param   {string}  sheetName - 取引データを格納したシート名
   * @param   {string}  groupKey - 複数の取引データを取りまとめるキーとなるヘッダー項目（デフォルト：グループキー）
   * @return  {object}  objResults - 登録に成功したキーと失敗したキーを格納したオブジェクト
   */

  postDealsFromSheet(sheetName, groupKey = 'グループキー') {

    // HTTPリクエストでエラーを出さずにレスポンスに状況を出力させるオプション
    this.apiRequest.paramsPost.muteHttpExceptions = true;
    
    // 日本語で記述した値をシステム指定の値に変換
    const mapDEAL_TYPE = new Enum().DEAL_TYPE;　    // 収支区分が列挙されたMapオブジェクト
    const mapPartners = new Partners(this.accessToken, this.company_id).mapIdName(); // 取引先名が列挙されたMapオブジェクト
    const mapAccountItems = new AccountItems(this.accessToken, this.company_id).mapIdName(); // 勘定科目名が列挙されたMapオブジェクト
    const mapTaxes = new Taxes(this.accessToken, this.company_id).mapCodeName(); // 税区分名が列挙されたMapオブジェクト
    const mapItems = new Items(this.accessToken, this.company_id).mapIdName(); // 品目名が列挙されたMapオブジェクト
    const mapSections = new Sections(this.accessToken, this.company_id).mapIdName(); // 部門名が列挙されたMapオブジェクト
    const mapTags = new Tags(this.accessToken, this.company_id).mapIdName(); // メモタグ名が列挙されたMapオブジェクト
    const mapWallets = new Walletables(this.accessToken, this.company_id).mapIdName(); // 口座名が列挙されたMapオブジェクト   
    const mapWalletTypes = new Walletables(this.accessToken, this.company_id).mapIdType(); // 口座IDと区分が列挙されたMapオブジェクト
    const mapReceipts = new Receipts(this.accessToken, this.company_id).mapIdName(); // 証憑メモが列挙されたMapオブジェクト

    /**
     * 日本語ヘッダー項目をプロパティに持つオブジェクトの配列から取引1件（複数明細対応）ごとに登録していく関数
     * @params  {Array.<Object>}  dealContents - this.objPostの各値（日本語）をプロパティにしたオブジェクト（取引明細）を格納した配列
     * @return  {Array.<Object>}  aryResult - 登録キーとレスポンスを格納した配列
     */

    const postDealFromData = (dealContents) => {

      // POST用のオブジェクトを明細行オブジェクトを結合して作成
      const newPostObjs = dealContents.map(objContent => {
        objContent['事業所ID'] = this.company_id;
        return ObjectJSON.overwriteValueLinkObj(this.objPost, objContent)
      });
      const newPostObj = ObjectJSON.combineObjs(this.objPost, newPostObjs);

      // 収支区分
      newPostObj.type =
        MapObject.convertValue2Key(mapDEAL_TYPE, newPostObj.type);

      // 管理番号
      newPostObj.ref_number =
        newPostObj.ref_number.toString();

      // 発生日 (yyyy-MM-dd)
      newPostObj.issue_date =
        new DateFormat(newPostObj.issue_date).string;

      // 支払期日 (yyyy-MM-dd)
      if (newPostObj.due_date) { newPostObj.due_date = new DateFormat(newPostObj.due_date).string };

      // 取引先
      newPostObj.partner_id =
        MapObject.convertValue2Key(mapPartners, newPostObj.partner_id);

      // 取引明細
      newPostObj.details.forEach(detail => {
        detail.account_item_id = MapObject.convertValue2Key(mapAccountItems, detail.account_item_id);
        detail.tax_code = MapObject.convertValue2Key(mapTaxes, detail.tax_code);
        detail.item_id = MapObject.convertValue2Key(mapItems, detail.item_id);
        detail.section_id = MapObject.convertValue2Key(mapSections, detail.section_id);
        if (detail.tag_ids) { detail.tag_ids = detail.tag_ids.split(',').map(tagName => MapObject.convertValue2Key(mapTags, tagName)) };
      });

      // 決済口座
      newPostObj.payments.forEach(payment => {
        // 支払日
        payment.from_walletable_id = MapObject.convertValue2Key(mapWallets, payment.from_walletable_id);
        payment.from_walletable_type = mapWalletTypes.get(payment.from_walletable_id);
        if (payment.from_walletable_id) { payment.date = new DateFormat(payment.date).string; } // スプレッドシート空欄でも表示形式が日付だと1970-01-01が取得されるため
      });

      // 証憑ファイルメモ
      if (newPostObj.receipt_ids) { newPostObj.receipt_ids = newPostObj.receipt_ids.split(',').map(receiptMemo => MapObject.convertValue2Key(mapReceipts, receiptMemo)) };

      /* ブランク等不要なプロパティを削除 */

      ObjectJSON.deleteBlankProperties(newPostObj);
      return this.postDeal(newPostObj);
    }

    /* シートの指定した同一のgroupKeyごとにPOSTしていく処理 */

    const postDeals_DataSheet = new DataSheet(sheetName);
    const uniqueKeys = postDeals_DataSheet.getUniqueKeys(groupKey);
    const dealsObjs = postDeals_DataSheet.rangeToDataObjs();

    const aryResult = new Array(); // キーとエラーを含む全レスポンスを格納する配列を生成

    uniqueKeys.forEach(key => {
      const dealContents = dealsObjs.filter(content => content[groupKey] === key);
      const dealPosted = postDealFromData(dealContents);
      const objRespose = {
        key: key,
        response: dealPosted
      };
      aryResult.push(objRespose);
    });

    // 戻り値としてキーとレスポンスを含むオブジェクトを返す
    return aryResult;
  }

  /**
   * JSONオブジェクトから取引を更新するメソッド
   * @params  {number}  deal_id - 取引ID
   * @params  {Object}  payload - 更新内容
   * @return  {Object}  response - 更新された取引オブジェクト
   */

  putDeal(deal_id, payload) {
    const url = `${this.url}/${deal_id}`
    this.apiRequest.paramsPut.payload = JSON.stringify(payload);
    const response = this.apiRequest.fetchResponse(url, this.apiRequest.paramsPut);
    Utilities.sleep(300);
    return response;
  }

  /**
   * シート名で指定したシートの取引データから一括して取引を更新するメソッド
   * @param   {string}  sheetName -取引データを格納したシート名
   * @params  {string}  folderId - 更新前の取引一覧のバックアップを保存したフォルダのID（デフォルト：ルートフォルダに保存）
   * @return  {SpreadsheetApp.Range} データ登録した範囲のRangeオブジェクト
   */

  renewDealsFromSheet(sheetName, folderId = '') {

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

    // 証憑メモが列挙されたMapオブジェクト
    const mapReceipts = new Receipts(this.accessToken, this.company_id).mapIdName();

    /* 取引IDごとに更新していく関数 */

    const putDealFromData = (deal_id, dealContents) => {

      // PUT用のオブジェクトを明細行オブジェクトを結合して作成
      const newPutObjs = dealContents.map(objContent => {
        objContent['事業所ID'] = this.company_id;
        return ObjectJSON.overwriteValueLinkObj(this.objPut, objContent)
      });
      const newPutObj = ObjectJSON.combineObjs(this.objPut, newPutObjs);

      // 収支区分
      newPutObj.type =
        MapObject.convertValue2Key(mapDEAL_TYPE, newPutObj.type);

      // 管理番号
      newPutObj.ref_number =
        newPutObj.ref_number.toString();

      // 発生日 (yyyy-MM-dd)
      newPutObj.issue_date =
        new DateFormat(newPutObj.issue_date).string;

      // 支払期日 (yyyy-MM-dd)
      if (newPutObj.due_date) { newPutObj.due_date = new DateFormat(newPutObj.due_date).string };

      // 取引先
      newPutObj.partner_id =
        MapObject.convertValue2Key(mapPartners, newPutObj.partner_id);

      // 取引明細
      newPutObj.details.forEach(detail => {
        detail.account_item_id = MapObject.convertValue2Key(mapAccountItems, detail.account_item_id);
        detail.tax_code = MapObject.convertValue2Key(mapTaxes, detail.tax_code);
        detail.item_id = MapObject.convertValue2Key(mapItems, detail.item_id);
        detail.section_id = MapObject.convertValue2Key(mapSections, detail.section_id);
        if (detail.tag_ids) { detail.tag_ids = detail.tag_ids.split(',').map(tagName => MapObject.convertValue2Key(mapTags, tagName)) };
      });

      // 証憑ファイルメモ
      if (newPutObj.receipt_ids) { newPutObj.receipt_ids = newPutObj.receipt_ids.split(',').map(receiptMemo => MapObject.convertValue2Key(mapReceipts, receiptMemo)) };

      /* ブランク等不要なプロパティを削除 */
      ObjectJSON.deleteBlankProperties(newPutObj);
      return this.putDeal(deal_id, newPutObj);
    }

    /* シートから更新用のデータをオブジェクトで取得 */
    const groupKey = '取引ID' // 更新の場合はソートするキーは取引ID以外は考えない
    const putDeals_DataSheet = new DataSheet(sheetName);
    const uniqueKeys = putDeals_DataSheet.getUniqueKeys(groupKey);
    const dealsObjs = putDeals_DataSheet.rangeToDataObjs();

    /* 更新前の取引データをバックアップ用に配列に格納 */
    const oldDeals = uniqueKeys.map(key => {
      const oldDeal = this.getDeal(key);
      return oldDeal;
    });

    /* 更新前の取引データをGoogleドライブの指定したIDのフォルダ（デフォルト：ルート）に事業所IDとタイムスタンプをつけてバックアップ */
    const timeStamp = new DateFormat(new Date(), 'yyyyMMddhhmmss').string;
    const fileName = `${this.company_id}_deals_${timeStamp}.txt`;

    if (folderId === '') {
      DriveApp.getRootFolder().createFile(fileName, JSON.stringify(oldDeals))
    }
    else {
      DriveApp.getFolderById(folderId).createFile(fileName, JSON.stringify(oldDeals))
    };

    /* 同一の取引IDごとにPUTしていく処理 */
    uniqueKeys.forEach(key => {
      const dealContents = dealsObjs.filter(content => content[groupKey] === key);
      putDealFromData(key, dealContents);
    });

    Browser.msgBox(`
    ${sheetName}シートの内容で取引を更新しました。
    更新前の内容は、${fileName}にバックアップされています。
    `);
  }
}

/**
 * freee取引一覧クラスのインスタンスを生成するファクトリ関数
 * @params  {string}  accessToken - アクセストークン
 * @params  {number}  company_id - 事業所ID
 * @return  {Deals}   freee取引一覧オブジェクト
 */

function deal(accessToken, company_id) {
  return new Deal(accessToken, company_id);
}

