<template>
  <!-- TODO:TODO 文件上传写死 -->
  <a-form :model="form">
    <a-form-item label="用户协议">
      <Tinymce ref="md" v-model="form.agreement" :subfield="false" defaultOpen="edit" />
    </a-form-item>
    <a-form-item label="教学优势">
      <a-input v-model:value="form.tag" />
    </a-form-item>
    <a-form-item label="关于我们">
      <Tinymce ref="md" v-model="form.aboutus" :subfield="false" defaultOpen="edit" />
    </a-form-item>
    <a-form-item label="家长端-客服微信号">
      <a-input v-model:value="form.wxCode" />
    </a-form-item>
    <a-form-item label="家长端-客服微信二维码">
      <a-upload
        v-model:file-list="wxqr"
        :multiple="true"
        :maxCount="1"
        name="file"
        list-type="picture"
        :customRequest="jiazhang"
      >
        <upload-outlined />
        <a-button> 选择图片 </a-button>
      </a-upload>
    </a-form-item>
    <a-form-item label="家长端-客服电话">
      <a-input v-model:value="form.kefuMobilePhone" />
    </a-form-item>
    <a-form-item label="教师端-客服微信号">
      <a-input v-model:value="form.twxCode" />
    </a-form-item>
    <a-form-item label="教师端-客服微信二维码">
      <a-upload
        v-model:file-list="jiaoshima"
        :multiple="true"
        :maxCount="1"
        name="file"
        list-type="picture"
        :customRequest="jiaoshikefu"
      >
        <upload-outlined />
        <a-button> 选择图片 </a-button>
      </a-upload>
    </a-form-item>
    <a-form-item label="教师端-客服电话">
      <a-input v-model:value="form.tkefuMobilePhone" />
    </a-form-item>
    <a-form-item label="小程序二维码">
      <a-upload
        v-model:file-list="miniQrcodeUrl"
        :multiple="true"
        :maxCount="1"
        name="file"
        list-type="picture"
        :customRequest="xiaocheng"
      >
        <upload-outlined />
        <a-button> 选择图片 </a-button>
      </a-upload>
    </a-form-item>
    <a-form-item label="查看价格说明">
      <a-input v-model:value="form.priceRule" />
    </a-form-item>
    <a-form-item label="AppLogo">
      <a-upload
        v-model:file-list="applogo"
        :multiple="true"
        :maxCount="1"
        name="file"
        list-type="picture"
        :customRequest="logo"
      >
        <upload-outlined />
        <a-button> 选择图片 </a-button>
      </a-upload>
    </a-form-item>
    <a-form-item label="AppName">
      <a-input v-model:value="form.appName" />
    </a-form-item>
    <a-form-item label="报名信息费">
      <a-input-number v-model:value="form.baomingXinxiFee" />
    </a-form-item>
    <a-form-item label="报名违约费">
      <a-input-number v-model:value="form.baomingWeiyueFee" />
    </a-form-item>
    <a-form-item label="报名违约提示">
      <a-input v-model:value="form.baomingWeiyueTips" />
    </a-form-item>
    <a-form-item label="支付倒计时">
      <a-input-number v-model:value="form.paymentCountdown" />
    </a-form-item>
    <a-form-item label="试课须知">
      <a-input v-model:value="form.shikeNotice" />
    </a-form-item>
    <a-form-item label="价格图文">
      <a-upload
        v-model:file-list="priceImageText"
        :multiple="true"
        :maxCount="1"
        name="file"
        list-type="picture"
        :customRequest="jiage"
      >
        <upload-outlined />
        <a-button> 选择图片 </a-button>
      </a-upload>
    </a-form-item>
    <a-form-item label="收件邮箱">
      <a-input v-model:value="form.addresseeEmail" />
    </a-form-item>
    <a-form-item>
      <a-button type="primary" @click="submitForm">提交</a-button>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
  import { ref, onMounted, watchEffect } from 'vue';
  import { UploadOutlined } from '@ant-design/icons-vue';
  import {
    Form as aForm,
    FormItem as aFormItem,
    Input as aInput,
    Button as aButton,
    message,
    Upload as aUpload,
    InputNumber as aInputNumber,
  } from 'ant-design-vue';
  import { Tinymce } from '@/components/Tinymce/index';
  import axios from 'axios';
  import { useUserStore } from '@/store/modules/user';

  const form = ref({
    cid: null, // 主键标识符
    agreement: '', // 用户协议
    tag: '', // 教学优势
    aboutus: '', // 关于我们
    wxCode: '', // 微信号
    wxQrcodeUrl: '', // 微信二维码
    kefuMobilePhone: '', // 客服电话
    priceRule: '', // 查看价格说明
    miniQrcodeUrl: '', // 小程序二维码
    appLogo: '', // 应用Logo
    appName: '', // 应用名称
    baomingXinxiFee: '', // 报名信息费
    baomingWeiyueFee: '', // 报名违约费
    paymentCountdown: 0, // 支付倒计时
    baomingWeiyueTips: '', // 报名违约提示
    shikeNotice: '', // 试课须知
    priceImageText: '', // 价格图文
    addresseeEmail: '', // 收件人邮箱
    twxQrcodeUrl: '', // 教师段微信二维码
    twxCode: '', // 教师段微信号
    tkefuMobilePhone: '', // 教师段客服电话
  });

  // 页面加载时获取配置数据
  onMounted(async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_GLOB_API_URL}${import.meta.env.VITE_GLOB_API_MY_URL_PREFIX}/admin/config`,
        {
          headers: {
            Authorization: useUserStore().getToken,
          },
        },
      );
      if (response.data) {
        form.value = response.data.data;
      }
    } catch (error) {
      console.error('获取数据失败:', error);
    }
  });

  const submitForm = async () => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_GLOB_API_URL}${import.meta.env.VITE_GLOB_API_MY_URL_PREFIX}/admin/config`,
        form.value,
        {
          headers: {
            Authorization: useUserStore().getToken,
          },
        },
      );
      if (response.data.code === 200) {
        message.success('更新成功');
      }
    } catch (error) {
      message.error('提交失败:', error);
    }
  };
  interface UploadFile {
    uid: string;
    name: string;
    url: string;
  }
  const wxqr = ref<UploadFile[]>([]);
  const jiaoshima = ref<UploadFile[]>([]);
  const miniQrcodeUrl = ref<UploadFile[]>([]);
  const applogo = ref<UploadFile[]>([]);
  const priceImageText = ref<UploadFile[]>([]);

  watchEffect(() => {
    wxqr.value = form.value.wxQrcodeUrl
      ? [
          {
            uid: '1',
            name: '',
            url: import.meta.env.VITE_GLOB_Online_URL + form.value.wxQrcodeUrl,
          },
        ]
      : [];

    jiaoshima.value = form.value.twxQrcodeUrl
      ? [
          {
            uid: '1',
            name: '',
            url: import.meta.env.VITE_GLOB_Online_URL + form.value.twxQrcodeUrl,
          },
        ]
      : [];

    miniQrcodeUrl.value = form.value.miniQrcodeUrl
      ? [
          {
            uid: '1',
            name: '',
            url: import.meta.env.VITE_GLOB_Online_URL + form.value.miniQrcodeUrl,
          },
        ]
      : [];

    applogo.value = form.value.appLogo
      ? [
          {
            uid: '1',
            name: '',
            url: import.meta.env.VITE_GLOB_Online_URL + form.value.appLogo,
          },
        ]
      : [];

    priceImageText.value = form.value.priceImageText
      ? [
          {
            uid: '1',
            name: '',
            url: import.meta.env.VITE_GLOB_Online_URL + form.value.priceImageText,
          },
        ]
      : [];
  });

  function jiazhang(option) {
    uploadfunction(option)
      .then((resultnum) => {
        console.log('成了:', resultnum);
        form.value.wxQrcodeUrl = resultnum; // 确保form.value.wxQrcodeUrl在你定义的地方存在
        option.onSuccess(resultnum);
      })
      .catch((error) => {
        console.error('上传失败:', error);
        option.onError(error);
      });
  }

  function jiaoshikefu(option) {
    uploadfunction(option)
      .then((resultnum) => {
        console.log('成了:', resultnum);
        form.value.twxQrcodeUrl = resultnum; // 确保form.value.wxQrcodeUrl在你定义的地方存在
        option.onSuccess(resultnum);
      })
      .catch((error) => {
        console.error('上传失败:', error);
        option.onError(error);
      });
  }

  function xiaocheng(option) {
    uploadfunction(option)
      .then((resultnum) => {
        console.log('成了:', resultnum);
        form.value.miniQrcodeUrl = resultnum; // 确保form.value.wxQrcodeUrl在你定义的地方存在
        option.onSuccess(resultnum);
      })
      .catch((error) => {
        console.error('上传失败:', error);
        option.onError(error);
      });
  }

  function logo(option) {
    uploadfunction(option)
      .then((resultnum) => {
        console.log('成了:', resultnum);
        form.value.appLogo = resultnum; // 确保form.value.wxQrcodeUrl在你定义的地方存在
        option.onSuccess(resultnum);
      })
      .catch((error) => {
        console.error('上传失败:', error);
        option.onError(error);
      });
  }

  function jiage(option) {
    uploadfunction(option)
      .then((resultnum) => {
        console.log('成了:', resultnum);
        form.value.priceImageText = resultnum; // 确保form.value.wxQrcodeUrl在你定义的地方存在
        option.onSuccess(resultnum);
      })
      .catch((error) => {
        console.error('上传失败:', error);
        option.onError(error);
      });
  }

  // 文件上传函数
  function uploadfunction(option) {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', option.file);
      console.log('FormData:', formData.get('file')); // 验证 file 是否正确附加

      axios
        .post(
          `${import.meta.env.VITE_GLOB_API_URL}${import.meta.env.VITE_GLOB_API_MY_URL_PREFIX}/upload/upload`,
          formData,
          {
            headers: {
              Authorization: useUserStore().getToken,
              'Content-Type': 'multipart/form-data',
            },
          },
        )
        .then((res) => {
          console.log('res:', res);
          if (res.data.code === 200) {
            resolve(res.data.data);
          } else {
            reject(new Error('上传失败'));
          }
        })
        .catch((error) => {
          console.error('上传出错:', error);
          reject(error);
        });
    });
  }
</script>

<style scoped>
  /* 自定义样式 */
</style>
