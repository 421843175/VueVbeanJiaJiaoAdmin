<template>
  <BasicModal
    v-bind="$attrs"
    @ok="submit"
    @register="registerModal"
    title="查看信息"
    :helpMessage="['查看信息']"
    width="700px"
  >
    <Descriptions size="middle" :column="1">
      <!-- TODO:NOTICE 传值(3) 展示到模板 -->
      <Descriptions.Item label="姓名">{{ record.teacherName }}</Descriptions.Item>
      <Descriptions.Item label="性别">{{ record.gender === 1 ? '男' : '女' }}</Descriptions.Item>
      <Descriptions.Item label="个人真实头像">
        <!-- <Avatar @click="createImgPreview({imageList:[globalURL+record.realAvatar]})" :src="(globalURL+record.realAvatar) || 'https://www.antdv.com/assets/logo.1ef800a8.svg'" />  -->
        <Image
          :src="globalURL + record.realAvatar || 'https://www.antdv.com/assets/logo.1ef800a8.svg'"
          :height="50"
          :width="50"
        />
      </Descriptions.Item>

      <Descriptions.Item label="报名单号">{{ record.applySn }}</Descriptions.Item>
      <Descriptions.Item label="需求单号">{{ record.demandsn }}</Descriptions.Item>
      <Descriptions.Item label="需求状态">
        {{
          record.xuqiuStatus === -2
            ? '已拒绝'
            : record.xuqiuStatus === -1
              ? '待审核'
              : record.xuqiuStatus === 0
                ? '发布中'
                : record.xuqiuStatus === 1
                  ? '待确认'
                  : record.xuqiuStatus === 2
                    ? '已完成'
                    : record.xuqiuStatus === 3
                      ? '已关闭'
                      : '未知状态'
        }}
      </Descriptions.Item>
      <Descriptions.Item label="信息费">{{ record.messageFee }}</Descriptions.Item>

      <Descriptions.Item label="应聘留言">{{ record.remark }}</Descriptions.Item>
      <Descriptions.Item label="报名状态">
        {{
          record.status === 0
            ? '报名中'
            : record.status === 1
              ? '试课待确认'
              : record.status === 2
                ? '确认试课(已完成)'
                : record.status === 3
                  ? '放弃试课'
                  : record.status === 4
                    ? '报名失败'
                    : '未知状态'
        }}</Descriptions.Item
      >
      <Descriptions.Item label="支付状态">
        {{
          record.payStatus === 0
            ? '待支付'
            : record.payStatus === 1
              ? '已支付'
              : record.payStatus === 2
                ? '超时未支付'
                : record.payStatus === 3
                  ? '已退款'
                  : record.payStatus === 4
                    ? '退费失败'
                    : '未知状态'
        }}
      </Descriptions.Item>

      <Descriptions.Item label="支付时间">
        {{ formattedTime }}
      </Descriptions.Item>
    </Descriptions>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref, watch, defineEmits, onMounted, computed } from 'vue';
  import {
    Descriptions,
    Tabs,
    Avatar,
    ImagePreviewGroup,
    Image,
    TypographyTitle,
    Tag,
    Timeline,
    TimelineItem,
    Carousel,
    Button,
    message,
  } from 'ant-design-vue';
  import { useModalInner, BasicModal } from '@/components/Modal';
  import { teachingSubjectOptions, teachingIdtOptions } from './data';
  import axios from 'axios';
  import { useUserStore } from '@/store/modules/user';

  const formattedTime = computed(() => {
    const date = new Date(record.value.payEndTime * 1000);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return `${year}年 ${month}月 ${day}日 ${hours}时 ${minutes}分 ${seconds}秒`;
  });

  const globalURL = import.meta.env.VITE_GLOB_Online_URL;
  const emit = defineEmits(['confirm']);

  const record: Recordable = ref({});

  const [registerModal] = useModalInner((data) => {
    if (data && data.data) {
      record.value = data.data;
      console.log('传来的record:', record.value);
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
    axios
      .put(
        import.meta.env.VITE_GLOB_API_URL +
          import.meta.env.VITE_GLOB_API_MY_URL_PREFIX +
          '/admin/demand/' +
          record.value.diid,
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
</script>
