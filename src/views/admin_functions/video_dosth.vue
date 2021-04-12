<template>
  <div id="dosth">
    <div id="select_list">
      <el-select v-model="video_value" placeholder="请选择" @change="load_video_data">
        <el-option
          filterable
          v-for="(item, index) in videos"
          :key="index"
          :label="item.label"
          :value="index">
          <span style="float: left">{{ item.label }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
        </el-option>
      </el-select>
      <el-button type="primary" @click="load_video_data(video_value)">加载</el-button>
      <el-button type="primary" @click="atext(video_value)">测试</el-button>
    </div>

    <div id="funs">
      <div>
        <el-checkbox-group v-model="checkboxGroup1">
          <div style="width: 200px;" v-for="(fun, index) in functions" :label="fun" :key="fun">
            <el-checkbox-button style="width: 100%" :disabled="disable[index]" border :label="index" :key="index">{{index+1}} - {{fun}}</el-checkbox-button>
          </div>
        </el-checkbox-group>
        <el-button type="primary" @click="select_functions">执行</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
const functions = ['人脸识别', '目标检测与识别', 'PPT画面检测', '自然场景文本识别', '语音识别与翻译', '声纹识别'];

export default {
  name: 'video_dosth',
  data(){
    return{
      promoList: [],
      videos: [],
      video_value: '',
      disabled: false,
      functions: functions,
      checkboxGroup1: [],
      sorted_list: [],
      addition_data: {},
      fun_list: [],
      video_functions: [],
      all_functions: functions,
      disable: [true, true, true, true, true, true]
    }
  },
  mounted() {
    this.get_videos()
  },
  methods: {
    atext: function(s) {
      var pk = this.promoList[s].pk
      alert(pk)
    },
    select_functions: function() {
      alert(this.promoList[this.video_value].pk)
    },
    load_video_data: function(index) {
      console.log(this.promoList[index].pk)

      let param = new URLSearchParams()
      param.append('videoId', this.promoList[index].pk)
      let config = {
        headers: { 'Accept-Ranges': 'bytes' }
      }
      axios({
        method: 'get',
        url: process.env.VUE_APP_severURL + '/getVideoAdditionData',
        contentType: 'application/x-www-form-urlencoded',
        params: param,
        headers: config.headers
      })
        .then(resp => {
          this.fun_list = resp.data.functions
          console.log(this.fun_list)
          for (const i in fun_list) {
            this.video_functions.push(this.all_functions[i])
            this.disable[i] = true
          }
          // this.video_value = this.video_value
        })
    },
    get_videos: function () {
      axios.get(process.env.VUE_APP_severURL + '/getAllVideos')
        .then(res => {
          console.log(res.data.data)
          this.promoList = res.data.data
          let len = this.promoList.length
          let temp = {}
          for (let i = 0; i < len; ++i){
            temp = {
              value: '',
              label: this.promoList[i].fields.title
            }
            this.videos.push(temp)
          }
          // console.log()
        })
    },
  }
}
</script>

<style scoped>

</style>
