<template>
  <div id="country_manage">
    <div>
      <el-button style="margin: 10px;margin-left: 40%" type="primary" icon="el-icon-plus" @click="clickAddcountry()">添加新国家信息</el-button>
      <el-table :data="country_list"  border style="width: 100%">
        <el-table-column type="index" label="编号" :index="indexMethod" width="80">
        </el-table-column>
        <el-table-column prop="country_name" label="视频源名称" width="180">
        </el-table-column>
        <el-table-column prop="country_introduce" label="视频源介绍">
        </el-table-column>
        <el-table-column prop="address" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" @click="update_country(scope.$index)">编辑修改</el-button>
            <el-button type="danger" @click="delete_country(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

    </div>

    <!--新增/编辑界面-->
    <el-dialog :title="titleMap[dialogStatus]" :visible.sync="FormVisible" :close-on-click-modal="false" class="edit-form"
               :before-close="handleClose">
      <el-form :model="Form" label-width="80px" :rules="editFormRules" ref="Form">
        <el-form-item label="国家名称" prop="country_name">
          <el-input v-model="Form.country_name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="国家介绍" prop="country_introduce">
          <el-input type="textarea" v-model="Form.country_introduce"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose()">取消</el-button>
        <el-button type="primary" @click="doAddEditcountry()">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>



<script>
import axios from 'axios'

export default {
  data(){
    return{
      country_list:[],
      Form: {
        country_id: '',
        country_name: '',
        country_introduce: ''
      },
      titleMap: {
        add:'新增',
        edit: "编辑"
      },
      dialogStatus: 'add',
      FormVisible: false,
      editFormRules:{
        country_name: [
          { required: true, message: '请输入国家名称', trigger: 'blur' }
        ],
        country_introduce: [
          { required: false, message: '请输国家介绍', trigger: 'blur' }
        ],

      },

    }
  },
  mounted() {
    this.getcountryList()

  },
  name: 'index',
  methods: {
    doAddEditcountry(){

      let param = new FormData()
      param.append('country_id', this.Form.country_id)
      param.append('country_name', this.Form.country_name)
      param.append('country_introduce', this.Form.country_introduce)
      param.append('dialog_status', this.dialogStatus)
      axios({
        method: 'post',
        url: process.env.VUE_APP_severURL + '/addEditCountry',
        contentType: 'application/x-www-form-urlencoded',
        data: param,

      }).then(resp => {
        if(resp.data.code === 20000){
          this.getcountryList();
          this.$alert('操作成功', '操作结果', {
            confirmButtonText: '确定',
          });
        }else if(resp.data.code === 3000){
          this.$alert('已存在', '操作结果', {
            confirmButtonText: '确定',
          });
        }

        this.handleClose();
      })

    },
    update_country(index) {
      this.dialogStatus = 'edit';
      this.Form.country_id = this.country_list[index].country_id;
      this.Form.country_name = this.country_list[index].country_name;
      this.Form.country_introduce = this.country_list[index].country_introduce;
      this.FormVisible = true;
    },
    clickAddcountry: function (){
      this.dialogStatus = 'add';
      this.FormVisible = true;
    },
    handleClose: function () {
      this.FormVisible = false;
      this.Form.country_id = '';
      this.Form.country_name = '';
      this.Form.country_introduce = '';
    },
    getcountryList:function(){
      this.country_list = []
      let config = {
        headers: { 'Accept-Ranges': 'bytes' }
      }
      axios({
        method: 'get',
        url: process.env.VUE_APP_severURL + '/getCountryList',
        contentType: 'application/x-www-form-urlencoded',
        headers: config.headers
      }).then(resp => {
        this.country_list = resp.data.data
      })

    },
    indexMethod(index){
      return index + 1;
    },

    delete_country(delete_index) {
      // alert(delete_index)
      this.$confirm('此操作将删除该资源, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

        let param = new FormData()
        param.append('delete_country_id', this.country_list[delete_index].country_id)
        axios({
          method: 'post',
          url: process.env.VUE_APP_severURL + '/deleteCountry',
          contentType: 'application/x-www-form-urlencoded',
          data: param,
        }).then(resp => {
          if(resp.data.code === 20000){
            this.country_list.splice(delete_index,1)
          }
        });

        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },


  }
}
</script>

<style scoped>

</style>
