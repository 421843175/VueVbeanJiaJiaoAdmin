<template>
  <div>
    <!-- TODO:NOTICE 调整列宽(1)声明 -->
    <BasicTable @register="registerTable" :column-config="{ resizable: true }">
      <template #toolbar>
        <!--    新增按钮    -->

        <!-- <div class="flex justify-center mt-4">
      <img :src="img" v-for="img in imgList" :key="img" class="mr-2" @click="handleClick(img)" />
    </div> -->
        <!-- 
        <a-button v-if="hasPermission('SysTenant:create')" type="primary" @click="handleInsert">
          新增
        </a-button> -->
      </template>

      <template #action="{ record }">
        <!--   每行最右侧一列的工具栏   -->
        <TableAction
          :actions="[
            {
              tooltip: '基本信息详情',
              ifShow: hasPermission('SysTenant:retrieve'),
              icon: 'ant-design:copy-outlined',
              onClick: handleRetrieveDetailJi.bind(null, record),
            },

            {
              tooltip: '认证信息详情',
              ifShow: hasPermission('SysTenant:retrieve'),
              icon: 'ant-design:align-center-outlined',
              onClick: handleRetrieveDetailRen.bind(null, record),
            },

            // {
            //   tooltip: '编辑',
            //   ifShow: hasPermission('SysTenant:update'),
            //   icon: 'clarity:note-edit-line',
            //   onClick: handleUpdate.bind(null, record),
            // },
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
          ]"
        />
      </template>
    </BasicTable>
    <!--  详情侧边抽屉    -->
    <SysTenantDetailDrawer @register="registerDetailDrawer" @confirm="handleDrawerConfirm" />
    <!-- <ModalJi @register="registerDetailDrawer" /> -->
    <ModalRen @register="register2" @confirm="handleModalConfirm" />

    <!--  编辑侧边抽屉  -->
    <!-- <SysTenantUpdateDrawer @register="registerUpdateDrawer" @success="handleSuccess" /> -->
  </div>
</template>
<script lang="ts" setup>
  import { BasicTable, TableAction, useTable } from '@/components/Table';
  // import { BasicTableProps, VxeBasicTable, VxeGridInstance } from '@/components/VxeTable';
  // import { useDrawer } from '@/components/Drawer';
  import { hasPermission } from '@/utils/auth';
  import { columns, queryFormSchema } from './data';
  //TODO:NOTICE apis的配置
  import { deleteApi, listApi } from '@/api/teacher/TeacherApi';
  import SysTenantDetailDrawer from './detail-drawer.vue';
  // import SysTenantUpdateDrawer from './update-drawer.vue';
  import ModalRen from './ModalRen.vue';
  import { message } from 'ant-design-vue';
  import { useModal } from '@/components/Modal';
  import { useDrawer } from '@/components/Drawer';

  // 查看详情
  const [registerDetailDrawer, { openDrawer: openDetailDrawer, closeDrawer: closeDetailDrawer }] =
    useDrawer();
  // 新增/编辑
  // const [registerUpdateDrawer, { openDrawer: openUpdateDrawer }] = useDrawer();

  const [register2, { openModal: openModal2, closeModal: closeDetailModal }] = useModal();

  const [registerTable, { reload }] = useTable({
    title: '教师列表',
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
      width: 150,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
      fixed: 'right',
    },
  });

  /**
   * 单击详情按钮事件
   */
  function handleRetrieveDetailRen(record: Recordable) {
    openModal2(true, { data: record });
  }

  function handleRetrieveDetailJi(record: Recordable) {
    // TODO:NOTICE 传值(1)
    openDetailDrawer(true, {
      data: record,
    });
  }
  function handleDrawerConfirm() {
    closeDetailDrawer();
    message.success('操作成功');
  }

  function handleModalConfirm() {
    closeDetailModal();
    message.success('操作成功');
  }

  /**
   * 单击新增按钮事件
   */
  // function handleInsert() {
  //   openUpdateDrawer(true, {
  //     isUpdateView: false,
  //   });
  // }

  /**
   * 单击编辑按钮事件
   */
  // function handleUpdate(record: Recordable) {
  //   openUpdateDrawer(true, {
  //     record,
  //     isUpdateView: true,
  //   });
  // }

  /**
   * 单击删除按钮事件
   */
  async function handleDelete(record: Recordable) {
    await deleteApi([record.tid]);
    await reload();
  }

  /**
   * 编辑成功后事件
   */
  // function handleSuccess() {
  //   reload();
  // }
</script>
