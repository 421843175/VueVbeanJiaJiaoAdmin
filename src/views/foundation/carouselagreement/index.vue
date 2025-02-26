<template>
  <div>
    <!-- TODO:NOTICE 调整列宽(1)声明 -->
    <!-- <Tabs
      v-model:activeKey="activeKey"
      type="card"
      @change="selectTab()"
      style="margin-top: 20px; margin-left: 10px"
    >
      <TabPane :key="100" tab="全部" />
      <TabPane :key="0" tab="未处理" />
      <TabPane :key="1" tab="已处理" />
    </Tabs> -->
    <BasicTable @register="registerTable" :column-config="{ resizable: true }">
      <template #toolbar>
        <!--    新增按钮    -->
        <a-button v-if="hasPermission('SysDept:create')" type="primary" @click="openInsert()">
          新增
        </a-button>
      </template>
      <template #action="{ record }">
        <!--   每行最右侧一列的工具栏   -->
        <TableAction
          :actions="[
            {
              tooltip: '删除',
              ifShow: hasPermission('SysTenant:delete'),
              icon: 'ant-design:delete-outlined',
              color: 'error',
              popConfirm: {
                title: '是否确认删除？ 将同步删除关联的租户管理员角色',
                confirm: handleDelete.bind(null, record),
              },
            },
            {
              tooltip: '编辑',
              // ifShow: hasPermission('SysTenant:delete'),
              icon: 'ant-design:form-outlined',
              onClick: () => openEdit(record),
            },
            // {
            //   tooltip: '删除',
            //   ifShow: hasPermission('SysTenant:delete'),
            //   icon: 'ant-design:delete-outlined',
            //   color: 'error',
            //   popConfirm: {
            //     title: '是否确认删除？ 将同步删除关联的租户管理员角色',
            //     confirm: handleDelete.bind(null, record),
            //   },
            // },
          ]"
        />
      </template>
    </BasicTable>

    <Edit @register="registerdemand" @confirm="handleModalConfirm" />
  </div>
