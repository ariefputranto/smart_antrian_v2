<template>
  <div class="wrapper">
    <!-- Login Box -->
    <div class="login-box" v-if="!isLogin">
      <div class="login-logo">
        <a href="#"><b>Smart</b> Queue</a>
      </div>
      <!-- /.login-logo -->
      <div class="card">
        <div class="card-body login-card-body">
          <p class="login-box-msg">Sign in to start your session</p>

          <div class="input-group mb-3">
            <input type="text" class="form-control" v-model="input.username" placeholder="Username">
            <div class="input-group-append">
              <div class="input-group-text">
                <span class="fas fa-user"></span>
              </div>
            </div>
          </div>
          <div class="input-group mb-3">
            <input type="password" class="form-control" v-model="input.password" placeholder="Password">
            <div class="input-group-append">
              <div class="input-group-text">
                <span class="fas fa-lock"></span>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-8">
              <div class="icheck-primary">
                <input type="checkbox" id="remember">
                <label for="remember">
                  Remember Me
                </label>
              </div>
            </div>
            <!-- /.col -->
            <div class="col-4">
              <button type="button" @click="login" class="btn btn-primary btn-block">Sign In</button>
            </div>
            <!-- /.col -->
          </div>

        </div>
        <!-- /.login-card-body -->
      </div>
    </div>

    <section v-else>
      <!-- Navbar -->
      <header-main @click_logout="logout"/>
      <!-- /.navbar -->

      <!-- Main Sidebar Container -->
      <aside class="main-sidebar sidebar-dark-primary elevation-4">
        <!-- Brand Logo -->
        <router-link to="/" class="brand-link">
            <img src="public/img/AdminLTELogo.png" alt="AdminLTE Logo" class="brand-image img-circle elevation-3"
               style="opacity: .8">
            <span class="brand-text font-weight-light">Smart Queue</span>
        </router-link>

        <!-- Sidebar -->
        <div class="sidebar">
          <!-- Sidebar user panel (optional) -->
          <div class="user-panel mt-3 pb-3 mb-3 d-flex">
            <div class="image">
              <img src="public/img/user.png" class="img-circle elevation-2" alt="User Image">
            </div>
            <div class="info">
              <a href="#" class="d-block">{{ data.name }}</a>
            </div>
          </div>

          <!-- Sidebar Menu -->
          <nav class="mt-2">
            <side-menu />
          </nav>
          <!-- /.sidebar-menu -->
        </div>
        <!-- /.sidebar -->
      </aside>

      <!-- Content Wrapper. Contains page content -->
      <div class="content-wrapper">
        <transition name="fade">
          <router-view></router-view>
        </transition>
      </div>
      <!-- /.content-wrapper -->

      <footer-main />

      <!-- Control Sidebar -->
      <aside class="control-sidebar control-sidebar-dark">
      <!-- Control sidebar content goes here -->
      </aside>
      <!-- /.control-sidebar -->
    </section>
  </div>
  <!-- ./wrapper -->
</template>

<script>
  import SideMenu from '@/views/layout/SideMenu.vue'
  import HeaderMain from '@/views/layout/HeaderMain.vue'
  import FooterMain from '@/views/layout/FooterMain.vue'

  export default{
    data: {
      isLogin: false,
      input: {
        username: '',
        password: ''
      },
      data: {
        name: ''
      }
    },
    methods: {
      login: function() {
        this.$http.post('api/login', this.input).then((response) => {
          var data = response.data
          var status = data.statusCode
          if (status == 200) {
            swal({
              title: "Success",
              text: data.message,
              type: "success",
              icon: "success"
            }).then((isConfirm) => {
              localStorage.token = data.data.token
              localStorage.name = data.data.name
              localStorage.role = data.data.roles
              localStorage.time = data.data.time
              localStorage.service_provider = data.data.service_provider
              this.data.name = data.data.name
              this.isLogin = true
            })
          } else {
            swal('Warning', data.message, 'warning')
            this.isLogin = false
          }
        })
      },
      logout: function() {
        this.isLogin = false
        localStorage.clear()
      }
    },
    mounted() {
      // add header on request
      this.$http.interceptors.request.use((config) => {
        var listExcludeUrl = ['api/login', '/api/roles']

        if (listExcludeUrl.indexOf(config.url) === -1) {
          config.headers = {
            'Authorization': 'Bearer ' + localStorage.token,
            'Accept': 'application/json'
          }
        }

        return config
      }, (error) => {
        // Do something with request error
        return Promise.reject(error)
      })

      // check if token expired
      this.$http.interceptors.response.use((response) => {
        if (response.data.message == "Authorization token expired") {
          this.logout()
          return false
        }

        if (response.data.message == "You are not allowed!") {
          this.$router.push('/')
          return false
        }

        return response
      }, (error) => {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        return Promise.reject(error)
      })

      if (localStorage.token) {
        this.isLogin = true
      }

      if (localStorage.name) {
        this.data.name = localStorage.name
      }
    },
    components: {
      SideMenu,
      HeaderMain,
      FooterMain
    }
  }
</script>