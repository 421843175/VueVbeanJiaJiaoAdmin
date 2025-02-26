<template>
  <Descriptions size="middle" :column="2">
    <Descriptions.Item label="实名认证">
      <ImagePreviewGroup>
        <span style="margin-left: 1%" v-for="(item, index) in splitdou(record.idCardUrls)">
          <Image :width="80" :height="80" :src="globalURL + item" />
        </span>
      </ImagePreviewGroup>
    </Descriptions.Item>
    <Descriptions.Item label="实名审核">
      <Switch
        v-model:checked="realNameVerified"
        @change="clickRealNameVerified"
        checked-children="已通过"
        un-checked-children="未通过"
      />
    </Descriptions.Item>
  </Descriptions>

  <Descriptions size="middle" :column="2">
    <Descriptions.Item label="学历认证">
      <ImagePreviewGroup>
        <span style="margin-left: 1%" v-for="(item, index) in splitdou(record.xueliUrls)">
          <Image :width="80" :height="80" :src="globalURL + item" />
        </span>
      </ImagePreviewGroup>
    </Descriptions.Item>
    <Descriptions.Item label="学历审核">
      <Switch
        v-model:checked="educationVerified"
        @change="clickeducationVerified"
        checked-children="已通过"
        un-checked-children="未通过"
      />
    </Descriptions.Item>
  </Descriptions>

  <Descriptions size="middle" :column="2">
    <Descriptions.Item label="教资认证">
      <ImagePreviewGroup>
        <span style="margin-left: 1%" v-for="(item, index) in splitdou(record.teachingCertUrls)">
          <Image :width="80" :height="80" :src="globalURL + item" />
        </span>
      </ImagePreviewGroup>
    </Descriptions.Item>
    <Descriptions.Item label="教资审核">
      <Switch
        v-model:checked="teachingVerified"
        @change="clickTeachingVerified"
        checked-children="已通过"
        un-checked-children="未通过"
      />
    </Descriptions.Item>
  </Descriptions>

  <Descriptions size="middle" :column="1">
    <Descriptions.Item label="签名">
      <ImagePreviewGroup>
        <span style="margin-left: 2%" v-for="(item, index) in splitdou(record.signUrl)">
          <Image :width="80" :height="80" :src="globalURL + item" />
        </span>
      </ImagePreviewGroup>
    </Descriptions.Item>
    <Descriptions.Item label="注册步骤"> 第{{ record.step }}步 </Descriptions.Item>

    <Descriptions.Item label="审核状态">
      <!-- <Switch 
          v-model:checked="statusVerified" 
          @change="clickstatusVerified" 
          checked-children="通过" 
          un-checked-children="驳回" 
        />
      </Descriptions.Item> -->

      <RadioGroup v-model:value="statusVerified" name="status" @change="clickstatusVerified">
        <Radio :value="1">通过</Radio>
        <Radio :value="2">驳回</Radio>
      </RadioGroup>
    </Descriptions.Item>

    <Descriptions.Item label="驳回原因" v-if="statusVerified === 2">
      <Textarea
        v-model:value="record.refusalRemark"
        :rows="4"
        placeholder="请输入驳回原因"
        :maxlength="1000"
      />
    </Descriptions.Item>

    <Descriptions.Item label="是否精选">
      <Switch
        v-model:checked="statusJing"
        @change="clickJingVerified"
        checked-children="精选"
        un-checked-children="非精选"
      />
    </Descriptions.Item>
  </Descriptions>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import {
    Descriptions,
    ImagePreviewGroup,
    Image,
    Switch,
    Textarea,
    Button,
    RadioGroup,
    Radio,
  } from 'ant-design-vue';
  import axios from 'axios';

  import { updateApi } from '@/api/teacher/TeacherApi';

  const globalURL = import.meta.env.VITE_GLOB_Online_URL;

  // TODO:NOTICE 组件间通信(2)
  const props = defineProps({
    record: {
      type: Object,
      default: '',
    },
  });

  const record = ref(props.record);

  watch(
    () => props.record,
    (newRecord) => {
      record.value = newRecord;
      // rejectReason.value = newRecord.rejectReason || "";
    },
    { immediate: true },
  );

  function splitdou(item) {
    if (item) {
      return item.split(',');
    }
  }

  //实名认证模块
  // 数据变化时，会自动触发视图更新。
  const realNameVerified = ref(record.value.shimingStatus === 1);

  function clickRealNameVerified(checked) {
    record.value.shimingStatus = checked ? 1 : 0;
    console.log('新的实名认证数据:', record.value.shimingStatus);
  }

  watch(
    () => record.value.shimingStatus,
    (newStatus) => {
      realNameVerified.value = newStatus === 1;
    },
    { immediate: true },
  );

  //学历认证模块
  const educationVerified = ref(record.value.xueliStatus === 1);

  function clickeducationVerified(checked) {
    record.value.xueliStatus = checked ? 1 : 0;
  }

  watch(
    () => record.value.xueliStatus,
    (newStatus) => {
      educationVerified.value = newStatus === 1;
    },
    { immediate: true },
  );

  //教资认证模块
  const teachingVerified = ref(record.value.jiaoshiStatus === 1);

  function clickTeachingVerified(checked) {
    record.value.jiaoshiStatus = checked ? 1 : 0;
  }

  watch(
    () => record.value.jiaoshiStatus,
    (newStatus) => {
      teachingVerified.value = newStatus === 1;
    },
    { immediate: true },
  );

  //审核状态
  const statusVerified = ref(record.value.status === '通过' ? 1 : 0);

  function clickstatusVerified(event) {
    record.value.status = event.target.value;
    if (record.value.status === '通过') {
      record.value.refusalRemark = ''; // 清空驳回原因
    }
  }

  watch(
    () => record.value.status,
    (newStatus) => {
      statusVerified.value = newStatus;
    },
    { immediate: true },
  );

  //是否精选
  const statusJing = ref(record.value.isIndex === 0);

  function clickJingVerified(checked) {
    record.value.isIndex = checked ? 0 : 1;
  }

  watch(
    () => record.value.isIndex,
    (newStatus) => {
      statusJing.value = newStatus === 0;
    },
    { immediate: true },
  );

  //TODO:NOTICE 告知异步
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
  }
</script>
