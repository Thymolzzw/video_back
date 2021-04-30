<template>
  <div class="block">
    <div v-if="has_videos === false">无内容</div>
    <el-timeline v-if="has_videos === true">
      <el-timeline-item v-for="(item,index) of timeline" :key="index" :timestamp="item.createDate" placement="top">
        <el-card style="height: auto; width: 300px" :body-style="{ padding: '2px' }" shadow="hover" @click.native="to_play_video(item.video_object[0].pk)">
          <div style="padding: 14px;">
            <span>视频标题：{{item.video_title}}</span>
            <div style="margin-top: 5px">
              <span>评论内容：{{item.content}}</span>
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
  components: {

  },
  data() {
    return {
      has_videos: false,
      timeline: [

      ]
    }
  },
  mounted() {
    // alert(store.state.user.user_info.avatar)
    this.getComments()
  },
  methods: {
    getComments(){
      let param = new URLSearchParams()
      param.append('user_id', store.state.user.user_info.id)
      axios({
        method: 'get',
        url: process.env.VUE_APP_severURL + '/getComments',
        contentType: 'application/x-www-form-urlencoded',
        params: param,
      }).then(resp => {
        if (resp.data.code === 20000){
          // 收藏中有视频
          this.has_videos = true
          console.log(resp.data)
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
