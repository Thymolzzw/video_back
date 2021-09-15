<template>
  <div class="wrapper">
    <swiper
      :options="swiperOption"
      class="swiper-container"


    >
      <!-- slides -->
      <swiper-slide class="swiper-item" v-for='item of swiperList' :key='item.id'>
        <img class='swiper-img' :src='item.imgUrl' alt="去哪儿门票"  />
<!--        <el-button href='item.src'></el-button>:onclick="this.mywindow.myfunction().open(item.src)"-->
      </swiper-slide>
      <!-- Optional controls ,显示小点-->
      <div class="swiper-pagination" slot="pagination"></div>
      <div class="swiper-button-prev" slot="button-prev"></div>
      <div class="swiper-button-next" slot="button-next"></div>
<!--      <div class="swiper-pagination"  slot="pagination"></div>-->
    </swiper>
  </div>
</template>
<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import service from "@/utils/request";

var vm = null;
export default {
  name:'HomeSwiper',
  //es6的写法，相当于data:function(){return{swiperOption:{}}}
  components: {
    swiper,
    swiperSlide
  },
  data(){
    return{
      swiperOption:{
        // 参数选项,显示小点
        pagination:'.swiper-pagination',
        //循环
        loop:true,
        autoplay:2000,
        speed:1000,
        mousewheelControl : true,
        navigation:{
          prevEl: '.swiper-button-prev',
          nextEl:'.swiper-button-next',
        },
        on: {
          //关键在这儿，通过点击事件拿到对应的元素，从而确定具体index
          tap:function (e) {
            console.log(e,e.target,'click');
            vm.handleClickedImg()
          }
        }
      },
      // notNextTick是一个组件自有属性，如果notNextTick设置为true，组件则不会通过NextTick来实例化swiper，也就意味着你可以在第一时间获取到swiper对象，假如你需要刚加载遍使用获取swiper对象来做什么事，那么这个属性一定要是true
      // notNextTick: true,
      // swiperOption: {
      //   autoplay: 3000,
      //   loop: true,
      //   // direction: 'vertical',
      //   // grabCursor: true,
      //   preventClicks : false,
      //   preventClicksPropagation : false,
      //   setWrapperSize: true,
      //   autoHeight: true,
      //   pagination: '.swiper-pagination',
      //
      //   // pagination:'.swiper-pagination',
      //   paginationClickable: true,
      //   prevButton: '.swiper-button-prev',
      //   nextButton: '.swiper-button-next',
      //   scrollbar: '.swiper-scrollbar',
      //   mousewheelControl: false,
      //   observeParents: true,
      //   speed: 1000,
      //
      //   navigation:{
      //     prevEl: '.swiper-button-prev',
      //     nextEl:'.swiper-button-next',
      //   },
      //   // if you need use plugins in the swiper, you can config in here like this
      //   // 如果自行设计了插件，那么插件的一些配置相关参数，也应该出现在这个对象中，如下debugger
      //   // debugger: true,
      //   // swiper callbacks
      //   // swiper的各种回调函数也可以出现在这个对象中，和swiper官方一样
      //   // onTransitionStart (swiper) {
      //   //   console.log(swiper)
      //   // }
      //   // more Swiper configs and callbacks...
      //   // ...
      // },
      //三张轮播，使用变量循环
      swiperList:[
        {
          id:'001',
          imgUrl:"http://img1.qunarzz.com/piao/fusion/1805/d4/d41d77b6ba8aca02.jpg_750x200_ac3d9a73.jpg",
          src:"www.baidu.com"
        },
        {
          id:'002',
          imgUrl:"http://img1.qunarzz.com/piao/fusion/1805/f1/e57bc93226317102.jpg_750x200_9ab37bd0.jpg",
          src:"www.weibo.com"
        },
        {
          id:'003',
          imgUrl:"http://img1.qunarzz.com/piao/fusion/1804/c4/1cdd28811593b802.jpg_750x200_5fbb7c91.jpg",
          src:"www.qq.com"
        }
      ]
    }
  },
  created() {
    vm = this;
  },
  mounted() {
    console.log('src/views/main/index.vue')
    this.mywindow.myfunction()
  },
  methods: {
    test(){
      // service()
    },
    handleClickedImg(){
      console.log("aaa")
    }
  }

}
</script>
<style lang='stylus' scoped>
// >>>穿透作用，因为swiper-pagination-bullet-active类在组件内部定义的，想要wrapper也能作用到，可以用>>>
.wrapper >>>.swiper-pagination-bullet-active
  background #fff !important
.wrapper
  overflow:hidden
  width 100%
  height:0
  padding-bottom:26.6666667%
  background :#ccc
  .swiper-item
    width:100%
    .swiper-img
      width:100%
</style>
