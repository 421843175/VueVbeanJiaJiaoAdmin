<template>
  <LoginFormTitle v-show="getShow" class="enter-x" />
  <Form
    class="p-4 enter-x"
    :model="formData"
    :rules="getFormRules"
    ref="formRef"
    v-show="getShow"
    @keypress.enter="handleLogin"
  >
    <FormItem name="account" class="enter-x">
      <Input
        size="large"
        v-model:value="formData.account"
        :placeholder="t('sys.login.userName')"
        class="fix-auto-fill"
      />
    </FormItem>
    <FormItem name="password" class="enter-x">
      <InputPassword
        size="large"
        visibilityToggle
        v-model:value="formData.password"
        :placeholder="t('sys.login.password')"
      />
    </FormItem>

    <FormItem name="captcha" v-if="usingCaptcha">
      <ARow :gutter="8">
        <ACol :span="17">
          <Input v-model:value="captchaState.captchaAnswer" />
        </ACol>
        <ACol :span="7">
          <AImage
            :preview="false"
            width="196"
            height="50"
            v-model:src="captchaState.captchaImage"
            @click="fetchCaptcha"
          />
        </ACol>
      </ARow>
    </FormItem>

    <ARow class="enter-x">
      <ACol :span="12">
        <FormItem>
          <!-- No logic, you need to deal with it yourself -->
          <Checkbox v-model:checked="rememberMe" size="small">
            {{ t('sys.login.rememberMe') }}
          </Checkbox>
        </FormItem>
      </ACol>
      <ACol :span="12">
        <FormItem :style="{ 'text-align': 'right' }">
          <!-- No logic, you need to deal with it yourself -->
          <Button type="link" size="small" @click="setLoginState(LoginStateEnum.RESET_PASSWORD)">
            {{ t('sys.login.forgetPassword') }}
          </Button>
        </FormItem>
      </ACol>
    </ARow>

    <FormItem class="enter-x">
      <Button type="primary" size="large" block @click="handleLogin" :loading="loading">
        {{ t('sys.login.loginButton') }}
      </Button>
      <!-- <Button size="large" class="mt-4 enter-x" block @click="handleRegister">
        {{ t('sys.login.registerButton') }}
      </Button> -->
    </FormItem>
    <ARow class="enter-x" :gutter="[16, 16]">
      <!-- 手机登录 -->
      <!-- <ACol :md="8" :xs="24">
        <Button block @click="setLoginState(LoginStateEnum.MOBILE)">
          {{ t('sys.login.mobileSignInFormTitle') }}
        </Button>
      </ACol> -->
      <!-- <ACol :md="8" :xs="24">
        <Button block @click="setLoginState(LoginStateEnum.QR_CODE)">
          {{ t('sys.login.qrSignInFormTitle') }}
        </Button>
      </ACol> -->
      <ACol :md="24" :xs="24">
        <Button block @click="setLoginState(LoginStateEnum.REGISTER)">
          {{ t('sys.login.registerButton') }}
        </Button>
      </ACol>
    </ARow>

    <!-- <Divider class="enter-x">{{ t('sys.login.otherSignIn') }}</Divider> -->

    <!-- <div class="flex justify-evenly enter-x" :class="`${prefixCls}-sign-in-way`">
      <GithubFilled />
      <WechatFilled />
      <AlipayCircleFilled />
      <GoogleCircleFilled />
      <TwitterCircleFilled />
    </div> -->
  </Form>
</template>
<script lang="ts" setup>
  import { reactive, ref, unref, computed, onMounted } from 'vue';

  import { Checkbox, Form, Input, Row, Col, Button, Divider, Image } from 'ant-design-vue';
  import {
    GithubFilled,
    WechatFilled,
    AlipayCircleFilled,
    GoogleCircleFilled,
    TwitterCircleFilled,
  } from '@ant-design/icons-vue';
  import LoginFormTitle from './LoginFormTitle.vue';

  import { useI18n } from '@/hooks/web/useI18n';
  import { useMessage } from '@/hooks/web/useMessage';

  import { useUserStore } from '@/store/modules/user';
  import { LoginStateEnum, useLoginState, useFormRules, useFormValid } from './useLogin';
  import { useDesign } from '@/hooks/web/useDesign';
  import { CaptchaResultModel } from '@/api/sys/model/userModel';
  import { fetchCaptchaApi } from '@/api/sys/user';
  import { isEmpty } from '@/utils/is';
  //import { onKeyStroke } from '@vueuse/core';

  const ACol = Col;
  const ARow = Row;
  const AImage = Image;
  const FormItem = Form.Item;
  const InputPassword = Input.Password;
  const { t } = useI18n();
  const { notification, createErrorModal } = useMessage();
  const { prefixCls } = useDesign('login');
  const userStore = useUserStore();

  const { setLoginState, getLoginState } = useLoginState();
  const { getFormRules } = useFormRules();

  const formRef = ref();
  const loading = ref(false);

  // Helio: 增加"记住我"参数
  const rememberMe = ref(false);

  // Helio: 登录验证码（可选，默认不启用）
  const usingCaptcha = ref(false);
  const captchaState = reactive<any & CaptchaResultModel>({
    captchaAnswer: null,
    isFetching: false,
  });
  const fetchCaptcha = async () => {
    if (unref(usingCaptcha)) {
      // 启用了登录验证码
      if (captchaState.isFetching) {
        // 节流
        return;
      }
      captchaState.isFetching = true;
      const captchaInfo = await fetchCaptchaApi();
      Object.assign(captchaState, captchaInfo);
      captchaState.captchaAnswer = null;
      captchaState.isFetching = false;
    }
  };
  const validateCaptchaInput = () => {
    if (unref(usingCaptcha)) {
      // 启用了登录验证码
      if (isEmpty(captchaState.captchaAnswer)) {
        notification.error({
          message: '错误',
          description: '请输入验证码',
          duration: 2,
        });
        return false;
      }
    }
    return true;
  };

  const formData = reactive({
    // Helio: 默认账号密码修改为 `admin`
    account: 'admin',
    password: 'admin',
  });

  const { validForm } = useFormValid(formRef);

  //onKeyStroke('Enter', handleLogin);

  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.LOGIN);

  async function handleLogin() {
    const data = await validForm();
    if (!data) return;
    if (!validateCaptchaInput()) return;
    try {
      loading.value = true;
      const userInfo = await userStore.login({
        password: data.password,
        username: data.account,
        mode: 'none', //不要默认的错误提示
        // Helio: 增加"记住我"参数
        rememberMe: rememberMe.value,
        // Helio: 登录验证码（可选）
        captchaId: captchaState.captchaId,
        captchaAnswer: captchaState.captchaAnswer,
      });
      if (userInfo) {
        notification.success({
          message: t('sys.login.loginSuccessTitle'),
          description: `${t('sys.login.loginSuccessDesc')}: ${userInfo.nickname}`,
          duration: 3,
        });
      }
      // Helio: 去除默认的 catch 代码块，由默认请求异常处理接管
    } finally {
      loading.value = false;
      fetchCaptcha();
    }
  }

  onMounted(() => {
    fetchCaptcha();
  });
</script>
