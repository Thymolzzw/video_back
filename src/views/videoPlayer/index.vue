<template>
  <div id="videoPlayer">
    <div style="width: 100%">
      <div id="player" style="width: 70%;float: left">
        <video-player class="video-player vjs-custom-skin"
                      ref="videoPlayer"
                      :playsinline="true"
                      :options="playerOptions"
                      @play="onPlayerPlay($event)"
                      @pause="onPlayerPause($event)"
                      @statechanged="playerStateChanged($event)"
                      @loadeddata="onPlayerLoadeddata($event)"
                      @timeupdate="onPlayerTimeupdate($event)"
        >
          <track style="width: 200px;" kind="captions" :src=subtitle srclang="en" label="English"/>
        </video-player>
        <!--        <track kind='captions' :src=subtitle srclang='en' label='English' />-->
      </div>
      <div id="word" style="width: 30%;background-color: #0a76a4; float: right; height: 100%" ref="zimu">
        <el-input
          type="textarea"
          :rows="20"
          placeholder="此视频无语音识别结果！"
          v-model="textarea1"
          class="textarea"
          disabled
        >
        </el-input>
      </div>
      <el-button type="primary" v-on:click="exportRaw('template.txt',textarea1)">导出TXT文本</el-button>
    </div>

    <br style="clear: both;">

    <el-tabs type="border-card" id="videoTab" style="width: 100%">
      <el-tab-pane label="视频信息"></el-tab-pane>
      <el-tab-pane label="目标检测">
        <el-button type="primary" v-on:click="downloadPdf('mubiao')">导出pdf</el-button>
        <div ref="mubiao">
          <div style="width: 100%; height: 200px; border-bottom: 2px solid" v-for="(item, index) in equipment_json_data"
               :key="index"
          >
            <div style="width: 33%;display: inline-block; padding: 0">
              <img style="height: 199px; " :src="item.filename"/>
            </div>
            <div style="width: 65%; display: inline-block">
              <div style="height: 59px; ">
                <h1>{{ item.objects[0].name }}</h1>
              </div>
              <div style="height: 200px; display: block">
                <!--                <h4>{{ item.objects[0].name }}</h4>-->
                <h4></h4>
                <br>
              </div>
              <!--            <hr>-->
            </div>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="文本识别">
        <el-button type="primary" v-on:click="downloadPdf('wenben')">导出pdf</el-button>
        <div ref="wenben">
          <div style="width: 100%; height: 280px; border-bottom: 2px solid" v-for="(item, index) in textarea"
               :key="index"
          >
            <div style="width: 33%;display: inline-block;">
              图{{ index + 1 }}
            </div>
            <div style="width: 67%; display: inline-block">
              <div style="height: 75px; padding-top: 5px;">
                <h1>{{ item.time }}</h1>
              </div>
              <div style="height: 200px;">
                <h4>{{ item.content }}</h4>
              </div>
              <!--            <hr>-->
            </div>
          </div>
        </div>

      </el-tab-pane>

      <el-tab-pane label="人脸检测">
        <el-button type="primary" v-on:click="downloadPdf('renlian')">导出pdf</el-button>
        <div ref="renlian">
          <div v-for="(item, index) in faces" :key="index">
            <div>
              <div style="width: 36%; height: auto; display: inline-block">
                <img :src=item.urls[0].img style="width: 300px;">
                <p>{{ item.name }}</p>
              </div>
              <div class="demo-image__lazy" style="display: inline-block; float: right">
                <ul id="faces">
                  <li style="width: auto; height: auto; overflow-x: auto; white-wrap: nowrap;">
                    <div style="width: auto; height: auto; display: inline-block; overflow: auto; white-wrap: nowrap;"
                         v-for="url in item.urls" :key="url"
                    >
                      <p style="text-align: center">{{ url.time }}</p>
                      <!--                    <el-image v-for="url in item.urls" :key="url" :src="url.img" lazy style="width: 280px;"></el-image>-->
                      <img :src="url.img" style="width: 280px; height: 166px; display: inline-block"/>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>


        </div>

      </el-tab-pane>

      <el-tab-pane label="声纹识别">
        <h3>请选择需要语音识别的范围</h3>
<!--        <el-row>-->
<!--          <el-time-picker-->

<!--            v-model="value1"-->
<!--            range-separator="至"-->
<!--            start-placeholder="开始时间"-->
<!--            end-placeholder="结束时间"-->
<!--            value-format="HH:mm:ss"-->
<!--            placeholder="选择时间范围"-->
<!--          >-->
<!--          </el-time-picker>-->
<!--          <el-button type="primary" v-on:click="get_shengwen()">提交识别</el-button>-->
<!--        </el-row>-->

      </el-tab-pane>
      <el-tab-pane label="研讨场景PPT检测">
        <el-button type="primary" @click="get_ppt_pdf_path">点击下载PDF文件</el-button>
        <el-row>
<!--          <el-col v-for="(item, index) in ppt_imgs" :key="index">-->
            <div style="width: 500px; display: inline-block; float: left" v-for="(item, index) in ppt_imgs" :key="index">
              <el-image fit="fill" :src="item" ></el-image>
            </div>
