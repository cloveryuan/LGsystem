<template>
  <div class="course-image">
    <!--
      upload 上传文件组件，它支持自动上传，你只需要把上传需要参数配置一下就可以了
      -->
    <!--
      1. 组件需要根据绑定的数据进行图片预览
      2. 组件需要把上传成功的图片地址同步到绑定的数据中
      v-model 的本质还是父子组件通信
        1. 它会给子组件传递一个名字叫 value 的数据（Props）
        2. 默认监听 input 事件，修改绑定的数据（自定义事件）
      -->
    <el-progress
      v-if="isUploading"
      type="circle"
      :percentage="percentage"
      :width="178"
      :status="percentage === 100 ? 'success' : undefined"
    />
    <el-upload
      v-else
      class="avatar-uploader"
      action="https://jsonplaceholder.typicode.com/posts/"
      :show-file-list="false"
      :before-upload="beforeAvatarUpload"
      :http-request="handleUpload"
    >
      <img v-if="value" :src="value" class="avatar" />
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { uploadCourseImage } from '@/services/course'

export default Vue.extend({
  name: 'CourseImage',
  props: {
    value: {
      type: String
    },
    limit: {
      type: Number,
      default: 2
    }
  },
  data () {
    return {
      isUploading: false,
      percentage: 0
    }
  },
  methods: {
    beforeAvatarUpload (file: any) {
      const isJPG = file.type === 'image/jpeg'
      const isPng = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < this.limit

      if (!isJPG && !isPng) {
        this.$message.error('上传头像图片只能是 JPG 或 PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error(`上传头像图片大小不能超过 ${this.limit}MB!`)
      }
      return (isJPG || isPng) && isLt2M
    },

    async handleUpload (options: any) {
      try {
        this.isUploading = true
        const fd = new FormData()
        fd.append('file', options.file)
        const { code, data } = await uploadCourseImage(fd, e => {
          this.percentage = Math.floor(e.loaded / e.total * 100)
        })
        if (code === '000000') {
          this.isUploading = false
          this.percentage = 0
          this.$emit('input', data.name)
        } else {
          this.$message.error('上传失败')
        }
      } catch (err) {
        console.log(err)
      }
      this.isUploading = false
      this.percentage = 0
    }
  }
})
</script>

<style scoped>
::v-deep .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

::v-deep .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
