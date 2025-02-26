<template>
  <BasicModal
    v-bind="$attrs"
    @ok="submit"
    @register="registerDrawer"
    title="认证信息"
    :helpMessage="['认证信息']"
    width="700px"
  >
    <!-- <p class="h-20" v-for="index in 20" :key="index">renrenren</p> -->
    <RenZheng :record="record" />
    <!-- <Button type="primary" @click="submit">提交</Button> -->
  </BasicModal>
</template>

<script lang="ts" setup>
  import { BasicModal, useModalInner } from '@/components/Modal';
  import RenZheng from './RenZheng.vue';
  import { ref } from 'vue';

  import { updateApi } from '@/api/teacher/TeacherApi';
  // import { createImgPreview } from '@/components/Preview/index';

  //TODO:NOTICE VUE3使用emit的方式
  import { defineEmits } from 'vue';

  const emit = defineEmits(['confirm']);

  const record = ref({});

  // const globalURL=import.meta.env.VITE_GLOB_Online_URL;
  const [registerDrawer] = useModalInner((data) => {
    console.log('gogogo');
    if (data && data.data) {
      record.value = data.data;
    }

    console.log('record:', record);
  });

  async function submit() {
    const payload = {
      ...record.value,
    };
    console.log('payload=', payload);

    // axios.post( import.meta.env.VITE_GLOB_API_URL+import.meta.env.VITE_GLOB_API_MY_URL_PREFIX+'/admin/teacher/updateTeacher'
    // , payload)
    //   .then(response => {
    //     console.log('提交成功:', response.data);
    //   })
    //   .catch(error => {
    //     console.error('提交失败:', error);
    //   });

    //TODO:NOTICE 自定义的接口(3)
    await updateApi(payload.tid, {
      id: payload.tid,
      shimingStatus: payload.shimingStatus,
      xueliStatus: payload.xueliStatus,
      jiaoshiStatus: payload.jiaoshiStatus,
      status: payload.status,
      refusalRemark: payload.refusalRemark,
      isIndex: payload.isIndex,
    });

    // TODO:NOTICE 触发父组件的 confirm 事件
    emit('confirm');
  }
</script>
