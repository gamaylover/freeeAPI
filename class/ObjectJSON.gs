/**
 * class ObjectJSON
 * JSONオブジェクトに関するクラス
 * 
 * メソッド
 * flatObj(obj)  - 複数階層に存在するオブジェクトをフラット化して返すメソッド
 * obj2DataObjs(obj) - 子階層以下に配列に格納されたオブジェクトが存在する場合、データ行数のオブジェクトにフラット化して返すメソッド
 * overwriteValueLinkObj(objTemp, objData) - 雛形オブジェクトの値をプロパティ名としたデータオブジェクトから値を取得し、雛形オブジェクトの値に上書きしていくメソッド
 * deleteBlankProperties(obj) - オブジェクトから値がnullやundefined、空のプロパティを削除するメソッド
 * 
 */

/* = = = = = = = = = = = = = = = = = = = = = = = = = = = = */

class ObjectJSON {
  /**
   * JSONオブジェクト操作に関するコンストラクタ
   * @constructor
   */

  constructor() {
  }

  /**
   * 複数階層に存在するオブジェクトをフラット化して返すメソッド
   * @params  {Object}  obj - 元となるオブジェクト
   * @params  {number}  level - ネストの階層のインデックス（デフォルト：0）
   * @params  {string}  prefix - プロパティ名の接頭辞（デフォルト：''）
   * @return  {Object}  flattedObj - フラット化したオブジェクト（オブジェクトを格納するキーは削除）
   */

  static flatObj(obj, level = 0, prefix = '') {
    const flattedObj = new Object();
    Object.keys(obj).forEach(key => {
      const value = obj[key];

      // オブジェクトの値が配列を除くオブジェクト（＝階層化）の場合、フラット化メソッドをループ
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        const preKey = prefix + key + '__';
        Object.assign(flattedObj, this.flatObj(value, 0, preKey));
      }

      // オブジェクトの値が空の配列の場合はスキップ
      else if (Array.isArray(value) && value[level] === undefined) {
        return; // forEach処理の中でreturnしても、繰り返し処理は継続する
      }

      // オブジェクトの値がオブジェクトを格納した配列の場合、フラット化メソッドをループ
      else if (Array.isArray(value) && typeof value[level] === 'object') {
        const preKey = prefix + key + '__';
        Object.assign(flattedObj, this.flatObj(value[level], 0, preKey));
      }

      // オブジェクトの値が文字列を格納した配列の場合、配列の各要素を結合
      else if (Array.isArray(value) && typeof value[level] === 'string') {
        const newKey = prefix + key;
        flattedObj[newKey] = value.join();
      }

      // 上記条件以外の場合
      else {
        const newKey = prefix + key;
        flattedObj[newKey] = value;
      }
    });

