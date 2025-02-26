import { BasicColumn, FormSchema } from '@/components/Table';
import { h } from 'vue';
import { Tag, Avatar, Switch, message } from 'ant-design-vue';
import { DescItem } from '@/components/Description';
import { createImgPreview } from '@/components/Preview/index';
import axios from 'axios';
import { useUserStore } from '@/store/modules/user';

// 定义一个函数来获取授课类目选项
async function getTeachingSubjectOptions() {
  const response = await axios.get(
    import.meta.env.VITE_GLOB_API_URL +
      import.meta.env.VITE_GLOB_API_MY_URL_PREFIX +
      '/select-options/subjectParent',
    {
      headers: {
        Authorization: useUserStore().getToken,
      },
    },
  );
  return response.data.data.map((item: any) => ({
    label: item.label,
    value: parseInt(item.value),
  }));
}

// 定义一个函数来获取身份类型
async function getIdtOptions() {
  const response = await axios.get(
    import.meta.env.VITE_GLOB_API_URL + import.meta.env.VITE_GLOB_API_MY_URL_PREFIX + '/admin/idt',
    {
      headers: {
        Authorization: useUserStore().getToken,
      },
    },
  );
  return response.data.data.map((item: any) => ({
    label: item.label,
    value: parseInt(item.value),
  }));
}

// 定义一个函数来获取城市列表
// async function getCityOptions() {
//   const response = await axios.get(
//     import.meta.env.VITE_GLOB_API_URL +
//       import.meta.env.VITE_GLOB_API_MY_URL_PREFIX +
//       '/select-options/city',
//     {
//       headers: {
//         Authorization: useUserStore().getToken,
//       },
//     },
//   );

//   return response.data.data.map((item: any) => ({
//     label: item.label,
//     value: item.value,
//     children: item.children,
//   }));
// }

// 定义一个函数来获取年级列表
async function getGradeOptions() {
  const response = await axios.get(
    import.meta.env.VITE_GLOB_API_URL +
      import.meta.env.VITE_GLOB_API_MY_URL_PREFIX +
      '/select-options/subjectParent',
    {
      headers: {
        Authorization: useUserStore().getToken,
      },
    },
  );
  return response.data.data.map((item: any) => ({
    label: item.label,
    value: parseInt(item.value),
  }));
}

// 在获取数据后定义表单配置
export const gradeoptions = await getGradeOptions();
/**
 *
 *
 * 表格列
 */

export const columns: BasicColumn[] = [
  {
    title: '序号',
    dataIndex: 'num',
  },
  {
    title: '名称',
    dataIndex: 'name',
  },
  {
    title: '父级栏目',
    dataIndex: 'parent',
    resizable: true,
  },
  {
    title: '排序',
    dataIndex: 'sort',
    resizable: true,
  },
];

/**
 * 查询条件
 */
export const queryFormSchema: FormSchema[] = [
  // {
  //   field: 'id',
  //   label: 'ID',
  //   component: 'Input',
  //   componentProps: {},
  //   colProps: { span: 8 },
  // },
  // {
  //   field: 'key',
  //   label: '关键字',
  //   component: 'Input',
  //   componentProps: {},
  //   colProps: { span: 8 },
  // },
  // {
  //   field: 'payTimeRange',
  //   label: '支付时间范围',
  //   component: 'RangePicker',
  //   componentProps: {},
  //   colProps: { span: 8 },
  // },
  // {
  //   field: 'teacherName',
  //   label: '教师信息',
  //   component: 'Input',
  //   colProps: { span: 8 },
  // },
  {
    field: 'parentId',
    label: '父级分类',
    component: 'Select',
    componentProps: {
      options: gradeoptions,
    },
    colProps: { span: 8 },
  },
  // {
  //   field: 'status',
  //   label: '报名状态',
  //   component: 'Select',
  //   componentProps: {
  //     options: [
  //       { label: '报名中', value: 0 },
  //       { label: '试课待确认', value: 1 },
  //       { label: '确认试课(已完成)', value: 2 },
  //       { label: '放弃试课', value: 3 },
  //       { label: '报名失败', value: 4 },
  //     ],
  //   },
  //   colProps: { span: 8 },
  // },
];
/**
 * 查看详情表单
 */
