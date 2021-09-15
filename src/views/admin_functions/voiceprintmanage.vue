<template>
  <div id="video_info">
    <div id="select_list">
      <el-select v-model="video_value" filterable placeholder="请选择">
        <el-option
          v-for="(item, index) in videos"
          :key="index"
          :label="item.label"
          :value="index">
          <span style="float: left">{{ item.label }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
        </el-option>
      </el-select>
      <el-button type="primary" @click="getVoicePrintData(video_value)">加载</el-button>
    </div>

    <div style="height: auto">
      <hr>
      <div v-for="(item, index) in voiceprintList" :key="index">

        <el-input type="input" v-model="voiceprintList[index].time" disabled></el-input>
        <el-input type="input" v-model="voiceprintList[index].score" disabled></el-input>
        <el-select v-model="voiceprintList[index].name" filterable placeholder="请选择">
          <el-option
            v-for="it in people_list"
            :key="it.people_id"
            :label="it.people_name"
            :value="it.people_name">
          </el-option>
        </el-select>
        <el-button type="primary" size="mini" round style="margin-left: 20px; margin-top: 5px" @click="update_voiceprint(index)">提交修改</el-button>

        <hr>
        <hr>
      </div>
    </div>
    <div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
const functions = ['人脸识别', '目标检测与识别', 'PPT画面检测', '自然场景文本识别', '语音识别与翻译', '声纹识别'];

export default {
  data(){
    return{
      video_value: '',
      promoList: [],
      videos: [],
      video_id: '',
      voiceprintList: [],
      people_list: [],
    }
  },
  mounted() {
    console.log('src/views/admin_functions/voiceprintmanage.vue')
    this.get_videos()
    this.get_people_list()
  },
  name: 'index',
  methods: {
    update_voiceprint(index){
      // alert(index)
      // alert(this.voiceprintList[index].name)
      let param = new FormData()
      param.append('videoId', this.video_id)
      param.append('update_json', JSON.stringify(this.voiceprintList))
      axios({
        method: 'post',
        url: process.env.VUE_APP_severURL + '/changeVoicePrint',
        contentType: 'application/x-www-form-urlencoded',
        data: param,
      }).then(resp => {
        if(resp.data.code === 20000){
          this.$alert('修改成功', '修改结果', {
            confirmButtonText: '确定',
          });

        }
      })

    },
    getVoicePrintData(value){
      this.video_id = this.promoList[value].id
      // alert(this.video_id)
      let param = new URLSearchParams()
      param.append('videoId', this.video_id)
      let config = {
        headers: { 'Accept-Ranges': 'bytes' }
      }
      axios({
        method: 'get',
        url: process.env.VUE_APP_severURL + '/getVideoVoicePrint',
        contentType: 'application/x-www-form-urlencoded',
        params: param,
        headers: config.headers
      }).then(resp => {
          this.voiceprintList = resp.data.data
          this.video_id = this.promoList[this.video_value].id
      })


    },
    get_videos: function () {
      axios.get(process.env.VUE_APP_severURL + '/getAllVideos')
        .then(res => {
          this.promoList = res.data.video_items
          let len = this.promoList.length
          let temp = {}
          for (let i = 0; i < len; ++i){
            temp = {
              value: '',
              label: this.promoList[i].title
            }
            this.videos.push(temp)
          }
          console.log()
        })
    },
    get_people_list: function () {
      axios.get(process.env.VUE_APP_severURL + '/getPeopleList')
        .then(res => {
          this.people_list = res.data.data
        })
    },
  }
}
</script>

<style scoped>
.el-button{
  margin-left: 10px;
}
</style>
