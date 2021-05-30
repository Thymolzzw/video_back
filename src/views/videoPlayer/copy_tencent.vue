<template>
  <div id="videoPlayer" style="width: 100%;">
    <el-dialog style="height: 500px;" title="视频信息加载中" :visible.sync="dialogInfoVisible">
      <el-table
        style="width: 100%"
        v-loading=true
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading">
      </el-table>

    </el-dialog>
    <div id="player_all" style="text-align:center; width: 90%; margin-left: 50px;">
      <div style="width: 55%;display: inline-block;vertical-align:top; margin-top: 0px;background-color: #ffffff">

        <div id="player" style="width: 100%;float: left">
          <video-player class="video-player vjs-custom-skin"
                        ref="videoPlayer"
                        :playsinline="true"
                        :options="playerOptions"
                        @play="onPlayerPlay($event)"
                        @pause="onPlayerPause($event)"
                        @statechanged="playerStateChanged($event)"
                        @loadeddata="onPlayerLoadeddata($event)"
                        @timeupdate="onPlayerTimeupdate($event)"
                        @ready="playerReadied"
          >
            <track style="width: 200px;" kind="captions" :src=subtitle srclang="en" label="English"/>
          </video-player>
        </div>

        <div id="likes">
          <el-button size="small" type="primary" :icon="like_state" @click="add_likes" circle></el-button>
          <el-button size="small" type="primary" icon="el-icon-share" circle @click="share_video"></el-button>
          <el-button size="small" type="primary" icon="el-icon-s-comment" circle @click="open_comment"></el-button>
        </div>

      </div>
      <div style="width: 40%;display: inline-block;vertical-align:top; margin-top: 2%; margin-left: 3%;background-color: #ffffff">
        <div id="videoTags" style="width: 100%; margin-top: 22px;">
          <el-row style="margin-top: 20px;">
            <el-col :span="4">
              <el-tag type="info">视频分类</el-tag>
            </el-col>
            <el-col v-for="(item, index) in video_tags" :key="index" :span="3">
              <el-tag effect="dark">{{item}}</el-tag>
            </el-col>
          </el-row>

          <el-row style="margin-top: 20px;">
            <el-col :span="4">
              <el-tag type="info">视频标签</el-tag>
            </el-col>
            <el-col v-for="(item, index) in addition_data.video_tag" :key="index" :span="3">
              <el-tag effect="dark">{{item}}</el-tag>
            </el-col>
          </el-row>

          <el-row style="margin-top: 20px;">
            <el-col :span="4">
              <el-tag type="info">已进行的处理</el-tag>
            </el-col>
            <el-col style="margin-right: 5px;" v-for="(item, index) in video_functions" :key="index" :span="3.5">
              <el-tag effect="dark">{{item}}</el-tag>
            </el-col>
          </el-row>

          <el-row style="margin-top: 20px;">
            <el-col :span="4">
              <el-tag type="info">视频来源</el-tag>
            </el-col>
            <el-col :span="3">
              <el-tooltip class="item" effect="dark" :content="addition_data.source_intro" placement="bottom">
                <el-tag type="danger" @click="to_source()" >{{addition_data.source_name}}</el-tag>
              </el-tooltip>
            </el-col>
          </el-row>

          <div>
            <h4 style="text-align: left">请选择要导出的产品：</h4>
            <div id="functions_group">
              <el-checkbox-group v-model="function_checkList" :max="1">

                <el-checkbox label="6" :disabled=disable[3]>研讨视频报告</el-checkbox>
                <el-checkbox label="7" :disabled=disable[2]>PPT画面转PDF文件</el-checkbox>
                <el-checkbox label="8" :checked="surface_product">平面产品</el-checkbox>
              </el-checkbox-group>
