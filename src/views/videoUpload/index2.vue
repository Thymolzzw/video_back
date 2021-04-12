<template>
  <div id="upload_outer">
    <el-upload
      class="upload-demo"
      ref="upload"
      drag
      action="http://videos.natapp1.cc/uploadvideo"
      multiple
      :on-preview="handlePreview"
      :on-change="handleChange"
      :on-remove="handleRemove"
      :limit="1"
      :auto-upload="false">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击选择文件</em></div>
      <div class="el-upload__tip">只能上传视频文件</div>
    </el-upload>
    <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: "index",
  data(){
    return{
      a: 0,
      video_file: ''
    }
  },
  methods:{
    submitUpload() {
      this.$refs.upload.submit();
      // this.upload()
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleChange(file) {
      this.video_file = file
    },
    //上传图片
    upload: function () {
      // var f = this.$ref.photo;
      // console.dir(f.files[0]);
      let params = new FormData();
      if(this.video_file === '')
        return
      params.append('file', this.video_path);//通过append向form对象添加数据
      alert(this.video_file)
      let config = {
        // headers: { 'Content-Type': 'multipart/form-data' }
        // headers: { 'enctype': 'multipart/form-data' }
        headers: {'Accept-Ranges': 'bytes'}
      };  //添加请求头
      axios.post(process.env.VUE_APP_severURL + '/uploadvideo', params, config)
        .then(resp => {
          console.log(resp.data)
          // if (this.form.url) {
          //   alert('图片上传成功')
          // }
        })
    },

  }
}
</script>

<style scoped>

</style>
