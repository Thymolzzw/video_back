<template>
  <div class="block">
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
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
import store from "@/store";
import axios from "axios";

export default {

  data() {
    return {
      has_videos: false,
      timeline: [

      ]
    }
  },
  mounted() {
    // alert(store.state.user.user_info.id)
    this.getLikes()
  },
  methods: {
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
    getLikes(){
      let param = new URLSearchParams()
      param.append('user_id', store.state.user.user_info.id)
      axios({
        method: 'get',
        url: process.env.VUE_APP_severURL + '/getLikes',
        contentType: 'application/x-www-form-urlencoded',
        params: param,
        // headers: config.headers
      }).then(resp => {
        if (resp.data.code === 20000){
          // 收藏中有视频
          this.has_videos = true
          // console.log(resp.data)
          this.timeline = resp.data.data
        }else{
          // 收藏中没有视频
          this.has_videos = false
        }
      })
    },
  },
}
</script>
