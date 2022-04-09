/**
 * class Deals
 * freee取引一覧に関するクラス
 * 
 * プロパティ
 * apiRequest - freeeAPIリクエストオブジェクト
 * url - リクエストURL
 * accessToken - アクセストークン
 * company_id - 事業所ID
 * queries - 絞り込み条件
 * 
 * メソッド
 * getURL() - 指定した条件の取引一覧のリクエストURLを返すメソッド
 * getAllDeals() - 指定した条件の全ての取引一覧を配列で取得するメソッド
 * updateDealsSheet(sheetName) - アクティブなスプレッドシートのシート名で指定したシートの取引一覧を更新するメソッド
 * 
 */

/* = = = = = = = = = = = = = = = = = = = = = = = = = = = = */


class Deals {

  /**
   * 取引一覧操作のためのリクエストURLを定義するコンストラクタ
   * @parama  {string}  accessToken - アクセストークン
   * @params  {number}  company_id - 事業所ID
   */

  constructor(accessToken, company_id) {
    this.apiRequest = new ApiRequest(accessToken);
    this.url = this.apiRequest.urlAccount + 'api/1/deals';
    this.accessToken = accessToken;
    this.company_id = company_id;
    const dateAYearAgo = new CalDate().aYearAgo(); // カレンダーの色々な日付を生成するクラスを利用して1年前のDateオブジェクトを取得
    this.queries = {
      partner_id: '',
      account_item_id: '',
      partner_code: '',
      status: '',
      type: '',
      start_issue_date: new CalDate(dateAYearAgo).string, // デフォルトの取得取引開始日を1年前に設定
      end_issue_date: '',
      start_due_date: '',
      end_due_date: '',
      start_renew_date: '',
      end_renew_date: '',
      offset: '',
      limit: '100', // 取得レコードの件数 (デフォルト: 20, 最大: 100)
      registered_from: '',
      accruals: ''
    }
  }

  /**
   * 指定した条件の取引一覧のリクエストURLを返すメソッド
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
   * 全ての取引一覧を配列で取得するメソッド
   * @return  {Array.<Object>}  aryDeals - freee取引オブジェクトの一覧を格納した配列
   */

  getAllDeals() {

    /* 指定した条件の取引オブジェクト一覧を配列で取得 */

    // 取引オブジェクト一覧を格納する空の配列
    let aryDeals = [];

    // 取引取得件数の上限以上の取引の登録がある場合にオフセット（ずらし）を行い全件を取得
    for (let offset = 0; offset === aryDeals.length; offset += this.queries.limit) {
      this.queries.offset = offset;
      const url = this.getURL();
      const paramsGet = this.apiRequest.paramsGet;
      const ary = this.apiRequest.fetchResponse(url, paramsGet).deals;
      aryDeals = aryDeals.concat(ary);
      Utilities.sleep(300);
    }
    return aryDeals;
  }

  /**
   * アクティブなスプレッドシートのシート名で指定したシートの取引一覧を更新するメソッド
   * @param   {string}  sheetName - 取引一覧を更新したいシート名
   * @return  {SpreadsheetApp.Range} データ更新した範囲のRangeオブジェクト
   */

  updateDealsSheet(sheetName) {

    // freeeAPIのIDと収支区分が列挙されたMapオブジェクト
    const mapDEAL_TYPE = new Enum().DEAL_TYPE;

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

    // freeeAPIのIDと口座名が列挙されたMapオブジェクト
    const mapWallets = new Walletables(this.accessToken, this.company_id).mapIdName();

    // ここから必要なプロパティから値を取り出し、場合によっては変換していくメインの処理
    const aryDeals = this.getAllDeals();
    const objHeader = {
      // 取引ID以外は、freeeエクスポートフォーマットに準拠
      id: '取引ID',
      type: '収支区分',
      ref_number: '管理番号',
      issue_date: '発生日 (yyyy-MM-dd)',
      due_date: '支払期日 (yyyy-MM-dd)',
      partner_id: '取引先',
      details: {
        account_item_id: '勘定科目',
        tax_code: '税区分',
        amount: '取引金額',
        vat: '消費税額',
        description: '備考',
        item_id: '品目',
        section_id: '部門',
        tag_ids: 'メモタグ'
      },
      payments: {
        date: '支払日',
        from_walletable_id: '口座',
        amount: '支払金額'
      }
    };
    // オブジェクトをフラット化し、階層に応じてキーを連結して新しいオブジェクトを生成し、それを2次元配列化
    const objHeaderFlat = ObjectJSON.flatObj(objHeader);
    const headerKeys = Object.keys(objHeaderFlat);
    const headerValues = headerKeys.map(key => objHeaderFlat[key]);
    const aryObjs = aryDeals.flatMap(obj => ObjectJSON.obj2DataObjs(obj)); // 子階層にオブジェクトの配列があるデータを行単位に展開
    const ary2D = aryObjs.map(obj => headerKeys.map(key => {
      if (objHeaderFlat[key] === '収支区分') { return mapDEAL_TYPE.get(obj[key]) };
      if (objHeaderFlat[key] === '取引先') { return mapPartners.get(obj[key]) };
      if (objHeaderFlat[key] === '勘定科目') { return mapAccountItems.get(obj[key]) };
      if (objHeaderFlat[key] === '税区分') { return mapTaxes.get(obj[key]) };
      if (objHeaderFlat[key] === '品目') { return mapItems.get(obj[key]) };
      if (objHeaderFlat[key] === '部門') { return mapSections.get(obj[key]) };
      if (objHeaderFlat[key] === 'メモタグ' && Array.isArray(obj[key])) { return obj[key].map(tag_id => mapTags.get(tag_id)).join(',') };
      if (objHeaderFlat[key] === '口座') { return mapWallets.get(obj[key]) };
      return obj[key];
    }));
    ary2D.unshift(headerValues);

    // 生成した2次元配列を事前にクリアしたスプレッドシートに追加
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(sheetName);
    sheet.getDataRange().clearContent();
    const range = sheet.getRange(1, 1, ary2D.length, ary2D[0].length);
    return range.setValues(ary2D);
  }
}

/**
 * freee取引一覧クラスのインスタンスを生成するファクトリ関数
 * @params  {string}  accessToken - アクセストークン
 * @params  {number}  company_id - 事業所ID
 * @return  {Deals}   freee取引一覧オブジェクト
 */

function deals(accessToken, company_id) {
  return new Deals(accessToken, company_id);
}

