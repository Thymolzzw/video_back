<template>
  <div>
  <el-upload
    style="margin: 15px"
    class="upload-demo"
    ref="upload"
    name="image"
    limit="1"
    accept=".jpg,.jpeg,.png,.wav"
    :action="upload_url"
    :on-preview="handlePreview"
    :on-remove="handleRemove"
    :on-success = "handleSuccess"
    :on-error="handleError"
    :file-list="fileList"
    :auto-upload="false">
    <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
    <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">查询</el-button>
    <div slot="tip" class="el-upload__tip">上传图片或音频文件，jpg/wav等</div>
  </el-upload>
  <div id="videolist">
    <div style="font-size: larger; margin: 15px"><spinner>检索到的视频如下：</spinner></div>
    <div id="video_list" v-if="hasVideos === true">
      <el-row>
        <el-col :span="5.5" v-for="(item1, index) in videoList" :key="index" style="padding: 10px" >
          <el-card style="height: 230px; width: 300px" :body-style="{ padding: '2px' }" shadow="hover" @click.native="to_play_video(item1.pk)">
            <img style="height: 150px" :src="item1.fields.snapshoot_img" class="image">
            <div style="padding: 14px;">
              <span>{{ item1.fields.title }}</span>
              <div class="bottom clearfix">
                <time class="time">{{ item1.fields.add_time }}</time>
                <!--                <p>{{ this.time_2_date(item1.fields.create_time) }}</p>-->
                <!--                <router-link :to="{ name: 'readDetail', params: { msgKeyOne: 'jump test.' }}">-->
                <!--                  <button type="button">跳转</button>-->
                <!--                <el-button type="text" class="button">查看视频</el-button>-->
                <!--                </router-link>-->

              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div v-if="hasVideos === false" style="color: #8c939d; margin: 20px">空空如也。。。。。</div>
  </div>
  </div>
</template>

<script>
import axios from "axios";
import store from "@/store";

export default {
  name: "modal",
  data() {
    return {
      hasVideos: false,
      upload_url: process.env.VUE_APP_severURL + '/uploadImg',
      fileList: [],
      videoList: [],
      resultList: [],
    };
  },
  methods: {
    to_play_video: function (event) {
      console.log("event", event)
      let param = new URLSearchParams()
      param.append('videoId', event)
      param.append('user_id', store.state.user.user_info.id)
      axios({
        method: 'get',
        url: process.env.VUE_APP_severURL + '/clickVideo',
        contentType: 'application/x-www-form-urlencoded',
        params: param,
      }).then(resp => {
        if(resp.data.code === 20000){

          this.$router.push({
            path: '/player',
            name: '视频播放详情页',
            query: {
              video_id: event
            }
          })
        }
      })
    },
    submitUpload() {
      console.log('test', this.fileList)
      this.$refs.upload.submit();
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handleSuccess(response, file, fileList){
      console.log('success', response)
      if(response.code === 20000){
        this.videoList = JSON.parse(response.data.videos)
        this.resultList = response.data.results
        if(this.videoList.length === 0){
          this.hasVideos = false
        }else{
          this.hasVideos = true
        }
      }
      console.log("this.videoList", this.videoList, this.resultList)
    },
    handleError(err, file, fileList){
      console.log('err', err, file, fileList)
    },
    handlePreview(file) {
      console.log(file);
    }
  }
}
</script>

<style scoped>

</style>
