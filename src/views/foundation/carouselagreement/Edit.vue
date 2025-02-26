<template>
  <BasicModal
    v-bind="$attrs"
    @ok="submitForm"
    @register="registerModal"
    title="编辑内容"
    :helpMessage="['编辑内容']"
    width="700px"
    @cancel="cancel"
  >
    <a-form :model="record">
      <!-- http://127.0.0.1:7003/admin/api/v1/select-options/subject -->
      <a-form-item
        label="轮播图片"
        extra="家长段:建议尺寸：宽660像素*高300像素\n教师端:建议尺寸：宽700像素*高325像素"
      >
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

      <a-form-item label="类型">
        <a-radio-group v-model:value="record.type">
          <a-radio :value="1">家长端</a-radio>
          <a-radio :value="2">教师端</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item label="排序">
        <a-input-number v-model:value="record.sort" />
      </a-form-item>
      <a-form-item label="跳转链接">
        <a-input v-model:value="record.redirectPath" />
      </a-form-item>
      <!-- 
      <a-form-item>
        <a-button type="primary" @click="submitForm">提交</a-button>
      </a-form-item> -->
    </a-form>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref, watch, defineEmits, onMounted, watchEffect } from 'vue';
  import {
    Form as aForm,
    FormItem as aFormItem,
    Input as aInput,
    Button as aButton,
    message,
    Upload as aUpload,
    InputNumber as aInputNumber,
    RadioGroup as aRadioGroup,
    Radio as aRadio,
  } from 'ant-design-vue';
  import { useModalInner, BasicModal } from '@/components/Modal';
  import { gradeoptions, getTwo } from './data';
  import axios from 'axios';
  import { useUserStore } from '@/store/modules/user';

  const emit = defineEmits(['confirm']);
  const options = ref([]);

  const record: Recordable = ref({});

  const one = ref(0);
  const two = ref(null);
  watch(one, async (newOne) => {
    console.log('gogogo');
    if (newOne !== 0) {
      options.value = await getTwo(one.value);
    }
  });
  const [registerModal] = useModalInner((data) => {
    if (data && data.data) {
      record.value = data.data;
      one.value = record.value.allparentId[0];
      if (record.value.level == 2) two.value = record.value.allparentId[1];
      console.log('one=', one.value);
      initializeTeacherTypes();
    }
  });

  const subGrades = ref([]);

  const gradeMapping = {
    7: 1,
    8: 1,
    9: 1,
    13: 3,
    12: 3,
    14: 3,
    15: 3,
    16: 3,
    17: 3,
    18: 4,
    19: 4,
    20: 4,
    21: 5,
    22: 5,
    23: 5,
    29: 6,
    1: undefined,
    2: undefined,
    3: undefined,
    4: undefined,
    5: undefined,
    6: undefined,
  };

  const onMainGradeChange = (value) => {
    subGrades.value = gradeOptions[value] || [];
  };

  const setGradeValues = (gradeId) => {
    if (gradeId == null) return;
    const mainGradeId = gradeMapping[gradeId];
    if (mainGradeId !== undefined) {
      record.value.mainGradeId = mainGradeId;
      onMainGradeChange(mainGradeId);
      record.value.gradeId = gradeId;
    } else {
      record.value.mainGradeId = gradeId;
      onMainGradeChange(mainGradeId);
      record.value.gradeId = null;
    }
  };

  watch(
    () => record.value.mainGradeId,
    (newMainGradeId) => {
      onMainGradeChange(newMainGradeId);
    },
  );

  watch(
    () => record.value.gradeId,
    (newGradeId) => {
      setGradeValues(newGradeId);
    },
    { immediate: true },
  );

  async function submit() {
    console.log(record.value);

    // 确定最终的 teacherType
    if (selectedLevel3.value) {
      record.value.teacherType = selectedLevel3.value;
    } else if (selectedLevel2.value) {
      record.value.teacherType = selectedLevel2.value;
    } else if (selectedLevel1.value) {
      record.value.teacherType = selectedLevel1.value;
    }

    //TODO:NOTICE 这里想直接获取只能传record.value不能再套一层 传 record:record.value
    // 在这里提交数据
    record.value.parentId = two.value;

    if (record.value.num != undefined) {
      axios
        .put(
          import.meta.env.VITE_GLOB_API_URL +
            import.meta.env.VITE_GLOB_API_MY_URL_PREFIX +
            '/admin/getide/' +
            record.value.num,
          record.value,

          {
            headers: {
              Authorization: useUserStore().getToken,
            },
          },
        )
        .then((res) => {
          console.log('resp:', res);
          if (res.data.code == 200) {
            message.success('更新成功');
            emit('confirm');
          }
        });
    } else {
      axios
        .post(
          import.meta.env.VITE_GLOB_API_URL +
            import.meta.env.VITE_GLOB_API_MY_URL_PREFIX +
            '/admin/getide/',
          record.value,

          {
            headers: {
              Authorization: useUserStore().getToken,
            },
          },
        )
        .then((res) => {
          console.log('resp:', res);
          if (res.data.code == 200) {
            message.success('更新成功');
            emit('confirm');
          }
        });
    }
  }

  interface UploadFile {
    uid: string;
    name: string;
    url: string;
  }
  const applogo = ref<UploadFile[]>([]);

  watchEffect(() => {
    applogo.value = record.value.originalImgUrl
      ? [
          {
            uid: '1',
            name: '',
            url: import.meta.env.VITE_GLOB_Online_URL + record.value.originalImgUrl,
          },
        ]
      : [];
  });

  function logo(option) {
    uploadfunction(option)
      .then((resultnum) => {
        console.log('成了:', resultnum);
        record.value.originalImgUrl = resultnum; // 确保form.value.wxQrcodeUrl在你定义的地方存在
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

  const submitForm = async () => {
    if (record.value.id != undefined) {
      try {
        const response = await axios.put(
          `${import.meta.env.VITE_GLOB_API_URL}${import.meta.env.VITE_GLOB_API_MY_URL_PREFIX}/admin/carousel`,
          record.value,
          {
            headers: {
              Authorization: useUserStore().getToken,
            },
          },
        );
        if (response.data.code === 200) {
          message.success('更新成功');
          emit('confirm');
        }
      } catch (error) {
        message.error('提交失败:', error);
      }
    } else {
      //新增
      axios
        .post(
          import.meta.env.VITE_GLOB_API_URL +
            import.meta.env.VITE_GLOB_API_MY_URL_PREFIX +
            '/admin/carousel/',
          record.value,

          {
            headers: {
              Authorization: useUserStore().getToken,
            },
          },
        )
        .then((res) => {
          console.log('resp:', res);
          if (res.data.code == 200) {
            message.success('新增成功');
            emit('confirm');
          }
        });
    }

    record.value.id = null;
    record.value.originalImgUrl = '';
    record.value.sort = 0;
    record.value.type = 0;
    record.value.redirectPath = '';
  };

  function cancel() {
    record.value.id = null;
    record.value.originalImgUrl = '';
    record.value.sort = 0;
    record.value.type = 0;
    record.value.redirectPath = '';
  }
</script>
