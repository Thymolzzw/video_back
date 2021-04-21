<template>
  <div class="login-container">
    <div class="title-container" style="margin-top: 110px">
      <h3 class="title">视音频数据智能分析原型系统</h3>
    </div>

    <el-tabs style="width: 500px; margin-left: calc(50% - 250px); background-color: #2d3a4b; border-color: #2d3a4b; margin-top: 50px" type="border-card" v-model="activeTab" stretch="true">

      <el-tab-pane style="border-color: #2d3a4b" label="登录" name="login">

        <el-form style="background-color: #2d3a4b; margin-top: -110px" ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">

          <el-form-item prop="username">
            <span class="svg-container">
              <svg-icon icon-class="user"/>
            </span>
            <el-input
              ref="username"
              v-model="loginForm.username"
              placeholder="账户名"
              name="username"
              type="text"
              tabindex="1"
              autocomplete="on"
            />
          </el-form-item>

          <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
            <el-form-item prop="password">
              <span class="svg-container">
                <svg-icon icon-class="password" />
              </span>
              <el-input
                :key="passwordType"
                ref="password"
                v-model="loginForm.password"
                :type="passwordType"
                placeholder="密码"
                name="password"
                tabindex="2"
                autocomplete="on"
                @keyup.native="checkCapslock"
                @blur="capsTooltip = false"
                @keyup.enter.native="handleLogin"
              />
              <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
            </el-form-item>
          </el-tooltip>

          <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登录</el-button>

        </el-form>

      </el-tab-pane>


      <el-tab-pane label="注册" name="register">

                <el-form style="margin-top: -110px" ref="registerForm" :model="registerForm" :rules="registerRules" class="login-form" autocomplete="on" label-position="left">
                  <el-form-item prop="register_account_name">
                    <span class="svg-container">
                      <svg-icon icon-class="user"/>
                    </span>
                    <el-input
                      v-model="registerForm.register_account_name"
                      placeholder="账户名"
                      name="register_account_name"
                      ref="register_account_name"
                      type="text"
                      tabindex="1"
                      autocomplete="on"
                    />
                  </el-form-item>

                  <el-form-item prop="register_password">
                    <span class="svg-container">
                      <svg-icon icon-class="password"/>
                    </span>
                    <el-input
                      v-model="registerForm.register_password"
                      placeholder="密码"
                      name="register_password"
                      ref="register_password"
                      type="text"
                      tabindex="2"
                      autocomplete="on"
                    />
                  </el-form-item>

                  <el-form-item prop="register_email">
                    <span class="svg-container">
                      <svg-icon icon-class="email"/>
                    </span>
                    <el-input
                      v-model="registerForm.register_email"
                      placeholder="邮箱"
                      name="register_email"
                      ref="register_email"
                      type="text"
                      tabindex="3"
                      autocomplete="on"
                    />
                  </el-form-item>

                  <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleRegister">注册</el-button>

                </el-form>
      </el-tab-pane>
    </el-tabs>

    <el-dialog title="Or connect with" :visible.sync="showDialog">
      Can not be simulated on local, so please combine you own business simulation! ! !
      <br>
      <br>
      <br>
      <social-sign />
    </el-dialog>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import axios from "axios";

export default {
  name: 'Login',
  components: {  },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length <= 2) {
        callback(new Error('用户名应大于2位，请检查您的用户名。'))
      }else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 3) {
        callback(new Error('密码长度不能小于3位！'))
      }else {
        callback()
      }
    }
    const validateEmail = (rule, value, callback) => {
      if(value.length !== 0) {
        if(!this.isEmail(value)){
          callback(new Error('邮箱格式不正确！'))
        }else {
          callback()
        }
      }else {
        callback()
      }
    }

    return {
      activeTab: 'login',
      loginForm: {
        username: '',
        password: '',
      },
      registerForm: {
        register_account_name: '',
        register_password: '',
        register_email: '',
      },
      registerRules:{
        register_account_name: [{ required: true, trigger: 'blur', validator: validateUsername }],
        register_password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        register_email: [{ required: false, trigger: 'blur', validator: validateEmail }]
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {}
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          // alert("this.redirect" + this.redirect)
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    isEmail(s) {
      return /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(s)
    },
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },

    handleRegister(){
      // alert("zuce")
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/register', this.registerForm)
            .then(() => {
              this.$router.push({ path: '/' })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('错误的提交')
          return false
        }
      })
    },
    handleLogin() {
      // const this_this = this
      // alert("login")
      this.$refs.loginForm.validate(valid => {
        // alert("jinru")
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm)
            .then(() => {
              // alert(this.redirect)
              // this.$router.push({ path: this.redirect || '/' })
              this.$router.push({ path: '/' })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('错误的提交')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
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

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

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
    margin: 0 auto;
    overflow: hidden;
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

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
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

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>

<style scoped>
/deep/ .el-tabs--border-card > .el-tabs__header{
  color: #00FF00;
  background: #2d3a4b;
}
</style>
