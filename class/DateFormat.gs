/**
 * class DateFormat
 * 様々なデータ型の日付を文字列型やDateオブジェクトに変換するクラス
 * 
 * プロパティ
 * date - Dateオブジェクト
 * string - 指定フォーマットに変更した日付文字列
 * 
 */

/* = = = = = = = = = = = = = = = = = = = = = = = = = = = = */

class DateFormat {

  /**
  * 日付を指定フォーマットの文字列型に変換したオブジェクトを生成するコンストラクタ
  * @constructor
  * @param {Date}    date - Date オブジェクト 文字列型も可
  * @param {string}  format - 文字列に変換するフォーマット  
  */
  constructor(date = new Date(), format = 'yyyy-MM-dd') {
    this.date = new Date(date);
    this.string = Utilities.formatDate(this.date, 'JST', format);
  }
}