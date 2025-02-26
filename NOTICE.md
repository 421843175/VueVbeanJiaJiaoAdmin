# 页面组件
E:\JU\jupiterPC\frontQianDuan\work\vbean-restructure\vuebeanhelloboot\front\helio-admin-vue-vben-main
\src\views\dashboard\analysis

# 页面请求
src\view\……\index.vue 中 导入的api
例如
```
  //TODO:NOTICE apis的配置
  import { deleteSysTenantApi, listSysTenantApi } from '@/api/sys/SysTenantApi';

```
例如teacherApi的路径
src\api\teacher\TeacherApi.ts


# 关于vbenadmin使用的组件
Ant Design Vue  表格也是这个 
https://www.antdv.com/components/table-cn


## 标签与开关
```
    customRender: ({ record }) => {
      const value = record.status;
      let color, text;

      switch (value) {
        case 0:
          color = 'red';
          text = '禁用';
          break;
        case 1:
          color = 'green';
          text = '启用';
          break;
      }
      return h(Tag, { color: color }, () => text);
    },
  ```


  ## 绑定数据的获取很容易
  ```
  <template>
  <BasicDrawer v-bind="$attrs" @register="registerDrawer" title="查看详情" width="40%">
    <PageWrapper :title="ceshi" contentBackground headerSticky>

    </PageWrapper> 
  </BasicDrawer>
</template>
<script lang="ts" setup>

  const ceshi="测试"
  </script>
```

node V18

打包 pnpm vite build