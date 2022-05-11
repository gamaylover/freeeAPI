/**
 * class Partner
 * freee個別取引先の取得・作成・更新に関するクラス
 * 
 * プロパティ
 * apiRequest - freeeAPIリクエストオブジェクト
 * accessToken - アクセストークン
 * url - リクエストURL
 * company_id - 事業所ID
 * 
 * メソッド
 * getPartner(partner_id) - 指定したIDの取引先を取得するメソッド
 * getPartnerId(partner_name) - 指定した名称の取引先IDを返すメソッド
 * postPartner(payload) - JSONオブジェクトから取引先を登録するメソッド
 * postPartnerFromData(objData) - 日本語ヘッダー項目をプロパティに持つオブジェクトから取引先を登録するメソッド
 * putPartner(partner_id, payload) - JSONオブジェクトから取引先を更新するメソッド
 * putPartnerFromData(objData) - 日本語ヘッダー項目をプロパティに持つオブジェクトから取引先を更新するメソッド
 * renewPartnersFromSheet(sheetName, folderId = '') - シート名で指定したシートのデータから取引先を一括更新するメソッド
 * deletePartner(partner_id) - 指定したIDの取引先を削除するメソッド
 * deletePartnersFromSheet(sheetName, folderId = '')  - シート名で指定したシートのにある取引先を一括削除するメソッド
 * 
 */

/* = = = = = = = = = = = = = = = = = = = = = = = = = = = = */


class Partner {
  /**
   * 取引先操作のためのリクエストを定義するコンストラクタ
   * @constructor
   * @parama  {string}  accessToken - アクセストークン
   * @params  {number}  company_id - 事業所ID
   * 
   */

  constructor(accessToken, company_id) {
    this.apiRequest = new ApiRequest(accessToken);
    this.url = this.apiRequest.urlAccount + 'api/1/partners';
    this.accessToken = accessToken;
    this.company_id = company_id;
    this.objPost = {
      company_id: '事業所ID',
      name: '取引先名',
      code: '取引先コード',
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
      },
      payment_term_attributes: {
        cutoff_day: '締め日（支払期日設定）（29, 30, 31日の末日を指定する場合は、32を指定してください。）',
        additional_months: '支払月（支払期日設定）',
        fixed_day: '支払日（支払期日設定）（29, 30, 31日の末日を指定する場合は、32を指定してください。）'
      },
      invoice_payment_term_attributes: {
        cutoff_day: '入金月（入金期日設定）（29, 30, 31日の末日を指定する場合は、32を指定してください。）',
        additional_months: '入金月（入金期日設定）',
        fixed_day: '入金日（入金期日設定）（29, 30, 31日の末日を指定する場合は、32を指定してください。）'
      }
    };

