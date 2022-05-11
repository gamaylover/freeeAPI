/**
 * class Taxes
 * freee税区分に関するクラス
 * 
 * プロパティ
 * apiRequest - freeeAPIリクエストオブジェクト
 * url - リクエストURL
 * 
 * メソッド
 * getAllTaxes() - 全ての税区分を配列で返すメソッド
 * getTaxCode(tax_name) - 指定した名称の税区分コードを返すメソッド
 * mapCodeName() - freeeAPIのコードと税区分名が列挙されたMapオブジェクトを生成するメソッド
 * updateTaxesSheet(sheetName) - アクティブなスプレッドシートのシート名で指定したシートの税区分を更新するメソッド
 * 
 */

/* = = = = = = = = = = = = = = = = = = = = = = = = = = = = */

class Taxes {

  /**
   * 税区分取得のためのリクエストURLを定義するコンストラクタ
   * @constructor
   * @parama  {string}  accessToken - アクセストークン
   * @params  {number}  company_id - 事業所ID
   */

  constructor(accessToken, company_id) {
    this.apiRequest = new ApiRequest(accessToken);
    this.url = this.apiRequest.urlAccount + `api/1/taxes/companies/${company_id}`;
  }

  /**
   * 全ての税区分を配列で返すメソッド
   * @return  {Array.<Object>}  aryTaxes - 全ての税区分オブジェクトを格納した配列
   */

  getAllTaxes() {
    const objTaxes = this.apiRequest.fetchResponse(this.url, this.apiRequest.paramsGet);
    const aryTaxes = objTaxes.taxes;
    return aryTaxes;
  }

  /**
   * 指定した名称の税区分コードを返すメソッド
   * @param   {string}  tax_name - 税区分名（表示名）
   * @return  {number}  tax_code - 税区分コード
   */

  getTaxCode(tax_name) {
    const aryTaxes = this.getAllTaxes();
    const taxes = aryTaxes.filter(taxes => taxes.name_ja === tax_name);
    if (taxes.length === 0) { throw new Error('該当する税区分がありません') };
    if (taxes.length === 1) { return taxes[0].code };
  }

  /**
   * freeeAPIのコードと税区分名が列挙されたMapオブジェクトを生成するメソッド
   * @return  {Array.<Map>}   mapCodeName - freeeAPIのコードと税区分名が列挙されたMapオブジェクト
   */

  mapCodeName() {
    const aryTaxes = this.getAllTaxes();
    const mapCodeName = new Map();
    aryTaxes.forEach(tax => mapCodeName.set(tax.code, tax.name_ja));
    return mapCodeName;
  }

  /**
   * アクティブなスプレッドシートのシート名で指定したシートの税区分を更新するメソッド
   * @param   {string}  sheetName - 税区分を更新したいシート名
   * @return  {SpreadsheetApp.Range} データ更新した範囲のRangeオブジェクト
   */

  updateTaxesSheet(sheetName) {

    // freeeAPIのIDと税区分が列挙されたMapオブジェクト
    const mapDISPLAY_CATEGORY = new Enum().DISPLAY_CATEGORY;

    // ここから必要なプロパティから値を取り出し、場合によっては変換していくメインの処理
    const aryTaxes = this.getAllTaxes();
    const objHeader = {
      code: '税区分コード',
      name: '税区分名',
      name_ja: '税区分名（日本語表示用）',
      display_category: '税区分の表示カテゴリ',
      available: 'true: 使用する、false: 使用しない'
    };

    const headerKeys = Object.keys(objHeader);
    const headerValues = headerKeys.map(key => objHeader[key]);
    const ary2D = aryTaxes.map(obj => headerKeys.map(key => {
      if (objHeader[key] === '税区分の表示カテゴリ') { return mapDISPLAY_CATEGORY.get(obj[key]) };
      return obj[key]
    }));
    ary2D.unshift(headerValues);

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    if (ss.getSheets().filter(sheet => sheet.getName() === sheetName).length === 0) { ss.insertSheet(sheetName, 0); } // 同一のシート名がなければ新規作成する
    const sheet = ss.getSheetByName(sheetName);
    sheet.getDataRange().clearContent();
    const range = sheet.getRange(1, 1, ary2D.length, ary2D[0].length);
    return range.setValues(ary2D);
  }
}

/**
 * freee税区分クラスのインスタンスを生成するファクトリ関数
 * @params  {string}  accessToken - アクセストークン
 * @params  {number}  company_id - 事業所ID
 * @return  {Taxes}  freee税区分オブジェクト
 */

function taxes(accessToken, company_id) {
  return new Taxes(accessToken, company_id);
}


