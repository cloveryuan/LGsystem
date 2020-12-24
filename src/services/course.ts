import request from '@/utils/request'

export const changeState = (courseId: number, staus: number) => {
  return request.get(`boss/course/changeState?courseId=${courseId}&staus=${staus}`)
}

export const uploadCourseImage = (data: any, onUploadProgress: (progressEvent: ProgressEvent) => void) => {
  // 该接口要求的请求数据类型是：multipart/form-data
  // 所以需要提交 FormData 数据对象
  return request.post('/boss/course/upload', data, {
    // HTML5 新增的上传响应事件：progress
    onUploadProgress
  })
}

export const saveOrUpdateCourse = (data: any) => {
  return request.post('boss/course/saveOrUpdateCourse', data)
}

export const getCourseById = (courseId: number | string) => {
  return request.get('boss/course/getCourseById', { courseId })
}

export const getSectionAndLesson = (courseId: string | number) => {
  return request.get('/boss/course/section/getSectionAndLesson', { courseId })
}

export const saveOrUpdateSection = (data: any) => {
  return request.post('/boss/course/section/saveOrUpdateSection', data)
}

export const getSectionById = (sectionId: string | number) => {
  return request.get('/boss/course/section/getBySectionId', { sectionId })
}

export const saveOrUpdateLesson = (data: any) => {
  return request.post('/boss/course/lesson/saveOrUpdate', data)
}
