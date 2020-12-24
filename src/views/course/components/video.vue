<template>
  <el-card>
    <el-form ref="lesson-form" :model="course" label-width="100px">
      <el-form-item label="课程名称">
        <el-input
          :value="course.courseName"
          autocomplete="off"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="课时" prop="sectionName">
        <el-input v-model="course.theme" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="视频上传">
         <input type="file" ref="video-file" @change="fileChange($event,'video')">
         <el-progress v-if="isUpload" :percentage="videoProgress"></el-progress>
      </el-form-item>
      <el-form-item label="封面上传">
        <input type="file" ref="image-file" @change="fileChange($event,'image')">
        <el-progress v-if="isUpload" :percentage="imageProgress"></el-progress>
      </el-form-item>
      <div style="display:flex;align-items:top;" v-if="isUpload">
        <span style="display:inline-block;width:100px;text-align:right;margin-right:12px;">视频信息</span>
        <ul>
          <li style="display:flex;align-items:center;">
            <h5 style="margin-right:10px;">视频名称:</h5>
            <span>{{videoName}};</span>
          </li>
          <li style="display:flex;align-items:center;">
            <h5  style="margin-right:10px;">阿里云上传进度:</h5>
            <span>{{videoProgress}}%;</span>
          </li>
          <li style="display:flex;align-items:center;" v-if="isTocode">
            <h5 style="margin-right:10px;">阿里云转码状态:</h5>
            <span v-if="!isSuccessToCode" style="color:#f40;">请勿刷新此页面，正在转码，请稍等...;</span>
            <span v-else>转码成功</span>
          </li>
        </ul>
      </div>
      <p style="float:right;">
        <el-button @click="handleUpload"  v-if="!isUpload">开始上传</el-button>
        <el-button @click="handleCancleUpload" v-if="isUpload&&!isTocode">取消上传</el-button>
        <el-button type="primary" @click="$router.back()">返回</el-button>
      </p>
    </el-form>
  </el-card>

</template>

<script>
import Vue from 'vue'
import { getCourseById } from '@/services/course'
import {
  aliyunImagUploadAddressAdnAuth,
  aliyunVideoUploadAddressAdnAuth,
  aliyunTransCode,
  aliyunTransCodePercent,
  refreshAliyunVideoUploadAddressAdnAuth
} from '@/services/aliyun-upload'

