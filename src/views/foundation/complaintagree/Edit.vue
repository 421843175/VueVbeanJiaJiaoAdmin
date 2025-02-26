<template>
  <BasicModal
    v-bind="$attrs"
    @ok="submit"
    @register="registerModal"
    title="编辑内容"
    :helpMessage="['编辑内容']"
    width="700px"
  >
    <a-form :model="record">
      <!-- http://127.0.0.1:7003/admin/api/v1/select-options/subject -->
      <a-form-item label="父级分类">
        <a-cascader
          v-model:value="record.allparentId"
          :options="all"
          expand-trigger="hover"
          placeholder="Please select"
        />
      </a-form-item>

      <a-form-item label="类型">
        <a-radio-group v-model:value="record.type">
          <a-radio :value="1">反馈</a-radio>
          <a-radio :value="2">投诉</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item label="名称">
        <a-input v-model:value="record.name" />
      </a-form-item>

      <a-form-item label="描述">
        <a-input v-model:value="record.des" />
      </a-form-item>
    </a-form>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref, watch, defineEmits, onMounted } from 'vue';
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
    Cascader as aCascader,
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

  const gradeOptions = {
    1: [
      { value: 7, label: '小班' },
      { value: 8, label: '中班' },
      { value: 9, label: '大班' },
    ],
    3: [
      { value: 13, label: '一年级' },
      { value: 12, label: '二年级' },
      { value: 14, label: '三年级' },
      { value: 15, label: '四年级' },
      { value: 16, label: '五年级' },
      { value: 17, label: '六年级' },
    ],
    4: [
      { value: 18, label: '初一' },
      { value: 19, label: '初二' },
      { value: 20, label: '初三' },
    ],
    5: [
      { value: 21, label: '高一' },
      { value: 22, label: '高二' },
      { value: 23, label: '高三' },
    ],
    6: [{ value: 29, label: '成人' }],
  };

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

    if (record.value.num != undefined) {
      axios
        .put(
          import.meta.env.VITE_GLOB_API_URL +
            import.meta.env.VITE_GLOB_API_MY_URL_PREFIX +
            '/admin/complaint/' +
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
            '/admin/complaint/',
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

  const selectedLevel1 = ref(null);
  const selectedLevel2 = ref(null);
  const levelOptions = ref([]);
  const level1Options = ref([]);
  const level2Options = ref([]);
  const level3Options = ref([]);
  const selectedLevel3 = ref(null);

  // 初始化教师类型数据
  const initTeacherTypes = async () => {
    const response = await axios.get(
      import.meta.env.VITE_GLOB_API_URL +
        import.meta.env.VITE_GLOB_API_MY_URL_PREFIX +
        '/select-options/identity-types',
      {
        headers: {
          Authorization: useUserStore().getToken,
        },
      },
    );
    level1Options.value = response.data.filter((item) => item.level === 1);
    levelOptions.value = response.data;
    console.log('test:', level1Options.value);
  };

  const initializeTeacherTypes = () => {
    const teacherType = record.value.teacherType;
    console.log('load:', teacherType);
    if (!teacherType) return;

    const level3Item = levelOptions.value.find(
      (item) => item.idtId === teacherType && item.level === 3,
    );
    console.log('level3Item:', level3Item);
    const level2Item = levelOptions.value.find(
      (item) => item.idtId === (level3Item ? level3Item.pid : teacherType) && item.level === 2,
    );
    console.log('level2Item:', level2Item);
    const level1Item = levelOptions.value.find(
      (item) => item.idtId === (level2Item ? level2Item.pid : teacherType) && item.level === 1,
    );
    if (level1Item != undefined) selectedLevel1.value = level1Item.idtName;
    if (level2Item != undefined) selectedLevel2.value = level2Item.idtName;
    if (level3Item != undefined) selectedLevel3.value = level3Item.idtName;

    // if (level1Item) onLevel1Change(level1Item.idtId);
    // if (level2Item) onLevel2Change(level2Item.idtId);
  };

  // 根据选择的第一级选项更新第二级选项
  const onLevel1Change = (value) => {
    console.log('value=', value);
    selectedLevel2.value = null;
    record.value.teacherType = null;

    level2Options.value = levelOptions.value.filter((item) => item.pid === value) || [];
    console.log('2:', level2Options.value);
    level3Options.value = [];
    selectedLevel3.value = null; // 清空 selectedLevel3
  };

  // 根据选择的第二级选项更新第三级选项
  const onLevel2Change = (value) => {
    record.value.teacherType = null;
    level3Options.value = levelOptions.value.filter((item) => item.pid === value) || [];
    console.log('3:', level3Options.value);
  };

  onMounted(() => {
    console.log('组件挂载完成');
    initTeacherTypes();
  });

  const all = ref([]);

  onMounted(() => {
    axios
      .get(
        import.meta.env.VITE_GLOB_API_URL +
          import.meta.env.VITE_GLOB_API_MY_URL_PREFIX +
          '/select-options/complaint-types',
        {
          headers: {
            Authorization: useUserStore().getToken,
          },
        },
      )
      .then((response) => {
        all.value = response.data;
      })
      .catch((error) => {
        console.error('Failed to fetch options:', error);
      });
  });
</script>
