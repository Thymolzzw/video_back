<template>
  <div id="video_info">
    <div id="select_list">
      <el-select v-model="video_value" filterable placeholder="请选择">
        <el-option
          v-for="(item, index) in videos"
          :key="index"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button type="primary" @click="get_subtitle(video_value)">加载</el-button>


      <el-button type="primary" style="margin-left: 10px" @click="confirm_update(video_value)">确认审核</el-button>
      <el-button type="primary" style="margin-left: 10px" @click="update_subtitle()">保存修改</el-button>
    </div>

    <div style="height: auto">
      <hr>
      <div v-for="(item, index) in sub_obj" :key="index">
        <el-input type="input" v-model="subtitle_time_list[index].slice(2, -2)" disabled></el-input>
        <template v-for="(item_item, index_index) in item.content">
          <el-input type="input" v-model="item.content[index_index]"></el-input>
        </template>
        <el-button type="primary" size="mini" round style="margin-left: 20px; margin-top: 5px" @click="addLine(index)">添加行</el-button>
        <el-button type="primary" size="mini" round style="margin-left: 20px; margin-top: 5px" @click="update_subtitle_item(index)">提交修改</el-button>
        <hr>
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
      sub_obj: '',
      subtitle_list: [],
      subtitle_time_list: [],

    }
  },
  mounted() {
    console.log('src/views/admin_functions/yuyinshibie.vue')
    this.get_videos()
  },
  name: 'index',
  methods: {
    confirm_update: function() {
      this.$alert('审核成功', '审核结果', {
        confirmButtonText: '确定',
      });
    },
    addLine(index){
      if(this.sub_obj[index].content[this.sub_obj[index].content.length-1]===''){
        this.$alert('请为新添加的行输入内容', '添加结果', {
          confirmButtonText: '确定',
        });
      }else{
        this.sub_obj[index].content.push('')
      }
    },
    update_subtitle_item: function (index){
      let param = new FormData()
      param.append('videoId', this.video_id)
      param.append('update_index', index)
      param.append('update_time', this.subtitle_time_list[index])
      param.append('update_content', JSON.stringify(this.sub_obj[index].content))

      axios({
        method: 'post',
        url: process.env.VUE_APP_severURL + '/updateSubTitleItem',
        contentType: 'application/x-www-form-urlencoded',
        data: param,

      }).then(resp => {
        if(resp.data.code === 20000)
          this.$alert('修改成功', '修改结果', {
            confirmButtonText: '确定',
          });
          if(this.sub_obj[index].content[this.sub_obj[index].content.length-1]===''){
            this.sub_obj[index].content.splice(this.sub_obj[index].content.length-1,1)
          }
      })
    },
    update_subtitle:function() {
      if(this.video_id != ''){
        let param = new FormData()
        param.append('videoId', this.video_id)
        param.append('sub_obj', JSON.stringify(this.sub_obj))
        axios({
          method: 'post',
          url: process.env.VUE_APP_severURL + '/updateSubTitle',
          contentType: 'application/x-www-form-urlencoded',
          data: param,

        }).then(resp => {
          if(resp.data.code === 20000)
            this.$alert('修改成功', '修改结果', {
              confirmButtonText: '确定',
            });
        })
      }
    },

    get_subtitle: function(s) {
      if(s == ''){
        alert('请选择加载的数据！')
      }
      else{
        this.video_id = s
        let param = new URLSearchParams()
        param.append('videoId', this.video_id)
        axios({
          method: 'get',
          url: process.env.VUE_APP_severURL + '/getSubTitleForUpdate',
          contentType: 'application/x-www-form-urlencoded',
          params: param,
        }).then(resp => {
          // var subTitle = JSON.stringify(resp.data.subTitle)
          this.sub_obj = resp.data.subTitle
          for (var i = 0; i < this.sub_obj.length; i++) {
            this.textarea1 += this.sub_obj[i].time
            this.textarea1 += this.sub_obj[i].content
            this.textarea1 += ' \n'
            this.subtitle_time_list.push(JSON.stringify(this.sub_obj[i].time))
            this.subtitle_list.push(this.sub_obj[i].content)
          }
        })
      }
    },
    get_videos: function () {
      axios.get(process.env.VUE_APP_severURL + '/getAllVideos')
        .then(res => {
          this.promoList = res.data.video_items
          let len = this.promoList.length
          let temp = {}
          for (let i = 0; i < len; ++i){
            temp = {
              value: this.promoList[i].id,
              label: this.promoList[i].title
            }
            this.videos.push(temp)
          }
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
