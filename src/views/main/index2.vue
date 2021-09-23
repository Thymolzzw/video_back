<template>
  <div id="main">
    <el-carousel :interval="4000"  height="280px">
      <el-carousel-item v-for="(item, index) in banners" :key="index">
        <div v-on:click="aaa(item.fields.video_id)" style="width: 100%; height: 100%">
          <!--          <h3 class="medium">{{ item }}</h3>-->
          <img :src="item.fields.img" style="height: 320px; width: 100%"/>
        </div>
      </el-carousel-item>
    </el-carousel>

    <div id="video_list">
      <el-row>
        <el-col :span="5.5" v-for="(item1, index) in promoList" :key="index" style="padding: 10px" >
          <el-card style="height: 250px; width: 280px" :body-style="{ padding: '2px' }" shadow="hover" @click.native="to_play_video(item1.id)">
            <img style="height:150px;border-radius:8px" :src="item1.snapshoot_img" class="image">
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
  </div>
</template>

<script lang="ts">
import axios from 'axios'
import store from "../../store/index";

export default ({
  data(){
    return{
      banners: [],
      promoList: [],
      function_imgs:[{path:require('@/assets/f1.png'),label:'人脸检测'}, 
                     {path:require('@/assets/f2.png'),label:'目标检测与识别'}, 
                     {path:require('@/assets/f3.png'),label:'PPT画面检测'}, 
                     {path:require('@/assets/f4.png'),label:'自然场景文本识别'}, 
                     {path:require('@/assets/f5.png'),label:'语音识别与翻译'}, 
                     {path:require('@/assets/f6.png'),label:'声纹识别'}],
      currentDate: new Date()
    }
  },
  computed: {
  },
  created() {

  },
  mounted() {
    console.log('src/views/main/index2.vue')
    this.get_banners()
    this.get_videos()
  },
  methods: {
    time_2_date: function (stamp) {
      var date1 = new Date(stamp)
      return date1.toLocaleDateString().replace(/\//g, "-") + " " + stamp.toTimeString().substr(0, 8);
    },
    get_banners: function () {
      axios.get(process.env.VUE_APP_severURL + '/getBinner')
        .then(res => {
          console.log(res.data.data)
          this.banners = res.data.data
        })
    },
    get_videos: function () {
      axios.get(process.env.VUE_APP_severURL + '/getAllVideos')
        .then(res => {
          this.promoList = res.data.video_items
          // console.log(this.promoList)
        })
    },
    to_play_video: function (event) {
      console.log('src/views/main/index2.vue 开始播放视频',event)
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
    aaa: function (msg) {
      // alert(msg)
      if (msg){
        this.$router.push({
          path: '/player',
          name: '视频播放详情页',
          query: {
            video_id: msg
          }
        })
      }else{
        this.$message.error('该图没有指向的视频！');
      }

      return 0;
    },
    searchVideosByTitle(data){
      console.log('搜索视频', data)
      let param = new FormData()
      param.append('key', data)
      param.append('sourceID', '0')
      axios({
        method: 'post',
        url: process.env.VUE_APP_severURL + '/searchHomeVideos',
        contentType: 'application/x-www-form-urlencoded',
        data: param,
      }).then(resp => {
        this.promoList = resp.data.video_items
      })
    }
  }
})
</script>

<style scoped>
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}
.el-card__body{
  height: 250px; 
  width: 280px;
  display: flex;
  flex-direction: column;
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

.image {
  width: 100%;
  display: block;
  background-color: white;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}
</style>
<style>
#div::-webkit-scrollbar{
  display: none;
}
.element::-webkit-scrollbar { width: 0 !important }
.element { -ms-overflow-style: none; }
.element { overflow: -moz-scrollbars-none; }
</style>
