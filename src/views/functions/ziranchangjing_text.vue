<template>
  <div id="video_list">
    <el-row>
      <el-col :span="5.5" v-for="(item1, index) in promoList" :key="index" style="padding: 10px" >
        <el-card style="height: 250px; width: 280px" :body-style="{ padding: '2px' }" shadow="hover" @click.native="to_play_video(item1.id)">
          <img style="height: 150px; border-radius:8px" :src="item1.snapshoot_img" class="image">
          <div style="padding: 14px;">
            <el-tooltip effect='light' placement='bottom' :content='item1.title'>
              <span style="white-space:nowrap">{{ item1.title }}</span>
            </el-tooltip>
            <div class="bottom clearfix">
              <img src='@/assets/video.png' alt=''>
              <p>{{item1.video_time}}</p>
              <img src='@/assets/source.png' alt=''>
              <p>{{item1.source}}</p>
              <img src='@/assets/clock.png' alt=''>
              <p class="time">{{item1.create_time}}</p>
            </div>
            <div class='function'>
              <p>功能：</p>
              <div class='function_items' v-for='(item,index) in item1.functions' :key="index">
                <el-tooltip class='item' effect="dark" :content="function_imgs[item].label" placement="right">
                  <img class='funcImg' :src='function_imgs[item].path' alt=''>
                </el-tooltip>
              </div>
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
      currentDate: new Date(),
      function_imgs:[{path:require('@/assets/f1.png'),label:'人脸检测'}, 
                  {path:require('@/assets/f2.png'),label:'目标检测与识别'}, 
                  {path:require('@/assets/f3.png'),label:'PPT画面检测'}, 
                  {path:require('@/assets/f4.png'),label:'自然场景文本识别'}, 
                  {path:require('@/assets/f5.png'),label:'语音识别与翻译'}, 
                  {path:require('@/assets/f6.png'),label:'声纹识别'}],
    }
  },
  mounted() {
    console.log('src/views/functions/ziranchangjing_text.vue')
    this.get_videos()
  },
  name: 'index',
  methods: {
    get_videos: function () {
      let param = new URLSearchParams()
      param.append('function', 3)
      axios({
        method: 'get',
        url: process.env.VUE_APP_severURL + '/getVideosWithFunction',
        contentType: 'application/x-www-form-urlencoded',
        params: param,
      }).then(resp => {
        if(resp.data.code === 20000){
          this.promoList = resp.data.video_items
          console.log(this.promoList)
        }
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
.image {
  width: 100%;
  display: block;
  background-color: white;
}
.bottom {
  display:flex;
  flex-direction:row;
  align-items: center;
  line-height: 13px;
  padding-top:10px;
}
.bottom > img {
  max-height:20px;
}
.bottom > p {
  font-size:13px;
  color: #999;
  padding-right: 10px;
  margin-block-start: 0em;
  margin-block-end: 0em;
}
.function{
  padding-top:10px;
  display:flex;
  flex-direction:row;
  align-items:center;
}
.function > p{
  font-size:13px;
  color: #999;
  margin-block-start: 0em;
  margin-block-end: 0em;
}
.function_items{
  display: flex;
  flex-direction: row;
  align-items: center;
}
.funcImg{
  max-height:16px;
}
.el-tooltip__popper {
  padding:5px !important;
}
.el-row{
  padding-top:10px;
  padding-bottom:10px;
}
.el-input{
  padding-right:10px !important;
}
</style>
