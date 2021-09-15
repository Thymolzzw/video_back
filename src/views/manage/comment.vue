<template>
  <div id="comment">
    <el-switch style="margin: 15px"
      v-model="isUser"
      active-text="按用户搜索"
      inactive-text="按视频搜索">
    </el-switch>
    <div id="select_list_user" v-if="isUser" style="margin-left: 15px">
      <el-select v-model="valueUserID" filterable placeholder="请选择">
        <el-option
          v-for="(item, index) in userList"
          :key="index"
          :label="item.fields.account_name"
          :value="item.pk">
          <span style="float: left">{{ item.fields.account_name }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{ item.id }}</span>
        </el-option>
      </el-select>
      <el-button type="primary" @click="doSearchWithUserID()">搜索</el-button>
    </div>
    <div id="select_list_video" v-if="isUser === false" style="margin-left: 15px">
      <el-select v-model="valueVideoID" filterable placeholder="请选择">
        <el-option
          v-for="(item, index) in videos"
          :key="index"
          :label="item.label"
          :value="item.value">
          <span style="float: left">{{ item.label }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
        </el-option>
      </el-select>
      <el-button type="primary" @click="doSearchWithVideoID()">搜索</el-button>
    </div>

    <el-table
      :data="tableData"
      border
      style="width: 100%; margin-top: 10px; margin-left: 15px;">
      <el-table-column
        prop="id"
        label="编号"
        width="80"
      >
      </el-table-column>
      <el-table-column
        prop="commentUser.nickName"
        label="评论者"
        width="180"
      >
      </el-table-column>
      <el-table-column
        prop="videoTitle"
        label="评论视频"
        width="180"
      >
      </el-table-column>
      <el-table-column
        prop="createDate"
        label="评论时间"
        width="180"
      >
      </el-table-column>
      <el-table-column
        prop="content"
        label="评论内容"
        width="350"
      >
      </el-table-column>
      <el-table-column
        label="操作"
        width="150"
      >
        <template slot-scope="scope">
          <el-button @click="del_comment(scope.$index)" style="margin-left: 15px;" type="danger" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "comment",
  data(){
    return {
      valueUserID: '',
      valueVideoID:'',
      isUser: true,
      tableData: [],
      userList: [],
      videos: [],
    }
  },
  mounted() {
    console.log('src/views/manage/comment.vue')
    this.initComment()
  },
  methods: {
    get_videos: function () {
      axios.get(process.env.VUE_APP_severURL + '/getAllVideos')
        .then(res => {
          var promoList = res.data.video_items
          let len = promoList.length
          let temp = {}
          for (let i = 0; i < len; ++i){
            temp = {
              value: promoList[i].id,
              label: promoList[i].title
            }
            this.videos.push(temp)
          }
        })
    },
    doSearchWithUserID(){
      let param = new URLSearchParams()
      param.append('user_id', this.valueUserID)
      axios({
        method: 'get',
        url: process.env.VUE_APP_severURL + '/getCommentWithUserIDForAdmin',
        contentType: 'application/x-www-form-urlencoded',
        params: param,
      }).then(resp => {
        if(resp.data.code === 20000){
          this.tableData = resp.data.data
          this.tableData.splice(0,0)
          this.$message({
            message: '评论列表加载成功！',
            type: 'success'
          })
        }
      })
    },
    doSearchWithVideoID(){
      let param = new URLSearchParams()
      param.append('videoId', this.valueVideoID)
      axios({
        method: 'get',
        url: process.env.VUE_APP_severURL + '/getCommentWithVideoIDForAdmin',
        contentType: 'application/x-www-form-urlencoded',
        params: param,
      }).then(resp => {
        if(resp.data.code === 20000){
          this.tableData = resp.data.data
          this.tableData.splice(0,0)
          this.$message({
            message: '评论列表加载成功！',
            type: 'success'
          })
        }
      })
    },
    del_comment(index){
      let param = new FormData()
      param.append('comment_id', this.tableData[index].id)
      axios({
        method: 'post',
        url: process.env.VUE_APP_severURL + '/delCommentForAdmin',
        contentType: 'application/x-www-form-urlencoded',
        data: param,
      }).then(resp => {
        if(resp.data.code === 20000){
          this.tableData.splice(index,1)
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }
      })
    },
    initComment(){
      axios({
        method: 'get',
        url: process.env.VUE_APP_severURL + '/getCommentForAdmin',
        contentType: 'application/x-www-form-urlencoded',
      }).then(resp => {
        if (resp.data.code === 20000){

          this.tableData = resp.data.data
          this.tableData.splice(0,0)
          this.$message({
            message: '评论列表加载成功！',
            type: 'success'
          })
        }
      })

      axios({
        method: 'get',
        url: process.env.VUE_APP_severURL + '/getUserList',
        contentType: 'application/x-www-form-urlencoded',
      }).then(resp => {
        if (resp.data.code === 20000){
          // 用户列表
          this.userList = resp.data.data
        }
      })

      this.get_videos()
    },
  },
}
</script>

<style scoped>
.el-button{
  margin-left: 10px;
}
</style>
