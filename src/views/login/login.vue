<template>
  <div class="login-container">
    <el-form ref="refLoginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">
      <div class="title-container">
        <h3 class="title">Login Form</h3>
      </div>

      <el-form-item prop="accountName">
        <el-input v-model="loginForm.accountName" placeholder="帐号名称" name="accountName" type="text" tabindex="1" autocomplete="on" />
      </el-form-item>

      <el-form-item prop="accountPassword">
        <el-input v-model="loginForm.accountPassword" placeholder="帐号密码" name="accountPassword" tabindex="2" autocomplete="on" />
      </el-form-item>
      <el-form-item prop="email">
        <el-input v-model="loginForm.email" placeholder="邮箱" name="accountemail" tabindex="2" autocomplete="on" />
      </el-form-item>
      <el-form-item prop="phone">
        <el-input v-model="loginForm.phone" placeholder="电话" name="phone" tabindex="2" autocomplete="on" />
      </el-form-item>
      <el-form-item prop="roleId">
        <el-input v-model="loginForm.roleId" placeholder="角色Id" name="roleId" tabindex="2" autocomplete="on" />
      </el-form-item>
      <el-button :loading="loading" type="primary" size="large" style="width: 100%; margin-bottom: 30px" @click.prevent="handleLogin">Login</el-button>
    </el-form>
  </div>
</template>

<script setup>
import { nextTick, onMounted, reactive, toRefs } from "vue";
import { useUserStore } from "~/store/user";
import { useRouter, useRoute } from "vue-router";
import API from "~/api/account";

const router = useRouter();
const route = useRoute();

const validateaccountName = (rule, value, callback) => {
  if (!value) {
    callback(new Error("Please enter the correct user name"));
  } else {
    callback();
  }
};

const validateaccountPassword = (rule, value, callback) => {
  if (value.length < 6) {
    callback(new Error("The accountPassword can not be less than 6 digits"));
  } else {
    callback();
  }
};
const validateEmail = (rule, value, callback) => {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!value) {
    callback(new Error("Please enter your email address"));
  } else if (!emailPattern.test(value)) {
    callback(new Error("Please enter a valid email address"));
  } else {
    callback();
  }
};

const validatePhone = (rule, value, callback) => {
  const phonePattern = /^[1][3-9][0-9]{9}$/;
  if (!value) {
    callback(new Error("Please enter your phone number"));
  } else if (!phonePattern.test(value)) {
    callback(new Error("Please enter a valid phone number"));
  } else {
    callback();
  }
};

const state = reactive({
  refLoginForm: null,
  loginForm: {
    accountName: "4pd2",
    accountPassword: "4pdadmin",
    email: "",
    phone: "",
    roleId: 0,
  },
  loginRules: {
    // accountName: [
    //   { required: true, trigger: "blur", validator: validateaccountName },
    // ],
    // accountPassword: [
    //   { required: true, trigger: "blur", validator: validateaccountPassword },
    // ],
    // email: [{  trigger: "blur", validator: validateEmail }],
    // phone: [{  trigger: "blur", validator: validatePhone }],
    // roleId: [
    //   {  trigger: "blur", message: "Please enter the role ID" },
    // ],
  },
  loading: false,
});
const {
  refLoginForm,
  loginForm,
  loginRules,
  loading
} = toRefs(state)
const handleLogin = () => {
  state.refLoginForm.validate(async (valid) => {
    if (valid) {
      try {
        state.loading = true;

        const userStore = useUserStore();

        const { token, id, accountName } = await API.login(state.loginForm);

        userStore.setToken({ token });

        userStore.setUserInfo({ userInfo: { id, accountName } });

        state.loading = false;

        router.push();
      } catch (error) {
        state.loading = false;
      }
    } else {
      return false;
    }
  });
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    flex: 1;
    display: inline-block;
    height: 47px;

    .el-input__wrapper {
      width: 100%;
      padding: 0;
      background-color: transparent;
      box-shadow: none;

      input {
        background: transparent;
        border: 0px;
        appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;
        caret-color: $cursor;

        &:-webkit-autofill {
          box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    box-sizing: border-box;
    margin: 0 auto;
    overflow: hidden;
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
}
</style>
