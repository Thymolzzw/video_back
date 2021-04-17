<template>
  <div>
    <div style="margin-top:50px;width: calc(100% - 10px);height:calc(100vh - 140px);">
      <SeeksRelationGraph ref="seeksRelationGraph" :options="graphOptions" :on-node-click="onNodeClick"
                          :on-line-click="onLineClick"/>
    </div>
  </div>
</template>

<script>
import SeeksRelationGraph from 'relation-graph'
import axios from 'axios'
export default {
  name: 'SeeksRelationGraphDemo',
  components: { SeeksRelationGraph },
  data() {
    return {
      g_loading: true,
      demoname: '---',
      graphOptions: {
        defaultNodeBorderWidth: 0,
        defaultNodeColor: '#79794f',
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
      }
    }
  },
  created() {
  },
  mounted() {
    this.demoname = this.$route.params.demoname
    this.setGraphData()
  },
  methods: {
    onNodeClick(nodeObject, $event) {
      console.log('onNodeClick:', nodeObject.text)

    },
    onLineClick(lineObject, $event) {
      console.log('onLineClick:', lineObject)
    },
    setGraphData() {

      axios({
        method: 'post',
        url: process.env.VUE_APP_severURL + '/getPeopleRelation',
        contentType: 'application/x-www-form-urlencoded',
      }).then(resp => {
        if (resp.data.code === 20000)
          var __graph_json_data = resp.data.data
          this.$refs.seeksRelationGraph.setJsonData(__graph_json_data, (seeksRGGraph) => {
            // Called when the relation-graph is completed
          })
          this.$message({
            message: '加载成功！',
            type: 'success'
          });
      })

    }
  }
}
</script>

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
