/**
 * class MapObject
 * Mapオブジェクトに関するクラス
 * 
 * メソッド
 * convertValue2Key(mapEnum, trgValue) - 指定した列挙型Mapオブジェクトを参照して値からキーを返すメソッド
 * 
 */

/* = = = = = = = = = = = = = = = = = = = = = = = = = = = = */

class MapObject {
  /**
   * Mapオブジェクト操作に関するコンストラクタ
   * @constructor
   */

  constructor() {
  }
  
  /**
   * 指定した列挙型Mapオブジェクトを参照して値からキーを返すメソッド
   * @params  {Object}  mapEnum - 列挙型Mapオブジェクト
   * @params  {string}  trgValue - キーを探索する照合元の値
   * @return  {string || number}  key - 探索されたキー
   */

  static convertValue2Key(mapEnum, trgValue) {
    for (const [key, value] of mapEnum) {
      if (value === trgValue) { return key }
    }
    return null;
  }

}
