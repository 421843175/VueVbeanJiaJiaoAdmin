<template>
  <div>
    <Card style="margin: 20px">
      <Edit @register="registerdemand" @confirm="handleModalConfirm" />
    </Card>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import { message, Card } from 'ant-design-vue';
  import { useUserStore } from '@/store/modules/user';
  import Edit from './Edit.vue';
  import { useModal } from '@/components/Modal';
  import { listApi } from '@/api/gradesort/gradesortApi';
  import { useTable } from '@/components/Table';
  import { columns, queryFormSchema } from './data';

  const [registerdemand, { openModal: openModalDemand, closeModal: closeDetailModal }] = useModal();
  const [registerTable, { reload, setProps }] = useTable({
    title: '列表',
    api: listApi,
    columns,
    formConfig: {
      labelWidth: 120,
      schemas: queryFormSchema,
    },
    useSearchForm: true,
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

  // 初始化数据的相关代码
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

  function handleModalConfirm() {
    closeDetailModal();
    reload();
  }
</script>
