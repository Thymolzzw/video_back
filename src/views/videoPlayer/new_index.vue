<template>
  <div id="videoPlayer">
    <div style="width: 100%">
      <div id="player" style="width: 70%;float: left">
        <video
          id="myVideo"
          class="video-js vjs-big-play-centered vjs-fluid"
          controls
          preload="auto"
          width="100%"
          height="100%"
          :poster="aggregationData.BannerImage"
        >
          <source
            type="video/mp4"
            :src="aggregationData.BannerVideo"
          >
        </video>
      </div>
      <div id="word" style="width: 30%;background-color: #0a76a4; float: right; height: 100%">
        aaaaaaa
      </div>
    </div>

    <br style="clear: both;">

    <el-tabs type="border-card" id="videoTab" style="width: 100%">
      <el-tab-pane label="用户管理">用户管aa理</el-tab-pane>
      <el-tab-pane label="文本识别">
        <ul id="zu" v-for="(item, index) in textarea" :key="index">
          <li>
            <p > </p>
            <h4>{{ item.time }} - </h4> <h3>{{ item.content }}</h3>
          </li>
        </ul>
      </el-tab-pane>

      <el-tab-pane label="人脸检测">
        <div v-for="(item, index) in faces" :key="index">
          <div>
            <div style="width: 36%; height: auto; display: inline-block">
              <img :src=item.urls[0].img style="width: 300px;">
              <p>{{ item.name }}</p>
            </div>
            <div class="demo-image__lazy" style="display: inline-block; float: right">
              <ul id="faces">
                <li>
                  <p>{{ item.name }}</p>
                  <el-image v-for="url in item.urls" :key="url" :src="url.img" lazy style="width: 280px;"></el-image>
                </li>
              </ul>
            </div>
          </div>

        </div>

      </el-tab-pane>

      <el-tab-pane label="定时任务补偿">定a时任务补偿</el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
import 'videojs-flash';
import axios from 'axios'
export default {
  name: "index",
  data() {
    return{
      cur: 0,
      video_id: 0,
      rel_path: '',
      textarea: '',
      faces: [],


    }
  },
  mounted() {
    // this.$refs.videoPlayer.player.src(this.$route.query.video_url)
    this.video_id = this.$route.query.video_id
    console.log('src/views/VideoPlayer/new_index.vue',this.video_id)
    this.get_video_data()
    this.get_detect_text()
    this.get_faces()
  },
  methods:{
    onPlayerPause (player) {
      //监听暂停
      console.log('new_index.vue 暂停');
      // 暂停时时间
      console.log(player.duration());
      this.$emit('onPlayerPauseFun', player);
    },

    videoUrl(val) {
      if (val !== '') {
        this.$refs.videoPlayer.player.src(val)

      }
    },
    initVideo() {   //此处初始化的调用，我放在了获取数据之后的方法内，而不是放在钩子函数mounted
      //页面dom元素渲染完毕，执行回调里面的方法
      this.$nextTick(() => {
        let myPlayer = this.$video(document.getElementById('myVideo'), {
          //确定播放器是否具有用户可以与之交互的控件。没有控件，启动视频播放的唯一方法是使用autoplay属性或通过Player API。
          controls: true,
          //自动播放属性,muted:静音播放
          autoplay: false,
          //建议浏览器是否应在<video>加载元素后立即开始下载视频数据。
          preload: "auto",
          //设置视频播放器的显示宽度（以像素为单位）
          // width: "800px",
          //设置视频播放器的显示高度（以像素为单位）
          // height: "400px",
          controlBar:{
            playToggle:true
          }
        });
      })

    },
    get_video_data: function () {
      // alert(this.video_id)
      let param = new URLSearchParams()
      param.append('videoId', this.video_id)
      // alert(param)
      axios({
        method: 'get',
        url: process.env.VUE_APP_severURL + '/getOneVideos',
        contentType: 'application/x-www-form-urlencoded',
        params: param
        //   {
        //   videoId: this.video_id
        // }
      })
        .then(resp => {
          // console.log(resp)
          // alert(resp.data.data[0].fields.rel_path)
          this.videoUrl(resp.data.data[0].fields.rel_path)
          this.playerOptions['sources'][0]['src'] = resp.data.data[0].fields.rel_path
          this.rel_path = resp.data.data[0].fields.rel_path
        })
    },
    get_detect_text: function () {
      axios({
        method: 'get',
        url: process.env.VUE_APP_severURL + '/getText',
        contentType: 'application/x-www-form-urlencoded',
      })
        .then(resp => {
          // console.log(resp)
          // alert(resp.data.data[0].fields.rel_path)
          // console.log(resp.data.data)
          this.textarea = resp.data.data
        })
    },
    get_faces: function () {
      axios({
        method: 'get',
        url: process.env.VUE_APP_severURL + '/getAllPeopleFace',
        contentType: 'application/x-www-form-urlencoded',
      })
        .then(resp => {
          console.log(resp.data.data)
          for (var index in resp.data.data) {
            console.log(resp.data.data[index])
            this.faces.push({'name': resp.data.data[index].name, 'urls': resp.data.data[index].time_img})
            // if(resp.data.data[index].name != name_temp) {
            //   name_temp = resp.data.data[index].name
            //   url_temp.push(resp.data.data[index].img)
            //   continue
            // }else{
            //   url_temp.push(resp.data.data[index].img)
            //   continue
            // }
          }

          console.log(this.faces)
          // this.urls = resp.data.data
        })
    },
    poster(n, o) {
      if(n) {
        this.$refs.videoPlayer.player.poster(n);
      }
    },

  }
}
</script>

<style scoped>

</style>
<style type="text/css">
ul li {
  margin: 0;
  padding: 0;
  list-style: none;
}
#videoTab {
  width: 100%;
  height: auto;
  margin: 0 auto;
  border: 1px solid #ccc;
}
.tab-tilte{
  width: 90%;
}
.tab-tilte li{
  float: left;
  width: 25%;
  padding: 10px 0;
  text-align: center;
  background-color:#f4f4f4;
  cursor: pointer;
}
/* 点击对应的标题添加对应的背景颜色 */
.tab-tilte .active{
  background-color: #09f;
  color: #66b2ec;
}
.tab-content div{
  float: left;
  width: 25%;
  line-height: 100px;
  text-align: center;
}
</style>
