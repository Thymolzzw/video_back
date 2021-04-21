<template>
  <el-form>
    <el-form-item label="Account name">
      <el-input v-model.trim="user.user_info.account_name" />
    </el-form-item>
    <el-form-item label="Account password">
      <el-input v-model="password" />
    </el-form-item>
    <el-form-item label="Real name">
      <el-input v-model.trim="user.user_info.name" />
    </el-form-item>
    <el-form-item label="Email">
      <el-input v-model.trim="user.user_info.email" />
    </el-form-item>
    <el-form-item label="Introduce">
      <el-input type="textarea" v-model.trim="user.user_info.introduce" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit(user.user_info.id,
      user.user_info.account_name,
      user.user_info.name,
      user.user_info.introduce,
      user.user_info.email)">更新</el-button>
    </el-form-item>

  </el-form>
</template>

<script>
import axios from "axios";
import store from "@/store";

export default {
  data(){
    return{
      password: ''
    }
  },
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: '',
          email: '',
          avatar: '',
          role: '',
          user_info: {},
        }
      }
    }
  },
  methods: {
    submit(user_id, user_account_name, user_real_name, user_introduce, user_email) {
      // alert("ok")
      let param = new FormData()
      param.append('user_id', user_id)
      // alert(user_id)
      param.append('user_account_name', user_account_name)
      // alert(user_account_name)
      param.append('user_password', this.password)
      // alert(user_password)
      param.append('user_real_name', user_real_name)
      param.append('user_introduce', user_introduce)
      param.append('user_email', user_email)
      axios({
        method: 'post',
        url: process.env.VUE_APP_severURL + '/editUserInfo',
        contentType: 'application/x-www-form-urlencoded',
        data: param,

      }).then(resp => {
        if(resp.data.code === 20000){
          store.dispatch('user/getInfo')
          this.$message({
            message: '用户信息修改成功！',
            type: 'success',
            duration: 3 * 1000
          })
        }else{
          this.$message({
            message: '用户信息修改失败！',
            type: 'danger',
            duration: 3 * 1000
          })
        }
      })


    }
  }
}
</script>
