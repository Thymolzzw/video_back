<template>
  <div id="resource_manage">
    <div>
      <el-button style="margin: 10px;margin-left: 40%" type="primary" icon="el-icon-plus" @click="clickAddResource()">添加新视频源</el-button>
      <el-table :data="resource_list"  border style="width: 100%">
        <el-table-column type="index" label="编号" :index="indexMethod" width="80">
        </el-table-column>
        <el-table-column prop="resource_name" label="视频源名称" width="180">
        </el-table-column>
        <el-table-column prop="resource_introduce" label="视频源介绍">
        </el-table-column>
        <el-table-column prop="resource_url" label="视频源链接">
        </el-table-column>
        <el-table-column width="100px" prop="resource_initial" label="视频源名首字母">
        </el-table-column>

        <el-table-column prop="address" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" @click="update_resource(scope.$index)">编辑修改</el-button>
            <el-button type="danger" @click="delete_resource(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

    </div>

    <!--新增/编辑界面-->
    <el-dialog :title="titleMap[dialogStatus]" :visible.sync="FormVisible" :close-on-click-modal="false" class="edit-form"
               :before-close="handleClose">
      <el-form :model="Form" label-width="120px" :rules="editFormRules" ref="Form">
        <el-form-item label="视频源名称" prop="resource_name">
          <el-input v-model="Form.resource_name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="视频源介绍" prop="resource_introduce">
          <el-input type="textarea" v-model="Form.resource_introduce"></el-input>
        </el-form-item>
        <el-form-item label="视频源链接" prop="resource_url">
          <el-input v-model="Form.resource_url"></el-input>
        </el-form-item>
        <el-form-item label="视频源名首字母" prop="resource_initial">
          <el-input v-model="Form.resource_initial"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose()">取消</el-button>
        <el-button type="primary" @click="doAddEditResource()">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>



<script>
import axios from 'axios'

export default {
  data(){
    return{
      resource_list:[],
      Form: {
        resource_id: '',
        resource_name: '',
        resource_introduce: '',
        resource_url: '',
        resource_initial:''
      },
      titleMap: {
        add:'新增',
        edit: "编辑"
      },
      dialogStatus: 'add',
      FormVisible: false,
      editFormRules:{
        resource_name: [
          { required: true, message: '请输入视频源名称', trigger: 'blur' }
        ],
        resource_introduce: [
          { required: false, message: '请输视频源介绍', trigger: 'blur' }
        ],
        resource_url: [
          { required: false, message: '请输入视频源链接', trigger: 'blur' }
        ],
        resource_initial:[
          { required: false, message: '请输入视频名首字母', trigger:'blur'}
        ]
      },

    }
  },
  mounted() {
    console.log('src/views/admin_functions/resourcemanage.vue')
    this.getResourceList()

  },
  name: 'index',
  methods: {
    doAddEditResource(){

      let param = new FormData()
      param.append('resource_id', this.Form.resource_id)
      param.append('resource_name', this.Form.resource_name)
      param.append('resource_introduce', this.Form.resource_introduce)
      param.append('resource_url', this.Form.resource_url)
      param.append('resource_initial', this.Form.resource_initial)
      param.append('dialog_status', this.dialogStatus)
      axios({
        method: 'post',
        url: process.env.VUE_APP_severURL + '/addEditResource',
        contentType: 'application/x-www-form-urlencoded',
        data: param,

      }).then(resp => {
        if(resp.data.code === 20000){
          this.getResourceList();
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
    update_resource(index) {
      this.dialogStatus = 'edit';
      this.Form.resource_id = this.resource_list[index].resource_id;
      this.Form.resource_name = this.resource_list[index].resource_name;
      this.Form.resource_introduce = this.resource_list[index].resource_introduce;
      this.Form.resource_url = this.resource_list[index].resource_url;
      this.Form.resource_initial = this.resource_list[index].resource_initial;
      this.FormVisible = true;
    },
    clickAddResource: function (){
      this.dialogStatus = 'add';
      this.FormVisible = true;
    },
    handleClose: function () {
      this.FormVisible = false;
      this.Form.resource_id = '';
      this.Form.resource_name = '';
      this.Form.resource_introduce = '';
      this.Form.resource_url = '';
      this.Form.resource_initial = '';
    },
    getResourceList:function(){
      this.resource_list = []
      let config = {
        headers: { 'Accept-Ranges': 'bytes' }
      }
      axios({
        method: 'get',
        url: process.env.VUE_APP_severURL + '/getResourceList',
        contentType: 'application/x-www-form-urlencoded',
        headers: config.headers
      }).then(resp => {
        this.resource_list = resp.data.data
      })

    },
    indexMethod(index){
      return index + 1;
    },

    delete_resource(delete_index) {
      // alert(delete_index)
      this.$confirm('此操作将删除该资源, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

        let param = new FormData()
        param.append('delete_resource_id', this.resource_list[delete_index].resource_id)
        axios({
          method: 'post',
          url: process.env.VUE_APP_severURL + '/deleteResource',
          contentType: 'application/x-www-form-urlencoded',
          data: param,
        }).then(resp => {
          if(resp.data.code === 20000){
            this.resource_list.splice(delete_index,1)
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
