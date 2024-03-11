import { defineStore } from 'pinia'
import { setCookieItem, getCookieItem, removeCookieItem } from '~/utils/storage'

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      token: getCookieItem('token'),
      userInfo: getCookieItem('userInfo')
    }
  },
  actions: {
    setToken({ token }) {
      this.token = token

      setCookieItem('token', token)
    },
    setUserInfo({ userInfo }) {
      this.userInfo = userInfo

      setCookieItem('userInfo', userInfo)
    },
    logout() {
      return new Promise((resolve) => {
        this.token = ''

        this.userInfo = null

        removeCookieItem('token')

        removeCookieItem('userInfo')
        resolve()
      })
    },
    resetToken() {
      return new Promise((resolve) => {
        this.token = ''

        this.userInfo = null

        removeCookieItem('token')

        removeCookieItem('userInfo')

        resolve()
      })
    }
  }
})
