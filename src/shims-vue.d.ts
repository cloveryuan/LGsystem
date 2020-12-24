declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

import axios from 'axios'
declare module 'axios' {
  export interface AxiosResponse<T = any> extends Promise<T> {}
}

interface Window {
  AliyunUpload: any
}
