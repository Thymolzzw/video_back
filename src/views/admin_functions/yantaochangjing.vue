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
      <el-button type="primary" @click="get_ppt_imgs(video_value)">加载</el-button>
      <el-button type="primary" @click="atext(video_value)">测试</el-button>
      <el-button type="primary" style="margin-left: 10px" @click="confirm_update(video_value)">确认审核</el-button>
      <el-button type="primary" style="margin-left: 10px" @click="update_ppt(video_value)">保存修改</el-button>
    </div>

    <div>
      <div style=" height: 1400px; max-height: 1240px;overflow:scroll;">
        <div ref="ppts" style="width: 500px; display: inline-block; float: left;"
             v-for="(item, index) in ppt_imgs" :key="index">
          <el-image fit="fill" :src="item" :disabled="item"></el-image>
          <el-button type="primary" @click="del_ppt_img(index)">删除该图</el-button>
        </div>
      </div>
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
      input: '',
      videos: [],
      video_value: '',
      functions: functions,
      sorted_list: [],
      video_functions: [],
      ppt_imgs: [],
      ppt_imgs_list: [],
      del_imgs: [],
      ppts: '',
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
    confirm_update: function() {
      this.$alert('审核成功', '审核结果', {
        confirmButtonText: '确定',
      });
    },

    del_ppt_img: function(index) {
      // this.del_imgs.push(index)
      this.ppt_imgs[index] = ''
      this.ppt_imgs_list[index] = ''
      // this.$refs.ppts.item[index]
      // this.$refs.ppts[index] = ''
      // alert(this.ppt_imgs)
      let param = new FormData()
      param.append('videoId', this.promoList[this.video_value].pk)
      param.append('del_index', index)
      axios({
        method: 'post',
        url: process.env.VUE_APP_severURL + '/delPPTImg',
        contentType: 'application/x-www-form-urlencoded',
        data: param,

      }).then(resp => {
          if(resp.data.code === 20000)
            this.$alert('删除成功', '修改结果', {
              confirmButtonText: '确定',
            });
          this.get_ppt_imgs(this.video_value);
      })
    },
    update_ppt: function(s) {
      //ppt_imgs 列表

      this.$alert('更新成功', '更新结果', {
        confirmButtonText: '确定',
      });

      // this.video_id = this.promoList[s].pk
      // let param = new FormData()
      // let ppt_list = ''
      //
      // for (let i = 0; i < this.ppt_imgs_list.length; ++i){
      //   if(this.ppt_imgs_list[i] !== '')
      //     ppt_list = ppt_list + this.ppt_imgs_list[i] + '^$'
      // }
      // param.append('videoId', this.video_id)
      // param.append('updateImages', ppt_list.slice(0, -2))
      // alert(ppt_list.slice(0, -2))
      // axios({
      //   method: 'post',
      //   url: process.env.VUE_APP_severURL + '/updatePPT',
      //   contentType: 'application/x-www-form-urlencoded',
      //   data: param,
      // }).then(resp => {
      //     if(resp.data.code === 20000)
      //       this.$alert('修改成功', '修改结果', {
      //         confirmButtonText: '确定',
      //       });
      //   })
    },
    change_data: function(row) {
      row.new_value = ''
      this.$alert('修改成功', '修改结果', {
        confirmButtonText: '确定',
      });
    },
    get_ppt_imgs: function(s) {
      let param = new URLSearchParams()
      param.append('videoId', this.promoList[s].pk)
      let config = {
        headers: { 'Accept-Ranges': 'bytes' }
      }
      axios({
        method: 'get',
        url: process.env.VUE_APP_severURL + '/getVideoPPT',
        contentType: 'application/x-www-form-urlencoded',
        params: param,
        headers: config.headers
      })
        .then(resp => {
          this.ppt_imgs = resp.data.ppt_json
          for(let i in this.ppt_imgs){
            this.ppt_imgs_list.push(this.ppt_imgs[i])
          }
          // alert(this.ppt_imgs_list)
        })
    },

    update_ppt_imgs: function(s) {
      let param = new FormData()
      param.append('videoId', this.promoList[s].pk)
      let config = {
        headers: { 'Accept-Ranges': 'bytes' }
      }
      axios({
        method: 'post',
        url: process.env.VUE_APP_severURL + '/updateVideoPPT',
        contentType: 'application/x-www-form-urlencoded',
        data: param,
        headers: config.headers
      })
        .then(resp => {
          this.ppt_imgs = resp.data.ppt_json
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