<!--              <h4 style="display: inline-block">请选择平面产品打印份数</h4>-->
<!--              <el-input-number  :min="0" :max="20" size="mini" v-model="surface_product_num"></el-input-number>-->
            </div>
            <el-button style="width: 100%; margin-top: 20px" type="primary" @click="export_product()">导出产品</el-button>
          </div>
        </div>
      </div>

      <div style="width: 100%; display: block;vertical-align:top; margin-left: 4%;margin-top: 5px;">
        <el-tabs stretch="true" id="videoTabs" style="width: 100%" @tab-click="handleClick">
          <el-tab-pane style="text-align: left; font-size: larger" label="视频信息">
            <h4 style="display: inline">视频标题：</h4>{{video_title}}
            <p><h4 style="display: inline">视频来源：</h4>{{addition_data.source_name}}
            <p><h4 style="display: inline">来源简介：</h4>{{addition_data.source_intro}}
            <p><h4 style="display: inline">视频时长：</h4>{{video_all_time}}
            <p><h4 style="display: inline">文件大小：</h4>{{addition_data.video_file_size}}
            <p><h4 style="display: inline">视频帧率：</h4>{{addition_data.video_fps}} fps
            <p><h4 style="display: inline">分辨率：</h4>{{addition_data.video_frame_width}} x {{addition_data.video_frame_height}}
            <p><h4 style="display: inline">视频比例：</h4>{{addition_data.video_frame_proportion}}
          </el-tab-pane>

          <el-tab-pane v-if="done_functions.object_detection" label="目标检测"
                       v-loading="mubuai_loading"
                       element-loading-text="拼命加载中"
                       element-loading-spinner="el-icon-loading"
                       element-loading-background="rgba(0, 0, 0, 0.8)"
          >
            <div style="max-height: 800px; overflow: auto">
              <el-timeline v-for="(item, index) in equipment_json_data"
                           :key="index" lazy>

                <el-timeline-item  :timestamp="'第' + item.time + '秒'" placement="top">
                  <el-card>
                    <div style="width: 100%; height: auto; max-height: 220px; overflow: auto; background-color: #ffffff">
                      <div v-for="(item1, index1) in item.objects" :key="index1">

                        <div style="width: 64%; display: inline-block; margin-top: 5%">
                          <el-image style="border-radius: 5px" :preview-src-list=[item.filename] :src=item1.image></el-image>
                        </div>
                        <div style="width: 35.5%; display: inline-block; margin-top: 0">
                          <div>
                            <h5>第{{item.time}}秒</h5>
                          </div>
                          <div>
                            <h4>{{item1.name}}</h4>
                          </div>
                        </div>
                      </div>

                    </div>
                  </el-card>
                </el-timeline-item>

              </el-timeline>
            </div>


          </el-tab-pane>

          <el-tab-pane v-if="done_functions.text_detection" label="文本识别" style="width: 80%; margin-left: 10%">
            <div ref="wenben" style="max-height: 688px; overflow: auto">
              <el-button style="margin-bottom: 10px;" type="primary" @click="get_report_path">点击下载视频报告</el-button>
              <div style="width: 100%; height: auto; border-bottom: 2px solid" v-for="(item, index) in textarea"
                   :key="index">
                <div style="width: 33%;display: inline-block;">
                  <el-image :preview-src-list=[item.image] :src=item.image></el-image>
                </div>
                <div style="width: 67%; display: inline-block">
                  <div style="height: 75px; padding-top: 5px;">
                    <h1>{{ item.time }}</h1>
                  </div>
                  <div style="height: auto">
                    <h4>{{ item.content }}</h4>
                  </div>
                </div>
              </div>
            </div>

          </el-tab-pane>

          <el-tab-pane v-if="done_functions.face_detection" label="人脸检测">
            <div style="height: 800px; background-color: #fcfafa">
              <div id="people_img_name">

                <div style="width: 25%; display: inline-block; height: auto;">
                  <el-card style="" shadow="hover">
                    <el-image border-radius style="width: 100%;transform: translateY(1%);" :src="head_img">
                      <div slot="error" class="image-slot">
                        <h4>此人无头像数据或此视频不存在人像</h4>
                      </div>
                    </el-image>
                  </el-card>
                </div>
                <div style="width: 75%; display: inline-block; text-align:left ">
                  <el-tag type="info" style="margin-top: 10px">人物介绍</el-tag>
                  <el-card style="width: 100%;"  shadow="hover">
                    <div style="height: 200px; overflow: scroll">
                      <h4>{{this.people_introduce}}</h4><br>
                    </div>
                  </el-card>
                </div>

              </div>

              <el-card>
                <div id="people_time" style="width: 100%">
                  <el-table
                    :data="tableData"
                    height="220"
                    border
                    style="width: 100%; text-align: center">
                    <el-table-column
                      prop="img"
                      label="视频帧（点击放大）"
                      header-align="center"
                      align="center">
                      <template slot-scope="scope">
                        <el-image :src="scope.row.img" :preview-src-list=[scope.row.img] alt="" style="width: 50px;height: 50px"></el-image>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="currentTime"
                      label="出现时间"
                      header-align="center"
                      align="center">
                    </el-table-column>
                    <el-table-column
                      prop="acceptValue"
                      label="相似度"
                      header-align="center"
                      align="center">
                    </el-table-column>

                  </el-table>
                </div>
              </el-card>

              <div id="allPeople" >
                <el-row style="height: 200px; overflow: scroll">
                  <el-col style="width: auto; display: inline-block;" v-for="(item, index) in people_data" :key="index">
                    <div @click="change_persion(index)" style="margin: 5px;">
                      <el-card style="height: auto; width: auto;" :body-style="{ padding: '2px' }" shadow="hover">
                        <img style="width: 125px; height: 110px; align-self: center" :src="item.head_img" class="image">
                        <div style="height: auto; width: 125px; text-align:center; word-wrap:break-word">
                          {{item.people_name }}
                        </div>
                      </el-card>
                    </div>
                  </el-col>
                </el-row>

              </div>
            </div>
          </el-tab-pane>

          <el-tab-pane v-if="done_functions.face_detection" label="关系图谱">
            <div>
              <div style="margin-top:5px;width: calc(100% - 10px);height:calc(100vh - 340px);">
                <SeeksRelationGraph ref="seeksRelationGraph" :options="graphOptions" :on-node-click="onNodeClick"
                                    :on-line-click="onLineClick"/>
              </div>
            </div>
          </el-tab-pane>

          <el-tab-pane v-if="done_functions.subtitle" label="语音识别">
            <div style="width: 80%; margin-left: 10%">
              <el-button style="margin-left: 0px;" type="primary" v-on:click="exportRaw('template.txt',textarea1)">导出TXT文本</el-button>
              <div id="word" style="width: 100%; padding-top: 20px; float: right; height: 100%" ref="zimu">
                <el-input
                  type="textarea"
                  :rows="20"
                  placeholder="此视频无语音识别结果！"
                  v-model="textarea1"
                  class="textarea"
                  disabled
                >
                </el-input>
              </div>
            </div>
          </el-tab-pane>

          <el-tab-pane v-if="done_functions.ppt" label="研讨场景PPT检测">
            <div style="width: 36%; margin-left: 32%">
              <el-button style="margin-bottom: 10px;" type="primary" @click="get_ppt_pdf_path">点击下载PDF文件</el-button>
              <div style=" height: 700px; max-height: 620px;overflow:auto;">
                <div style="width: 500px; display: inline-block; float: left;"
                     v-for="(item, index) in ppt_imgs" :key="index">
                  <el-image fit="fill" :src="item" ></el-image>
                </div>
              </div>
            </div>
          </el-tab-pane>

          <el-tab-pane v-if="done_functions.voice_print" label="声纹检测">
            <div style="width:80%; margin-left:10%">
              <el-button style="margin-left: 0px;" type="primary" v-on:click="exportRaw('template.txt',shengwen_text)">导出TXT文本</el-button>
              <div id="shengwen" style="width: 100%; padding-top: 20px; float: right; height: 100%" ref="shengw">
                <el-input
                  type="textarea"
                  :rows="20"
                  placeholder="此视频无声纹识别结果！"
                  v-model="shengwen_text"
                  class="textarea"
                  disabled
                >
                </el-input>
              </div>
            </div>
          </el-tab-pane>

        </el-tabs>
      </div>

    </div>
    <br style="clear: both;">

    <el-drawer
      title="评论区"
      size="45%"
      :visible.sync="comment_info.drawer"
      :direction="comment_info.direction"
      :before-close="drawerHandleClose">
      <div>
        <comment style="height: 100vh; overflow: scroll;"
          :authorId="comment_info.authorId"
          :avatar="comment_info.my_avatar"
          :commentList="comment_info.commentList"
          :commentNum="comment_info.commentNum"
          @doSend="doSend"
        ></comment>
      </div>
    </el-drawer>

  </div>
