import request from '@/utils/request'

// 获取阿里云图片上传凭证
export const aliyunImagUploadAddressAdnAuth = () => {
  return request.get('/boss/course/upload/aliyunImagUploadAddressAdnAuth.json')
}

// 获取阿里云视频上传凭证
export const aliyunVideoUploadAddressAdnAuth = (fileName: string, imageUrl: string) => {
  return request.get('/boss/course/upload/aliyunVideoUploadAddressAdnAuth.json', {
    fileName, imageUrl
  })
}

// 阿里云转码请求
export const aliyunTransCode = (courseMediaDTO: object) => {
  return request.post('/boss/course/upload/aliyunTransCode.json', courseMediaDTO)
}

// 阿里云转码进度
export const aliyunTransCodePercent = (lessonId: string) => {
  return request.get(`/boss/course/upload/aliyunTransCodePercent.json?lessonId=${lessonId}`)
}

// 刷新阿里云视频上传凭证
export const refreshAliyunVideoUploadAddressAdnAuth = (videoId: number) => {
  return request.get(`/boss/course/upload/refreshAliyunVideoUploadAddressAdnAuth.json?videoId=${videoId}`)
}
