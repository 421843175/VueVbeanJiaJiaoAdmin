import { defHttp } from '@/utils/http/axios';
import { ApiResult, SelectUpdateForm } from './module/Module';

enum Api {
  REST = '/api/v1/admin/getide',
}

/**
 * 系统租户-分页列表
 */
export const listApi = (queryForm: any) => {
  return defHttp.get<ApiResult[]>({
    url: Api.REST,
    params: queryForm,
  });
};

export const listApplicationApi = (queryForm: any) => {
  return defHttp.get<ApiResult[]>({
    url: Api.REST + '/application',
    params: queryForm,
  });
};

/**
 * 系统租户-详情
 */
export const retrieveApi = (id: string) => {
  return defHttp.get<ApiResult>({
    url: `${Api.REST}/${id}`,
  });
};

/**
 * 系统租户-新增
 */
export const createApi = (insertForm: SelectUpdateForm) => {
  return defHttp.post<void>({
    url: Api.REST,
    params: insertForm,
  });
};

/**
 * 系统租户-编辑
 */

//TODO:NOTICE 自定义的接口(2)
export const updateApi = (id: string, updateForm: SelectUpdateForm) => {
  return defHttp.put<ApiResult>({
    url: `${Api.REST}/${id}`,
    params: updateForm,
  });
};

/**
 * 系统租户-删除
 */
export const deleteApi = (ids: string[]) => {
  return defHttp.delete<void>({
    url: Api.REST,
    params: {
      ids: ids,
    },
  });
};