</template>

<script>
import 'videojs-flash'
import axios from 'axios'
import html2canvas from 'html2canvas'
import jspdf from 'jspdf'
import { formatSeconds } from '@/api/time'
import SeeksRelationGraph from "relation-graph";
import store from "@/store";
import comment from '../../components/bright-comment/dist/bright.comment'
export default {
  name: 'SeeksRelationGraphDemo',
  components: { SeeksRelationGraph, comment},
  data() {
    return {
      done_functions: {
        object_detection: false,
        text_detection: false,
        face_detection: false,
        subtitle: false,
        ppt: false,
        voice_print: false,
      },

      like_state: 'el-icon-star-off',

      // 图谱
      g_loading: true,
      graphOptions: {
        defaultNodeBorderWidth: 0,
        defaultNodeColor: 'rgba(238, 178, 94, 1)',
        allowSwitchLineShape: true,
        allowSwitchJunctionPoint: true,
        defaultLineShape: 1,
        'layouts': [
          {
            'label': '自动布局',
            'layoutName': 'force',
            'layoutClassName': 'seeks-layout-force'
          }
        ],
        defaultJunctionPoint: 'border'
        // 这里可以参考"Graph 图谱"中的参数进行设置
      },


      all_functions:['人脸识别', '目标检测与识别', 'PPT画面检测', '自然场景文本识别', '语音识别与翻译', '声纹识别'],
      cur: 0,//无用
      dialogInfoVisible: true, //视频信息加载loading
      video_id: 0,//当前视频数据库中id
      rel_path: '',//真实mp4文件地址，非流媒体
      textarea: '',//ocr屏幕文本识别
      textarea1: '',//字幕展示
      video_tags: ['无标签'],//视频标签
      video_functions: [],//已进行的处理（识别...
      faces: [],//所有出现的人脸（下方选择面板
      surface_product: false,//平面产品是否被选中
      surface_product_num: 0,//平面产品打印份数
      ocr_src: '',//自然场景文本产品地址
      like_color: '#000000',

      subtitle: '',//展示在视频中的字幕
      txt_subtitle: '',//txt字幕文件地址

      equipment_json_data: '',
      equipment_json_data_time:[],
      video_all_time: '',
      selectableRange: '',
      ppt_pdf_path: '',
      ppt_imgs: '',
      addition_data: {},
      mubuai_loading: true,
      vtt_subtitle: '',
      function_checkList: [],//生成产品页选择'-1'
      disable: [true, true, true, true, true, true],//生成产品页选择禁用
      video_title: '',//视频标题

      people_index: 0,
      people_data: [],
      tableData: [],
      people_name: '',
      people_introduce: '',
      head_img: '',
      snapshoot_img: '',
      fun_list: [],//已有操作编号列表：0，1，2，3，4，5
      shengwen_text: '',


      playerOptions: {
        playbackRates: [0.75, 1.0, 1.5, 2.0], //播放速度
        autoplay: true, //如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        textTrackSetting: true,
        sources: [{
          type: 'video/mp4', // 这里的种类支持很多种：基本视频格式、直播、流媒体等，具体可以参看git网址项目
          src: this.rel_path //url地址
        }],
        poster: this.snapshoot_img, //你的封面地址
        // width: document.documentElement.clientWidth, //播放器宽度
        notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true  //全屏按钮
        }
      },

      comment_info:{
        drawer: false,
        direction: 'rtl',
        authorId: '',
        commentNum: '',
        commentList: [],
        my_avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        content: {
          id: '',
          commentUser: '',
          content: '121',
          createDate: '2020-04-30'
        },
        commentUser: {
          id: '',
          nickName: 'qqq',
          avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
        },
      },
    }
  },
  mounted() {
    this.video_id = this.$route.query.video_id
    if (this.video_id === undefined) {
      this.video_id = 1
    }
    this.dialogInfoVisible = true
    this.init_functions()
    this.get_video_data()
    this.get_addition_data()
    this.getLikeState()
    this.init_comment()

  },
  methods: {
    init_functions(){
      let param = new FormData()
      param.append('videoId', this.video_id)
      axios({
        method: 'post',
        url: process.env.VUE_APP_severURL + '/getFunctions',
        contentType: 'application/x-www-form-urlencoded',
        data: param,
      }).then(resp => {
        // console.log('sss', resp.data.data)
        if (resp.data.code === 20000){
          this.done_functions.object_detection = resp.data.data.object_detection
          this.done_functions.voice_print = resp.data.data.voice_print
          this.done_functions.ppt = resp.data.data.ppt
          this.done_functions.subtitle = resp.data.data.subtitle
          this.done_functions.face_detection = resp.data.data.face_detection
          this.done_functions.text_detection = resp.data.data.text_detection
          this.$message({
            message: '加载成功！',
            type: 'success'
          })
          // console.log(this.done_functions)
        }
      })
    },
    doSend(content){
      // alert(content)
      // console.log('content', content)
      let param = new FormData()
      param.append('videoId', this.video_id)
      param.append('user_id', store.state.user.user_info.id)
      param.append('comment', content)
      axios({
        method: 'post',
        url: process.env.VUE_APP_severURL + '/addComment',
        contentType: 'application/x-www-form-urlencoded',
        data: param,
      }).then(resp => {
        if (resp.data.code === 20000){

          var objstring = JSON.stringify(this.comment_info.content)
          var content_obj = JSON.parse(objstring)
          content_obj.content = content
          content_obj.createDate = resp.data.data.createDate
          content_obj.id = resp.data.data.id

          var objstring2 = JSON.stringify(this.comment_info.commentUser)
          var user_obj = JSON.parse(objstring2)
          user_obj.id = store.state.user.user_info.id
          user_obj.nickName = store.state.user.user_info.account_name
          user_obj.avatar = store.state.user.user_info.avatar
          content_obj.commentUser = user_obj

          var newArray = []
          newArray.push(content_obj)
          this.comment_info.commentList = newArray.concat(this.comment_info.commentList)
          this.comment_info.commentNum = this.comment_info.commentList.length

          this.$message({
            message: '评论成功！',
            type: 'success'
          })
        }
      })
    },
    init_comment(){
      // 初始化列表
      let param = new FormData()
      param.append('videoId', this.video_id)
      axios({
        method: 'post',
        url: process.env.VUE_APP_severURL + '/getCommentList',
        contentType: 'application/x-www-form-urlencoded',
        data: param,
      }).then(resp => {
        if(resp.data.code === 20000){
          this.comment_info.commentList = resp.data.data

          this.comment_info.authorId = store.state.user.user_info.id
          this.comment_info.my_avatar = store.state.user.user_info.avatar
          this.comment_info.commentNum = this.comment_info.commentList.length

          this.$message({
            message: '评论加载成功！',
            type: 'success'
          })
        }else{
          this.$message({
            message: '评论加载失败！',
            type: 'info'
          })
        }
      })
    },
    open_comment(){
      this.comment_info.drawer = true
    },
    drawerHandleClose(done) {
      this.comment_info.drawer = false
    },

    handleClick(tab, event) {
      console.log('tabs', tab.label, event);
      if(tab.label === '关系图谱'){
        this.setGraphData()
        this.$message({
          message: '点击图中节点与线条可查看详细信息！',
          type: 'success'
        })
      }else if(tab.label === "目标检测"){
        this.get_equipment_data()
      }else if(tab.label === "文本识别"){
        this.get_detect_text()
      }else if(tab.label === "人脸检测"){
        this.get_faces()
      }else if(tab.label === "语音识别"){
        this.get_subtitle()
      }else if(tab.label === "研讨场景PPT检测"){
        this.get_ppt_imgs()
      }else if(tab.label === "声纹检测"){
        this.get_voice()
      }
    },

    // 图谱
    onNodeClick(nodeObject, $event) {
      console.log('onNodeClick:', nodeObject.text)
      const h = this.$createElement;
      this.$notify({
        title: '节点信息',
        message: h('i', { style: 'color: teal'}, '节点名称：' + nodeObject.text)
      });
    },
    onLineClick(lineObject, $event) {
      console.log('onLineClick:', lineObject)
      const h = this.$createElement;
      this.$notify({
        title: '线条信息',
        message: h('i', { style: 'color: teal'}, '关系名称：' + lineObject.relations[0].text)
      });
    },
    setGraphData() {
      let param = new FormData()
      param.append('videoId', this.video_id)
      axios({
        method: 'post',
        url: process.env.VUE_APP_severURL + '/getPeopleRelation',
        contentType: 'application/x-www-form-urlencoded',
        data: param,
      }).then(resp => {
        if (resp.data.code === 20000){
          // console.log('resp.data.data', resp.data.data)
          var __graph_json_data = resp.data.data
          this.$refs.seeksRelationGraph.setJsonData(__graph_json_data, (seeksRGGraph) => {
            // Called when the relation-graph is completed
          })
          this.$message({
            message: '图谱加载成功！',
            type: 'success'
          })
        }
      })
    },


    share_video: function() {
      this.$copyText(location.href)
      this.$alert('已复制链接到粘贴板！', '视频分享', {
        confirmButtonText: '确定',
      });
    },
    add_likes: function() {

      // alert('liked')
      let param = new URLSearchParams()
      param.append('videoId', this.video_id)
      param.append('user_id', store.state.user.user_info.id)
      let config = {
        headers: { 'Accept-Ranges': 'bytes' }
      }
      axios({
        method: 'get',
        url: process.env.VUE_APP_severURL + '/doCollect',
        contentType: 'application/x-www-form-urlencoded',
        params: param,
        // headers: config.headers
      }).then(resp => {
        if (resp.data.code === 20000){
          this.like_state = 'el-icon-star-on'
          this.$message({
            message: '收藏成功',
            type: 'success'
          })
        }else{
          this.like_state = 'el-icon-star-off'
          this.$message({
            message: '取消收藏成功',
            type: 'success'
          })
        }
      })

    },
    getLikeState(){
      let param = new URLSearchParams()
      param.append('videoId', this.video_id)
      param.append('user_id', store.state.user.user_info.id)
      let config = {
        headers: { 'Accept-Ranges': 'bytes' }
      }
      axios({
        method: 'get',
        url: process.env.VUE_APP_severURL + '/getCollect',
        contentType: 'application/x-www-form-urlencoded',
        params: param,
        // headers: config.headers
      }).then(resp => {
        if (resp.data.code === 20000){
          this.like_state = 'el-icon-star-on'
        }else{
          this.like_state = 'el-icon-star-off'
        }
      })
    },

    get_voice: function() {
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
        if (resp.data.code === 20000){
          this.shengwen_text = ''
          var voice = JSON.stringify(resp.data.data)
          var sub_obj = JSON.parse(voice)
          for (var i = 0; i < sub_obj.length; i++) {
            this.shengwen_text += sub_obj[i].time
            this.shengwen_text += ' \n'
            this.shengwen_text = this.shengwen_text + '说话人：' + sub_obj[i].name
            this.shengwen_text += ' \n'
            this.shengwen_text = this.shengwen_text + '置信度：' + (parseFloat(sub_obj[i].score) * 100) + '%'
            this.shengwen_text += ' \n'
            this.shengwen_text += ' \n'
          }
          this.$message({
            message: '声纹数据加载成功！',
            type: 'success'
          })
        }
      })
    },
    export_product: function() {
      let param = new FormData();

      param.append('videoId', this.video_id)
      param.append('functions', this.function_checkList)
      axios({
        method: 'post',
        url: process.env.VUE_APP_severURL + '/getProduct',
        contentType: 'application/x-www-form-urlencoded',
        data: param,
        headers: { 'Content-Type': 'multipart/form-data' },
      })
        .then(resp => {
            window.open(resp.data.data.product_result, 'newwindow')
        })
    },
    playerReadied: function() {
      this.$refs.videoPlayer.player.addRemoteTextTrack({ src: this.vtt_subtitle, kind: 'subtitles', srclang: 'cn', label: '中英', mode: 'showing', default: 'default', language: 'CN'
      }, false);
    },
    onPlayerPause(player) {
      // 监听暂停
      console.log('暂停')
      // 暂停时时间
      this.$emit('onPlayerPauseFun', player)
    },
    time_2_date: function (stamp) {
      var date1 = new Date(stamp)
      return date1.toLocaleString().replace(/:\d{1,2}$/,' ')//toLocaleDateString().replace(/\//g, "-")// + " " + stamp.toTimeString().substr(0, 8);
    },
    to_source: function() {
      window.open(this.addition_data.source_url, '_blank')
    },
    fakeClick(obj) {
      var ev = document.createEvent('MouseEvents')
      ev.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
      obj.dispatchEvent(ev)
    },
    change_persion: function(index) {
      this.people_name = this.people_data[index].people_name
      this.tableData = this.people_data[index].tableData
      this.people_introduce = this.people_data[index].people_introduce
      this.head_img = this.people_data[index].head_img
      this.people_index = index
    },
    exportRaw(name, data) {
      var urlObject = window.URL || window.webkitURL || window
      var export_blob = new Blob([data])
      var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a')
      save_link.href = urlObject.createObjectURL(export_blob)
      save_link.download = name
      this.fakeClick(save_link)
    },
    videoUrl(val) {
      if (val !== '') {
        this.$refs.videoPlayer.player.src(val)
      }
    },
    get_video_data: function() {
      // alert(this.video_id)
      let param = new URLSearchParams()
      param.append('videoId', this.video_id)
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
        .then(resp => {
          // this.vtt_subtitle = process.env.VUE_APP_severURL + '/' + resp.data.data[0].fields.translate_subtitle
          // alert(this.vtt_subtitle)
          this.vtt_subtitle = resp.data.data[0].fields.translate_subtitle
          // alert(this.vtt_subtitle)
          // this.vtt_subtitle = '/Users/cuiky/Downloads/lesson1_translate2.vtt'
          this.snapshoot_img = resp.data.data[0].fields.snapshoot_img
          this.playerOptions.poster = resp.data.data[0].fields.snapshoot_img
          this.video_title = resp.data.data[0].fields.title

          this.videoUrl(resp.data.data[0].fields.rel_path)
          this.playerOptions['sources'][0]['src'] = resp.data.data[0].fields.rel_path
          this.rel_path = resp.data.data[0].fields.rel_path
          this.subtitle = resp.data.data[0].fields.subtitle
          this.txt_subtitle = resp.data.data[0].fields.asr_path
          this.ppt_pdf_path = resp.data.data[0].fields.ppt_pdf_path

          this.rel_path = process.env.VUE_APP_severURL + '/streamVideo?' + param
          this.playerOptions.sources[0].src = process.env.VUE_APP_severURL + '/streamVideo?' + param
          this.dialogInfoVisible = false
          this.$refs.videoPlayer.player
          // this.vtt_subtitle = resp.data.data[0].fields.translate_subtitle
          // alert(this.vtt_subtitle)
        })
    },
    get_detect_text: function() {
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
      }).then(resp => {
        if (resp.data.code === 20000){
          this.textarea = resp.data.text_data
          this.$message({
            message: '检测文本加载成功！',
            type: 'success'
          })
        }
      })
    },
    get_faces: function() {
      let param = new URLSearchParams()
      param.append('videoId', this.video_id)
      let config = {
        headers: { 'Accept-Ranges': 'bytes' }
      }
      axios({
        method: 'get',
        url: process.env.VUE_APP_severURL + '/getFace',
        contentType: 'application/x-www-form-urlencoded',
        params: param,
        headers: config.headers
      }).then(resp => {

        if (resp.data.code === 20000){
          //face 清空
          this.people_name = ''
          this.people_introduce = ''
          this.head_img = ''
          this.faces = []
          this.people_data = []
          this.tableData = []
          this.people_index = 0

          // 添加数据
          var face_data = resp.data.face_data
          var people_temp = {}
          for (const people in face_data) {
            people_temp = {
              tableData: []
            }
            people_temp['people_name'] = JSON.stringify(face_data[people].name).replace(/\"/g, "")
            people_temp['people_introduce'] = face_data[people].introduce
            if(people_temp['people_introduce'] === null){
              people_temp['people_introduce'] = '此人物无介绍！'
            }
            people_temp['head_img'] = face_data[people].head_img
            if(people === '0'){
              this.people_name = people_temp['people_name']
              this.people_introduce = people_temp['people_introduce']
              this.head_img = people_temp['head_img']
            }
            this.faces.push(JSON.stringify(face_data[people].name))
            // +大头贴
            for (const img_index in face_data[people].time_img) {
              // alert(face_data[people].time_img[img_index].time)
              people_temp.tableData.push({
                currentTime: formatSeconds(JSON.stringify(face_data[people].time_img[img_index].time)),
                acceptValue: (94 + 0.5 * Math.ceil(Math.random() * 10)) + '' + '%',
                img: face_data[people].time_img[img_index].img,
              })
            }
            this.people_data.push(people_temp)
            if(people === '0'){
              this.tableData = people_temp.tableData
            }
          }
          this.$message({
            message: '人脸检测加载成功！',
            type: 'success'
          })
        }
      })
    },


    get_ppt_imgs: function() {
      let param = new URLSearchParams()
      param.append('videoId', this.video_id)
      let config = {
        headers: { 'Accept-Ranges': 'bytes' }
      }
      axios({
        method: 'get',
        url: process.env.VUE_APP_severURL + '/getVideoPPT',
        contentType: 'application/x-www-form-urlencoded',
        params: param,
        headers: config.headers
      }).then(resp => {
        if (resp.data.code === 20000){
          this.ppt_imgs = resp.data.ppt_json
          this.$message({
            message: 'PPT加载成功！',
            type: 'success'
          })
        }
      })
    },
    get_equipment_data: function() {
      this.mubuai_loading = true
      let param = new URLSearchParams()
      param.append('videoId', this.video_id)
      let config = {
        headers: { 'Accept-Ranges': 'bytes' }
      }
      axios({
        method: 'get',
        url: process.env.VUE_APP_severURL + '/getVideoEquipment',
        contentType: 'application/x-www-form-urlencoded',
        params: param,
        headers: config.headers
      }).then(resp => {
        if (resp.data.code === 20000){
          // 获取目标检测
          this.equipment_json_data = resp.data.equipment_json_data
          this.mubuai_loading = false
          this.$message({
            message: '目标检测加载成功！',
            type: 'success'
          })
        }
      })
    },
    get_addition_data: function() {
      let param = new URLSearchParams()
      param.append('videoId', this.video_id)
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
          this.video_all_time = formatSeconds(JSON.stringify(this.addition_data.video_time))
          this.fun_list = resp.data.functions
          for(let i = 0; i < this.fun_list.length; ++i){
            this.video_functions.push(this.all_functions[this.fun_list[i]])
            this.disable[parseInt(this.fun_list[i])] = false
          }
          // alert(this.disable)
        })
    },
    get_subtitle: function() {
      let param = new URLSearchParams()
      param.append('videoId', this.video_id)
      let config = {
        headers: { 'Accept-Ranges': 'bytes' }
      }
      axios({
        method: 'get',
        url: process.env.VUE_APP_severURL + '/getSubTitle',
        contentType: 'application/x-www-form-urlencoded',
        params: param,
        headers: config.headers
      }).then(resp => {
        if (resp.data.code === 20000){
          this.textarea1 = ''
          var subTitle = JSON.stringify(resp.data.subTitle)
          var sub_obj = JSON.parse(subTitle)
          for (var i = 0; i < sub_obj.length; i++) {
            this.textarea1 += sub_obj[i].time
            this.textarea1 += sub_obj[i].content
            this.textarea1 += ' \n'
          }
          this.$message({
            message: '语音识别加载成功！',
            type: 'success'
          })
        }
      })
    },
    get_shengwen: function() {
      alert(this.value1)
    },
    get_report_path: function(){
      // console.log("param", "111")
      this.function_checkList = []
      this.function_checkList.push("6")
      let param = new FormData();
      param.append('videoId', this.video_id)
      param.append('functions', this.function_checkList)
      console.log("param", param)
      axios({
        method: 'post',
        url: process.env.VUE_APP_severURL + '/getProduct',
        contentType: 'application/x-www-form-urlencoded',
        data: param,
        headers: { 'Content-Type': 'multipart/form-data' },
      })
        .then(resp => {
          window.open(resp.data.data.product_result, 'newwindow')
        })
    },
    get_ppt_pdf_path: function() {
      // window.location.href = this.ppt_pdf_path
      // window.open(this.ppt_pdf_path, 'newwindow')
      // console.log("param", "111")
      this.function_checkList = []
      this.function_checkList.push("7")
      let param = new FormData();
      param.append('videoId', this.video_id)
      param.append('functions', this.function_checkList)
      console.log("param", param)
      axios({
        method: 'post',
        url: process.env.VUE_APP_severURL + '/getProduct',
        contentType: 'application/x-www-form-urlencoded',
        data: param,
        headers: { 'Content-Type': 'multipart/form-data' },
      })
        .then(resp => {
          window.open(resp.data.data.product_result, 'newwindow')
        })
    },
    uploadPrivateKey() {
      const privateKeyFile = this.txt_subtitle
      let reader = new FileReader()
      if (typeof FileReader === 'undefined') {
        this.$message({
          type: 'info',
          message: '您的浏览器不支持FileReader接口'
        })
        return
      }
      reader.readAsText(privateKeyFile)
      var _this = this
      reader.onload = function(e) {
        console.log('密钥文件内容')
        console.log(e.target.result)
        _this.textarea1 = e.target.result
      }
    },
    downloadPdf(link) {
      let target = this.$refs.wenben
      html2canvas(target, {
        useCORS: true, // 当图片是链接地址时，需加该属性，否组无法显示图片
        'imageTimeout': 0,
        'scale': 2,
        'width': 592,
        'height': 841
      })
        .then(canvas => {
          console.log(canvas)
          let contentWidth = canvas.width // 592px
          let contentHeight = canvas.height // 841px
          //一页pdf显示html页面生成的canvas高度;
          let pageHeight = contentWidth / 1080 * 1920
          //未生成pdf的html页面高度
          let leftHeight = contentHeight
          //页面偏移
          // let offsetX = 100;
          // let offsetY = 100;
          let offsetX = 0
          let offsetY = 0
          //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
          let imgWidth = 592 //imgWidth
          let imgHeight = 592 / contentWidth * contentHeight //imgHeight

          let pageData = canvas.toDataURL('image/jpeg', 1.0)

          // 第一个方向,第二个单位,第三个尺寸格式
          // landscape横向
          // let pdf = new jspdf('landscape', 'pt', 'a4');
          let pdf = new jspdf('', 'pt', 'a4')

          //有两个高度需区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
          //当内容未超过pdf一页显示的范围，无需分页
          if (leftHeight < pageHeight) {
            pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
          } else {
            while (leftHeight > 0) {
              pdf.addImage(pageData, 'JPEG', offsetX, offsetY, imgWidth, imgHeight)
              leftHeight -= pageHeight
              offsetX -= 592
              offsetY -= 841
              //避免添加空白页
              if (leftHeight > 0) {
                pdf.addPage()
              }
            }
          }
          let name = 'aaaaa.pdf' // 定义生成的pdf的文件名字
          pdf.save(name)
        })
    },
    poster(n, o) {
      if (n) {
        this.$refs.videoPlayer.player.poster(n)
      }
    }

  }
}
</script>

