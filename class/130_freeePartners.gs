/**
 * class Partners
 * freee取引先一覧に関するクラス
 * 
 * プロパティ
 * apiRequest - freeeAPIリクエストオブジェクト
 * url - リクエストURL
 * accessToken - アクセストークン
 * company_id - 事業所ID
 * queries - 絞り込み条件
 * 
 * メソッド
 * getURL() - 指定した条件の取引先一覧のリクエストURLを返すメソッド
 * getAllPartners() - 全ての取引先一覧を配列で取得するメソッド
 * mapIdName() - freeeAPIのIDと勘定科目名が列挙されたMapオブジェクトを生成するメソッド
 * updatePartnersSheet(sheetName) - アクティブなスプレッドシートのシート名で指定したシートの取引先一覧を更新するメソッド
 * 
 */

/* = = = = = = = = = = = = = = = = = = = = = = = = = = = = */


class Partners {

  /**
   * 取引先一覧操作のためのリクエストURLを定義するコンストラクタ
   * @constructor
   * @parama  {string}  accessToken - アクセストークン
   * @params  {number}  company_id - 事業所ID
   */

  constructor(accessToken, company_id) {
    this.apiRequest = new ApiRequest(accessToken);
    this.url = this.apiRequest.urlAccount + 'api/1/partners';
    this.accessToken = accessToken;
    this.company_id = company_id;
    this.queries = {
      start_update_date: '',
      end_update_date: '',
      offset: '',
      limit: '3000', // 取得レコードの件数 (デフォルト: 50, 最小: 1, 最大: 3000)
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
   * 全ての取引先一覧を配列で取得するメソッド
   * @return  {Array.<Object>}   aryPartners  freee取引先オブジェクトの一覧を格納した配列
   */

  getAllPartners() {

    /* QUERY 絞り込み条件：取得レコードの件数上限のデータ型を変換 */
    let limit = Number();
    if (typeof this.queries.limit === 'number') { limit = this.queries.limit };
    if (typeof this.queries.limit === 'string') { limit = Number(this.queries.limit) };
    this.queries.limit = limit.toString();
    
    /* 指定した条件の取引先オブジェクト一覧を配列で取得 */

    // 取引先オブジェクト一覧を格納する空の配列
    let aryPartners = [];

    // 取引先取得件数の上限以上の取引先の登録がある場合にオフセット（ずらし）を行い全件を取得
    for (let offset = 0; offset === aryPartners.length; offset += limit) {
      this.queries.offset = offset;
      const url = this.getURL();
      const paramsGet = this.apiRequest.paramsGet;
      const ary = this.apiRequest.fetchResponse(url, paramsGet).partners;
      aryPartners = aryPartners.concat(ary);
      Utilities.sleep(300);
    }
    return aryPartners;
  }


  /**
   * freeeAPIのIDと取引先名が列挙されたMapオブジェクトを生成するメソッド
   * @return  {Array.<Map>}   mapIdName - freeeAPIのIDと取引先名が列挙されたMapオブジェクト
   */

  mapIdName() {
    const aryPartners = this.getAllPartners();
    const mapIdName = new Map();
    aryPartners.forEach(partner => mapIdName.set(partner.id, partner.name));
    return mapIdName;
  }

  /**
   * アクティブなスプレッドシートのシート名で指定したシートの取引先一覧を更新するメソッド
   * @param   {string}  sheetName - 取引先一覧を更新したいシート名
   * @return  {SpreadsheetApp.Range} データ更新した範囲のRangeオブジェクト
   */

  updatePartnersSheet(sheetName) {

    // freeeAPIのIDと事業所種別が列挙されたMapオブジェクト
    const mapORG_CODE = new Enum().ORG_CODE;

    // freeeAPIのIDと地域種別が列挙されたMapオブジェクト
    const mapCOUNTRY_CODE = new Enum().COUNTRY_CODE;

    // freeeAPIのIDと口座名が列挙されたMapオブジェクト
    const mapWallets = new Walletables(this.accessToken, this.company_id).mapIdName();

    // freeeAPIのIDと振込手数料負担（一括振込ファイル用）種別が列挙されたMapオブジェクト
    const mapTRANSFER_FEE_HANDLING_SIDE = new Enum().TRANSFER_FEE_HANDLING_SIDE;

    // freeeAPIのIDと都道府県名が列挙されたMapオブジェクト
    const mapPREFECTURE_CODES = new Enum().PREFECTURE_CODES;

    // freeeAPIのIDと請求書送付方法種別が列挙されたMapオブジェクト
    const mapSENDING_METHOD = new Enum().SENDING_METHOD;

    // freeeAPIのIDと銀行口座種別が列挙されたMapオブジェクト
    const mapACCOUNT_TYPE = new Enum().ACCOUNT_TYPE;

    // ここから必要なプロパティから値を取り出し、場合によっては変換していくメインの処理
    const aryPartners = this.getAllPartners();
    const objHeader = {
      id: '取引先ID',
      code: '取引先コード',
      company_id: '事業所ID',
      name: '取引先名',
      update_date: '更新日 (yyyy-MM-dd)',
      available: '取引先の使用設定（true: 使用する、false: 使用しない）',
      shortcut1: 'ショートカット1 (20文字以内)',
      shortcut2: 'ショートカット2 (20文字以内)',
      org_code: '事業所種別',
      country_code: '地域',
      long_name: '正式名称（255文字以内）',
      name_kana: 'カナ名称（255文字以内）',
      default_title: '敬称（御中、様、(空白)の3つから選択）',
      phone: '電話番号',
      contact_name: '担当者 氏名',
      email: '担当者 メールアドレス',
      payer_walletable_id: '振込元口座（一括振込ファイル用）',
      transfer_fee_handling_side: '振込手数料負担（一括振込ファイル用）',
      address_attributes: {
        zipcode: '郵便番号',
        prefecture_code: '都道府県',
        street_name1: '市区町村・番地',
        street_name2: '建物名・部屋番号など'
      },
      partner_doc_setting_attributes: {
        sending_method: '請求書送付方法'
      },
      partner_bank_account_attributes: {
        bank_name: '銀行名',
        bank_name_kana: '銀行名（カナ）',
        bank_code: '銀行コード',
        branch_name: '支店名',
        branch_kana: '支店名（カナ）',
        branch_code: '支店番号',
        account_type: '口座種別',
        account_number: '口座番号',
        account_name: '受取人名（カナ）',
        long_account_name: '受取人名'
      }
    };

    const objHeaderFlat = ObjectJSON.flatObj(objHeader);
    const headerKeys = Object.keys(objHeaderFlat);
    const headerValues = headerKeys.map(key => objHeaderFlat[key]);
    const ary2D = aryPartners.map(obj => {
      const objPartnerFlat = ObjectJSON.flatObj(obj);
      return headerKeys.map(key => {
        if (objHeaderFlat[key] === '事業所種別') { return mapORG_CODE.get(objPartnerFlat[key]) };
        if (objHeaderFlat[key] === '地域') { return mapCOUNTRY_CODE.get(objPartnerFlat[key]) };
        if (objHeaderFlat[key] === '振込元口座（一括振込ファイル用）') { return mapWallets.get(objPartnerFlat[key]) };
        if (objHeaderFlat[key] === '振込手数料負担（一括振込ファイル用）') { return mapTRANSFER_FEE_HANDLING_SIDE.get(objPartnerFlat[key]) };
        if (objHeaderFlat[key] === '都道府県') { return mapPREFECTURE_CODES.get(objPartnerFlat[key]) };
        if (objHeaderFlat[key] === '請求書送付方法') { return mapSENDING_METHOD.get(objPartnerFlat[key]) };
        if (objHeaderFlat[key] === '口座種別') { return mapACCOUNT_TYPE.get(objPartnerFlat[key]) };
        return objPartnerFlat[key]
      });
    });
    ary2D.unshift(headerValues);

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(sheetName);
    sheet.getDataRange().clearContent();
    const range = sheet.getRange(1, 1, ary2D.length, ary2D[0].length);
    return range.setValues(ary2D);
  }
}

/**
 * freee取引先一覧クラスのインスタンスを生成するファクトリ関数
 * @params  {string}  accessToken - アクセストークン
 * @params  {number}  company_id - 事業所ID
 * @return  {Partners}  freee取引先一覧オブジェクト
 */

function partners(accessToken, company_id) {
  return new Partners(accessToken, company_id);
}