</template>
<script lang="ts" setup>
  import { BasicTable, TableAction, useTable } from '@/components/Table';
  // import { BasicTableProps, VxeBasicTable, VxeGridInstance } from '@/components/VxeTable';
  // import { useDrawer } from '@/components/Drawer';
  import { hasPermission } from '@/utils/auth';
  import { columns, queryFormSchema, nestedColumns } from './data';
  //TODO:NOTICE apis的配置
  import { listApi } from '@/api/carousel/CarouselApis';
  import { ref, createVNode, onMounted } from 'vue';
  // import SysTenantUpdateDrawer from './update-drawer.vue';
  import { message, Modal, Tag, Input, Textarea, Tabs, TabPane, Row, Col } from 'ant-design-vue';
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
  import axios from 'axios';
  import { useUserStore } from '@/store/modules/user';
  import { useModal } from '@/components/Modal';
  import Edit from './Edit.vue';

  const [registerdemand, { openModal: openModalDemand, closeModal: closeDetailModal }] = useModal();

  const [registerTable, { reload, setProps }] = useTable({
    title: '列表',
    api: listApi,
    columns,
    // formConfig: {
    //   /*
    //   列表查询条件
    //    */
    //   // 输入框左侧标题的宽度
    //   labelWidth: 120,
    //   // 查询条件配置
    //   schemas: queryFormSchema,
    // },
    // useSearchForm: true,
    showTableSetting: true,
    bordered: true,
    showIndexColumn: false,
    actionColumn: {
      width: 200,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
      fixed: 'right',
      resizable: true,
    },
  });

  /**
   * 单击删除按钮事件
   */

  var currentRecordId = ref({});
  //TODO:NOTICE 设置一个响应式变量
  //通过

  const openFee = ref(false);
  function successclick(record) {
    currentRecordId.value = record.diid;
    console.log('record=', record);
    openFee.value = true;
  }

  const fee = ref();

  async function feeSuccess() {
    try {
      const response = await axios.post(
        import.meta.env.VITE_GLOB_API_URL +
          import.meta.env.VITE_GLOB_API_MY_URL_PREFIX +
          '/admin/setFee',
        {
          fee: parseFloat(fee.value),
          currentRecordId: currentRecordId.value,
        },
        {
          headers: {
            Authorization: useUserStore().getToken,
          },
        },
      );
      if (response.data.code == 200) {
        message.success('操作成功');
      } else {
        message.error('操作失败');
      }
    } catch (error) {
      message.error('请求失败');
    } finally {
      openFee.value = false;
      fee.value = '';
      await reload(); // Reload the table data after the operation
    }
  }

  //拒绝
  const openJu = ref(false);
  const jutext = ref();

  function Juclick(record) {
    currentRecordId.value = record.diid;
    console.log('record=', record);
    openJu.value = true;
  }

  async function juSuccess() {
    try {
      const response = await axios.post(
        import.meta.env.VITE_GLOB_API_URL +
          import.meta.env.VITE_GLOB_API_MY_URL_PREFIX +
          '/admin/setJu',
        {
          jutext: jutext.value,
          currentRecordId: currentRecordId.value,
        },
        {
          headers: {
            Authorization: useUserStore().getToken,
          },
        },
      );
      if (response.data.code == 200) {
        message.success('操作成功');
      } else {
        message.error('操作失败');
      }
    } catch (error) {
      message.error('请求失败');
    } finally {
      openJu.value = false;
      jutext.value = '';
      await reload(); // Reload the table data after the operation
    }
  }

  //关闭
  const showConfirm = (record) => {
    Modal.confirm({
      title: '确定处理吗?',
      icon: createVNode(ExclamationCircleOutlined),
      async onOk() {
        try {
          const response = await axios.post(
            import.meta.env.VITE_GLOB_API_URL +
              import.meta.env.VITE_GLOB_API_MY_URL_PREFIX +
              '/admin/setContact',
            {
              currentRecordId: record.id,
            },
            {
              headers: {
                Authorization: useUserStore().getToken,
              },
            },
          );
          if (response.data.code == 200) {
            message.success('操作成功');
          } else {
            message.error('操作失败');
          }
        } catch (error) {
          message.error('请求失败');
        } finally {
          await reload(); // Reload the table data after the operation
        }
      },
      onCancel() {
        console.log('Cancel');
      },
      class: 'test',
    });
  };

  //激活的标签Key
  const activeKey = ref(100);

  function selectTab() {
    if (activeKey.value != 100) {
      setProps({ searchInfo: { status: activeKey } });
    } else {
      setProps({ searchInfo: {} });
    }
    reload();
  }

  async function toCopy(record) {
    console.log('record=', record);
    let gradestrr = '';
    if (record.gradeId >= 7 && record.gradeId <= 9) {
      gradestrr = '幼儿' + record.gradestr;
    } else {
      gradestrr = record.gradestr;
    }

    const reponse = await axios.post(
      import.meta.env.VITE_GLOB_API_URL +
        import.meta.env.VITE_GLOB_API_MY_URL_PREFIX +
        '/admin/getLink',
      {
        diid: record.diid,
      },
      {
        headers: {
          Authorization: useUserStore().getToken,
        },
      },
    );

    if (reponse.data.code != 200) {
      message.error('网络错误！');
      return;
    }
    var link = reponse.data.data;
    var teacherGender =
      record.teacherGender === 0 ? '男女不限' : record.teacherGender === 1 ? '男老师' : '女老师';
    const text = `
  ${record.demandSn} ${record.district} ${gradestrr} ${record.subjectStr}
  学生情况：${record.studentInfo}
  上课次数：${record.fudaoCishu},可辅导时间为${record.teachingTimes}
  课费薪酬：${record.minSalary}-${record.maxSalary}/小时
  授课地址：${record.teachingAddress}
  家教要求：${teacherGender},${record.teacherTypeStr},${record.teacherDemandDescribe}
  应聘链接: ${link}
  `;
    navigator.clipboard
      .writeText(text.trim())
      .then(() => {
        message.success('复制成功');
      })
      .catch(() => {
        message.error('复制失败');
      });
  }

  function openSelect(record: Recordable) {
    console.log('work:', record);
    openModalDemand(true, { data: record });
  }

  function handleModalConfirm() {
    closeDetailModal();
    // message.success('操作成功');
    reload();
  }

  async function handleDelete(record: Recordable) {
    const response = await axios({
      url:
        import.meta.env.VITE_GLOB_API_URL +
        import.meta.env.VITE_GLOB_API_MY_URL_PREFIX +
        '/admin/carousel',
      method: 'DELETE',
      data: {
        id: parseInt(record.id),
      },

      headers: {
        Authorization: useUserStore().getToken,
      },
    });
    console.log(response);
    if (response.data.code == 200) {
      message.success('删除成功');
    } else {
      message.error('删除失败');
    }
    await reload();
  }

  //统计四个数据
  const totalPaidAmount = ref<number>(0);
  const totalRefundedAmount = ref<number>(0);
  const totalActualReceivedAmount = ref<number>(0);
  const totalTransactions = ref<number>(0);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_GLOB_API_URL +
          import.meta.env.VITE_GLOB_API_MY_URL_PREFIX +
          '/admin/demand/applicationCount',
        {
          headers: {
            Authorization: useUserStore().getToken,
          },
        },
      );
      totalPaidAmount.value = response.data.totalPaidAmount;
      totalRefundedAmount.value = response.data.totalRefundedAmount;
      totalActualReceivedAmount.value = response.data.totalActualReceivedAmount;
      totalTransactions.value = response.data.totalTransactions;
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  onMounted(() => {
    fetchData();
  });

  function openEdit(record: Recordable) {
    console.log('work:', record);
    openModalDemand(true, { data: record });
  }

  function openInsert() {
    // console.log('work:', record);
    openModalDemand(true);
  }
</script>
