
/* freee事業所情報に関するクラス */

/**
 * MyCompaniesインスタンス生成後、全ての事業所情報を配列で返すメソッド
 * @return  {Array.<Object>}  aryCompanies - 全ての事業所オブジェクトを格納した配列
 */

function getMyCompanies() {
  throw new Error('MyCompaniesインスタンスを生成してから実行してください。');
}

/**
 * MyCompaniesインスタンス生成後、指定した名称の事業所IDを返すメソッド
 * @param   {string}  company_name - 事業所
 * @return  {number}  company_id - 事業所ID
 */

function getMyCompanyId(company_name) {
  throw new Error('MyCompaniesインスタンスを生成してから実行してください。');
}

/**
 * MyCompaniesインスタンス生成後、 アクティブなスプレッドシートのシート名で指定したシートの事業所情報を更新するメソッド
 * @param   {string}  sheetName - 事業所情報を更新したいシート名
 * @return  {SpreadsheetApp.Range} データ更新した範囲のRangeオブジェクト
 */

function updateMyCompaniesSheet(sheetName) {
  throw new Error('MyCompaniesインスタンスを生成してから実行してください。');
}

/* ======================================================= */

/* freee勘定科目一覧に関するクラス */

/**
 * AccountItemsインスタンス生成後、勘定科目一覧を配列で返すメソッド
 * @return  {Array.<Object>}  aryAccountItems - 全ての勘定科目オブジェクトを格納した配列
 */

function getAllAccountItems() {
  throw new Error('AccountItemsインスタンスを生成してから実行してください。');
}

/**
 * AccountItemsインスタンス生成後、指定した名前の勘定科目のIDを返すメソッド
 * @param   {string}  accountItem_name - 勘定科目名
 * @return  {number}  accountItem_id - 勘定科目ID
 */

function getAccountItemId(accountItem_name) {
  throw new Error('AccountItemsインスタンスを生成してから実行してください。');
}

/**
 * AccountItemsインスタンス生成後、 アクティブなスプレッドシートのシート名で指定したシートの勘定科目一覧を更新するメソッド
 * @param   {string}  sheetName - 勘定科目一覧を更新したいシート名
 * @return  {SpreadsheetApp.Range} データ更新した範囲のRangeオブジェクト
 */

function updateAccountItemsSheet(sheetName) {
  throw new Error('AccountItemsインスタンスを生成してから実行してください。');
}

/* ======================================================= */

/* freee取引先一覧に関するクラス */

/**
 * Partnersインスタンス生成後、全ての取引先一覧を配列で返すメソッド
 * @return  {Array.<Object>}  aryPartners - 全ての取引先オブジェクトを格納した配列
 */

function getAllPartners() {
  throw new Error('Partnersインスタンスを生成してから実行してください。');
}

/**
 * Partnersインスタンス生成後、 アクティブなスプレッドシートのシート名で指定したシートの取引先一覧を更新するメソッド
 * @param   {string}  sheetName - 取引先一覧を更新したいシート名
 * @return  {SpreadsheetApp.Range} データ更新した範囲のRangeオブジェクト
 */

function updatePartnersSheet(sheetName) {
  throw new Error('Partnersインスタンスを生成してから実行してください。');
}

/* freee個別取引先に関するクラス */

/**
 * Partnerインスタンス生成後、指定したIDの取引先を取得するメソッド
 * @return  {Object}  response - 取引先情報を格納したオブジェクト
 */

function getPartner() {
  throw new Error('Partnerインスタンスを生成してから実行してください。');
}

/**
 * Partnerインスタンス生成後、JSONオブジェクトから取引先を登録するメソッド
 * @params  {Object}  payload - 登録する内容のJSONオブジェクト
 * @return  {Object}  response - 取引先情報を格納したオブジェクト
 */

function postPartner(payload) {
  throw new Error('Partnerインスタンスを生成してから実行してください。');
}

