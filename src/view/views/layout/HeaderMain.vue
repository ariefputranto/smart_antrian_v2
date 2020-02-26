<template>
	<nav class="main-header navbar navbar-expand navbar-white navbar-light">
	    <!-- Left navbar links -->
	    <ul class="navbar-nav">
	      <li class="nav-item">
	        <a class="nav-link" data-widget="pushmenu" href="#"><i class="fas fa-bars"></i></a>
	      </li>
	    </ul>

	    <!-- Right navbar links -->
	    <ul class="navbar-nav ml-auto">
	      <!-- User info menu -->
	      <li class="nav-item dropdown user-menu">
	        <a href="#" class="nav-link dropdown-toggle" data-toggle="dropdown">
	          <img src="public/img/user.png" class="user-image img-circle elevation-2" alt="User Image">
	          <span class="d-none d-md-inline">{{ name }}</span>
	        </a>
	        <ul class="dropdown-menu dropdown-menu-lg dropdown-menu-right">
	          <!-- User image -->
	          <li class="user-header bg-primary">
	            <img src="public/img/user.png" class="img-circle elevation-2" alt="User Image">

	            <p>
	              {{ name }} - {{ role }}
	              <small>Member since {{ dateFormat(time) }}</small>
	            </p>
	          </li>
	          <!-- Menu Footer-->
	          <li class="user-footer">
	            <!-- <a href="#" class="btn btn-default btn-flat">Profile</a> -->
	            <a href="#" @click="logout" class="btn btn-default btn-flat float-right">Sign out</a>
	          </li>
	        </ul>
	      </li>
	    </ul>
	</nav>
</template>

<script>
	import moment from 'moment-timezone'

	export default{
		name: "HeaderMain",
		data() {
			return {
				name: '',
				role: '',
				time: ''
			}
		},
		methods: {
			logout: function() {
				this.$emit('click_logout')
			},
			dateFormat: function(date) {
				return moment(date).format("MMM. YYYY")
			}
		},
		mounted() {
			if (localStorage.name) {
				this.name = localStorage.name
			}

			if (localStorage.role) {
				this.role = localStorage.role
			}

			if (localStorage.time) {
				this.time = localStorage.time
			}
		}
	}
</script>