    this.objPut = {
      company_id: '事業所ID',
      name: '取引先名',
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
      },
      payment_term_attributes: {
        cutoff_day: '締め日（支払期日設定）（29, 30, 31日の末日を指定する場合は、32を指定してください。）',
        additional_months: '支払月（支払期日設定）',
        fixed_day: '支払日（支払期日設定）（29, 30, 31日の末日を指定する場合は、32を指定してください。）'
      },
      invoice_payment_term_attributes: {
        cutoff_day: '入金月（入金期日設定）（29, 30, 31日の末日を指定する場合は、32を指定してください。）',
        additional_months: '入金月（入金期日設定）',
        fixed_day: '入金日（入金期日設定）（29, 30, 31日の末日を指定する場合は、32を指定してください。）'
      }
    };
  }

  /**
   * 指定したIDの取引先を取得するメソッド
   * @params  {number}  partner_id - 取引先ID
   * @return  {Object}  response - 取引先情報を格納したオブジェクト
   */

  getPartner(partner_id) {
    const url = `${this.url}/${partner_id}`
      + `?company_id=${this.company_id}`;
    const response = this.apiRequest.fetchResponse(url, this.apiRequest.paramsGet);
    Utilities.sleep(300);
    return response.partner;
  }

  /**
   * 指定した名称の取引先IDを返すメソッド
   * @param   {string}  partner_name - 取引先名
   * @return  {number}  partner_id - 事業所ID
   */

  getPartnerId(partner_name) {
    const aryPartners = this.getAllPartners();
    const partner = aryPartners.filter(partner => partner.name === partner_name);
    if (partner.length === 0) { throw new Error('該当する取引先がありません') };
    if (partner.length === 1) { return partner[0].id };
  }

  /**
   * JSONオブジェクトから取引先を登録するメソッド
   * @params  {Object}  payload - 登録する内容のJSONオブジェクト
   * @return  {Object}  response - 取引先情報を格納したオブジェクト
   */

  postPartner(payload) {
    const url = this.url;
    this.apiRequest.paramsPost.payload = JSON.stringify(payload);
    const response = this.apiRequest.fetchResponse(url, this.apiRequest.paramsPost);
    Utilities.sleep(300);
    return response.partner;
  }

  /**
   * 日本語ヘッダー項目をプロパティに持つオブジェクトから取引先を登録するメソッド
   * @params  {Object}  objData - this.objPostの各値（日本語）をプロパティにしたオブジェクト（登録内容）
   * @return  {Object}  response - 取引先情報を格納したオブジェクト
   */

  postPartnerFromData(objData) {

    // POST用のオブジェクトを生成（キーと値をリンクさせて変換）
    const newPostObj = ObjectJSON.overwriteValueLinkObj(this.objPost, objData);
    newPostObj.company_id = this.company_id

    /* 日本語で記述した値をシステム指定の値に変換 */

    // 事業所種別
    newPostObj.org_code =
      new Enum().convertValue2Key('ORG_CODE', newPostObj.org_code);

    // 地域
    newPostObj.country_code =
      new Enum().convertValue2Key('COUNTRY_CODE', newPostObj.country_code);

    // 振込手数料負担（一括振込ファイル用）種別
    newPostObj.transfer_fee_handling_side =
      new Enum().convertValue2Key('TRANSFER_FEE_HANDLING_SIDE', newPostObj.transfer_fee_handling_side);

    // 都道府県
    newPostObj.address_attributes.prefecture_code =
      new Enum().convertValue2Key('PREFECTURE_CODES', newPostObj.address_attributes.prefecture_code);

    // 請求書送付方法
    newPostObj.partner_doc_setting_attributes.sending_method =
      new Enum().convertValue2Key('SENDING_METHOD', newPostObj.partner_doc_setting_attributes.sending_method);

    // 銀行口座種別
    newPostObj.partner_bank_account_attributes.account_type =
      new Enum().convertValue2Key('ACCOUNT_TYPE', newPostObj.partner_bank_account_attributes.account_type);

    /* ブランク等不要なプロパティを削除 */
    ObjectJSON.deleteBlankProperties(newPostObj);

    return this.postPartner(newPostObj);

  }

  /**
   * JSONオブジェクトから取引先を更新するメソッド
   * @params  {number}  partner_id - 取引先ID
   * @params  {Object}  payload - 更新内容
   * @return  {Object}  response - 更新された取引先オブジェクト
   */

  putPartner(partner_id, payload) {
    const url = `${this.url}/${partner_id}`
    this.apiRequest.paramsPut.payload = JSON.stringify(payload);
    const response = this.apiRequest.fetchResponse(url, this.apiRequest.paramsPut);
    Utilities.sleep(300);
    return response;
  }

  /**
   * 日本語ヘッダー項目をプロパティに持つオブジェクトから取引先を更新するメソッド
   * @params  {Object}  objData - this.objPutの各値（日本語）をプロパティにしたオブジェクト（登録内容）
   * @return  {Object}  response - 取引先情報を格納したオブジェクト
   */

  putPartnerFromData(objData) {

    // PUTのpayloadに不要な取引先IDは直接取得
    const partner_id = objData['取引先ID'];

    // PUT用のオブジェクトを生成（キーと値をリンクさせて変換）
    const newPutObj = ObjectJSON.overwriteValueLinkObj(this.objPut, objData);
    newPutObj.company_id = this.company_id

    /* 日本語で記述した値をシステム指定の値に変換 */

    // 事業所種別
    newPutObj.org_code =
      new Enum().convertValue2Key('ORG_CODE', newPutObj.org_code);

    // 地域
    newPutObj.country_code =
      new Enum().convertValue2Key('COUNTRY_CODE', newPutObj.country_code);

    // 振込手数料負担（一括振込ファイル用）種別
    newPutObj.transfer_fee_handling_side =
      new Enum().convertValue2Key('TRANSFER_FEE_HANDLING_SIDE', newPutObj.transfer_fee_handling_side);

    // 都道府県
    newPutObj.address_attributes.prefecture_code =
      new Enum().convertValue2Key('PREFECTURE_CODES', newPutObj.address_attributes.prefecture_code);

    // 請求書送付方法
    newPutObj.partner_doc_setting_attributes.sending_method =
      new Enum().convertValue2Key('SENDING_METHOD', newPutObj.partner_doc_setting_attributes.sending_method);

    // 銀行口座種別
    newPutObj.partner_bank_account_attributes.account_type =
      new Enum().convertValue2Key('ACCOUNT_TYPE', newPutObj.partner_bank_account_attributes.account_type);

    /* ブランク等不要なプロパティを削除 */
    ObjectJSON.deleteBlankProperties(newPutObj);

    return this.putPartner(partner_id, newPutObj);

  }

  /**
   * シート名で指定したシートのデータから取引先を一括更新するメソッド
   * @params  {string}  sheetName - 更新する取引先の一覧が入力されているシート名
   * @params  {string}  folderId - 更新前の取引先一覧のバックアップを保存したフォルダのID（デフォルト：ルートフォルダに保存）
   */

  renewPartnersFromSheet(sheetName, folderId = '') {

    // 更新前の全取引先のデータをGoogleドライブの指定したIDのフォルダ（デフォルト：ルート）に事業所IDとタイムスタンプをつけてバックアップ
    const allPartners = new Partners(this.accessToken, this.company_id).getAllPartners()
    const timeStamp = new DateFormat(new Date(), 'yyyyMMddhhmmss').string;
    const fileName = `${this.company_id}_partners_${timeStamp}.txt`;

    if (folderId === '') {
      DriveApp.getRootFolder().createFile(fileName, JSON.stringify(allPartners))
    }
    else {
      DriveApp.getFolderById(folderId).createFile(fileName, JSON.stringify(allPartners))
    };

    const renewPartners_DataSheet = new DataSheet(sheetName);
    const renewPartners = renewPartners_DataSheet.rangeToDataObjs();
    renewPartners.forEach(objPartner => this.putPartnerFromData(objPartner));

    Browser.msgBox(`
    ${sheetName}シートの内容で取引先を更新しました。
    更新前の内容は、${fileName}にバックアップされています。
    `);
  }

  /**
   * 指定したIDの取引先を削除するメソッド
   * @params  {number}  partner_id - 取引先ID
   */

  deletePartner(partner_id) {
    const url = `${this.url}/${partner_id}`
      + `?company_id=${this.company_id}`;
    this.apiRequest.fetchResponse(url, this.apiRequest.paramsDelete);
    Utilities.sleep(300);
  }

  /**
   * シート名で指定したシートのにある取引先を一括削除するメソッド
   * @params  {string}  sheetName - 削除する取引先の一覧が入力されているシート名
   * @params  {string}  folderId - 削除前の取引先一覧のバックアップを保存したフォルダのID（デフォルト：ルートフォルダに保存）
   */

  deletePartnersFromSheet(sheetName, folderId = '') {

    // 削除前の全取引先のデータをGoogleドライブの指定したIDのフォルダ（デフォルト：ルート）に事業所IDとタイムスタンプをつけてバックアップ
    const allPartners = new Partners(this.accessToken, this.company_id).getAllPartners()
    const timeStamp = new DateFormat(new Date(), 'yyyyMMddhhmmss').string;
    const fileName = `${this.company_id}_partners_${timeStamp}.txt`;

    if (folderId === '') {
      DriveApp.getRootFolder().createFile(fileName, JSON.stringify(allPartners))
    }
    else {
      DriveApp.getFolderById(folderId).createFile(fileName, JSON.stringify(allPartners))
    };

    const deletePartners_DataSheet = new DataSheet(sheetName);
    const deletePartners = deletePartners_DataSheet.rangeToDataObjs();
    deletePartners.forEach(objPartner => this.deletePartner(objPartner['取引先ID']));

    Browser.msgBox(`
    ${sheetName}シートに列挙された取引先を削除しました。
    削除前の内容は、${fileName}にバックアップされています。
    `);
  }
}

/**
 * freee個別取引先クラスのインスタンスを生成するファクトリ関数
 * 
 * @params  {string}  accessToken - アクセストークン
 * @params  {number}  company_id - 事業所ID
 * @return  {Partner}  freee個別取引先オブジェクト
 */

function partner(accessToken, company_id) {
  return new Partner(accessToken, company_id);
}





