import Vue from 'vue'
import Vuex from 'vuex'
import axios from './axios-auth'
import globalAxios from 'axios'
import router from './router'

Vue.use(Vuex)


export default new Vuex.Store({
  state: {
		idToken: null,
	  userId: null,
		user:null
  },
  mutations: {
	  authUser(state, userData) {
		  state.idToken = userData.idToken
		  state.userId = userData.userId
	  },
		storeUser(state, user) { 
			state.user = user
	  },
	  clearAuthData(state) { 
		  state.idToken = null
		  state.userId = null
	  }
  },
	actions: {
		//this action will clear the user's session after a set period
		setLogoutTimer({commit, dispatch}, expirationTime) { 
			setTimeout(() => {
				dispatch('logout')
			}, expirationTime * 1000)
		},
	  	signup({ commit, dispatch }, authData) {
		  	axios.post('/signupNewUser?key=AIzaSyA8ouwUf-dzpJ3rbYd4oZ5V_o4ZwkaCRWE', {
			email: authData.email,
			password: authData.password,
			returnSecureToken: true
		  })
			  .then(res => {
				  console.log(res)
				  commit('authUser', {
					  idToken: res.data.idToken,
					  userId: res.data.localId
				  })
				  //storing session credentials to local for a period of time
				  const now = new Date()
				  //convert to milliseconds
				  const expirationDate = new Date(now.getTime() + res.data.expiresIn * 1000)
				  localStorage.setItem('token', res.data.idToken)
				  localStorage.setItem('expiresIn', expirationDate)
				  dispatch('storeUser', authData)
				  //logout after period of time
				  dispatch('setLogoutTimer', res.data.expiresIn)  

	  			})
			.catch(error => console.log(error))
	  },
	  storeUser({ commit, state }, userData) { 
		  if (!state.idToken) { 
			  return
		  }
		//adding this +?auth+idToken is a firebase thing  
		  globalAxios.post('/users.json'+'?auth='+state.idToken, userData)
			  .then(res => console.log(res))
		  .catch(error => cconsole.log(error))
	  },
	  fetchUser ({commit, state}) {
		if (!state.idToken) {
		  return
		}
		globalAxios.get('/users.json' + '?auth=' + state.idToken)
		  .then(res => {
			console.log(res)
			const data = res.data
			const users = []
			for (let key in data) {
			  const user = data[key]
			  user.id = key
			  users.push(user)
			}
			console.log(users)
			commit('storeUser', users[0])
		  })
		  .catch(error => console.log(error))
	  }, 
	  login({commit, dispatch}, authData) { 
		axios.post('/verifyPassword?key=AIzaSyA8ouwUf-dzpJ3rbYd4oZ5V_o4ZwkaCRWE', {
			email: authData.email,
			password: authData.password,
			returnSecureToken: true
		  })
		  .then(res => {
				//storing session credentials to local for a period of time
				const now = new Date()
			  const expirationDate = new Date(now.getTime() + res.data.expiresIn * 1000)
				localStorage.setItem('token', res.data.idToken)
			  localStorage.setItem('expirationDate', expirationDate)

			  //couldnt see it in the application section of the chrome dev tools - could see it in firefox
			  console.log('after', localStorage.getItem("token")) 
			 console.log('afterDate', localStorage.getItem("expirationDate")) 
			   
			commit('authUser', {
				idToken: res.data.idToken,
				userId: res.data.localId
			})
			//logout after a set period  
			dispatch('setLogoutTimer', res.data.expiresIn)  
			})
	  			.catch(error => console.log(error))
		},
		tryAutoLogin ({commit}) {
			const token = localStorage.getItem('token')
			if (!token) {
			  return
			}
			const expirationDate = localStorage.getItem('expirationDate')
			const now = new Date()
			if (now >= expirationDate) {
			  return
			}
			const userId = localStorage.getItem('userId')
			commit('authUser', {
			  token: token,
			  userId: userId
			})
		  },
	  logout({ commit }) { 
			commit('clearAuthData')
		  localStorage.removeItem('expirationDate')
		  localStorage.removeItem('token') 
		  localStorage.removeItem('userId')
		//if you are on any page and logout, this pushes you back to the signin screen
		  	router.replace('/signin')
	  }
  	},
	  getters: {
		user (state) {
		  return state.user
		  },
		  //added this for the header - so if user is not logged in will show
		  //different stuff...on header used computed 
		  isAuthenticated(state) { 
			  return state.idToken !== null
		  }  
	  }
})