<template>
  <div id="video_list">
    <el-row>
      <el-col :span="5.5" v-for="(item1, index) in promoList" :key="index" style="padding: 10px" >
        <el-card style="height: 230px; width: 300px" :body-style="{ padding: '2px' }" shadow="hover" @click.native="to_play_video(item1.pk)">
          <img style="height: 150px" :src="item1.fields.snapshoot_img" class="image">
          <div style="padding: 14px;">
            <span>{{ item1.fields.title }}</span>
            <div class="bottom clearfix">
              <time class="time">{{ item1.fields.create_time }}</time>

            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import axios from 'axios'
import store from "../../store/index";
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
      axios.get(process.env.VUE_APP_severURL + '/getHotVideos')
        .then(res => {
          console.log(res.data.data)
          this.promoList = res.data.data
          this.promoList.reverse()
          // while(this.promoList.length > 10){
          //   this.promoList.pop()
          // }
        })
    },
    to_play_video: function (event) {
      let param = new URLSearchParams()
      param.append('videoId', event)
      param.append('user_id', store.state.user.user_info.id)
      axios({
        method: 'get',
        url: process.env.VUE_APP_severURL + '/clickVideo',
        contentType: 'application/x-www-form-urlencoded',
        params: param,
      }).then(resp => {
        if(resp.data.code === 20000){
          this.$router.push({
            path: '/player',
            name: '视频播放详情页',
            query: {
              video_id: event
            }
          })
        }
      })
    },
  }
}
</script>

<style scoped>

</style>


