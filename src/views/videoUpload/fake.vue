<template>
  <div class="app-container">
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <span>视频正在上传至服务器，进度条变绿前请勿关闭此提示</span>
      <el-progress :text-inside="true" :stroke-width="24" :percentage=load_line :status=line_color_1></el-progress>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关  闭</el-button>
        <!--        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>-->
      </span>
    </el-dialog>

    <el-form ref="form" label-width="80px" >
      <!--:model="form"-->
      <el-form-item label="视频标题:">
        <el-input v-model="query.title" placeholder="请输入视频标题"></el-input>
      </el-form-item>
      <div>
        <el-form-item label="视频文件:" style="width: 500px">

          <el-upload
            class="upload-demo"
            ref="upload"
            drag
            :auto-upload="false"
            :headers ="upload_headers"
            :file-list="filelist"
            action="/api/videos/upload"
            accept="audio/mp4,video/mp4, video/mkv,.mkv"
            :on-success = "handleSuccess"
            :on-error	= "()=>{loading = false}"
            :on-change= "handleFileChange"
            :multiple = "false"
          >

            <!--:file-list="uploadFileList"-->
            <div v-loading="loading">
              <img
                v-if="thumb_filename"
                width="100%"
                height="100%"
                class="el-upload-list__item-thumbnail"
                :src="videoThumbUrl"
              >
              <div v-else>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将视频拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">只能上传mp4文件</div>
              </div>
            </div>
          </el-upload>
        </el-form-item>

        <div>
          <el-checkbox-group v-model="checkboxGroup1">
            <div style="width: 200px;" v-for="(fun, index) in functions" :label="fun" :key="fun">
              <el-checkbox-button style="width: 100%" border :label="index" :key="index">{{index+1}} - {{fun}}</el-checkbox-button>
            </div>

          </el-checkbox-group>
          <!--          <el-checkbox-group v-model="checkboxGroup2">-->
          <!--            <el-checkbox-button border v-for="fun in functions2" :label="fun" :key="fun">{{fun}}</el-checkbox-button>-->
          <!--          </el-checkbox-group>-->
        </div>

        <div style="margin-top: 20px;margin-bottom: 15px;">
          <h4 style="display: inline-block; margin-right: 20px;">请选择视频来源</h4>

          <!--          allow-create-->
          <el-select
            style="display: inline-block"
            v-model="source_value"
            filterable
            default-first-option
            placeholder="请选择视频来源">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>


      <el-form-item>
        <el-button type="primary" @click="submitUpload">确认提交</el-button>
        <el-button type="primary" @click="ceshi">ceshi</el-button>
      </el-form-item>

    </el-form>


  </div>
</template>

<script>
import { queryVideos, deleteVideo, updateVideo, getVideo, createVideo,getVideoThumbPath } from '@/api/video'

