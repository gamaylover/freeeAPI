/**
 * class ManualJournal
 * freee個別振替伝票の取得・作成・更新に関するクラス
 * 
 * プロパティ
 * apiRequest - freeeAPIリクエストオブジェクト
 * url - リクエストURL
 * accessToken - アクセストークン
 * company_id - 事業所ID
 * objPost - POST用のキー項目
 * 
 * メソッド
 * getManualJournal() - 指定したIDの振替伝票を取得するメソッド
 * postManualJournal(payload) - JSONオブジェクトから振替伝票を登録するメソッド
 * postManualJournalsFromSheet(sheetName) - シート名で指定したシートの請求データから一括して振替伝票を作成するメソッド
 * putManualJournal(manualJournal_id, payload)- JSONオブジェクトから振替伝票を更新するメソッド
 * 
 */

/* = = = = = = = = = = = = = = = = = = = = = = = = = = = = */


class ManualJournal {

  /**
   * 振替伝票操作のためのURLを定義するコンストラクタ
   * @constructor
   * @parama  {string}  accessToken - アクセストークン
   * @params  {number}  company_id - 事業所ID
   
   */

  constructor(accessToken, company_id) {
    this.apiRequest = new ApiRequest(accessToken);
    this.url = this.apiRequest.urlAccount + 'api/1/manual_journals';
    this.accessToken = accessToken;
    this.company_id = company_id;
    this.objPost = {
      company_id: '事業所ID',
      issue_date: '発生日 (yyyy-MM-dd)',
      adjustment: '仕訳種別',
      details: [{
        entry_side: '貸借',
        account_item_id: '勘定科目',
        tax_code: '税区分',
        partner_id: '取引先',
        partner_code: '取引先コード',
        item_id: '品目',
        section_id: '部門',
        tag_ids: 'メモタグ',
        segment_1_tag_id: 'セグメント１ID',
        segment_2_tag_id: 'セグメント２ID',
        segment_3_tag_id: 'セグメント３ID',
        amount: '取引金額（税込）',
        vat: '消費税額',
        description: '備考'
      }],
      receipt_ids: '証憑ファイルID'
    };

  }

  /**
   * 指定したIDの振替伝票を取得するメソッド
   * @params  {number}  manualJournal_id - 振替伝票ID
   * @return  {Object}  response - 振替伝票情報を格納したオブジェクト
   */

  getManualJournal(manualJournal_id) {
    const url = `${this.url}/${manualJournal_id}`
      + `?company_id=${this.company_id}`;
    const response = this.apiRequest.fetchResponse(url, this.apiRequest.paramsGet);
    Utilities.sleep(300);
    return response.manual_journals;
  }

  /**
   * JSONオブジェクトから振替伝票を登録するメソッド
   * @params  {Object}  payload - 登録する内容のJSONオブジェクト
   * @return  {Object}  response - 振替伝票情報を格納したオブジェクト
   */

  postManualJournal(payload) {
    const url = this.url;
    this.apiRequest.paramsPost.payload = JSON.stringify(payload);
    const response = this.apiRequest.fetchResponse(url, this.apiRequest.paramsPost);
    Utilities.sleep(300);
    return response.manual_journals;
  }


  /**
   * シート名で指定したシートの振替伝票データから一括して振替伝票を作成するメソッド
   * @param   {string}  sheetName - 振替伝票データを格納したシート名
   * @param   {string}  groupKey - 複数の振替伝票データを取りまとめるキーとなるヘッダー項目（デフォルト：グループキー）
   * @return  {SpreadsheetApp.Range} データ登録した範囲のRangeオブジェクト
   */

