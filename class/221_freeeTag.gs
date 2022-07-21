/**
 * class tag
 * freee個別メモタグの取得・作成・更新に関するクラス
 * 
 * プロパティ
 * apiRequest - freeeAPIリクエストオブジェクト
 * accessToken - アクセストークン
 * url - リクエストURL
 * company_id - 事業所ID
 * 
 * メソッド
 * getTag(tag_id) - 指定したIDのメモタグを取得するメソッド
 * postTag(payload) - JSONオブジェクトからメモタグを登録するメソッド
 * postTagFromData(objData) - 日本語ヘッダー項目をプロパティに持つオブジェクトからメモタグを登録するメソッド
 * putTag(tag_id, payload) - JSONオブジェクトからメモタグを更新するメソッド
 * putTagFromData(objData) - 日本語ヘッダー項目をプロパティに持つオブジェクトからメモタグを更新するメソッド
 * renewTagsFromSheet(sheetName, folderId = '') - シート名で指定したシートのデータからメモタグを一括更新するメソッド
 * 
 * 
 */

/* = = = = = = = = = = = = = = = = = = = = = = = = = = = = */


class Tag {
  /**
   * メモタグ操作のためのリクエストを定義するコンストラクタ
   * @constructor
   * @parama  {string}  accessToken - アクセストークン
   * @params  {number}  company_id - 事業所ID
   * 
   */

  constructor(accessToken, company_id) {
    this.apiRequest = new ApiRequest(accessToken);
    this.url = this.apiRequest.urlAccount + 'api/1/tags';
    this.accessToken = accessToken;
    this.company_id = company_id;
    this.objPost = {
      company_id: '事業所ID',
      name: 'メモタグ名 (30文字以内)',
      shortcut1: 'ショートカット1 (255文字以内)',
      shortcut2: 'ショートカット2 (255文字以内)'
    };
    this.objPut = {
      company_id: '事業所ID',
      name: 'メモタグ名 (30文字以内)',
      shortcut1: 'ショートカット1 (255文字以内)',
      shortcut2: 'ショートカット2 (255文字以内)'
    };
  }

  /**
   * 指定したIDのメモタグを取得するメソッド
   * @params  {number}  tag_id - メモタグID
   * @return  {Object}  response - メモタグ情報を格納したオブジェクト
   */

  getTag(tag_id) {
    const url = `${this.url}/${tag_id}`
      + `?company_id=${this.company_id}`;
    const response = this.apiRequest.fetchResponse(url, this.apiRequest.paramsGet);
    Utilities.sleep(300);
    return response.tag;
  }

  /**
   * JSONオブジェクトからメモタグを登録するメソッド
   * @params  {Object}  payload - 登録する内容のJSONオブジェクト
   * @return  {Object}  response - メモタグ情報を格納したオブジェクト
   */

  postTag(payload) {
    const url = this.url;
    this.apiRequest.paramsPost.payload = JSON.stringify(payload);
    const response = this.apiRequest.fetchResponse(url, this.apiRequest.paramsPost);
    Utilities.sleep(300);
    return response.tag;
  }

  /**
   * 日本語ヘッダー項目をプロパティに持つオブジェクトからメモタグを登録するメソッド
   * @params  {Object}  objData - this.objPostの各値（日本語）をプロパティにしたオブジェクト（登録内容）
   * @return  {Object}  response - メモタグ情報を格納したオブジェクト
   */

  postTagFromData(objData) {

    // POST用のオブジェクトを生成（キーと値をリンクさせて変換）
    const newPostObj = ObjectJSON.overwriteValueLinkObj(this.objPost, objData);
    newPostObj.company_id = this.company_id

    /* ブランク等不要なプロパティを削除 */
    ObjectJSON.deleteBlankProperties(newPostObj);

    return this.postTag(newPostObj);

  }

  /**
   * JSONオブジェクトからメモタグを更新するメソッド
   * @params  {number}  tag_id - メモタグID
   * @params  {Object}  payload - 更新内容
   * @return  {Object}  response - 更新されたメモタグオブジェクト
   */

  putTag(tag_id, payload) {
    const url = `${this.url}/${tag_id}`
    this.apiRequest.paramsPut.payload = JSON.stringify(payload);
    const response = this.apiRequest.fetchResponse(url, this.apiRequest.paramsPut);
    Utilities.sleep(300);
    return response;
  }

  /**
   * 日本語ヘッダー項目をプロパティに持つオブジェクトからメモタグを更新するメソッド
   * @params  {Object}  objData - this.objPutの各値（日本語）をプロパティにしたオブジェクト（登録内容）
   * @return  {Object}  response - メモタグ情報を格納したオブジェクト
   */

  putTagFromData(objData) {

    // PUTのpayloadに不要なメモタグIDは直接取得
    const tag_id = objData['タグID'];

    // PUT用のオブジェクトを生成（キーと値をリンクさせて変換）
    const newPutObj = ObjectJSON.overwriteValueLinkObj(this.objPut, objData);
    newPutObj.company_id = this.company_id

    /* ブランク等不要なプロパティを削除 */
    ObjectJSON.deleteBlankProperties(newPutObj);

    return this.putTag(tag_id, newPutObj);

  }

  /**
   * シート名で指定したシートのデータからメモタグを一括更新するメソッド
   * @params  {string}  sheetName - 更新するメモタグの一覧が入力されているシート名
   * @params  {string}  folderId - 更新前のメモタグ一覧のバックアップを保存したフォルダのID（デフォルト：ルートフォルダに保存）
   */

  renewTagsFromSheet(sheetName, folderId = '') {

    // 更新前の全タグのデータをGoogleドライブの指定したIDのフォルダ（デフォルト：ルート）に事業所IDとタイムスタンプをつけてバックアップ
    const allTags = new Tags(this.accessToken, this.company_id).getAllTags()
    const timeStamp = new DateFormat(new Date(), 'yyyyMMddhhmmss').string;
    const fileName = `${this.company_id}_tags_${timeStamp}.txt`;

    if (folderId === '') {
      DriveApp.getRootFolder().createFile(fileName, JSON.stringify(allTags))
    }
    else {
      DriveApp.getFolderById(folderId).createFile(fileName, JSON.stringify(allTags))
    };

    const renewTags_DataSheet = new DataSheet(sheetName);
    const renewTags = renewTags_DataSheet.rangeToDataObjs();
    renewTags.forEach(objTag => this.putTagFromData(objTag));

    Browser.msgBox(`
    ${sheetName}シートの内容でメモタグを更新しました。
    更新前の内容は、${fileName}にバックアップされています。
    `);
  }
}

/**
 * freee個別メモタグクラスのインスタンスを生成するファクトリ関数
 * 
 * @params  {string}  accessToken - アクセストークン
 * @params  {number}  company_id - 事業所ID
 * @return  {Tag}  freee個別メモタグオブジェクト
 */

function tag(accessToken, company_id) {
  return new Tag(accessToken, company_id);
}