import service from '@/utils/request'
import axios from 'axios'
const functions = ['人脸识别', '目标检测与识别', 'PPT画面检测', '自然场景文本识别', '语音识别与翻译', '声纹识别'];
const functions2 = [[0, '人脸识别'], [1, '目标检测与识别'], [2, 'PPT画面检测'], [3, '自然场景文本识别'], [4, '语音识别与翻译'], [5, '声纹识别']];;
export default {
  data() {
    return {
      //配置minxin种curd api方法：
      newMethod: createVideo,
      deleteMethod: deleteVideo,
      updateMethod: updateVideo,
      getMethod: getVideo,
      queryMethod: queryVideos,
      dialogVisible: false,
      load_line: 0,
      line_color_1:'',
      file:'',
      //配置mixin query
      resource_name: 'video',
      functions: functions,
      functions2: functions2,
      checkboxGroup1: [],
      sorted_list: [],
      checkboxGroup2: [],

      data: [],  //视频列表
      filelist: [],

      query: {
        title: undefined
      },

      videoId: undefined,
      thumb_filename: "",
      loading: false,
      options: [],
      source_value: '',
      all_source: ''

    }
  },
  computed: {

    videoThumbUrl() {
      return getVideoThumbPath(this.thumb_filename)
    },

    upload_headers(){
      return {
        'Authorization': 'Bearer ' + this.token
      }
    }
  },
  mounted() {
    this.get_all_source()
  },

  created() {
  },
  methods: {
    ceshi(){
      var funcs = this.checkboxGroup1//.concat(this.checkboxGroup2)
      var compare = function (x, y) {//比较函数
        if (x < y) {
          return -1;
        } else if (x > y) {
          return 1;
        } else {
          return 0;
        }
      }
      alert(funcs.sort(compare))
    },
    get_all_source: function() {
      // /getAllResource
      axios({
        method: 'get',
        url: process.env.VUE_APP_severURL + '/getAllResource',
        contentType: 'application/x-www-form-urlencoded',
      })
        .then(resp => {
          this.all_source = resp.data.data
          let temp = {}
          // alert(this.all_source)
          for(let i = 0; i < this.all_source.length; ++i){
            temp = {
              value: this.all_source[i].fields.name,
              label: this.all_source[i].fields.name
            }

            this.options.push(temp)
          }
          // alert(resp.data.addition_data)

        })
    },
    get_sorted_list(){
      var funcs = this.checkboxGroup1//.concat(this.checkboxGroup2)
      var compare = function (x, y) {//比较函数
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


    // 上传前改变文件名字
    handleFileChange(file, fileList) {
      if (file.status === 'ready') {
        this.thumb_filename  = undefined
        this.file = file
        this.query.title = file.raw.name
      }
    },

    //当文件上传成功后
    handleSuccess(response, file, fileList){
      //this.clearTimeout(this.timeID);
      this.dialogVisible = true
      this.load_line = 100
      this.line_color_1 = "success"

      var type = ''
      this.loading = false
      if (response.code === 200){
        type = response.status;
        this.videoId = response.id  //response.id    后端接口更新后会获得id
        console.log(response.msg)
        console.log("上传成功的视频id：" + response.id)
        this.thumb_filename = response.thumb_filename
        //上传信息
        // updateVideo(this.videoId, this.query)

        this.$message({
          type: 'success',
          message: response.msg
        })
        location.reload()
        // this.reload();

      } else {
        console.log(response.msg)
      }
      return type;
    },

    //点击提交 先上传文件，再上传信息
    submitUpload() {
      // if(!this.filelist){
      //   alert("您还没有没有选择视频！")
      //   return
      // }
      this.line_color_1 = "primary"
      this.dialogVisible = true
      //1.上传视频
      this.loading = true
      const formdata = new FormData()
      this.sorted_list = this.get_sorted_list()

      // formdata.append('file', this.file.raw)
      formdata.append('title', this.query.title + '')
      formdata.append('functions', this.sorted_list)
      formdata.append('source', this.source_value)
      // console.log(this.file.raw)
      let that = this
      axios({
        url: process.env.VUE_APP_severURL + '/fakeUploadVideo',
        method: "post",
        // baseURL: process.env.VUE_APP_BASE_API,
        headers: { 'Content-Type': 'multipart/form-data' },
        data: formdata,
        onUploadProgress: function (progressEvent) {
          var now_progress = (Math.floor(progressEvent.loaded / progressEvent.total * 100) * 0.60).toFixed(2)
          that.load_line = now_progress
          // if(progressEvent.loaded >= progressEvent.total){
          //   var timeID = setInterval(() => {
          //     if(parseFloat(that.load_line) < 90){
          //       that.load_line = (parseFloat(that.load_line) + 0.01).toFixed(2)
          //     // }else if(parseFloat(that.load_line) < 99.73){
          //     //   that.load_line = (parseFloat(that.load_line) + 0.01).toFixed(2)
          //     }
          //   }, 10)
          // }
        },
      }).then((resp)=>{
        that.handleSuccess(resp.data)
      })//.finally((resp)=>{
      //   that.handleSuccess(resp.data,'','')
      // })

    },

  },

  beforeDestroy() {
    clearTimeout(this.timeID);
  }
}
</script>