  postManualJournalsFromSheet(sheetName, groupKey = 'グループキー') {

    /* 日本語で記述した値をシステム指定の値に変換 */

    // 勘定科目名が列挙されたMapオブジェクト
    const mapAccountItems = new AccountItems(this.accessToken, this.company_id).mapIdName();

    // 税区分名が列挙されたMapオブジェクト
    const mapTaxes = new Taxes(this.accessToken, this.company_id).mapCodeName();

    // 取引先名が列挙されたMapオブジェクト
    const mapPartners = new Partners(this.accessToken, this.company_id).mapIdName();

    // 品目名が列挙されたMapオブジェクト
    const mapItems = new Items(this.accessToken, this.company_id).mapIdName();

    // 部門名が列挙されたMapオブジェクト
    const mapSections = new Sections(this.accessToken, this.company_id).mapIdName();

    // メモタグ名が列挙されたMapオブジェクト
    const mapTags = new Tags(this.accessToken, this.company_id).mapIdName();

    /**
     * 日本語ヘッダー項目をプロパティに持つオブジェクトの配列から振替伝票1件（複数明細対応）ごとに登録していく関数
     * @params  {Array.<Object>}  manualJournalContents - this.objPostの各値（日本語）をプロパティにしたオブジェクト（振替伝票明細）を格納した配列
     * @return  {Object}  response - 振替伝票情報を格納したオブジェクト
     */

    const postManualJournalFromData = manualJournalContents => {

      // POST用のオブジェクトを明細行オブジェクトを結合して作成

      const newPostObjs = manualJournalContents.map(objContent => {
        objContent['事業所ID'] = this.company_id;
        return ObjectJSON.overwriteValueLinkObj(this.objPost, objContent)
      });
      const newPostObj = ObjectJSON.combineObjs(this.objPost, newPostObjs);

      // 発生日 (yyyy-MM-dd)
      newPostObj.issue_date =
        new DateFormat(newPostObj.issue_date).string

      // 貸借行一覧
      newPostObj.details.forEach(detail => {
        detail.entry_side = new Enum().convertValue2Key('ENTRY_SIDE', detail.entry_side);
        detail.tax_code = MapObject.convertValue2Key(mapTaxes, detail.tax_code);
        detail.account_item_id = MapObject.convertValue2Key(mapAccountItems, detail.account_item_id);
        detail.partner_id = MapObject.convertValue2Key(mapPartners, detail.partner_id);
        detail.item_id = MapObject.convertValue2Key(mapItems, detail.item_id);
        detail.section_id = MapObject.convertValue2Key(mapSections, detail.section_id);
        if (detail.tag_ids) { detail.tag_ids = detail.tag_ids.split(',').map(tagName => MapObject.convertValue2Key(mapTags, tagName)) };
      });

      /* ブランク等不要なプロパティを削除 */
      ObjectJSON.deleteBlankProperties(newPostObj);
      return this.postManualJournal(newPostObj);
    }

    /* シートの指定した同一のgroupKeyごとにPOSTしていく処理 */

    const postManualJournals_DataSheet = new DataSheet(sheetName);
    const uniqueKeys = postManualJournals_DataSheet.getUniqueKeys(groupKey);
    const manualJournalsObjs = postManualJournals_DataSheet.rangeToDataObjs();

    uniqueKeys.forEach(key => {
      const manualJournalContents = manualJournalsObjs.filter(content => content[groupKey] === key);
      postManualJournalFromData(manualJournalContents);
    });

    // 戻り値として更新したセル範囲
    return postManualJournals_DataSheet.rangeData;

  }

  /**
   * JSONオブジェクトから振替伝票を更新するメソッド
   * @params  {number}  manualJournal_id - 振替伝票ID
   * @params  {Object}  payload - 更新内容
   * @return  {Object}  response - 更新された振替伝票オブジェクト
   */

  putManualJournal(manualJournal_id, payload) {
    const url = `${this.url}/${manualJournal_id}`
    this.apiRequest.paramsPut.payload = JSON.stringify(payload);
    const response = this.apiRequest.fetchResponse(url, this.apiRequest.paramsPut);
    Utilities.sleep(300);
    return response;
  }
}

/**
 * freee個別振替伝票クラスのインスタンスを生成するファクトリ関数
 * 
 * @params  {string}  accessToken - アクセストークン
 * @params  {number}  company_id - 事業所ID
 * @return  {Partner}  freee個別振替伝票オブジェクト
 */

function manualJournal(accessToken, company_id) {
  return new ManualJournal(accessToken, company_id);
}
