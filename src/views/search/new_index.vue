<template>
  <div id="search">
    <div class="boxes">
      <el-row>
        <el-input
          placeholder="请输入内容"
          style="width: 40%"
          v-model="input"
          clearable>
        </el-input>
        <el-button type="primary" v-on:click="get_videos()">查询</el-button>
      </el-row>
      <el-checkbox-group v-model="checkList" :max="1">
        <el-checkbox label="0">最新上传</el-checkbox>
        <el-checkbox label="a">视频标题</el-checkbox>
        <el-checkbox label="1">视频人物</el-checkbox>
        <el-checkbox label="2">视频目标</el-checkbox>
        <el-checkbox label="3">视频简介</el-checkbox>
        <br>
        <el-checkbox label="4">视频来源</el-checkbox>
        <el-checkbox label="5">视频标签</el-checkbox>
        <el-checkbox label="6">视频id</el-checkbox>
        <el-checkbox label="7">自然文本</el-checkbox>
        <el-checkbox label="8">视频字幕</el-checkbox>
<!--        <el-checkbox label="9">id</el-checkbox>-->
        <el-checkbox label="9">国家</el-checkbox>
      </el-checkbox-group>
    </div>

    <div>
      <div id="video_list">
        <el-row>
          <el-col :span="5.5" v-for="(item1, index) in promoList" :key="index" style="padding: 10px" >
            <el-card style="height: 230px; width: 300px" :body-style="{ padding: '2px' }" shadow="hover" @click.native="to_play_video(item1.pk)">
              <img style="height: 150px" :src="item1.fields.snapshoot_img" class="image">
              <div style="padding: 14px;">
                <span>{{ item1.fields.title }}</span>
                <div class="bottom clearfix">
                  <time class="time">{{ item1.fields.create_time }}</time>

                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'new_index',
  data(){
    return{
      input: '',
      checkList: [],
      promoList: [],
      videos: '',
    }
  },
  methods: {

    to_play_video: function (event) {
      // alert(event)
      this.$router.push({
        path: '/player',
        name: '视频播放详情页',
        // params: {
        //   video_url: 'event'
        // },
        query: {
          video_id: event
        }
      })
    },
    get_videos: function () {
      let param = new FormData()
      param.append('searchType', this.checkList)
      param.append('searchText', this.input)
      // let config = {
      //   headers: { 'Accept-Ranges': 'bytes' }
      // }
      axios({
        method: 'post',
        url: process.env.VUE_APP_severURL + '/searchVideos',
        contentType: 'application/x-www-form-urlencoded',
        data: param,
      })
        .then(resp => {
          this.promoList = resp.data.data
        })
    },

  }
}
</script>

<style scoped>

</style>
