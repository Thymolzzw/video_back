<template>
  <div id="main">
    <el-carousel :interval="4000"  height="320px">
      <el-carousel-item v-for="(item, index) in banners" :key="index">
        <div v-on:click="aaa(index)" style="width: 100%; height: 100%">
<!--          <h3 class="medium">{{ item }}</h3>-->
          <img :src="item.fields.img" style="height: 320px; width: 100%"/>
        </div>
      </el-carousel-item>
    </el-carousel>

    <div id="video_list">
      <el-row>
        <el-col :span="8" v-for="(item1, index) in promoList" :key="index" style="padding: 10px" @click.native="to_play_video(item1.pk)">
          <el-card :body-style="{ padding: '2px' }" shadow="hover">
            <img :src="item1.fields.snapshoot_img" class="image">
            <div style="padding: 14px;">
              <span>{{ item1.fields.title }}</span>
              <div class="bottom clearfix">
                <time class="time">{{ currentDate }}</time>
<!--                <router-link :to="{ name: 'readDetail', params: { msgKeyOne: 'jump test.' }}">-->
<!--                  <button type="button">跳转</button>-->
                  <el-button type="text" class="button">查看视频</el-button>
<!--                </router-link>-->

              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
<!--      <ul style="list-style:none">-->
<!--&lt;!&ndash;        <li v-for="(item, index) in promoList" :key="index">&ndash;&gt;-->
<!--&lt;!&ndash;      　<div style="height: 137px; width: 200px;">&ndash;&gt;-->
<!--&lt;!&ndash;          <img :src="item.fields.snapshoot_img" style="height: 137px; width: 200px;" />&ndash;&gt;-->
<!--&lt;!&ndash;        </div>&ndash;&gt;-->
<!--&lt;!&ndash;        </li>&ndash;&gt;-->
<!--        <li>-->
<!--          -->
<!--        </li>-->
<!--      </ul>-->
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
      alert(msg)
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
