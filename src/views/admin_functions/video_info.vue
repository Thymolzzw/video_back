<template>
  <div class="video_info">
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
      <el-button type="primary" @click="get_addition_data(video_value)">加载</el-button>
    </div>

    <div>
      <div style="margin-top: 15px; margin-bottom: 15px; margin-left: 40%">
        <el-tag>视频标题：</el-tag>
        <el-tag>{{video_name}}</el-tag>
      </div>
      <el-table :data="tableData"  border style="width: 100%">
        <el-table-column type="index" label="编号" :index="indexMethod" width="80">
        </el-table-column>
        <el-table-column prop="items" label="内容" width="180">
        </el-table-column>
        <el-table-column prop="value" label="值">
        </el-table-column>
        <el-table-column label="修改内容">
          <template slot-scope="scope">
            <el-select v-if="scope.$index == 2" v-model="scope.row.new_value" placeholder="请选择">
              <el-option
                v-for="item in country_list"
                :key="item.country_id"
                :label="item.country_name"
                :value="item.country_id">
              </el-option>
            </el-select>
            <el-select v-else-if="scope.$index == 0" v-model="scope.row.new_value" placeholder="请选择">
              <el-option
                v-for="item in resource_list"
                :key="item.resource_id"
                :label="item.resource_name"
                :value="item.resource_id">
              </el-option>
            </el-select>
            <div v-else-if="scope.$index == 3">
              <el-tag
                :key="tag"
                v-for="tag in tag_list"
                closable
                :disable-transitions="false"
                @close="handleClose(tag)">
                {{tag}}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm"
              >
              </el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
            </div>

            <el-input v-else type="textarea" v-model="scope.row.new_value"></el-input>


          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" @click="change_data(scope.row, scope.$index)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
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
      currentDate: new Date(),
      videos: [],
      video_value: '',
      video_id: '',
      video_name: '请选择视频',
      disabled: false,
      functions: functions,
      checkboxGroup1: [],
      sorted_list: [],
      addition_data: {},
      video_functions: [],
      tableData: [],
      country_list: [],
      resource_list: [],
      tag_list: [],


      inputVisible: false,
      inputValue: ''
    }
  },
  mounted() {
    console.log('src/views/admin_functions/video_info.vue')
    this.get_videos()
    this.getCountryList()
    this.getResourceList()
  },
  name: 'index',
  methods: {
    handleClose(tag) {
      this.tag_list.splice(this.tag_list.indexOf(tag), 1);
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.tag_list.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = '';
    },
    getResourceList:function (){
      this.resource_list = []
      let config = {
        headers: { 'Accept-Ranges': 'bytes' }
      }
      axios({
        method: 'get',
        url: process.env.VUE_APP_severURL + '/getResourceList',
        contentType: 'application/x-www-form-urlencoded',
        headers: config.headers
      }).then(resp => {
        this.resource_list = resp.data.data
        // alert(this.resource_list)
      })
    },
    getCountryList:function (){
      this.country_list = []
      let config = {
        headers: { 'Accept-Ranges': 'bytes' }
      }
      axios({
        method: 'get',
        url: process.env.VUE_APP_severURL + '/getCountryList',
        contentType: 'application/x-www-form-urlencoded',
        headers: config.headers
      }).then(resp => {
          this.country_list = resp.data.data
        })
    },
    change_data: function(row, index) {
      let param = new FormData()
      param.append('videoId', this.video_id)
      if(index === 3){
        param.append('new_value', JSON.stringify(this.tag_list))
      }else{
        param.append('new_value', row.new_value)
      }
      param.append('index', index)
      axios({
        method: 'post',
        url: process.env.VUE_APP_severURL + '/changeVideoInfo',
        contentType: 'application/x-www-form-urlencoded',
        data: param,
      }).then(resp => {
        if(resp.data.code === 20000){
          this.$alert('修改成功', '修改结果', {
            confirmButtonText: '确定',
          });
          if (index === 2){
            let i=0
            for (;i < this.country_list.length;i++ ){
              if(this.country_list[i].country_id === row.new_value){
                break
              }
            }
            this.tableData[index].value = this.country_list[i].country_name

          }else if (index === 0){
            let i=0
            for (;i < this.resource_list.length;i++ ){
              if(this.resource_list[i].resource_id === row.new_value){
                break
              }
            }
            this.tableData[index].value = this.resource_list[i].resource_name
          }else if (index === 1){
            // alert("ok1")
            this.tableData[index].value = row.new_value
          }else if (index === 3){
            // alert(this.tag_list)
            let tag_str = ''
            for(let i=0;i<this.tag_list.length;i++){
              tag_str += this.tag_list[i] + ' '
            }
            this.tableData[index].value = tag_str

          }
          row.new_value = ''
        }
      })

    },
    get_addition_data: function(s) {
      if(s==='')
        return
      this.tableData = []
      let param = new URLSearchParams()
      param.append('videoId', this.promoList[s].id)
      let config = {
        headers: { 'Accept-Ranges': 'bytes' }
      }
      axios({
        method: 'get',
        url: process.env.VUE_APP_severURL + '/getVideoAdditionData',
        contentType: 'application/x-www-form-urlencoded',
        params: param,

      }).then(resp => {
          this.tableData = []
          this.addition_data = resp.data.addition_data
          this.video_name = resp.data.addition_data.video_title
          this.tableData.push({
            items: "视频来源",
            value: resp.data.addition_data.source_name
          })

          this.tableData.push({
            items: "视频介绍",
            value: resp.data.addition_data.video_introduce
          })
          this.tableData.push({
            items: "来源国家",
            value: resp.data.addition_data.country_name
          })
          let tag_str = ''
          this.tag_list = []
          if(this.addition_data.video_tag != null){
            for(let i=0;i< this.addition_data.video_tag.length;i++){
              this.tag_list.push(this.addition_data.video_tag[i])
              tag_str += this.addition_data.video_tag[i] + ' '
            }
          }
          this.tableData.push({
            items: "视频标签",
            value: tag_str
          })
          this.video_id = this.promoList[s].id
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
        })
    },
  }
}
</script>

<style scoped>
.video_info{
  margin-top: 10px;
  margin-left: 10px;
  margin-right: 10px;
}
.el-button{
  margin-left: 10px;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
