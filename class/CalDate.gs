/**
 * class CalDate
 * カレンダーの色々な日付を生成するクラス
 * 
 * プロパティ
 * date - Dateオブジェクト
 * 
 * メソッド
 * endThisMonth() - 基準日月末日のDateオブジェクトを返すメソッド
 * endNextMonth() - 基準日翌月末日のDateオブジェクトを返すメソッド
 * endLastMonth() - 基準日前月末日のDateオブジェクトを返すメソッド
 * beginThisMonth() - 基準日当月初日のDateオブジェクトを返すメソッド
 * beginNextMonth() - 基準日翌月初日のDateオブジェクトを返すメソッド
 * beginLastMonth() - 基準日前月初日のDateオブジェクトを返すメソッド
 * aYearAgo() - 基準日と前年同日のDateオブジェクトを返すメソッド
 * 
 */

/* = = = = = = = = = = = = = = = = = = = = = = = = = = = = */

class CalDate {

  /**
   * 基準日のDateオブジェクトを生成するコンストラクタ
   * @constructor
   * @params  {Date}  date  デフォルトは実行日（今日）
   */
  constructor(date = new Date()) {
    this.date = new Date(date);
  }

  /**
   * 基準日月末日のDateオブジェクトを返すメソッド
   * @return  {Date}  endThisMonth
   */
  endThisMonth() {
    return new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0)
  };

  /**
   * 基準日翌月末日のDateオブジェクトを返すメソッド
   * @return  {Date}  endNextMonth
   */
  endNextMonth() {
    return new Date(this.date.getFullYear(), this.date.getMonth() + 2, 0)
  };

  /**
   * 基準日前月末日のDateオブジェクトを返すメソッド
   * @return  {Date}  endLastMonth
   */
  endLastMonth() {
    return new Date(this.date.getFullYear(), this.date.getMonth(), 0)
  };

  /**
   * 基準日当月初日のDateオブジェクトを返すメソッド
   * @return  {Date}  beginThisMonth
   */
  beginThisMonth() {
    return new Date(this.date.getFullYear(), this.date.getMonth(), 1)
  };

  /**
   * 基準日翌月初日のDateオブジェクトを返すメソッド
   * @return  {Date}  beginNextMonth
   */
  beginNextMonth() {
    return new Date(this.date.getFullYear(), this.date.getMonth() + 1, 1)
  };

  /**
   * 基準日前月初日のDateオブジェクトを返すメソッド
   * @return  {Date}  beginLastMonth
   */
  beginLastMonth() {
    return new Date(this.date.getFullYear(), this.date.getMonth() - 1, 1)
  };

  /**
   * 基準日と前年同日のDateオブジェクトを返すメソッド
   * @return  {Date}  aYearAgo
   */
  aYearAgo() {
    return new Date(this.date.getFullYear() - 1, this.date.getMonth(), this.date.getDate())
  };
}