<template>
  <a-form :model="form">
    <a-form-item label="标题">
      <a-input v-model:value="form.title" />
    </a-form-item>
    <a-form-item label="用户协议">
      <Tinymce ref="md" v-model="form.content" :subfield="false" defaultOpen="edit" @change="wa" />
    </a-form-item>
    <a-form-item>
      <a-button type="primary" @click="submitForm">提交</a-button>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import {
    Form as aForm,
    FormItem as aFormItem,
    Input as aInput,
    Button as aButton,
    message,
  } from 'ant-design-vue';
  import 'mavon-editor/dist/css/index.css';
  import { Tinymce } from '@/components/Tinymce/index';
  import axios from 'axios';
  import { useUserStore } from '@/store/modules/user';

  const form = ref({
    id: 1,
    title: '',
    content: '',
  });

  function wa() {}
  // 页面加载时获取数据
  onMounted(async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_GLOB_API_URL +
          import.meta.env.VITE_GLOB_API_MY_URL_PREFIX +
          '/admin/protol/3',
        {
          headers: {
            Authorization: useUserStore().getToken,
          },
        },
      );
      if (response.data) {
        console.log('response.data=', response.data);
        form.value = response.data.data;
      }
    } catch (error) {
      console.error('获取数据失败:', error);
    }
  });

  const submitForm = async () => {
    form.value.content = form.value.content.replace('"', "'");
    try {
      const response = await axios.put(
        import.meta.env.VITE_GLOB_API_URL +
          import.meta.env.VITE_GLOB_API_MY_URL_PREFIX +
          '/admin/protol/3',
        form.value,
        {
          headers: {
            Authorization: useUserStore().getToken,
          },
        },
      );
      if (response.data.code == 200) {
        message.success('更新成功');
      }
    } catch (error) {
      console.log('form=', form.value);
      message.error('提交失败:', error);
    }
  };
</script>

<style scoped>
  /* 你可以根据需要自定义样式 */
</style>
