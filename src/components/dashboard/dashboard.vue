<template>
  <div id="dashboard">
    <h1>That's the dashboard!</h1>
    <p>You should only get here if you're authenticated!</p>
	<p>Your email address is {{email}}</p>
  </div>
</template>

<script>
	import axios from 'axios';

	export default {
	computed: {
		email() {
		   return !this.$store.getters.user ? false : this.$store.getters.user.email		
		}
	},
	created() {
		/* MOVED TO VUEX STORE 
		 axios.get('/users.json')
	  	.then(res => {
			console.log(res)
			const data = res.data
			const users = []
			for (let key in data){
				const user = data[key]
				user.id = key
				users.push(user)
		 	}	 
			console.log(users)
			this.email = users[0].email
		}) */
		this.$store.dispatch('fetchUser')
	}
}	
</script>


<style scoped>
  h1, p {
    text-align: center;
  }

  p {
    color: red;
  }
</style>