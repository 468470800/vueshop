import Vue from 'vue'
import App from './App.vue'
import router from '@/router/index.js'

//Element组件库
import './plugins/element.js' 
// 导入全局样式表
import './assets/css/global.css'
//导入注册tree-grid 三方插件
import TreeTable from 'vue-table-with-tree-grid'

// 导入字体库
import './assets/fonts/iconfont.css'
import axios from 'axios'
//导入富文本编辑器    
import VueQuillEditor from 'vue-quill-editor'
//导入富文本
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 导入 NProgress 包对应的JS和CSS
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
// https://www.liulongbin.top:8888/api/private/v1/ http://127.0.0.1:8888/api/private/v1/
axios.defaults.baseURL= 'https://www.liulongbin.top:8888/api/private/v1/'
// request 请求拦截器中 展示进度条 NProgress.start()
axios.interceptors.request.use(config => {
  // console.log(config)
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config//在最后必须return config
})
//将富文本编辑器注册为全局可用组价
Vue.use(VueQuillEditor) 
//在 response 响应拦截器中隐藏进度条 NProgress.done()
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})
Vue.prototype.$http = axios;
// 配置请求根路径
Vue.config.productionTip = false
//注册为全局组件
Vue.component('tree-table',TreeTable)
//全局过滤器 时间戳
Vue.filter('dataFormat',function(originVal){
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2,'0')
  const d = (dt.getDate()+ '').padStart(2,'0')
  const hh = (dt.getHours()+'').padStart(2,'0')
  const mm = (dt.getMinutes() + '').padStart(2,'0')
  const ss = (dt.getMinutes() + '').padStart(2,'0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
new Vue({ 
  router,
  render: h => h(App)
}).$mount('#app')