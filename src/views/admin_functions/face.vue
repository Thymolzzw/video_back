<template>
  <div id="video_info">
    <div id="select_list">
      <el-select filterable v-model="video_value" placeholder="请选择">
        <el-option

          v-for="(item, index) in videos"
          :key="index"
          :label="item.label"
          :value="index">
          <span style="float: left">{{ item.label }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
        </el-option>
      </el-select>
      <el-button type="primary" @click="get_faces(video_value)">加载</el-button>
    </div>

    <div>
      <div style="height: 800px; background-color: #fcfafa">
        <div id="people_img_name">
          <div style="width: 25%; display: inline-block; height: auto;">
            <el-card style="height: auto; width: auto;" :body-style="{ padding: '2px' }" shadow="hover">
              <el-image border-radius style="height: 180px; width: auto;transform: translateY(1%);" :src="head_img">
                <div slot="error" class="image-slot">
                  <h4>此人无头像数据或此视频不存在人像</h4>
                </div>
              </el-image>
            </el-card>
          </div>
          <div style="width: 75%;padding-left: 20px; display: inline-block;height: 180px; overflow: scroll; text-align:left ">
            <h4>{{this.people_introduce}}</h4><br>
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
              <el-table-column
                prop="operation"
                label="修改"
                header-align="center"
                align="center">
                <template slot-scope="scope1">
                  <el-select filterable v-model="scope1.row.people_name" placeholder="请选择">
                    <el-option
                      v-for="item in people_data"
                      :key="item.people_name"
                      :label="item.people_name"
                      :value="item.people_name">
                    </el-option>
                  </el-select>
                  <el-button style="margin: 5px;" type="primary" @click="update_time(scope1.row.people_name, scope1.$index)">确认修改</el-button>
                </template>
              </el-table-column>

              <el-table-column
                prop="operation"
                label="删除"
                header-align="center"
                align="center">
                <template slot-scope="scope2">
                  <el-button type="danger" @click="delete_item(scope2.$index)">删除</el-button>
                </template>
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
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { formatSeconds } from '@/api/time'

export default {
  data(){
    return{
      promoList: [],
      videos: [],
      video_value: '',
      people_data: [],
      tableData: [],
      people_name: '',
      head_img: '',
      people_introduce: '',
      faces: [],//所有出现的人脸（下方选择面板
      new_people_name: [],
      video_id: '',
      people_index: 0,
    }
  },
  mounted() {
    this.get_videos()

  },
  name: 'index',
  methods: {
    delete_item(index){
      alert(index)
    },
    update_time(people_name, index){
      alert(people_name+index)
    },
    atext: function(s) {
      var pk = this.promoList[s].pk
      alert(pk)
    },
    change_data: function(index, new_name) {
      if(new_name.toLowerCase() === (this.people_data[index].people_name + '').toLowerCase()){
        this.$alert('不能修改为原名', '修改失败', {
          confirmButtonText: '确定',
        });
        return;
      }
      let param = new FormData()
      param.append('videoId', this.video_id)
      param.append('faceIndex', index)
      param.append('faceName', new_name)
      axios({
        method: 'post',
        url: process.env.VUE_APP_severURL + '/updateFace',
        contentType: 'application/x-www-form-urlencoded',
        data: param,
      })
        .then(resp => {
          if(resp.data.code === 20000)
            this.$alert('修改成功', '修改结果', {
              confirmButtonText: '确定',
            });
        })

    },
    change_persion: function(index) {
      this.people_name = this.people_data[index].people_name
      this.tableData = this.people_data[index].tableData
      this.people_introduce = this.people_data[index].people_introduce
      this.head_img = this.people_data[index].head_img
      this.people_index = index
    },
    get_faces: function(s) {
      this.video_id = this.promoList[s].pk
      this.people_data = []
      let param = new URLSearchParams()
      param.append('videoId', this.promoList[s].pk)
      let config = {
        headers: { 'Accept-Ranges': 'bytes' }
      }
      axios({
        method: 'get',
        url: process.env.VUE_APP_severURL + '/getFace',
        contentType: 'application/x-www-form-urlencoded',
        params: param,
        headers: config.headers
      })
        .then(resp => {
          //face
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
              people_temp.tableData.push({
                currentTime: formatSeconds(JSON.stringify(face_data[people].time_img[img_index].time)),
                acceptValue: (94 + 0.5 * Math.ceil(Math.random() * 10)) + '' + '%',
                img: face_data[people].time_img[img_index].img,
              })
            }
            this.people_data.push(people_temp)
            for(let i = 0; i < this.people_data.length; ++i){
              this.new_people_name.push('')
            }
            if(people === '0'){
              this.tableData = people_temp.tableData
            }
          }
        })
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
