<template>
	<ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
    <section v-if="role == 'Administrator'">
      <li class="nav-item">
        <router-link to="/users" class="nav-link" v-bind:class="{'active': $route.path === '/users'}">
          <i class="nav-icon fas fa-users"></i>
          <p> Users </p>
        </router-link>
      </li>
      <li class="nav-item">
        <router-link to="/service-provider" class="nav-link" v-bind:class="{'active': $route.path === '/service-provider'}">
          <i class="nav-icon fas fa-cubes"></i>
          <p> Service Provider </p>
        </router-link>
      </li>
    </section>
    <section v-if="role == 'Admin Web'">
      <li class="nav-item">
        <router-link to="/user-admin" class="nav-link" v-bind:class="{'active': $route.path === '/users-admin'}">
          <i class="nav-icon fas fa-users"></i>
          <p> Users </p>
        </router-link>
      </li>
      <li class="nav-item">
        <router-link to="/services" class="nav-link" v-bind:class="{'active': $route.path === '/services'}">
          <i class="nav-icon fas fa-cube"></i>
          <p> Services </p>
        </router-link>
      </li>
      <li class="nav-item">
        <router-link to="/loket" class="nav-link" v-bind:class="{'active': $route.path === '/loket'}">
          <i class="nav-icon fas fa-door-open"></i>
          <p> Loket </p>
        </router-link>
      </li>
    </section>
    <section v-if="role == 'User'">
      <li class="nav-item">
        <router-link to="/user-admin" class="nav-link" v-bind:class="{'active': $route.path === '/users-admin'}">
          <i class="nav-icon fas fa-users"></i>
          <p> Loket </p>
        </router-link>
      </li>
      <li class="nav-item">
        <router-link to="/services" class="nav-link" v-bind:class="{'active': $route.path === '/services'}">
          <i class="nav-icon fas fa-cube"></i>
          <p> Monitor </p>
        </router-link>
      </li>
      <li class="nav-item">
        <router-link to="/loket" class="nav-link" v-bind:class="{'active': $route.path === '/loket'}">
          <i class="nav-icon fas fa-door-open"></i>
          <p> Queue </p>
        </router-link>
      </li>
    </section>
  </ul>
</template>

<script>
	export default{
		name: 'SideMenu',
    data: function() {
      return {
        role: ''
      }
    },
    mounted() {
      if (localStorage.role) {
        this.role = localStorage.role
      }
    }
	}
</script>