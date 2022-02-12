/**
 * 個別取引先の取得・作成・更新に関するクラス
 * @extends {ApiRequest} 
 * 
 * リファレンス
 * https://developer.freee.co.jp/docs/accounting/reference#/Partners
 * 
 * 2022/02/05 取引先の取得のみ対応
 * 
 */

/* = = = = = = = = = = = = = = = = = = = = = = = = = = = = */


class Partner extends ApiRequest {
  /**
   * 取引先操作のためのURLを定義するコンストラクタ
   * @constructor
   * @params  {integer}  company_id
   * @params  {integer}  partner_id
   * 
   */

  constructor(company_id, partner_id) {
    super();
    this.company_id = company_id;
    this.partner_id = partner_id;
    this.url = this.urlAccount + 'partners';
    this.tempKeys = [
      'id',
      'code',
      'company_id',
      'name',
      'update_date',
      'available',
      'shortcut1',
      'shortcut2',
      'org_code',
      'country_code',
      'long_name',
      'name_kana',
      'default_title',
      'phone',
      'contact_name',
      'email',
      'payer_walletable_id',
      'transfer_fee_handling_side',
      'address_attributes',
      'partner_doc_setting_attributes',
      'partner_bank_account_attributes',
      'payment_term_attributes',
      'invoice_payment_term_attributes'
    ];
  }

  /**
   * 指定したIDの取引先を取得するメソッド
   * @return  {object}  response
   */
  getPartner() {
    Utilities.sleep(1000);
    const url = `${this.url}/${this.partner_id}`
      + `?company_id=${this.company_id}`;
    const response = this.fetchResponse(url, this.paramsGet);
    return response.partner;
  }

}