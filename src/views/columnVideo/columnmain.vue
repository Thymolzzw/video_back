<template>
  <div class='columnMain'>
    <div class='columnlist'>
      <div class='columntitle'>
        <img class='img1' src='@/assets/column.png' alt=''>
        <p class='p1'>专栏</p>
        <p class='p2'>|</p>
      </div>
      <div class='columncontent' id="columncontent">
        <p v-for="(item, index) in columnlist" :key='index'>{{item.resource_name}}</p>
      </div>
    </div>
    <div class='videolist'>
      <el-row>
        <el-col :span="5.5" v-for="(item1, index) in videolist" :key="index" style="padding: 10px" >
          <el-card style="height: 250px; width: 280px" :body-style="{ padding: '2px' }" shadow="hover" @click.native="to_play_video(item1.id)">
            <img style="height:150px;border-radius:8px;" :src="item1.snapshoot_img" class="image">
            <div style="padding: 14px;">
              <span>{{item1.title}}</span>
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

<script>
import axios from 'axios'
export default {
  data(){
    return{
      columnlist:[],
      videolist:[],
      sourceID:0,
      function_imgs:[{path:require('@/assets/f1.png'),label:'人脸检测'}, 
                     {path:require('@/assets/f2.png'),label:'目标检测与识别'}, 
                     {path:require('@/assets/f3.png'),label:'PPT画面检测'}, 
                     {path:require('@/assets/f4.png'),label:'自然场景文本识别'}, 
                     {path:require('@/assets/f5.png'),label:'语音识别与翻译'}, 
                     {path:require('@/assets/f6.png'),label:'声纹识别'}],
    }
  },
  mounted(){
    this.getColumnList()
    setTimeout(this.setChangeStyle,500)
    this.getVideolist()
  },
  methods: {
    getColumnList(){
      this.columnlist = []
      let config = {
        headers:{'Accept-Ranges': 'bytes'}
      }
      axios({
        method: 'get',
        url: process.env.VUE_APP_severURL + '/getResourceList',
        contenType: 'application/x-www-form-urlencoded',
        headers: config.headers
      }).then(resp => {
        var temp = {'resource_id':0, 'resource_name':'全部'}
        this.columnlist.push(temp)
        for(var i=0;i<resp.data.data.length;i++){
          var obj = {}
          obj.resource_id = resp.data.data[i].resource_id
          obj.resource_name = resp.data.data[i].resource_name
          this.columnlist.push(obj)
        }
      })
    },
    setChangeStyle(){
      var self = this;
      var list = document.getElementById('columncontent')
      var p = list.getElementsByTagName('p')
      p[0].className = 'active'
      for(var i=0;i<p.length;i++){
        var index = i
        p[i].onclick = function(){
          for(var j=0;j<p.length;j++){
            p[j].className = ''
          }
          this.className = 'active'
          for(var i=0;i< self.columnlist.length;i++){
            if(this.innerText == self.columnlist[i].resource_name){
              self.sourceID = i
              break
            }
          }
          self.getVideolist()
        }
      }
    },
    getVideolist(){
      let param = new FormData()
      param.append('sourceID', this.sourceID)
      axios({
        method: 'post',
        url: process.env.VUE_APP_severURL + '/getColumnVideos',
        contentType: 'application/x-www-form-urlencoded',
        data: param,
      }).then(resp => {
        this.videolist = resp.data.video_items
      })
    },
    to_play_video: function (event) {
      this.$router.push({
        path: '/player',
        name: '视频播放详情页',
        query: {
          video_id: event
        }
      })
    },
    searchVideosByTitle(data){
      console.log('搜索视频', data)
      let param = new FormData()
      param.append('key', data)
      param.append('sourceID', this.sourceID)
      axios({
        method: 'post',
        url: process.env.VUE_APP_severURL + '/searchHomeVideos',
        contentType: 'application/x-www-form-urlencoded',
        data: param,
      }).then(resp => {
        this.videolist = resp.data.video_items
      })
    }
  }
}
</script>

<style scoped>
.columnMain{
  width:100%;
  height:100%;
  margin-top:10px;
  margin-left:10px;
  display:flex;
  flex-direction:column;
  cursor: pointer;
}
.columnlist{
  width:99%;
  height:40px;
  display:flex;
  flex-direction:row;
  background:rgba(100,100,100,0.1);
  border-radius:25px;
}
.columntitle{
  display:flex;
  flex-direction:row;
  align-items:center;
  padding-left: 20px;
}
.img1{
  max-height:20px;
}
.videolist{
  flex:1;
}
.columncontent{
  display:flex;
  flex-direction:row;
  align-items:center;
}
.columntitle > p{
  font-size: 14px;
  margin-block-start: 0em;
  margin-block-end: 0em;
  padding-left: 10px;
}
.columncontent >p {
  font-size: 14px;
  margin-block-start: 0em;
  margin-block-end: 0em;
  padding-left: 10px;
  padding-right: 10px;
}
.p1{
  font-weight: bold;
}
.p2{
  color:gray;
}
.active{
  color: rgb(24, 144, 255);
}
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
</style>