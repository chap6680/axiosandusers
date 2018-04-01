import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'

import router from './router'
import store from './store'

axios.defaults.baseURL = 'https://maxmeetup-251d0.firebaseio.com/'

/* these are just more examples of configurations that you can use for axios.  Does not effect the current program 
axios.defaults.headers.common['Authorization']='asdf'
axios.defaults.headers.get['Accepts']='application/json'


axios.interceptors.request.use(config => { 
	console.log('request: ',config)
	return config
})

axios.interceptors.response.use(res => {
	console.log('response',res)
	return res
 } )
*/
axios.defaults.headers.get['Accepts'] = 'application/json'

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
