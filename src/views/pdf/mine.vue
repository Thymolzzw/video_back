<template>
  <div class="btn" @click="downloadPdf">下载</div>
  <div ref="pdf">我是一个要变为图片或PDF的div</div>
</template>
<script>
import html2canvas from 'html2canvas'
import jspdf from 'jspdf'

export default {
  name: 'printDiv',
  data() {
    return {
      pdf: null
    }
  },
  methods: {
    downloadPdf() {
      let target = this.pdf
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
          let pageHeight = contentWidth / 592 * 841
          //未生成pdf的html页面高度
          let leftHeight = contentHeight
          //页面偏移
          // let offsetX = 100;
          // let offsetY = 100;
          let offsetX = 0
          let offsetY = 0
          //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
          let imgWidth = 592
          let imgHeight = 592 / contentWidth * contentHeight
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
          let name = '文件名.pdf' // 定义生成的pdf的文件名字
          pdf.save(name)
        })
    }
  },
  mounted() {
    this.pdf = this.$refs.pdf
  }
}
</script>
