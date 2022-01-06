<template>
  <div class='columnMain'>
    <el-input placeholder='输入查找的专栏名' 
      v-model='inputContent' 
      clearable
      suffix-icon="el-icon-search"
      class='right-menu-search'
      @keyup.enter.native="doSearchColumn">
    </el-input>
    <div class='letterDiv' id='letterDiv'>
      <p v-for='(item,index) in letterlist' :key='index'>{{item}}</p>
    </div>
    <ul id='item-list'>
      <li class='item-text' v-for='(item,index) in columnlist' :key='index'>
        <a class='item-link'>
          <span>{{item.resource_name}}</span>
          <span class='item-count'>{{item.videoCount}}</span>
          <p v-show='false'>{{item.resource_id}}</p>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data(){
    return{
      columnlist:[],
      totallist:[],
      videolist:[],
      sourceID:0,
      inputContent:'',
      letterlist:['全部','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','#']
    }
  },
  mounted(){
    this.getColumnList()
    setTimeout(this.setChangeStyle,100)
    setTimeout(this.setliStyle,500)
  },
  methods: {
    getColumnList(){
      this.columnlist = []
      let config = {
        headers:{'Accept-Ranges': 'bytes'}
      }
      axios({
        method: 'get',
        url: process.env.VUE_APP_severURL + '/getColumnResourceList',
        contenType: 'application/x-www-form-urlencoded',
        headers: config.headers
      }).then(resp => {
        for(var j=0;j<resp.data.data.length;j++){
          var obj = {}
          obj.resource_id = resp.data.data[j].resource_id
          obj.resource_name = resp.data.data[j].resource_name
          obj.resource_initial = resp.data.data[j].resource_initial
          obj.videoCount = resp.data.data[j].video_count
          this.columnlist.push(obj)
        }
        this.totallist = this.columnlist
      })
    },
    setChangeStyle(){
      var self = this;
      var list = document.getElementById('letterDiv')
      var p = list.getElementsByTagName('p')
      p[0].className = 'active'
      for(var i=0;i<p.length;i++){
        p[i].onclick = function(){
          for(var j=0;j<p.length;j++){
            p[j].className = ''
          }
          this.className = 'active'
          if(this.innerText == '全部'){
            self.columnlist = self.totallist
          }else{
            var cl = []
            for(var i=0;i<self.totallist.length;i++){
              if(this.innerText == self.totallist[i].resource_initial){
                cl.push(self.totallist[i])
              }
            }
            self.columnlist = cl
          }
          setTimeout(self.setliStyle,500)
        }
      }
    },
    setliStyle(){
      var self = this
      var list = document.getElementById('item-list')
      var li = list.getElementsByTagName('li')
      for(var i=0;i<li.length;i++){
        li[i].onmouseover = function(){
          this.className = 'item-text2'
        }
        li[i].onmouseout = function(){
          this.className = 'item-text'
        }
        li[i].onclick = function(){
          var p = this.getElementsByTagName('p')
          self.sourceID = parseInt(p[0].innerText)
          self.$router.push({path:'/videolist', name:'专栏视频列表',query:{source_id: self.sourceID}})
        }
      }
    },
    doSearchColumn(){
      this.columnlist = []
      if(this.inputContent==''){
        this.columnlist = this.totallist
      }else{
        for(var i=0;i<this.totallist.length;i++){
          if(this.totallist[i].resource_name.indexOf(this.inputContent) != -1){
            this.columnlist.push(this.totallist[i])
          }
        }
      }
      this.setliStyle()
    },
  }
}
</script>

<style scoped>
.columnMain{
  width:100%;
  height:100%;
  margin-top:10px;
  margin-left:10px;
  display:flex;
  flex-direction:column;
  cursor: pointer;
}
.el-input{
  margin-left: 35%;
  width: 30%;
}
.letterDiv{
  margin-left: 7%;
  margin-right: 7%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.letterDiv > p{
  padding:2px 5px 2px 5px;
}
ul li{
  list-style-type:none;
  display:inline;
}
.item-text{
  float:left;
  width:20%;
  padding-top:10px;
  padding-bottom:10px;
  color:black;
}
.item-text2{
  float:left;
  width:20%;
  padding-top:10px;
  padding-bottom:10px;
  color:rgb(24, 144, 255);
}
.item-count{
  margin-left:10px;
  font-size:13px;
  background: rgba(133, 133, 133,0.2);
  padding:2px 5px 2px 5px;
  border-radius: 4px;
}

.active{
  color: rgb(255, 255, 255);
  background: rgb(24, 144, 255);
}
</style>