export default Vue.extend({
  name: 'course_video',
  props: {
    courseId: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      course: {},
      // 上传配置
      timeout: '',
      partSize: '',
      parallel: '',
      retryCount: '',
      retryDuration: '',
      region: 'cn-shanghai',
      userId: '1618439964448548',
      uploader: null,
      // 配置结束
      videoProgress: 0,
      imageProgress: 0,
      imageURL: null,
      videoId: null,
      isUpload: false, // 正在上传
      videoName: '',
      imageName: '',
      isTocode: false, // 正在转码
      isSuccessToCode: false, // 转码成功
      timer: null
    }
  },
  created () {
    this.initUploader()
  },
  computed: {
    video () {
      return this.$refs['video-file']
    },
    image () {
      return this.$refs['image-file']
    }
  },
  mounted () {
    this.loadCourse()
  },
  methods: {
    async loadCourse () {
      const { data } = await getCourseById(this.courseId)
      this.course = data
    },
    initUploader () {
      this.uploader = new window.AliyunUpload.Vod({
        timeout: this.timeout || 60000,
        partSize: this.partSize || 1048576, // 分片大小默认1 MB，不能小于100 KB
        parallel: this.parallel || 5, // 并行上传分片个数，默认5
        retryCount: this.retryCount || 3, // 网络原因失败时，重新上传次数，默认为3
        retryDuration: this.retryDuration || 2, // 网络原因失败时，重新上传间隔时间，默认为2秒
        region: this.region,
        userId: this.userId, // 阿里账号ID，必须有值
        // 添加文件成功
        addFileSuccess: function () {
          console.log('addFileSuccess')
        },
        // 开始上传
        onUploadstarted: async (uploadInfo) => {
          // 如果是 UploadAuth 上传方式, 需要根据 uploadInfo.videoId是否有值，调用点播的不同接口获取uploadauth和uploadAddress
          // 如果是 UploadAuth 上传方式, 需要调用 uploader.setUploadAuthAndAddress 方法设置上传凭证

          // 如果 uploadInfo.videoId 存在，根据videoId调用刷新视频上传凭证接口刷新上传凭证，否则调用创建视频上传凭证接口(https://help.aliyun.com/document_detail/55408.html)
          // 如果 uploadInfo.videoId 不存在,调用 获取视频上传地址和凭证接口(https://help.aliyun.com/document_detail/55407.html)
          const isImage = uploadInfo.isImage
          let dataInfo = null
          if (isImage) {
            if (!uploadInfo.imageId) {
              dataInfo = await aliyunImagUploadAddressAdnAuth()
              this.imageURL = dataInfo.data.imageURL// 先上传图片才有这个值，后面上传视频后端需要这个值
            } else {
              // 如果imageId有值，根据imageId刷新上传凭证
              // https://help.aliyun.com/document_detail/55408.html?spm=a2c4g.11186623.6.630.BoYYcY
              console.log('onUploadstarted', uploadInfo)
            }
          } else {
            if (!uploadInfo.videoId) {
              dataInfo = await aliyunVideoUploadAddressAdnAuth(uploadInfo.file.name, this.imageURL)
              this.videoId = dataInfo.data.videoId
            } else {
              // 如果videoId有值，根据videoId刷新上传凭证
              // https://help.aliyun.com/document_detail/55408.html?spm=a2c4g.11186623.6.630.BoYYcY
              dataInfo = await refreshAliyunVideoUploadAddressAdnAuth(uploadInfo.videoId)
              this.videoId = uploadInfo.videoId
            }
          }
          if (!dataInfo) return
          if (dataInfo.code === '000000') {
            const data = dataInfo.data
            const id = data.imageId || data.videoId
            this.uploader.setUploadAuthAndAddress(
              uploadInfo,
              data.uploadAuth,
              data.uploadAddress,
              id
            )
          } else {
            this.$message.error(dataInfo.data)
          }
        },
        // 文件上传成功
        onUploadSucceed: function (uploadInfo) {
          console.log(
            'onUploadSucceed: ' +
              uploadInfo.file.name +
              ', endpoint:' +
              uploadInfo.endpoint +
              ', bucket:' +
              uploadInfo.bucket +
              ', object:' +
              uploadInfo.object
          )
        },
        // 文件上传失败
        onUploadFailed: function (uploadInfo, code, message) {
          console.log(
            'onUploadFailed: file:' +
              uploadInfo.file.name +
              ',code:' +
              code +
              ', message:' +
              message
          )
        },
        // 取消文件上传
        onUploadCanceled: function (uploadInfo, code, message) {
          console.log(
            'Canceled file: ' +
              uploadInfo.file.name +
              ', code: ' +
              code +
              ', message:' +
              message
          )
        },
        // 文件上传进度，单位：字节, 可以在这个函数中拿到上传进度并显示在页面上
        onUploadProgress: (uploadInfo, totalSize, progress) => {
          console.log(
            'onUploadProgress:file:' +
              uploadInfo.file.name +
              ', fileSize:' +
              totalSize +
              ', percent:' +
              Math.ceil(progress * 100) +
              '%'
          )
          if (!uploadInfo.isImage) {
            this.videoProgress = Math.ceil(progress * 100)
          }
          if (uploadInfo.isImage) {
            this.imageProgress = Math.ceil(progress * 100)
          }
        },
        // 上传凭证超时
        onUploadTokenExpired: function (uploadInfo) {
          // 上传大文件超时, 如果是上传方式一即根据 UploadAuth 上传时
          // 需要根据 uploadInfo.videoId 调用刷新视频上传凭证接口(https://help.aliyun.com/document_detail/55408.html)重新获取 UploadAuth
          // 然后调用 resumeUploadWithAuth 方法, 这里是测试接口, 所以我直接获取了 UploadAuth
          console.log('onUploadTokenExpired: ', uploadInfo)
        },
        // 全部文件上传结束
        onUploadEnd: async () => { // 转码
          await aliyunTransCode({
            lessonId: this.$route.query.lessonId,
            coverImageUrl: this.imageURL,
            fileName: this.video.files[0].name,
            fileId: this.videoId
          })
          this.isTocode = true
          this.timer = setInterval(async () => { // 查看转码进度
            const { data } = await aliyunTransCodePercent(this.$route.query.lessonId)
            if (data === 100) {
              this.isUpload = false
              this.isSuccessToCode = true
              clearInterval(this.timer)
            }
          }, 3000)
        }
      })
    },
    fileChange (e, type) {
      const file = e.target.files[0]
      if (!file) {
        alert('请先选择需要上传的文件!')
        return
      }
      const fileType = file.type.split('/')[0]
      if ((type === 'image' && fileType !== type) || (type === 'video' && fileType === 'image')) {
        this.$message.error('请上传相对应的格式文件')
        return false
      }
      if (this.uploader) {
        this.uploader.stopUpload()
        this.videoProgress = 0
        this.imageProgress = 0
      }
    },
    handleUpload () {
      this.handleCancleUpload()
      const imageFile = this.image.files[0]
      const videoFile = this.video.files[0]
      if (imageFile && videoFile) {
        // 添加上传文件 先上传图片
        this.uploader.addFile(imageFile, null, null, null)
        this.uploader.addFile(videoFile, null, null, null)
        this.isUpload = true
        // 开始上传
        this.uploader.startUpload()
        this.videoName = videoFile.name
      } else {
        this.$message.error('请上传视频和封面')
      }
    },
    handleCancleUpload () {
      this.uploader.stopUpload()
      this.videoProgress = 0
      this.imageProgress = 0
      this.isUpload = false
      this.isSuccessToCode = false
      this.isTocode = false
    }
  },
  destroyed () {
    clearInterval(this.timer)
  }
})
</script>

<style scoped>
ul,li,h5{
  padding:0;
  margin:0;
}
ul li{
  margin-bottom:10px;
}
</style>
