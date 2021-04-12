<template>
  <div id="video_list">
    <el-row>
      <el-col :span="8" v-for="(item1, index) in promoList" :key="index" style="padding: 10px" @click.native="to_play_video(item1.pk)">
        <el-card :body-style="{ padding: '2px' }" shadow="hover">
          <img :src="item1.fields.snapshoot_img" class="image">
          <div style="padding: 14px;">
            <span>{{ item1.fields.title }}</span>
            <div class="bottom clearfix">
              <time class="time">{{ currentDate }}</time>
              <el-button type="text" class="button">查看视频</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data(){
    return{
      promoList: [],
      currentDate: new Date()
    }
  },
  mounted() {
    this.get_videos()
  },
  name: 'index',
  methods: {
    get_videos: function () {
      axios.get(process.env.VUE_APP_severURL + '/getAllVideos')
        .then(res => {
          console.log(res.data.data)
          this.promoList = res.data.data
        })
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
  }
}
</script>

<style scoped>

</style>