/**
 * Partnerインスタンス生成後、日本語ヘッダー項目をプロパティに持つオブジェクトから取引先を登録するメソッド
 * @params  {Object}  objData - this.objPostの各値（日本語）をプロパティにしたオブジェクト（登録内容）
 * @return  {Object}  response - 取引先情報を格納したオブジェクト
 */

function postPartnerFromData(objData) {
  throw new Error('Partnerインスタンスを生成してから実行してください。');
}


/* ======================================================= */

/* freee部門一覧に関するクラス */

/**
 * Sectionsインスタンス生成後、部門一覧を配列で返すメソッド
 * @return  {Array.<Object>}  arySections - 全ての部門オブジェクトを格納した配列
 */

function getAllSections() {
  throw new Error('Sectionsインスタンスを生成してから実行してください。');
}

/**
 * Sectionsインスタンス生成後、アクティブなスプレッドシートのシート名で指定したシートの部門一覧を更新するメソッド
 * @param   {string}  sheetName - 部門一覧を更新したいシート名
 * @return  {SpreadsheetApp.Range} データ更新した範囲のRangeオブジェクト
 */

function updateSectionsSheet(sheetName) {
  throw new Error('Sectionsインスタンスを生成してから実行してください。');
}

/* ======================================================= */

/* freeeメモタグ一覧に関するクラス */

/**
 * Tagsインスタンス生成後、メモタグ一覧を配列で返すメソッド
 * @return  {Array.<Object>}  aryTags - 全てのメモタグオブジェクトを格納した配列
 */

function getAllTags() {
  throw new Error('Tagsインスタンスを生成してから実行してください。');
}

/**
 * Tagsインスタンス生成後、アクティブなスプレッドシートのシート名で指定したシートのメモタグ一覧を更新するメソッド
 * @param   {string}  sheetName - メモタグ一覧を更新したいシート名
 * @return  {SpreadsheetApp.Range} データ更新した範囲のRangeオブジェクト
 */

function updateTagsSheet(sheetName) {
  throw new Error('Tagsインスタンスを生成してから実行してください。');
}

/* ======================================================= */

/* freee品目一覧に関するクラス */

/**
 * Itemsインスタンス生成後、品目一覧を配列で返すメソッド
 * @return  {Array.<Object>}  aryItems - 全ての品目オブジェクトを格納した配列
 */

function getAllItems() {
  throw new Error('Itemsインスタンスを生成してから実行してください。');
}

/**
 * Itemsインスタンス生成後、アクティブなスプレッドシートのシート名で指定したシートの品目一覧を更新するメソッド
 * @param   {string}  sheetName - 品目一覧を更新したいシート名
 * @return  {SpreadsheetApp.Range} データ更新した範囲のRangeオブジェクト
 */

function updateItemsSheet(sheetName) {
  throw new Error('Itemsインスタンスを生成してから実行してください。');
}

/* ======================================================= */

/* freee税区分に関するクラス */

/**
 * Taxesインスタンス生成後、全ての税区分を配列で返すメソッド
 * @return  {Array.<Object>}  aryTaxes - 全ての税区分オブジェクトを格納した配列
 */

function getTaxes() {
  throw new Error('Taxesインスタンスを生成してから実行してください。');
}

/**
 * Taxesインスタンス生成後、指定した名称の税区分コードを返すメソッド
 * @param   {string}  tax_name - 税区分名（表示名）
 * @return  {number}  tax_code - 税区分コード
 */

function getTaxCode(tax_name) {
  throw new Error('Taxesインスタンスを生成してから実行してください。');
}

/**
 * Taxesインスタンス生成後、 アクティブなスプレッドシートのシート名で指定したシートの税区分を更新するメソッド
 * @param   {string}  sheetName - 税区分を更新したいシート名
 * @return  {SpreadsheetApp.Range} データ更新した範囲のRangeオブジェクト
 */

function updateTaxesSheet(sheetName) {
  throw new Error('Taxesインスタンスを生成してから実行してください。');
}

/* ======================================================= */

/* freee口座に関するクラス */

