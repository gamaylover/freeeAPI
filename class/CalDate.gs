/**
 * class CalDate
 * カレンダーの色々な日付を生成するクラス
 * 
 * プロパティ
 * date - Dateオブジェクト
 * 
 * メソッド
 * lastSaturday() - 基準日の前回の土曜日のDateオブジェクトを返すメソッド
 * endThisMonth() - 基準日月末日のDateオブジェクトを返すメソッド
 * endNextMonth() - 基準日翌月末日のDateオブジェクトを返すメソッド
 * endLastMonth() - 基準日前月末日のDateオブジェクトを返すメソッド
 * beginThisMonth() - 基準日当月初日のDateオブジェクトを返すメソッド
 * beginNextMonth() - 基準日翌月初日のDateオブジェクトを返すメソッド
 * beginLastMonth() - 基準日前月初日のDateオブジェクトを返すメソッド
 * aYearAgo() - 基準日と前年同日のDateオブジェクトを返すメソッド
 * aWeekAgo() - 基準日の7日前のDateオブジェクトを返すメソッド
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

  lastSaturday() {
    const indexSat = 6
    const indexToday = this.date.getDay();
    if (indexToday === indexSat) { return new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate() - 7) };
    if (indexToday < indexSat) {
      const difference = indexSat - indexToday - 7;
      return new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate() + difference);
    };
  }

  /**
   * 基準日月末日のDateオブジェクトを返すメソッド
   * @return  {Date}  endThisMonth
   */
  endThisMonth() {
    return new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0);
  }

  /**
   * 基準日翌月末日のDateオブジェクトを返すメソッド
   * @return  {Date}  endNextMonth
   */
  endNextMonth() {
    return new Date(this.date.getFullYear(), this.date.getMonth() + 2, 0);
  }

  /**
   * 基準日前月末日のDateオブジェクトを返すメソッド
   * @return  {Date}  endLastMonth
   */
  endLastMonth() {
    return new Date(this.date.getFullYear(), this.date.getMonth(), 0);
  }

  /**
   * 基準日当月初日のDateオブジェクトを返すメソッド
   * @return  {Date}  beginThisMonth
   */
  beginThisMonth() {
    return new Date(this.date.getFullYear(), this.date.getMonth(), 1);
  }

  /**
   * 基準日翌月初日のDateオブジェクトを返すメソッド
   * @return  {Date}  beginNextMonth
   */
  beginNextMonth() {
    return new Date(this.date.getFullYear(), this.date.getMonth() + 1, 1);
  }

  /**
   * 基準日前月初日のDateオブジェクトを返すメソッド
   * @return  {Date}  beginLastMonth
   */
  beginLastMonth() {
    return new Date(this.date.getFullYear(), this.date.getMonth() - 1, 1);
  }

  /**
   * 基準日と前年同日のDateオブジェクトを返すメソッド
   * @return  {Date}  aYearAgo
   */
  aYearAgo() {
    return new Date(this.date.getFullYear() - 1, this.date.getMonth(), this.date.getDate());
  }

  /**
   * 基準日の7日前のDateオブジェクトを返すメソッド
   * @return  {Date}  aWeekAgo
   */
  aWeekAgo() {
    return new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate() - 7);
  }
}