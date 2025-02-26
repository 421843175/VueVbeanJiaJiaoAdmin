<template>
  <div>
    <!-- TODO:NOTICE 调整列宽(1)声明 -->
    <Tabs
      v-model:activeKey="activeKey"
      type="card"
      @change="selectTab()"
      style="margin-top: 20px; margin-left: 10px"
    >
      <TabPane :key="100" tab="全部" />
      <TabPane :key="-2" tab="已拒绝" />
      <TabPane :key="-1" tab="待审核" />
      <TabPane :key="0" tab="发布中" />
      <TabPane :key="1" tab="待确认" />
      <TabPane :key="2" tab="已完成" />
      <TabPane :key="3" tab="已关闭" />
    </Tabs>
    <BasicTable
      @register="registerTable"
      :column-config="{ resizable: true }"
      style="height: 400px"
    >
      <template #expandedRowRender="{ record }">
        <!-- 嵌套子表格 -->
        <BasicTable :columns="nestedColumns" :data-source="record.childrens" :pagination="false" />
      </template>

      <template #action="{ record }">
        <!--   每行最右侧一列的工具栏   -->
        <TableAction
          :actions="[
            {
              tooltip: '通过',
              ifShow: record.status === -1 && hasPermission('SysTenant:retrieve'),
              // icon: 'ant-design:smile-twotone',
              label: '通过',
              onClick: () => successclick(record), //这里是回调类型
            },
            {
              tooltip: '拒绝',
              ifShow: record.status === -1 && hasPermission('SysTenant:retrieve'),
              // icon: 'ant-design:frown-twotone',
              label: '拒绝',
              onClick: () => Juclick(record),
            },
            {
              tooltip: '关闭',
              ifShow: record.status != 3 && hasPermission('SysTenant:retrieve'),
              // icon: 'ant-design:close-outlined',
              label: '关闭',
              onClick: () => showConfirm(record),
            },
            {
              tooltip: '复制',
              // ifShow: hasPermission('SysTenant:delete'),
              // icon: 'ant-design:book-twotone',
              label: '复制',
              onClick: () => toCopy(record),
            },
            {
              tooltip: '编辑',
              // ifShow: hasPermission('SysTenant:delete'),
              // icon: 'ant-design:form-outlined',
              label: '编辑',
              onClick: () => openEdit(record),
            },
          ]"
          style="display: flex; justify-content: flex-start"
        />
      </template>
    </BasicTable>

    <!-- 通过 -->
    <Modal v-model:open="openFee" title="信息费" style="text-align: center" @ok="feeSuccess">
      <Input v-model:value="fee" type="number" placeholder="请设置信息费" style="width: 80%" />
    </Modal>

    <!-- 拒绝 -->
    <Modal v-model:open="openJu" title="拒绝原因" style="text-align: center" @ok="juSuccess">
      <Textarea v-model:value="jutext" placeholder="请输入拒绝原因" :rows="4" style="width: 80%" />
    </Modal>

    <EditDemand @register="registerdemand" @confirm="handleModalConfirm" />
  </div>
</template>
<script lang="ts" setup>
  import { BasicTable, TableAction, useTable } from '@/components/Table';
  // import { BasicTableProps, VxeBasicTable, VxeGridInstance } from '@/components/VxeTable';
  // import { useDrawer } from '@/components/Drawer';
  import { hasPermission } from '@/utils/auth';
  import { columns, queryFormSchema, nestedColumns } from './data';
  //TODO:NOTICE apis的配置
  import { listApi } from '@/api/demand/demandApi';
  import { ref, createVNode } from 'vue';
  // import SysTenantUpdateDrawer from './update-drawer.vue';
  import { message, Modal, Input, Textarea, Tabs, TabPane } from 'ant-design-vue';
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
  import axios from 'axios';
  import { useUserStore } from '@/store/modules/user';
  import EditDemand from './EditDemand.vue';
  import { useModal } from '@/components/Modal';

  const [registerdemand, { openModal: openModalDemand, closeModal: closeDetailModal }] = useModal();

  const [registerTable, { reload, setProps }] = useTable({
    title: '需求列表',
    api: listApi,
    columns,
    formConfig: {
      /*
      列表查询条件
       */
      // 输入框左侧标题的宽度
      labelWidth: 120,
      // 查询条件配置
      schemas: queryFormSchema,
    },
    useSearchForm: true,
    showTableSetting: true,
    bordered: true,
    showIndexColumn: false,
    actionColumn: {
      width: 250,
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
      title: '确定关闭吗?',
      icon: createVNode(ExclamationCircleOutlined),
      async onOk() {
        try {
          const response = await axios.post(
            import.meta.env.VITE_GLOB_API_URL +
              import.meta.env.VITE_GLOB_API_MY_URL_PREFIX +
              '/admin/setStatusClose',
            {
              currentRecordId: record.diid,
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
    copyToClipboard(text.trim())
      .then(() => {
        message.success('复制成功');
      })
      .catch(() => {
        message.error('复制失败');
      });
  }

  function copyToClipboard(textToCopy) {
    console.log('走了');
    // navigator clipboard 需要https等安全上下文
    if (navigator.clipboard && window.isSecureContext) {
      // navigator clipboard 向剪贴板写文本
      return navigator.clipboard.writeText(textToCopy);
    } else {
      // 创建text area
      let textArea = document.createElement('textarea');
      textArea.value = textToCopy;
      // 使text area不在viewport，同时设置不可见
      textArea.style.position = 'absolute';
      textArea.style.opacity = '0';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      return new Promise((res, rej) => {
        // 执行复制命令并移除文本框
        document.execCommand('copy') ? res() : rej();
        textArea.remove();
      });
    }
  }

  function openEdit(record: Recordable) {
    console.log('work:', record);
    openModalDemand(true, { data: record });
  }

  function handleModalConfirm() {
    closeDetailModal();
    // message.success('操作成功');
    reload();
  }
</script>
