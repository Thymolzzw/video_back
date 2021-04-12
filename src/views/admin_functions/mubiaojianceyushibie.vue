<template>
  <div id="video_info" >
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
      <el-button type="primary" @click="get_equipment_data(video_value)">加载</el-button>
      <el-button type="primary" @click="atext(video_value)">测试</el-button>
    </div>

    <div>
      <el-timeline v-for="(item, index) in equipment_json_data"
                   :key="index" lazy>

        <el-timeline-item  :timestamp="'第' + item.time + '秒'" placement="top" style="margin-top: 10px">
          <el-card>
            <div style="width: 100%; height: auto; overflow: auto; background-color: #ffffff">
              <div v-for="(item1, index1) in item.objects" :key="index1">

                <div style="width: 60%; display: inline-block; margin-top: 5%; margin-right: 10px">
                  <el-image style="border-radius: 5px" :preview-src-list=[item.filename] :src=item1.image></el-image>
                </div>
                <div style="width: 35.5%; display: inline-block; margin-top: 0">
                  <div>
                    <h5>第{{item.time}}秒</h5>
                  </div>
                  <div>
                    <h4>{{item1.name}}</h4>
                    <el-input style="display: inline-block; width: 200px;" v-model="new_name[index][index1]" :disabled="false"></el-input>
                    <el-button style="display: inline-block" type="primary" @click="change_data(index, index1, new_name[index][index1])">提交修改</el-button>
                    <el-button style="display: inline-block; margin-top: 7px; margin-left: 35%" type="danger" @click="delete_data(index, index1)">删除该目标</el-button>
                    <hr>
                  </div>
                </div>
              </div>

            </div>
          </el-card>
        </el-timeline-item>

      </el-timeline>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data(){
    return{
      promoList: [],
      input: '',
      videos: [],
      video_value: '',
      video_id: '',
      equipment_json_data: '',
      new_name: [],

    }
  },
  mounted() {
    this.get_videos()

  },
  name: 'index',
  methods: {
    delete_data(index, index1){
      alert(index + index1)

      this.$confirm('是否删除该目标?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let param = new FormData()
        param.append('videoId', this.video_id)
        param.append('imageIndex', index)
        param.append('equipmentIndex', index1)
        axios({
          method: 'post',
          url: process.env.VUE_APP_severURL + '/deleteEquipment',
          contentType: 'application/x-www-form-urlencoded',
          data: param,
        }).then(resp => {
          if(resp.data.code === 20000){

            this.equipment_json_data[index].objects.splice(index1,1)
            if(this.equipment_json_data[index].objects.length === 0){
              this.equipment_json_data.splice(index,1)
            }
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });

    },
    atext: function(s) {
      var pk = this.promoList[s].pk
      alert(pk)
    },
    change_data: function(index, index1, new_name) {
      let param = new FormData()
      param.append('videoId', this.video_id)
      param.append('imageIndex', index)
      param.append('equipmentIndex', index1)
      param.append('equipmentName', new_name)
      let config = {
        headers: { 'Accept-Ranges': 'bytes' }
      }
      axios({
        method: 'post',
        url: process.env.VUE_APP_severURL + '/updateEquipment',
        contentType: 'application/x-www-form-urlencoded',
        data: param,
      }).then(resp => {
          // alert(this.subtitle_list)
          if(resp.data.code === 20000)
            this.equipment_json_data[index].objects[index1].name = new_name
            this.new_name[index][index1] = ''
            this.$alert('修改成功', '修改结果', {
              confirmButtonText: '确定',
            })
        })
    },
    get_equipment_data: function(s) {
      let param = new URLSearchParams()
      this.video_id = this.promoList[s].pk
      param.append('videoId', this.promoList[s].pk)
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
          if(resp.data.code === 20000){
            // 获取目标检测
            if(resp.data.equipment_json_data === null){
              this.$alert('数据加载失败，无此数据！', '加载结果', {
                confirmButtonText: '确定',
              })
            }else{
              this.equipment_json_data = resp.data.equipment_json_data
              for (let i = 0; i < this.equipment_json_data.length; ++i){

                let temp = []
                for (let j = 0; j < this.equipment_json_data[i].objects.length; ++j){
                  temp.push('')
                }
                this.new_name.push(temp)
              }
              this.$message({
                message: '加载成功！',
                type: 'success'
              });
            }
          }
          this.video_id = this.promoList[this.video_value].pk

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
