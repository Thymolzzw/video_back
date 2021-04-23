<template>
  <div id="user">
<!--    <el-input style="width: 20%" v-model="search_text"></el-input>-->
<!--    <el-button type="primary" @click="searchUser()">搜索</el-button>-->
    <el-button style="margin-left: 71vh; width: 15vh; margin-top: 10px" type="primary" @click="addUserVisible = true">添加用户</el-button>

    <el-table
      :data="tableData"
      border
      style="width: 100%; margin-top: 10px; margin-left: 15px;">
      <el-table-column
        type="index"
        label="编号"
        width="80"
        :index="indexMethod">
      </el-table-column>
      <el-table-column
        prop="fields.account_name"
        label="账户名"
        width="180"
        >
      </el-table-column>
      <el-table-column
        prop="fields.name"
        label="真实姓名"
        width="180"
        >
      </el-table-column>
      <el-table-column
        prop="fields.type"
        label="身份"
        width="180"
        >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.fields.type === 1" type="success">visitor</el-tag>
          <el-tag v-if="scope.row.fields.type === 2" type="warning">editor</el-tag>
          <el-tag v-if="scope.row.fields.type === 3" type="danger">admin</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="fields.introduce"
        label="介绍"
        width="180"
        >
      </el-table-column>
      <el-table-column
        prop="fields.email"
        label="邮件"
        width="180"
        >
      </el-table-column>
      <el-table-column
        prop="fields.is_delete"
        label="用户状态"
        width="180"
        >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.fields.is_delete === 0" type="success">存在</el-tag>
          <el-tag v-if="scope.row.fields.is_delete === 1" type="danger">已删除</el-tag>
        </template>

      </el-table-column>
      <el-table-column
        label="操作"
        width="280"
        >
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.$index)" type="primary" size="small">修改信息</el-button>
          <el-button v-if="scope.row.fields.is_delete === 0" @click="del_user(scope.$index)" style="margin-left: 15px;" type="primary" size="small">删除用户</el-button>
        </template>
      </el-table-column>
    </el-table>


    <el-dialog title="信息修改" :visible.sync="dialogFormVisible">
      <el-form :model="form" ref="form" :rules="formRules" class="login-form">
        <el-form-item label="账户ID" label-width="188px">
          <el-input disabled="true" v-model="form.id" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="account_name" label="账户名" label-width="188px">
          <el-input v-model="form.account_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="name" label="真实名称" label-width="188px">
          <el-input  v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码" label-width="188px">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="password2" label="确认密码" label-width="188px">
          <el-input v-model="form.password2" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户权限" label-width="188px">
          <el-select filterable v-model="form.type" placeholder="请选择">
            <el-option
              v-for="(item, index) in roleList"
              :key="index"
              :label="item.label"
              :value="item.value">
              <span style="float: left">{{ item.label }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户介绍" label-width="188px">
          <el-input type="textarea" v-model="form.introduce" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="email" label="email" label-width="188px">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户状态" label-width="188px">
          <el-select filterable v-model="form.is_delete" placeholder="请选择">
            <el-option
              v-for="(item, index) in stateList"
              :key="index"
              :label="item.label"
              :value="item.value">
              <span style="float: left">{{ item.label }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
            </el-option>
          </el-select>
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="disable_dialog()">取 消</el-button>
        <el-button type="primary" @click="commit_change()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="添加用户" :visible.sync="addUserVisible" :before-close="disable_dialog2">
      <el-form :model="form2" ref="form2" :rules="form2Rules" class="login-form">
        <el-form-item prop="account_name" label="账户名" label-width="188px">
          <el-input v-model="form2.account_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="name" label="真实名称" label-width="188px">
          <el-input  v-model="form2.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码" label-width="188px">
          <el-input v-model="form2.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="password2" label="确认密码" label-width="188px">
          <el-input v-model="form2.password2" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="type" label="用户权限" label-width="188px">
          <el-select filterable v-model="form2.type" placeholder="请选择">
            <el-option
              v-for="(item, index) in roleList"
              :key="index"
              :label="item.label"
              :value="item.value">
              <span style="float: left">{{ item.label }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="introduce" label="用户介绍" label-width="188px">
          <el-input type="textarea" v-model="form2.introduce" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="email" label="email" label-width="188px">
          <el-input v-model="form2.email" autocomplete="off"></el-input>
        </el-form-item>


      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="disable_dialog2()">取 消</el-button>
        <el-button type="primary" @click="add_user()">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import axios from "axios";
import store from "@/store";

export default {
  name: 'user_temp',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length <= 2) {
        callback(new Error('名称应大于2位，请检查您的用户名。'))
      }else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
        if(value.length !== 0){
          if (value.length < 3) {
            callback(new Error('密码长度不能小于3位！'))
          }else {
            callback()
          }
        }else{
          callback()
        }
    }
    const validatePassword2 = (rule, value, callback) => {
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
      formRules:{
        name: [{ required: true, trigger: 'blur', validator: validateUsername }],
        account_name: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        password2: [{ required: true, trigger: 'blur', validator: validatePassword }],
        email: [{ required: false, trigger: 'blur', validator: validateEmail }]
      },
      form2Rules:{
        name:[{ required: true, trigger: 'blur', validator: validateUsername }],
        account_name:[{ required: true, trigger: 'blur', validator: validateUsername }],
        password:[{ required: true, trigger: 'blur', validator: validatePassword2 }],
        password2: [{ required: true, trigger: 'blur', validator: validatePassword2 }],
        email: [{ required: false, trigger: 'blur', validator: validateEmail }],

      },
      tableData: [],
      indexMethod: 1,
      search_text: '',
      roleList: [
        {
          label:"visitor",
          value: 1,
        },
        {
          label:"editor",
          value: 2,
        },
        {
          label:"admin",
          value: 3,
        }
      ],
      stateList: [
        {
          label:"已删除",
          value: 1,
        },
        {
          label:"存在",
          value: 0,
        }
      ],
      form: {
        id: '',
        name: '',
        account_name: '',
        password: '',
        password2: '',  // 确认密码
        type: '',
        introduce: '',
        email: '',
        is_delete: '',
      },
      form2: {
        name: '',
        account_name: '',
        password: '',
        password2: '',
        type: 1,
        introduce: '',
        email: '',
      },
      dialogFormVisible: false,
      addUserVisible: false,
      row_data: '',
    }
  },
  mounted() {
    this.getAllUsers()
  },
  methods: {
    isEmail(s) {
      return /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(s)
    },
    userTypeFormatter(row, column) {
      if (row.fields.type === 1) {
        return 'visitor'
      } else if(row.fields.type === 2)  {
        return 'editor'
      }else if(row.fields.type === 3){
        return 'admin'
      }else{
        return '无'
      }
    },
    userStateFormatter(row, column) {
      if (row.fields.is_delete === 0) {
        return '存在'
      }else{
        return '已删除'
      }
    },
    getAllUsers(){
      axios({
        method: 'get',
        url: process.env.VUE_APP_severURL + '/getUserList',
        contentType: 'application/x-www-form-urlencoded',
      }).then(resp => {
        if (resp.data.code === 20000){
          // 用户列表
          this.tableData = resp.data.data
          this.tableData.splice(0,0)
          this.$message({
            message: '用户列表加载成功！',
            type: 'success'
          })
        }
      })
    },

    indexMethod: function(index) {
      return ++index;
    },
    disable_dialog: function() {
      this.dialogFormVisible = false
      this.form = {
        id: '',
        name: '',
        account_name: '',
        password: '',
        password2: '',
        type: '',
        introduce: '',
        email: '',
        is_delete: '',
      }
    },
    disable_dialog2: function() {
      this.addUserVisible = false
      this.form2 = {
        name: '',
        account_name: '',
        password: '',
        password2: '',
        type: 1,
        introduce: '',
        email: '',
      }
    },
    add_user: function() {
      // alert("oooo")
      this.$refs.form2.validate(valid => {
        if (valid) {
          // alert("ok")
          if(this.form2.password !== this.form2.password2){
            this.$message({
              type: 'info',
              message: '密码与确认密码不符！'
            });
          }else{
            let param = new FormData()
            param.append('account_name', this.form2.account_name)
            param.append('email', this.form2.email)
            param.append('introduce', this.form2.introduce)
            param.append('type', this.form2.type)
            param.append('password', this.form2.password)
            param.append('name', this.form2.name)

            axios({
              method: 'post',
              url: process.env.VUE_APP_severURL + '/addUser',
              contentType: 'application/x-www-form-urlencoded',
              data: param,

            }).then(resp => {
              if(resp.data.code === 20000){

                this.tableData.push(resp.data.data[0])
                this.tableData.splice(0,0)
                this.disable_dialog2()
                this.$message({
                  type: 'success',
                  message: '添加成功!'
                });
              }else{
                this.$message({
                  type: 'info',
                  message: '账户名已存在或数据出错!'
                });
              }
            })
          }
        } else {
          console.log('错误的提交')
          return false
        }
      })
      this.addUserVisible = false;
    },
    commit_change: function() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if(this.row_data === ''){
            this.$message({
              type: 'info',
              message: '数据加载出错！'
            });
          }else if(this.form.password !== this.form.password2){
            this.$message({
              type: 'info',
              message: '密码与确认密码不符！'
            });
          }else{
            let param = new FormData()
            param.append('id', this.form.id)
            param.append('account_name', this.form.account_name)
            param.append('is_delete', this.form.is_delete)
            param.append('email', this.form.email)
            param.append('introduce', this.form.introduce)
            param.append('type', this.form.type)
            param.append('password', this.form.password)
            param.append('name', this.form.name)

            axios({
              method: 'post',
              url: process.env.VUE_APP_severURL + '/adminEditUserInfo',
              contentType: 'application/x-www-form-urlencoded',
              data: param,

            }).then(resp => {
              if(resp.data.code === 20000){

                console.log(resp.data.data)
                console.log(this.row_data)
                this.tableData[this.row_data] = resp.data.data[0]
                this.tableData.splice(0,0)
                this.disable_dialog()
                this.$message({
                  type: 'success',
                  message: '修改成功!'
                });
              }else if(resp.data.code === 3000){
                this.$message({
                  type: 'info',
                  message: '失败，账户已存在!'
                });
              }else{
                this.$message({
                  type: 'info',
                  message: '失败，修改成功!'
                });
              }
            })
          }
        } else {
          console.log('错误的提交')
          return false
        }
      })
    },
    handleClick(index) {
      console.log(index);
      this.row_data = index;
      this.form = {
        id: this.tableData[index].pk,
        name: this.tableData[index].fields.name,
        account_name: this.tableData[index].fields.account_name,
        password: '',
        password2: '',
        type: this.tableData[index].fields.type,
        introduce: this.tableData[index].fields.introduce,
        email: this.tableData[index].fields.email,
        is_delete: this.tableData[index].fields.is_delete,
      }
      this.dialogFormVisible = true
    },
    del_user: function(index) {
      console.log("delete user")
      this.$confirm('此操作将删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // this.tableData.splice(index,1)
        let param = new URLSearchParams()
        param.append('user_id', this.tableData[index].pk)
        axios({
          method: 'get',
          url: process.env.VUE_APP_severURL + '/delUser',
          contentType: 'application/x-www-form-urlencoded',
          params: param,
        }).then(resp => {
          if (resp.data.code === 20000){
            // 删除成功
            this.tableData[index].fields.is_delete = 1
            this.tableData.splice(0,0)
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }else{
            // 删除失败
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
  },
}
</script>

<style scoped>
/*/deep/ .el-table th.gutter{*/
/*  display: table-cell;*/
/*}*/
</style>
