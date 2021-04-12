<template>
  <div id="user">
    <el-input style="width: 20%" v-model="search_text"></el-input>
    <el-button type="primary">搜索</el-button>
    <el-button style="margin-left: 15px;" type="primary" @click="addUserVisible = true">添加用户</el-button>

    <el-table
      :data="tableData"
      border
      type="index"
      style="width: 100%">
      <el-table-column
        align="center"
        type="index"
        label="编号"
        width="100px"
        :index="indexMethod">
      </el-table-column>
      <el-table-column
        prop="account_number"
        label="用户名"
        align="center"
        width="150">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        align="center"
        width="120">
      </el-table-column>
      <el-table-column
        prop="power"
        label="身份"
        align="center"
        width="120">
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="300">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.$index)" type="primary" size="small">修改信息</el-button>
          <el-button @click="del_user(scope.$index)" style="margin-left: 15px;" type="primary" size="small">删除用户</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="信息修改" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="姓名" label-width="188px">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="原始密码" label-width="188px">
          <el-input type="password" v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="188px">
          <el-input type="password" v-model="form.newpassword" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" label-width="188px">
          <el-input type="password" v-model="form.newpassword2" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="disable_dialog()">取 消</el-button>
        <el-button type="primary" @click="commit_change()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="添加用户" :visible.sync="addUserVisible">
      <el-form :model="form2">
        <el-form-item label="账号" label-width="188px">
          <el-input v-model="form2.account" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="姓名" label-width="188px">
          <el-input v-model="form2.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="权限" label-width="188px">
          <el-input v-model="form2.power" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="188px">
          <el-input type="password" v-model="form2.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" label-width="188px">
          <el-input type="password" v-model="form2.repassword" autocomplete="off"></el-input>
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
export default {
  name: 'user_temp',
  data() {
    return {
      tableData: [{
        account_number: 'admin',
        power: 'admin',
        name: 'cuiky',
      }, {
        account_number: 'editor',
        power: 'user',
        name: '王小虎',
      }],
      indexMethod: 1,
      search_text: '',
      form: {
        name: '',
        password: '',
        newpassword: '',
        newpassword2: ''
      },
      form2: {
        account: '',
        name: '',
        password: '',
        repassword: '',
        power: ''
      },
      dialogFormVisible: false,
      addUserVisible: false,
      row_data: '',
    }
  },
  methods: {
    indexMethod: function(index) {
      return ++index;
    },
    disable_dialog: function() {
      this.dialogFormVisible = false
      this.form.name = ''
      this.form.password = ''
      this.form.newpassword = ''
      this.form.newpassword2 = ''
    },
    disable_dialog2: function() {
      this.addUserVisible = false
      this.form2 = {
        account: '',
        name: '',
        password: '',
        repassword: '',
        power: ''
      }
    },
    add_user: function() {
      if(this.form2.password !== this.form2.repassword){
        this.$alert('两次输入的密码不一致！', '添加失败', {
          confirmButtonText: '确定',
        });
        return;
      }
      this.tableData.push({
        account_number: this.form2.account,
        power: this.form2.power,
        name: this.form2.name,
      })
      this.$alert('添加用户成功！', '添加结果', {
        confirmButtonText: '确定',
      });
      this.addUserVisible = false;
    },
    commit_change: function() {
      if (this.form.name !== '')
        this.tableData[this.row_data].name = this.form.name
      if (this.form.password === '111111' && this.form.newpassword === this.form.newpassword2 && this.form.newpassword2 !== ''){
        this.$alert('修改密码成功', '修改结果', {
          confirmButtonText: '确定',
        });
        this.dialogFormVisible = false;
        this.form.name = ''
        this.form.password = ''
        this.form.newpassword = ''
        this.form.newpassword2 = ''
        return;
      }else{
        if (this.form.newpassword !== this.form.newpassword2 && (this.form.newpassword2 !== '' || this.form.newpassword !== '')){
          this.$alert('两次密码不一致！', '修改结果', {
            confirmButtonText: '确定',
          });
          return;
        }
        this.dialogFormVisible = false;
        this.form.name = ''
        this.form.password = ''
        this.form.newpassword = ''
        this.form.newpassword2 = ''
      }

    },
    handleClick(index) {
      console.log(index);
      this.row_data = index;
      this.dialogFormVisible = true
    },
    del_user: function(index) {
      console.log("Aa")
      this.tableData[index] = {
        account_number: '',
        power: '',
        name: '',}
      let temp_data = this.tableData
      this.tableData = temp_data
    },
  },
}
</script>

<style scoped>

</style>
