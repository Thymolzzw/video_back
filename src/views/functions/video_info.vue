<template>
  <div id="video_info">
    <div id="select_list">
      <el-select v-model="video_value" placeholder="请选择">
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

    <div>
      <div>
        <el-checkbox-group v-model="checkboxGroup1">
          <div style="width: 200px;" v-for="(fun, index) in functions" :label="fun" :key="fun">
            <el-checkbox-button style="width: 100%" :disabled="disable[index]" border :label="index" :key="index">{{index+1}} - {{fun}}</el-checkbox-button>
          </div>
        </el-checkbox-group>
        <el-button type="primary" @click="select_functions">执行</el-button>
      </div>
    </div>

    <div>
<!--      <el-table-->
<!--        :data="tableData"-->
<!--        height="250"-->
<!--        border-->
<!--        style="width: 100%">-->
<!--        <el-table-column-->
<!--          type="index"-->
<!--          :index="indexMethod">-->
<!--        </el-table-column>-->
<!--        <el-table-column-->
<!--          prop="name"-->
<!--          label="姓名"-->
<!--          width="180">-->
<!--        </el-table-column>-->
<!--        <el-table-column-->
<!--          prop="address"-->
<!--          label="地址">-->
<!--        </el-table-column>-->
<!--      </el-table>-->
    </div>
  </div>
</template>

<script>
import axios from 'axios'
const functions = ['人脸识别', '目标检测与识别', 'PPT画面检测', '自然场景文本识别', '语音识别与翻译', '声纹识别'];

export default {
  data(){
    return{
      promoList: [],
      currentDate: new Date(),
      videos: [],
      video_value: '',
      disabled: false,
      functions: functions,
      checkboxGroup1: [],
      sorted_list: [],
      addition_data: {},
      video_functions: [],
      all_functions:['人脸识别', '目标检测与识别', 'PPT画面检测', '自然场景文本识别', '语音识别与翻译', '声纹识别'],
      disable: [false, false, false, false, false, false]
    }
  },
  mounted() {
    this.get_videos()
  },
  name: 'index',
  methods: {
    atext: function(s) {
      var pk = this.promoList[s].pk
      alert(pk)
    },
    select_functions: function() {
      let funcs = this.get_sorted_list()
      this.dialogVisible = true
      //1.上传视频
      this.loading = true
      const formdata = new FormData()
      this.sorted_list = this.get_sorted_list()

      formdata.append('file', this.file.raw)
      formdata.append('title', this.query.title)
      formdata.append('functions', this.sorted_list)
      console.log(this.file.raw)
      let that = this
      axios({
        url: process.env.VUE_APP_severURL + '/uploadvideo',
        method: "post",
        // baseURL: process.env.VUE_APP_BASE_API,
        headers: { 'Content-Type': 'multipart/form-data' },
        data: formdata,
        onUploadProgress: function (progressEvent) {
          var now_progress = (Math.floor(progressEvent.loaded / progressEvent.total * 100) * 0.90).toFixed(2)
          that.load_line = now_progress
        },
      }).then((resp)=>{
        that.handleSuccess(resp.data)
      })
    },

    get_sorted_list(){
      let funcs = this.checkboxGroup1//.concat(this.checkboxGroup2)
      let compare = function (x, y) {//比较函数
        if (x < y) {
          return -1;
        } else if (x > y) {
          return 1;
        } else {
          return 0;
        }
      }
      return funcs.sort(compare)
    },
    get_addition_data: function(s) {
      let param = new URLSearchParams()
      param.append('videoId', this.promoList[s].pk)
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
          this.addition_data = resp.data.addition_data
          // alert(this.addition_data)
          var fun_list = resp.data.functions
          for (const i in fun_list) {
            this.video_functions.push(this.all_functions[i])
            this.disable[i] = true
          }
          this.video_value = this.video_value
        })
    },
    load_video_data: function(ss) {
      this.get_addition_data(ss)
      let param = new URLSearchParams()
      ss = ss + 0
      param.append('videoId', this.promoList[ss].pk)
      let config = {
        headers: { 'Accept-Ranges': 'bytes' }
      }
      // alert(process.env.VUE_APP_SERVER_URL)
      axios({
        method: 'get',
        url: process.env.VUE_APP_severURL + '/getOneVideos',
        contentType: 'application/x-www-form-urlencoded',
        params: param,
        headers: config.headers,
      })
    },



    indexMethod(index) {
      return index + 1;
    },
    get_videos: function () {
      axios.get(process.env.VUE_APP_severURL + '/getAllVideos')
        .then(res => {
          // console.log(res.data.data)
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
          console.log()
        })
    },
  }
}
</script>

<style scoped>

</style>
