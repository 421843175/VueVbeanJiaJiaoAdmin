<template>
  <BasicModal
    v-bind="$attrs"
    @ok="submit"
    @register="registerModal"
    title="编辑内容"
    :helpMessage="['编辑内容']"
    width="700px"
  >
    <Form :model="record">
      <Row gutter="24">
        <Col span="12">
          <FormItem label="学生年级">
            <Select v-model:value="record.mainGradeId" @change="onMainGradeChange">
              <SelectOption :value="1">幼儿</SelectOption>
              <SelectOption :value="3">小学</SelectOption>
              <SelectOption :value="4">初中</SelectOption>
              <SelectOption :value="5">高中</SelectOption>
              <SelectOption :value="6">成人</SelectOption>
            </Select>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem>
            <Select v-model:value="record.gradeId">
              <SelectOption v-for="item in subGrades" :key="item.value" :value="item.value">
                {{ item.label }}
              </SelectOption>
            </Select>
          </FormItem>
        </Col>
      </Row>

      <FormItem label="学生性别">
        <RadioGroup v-model:value="record.studentGender">
          <Radio :value="1">男</Radio>
          <Radio :value="2">女</Radio>
        </RadioGroup>
      </FormItem>

      <Row gutter="24">
        <Col span="12">
          <FormItem label="辅导科目">
            <Select v-model:value="record.subjectId" :options="teachingSubjectOptions">
              <!-- <SelectOption value="9">英语</SelectOption> -->
              <!-- 其他选项 -->
            </Select>
          </FormItem>
        </Col>
      </Row>

      <FormItem label="学生情况">
        <Textarea v-model:value="record.studentInfo" :rows="4" />
      </FormItem>

      <Row gutter="24">
        <Col span="12">
          <FormItem label="辅导次数">
            <Select v-model:value="record.fudaoCishu">
              <SelectOption value="一周1次">一周1次</SelectOption>
              <SelectOption value="一周2次">一周2次</SelectOption>
              <SelectOption value="一周3次">一周3次</SelectOption>
              <SelectOption value="一周4次">一周4次</SelectOption>
              <SelectOption value="一周5次">一周5次</SelectOption>
              <!-- 其他选项 -->
            </Select>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="辅导时长">
            <Select v-model:value="record.fudaoShichang">
              <SelectOption value="1小时/次">1小时/次</SelectOption>
              <SelectOption value="1.5小时/次<">1.5小时/次</SelectOption>
              <SelectOption value="2小时/次">2小时/次</SelectOption>
              <SelectOption value="2.5小时/次">2.5小时/次</SelectOption>
              <SelectOption value="3小时/次">3小时/次</SelectOption>
              <!-- 其他选项 -->
            </Select>
          </FormItem>
        </Col>
      </Row>

      <Row gutter="24">
        <Col span="12">
          <FormItem label="时薪 最低:">
            <InputNumber v-model:value="record.minSalary" />
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="最高:">
            <InputNumber v-model:value="record.maxSalary" />
          </FormItem>
        </Col>
      </Row>
      <FormItem label="授课时间段">
        <Textarea v-model:value="record.teachingTimes" />
      </FormItem>

      <!-- <FormItem label="教师类型"> -->
      <!-- <Select v-model:value="record.teacherType" :options="teachingIdtOptions"> -->
      <!-- <SelectOption value="1">在校大学生</SelectOption> -->
      <!-- 其他选项 -->
      <!-- </Select> -->
      <!-- </FormItem> -->
      <Row gutter="24">
        <Col span="8">
          <FormItem label="教师类型">
            <Select v-model:value="selectedLevel1" @change="onLevel1Change">
              <SelectOption v-for="item in level1Options" :key="item.idtId" :value="item.idtId">
                {{ item.idtName }}
              </SelectOption>
            </Select>
          </FormItem>
        </Col>
        <!--  -->
        <Col span="8">
          <FormItem>
            <Select
              v-model:value="selectedLevel2"
              @change="onLevel2Change"
              :disabled="!level2Options.length"
            >
              <SelectOption v-for="item in level2Options" :key="item.idtId" :value="item.idtId">
                {{ item.idtName }}
              </SelectOption>
            </Select>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem>
            <Select v-model:value="selectedLevel3" :disabled="!level3Options.length">
              <SelectOption v-for="item in level3Options" :key="item.idtId" :value="item.idtId">
                {{ item.idtName }}
              </SelectOption>
            </Select>
          </FormItem>
        </Col>
      </Row>

      <FormItem label="教师性别">
        <RadioGroup v-model:value="record.teacherGender">
          <Radio :value="0">不限</Radio>
          <Radio :value="1">男</Radio>
          <Radio :value="2">女</Radio>
        </RadioGroup>
      </FormItem>

      <FormItem label="对教师的要求">
        <Textarea v-model:value="record.teacherDemandDescribe" :rows="4" />
      </FormItem>
      <Row gutter="24">
        <Col span="12">
          <FormItem label="联系人">
            <Input v-model:value="record.contact" />
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="联系电话">
            <Input v-model:value="record.contactPhone" />
          </FormItem>
        </Col>
      </Row>
      <FormItem label="授课方式">
        <RadioGroup v-model:value="record.teachingMethod">
          <Radio :value="1">线上授课</Radio>
          <Radio :value="2">上门授课</Radio>
        </RadioGroup>
      </FormItem>

      <FormItem label="授课地址">
        <Input v-model:value="record.teachingAddress" />
      </FormItem>
    </Form>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref, watch, defineEmits, onMounted } from 'vue';
  import {
    Form,
    FormItem,
    Select,
    SelectOption,
    RadioGroup,
    Radio,
    Input,
    InputNumber,
    Row,
    Col,
    Textarea,
    message,
  } from 'ant-design-vue';
  import { useModalInner, BasicModal } from '@/components/Modal';
  import { teachingSubjectOptions, teachingIdtOptions } from './data';
  import axios from 'axios';
  import { useUserStore } from '@/store/modules/user';

  const emit = defineEmits(['confirm']);

  const record: Recordable = ref({});

  const [registerModal] = useModalInner((data) => {
    if (data && data.data) {
      record.value = data.data;
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
