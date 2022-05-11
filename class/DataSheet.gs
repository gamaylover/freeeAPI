/**
 * class DataSheet
 * スプレッドシートのデータ操作に関するクラス
 * 
 * rangeToMapObjs(range) - データ範囲から、ヘッダー項目をキーにした各データ行のMapオブジェクトを格納した配列を戻り値として返すメソッド
 * rangeToDataObjs(range) - データ範囲から、ヘッダー項目をプロパティにオブジェクト化した各行を格納した配列を戻り値として返すメソッド
 * getUniqueKeys(sheetName, filterKey)  - シート名とヘッダー項目で指定した列内のデータの重複を削除した配列を返すメソッド
 * addDataSheet(ary2D) - スプレッドシートの指定のシートの最終行に2次元配列のデータを追加するメソッド
 * clearDataSheet() - スプレッドシートの指定のシートのヘッダー行以外を削除するメソッド
 * clearSetData(ary2D, row, column) - スプレッドシートの指定のシートに2次元配列のデータを追加する関数
 * getNamedRange(name) -指定した名前に一致するrangeオブジェクトを取得するメソッド
 * getNamedRangeAry2D(name, index) - 指定した名前に一致するrangeオブジェクトの値を二次元配列で取得するメソッド
 * clearSpecNamedRanges(keyword) - 特定の文字列を含む名前付き範囲の値を削除する関数
 */

/* = = = = = = = = = = = = = = = = = = = = = = = = = = = = */

/**
 * スプレッドシートのデータ操作に関するクラス
 */

class DataSheet {

  /**
   * コンテナバインドのスプレッドシートからSheetオブジェクトをシート名で取得するコンストラクタ
   * @constructor
   * @param {string}  sheetName    操作したいシート名
   */

  constructor(sheetName) {
    this.sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
    this.rangeData = this.sheet.getDataRange();
    this.values2D = this.rangeData.getValues();
    this.headers = this.rangeData.getValues()[0];

  }

  /* = = = = = = = = = = = = = = = = = = = = = = = = = = = = */

  /** 範囲からデータを取得するメソッド */

  /**
   * データ範囲から、ヘッダー項目をキーにした各データ行のMapオブジェクトを格納した配列を戻り値として返すメソッド
   *
   * @param    {Range}  range - ヘッダー行とデータ行で構成されるrangeオブジェクト
   * @return   {Array.<Map>}  mapObjs - 全データ行をヘッダー項目をキーにしたMapオブジェクトを格納した配列
   */

  rangeToMapObjs(range = this.rangeData) {
    const data = range.getValues();
    const [keys, ...values] = data;
    const mapObjs = values.map(row => {
      const objMap = new Map();
      keys.map((key, index) => objMap.set(key, row[index]));
      return objMap;
    });
    return mapObjs;
  }

  /**
   * データ範囲から、ヘッダー項目をプロパティにオブジェクト化した各行を格納した配列を戻り値として返すメソッド
   *
   * @param    {Range}  range - ヘッダー行とデータ行で構成されるrangeオブジェクト
   * @return   {Array.<Object>}  dataObjs - 全データ行をヘッダー項目をプロパティにオブジェクト化したものを格納した配列
   */

  rangeToDataObjs(range = this.rangeData) {
    const data = range.getValues();
    const [keys, ...values] = data;
    const dataObjs = values.map(row => {
      const obj = new Object();
      keys.map((key, index) => obj[key] = row[index]);
      return obj;
    })
    return dataObjs;
  }

  /**
   * ヘッダー項目で指定した列内のデータの重複を削除した配列を返すメソッド
   *
   * @param    {string}  filterKey - 操作したい列のヘッダー項目
   * @param    {Range}   range - ヘッダー行とデータ行で構成されるrangeオブジェクト
   * @return   {Array}   uniqueKeys - 指定シート・列の重複を削除した値の配列
   */

