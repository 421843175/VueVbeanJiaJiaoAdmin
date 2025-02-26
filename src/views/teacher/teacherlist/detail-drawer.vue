<template>
  <BasicDrawer v-bind="$attrs" @register="registerDrawer" title="查看详情" :isDetail="true">
    <!-- TODO:NOTICE 传值(3) 展示到模板方式(2) -->
    <TypographyTitle :level="3"
      >{{ computedTitle }}
      <span style="font-weight: normal !important">(ID:{{ record.tsn }})</span>
      <!-- <Tag :color="tagColor">{{ tagText }}</Tag> -->

      <!-- 简化的写法  -->
      <Tag :color="tagInfo.color" style="margin-left: 1%">{{ tagInfo.text }}</Tag>

      <span style="margin-right: 15%; float: right">
        <Button type="primary" @click="copyResume">复制简历</Button>
      </span>
    </TypographyTitle>
    <Descriptions size="middle" :column="3">
      <Descriptions.Item label="简历设置状态">{{
        record.resumeStatus === 0 ? '开启' : '关闭'
      }}</Descriptions.Item>
      <Descriptions.Item label="是否推荐">{{
        record.isIndex === 1 ? '默认' : '推荐上首页'
      }}</Descriptions.Item>
      <Descriptions.Item label="授课方式">{{
        record.teachingMethod === 0
          ? '不限制'
          : record.teachingMethod == 1
            ? '线上授课'
            : '上门授课'
      }}</Descriptions.Item>
      <Descriptions.Item label="授课区域">{{ record.teachingCitys || '未填写' }}</Descriptions.Item>
      <Descriptions.Item label="授课费用">{{ record.teachingFee }}</Descriptions.Item>
    </Descriptions>

    <Descriptions size="middle" :column="2">
      <Descriptions.Item label="联系方式">{{ record.mobilePhone }}</Descriptions.Item>
      <Descriptions.Item label="邮箱">{{ record.email }}</Descriptions.Item>
    </Descriptions>
    <div style="width: 100%; height: 30%; background-color: rgb(245 245 245)">&nbsp;</div>

    <Tabs default-active-key="1">
      <Tabs.TabPane key="1" tab="基本信息">
        <div class="pt-4 m-4 desc-wrap">
          <!-- 列数改成三列 -->
          <Descriptions size="middle" :column="3">
            <Descriptions.Item label="头像">
              <!-- <Avatar @click="createImgPreview({imageList:[globalURL+record.realAvatar]})" :src="(globalURL+record.realAvatar) || 'https://www.antdv.com/assets/logo.1ef800a8.svg'" />  -->
              <Image
                :src="
                  globalURL + record.realAvatar || 'https://www.antdv.com/assets/logo.1ef800a8.svg'
                "
                :height="50"
                :width="50"
              />
            </Descriptions.Item>
            <!-- TODO:NOTICE 传值(3) 展示到模板 -->
            <Descriptions.Item label="姓名">{{ record.realName }}</Descriptions.Item>
            <Descriptions.Item label="性别">{{
              record.gender === 1 ? '男' : '女'
            }}</Descriptions.Item>

            <Descriptions.Item label="出生">{{
              record.birthDate
                ? new Date(record.birthDate * 1000).toLocaleDateString('zh-CN', {
                    year: 'numeric',
                    month: 'long',
                    // day: 'numeric',
                  })
                : '无'
            }}</Descriptions.Item>
            <Descriptions.Item label="籍贯">{{ record.nativePlace }}</Descriptions.Item>
            <Descriptions.Item label="类型">{{ record.idtstr }}</Descriptions.Item>

            <Descriptions.Item label="教龄">{{ record.teachingLen }}年</Descriptions.Item>
            <Descriptions.Item label="学校">{{ record.uniName }}</Descriptions.Item>
            <Descriptions.Item label="专业">{{ record.major }}</Descriptions.Item>
          </Descriptions>

          <Descriptions size="middle" :column="1">
            <Descriptions.Item label="教学优势">{{ record.tag }}</Descriptions.Item>
            <Descriptions.Item label="自我介绍">{{ record.selfIntro }}</Descriptions.Item>
            <!-- TODO:TODO 补充 -->
            <br />
            <Descriptions.Item label="教学经历">
              <Timeline>
                <div v-for="(exp, index) in elegant" :key="index">
                  <TimelineItem>
                    <div v-if="exp.wrokSubject">
                      <strong>工作内容: </strong>{{ exp.wrokSubject }}<br />
                    </div>
                    <div v-if="exp.wrokDate && exp.wrokDate.length === 2">
                      <strong>时间: </strong>{{ exp.wrokDate[0] }} - {{ exp.wrokDate[1] }}<br />
                    </div>
                    <div v-if="exp.workAddress">
                      <strong>地点: </strong>{{ exp.workAddress }}<br />
                    </div>
                    <div v-if="exp.workContent">
                      <strong>详情: </strong>{{ exp.workContent }}<br />
                    </div>
                    <br />
                  </TimelineItem>
                </div>
              </Timeline>
            </Descriptions.Item>
          </Descriptions>

          <Descriptions size="middle" :column="2">
            <!-- <Descriptions.Item label="照片展示">{{ record.birth }}</Descriptions.Item> -->
            <Descriptions.Item label="教学风采">
              <ImagePreviewGroup>
                <span style="margin-left: 1%" v-for="(item, index) in splitdou(record.fengcaiUrls)">
                  <Image :width="80" :height="80" :src="globalURL + item" />
                </span>
              </ImagePreviewGroup>
            </Descriptions.Item>

            <!-- 走马灯不能放到表格列里面 -->
            <!-- <Carousel arrows  dots-class="slick-dots slick-thumb" >
                  <template #customPaging="props">
                    <a>
                      <img :src="getImgUrl(props.i)" />
                    </a>
                 </template>
                <div v-for="(item, index) in splitdou(record.fengcaiUrls)" :key="index" >
                  <img :src="globalURL+item" :width="100"   />
                </div>
              </Carousel> -->

            <Descriptions.Item label="视频展示">
              <video width="320" height="240" controls>
                <source :src="globalURL + record.vcrUrl" type="video/mp4" />
                您的浏览器不支持 video 标签。
              </video>
            </Descriptions.Item>
          </Descriptions>
        </div>
      </Tabs.TabPane>

      <!-- <Tabs.TabPane key="2" tab="授课信息"> -->
      <!-- <div class="pt-4 m-4 desc-wrap"> -->
      <!-- <Descriptions size="middle" :column="1">
              <Descriptions.Item label="简历设置状态">{{ record.resumeStatus === 0 ? '开启' :'关闭'  }}</Descriptions.Item>
              <Descriptions.Item label="是否推荐">{{ record.isIndex === 0 ? '默认' :'推荐上首页'  }}</Descriptions.Item>
              <Descriptions.Item label="授课方式">{{ record.teachingMethod === 0 ? '不限制' :(record.teachingMethod==1?'线上授课':'上门授课')  }}</Descriptions.Item>
              <Descriptions.Item label="授课区域">{{ record.teachingCitys||"未填写"  }}</Descriptions.Item>
              <Descriptions.Item label="授课费用">{{ record.teachingFee  }}</Descriptions.Item>

            </Descriptions> -->
      <!-- </div> -->
      <!-- </Tabs.TabPane> -->

      <!--  认证信息 -->
      <Tabs.TabPane key="2" tab="认证信息">
        <div class="pt-4 m-4 desc-wrap">
          <!-- //TODO:NOTICE 组件间通信(1) -->
          <RenZheng :record="record" />
          <Button type="primary" @click="submit">提交</Button>
        </div>
      </Tabs.TabPane>
    </Tabs>
  </BasicDrawer>