<!--          </el-col>-->
        </el-row>
      </el-tab-pane>

    </el-tabs>

  </div>
</template>

<script>
import 'videojs-flash'
import axios from 'axios'
import html2canvas from 'html2canvas'
import jspdf from 'jspdf'

export default {
  name: 'index',
  data() {
    return {
      cur: 0,
      video_id: 0,
      rel_path: '',
      textarea: '',
      textarea1: '',
      faces: [],
      video_text: '',
      subtitle: '',
      txt_subtitle: '',
      renlian: '',
      txt_subtitle_arr: [],
      equipment_json_data: '',
      video_time: 0,
      selectableRange: '',
      ppt_pdf_path: '',
      ppt_imgs: '',

      value1: [new Date(2016, 9, 1, 0, 0, 0), new Date(2016, 9, 1, 0, 1, 0)],
      // new Date(2016, 9, 1, 0, 0, 0)
      playerOptions: {
        playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
        autoplay: false, //如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [{
          type: 'video/mp4', // 这里的种类支持很多种：基本视频格式、直播、流媒体等，具体可以参看git网址项目
          src: this.rel_path //url地址
        }],
        poster: '../../static/images/test.jpg', //你的封面地址
        // width: document.documentElement.clientWidth, //播放器宽度
        notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true  //全屏按钮
        }
      }

    }
  },
  mounted() {
    // this.$refs.videoPlayer.player.src(this.$route.query.video_url)
    this.video_id = this.$route.query.video_id
    console.log('src/views/VideoPlayer/index.vue',this.video_id)
    if (this.video_id === undefined) {
      this.video_id = 1
    }
    this.get_video_data()
    // this.get_txt_subtitle()
    // this.rel_path = require('/Users/cuiky/all_projects/PycharmProjects/sift_video/video/test.mp4')
    this.get_detect_text()
    this.get_faces()
  },
  methods: {
    onPlayerPause(player) {
      // 监听暂停
      console.log('index.vue 暂停')
      // 暂停时时间
      // console.log(player.duration());
      this.$emit('onPlayerPauseFun', player)
    },
    onPlayerPlay(player){

    },
    playerStateChanged(player){

    },
    onPlayerLoadeddata(player){

    },
    onPlayerTimeupdate(player){

    },
    fakeClick(obj) {
      var ev = document.createEvent('MouseEvents')
      ev.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
      obj.dispatchEvent(ev)
    },

    exportRaw(name, data) {
      var urlObject = window.URL || window.webkitURL || window
      var export_blob = new Blob([data])
      var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a')
      save_link.href = urlObject.createObjectURL(export_blob)
      save_link.download = name
      this.fakeClick(save_link)
    },
    // formatSeconds(value) {
    //   var theTime = parseInt(value)// 秒
    //   var middle = 0// 分
    //   var hour = 0// 小时
    //
    //   if (theTime > 60) {
    //     middle = parseInt(theTime / 60)
    //     theTime = parseInt(theTime % 60)
    //     if (middle > 60) {
    //       hour = parseInt(middle / 60)
    //       middle = parseInt(middle % 60)
    //     }
    //   }
    //   var result = ''
    //   if(parseInt(theTime) < 10){
    //     result = '0' + parseInt(theTime).toString()
    //   }else{
    //     result = '' + parseInt(theTime).toString()
    //   }
    //   if (middle > 0) {
    //     if(middle < 10){
    //       result = '0' + parseInt(middle).toString() + ':' + result
    //     }else{
    //       result = '' + parseInt(middle).toString() + ':' + result
    //     }
    //   }
    //   if (hour > 0) {
    //     if(hour < 10){
    //       result = '0' + parseInt(hour).toString() + ':' + result
    //     }else{
    //       result = '' + parseInt(hour).toString() + ':' + result
    //     }
    //   }
    //   return result
    // },
    videoUrl(val) {
      if (val !== '') {
        this.$refs.videoPlayer.player.src(val)
      }
    },
    get_video_data: function() {
      // alert(this.video_id)
      let param = new URLSearchParams()
      param.append('videoId', this.video_id)
      let config = {
        // headers: { 'Content-Type': 'multipart/form-data' }
        // headers: { 'enctype': 'multipart/form-data' }
        headers: { 'Accept-Ranges': 'bytes' }
      }
      // alert(param)
      axios({
        method: 'get',
        url: process.env.VUE_APP_severURL + '/getOneVideos',
        contentType: 'application/x-www-form-urlencoded',
        params: param,
        headers: config.headers
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
          this.subtitle = resp.data.data[0].fields.subtitle
          // alert(this.subtitle)
          this.txt_subtitle = resp.data.data[0].fields.asr_path
          // this.uploadPrivateKey()
          this.ppt_pdf_path = resp.data.data[0].fields.ppt_pdf_path
          this.ppt_imgs = resp.data.ppt_json
          // var subTitle = eval(resp.data.subTitle)
          var subTitle = JSON.stringify(resp.data.subTitle)
          var sub_obj = JSON.parse(subTitle)
          // alert(subTitle)

          for (var i = 0; i < sub_obj.length; i++) {
            // alert(sub_obj[i].id);  //取json中的值
            this.textarea1 += sub_obj[i].time
            this.textarea1 += sub_obj[i].content
          }

          // 获取目标检测
          this.equipment_json_data = resp.data.equipment_json_data
          // this.video_time = this.formatSeconds(parseInt(resp.data.video_time))
          //
          // var str = '00:00:00 - ' + this.video_time.toString()
          // this.selectableRange = '18:30:00 - 20:30:00'
          // this.selectableRange.push(str)
          // alert(this.selectableRange)
        })
    },
    get_shengwen: function() {
      alert(this.value1)
    },
    get_ppt_pdf_path: function() {
      window.location.href = this.ppt_pdf_path
      // window.open(this.ppt_pdf_path, "_blank")
    },
    get_detect_text: function() {
      axios({
        method: 'get',
        url: process.env.VUE_APP_severURL + '/getText',
        contentType: 'application/x-www-form-urlencoded'
      })
        .then(resp => {
          // console.log(resp)
          // alert(resp.data.data[0].fields.rel_path)
          // console.log(resp.data.data)
          this.textarea = resp.data.data
        })
    },
    get_faces: function() {
      axios({
        method: 'get',
        url: process.env.VUE_APP_severURL + '/getAllPeopleFace',
        contentType: 'application/x-www-form-urlencoded'
      })
        .then(resp => {
          // console.log(resp.data.data)
          for (var index in resp.data.data) {
            // console.log(resp.data.data[index])
            this.faces.push({ 'name': resp.data.data[index].name, 'urls': resp.data.data[index].time_img })
            // if(resp.data.data[index].name != name_temp) {
            //   name_temp = resp.data.data[index].name
            //   url_temp.push(resp.data.data[index].img)
            //   continue
            // }else{
            //   url_temp.push(resp.data.data[index].img)
            //   continue
            // }
          }

          // console.log(this.faces)
          // this.urls = resp.data.data
        })
    },
    uploadPrivateKey() {
      const privateKeyFile = this.txt_subtitle
      let reader = new FileReader()
      if (typeof FileReader === 'undefined') {
        this.$message({
          type: 'info',
          message: '您的浏览器不支持FileReader接口'
        })
        return
      }
      reader.readAsText(privateKeyFile)
      var _this = this
      reader.onload = function(e) {
        console.log('密钥文件内容')
        console.log(e.target.result)
        _this.textarea1 = e.target.result
      }
    },
    downloadPdf(link) {
      let target = this.$refs.wenben
      html2canvas(target, {
        useCORS: true, // 当图片是链接地址时，需加该属性，否组无法显示图片
        'imageTimeout': 0,
        'scale': 2,
        'width': 592,
        'height': 841
      })
        .then(canvas => {
          console.log(canvas)
          let contentWidth = canvas.width // 592px
          let contentHeight = canvas.height // 841px
          //一页pdf显示html页面生成的canvas高度;
          let pageHeight = contentWidth / 1080 * 1920
          //未生成pdf的html页面高度
          let leftHeight = contentHeight
          //页面偏移
          // let offsetX = 100;
          // let offsetY = 100;
          let offsetX = 0
          let offsetY = 0
          //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
          let imgWidth = 592 //imgWidth
          let imgHeight = 592 / contentWidth * contentHeight //imgHeight

          let pageData = canvas.toDataURL('image/jpeg', 1.0)

          // 第一个方向,第二个单位,第三个尺寸格式
          // landscape横向
          // let pdf = new jspdf('landscape', 'pt', 'a4');
          let pdf = new jspdf('', 'pt', 'a4')

          //有两个高度需区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
          //当内容未超过pdf一页显示的范围，无需分页
          if (leftHeight < pageHeight) {
            pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
          } else {
            while (leftHeight > 0) {
              pdf.addImage(pageData, 'JPEG', offsetX, offsetY, imgWidth, imgHeight)
              leftHeight -= pageHeight
              offsetX -= 592
              offsetY -= 841
              //避免添加空白页
              if (leftHeight > 0) {
                pdf.addPage()
              }
            }
          }
          let name = 'aaaaa.pdf' // 定义生成的pdf的文件名字
          pdf.save(name)
        })
    },
    poster(n, o) {
      if (n) {
        this.$refs.videoPlayer.player.poster(n)
      }
    }

  }
}
</script>

<style scoped>
.textarea >>> .el-textarea__inner {
  /*font-family:"Microsoft" !important;*/
  font-size: 15px;
  /*font-style: revert;*/
  color: #1e1e22;
}

.textarea >>> .el-textarea__inner::-webkit-input-placeholder {
  color: #1e1e22;
}

{

}
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

.tab-tilte {
  width: 90%;
}

.tab-tilte li {
  float: left;
  width: 25%;
  padding: 10px 0;
  text-align: center;
  background-color: #f4f4f4;
  cursor: pointer;
}

/* 点击对应的标题添加对应的背景颜色 */
.tab-tilte .active {
  background-color: #09f;
  color: #66b2ec;
}

.tab-content div {
  float: left;
  width: 25%;
  line-height: 100px;
  text-align: center;
}
</style>
