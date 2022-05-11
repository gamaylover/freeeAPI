/**
 * class Enum
 * freee用仮想Enum（列挙型）Mapオブジェクトに関するクラス
 * 
 * プロパティ
 * DEAL_TYPE - 収支区分
 * PREFECTURE_CODES - 都道府県コード
 * SENDING_METHOD - 請求書送付方法
 * ACCOUNT_TYPE - 銀行口座種別
 * ORG_CODE - 事業所種別
 * COUNTRY_CODE - 地域種別
 * TRANSFER_FEE_HANDLING_SIDE - 振込手数料負担（一括振込ファイル用）種別
 * DISPLAY_CATEGORY - 税区分の表示カテゴリ
 * WALLET_TYPE - 口座区分
 * INVOICE_STATUS - 請求書ステータス
 * PAYMENT_STATUS - 入金ステータス
 * POSTING_STATUS - 郵送ステータス
 * PAYMENT_TYPE - 支払方法種別
 * INVOICE_LAYOUT - 請求書レイアウト
 * TAX_ENTRY_METHOD - 請求書の消費税計算方法
 * ENTRY_SIDE - 請求書の消費税計算方法
 * 
 * メソッド
 * convertValue2Key(enumType, trgValue) - 指定した列挙型Mapオブジェクトを参照して値からキーを返すメソッド
 * 
 */

/* = = = = = = = = = = = = = = = = = = = = = = = = = = = = */

class Enum {
  /**
   * J仮想Enum（列挙型）Mapオブジェクト操作に関するコンストラクタ
   * @constructor
   */

  constructor() {

    // 収支区分
    this.DEAL_TYPE = new Map([
      ['income', '収入'],
      ['expense', '支出']
    ]);

    // 都道府県コード
    this.PREFECTURE_CODES = new Map([
      [-1, '設定しない'],
      [0, '北海道'],
      [1, '青森県'],
      [2, '岩手県'],
      [3, '宮城県'],
      [4, '秋田県'],
      [5, '山形県'],
      [6, '福島県'],
      [7, '茨城県'],
      [8, '栃木県'],
      [9, '群馬県'],
      [10, '埼玉県'],
      [11, '千葉県'],
      [12, '東京都'],
      [13, '神奈川県'],
      [14, '新潟県'],
      [15, '富山県'],
      [16, '石川県'],
      [17, '福井県'],
      [18, '山梨県'],
      [19, '長野県'],
      [20, '岐阜県'],
      [21, '静岡県'],
      [22, '愛知県'],
      [23, '三重県'],
      [24, '滋賀県'],
      [25, '京都府'],
      [26, '大阪府'],
      [27, '兵庫県'],
      [28, '奈良県'],
      [29, '和歌山県'],
      [30, '鳥取県'],
      [31, '島根県'],
      [32, '岡山県'],
      [33, '広島県'],
      [34, '山口県'],
      [35, '徳島県'],
      [36, '香川県'],
      [37, '愛媛県'],
      [38, '高知県'],
      [39, '福岡県'],
      [40, '佐賀県'],
      [41, '長崎県'],
      [42, '熊本県'],
      [43, '大分県'],
      [44, '宮崎県'],
      [45, '鹿児島県'],
      [46, '沖縄県']
    ]);

    // 請求書送付方法
    this.SENDING_METHOD = new Map([
      ['email', 'メール'],
      ['posting', '郵送'],
      ['email_and_posting', 'メールと郵送']
    ]);

    // 銀行口座種別
    this.ACCOUNT_TYPE = new Map([
      ['ordinary', '普通'],
      ['checking', '当座'],
      ['earmarked', '納税準備預金'],
      ['savings', '貯蓄'],
      ['other', 'その他']
    ]);

    // 事業所種別
    this.ORG_CODE = new Map([
      [null, '未設定'],
      [1, '法人'],
      [2, '個人']
    ]);

    // 地域種別
    this.COUNTRY_CODE = new Map([
      ['JP', '国内'],
      ['ZZ', '国外']
    ]);

    // 振込手数料負担（一括振込ファイル用）種別
    this.TRANSFER_FEE_HANDLING_SIDE = new Map([
      ['payer', '振込元(当方)'],
      ['payee', '振込先(先方)']
    ]);

    // 税区分の表示カテゴリ
    this.DISPLAY_CATEGORY = new Map([
      ['tax_5', '5%表示の税区分'],
      ['tax_8', '8%表示の税区分'],
      ['tax_r8', '軽減税率8%表示の税区分'],
      ['tax_10', '10%表示の税区分'],
      [null, '税率未設定税区分']
    ]);

    // 口座区分
    this.WALLET_TYPE = new Map([
      ['bank_account', '銀行口座'],
      ['credit_card', 'クレジットカード'],
      ['wallet', '現金']
    ]);

    // 請求書ステータス
    this.INVOICE_STATUS = new Map([
      ['draft', '下書き'],
      ['applying', '申請中'],
      ['remanded', '差し戻し'],
      ['rejected', '却下'],
      ['approved', '承認済み'],
      ['unsubmitted', '送付待ち'],
      ['submitted', '送付済み']
    ]);

    // 請求明細行の種類ステータス
    this.INVOICE_CONTENTS_TYPE = new Map([
      ['normal', '通常'],
      ['discount', '割引'],
      ['text', 'テキスト']
    ]);

    // 入金ステータス
    this.PAYMENT_STATUS = new Map([
      ['unsettled', '入金待ち'],
      ['settled', '入金済み']
    ]);

    // 郵送ステータス
    this.POSTING_STATUS = new Map([
      ['unrequested', 'リクエスト前'],
      ['preview_registered', 'プレビュー登録'],
      ['preview_failed', 'プレビュー登録失敗'],
      ['ordered', '注文中'],
      ['order_failed', '注文失敗'],
      ['printing', '印刷中'],
      ['canceled', 'キャンセル'],
      ['posted', '投函済み']
    ]);

    // 支払方法種別
    this.PAYMENT_TYPE = new Map([
      ['transfer', '振込'],
      ['direct_debit', '引き落とし']
    ]);

    // 請求書レイアウト
    this.INVOICE_LAYOUT = new Map([
      ['default_classic', 'レイアウト１/クラシック (デフォルト)'],
      ['standard_classic', 'レイアウト２/クラシック'],
      ['envelope_classic', '封筒１/クラシック'],
      ['carried_forward_standard_classic', 'レイアウト３（繰越金額欄あり）/クラシック'],
      ['carried_forward_envelope_classic', '封筒２（繰越金額欄あり）/クラシック'],
      ['default_modern', 'レイアウト１/モダン'],
      ['standard_modern', 'レイアウト２/モダン'],
      ['envelope_modern', '封筒/モダン']
    ]);

    // 請求書の消費税計算方法
    this.TAX_ENTRY_METHOD = new Map([
      ['inclusive', '内税'],
      ['exclusive', '外税']
    ]);

    // 貸借
    this.ENTRY_SIDE = new Map([
      ['credit', '貸方'],
      ['debit', '借方']
    ]);

  }

  /**
   * 指定した列挙型Mapオブジェクトを参照して値からキーを返すメソッド
   * @params  {string}  enumType - Enumの種別
   * @params  {string}  trgValue - キーを探索する照合元の値
   * @return  {string || number}  key - 探索されたキー
   */


  convertValue2Key(enumType, trgValue) {
    const mapEnum = this[enumType];
    for (const [key, value] of mapEnum) {
      if (value === trgValue) { return key }
    }
    return null;
  }

}