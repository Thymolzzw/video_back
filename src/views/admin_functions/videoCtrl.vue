<template>
  <div id="main">

    <div id="video_list">
      <el-row>
        <el-col :span="5.5" v-for="(item1, index) in promoList" :key="index" style="padding: 10px">
          <el-card style="height: 280px; width: 280px" :body-style="{ padding: '2px' }" shadow="hover">
            <img style="height: 150px; border-radius:8px" :src="item1.snapshoot_img" class="image">
            <div style="padding: 14px; ">
              <el-tooltip effect='light' placement='bottom' :content='item1.title'>
                <span style="white-space:nowrap">{{ item1.title }}</span>
              </el-tooltip>
              <div class="bottom clearfix">
                <img src='@/assets/video.png' alt=''>
                <p style="width: 50px;">{{item1.length}}</p>
                <img src='@/assets/source.png' alt=''>
                <p style="width: 80px;">{{item1.source}}</p>
                <img src='@/assets/clock.png' alt=''>
                <p class="time" style="width: 80px;">{{item1.add_time}}</p>
              </div>
              <div class='function_top'>
                <p>功能：</p>
                <div class='function_items' v-for='(item,index) in item1.functions' :key="index">
                  <el-tooltip class='item' effect="dark" :content="function_imgs[item].label" placement="right">
                    <img class='funcImg' :src='function_imgs[item].path' alt=''>
                  </el-tooltip>
                </div>
              </div>
              <div class='function'>
                <el-button type="primary" @click="clickFunction(item1)">增加功能</el-button>
                <el-dialog
                  title="增加功能"
                  :visible="addFunction"
                  width="20%"
                  left>
                  <el-checkbox-group v-model="checkList" class="addfunDialog">
                    <div v-for='(ii,index1) in function_imgs' :key="index1">
                      <el-checkbox :label="index1" :disabled='promoListItem[0].functions.includes(index1)'>{{ii.label}}</el-checkbox>
                    </div>
                  </el-checkbox-group>
                  <span slot="footer" class="dialog-footer">
                    <el-button @click="offDialog">取 消</el-button>
                    <el-button type="primary" @click="handleClose(promoListItem[0].id)">确 定</el-button>
                  </span>
                </el-dialog>
                <div class='function_bottom'>
                  <el-popconfirm
                    title="确定删除该视频吗？"
                    @onConfirm="del_video(item1.id)">
                    <el-button slot="reference" type="danger" class="button" >删除视频</el-button>
                  </el-popconfirm>
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

export default ({
  data(){
    return{
      banners: [],
      promoList: [],
      addFunction:false,
      checkList:[],
      promoListItem:[{id:'0',functions:[]}],
      currentDate: new Date(),
      function_imgs:[{path:require('@/assets/f1.png'),label:'人脸检测'}, 
                  {path:require('@/assets/f2.png'),label:'目标检测与识别'}, 
                  {path:require('@/assets/f3.png'),label:'PPT画面检测'}, 
                  {path:require('@/assets/f4.png'),label:'自然场景文本识别'}, 
                  {path:require('@/assets/f5.png'),label:'语音识别与翻译'}, 
                  {path:require('@/assets/f6.png'),label:'声纹识别'}],
    }
  },
  computed: {
  },
  created() {

  },
  mounted() {
    console.log('src/views/admin_functions/videoCtrl.vue')
    this.get_videos()
  },
  methods: {
    time_2_date: function (stamp) {
      var date1 = new Date(stamp)
      return date1.toLocaleDateString().replace(/\//g, "-") + " " + stamp.toTimeString().substr(0, 8);
    },
    del_video: function (videoId) {
      let param = new URLSearchParams()
      param.append('videoId', videoId)
      let config = {
        headers: { 'Accept-Ranges': 'bytes' }
      }
      axios({
        method: 'get',
        url: process.env.VUE_APP_severURL + '/deletevideo',
        params: param,
        headers: config.headers
      })
        .then(resp => {
          // this.addition_data = resp.data.addition_data
          this.$alert('删除成功', '结果', {
            confirmButtonText: '确定',
          });
          this.get_videos()
        })
    },
    get_videos: function () {
      axios.get(process.env.VUE_APP_severURL + '/getAllVideos')
        .then(res => {
          this.promoList = res.data.video_items
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
    clickFunction(e){
      this.addFunction = true
      this.promoListItem = []
      this.promoListItem.push(e)
    },
    searchVideosByTitle(data){
      console.log('搜索视频', data)
      let param = new FormData()
      param.append('key', data)
      param.append('sourceID', '0')
      param.append('function', '0')
      axios({
        method: 'post',
        url: process.env.VUE_APP_severURL + '/searchHomeVideos',
        data: param,
      }).then(resp => {
        this.promoList = resp.data.video_items
      })
    },
    offDialog(){
      this.addFunction = false
      this.checkList = []
    },
    handleClose(id){
      this.addFunction = false
      let param = new FormData()
      param.append('videoID',id)
      param.append('function',this.checkList)
      console.log("test", this.checkList)
      axios({
        method: 'post',
        url: process.env.VUE_APP_severURL + '/addFunctions',
        data: param,
      }).then(resp=>{
        console.log(resp.data)
      })
      this.checkList = []
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

.bottom {
  display:flex;
  flex-direction:row;
  align-items: center;
  line-height: 20px;
  padding-top:10px;
}
.bottom > img {
  max-height:20px;
}
.bottom > p {
  font-size:13px;
  color: #999;
  margin-block-start: 0em;
  margin-block-end: 0em;
  text-overflow:ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.function{
  padding-top:10px;
  display:flex;
  flex-direction:row;
  justify-content: space-between;
}
.function_top{
  padding-top: 10px;
  display:flex;
  flex-direction:row;
   align-items:center;
}
.function_top > p{
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
.addfunDialog{
  height: 250px;
  display: flex;
  flex-direction: column;
  justify-content:space-between;
}
.el-tooltip__popper {
  padding:5px !important;
}

.el-button {
  padding: 0;
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
