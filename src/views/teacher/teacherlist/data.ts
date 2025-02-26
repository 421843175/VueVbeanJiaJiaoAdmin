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
      '/admin/subject',
    {
      headers: {
        Authorization: useUserStore().getToken,
      },
    },
  );
  return response.data.data.map((item: any) => ({
    label: item.label,
    value: item.value,
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
    value: item.value,
  }));
}

// 定义一个函数来获取城市列表
async function getCityOptions() {
  const response = await axios.get(
    import.meta.env.VITE_GLOB_API_URL +
      import.meta.env.VITE_GLOB_API_MY_URL_PREFIX +
      '/select-options/city',
    {
      headers: {
        Authorization: useUserStore().getToken,
      },
    },
  );

  return response.data.data.map((item: any) => ({
    label: item.label,
    value: item.value,
    children: item.children,
  }));
}

// 在获取数据后定义表单配置
const teachingSubjectOptions = await getTeachingSubjectOptions();
const teachingIdtOptions = await getIdtOptions();
const citytOptions = await getCityOptions();
/**
 *
 *
 * 表格列
 */

export const columns: BasicColumn[] = [
  {
    title: 'ID',
    dataIndex: 'tsn',
    helpMessage: h('div', '列表ID'),
  },
  {
    title: '头像',
    dataIndex: 'realAvatar',
    width: 100,
    customRender: ({ text }: { text: string }) => {
      //  TODO:NOTICE 家教端 (2 使用)
      console.log('Online_URL:', import.meta.env.VITE_GLOB_Online_URL);

      // 可以这样获得数据库这个字段的record.realAvatar 的值
      // if(record.realAvatar!='')
      // return h("img", { src: import.meta.env.VITE_GLOB_Online_URL+record.realAvatar ,width:"20%",height:"50%" });

      //TODO:TIP test可以拿到这一个字段 就不用那么麻烦了
      //官方解释： text 是一个对象解构的结果
      //通常用于在 Vue 组件的渲染函数或者 customRender 函数中，获取某个数据对象中的特定属性的值。
      if (text != '') {
        const imgsrc = import.meta.env.VITE_GLOB_Online_URL + text;
        // return h("img", { src: imgsrc ,width:"20%",height:"50%"  ,onClick: () => { alert(1); }} );
        return h('img', {
          src: imgsrc,
          width: '20%',
          height: '50%',
          onClick: () => {
            createImgPreview({ imageList: [imgsrc] });
          },
        });
      }
    },
  },
  {
    title: '分类',
    dataIndex: 'category',
    align: 'center',
    defaultHidden: true,
    resizable: true,
  },
  {
    title: '姓名',
    dataIndex: 'realName',
    resizable: true,
    fixed: 'left',
  },
  {
    title: '性别',
    dataIndex: 'gender',
    customRender: ({ text }: { text: number }) => {
      return text === 1 ? '男' : text === 2 ? '女' : '';
    },
    resizable: true,
  },
  {
    title: '手机号',
    dataIndex: 'mobilePhone',
    resizable: true,
  },
  // {
  //   title: '图片列表1',
  //   dataIndex: 'imgArr',
  //   helpMessage: ['这是简单模式的图片列表', '只会显示一张在表格中', '但点击可预览多张图片'],
  //   width: 140,
  // },
  {
    title: '学校',
    dataIndex: 'uniName',
    resizable: true,
  },
  {
    title: '所学专业',
    dataIndex: 'major',
    resizable: true,
  },
  {
    title: '身份类型',
    dataIndex: 'idtstr',
    // TODO:NOTICE 调整列宽(2)逐个列设置
    resizable: true,
  },
  {
    title: '授课区域',
    dataIndex: 'teachingCitys',
    resizable: true,
  },
  {
    title: '成功率',
    dataIndex: 'successSum',
    customRender: ({ record }) => {
      if (record.applySum != '' && record.successSum != '')
        return (parseInt(record.successSum) / parseInt(record.applySum)).toFixed(2);
    },
  },
  {
    title: '是否精选',
    dataIndex: 'isIndex',
    resizable: true,
    customRender: ({ text, record }) => {
      const that = this;
      const onChange = (checked) => {
        axios
          .post(
            import.meta.env.VITE_GLOB_API_URL +
              import.meta.env.VITE_GLOB_API_MY_URL_PREFIX +
              '/admin/teacher/updateStatus',
            {
              row: record,
            },
            {
              headers: {
                Authorization: useUserStore().getToken,
              },
            },
          )
          .then((res) => {
            if (res.data.code == 200) {
              message.success('操作成功');
            } else {
              message.error('操作失败');
            }
            console.log(res);
          });

        if (checked) {
          console.log(1);
        } else {
          console.log(0);
        }
        // Update the record's value if needed, typically this would involve an API call
        record.isIndex = checked ? 0 : 1;
      };
      //  TODO:NITICE  使用别的组件 首先引入组件 然后使用h函数
      return h(Switch, {
        checked: text === 0,
        onChange,
      });
    },
  },

  {
    title: '审核状态',
    dataIndex: 'status',
    customRender: ({ text }) => {
      // if(text!="")
      switch (text) {
        case 0:
        case '0':
          return h(Tag, { color: 'red' }, () => '待审核');
        case 1:
        case '1':
          return h(Tag, { color: 'green' }, () => '已通过');
        case 2:
        case '2':
          return h(Tag, { color: 'gray' }, () => '已拒绝');
        default:
          return '';
      }
    },
    resizable: true,
    fixed: 'right',
  },
  {
    title: '二维码海报',
    dataIndex: 'haibaoErweima',
    width: 100,
    customRender: ({ text }: { text: string }) => {
      if (text != '') {
        const imgsrc = import.meta.env.VITE_GLOB_Online_URL + text;
        return h('img', {
          src: imgsrc,
          width: '80%',
          height: '80%',
          onClick: () => {
            createImgPreview({ imageList: [imgsrc] });
          },
        });
      }
    },
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    customRender: ({ text }) => {
      const date = new Date(parseInt(text) * 1000);

      return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
    },
    resizable: true,
    sorter: (a, b) =>
      new Date(a.updateTime * 1000).getTime() - new Date(b.updateTime * 1000).getTime(), // 时间排序
  },
];

/**
 * 查询条件
 */
export const queryFormSchema: FormSchema[] = [
  {
    field: 'realName',
    label: '关键字',
    component: 'Input',
    componentProps: {},
    colProps: { span: 8 },
  },
  {
    field: 'gender',
    label: '性别',
    component: 'Select',
    componentProps: {
      options: [
        { label: '男', value: 1 },
        { label: '女', value: 2 },
      ],
    },
    colProps: { span: 8 },
  },
  {
    field: 'createTimeRange',
    label: '创建时间范围',
    component: 'RangePicker',
    componentProps: {},
    colProps: { span: 8 },
  },
  {
    field: 'idtId',
    label: '身份类型',
    component: 'Select',
    componentProps: {
      options: teachingIdtOptions,
    },
    colProps: { span: 8 },
  },
  {
    field: 'teachingSubject',
    label: '授课类目',
    component: 'Select',
    componentProps: {
      options: teachingSubjectOptions,
    },
    colProps: { span: 8 },
  },
  {
    field: 'teachingCitys',
    label: '授课城市',
    component: 'Cascader',
    componentProps: {
      options: citytOptions,
    },
    colProps: { span: 8 },
  },
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
