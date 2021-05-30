<template>
  <div class="block">
    <div v-if="has_videos === false">无内容</div>
    <div v-if="has_videos === true">
      <el-checkbox style="margin-left: 10px" :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">
        全选删除
      </el-checkbox>
      <el-button style="margin-left: 10px" type="danger" icon="el-icon-delete" circle @click="doDelete()"></el-button>
      <div style="margin: 15px 0;"></div>
      <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
      <el-timeline>
        <el-timeline-item v-for="(item,index) of timeline" :key="index" :timestamp="item.time" placement="top">
          <el-card style="height: auto; width: 300px" :body-style="{ padding: '2px' }" shadow="hover" @click.native="to_play_video(item.video_object[0].pk)">
            <img style="height: auto; width: 100%" :src="item.video_object[0].fields.snapshoot_img" class="image">
            <div style="padding: 14px;">
              <span>{{ item.video_object[0].fields.title }}</span>
              <div class="bottom clearfix">
                <time class="time">{{ item.video_object[0].fields.create_time }}</time>
              </div>
            </div>
          </el-card>
          <el-checkbox :label="item.id">删除</el-checkbox>
        </el-timeline-item>
      </el-timeline>
      </el-checkbox-group>
    </div>

  </div>
</template>

<script>
import store from "@/store";
import axios from "axios";

export default {

  data() {
    return {
      has_videos: false,
      timeline: [],
      checkedCities: [],
      checkAll: false,
      isIndeterminate: false,
      id_list: [],
    }
  },
  mounted() {
    // alert(store.state.user.user_info.id)
    this.getMyHistory()
  },
  methods: {
    doDelete(){
      console.log(this.checkedCities)
      if(this.checkedCities.length===0){
        this.$message({
          message: '删除前请选择内容！',
          type: 'warning'
        });
      }else{
        let param = new FormData()
        param.append('historyList', JSON.stringify(this.checkedCities))
        axios({
          method: 'post',
          url: process.env.VUE_APP_severURL + '/deleteHistory',
          contentType: 'application/x-www-form-urlencoded',
          data: param,
        }).then(resp => {
          if(resp.data.code === 20000){
            this.getMyHistory()
            this.$message({
              message: '删除成功！',
              type: 'success'
            });
          }
        });
      }
    },
    handleCheckAllChange(val) {
      this.checkedCities = val ? this.id_list : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.id_list.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.id_list.length;
    },
    to_play_video: function (event) {
      // alert(event)
      this.$router.push({
        path: '/player',
        name: '视频播放详情页',
        // params: {
        //   video_url: 'event'
        // },
        query: {
          video_id: event
        }
      })
    },
    getMyHistory(){
      let param = new URLSearchParams()
      param.append('user_id', store.state.user.user_info.id)
      axios({
        method: 'get',
        url: process.env.VUE_APP_severURL + '/getViewHistory',
        contentType: 'application/x-www-form-urlencoded',
        params: param,
        // headers: config.headers
      }).then(resp => {
        if (resp.data.code === 20000){
          // 收藏中有视频
          this.has_videos = true
          // console.log(resp.data)
          this.timeline = resp.data.data
          for(var i=0; i<resp.data.data.length; i++){
            this.id_list.push(resp.data.data[i].id)
          }
          console.log('histroy', this.id_list)
        }else{
          // 收藏中没有视频
          this.has_videos = false
        }
      })
    },
  },
}
</script>
