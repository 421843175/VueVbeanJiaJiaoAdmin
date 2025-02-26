<template>
  <BasicModal
    v-bind="$attrs"
    :min-height="100"
    title="重置密码确认"
    destroyOnClose
    @register="register"
    @ok="handleOk"
  >
    <Alert :message="`是否确认为【${username}】重置密码？`" style="margin-bottom: 20px" />
    修改密码: <Input v-model:value="password" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { Alert, notification, Input } from 'ant-design-vue';
  import { resetSysUserPasswordApi } from '@/api/sys/SysUserApi';

  const password = ref<string>('123456');
  const username = ref<string>(),
    userId = ref<string>();
  const [register, { closeModal }] = useModalInner((data) => {
    // 接收列表页透传的参数
    username.value = data.record.username;
    userId.value = data.record.id;
  });

  function randomString(length) {
    length = length || 32;
    const str = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678',
      a = str.length;
    let ret = '';
    for (let i = 0; i < length; i++) {
      ret += str.charAt(Math.floor(Math.random() * a));
    }

    return ret;
  }

  async function handleOk() {
    if (userId.value == null) {
      notification.error({
        message: '重置失败',
        description: '选中用户ID无效',
        duration: 3,
      });
      return;
    }

    // const randomPassword = randomString(20);

    await resetSysUserPasswordApi(userId.value, password.value + '');

    notification.success({
      message: '重置成功',
      description: '新密码：' + password.value,
      duration: 10,
    });
    closeModal();
  }
</script>
