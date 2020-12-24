
import { StoreOptions } from 'vuex'

interface RootState {
  user: object | null
}
const user: StoreOptions<RootState> = {
  state: {
    user: JSON.parse(window.localStorage.getItem('user') || 'null') // 当前登录用户状态
  },
  mutations: {
    SET_USER: (state: {user: object | null}, user: string) => {
      state.user = JSON.parse(user)
      window.localStorage.setItem('user', user)
    }
  },
  actions: {
  }
}
export default user