  getUniqueKeys(filterKey, range = this.rangeData) {
    const mapObjs = this.rangeToMapObjs(range);
    const keys = mapObjs.map(objMap => objMap.get(filterKey));
    const uniqueKeys = Array.from(new Set(keys)).filter(key => key !== ''); // https://qiita.com/netebakari/items/7c1db0b0cea14a3d4419
    return uniqueKeys;
  }
  
  /* = = = = = = = = = = = = = = = = = = = = = = = = = = = = */

  /** シートにデータを追加するメソッド一覧 */

  /**
   * スプレッドシートの指定のシートの最終行に2次元配列のデータを追加するメソッド
   * @param    {Array}  ary2D - 追加するデータの2次元配列
   */

  addDataSheet(ary2D) {
    const sheet = this.sheet;
    const lastRow = sheet.getLastRow();
    const range = sheet.getRange(lastRow + 1, 1, ary2D.length, ary2D[0].length);
    range.setValues(ary2D);
  }

  /**
   * スプレッドシートの指定のシートのヘッダー行以外を削除するメソッド
   */

  clearDataSheet() {
    const sheet = this.sheet;
    const lastRow = sheet.getLastRow();
    const lastColumn = sheet.getLastColumn();
    if (lastRow <= 1) { return }
    sheet.getRange(2, 1, lastRow - 1, lastColumn).clearContent();
  }

  /**
   * スプレッドシートの指定のシートに2次元配列のデータを追加する関数
   * @param   {Array}   ary2D - 追加するデータの2次元配列
   * @param   {number}  row - 追加するデータの起点行
   * @param   {number}  column - 追加するデータの起点列
   * @return  {Range}   range - データ追加した範囲
   */

  clearSetData(ary2D, row = 2, column = 1) {
    const rangeClear = ary2D => sheet.getRange(row, column, lastRow - 1, ary2D[0].length).clearContent();
    const rangeSet = ary2D => sheet.getRange(row, column, ary2D.length, ary2D[0].length).setValues(ary2D);
    const sheet = this.sheet;
    const lastRow = sheet.getLastRow();
    if (lastRow <= 1) { return rangeSet(ary2D) }
    rangeClear(ary2D);
    return rangeSet(ary2D);
  }

  /* = = = = = = = = = = = = = = = = = = = = = = = = = = = = */

  /** 名前付き範囲を処理するメソッド一覧 */

  /**
   * 指定した名前に一致するrangeオブジェクトを取得するメソッド
   * @param   {string}  name - 名前付き範囲の名前
   * @return  {Range}   range - 指定した名前に一致するrangeオブジェクト
   */

  getNamedRange(name) {
    const sheet = this.sheet;
    const ranges = sheet.getNamedRanges();
    if (ranges.length > 0) { return ranges.filter(range => range.getName() === name)[0].getRange(); }
  }

  /**
   * 指定した名前に一致するrangeオブジェクトの値を二次元配列で取得するメソッド
   * @param   {string}   name - 名前付き範囲の名前
   * @param   {number}   index - 空欄行を削除する列のインデックス（0始まり・デフォルト0）
   * @return  {Array}    ary2D - 指定した名前に一致するrangeオブジェクトの値一覧
   */

  getNamedRangeAry2D(name, index = 0) {
    const sheet = this.sheet;
    const ranges = sheet.getNamedRanges();
    if (ranges.length > 0) {
      const range = ranges.filter(range => range.getName() === name)[0].getRange();
      const values = range.getValues();
      const ary2D = values.filter(row => row[index] !== '');
      return ary2D;
    }
  }

  /**
   * 特定の文字列を含む名前付き範囲の値を削除する関数   
   * @param   {string}  keyword - 削除したい名前付き範囲の判定キーワード
   */

  clearSpecNamedRanges(keyword) {
    const namedRanges = this.sheet.getNamedRanges();
    namedRanges.forEach(namedRange => {
      if (namedRange.getName().includes(keyword)) { namedRange.getRange().clearContent(); }
    });
  }

  /* = = = = = = = = = = = = = = = = = = = = = = = = = = = = */


}