</template>

<script lang="ts" setup>
  // //TODO:NOTICE VUE3计算属性的写法(1)引入computed
  import { computed, ref, watch } from 'vue';
  import { BasicDrawer, useDrawerInner } from '@/components/Drawer';
  // import { PageWrapper } from '@/components/Page';
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

  import { updateApi } from '@/api/teacher/TeacherApi';
  import RenZheng from './RenZheng.vue';

  // import { createImgPreview } from '@/components/Preview/index';

  //TODO:NOTICE VUE3使用emit的方式
  import { defineEmits } from 'vue';

  const emit = defineEmits(['confirm']);

  //TODO:NOTICE 响应式变量（1）定义
  const record = ref({});

  //随便写的变量可以当做data用
  const globalURL = import.meta.env.VITE_GLOB_Online_URL;

  //这段代码使用了 Vue 3 的 Composition API，并在 useDrawerInner 函数中注册了一个回调函数来处理传递过来的数据。

  const [registerDrawer] = useDrawerInner((data) => {
    // 注册抽屉组件，并定义一个回调函数，当抽屉打开时会调用这个函数，并传递数据进来

    if (data && data.data) {
      // 检查传入的数据对象是否存在，并且是否包含 data 属性

      //TODO:NOTICE 响应式变量（2） 使用
      record.value = data.data;
      // 如果条件成立，将 data.data 的值赋给 record
      //TODO:TIP record 是一个 ref 响应式对象，通过 .value 访问和修改其值
      // 这一步确保了传入的数据被正确地存储到 record 中，以便在模板中使用
    }

    console.log('record:', record);
  });

  watch(record, (newRecord) => {
    console.log('record updated:', newRecord);
  });
  //TODO:NOTICE VUE3计算属性的写法(2)
  const computedTitle = computed(() => {
    return `老师姓名: ${record.value.realName || ''}`;
  });

  const elegant = computed(() => {
    try {
      // 解析 JSON
      let teachingExp = JSON.parse(record.value.teachingExp);

      // 排序，按照 wrokDate 的结束日期降序排列
      teachingExp.sort((a, b) => {
        // 将日期字符串转换为时间戳进行比较
        const endDateA = new Date(a.wrokDate[1]).getTime();
        const endDateB = new Date(b.wrokDate[1]).getTime();
        return endDateB - endDateA;
      });

      return teachingExp;
    } catch (e) {
      console.error('Invalid JSON in record.teachingExp:', e);
      return [];
    }
  });

  function splitdou(item) {
    if (item) {
      console.log('好好好:', item);
      return item.split(',');
    }
  }

  // const tagColor = computed(() => {
  //       return {
  //         0: 'red',
  //         1: 'green',
  //         2: 'gray',
  //       }[record.value.status] || 'default-color';
  //     });
  //     const tagText = computed(() => {
  //       return {
  //         0: '待审核',
  //         1: '已通过',
  //         2: '已拒绝',
  //       }[record.value.status] || '未知状态';
  //     });

  //简化的写法
  const tagInfo = {
    colors: ['red', 'green', 'gray'],
    texts: ['待审核', '已通过', '已拒绝'],
    get color() {
      return this.colors[Math.min(record.value.status, this.colors.length - 1)] || 'default-color';
    },
    get text() {
      return this.texts[Math.min(record.value.status, this.texts.length - 1)] || '未知状态';
    },
  };

  function copyResume() {
    const resumeText = `
姓名：${record.value.realName}
性别：${record.value.gender === 1 ? '男' : '女'}
出生：${new Date(record.value.birthDate * 1000).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      // day: 'numeric',
    })}
籍贯：${record.value.nativePlace}
类型：${record.value.idtstr}
学校：${record.value.uniName}
专业：${record.value.major}
教龄：${record.value.teachingLen}年
自我介绍：
${record.value.selfIntro}

教学经历：
${elegant.value
  .map(
    (exp) =>
      `    工作内容：${exp.wrokSubject}
    时间：${exp.wrokDate[0]} - ${exp.wrokDate[1]}
    地点：${exp.workAddress}
    详情：${exp.workContent}`,
  )
  .join('\n\n')}
`;

    // 复制到剪贴板
    copyToClipboard(resumeText)
      .then(() => message.success('简历已经成功复制到剪贴板'))
      .catch((err) => message.error('复制失败'));
  }

  function copyToClipboard(textToCopy) {
    console.log('走了');
    // navigator clipboard 需要https等安全上下文
    if (navigator.clipboard && window.isSecureContext) {
      // navigator clipboard 向剪贴板写文本
      return navigator.clipboard.writeText(textToCopy);
    } else {
      // 创建text area
      let textArea = document.createElement('textarea');
      textArea.value = textToCopy;
      // 使text area不在viewport，同时设置不可见
      textArea.style.position = 'absolute';
      textArea.style.opacity = '0';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      return new Promise((res, rej) => {
        // 执行复制命令并移除文本框
        document.execCommand('copy') ? res() : rej();
        textArea.remove();
      });
    }
  }

  function getImgUrl(index) {
    return globalURL + splitdou(record.value.fengcaiUrls)[index];
  }

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

    // TODO:NOTICE 触发父组件的 confirm 事件
    emit('confirm');
  }
</script>

<style>
  /* For demo */
  :deep(.slick-dots) {
    position: relative;
    height: auto;
  }

  :deep(.slick-slide img) {
    display: block;
    max-width: 80%;
    margin: auto;
    border: 5px solid #fff;
  }

  :deep(.slick-arrow) {
    display: none !important;
  }

  :deep(.slick-thumb) {
    bottom: 0;
  }

  :deep(.slick-thumb li) {
    width: 60px;
    height: 45px;
  }

  :deep(.slick-thumb li img) {
    display: block;
    width: 100%;
    height: 100%;
    filter: grayscale(100%);
  }

  :deep .slick-thumb li.slick-active img {
    filter: grayscale(0%);
  }
</style>
