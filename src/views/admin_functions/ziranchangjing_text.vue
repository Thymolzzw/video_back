<template>
  <div id="video_info">
    <br>
    <div id="select_list" style="margin-left:12px;">
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
      <el-button type="primary" @click="get_subtitle(video_value)">加载</el-button>
      <el-button type="primary" style="margin-left: 10px" @click="confirm_update(video_value)">确认审核</el-button>
      <el-button type="primary" style="margin-left: 10px" @click="update_ocr()">保存修改</el-button>
    </div>
<br>
    <div>
      <div style="" v-for="(item, index) in sub_obj" :key="index">
        <div style="width: 34%;display: inline-block;">
          <!--                  图{{ index + 1 }}-->
          <el-image :preview-src-list=[ocr_img_list[index]] :src=ocr_img_list[index]></el-image>
        </div>
        <div style="width: 65%;display: inline-block;margin-top: 0px;">
          <el-input type="input" v-model="ocr_time_list[index]" disabled></el-input>
          <el-input type="textarea" :autosize="{minRows: 6, maxRows: 6}" v-model="ocr_list[index]"></el-input>
          <el-button type="primary" size="mini" round style="margin-left: 10px" @click="del_item(index)">删除内容</el-button>
          <el-button type="primary" size="mini" round style="margin-left: 10px" @click="update_item(index)">提交修改</el-button>
        </div>

        <hr>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import qs from 'qs'
const functions = ['人脸识别', '目标检测与识别', 'PPT画面检测', '自然场景文本识别', '语音识别与翻译', '声纹识别'];

export default {
  data(){
    return{
      promoList: [],
      input: '',
      currentDate: new Date(),
      videos: [],
      video_value: '',
      disabled: false,
      functions: functions,
      checkboxGroup1: [],
      sorted_list: [],
      addition_data: {},
      video_functions: [],
      tableData: [],
      textarea1: '',
      video_id: '',
      sub_obj: [],
      ocr_list: [],
      ocr_time_list: [],
      ocr_img_list: [],
    }
  },
  mounted() {
    console.log('src/views/admin_functions/ziranchagnjing_text.vue')
    this.get_videos()
  },
  name: 'index',
  methods: {
    update_item: function(index){
      //alert(index+'#'+this.video_id)

      let param = new FormData()
      param.append('videoId', this.video_id)
      param.append('deleteIndex', index)
      param.append('updateContent', this.ocr_list[index])
      axios({
        method: 'post',
        url: process.env.VUE_APP_severURL + '/updateOCRItem',
        contentType: 'application/x-www-form-urlencoded',
        data: param,
      }).then(resp => {
        if(resp.data.code === 20000){
          //成功删除后更新前端数据
          this.$alert('修改成功', '修改结果', {
            confirmButtonText: '确定',
          });
        }
      })
    },
    del_item: function(index){
      alert(index+'#'+this.video_id)

      let param = new FormData()
      param.append('videoId', this.video_id)
      param.append('deleteIndex', index)
      axios({
        method: 'post',
        url: process.env.VUE_APP_severURL + '/delOCRItem',
        contentType: 'application/x-www-form-urlencoded',
        data: param,
      }).then(resp => {
          if(resp.data.code === 20000){
            //成功删除后更新前端数据
            this.ocr_list.splice(index,1)
            this.ocr_time_list.splice(index,1)
            this.ocr_img_list.splice(index,1)
            this.sub_obj.splice(index,1)
            this.$alert('修改成功', '修改结果', {
              confirmButtonText: '确定',
            });
          }

        })
    },
    confirm_update: function() {
      this.$alert('审核成功', '审核结果', {
        confirmButtonText: '确定',
      });
    },
    change_data: function(row) {
      row.new_value = ''
      this.$alert('修改成功', '修改结果', {
        confirmButtonText: '确定',
      });
    },
    update_ocr:function() {

      let param = new FormData()
      let time_list = ''
      let ocr_list_res = ''
      for (let i = 0; i < this.ocr_time_list.length; ++i){
        time_list = time_list + this.ocr_time_list[i] + '^$'
        ocr_list_res = ocr_list_res + this.ocr_list[i] + '^$'
      }
      param.append('videoId', this.video_id)
      param.append('updateTime', time_list.slice(0, -2))
      param.append('updateOCR', ocr_list_res.slice(0, -2))
      axios({
        method: 'post',
        url: process.env.VUE_APP_severURL + '/updateOCR',
        contentType: 'application/x-www-form-urlencoded',
        data: param,

      })
        .then(resp => {
          // alert(this.subtitle_list)
          if(resp.data.code === 20000)
            this.$alert('修改成功', '修改结果', {
              confirmButtonText: '确定',
            });
        })
    },

    get_subtitle: function(s) {
      this.video_id = this.promoList[s].id
      // alert(this.video_id)
      let param = new URLSearchParams()
      param.append('videoId', this.video_id)
      let config = {
        headers: { 'Accept-Ranges': 'bytes' }
      }
      axios({
        method: 'get',
        url: process.env.VUE_APP_severURL + '/getText',
        contentType: 'application/x-www-form-urlencoded',
        params: param,
        headers: config.headers
      })
        .then(resp => {
          let textData = JSON.stringify(resp.data.text_data)
          this.sub_obj = JSON.parse(textData)
          // alert(this.sub_obj)
          this.ocr_time_list = []
          this.ocr_list = []
          this.ocr_img_list = []

          for (var i = 0; i < this.sub_obj.length; i++) {

            this.ocr_time_list.push(JSON.stringify(this.sub_obj[i].time))
            this.ocr_list.push(this.sub_obj[i].content)
            this.ocr_img_list.push(this.sub_obj[i].image)
          }
          this.video_id = this.promoList[this.video_value].id
          // alert(this.subtitle_list)
        })
    },

    indexMethod(index) {
      return index + 1;
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
  }
}
</script>

<style scoped>
.el-button{
  margin-left: 10px;
}
</style>
