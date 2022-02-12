/**
 * 個別請求書の取得・作成・更新に関するクラス
 * @extends {ApiRequest} 
 * 
 * メソッド
 * getInvoice
 * putInvoiceData(payload)
 * 
 */

/* = = = = = = = = = = = = = = = = = = = = = = = = = = = = */


class Invoice extends ApiRequest {
  /**
   * 請求書操作のためのURLを定義するコンストラクタ
   * @constructor
   * @params  {integer}  company_id
   * @params  {integer}  invoice_id
   */

  constructor(company_id, invoice_id) {
    super();
    this.company_id = company_id;
    this.invoice_id = invoice_id;
    this.url = this.urlAccount + 'invoices';
    this.tempKeys = [
      'company_id',
      'issue_date',
      'partner_id',
      'partner_code',
      'invoice_number',
      'title',
      'due_date',
      'booking_date',
      'description',
      'invoice_status',
      'partner_display_name',
      'partner_title',
      'partner_contact_info',
      'partner_zipcode',
      'partner_prefecture_code',
      'partner_address1',
      'partner_address2',
      'company_name',
      'company_zipcode',
      'company_prefecture_code',
      'company_address1',
      'company_address2',
      'company_contact_info',
      'payment_type',
      'payment_bank_info',
      'use_virtual_transfer_account',
      'message',
      'notes',
      'invoice_layout',
      'tax_entry_method',
      'invoice_contents'
    ];

    this.contentKeys = [
      // 'id', NOTE:PUTには必要かもしかし請求明細の更新はfreeeで直接やったほうが良い
      'order',
      'type',
      'qty',
      'unit',
      'unit_price',
      'vat',
      'description',
      'account_item_id',
      'tax_code',
      'item_id',
      'section_id',
      'tag_ids',
      'segment_1_tag_id',
      'segment_2_tag_id',
      'segment_3_tag_id'
    ];
  }

  /**
   * 指定したIDの請求書を取得するメソッド
   * @return  {object}  response
   */
  getInvoice() {
    Utilities.sleep(1000);
    const url = `${this.url}/${this.invoice_id}`
      + `?company_id=${this.company_id}`;
    const response = this.fetchResponse(url, this.paramsGet);
    return response.invoice;
  }

  /**
   * 請求書を更新するメソッド
   * @params  {object}  payload
   * @return  {object}  response
   */
  putInvoiceData(payload) {
    Utilities.sleep(1000);
    const url = `${this.url}/${this.invoice_id}`
    this.paramsPut.payload = JSON.stringify(payload);
    const response = this.fetchResponse(url, this.paramsPut);
    return response;
  }

}