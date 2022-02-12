/**
 * class OurCompanies
 * 事業所に関するクラス
 * @extends {ApiRequest} 
 * 
 * getOurCompanies
 * getId(company_name)
 * 
 */

/* = = = = = = = = = = = = = = = = = = = = = = = = = = = = */

class OurCompanies extends ApiRequest {

  /**
   * 事業所取得のためのURLを定義するコンストラクタ
   * @constructor
   */

  constructor() {
    super();
    this.url = this.urlAccount + 'companies';
  }

  /**
   * 全ての事業所を配列で返すメソッド
   * @return  {array}  aryCompanies  全ての事業所オブジェクトを格納した配列
   */
  getOurCompanies() {
    const objCompanies = this.fetchResponse(this.url, this.paramsGet);
    const aryCompanies = objCompanies.companies;
    return aryCompanies;
  }
  /**
   * 指定した名称の事業所IDを返すメソッド
   * @param   {string}   company_name 事業所
   * @return  {integer}  company_id
   */
  getId(company_name) {
    const aryCompanies = this.getOurCompanies();
    const company = aryCompanies.filter(company => company.display_name.includes(company_name));
    if (company.length === 0) { console.log('該当する事業所がありません') };
    if (company.length === 1) { return company[0].id };
    if (company.length > 1) { console.log('複数の事業所が該当します') };
  }
}