/**
 * Walletablesインスタンス生成後、口座を配列で返すメソッド
 * @return  {Array.<Object>}  aryWalletables - 全ての口座オブジェクトを格納した配列
 */

function getAllWalletables() {
  throw new Error('Walletablesインスタンスを生成してから実行してください。');
}

/**
 * Walletablesインスタンス生成後、 アクティブなスプレッドシートのシート名で指定したシートの口座を更新するメソッド
 * @param   {string}  sheetName - 口座を更新したいシート名
 * @return  {SpreadsheetApp.Range} データ更新した範囲のRangeオブジェクト
 */

function updateWalletablesSheet(sheetName) {
  throw new Error('Walletablesインスタンスを生成してから実行してください。');
}

/* ======================================================= */

/* freee取引一覧に関するクラス */

/**
 * Dealsインスタンス生成後、指定した取引一覧を配列で返すメソッド
 * @return  {Array.<Object>}  aryDeals - 全ての取引オブジェクトを格納した配列
 */

function getAllDeals() {
  throw new Error('Dealsインスタンスを生成してから実行してください。');
}

/**
 * Dealsインスタンス生成後、 アクティブなスプレッドシートのシート名で指定したシートの取引一覧を更新するメソッド
 * @param   {string}  sheetName - 取引一覧を更新したいシート名
 * @return  {SpreadsheetApp.Range} データ更新した範囲のRangeオブジェクト
 */

function updateDealsSheet(sheetName) {
  throw new Error('Dealsインスタンスを生成してから実行してください。');
}

/* ======================================================= */

/* freee請求書一覧に関するクラス */

/**
 * Invoicesインスタンス生成後、指定した請求書一覧を配列で返すメソッド
 * @return  {Array.<Object>}  aryInvoices - 全ての請求書一覧オブジェクトを格納した配列
 */

function getAllInvoices() {
  throw new Error('Invoicesインスタンスを生成してから実行してください。');
}

/**
 * Invoicesインスタンス生成後、 アクティブなスプレッドシートのシート名で指定したシートの請求書情報を更新するメソッド
 * @param   {string}  sheetName - 請求書情報を更新したいシート名
 * @return  {SpreadsheetApp.Range} データ更新した範囲のRangeオブジェクト
 */

function updateInvoicesSheet(sheetName) {
  throw new Error('Invoicesインスタンスを生成してから実行してください。');
}

/* freee個別請求書に関するクラス */

/**
 * Invoiceインスタンス生成後、指定したIDの請求書を取得するメソッド
 * @return  {Object}  response - 請求書情報を格納したオブジェクト
 */

function getInvoice() {
  throw new Error('Invoiceインスタンスを生成してから実行してください。');
}

/**
 * Invoiceインスタンス生成後、JSONオブジェクトから請求書を登録するメソッド
 * @params  {Object}  payload - 登録する内容のJSONオブジェクト
 * @return  {Object}  response - 請求書情報を格納したオブジェクト
 */

function postInvoice(payload) {
  throw new Error('Invoiceインスタンスを生成してから実行してください。');
}

/**
 * Invoiceインスタンス生成後、日本語ヘッダー項目をプロパティに持つオブジェクトから請求書を登録するメソッド
 * @params  {Object}  objData - this.objPostの各値（日本語）をプロパティにしたオブジェクト（登録内容）
 * @return  {Object}  response - 請求書情報を格納したオブジェクト
 */

function postInvoiceFromData(objData) {
  throw new Error('Invoiceインスタンスを生成してから実行してください。');
}

/**
 * Invoiceインスタンス生成後、JSONオブジェクトから請求書を更新するメソッド
 * @params  {number}  invoice_id - 請求書ID
 * @params  {Object}  payload - 登録する内容のJSONオブジェクト
 * @return  {Object}  response - 請求書情報を格納したオブジェクト
 */

function putInvoice(invoice_id, payload) {
  throw new Error('Invoiceインスタンスを生成してから実行してください。');
}

/* ======================================================= */