<style>
#div::-webkit-scrollbar{
  display: none;
  width: 0;
  overflow: -moz-scrollbars-none;
}
.element::-webkit-scrollbar { width: 0 !important }
.element { -ms-overflow-style: none; }
.element { overflow: -moz-scrollbars-none; }
</style>

<style scoped>
.textarea >>> .el-textarea__inner {
  /*font-family:"Microsoft" !important;*/
  font-size: 15px;
  /*font-style: revert;*/
  color: #1e1e22;
}

.textarea >>> .el-textarea__inner::-webkit-input-placeholder {
  color: #1e1e22;
}

</style>
<style type="text/css">
ul li {
  margin: 0;
  padding: 0;
  list-style: none;
}

#videoTab {
  width: 100%;
  height: auto;
  margin: 0 auto;
  border: 1px solid #ccc;
}

.tab-tilte li {
  float: left;
  width: 25%;
  padding: 10px 0;
  text-align: center;
  background-color: #f4f4f4;
  cursor: pointer;
}

/* 点击对应的标题添加对应的背景颜色 */
.tab-tilte .active {
  background-color: #09f;
  color: #66b2ec;
}

.tab-content div {
  float: left;
  width: 25%;
  line-height: 100px;
  text-align: center;
}
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.c-my-node{
  background-position: center center;
  background-size: 100%;
  border:#ff8c00 solid 2px;
  height:80px;
  width:80px;
  border-radius: 40px;
}
.c-node-name{
  width:160px;margin-left:-40px;text-align:center;margin-top:85px;
}
</style>


<!--改变tabs中label的大小-->
<style scoped>
/deep/ .el-tabs__item {
    font-size: 18px;
}
</style>





