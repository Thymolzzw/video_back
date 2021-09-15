<template>
  <div id="resource_manage">
    <div>
      <el-button style="margin-top: 20px;margin-left: 40%" type="primary" icon="el-icon-plus" @click="clickAddPeopleRelation()">添加新人物关系</el-button>
      <el-table :data="people_relation_list"  border style="width: 100%; margin-top: 10px; margin-left: 15px;">
        <el-table-column type="index" label="编号" :index="indexMethod" width="80">
        </el-table-column>
        <el-table-column prop="from_people_name" label="关系开始节点" width="180">
        </el-table-column>
        <el-table-column prop="to_people_name" label="关系结束节点">
        </el-table-column>
        <el-table-column prop="text" label="关系名称">
        </el-table-column>

        <el-table-column prop="address" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" @click="update_people_relation(scope.$index)">编辑修改</el-button>
            <el-button type="danger" @click="delete_people_relation(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

    </div>

    <!--新增/编辑界面-->
    <el-dialog :title="titleMap[dialogStatus]" :visible.sync="FormVisible" :close-on-click-modal="false" class="edit-form"
               :before-close="handleClose">
      <el-form :model="Form" label-width="15vh" :rules="editFormRules" ref="Form">
        <el-form-item label="关系开始节点名称" prop="from_field">
          <el-select filterable v-model="Form.from_field" placeholder="请选择">
            <el-option
              v-for="(item, index) in people_list"
              :key="index"
              :label="item.people_name"
              :value="item.people_id">
              <span style="float: left;width: 70px">
                 <el-image
                   style="float: left; height: 32px"
                   :src="item.people_img"
                   fit="contain">
                 </el-image>
              </span>
              <span style="float: right; color: #5f6774; font-size: 13px">{{ item.people_name }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关系结束节点名称" prop="to">
          <el-select filterable v-model="Form.to" placeholder="请选择">
            <el-option
              v-for="(item, index) in people_list"
              :key="index"
              :label="item.people_name"
              :value="item.people_id">
              <span style="float: left;width: 70px">
                 <el-image
                   style="float: left; height: 32px"
                   :src="item.people_img"
                   fit="contain">
                 </el-image>
              </span>
              <span style="float: right; color: #5f6774; font-size: 13px">{{ item.people_name }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关系名称" prop="text">
          <el-input v-model="Form.text"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose()">取消</el-button>
        <el-button type="primary" @click="doAddEdit()">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>



<script>
import axios from 'axios'
import permission from '@/directive/permission/index.js'

export default {
  directives: { permission },
  data(){
    return{
      people_relation_list:[],
      people_list: [],
      Form: {
        id: '',
        from_field: '',
        to: '',
        text: ''
      },
      titleMap: {
        add:'新增',
        edit: "编辑"
      },
      dialogStatus: 'add',
      FormVisible: false,
      editFormRules:{
        from_field: [
          { required: true, message: '请输入视频源名称', trigger: 'blur' }
        ],
        to: [
          { required: false, message: '请输视频源介绍', trigger: 'blur' }
        ],
        text: [
          { required: false, message: '请输入视频源链接', trigger: 'blur' }
        ],
      },

    }
  },
  mounted() {
    console.log('src/views/admin_functions/people_relation_manage.vue')
    this.getPeopleRelationList()
    this.getPeopleList()
  },
  name: 'people_relation_manage',
  methods: {
    doAddEdit(){
      let param = new FormData()
      param.append('id', this.Form.id)
      param.append('from_field', this.Form.from_field)
      param.append('to', this.Form.to)
      param.append('text', this.Form.text)
      param.append('dialog_status', this.dialogStatus)
      axios({
        method: 'post',
        url: process.env.VUE_APP_severURL + '/addEditPeopleRelation',
        contentType: 'application/x-www-form-urlencoded',
        data: param,

      }).then(resp => {
        if(resp.data.code === 20000){
          this.getPeopleRelationList();
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
    update_people_relation(index) {
      this.dialogStatus = 'edit';
      this.Form.id = this.people_relation_list[index].id;
      this.Form.from_field = this.people_relation_list[index].from_field;
      this.Form.to = this.people_relation_list[index].to;
      this.Form.text = this.people_relation_list[index].text;
      this.FormVisible = true;
    },
    clickAddPeopleRelation: function (){
      this.dialogStatus = 'add';
      this.FormVisible = true;
    },
    handleClose: function () {
      this.FormVisible = false;
      this.Form.id = '';
      this.Form.from_field = '';
      this.Form.to = '';
      this.Form.text = '';
    },
    getPeopleRelationList:function(){
      this.people_relation_list = []
      let config = {
        headers: { 'Accept-Ranges': 'bytes' }
      }
      axios({
        method: 'get',
        url: process.env.VUE_APP_severURL + '/getPeopleRelationList',
        contentType: 'application/x-www-form-urlencoded',
        headers: config.headers
      }).then(resp => {
        this.people_relation_list = resp.data.data
      })

    },
    getPeopleList:function(){
      this.people_list = []
      let config = {
        headers: { 'Accept-Ranges': 'bytes' }
      }
      axios({
        method: 'get',
        url: process.env.VUE_APP_severURL + '/getPeopleList',
        contentType: 'application/x-www-form-urlencoded',
        headers: config.headers
      }).then(resp => {
        this.people_list = resp.data.data
      })

    },
    indexMethod(index){
      return index + 1;
    },

    delete_people_relation(delete_index) {
      // alert(delete_index)
      this.$confirm('此操作将删除该关系, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

        let param = new FormData()
        param.append('delete_id', this.people_relation_list[delete_index].id)
        axios({
          method: 'post',
          url: process.env.VUE_APP_severURL + '/deletePeopleRealtion',
          contentType: 'application/x-www-form-urlencoded',
          data: param,
        }).then(resp => {
          if(resp.data.code === 20000){
            this.people_relation_list.splice(delete_index,1)
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