export const retrieveDetailFormSchema: DescItem[] = [
  {
    field: 'tenantName',
    label: '租户名',
  },
  {
    field: 'tenantId',
    label: '租户ID',
  },
  {
    field: 'statusLabel',
    label: '状态',
  },
  {
    field: 'tenantAdminUser.username',
    label: '管理员账号',
    render: (_, record) => {
      // 因为查看详情有调用接口，存在网络延时，使用可选链避免报错
      return record?.tenantAdminUser?.username;
    },
  },
  {
    field: 'tenantAdminUser.phoneNo',
    label: '管理员手机号',
    render: (_, record) => {
      return record?.tenantAdminUser?.phoneNo;
    },
  },
  {
    field: 'tenantAdminUser.email',
    label: '管理员邮箱',
    render: (_, record) => {
      return record?.tenantAdminUser?.email;
    },
  },
  {
    field: 'createdAt',
    label: '创建时间',
  },
  {
    field: 'updatedAt',
    label: '更新时间',
  },
  {
    field: 'remark',
    label: '备注',
  },
];

/**
 * 新增/编辑表单
 */

const isUpdateView = (values: Recordable) => {
  return !!values.id;
};
export const insertOrUpdateFormSchema: FormSchema[] = [
  {
    field: 'id',
    // 只是为了带过来
    label: '主键ID',
    component: 'Render',
    ifShow: false,
  },
  {
    field: 'tenantName',
    label: '租户名',
    required: true,
    component: 'Input',
    componentProps: {
      maxlength: 50,
    },
  },
  {
    field: 'tenantId',
    label: '租户ID',
    required: true,
    component: 'InputNumber',
    componentProps: {
      placeholder: '须为正整数',
      min: 1,
    },
    // Helio: 只在新增时显示
    ifShow: ({ values }) => !isUpdateView(values),
  },
  {
    field: 'status',
    label: '状态',
    component: 'RadioButtonGroup',
    defaultValue: 0,
    componentProps: {
      options: [
        { label: '禁用', value: 0 },
        { label: '启用', value: 1 },
      ],
    },
  },
  {
    field: 'remark',
    label: '备注',
    component: 'InputTextArea',
    componentProps: {
      maxlength: 255,
    },
  },
  {
    field: 'tenantAdminUsername',
    label: '管理员账号',
    required: true,
    component: 'Input',
    componentProps: {
      placeholder: '最短6位，最长16位',
      maxlength: 16,
    },
    rules: [
      // 最短6位
      {
        trigger: 'blur',
        min: 6,
      },
    ],
    // Helio: 只在新增时显示
    ifShow: ({ values }) => !isUpdateView(values),
  },
  {
    field: 'tenantAdminPassword',
    label: '管理员密码',
    required: true,
    component: 'InputPassword',
    componentProps: {
      placeholder: '最短8位，最长20位；建议使用复杂密码',
      maxlength: 20,
    },
    rules: [
      // 最短8位
      {
        trigger: 'blur',
        min: 8,
      },
    ],
    // Helio: 只在新增时显示
    ifShow: ({ values }) => !isUpdateView(values),
  },
  {
    field: 'tenantAdminEmail',
    label: '管理员邮箱',
    required: true,
    component: 'Input',
    componentProps: {
      maxlength: 255,
    },
    // Helio: 只在新增时显示
    ifShow: ({ values }) => !isUpdateView(values),
  },
  {
    field: 'tenantAdminPhoneNo',
    label: '管理员手机号',
    required: true,
    component: 'Input',
    componentProps: {
      maxlength: 20,
    },
    // Helio: 只在新增时显示
    ifShow: ({ values }) => !isUpdateView(values),
  },
];
