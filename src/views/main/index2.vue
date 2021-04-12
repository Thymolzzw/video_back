<template>
  <div id="main">
    <el-carousel :interval="4000"  height="320px">
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
          <el-card style="height: 230px; width: 300px" :body-style="{ padding: '2px' }" shadow="hover" @click.native="to_play_video(item1.pk)">
            <img style="height: 150px" :src="item1.fields.snapshoot_img" class="image">
            <div style="padding: 14px;">
              <span>{{ item1.fields.title }}</span>
              <div class="bottom clearfix">
                <time class="time">{{ item1.fields.create_time }}</time>
<!--                <p>{{ this.time_2_date(item1.fields.create_time) }}</p>-->
                <!--                <router-link :to="{ name: 'readDetail', params: { msgKeyOne: 'jump test.' }}">-->
                <!--                  <button type="button">跳转</button>-->
<!--                <el-button type="text" class="button">查看视频</el-button>-->
                <!--                </router-link>-->

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

export default ({
  data(){
    return{
      banners: [],
      promoList: [],
      currentDate: new Date()
    }
  },
  computed: {
    // player() {
    // return this.$refs.videoPlayer.player
    // }
  },
  created() {

  },
  mounted() {
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
          console.log(res.data.data)
          this.promoList = res.data.data
          this.promoList.reverse()
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
    }
  }
})
</script>

<style>
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

/*li {*/
/*  float: left;*/
/*  display: inline-block;*/
/*  !*background-color: #0a76a4;*!*/
/*  !*width: 25%;*!*/
/*}*/

.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 20px;
}

.button {
  padding: 0;
  float: right;
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
