<template>
  <div class="app-container">
    <div class="app-container">
      <!-- <div>模板列表</div> -->
        <el-dialog title="重置密码" :visible.sync="dialogFormVisible">
          <el-form :model="form" status-icon :rules="rules" ref="form" label-width="100px" class="demo-ruleForm">
            <el-form-item label="用户账号" :label-width="formLabelWidth">
              <el-input v-model="form.account" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="pwd">
              <el-input type="password" v-model="form.pwd" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="repwd">
              <el-input type="password" v-model="form.repwd" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
<!--            <el-button @click="dialogFormVisible = false">取 消</el-button>-->
<!--            <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>-->
            <el-button type="primary" @click="submitForm('form')">提交</el-button>
            <el-button @click="resetForm('form')">重置</el-button>
          </div>
        </el-dialog>

      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" v-model="query">
          <el-form-item label="用户姓名：">
            <el-input v-model="query._like_name" placeholder="请输入用户姓名"></el-input>
          </el-form-item>
          <el-form-item label="父组织">
            <OriginzationSelect v-model="query.organization_id" placeholder="请输入管理员姓名"></OriginzationSelect>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSearch">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button plain @click="onReset">重置</el-button>
          </el-form-item>

          <el-form-item style="float: right">
            <el-button type="success"  @click="onNewClick">添加用户</el-button>
          </el-form-item>
        </el-form>
      </el-col>


      <el-table
        :data="data"
        v-loading="tableLoading"
        @sort-change="onSort">

        <el-table-column
          prop="id"
          label="id"
          sortable
          width="80">
        </el-table-column>
        <el-table-column
          prop="account"
          label="账号"
          sortable
          width="180">
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
          sortable>
        </el-table-column>
        <el-table-column
          prop="ip"
          label="IP"
          sortable>
        </el-table-column>
        <el-table-column
          prop="uuid"
          label="用户编号"
          sortable>
        </el-table-column>
        <el-table-column
          prop="organization.name"
          label="所属单位名称"
          sortable>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
            size="mini"
            type="primary"
            @click="onChangeClick(scope.$index, scope.row)">重置密码</el-button>
            <el-button
            size="mini"
            type="danger"
            @click="onDeleteClick(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>

      </el-table>

      <el-col :span="24" class="toolbar">
        <el-pagination
          @current-change="onPageChange"
          :current-page="pages._page"
          :page-size="pages._per_page"
          layout="total, prev, pager, next"
          :total="total"
          style="float:right;">
        </el-pagination>
      </el-col>

      <CreatorDialog
        :visible="newDialogShow"
        @onOK="onNewOK"
        @onCancel="onNewCancel">
      </CreatorDialog>

    </div>
  </div>
</template>

<script>
  //mixin
  // import commonTable from '@/mixins/table'
  //视频接口
  import { queryUsers, deleteUser, updateUser, getUser, createUser, updatePassword } from '@/api/user'

  import CreatorDialog from './components/newDialog.vue'
  import OriginzationSelect from '@/views/components/OriginzationSelect'

  export default {
    mixins: [commonTable],
    components: { CreatorDialog, OriginzationSelect },
    data() {
        var validatePass = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请输入密码'));
          } else if(value.length < 6){
            callback(new Error('密码长度须大于6位'));
          } else {
            if (this.form.checkPass !== '') {
              this.$refs.form.validateField('checkPass');
            }
            callback();
          }
        };
        var validatePass2 = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请再次输入密码'));
          } else if (value !== this.form.pwd) {
            callback(new Error('两次输入密码不一致!'));
          } else {
            callback();
          }
        };
      return {
        //配置minxin种curd api方法：
        newMethod: createUser,
        deleteMethod: deleteUser,
        updateMethod: updateUser,
        getMethod: getUser,
        queryMethod: queryUsers,
        dialogFormVisible: false,

        //配置resource_name
        resource_name: 'user',

        form: {
          account: '',
          pwd: '',
          repwd: '',
        },

         rules: {
            pwd: [
              { validator: validatePass, trigger: 'blur' }
            ],
            repwd: [
              { validator: validatePass2, trigger: 'blur' }
            ]
         },

        //配置mixin query
        query: {  //条件查询 dict  //api查询条件dict
          _like_name: undefined,
          organization_id: undefined
        },

        data: [],  //列表

      }
    },
    created() {
    },
    methods: {
      open_success() {
        this.$alert('修改密码成功', '提示', {
          confirmButtonText: '确定',
          callback: action => {
            this.$refs['form'].resetFields();
            this.dialogFormVisible = false;
          }
        });
      },

    open_fail() {
        this.$alert('修改密码失败，请检查网络问题', '提示', {
          confirmButtonText: '确定',
          callback: action => {
            this.$refs['form'].resetFields();
            this.dialogFormVisible = false;
          }
        });
      },

      //Rewrite minxin onReset()  查询条件重置
      onReset() {
        this.query = {  //条件查询 dict
          _like_name: undefined,
          organization_id: undefined
        }
        this.order = { _order_by: 'id', _desc: true } //order 在
        this.pages._page = 1
        this.fetchData()
      },

      onChangeClick(index, row){//点击重置密码
        this.form.account = row.account;
        this.dialogFormVisible = true;
      },

      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let data = {
              account: this.form.account,
              password: this.form.pwd
            };
            updatePassword(data).then(pwd_resp => {
            if(pwd_resp.data.code === 200){
              this.open_success();
            }else{
              this.open_fail();
            }
          });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }


    },
    mounted() {
      // window.vue = this

    }

  }
</script>
<style scoped>
  .toolbar {
    background: #f2f2f2;
    padding: 10px;
    margin: 10px 0px;
  }

  .toolbar .el-form-item {
    margin-bottom: 10px;
  }
</style>
