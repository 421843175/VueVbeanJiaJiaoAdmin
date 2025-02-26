/**
 * @model 系统租户
 */

/*
 ---- REQUEST ----
 */

/**
 * 系统租户-新增/编辑请求体
 */

  //TODO:NOTICE 自定义的接口(1)
export interface SelectUpdateForm {

  id:number,
  /**
   * Key
   */
  shimingStatus: number;

  /**
   * Date Random
   */
  xueliStatus: number;

  jiaoshiStatus: number;

  /**
   * Teaching Cities
   */
  status: number;

  refusalRemark:string,

  isIndex:number;
}

/*
 ---- RESPONSE ----
 */

/**
 * 系统租户-通用响应体
 */
export type ApiResult = SelectUpdateForm & {

  code: string;

  data: Object;

  msg: string;
};