    return flattedObj;
  };

  /**
   * 子階層以下に配列に格納されたオブジェクトが存在する場合、データ行数のオブジェクトにフラット化して返すメソッド
   * @params  {Object}  obj - 元となるオブジェクト
   * @return  {Array.<Object>}  arrayObjs - フラット化したオブジェクト（オブジェクトを格納するキーは削除）
   */

  static obj2DataObjs(obj) {
    const lengths = Object.keys(obj).map(key => {
      const value = obj[key];
      if (Array.isArray(value) && typeof value[0] === 'object') { return value.length };
      return 0;
    });

    // const maxDepth = Math.max(...lengths);
    const maxDepth = lengths.reduce((previous, current) => Math.max(previous, current));

    const arrayObjs = new Array();
    for (let i = 0; i < maxDepth; i++) {
      arrayObjs.push(this.flatObj(obj, i));
    }
    return arrayObjs;
  }

  /**
   * 雛形オブジェクトの値をプロパティ名としたデータオブジェクトから値を取得し、雛形オブジェクトの値に上書きしていくメソッド
   * @params  {Object}  objTemp - 雛形となるオブジェクト（値がデータオブジェクトのプロパティ名と一致）
   * @params  {Object}  objData - データオブジェクト（プロパティ名が雛形オブジェクトの値と一致）
   * @return  {Object}  雛形オブジェクトの値にデータが上書きされたオブジェクト
   */

  static overwriteValueLinkObj(objTemp, objData) {

    const newObj = Object.assign({}, objTemp);
    Object.keys(newObj).forEach(key => {
      const value = newObj[key];

      // オブジェクトの値が配列を除くオブジェクト（＝階層化）の場合、子オブジェクトの値を更新
      if (typeof value === 'object' && !Array.isArray(value)) {
        const subObj = Object.assign({}, value);
        Object.keys(subObj).forEach(subKey => {
          const subValue = subObj[subKey];
          subObj[subKey] = objData[subValue];
        });
        const postValue = subObj;
        newObj[key] = postValue;
      }
      // オブジェクトの値が配列の場合、インデックス0の子オブジェクトの値を更新
      else if (typeof value === 'object' && Array.isArray(value)) {
        const subObj = Object.assign({}, value[0]);
        Object.keys(subObj).forEach(subKey => {
          const subValue = subObj[subKey];
          subObj[subKey] = objData[subValue];
        });
        const postValue = subObj;
        newObj[key] = postValue;
      }

      else {
        const postValue = objData[value];
        newObj[key] = postValue;
      }
    });

    return newObj;
  }

  /**
   * 雛形オブジェクトの形式に複数のオブジェクトのデータを結合させるメソッド
   * @params  {Object}  objTemp - 雛形となるオブジェクト
   * @params  {Array.<Object>}  arrayObjs - データオブジェクトを複数格納した配列
   * @return  {Object}  convinedObj - 雛形オブジェクトの形式に複数のオブジェクトのデータが結合したオブジェクト
   */

  static convineObjs(objTemp, arrayObjs) {
    const length = arrayObjs.length;
    const convinedObj = Object.assign({}, objTemp);
    for (let i = 0; i < length; i++) {
      const obj = arrayObjs[i];
      const keys = Object.keys(obj);
      keys.forEach(key => {
        const value = convinedObj[key];
        if (Array.isArray(value)) { convinedObj[key][i] = obj[key] }
        else { convinedObj[key] = obj[key] };
      });
    };
    return convinedObj;
  }

  /**
   * オブジェクトから値がnullやundefined、空のプロパティを削除するメソッド
   * @params  {Object}  obj - 元となるオブジェクト
   * @return  {Object}  値がnullや空のプロパティを削除したオブジェクト
   */

  static deleteBlankProperties(obj) {
    Object.keys(obj).forEach(key => {
      const value = obj[key]
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) { this.deleteBlankProperties(value) };
      if (typeof value === 'object' && Array.isArray(value) && value.length > 0) { this.deleteBlankProperties(value) };
      if (typeof value === 'object' && value !== null && !Array.isArray(value) && Object.keys(value).length === 0) { delete obj[key] };
      if (typeof value === 'object' && Array.isArray(value) && value.length === 0) { delete obj[key] };
      if (value === null) { delete obj[key] };
      if (value === undefined) { delete obj[key] };
      if (value === '') { delete obj[key] };
    });
    return obj;
  }


  /**
   * オブジェクトからテンプレートのキー一覧との共通しないプロパティを削除するメソッド
   * @params  {Object}  obj - 元となるオブジェクト
   * @params  {Array}   keysKeep - 残したいプロパティの一覧
   * @return  {Object}  objNew - 共通しないキーのプロパティを削除したオブジェクト
   */

  static deleteDiffProperties(obj, keysKeep) {
    const keys = Object.keys(obj);
    // テンプレートのキー一覧との共通しないキーの一覧を配列で取得
    const diffKeys = keys.filter(key => !keysKeep.includes(key));
    // 共通しないキーのプロパティを削除
    diffKeys.forEach(difKey => delete obj[difKey]);
    return obj;

  }

}