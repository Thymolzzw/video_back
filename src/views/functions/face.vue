<template>
  <div id="change_faces">

  </div>
</template>

<script>
import axios from 'axios'

export default {
  data(){
    return{
      promoList: [],
      currentDate: new Date()
    }
  },
  mounted() {
    this.get_videos()
  },
  name: 'index',
  methods: {
    get_videos: function () {
      axios.get(process.env.VUE_APP_severURL + '/getAllVideos')
        .then(res => {
          console.log(res.data.data)
          this.promoList = res.data.data
        })
    },
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
  }
}
</script>

<style scoped>

</style>
