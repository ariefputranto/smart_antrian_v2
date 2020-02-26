<template>
    <div>
    	<!-- Content Header (Page header) -->
	    <breadcrumb :lists="[{url: '/', name: 'Home'}, {url: '/users', name: 'Users'}]"/>
	    <!-- /.content-header -->

	    <!-- Main content -->
	    <section class="content">
	      <div class="container">
	        <div class="row">
	        	<div class="col-lg-12">
	        		<div class="card">
	              <div class="card-header">
	                <h3 class="card-title">Users</h3>
	                <div class="card-tools">
	                  <ul class="nav nav-pills ml-auto">
	                    <li class="nav-item">
	                      <a class="nav-link" href="#" data-toggle="modal" data-target="#search-modal"><i class="fa fa-search"></i> Search</a>
	                    </li>
	                    <li class="nav-item">
	                      <a class="nav-link" href="#" data-toggle="modal" data-target="#add-modal" @click="setIsCreate(true)"><i class="fa fa-plus"></i> Add User</a>
	                    </li>
	                  </ul>
	                </div>
	              </div>
	              
	              <div class="card-body">
			        		<table class="table table-stripped table-bordered">
			        			<thead>
			        				<tr>
			        					<th>Name</th>
			        					<th>Username</th>
			        					<th>Email</th>
			        					<th>Roles</th>
			        					<th>Action</th>
			        				</tr>
			        			</thead>
			        			<tbody>
			        				<tr v-for="user in listUser">
			        					<td>{{ user.name }}</td>
			        					<td>{{ user.username }}</td>
			        					<td>{{ user.email }}</td>
			        					<td>{{ roles[user.roles] }}</td>
			        					<td>
			        						<button class="btn btn-sm btn-primary" title="Update User" data-toggle="modal" data-target="#add-modal" @click="modalUpdateUser(user)" style="margin-right: 5px"><i class="fa fa-check-square"></i></button>
			        						<button class="btn btn-sm btn-danger" title="Delete User" @click="deleteUser(user._id)"><i class="fa fa-trash"></i></button>
			        					</td>
			        				</tr>
			        			</tbody>
			        		</table>
	              </div>

	              <pagination @get_data="getPaginationData" :data="this.pagination.response" />
	            </div>
	        	</div>
	        </div>
	      </div>
	    </section>

	    <!-- Modal -->
	    <div class="modal fade" id="search-modal">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h4 class="modal-title">Search Users</h4>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <div class="row">
              	<div class="col-lg-12">
              		<div class="form-group">
              			<label>Username</label>
              			<input type="text" v-model="search.username" class="form-control" placeholder="Username">
              		</div>
              		<div class="form-group">
              			<label>Name</label>
              			<input type="text" v-model="search.name" class="form-control" placeholder="Name">
              		</div>
              		<div class="form-group">
              			<label>Email</label>
              			<input type="email" v-model="search.email" class="form-control" placeholder="Email">
              		</div>
              		<div class="form-group">
              			<label>Role</label>
              			<select class="form-control" v-model="search.role">
              				<option value="">All</option>
              				<option v-for="(role, index) in roles" :value="index">{{role}}</option>
              			</select>
              		</div>
              	</div>
              </div>
            </div>
            <div class="modal-footer justify-content-between">
              <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary" @click="searchUser"><i class="fa fa-search"></i> Search</button>
            </div>
          </div>
        </div>
      </div>
      <!-- End Modal -->

	    <!-- Modal -->
	    <div class="modal fade" id="add-modal">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h4 class="modal-title">
              	<span v-if="isCreate">Add User</span>
              	<span v-else>Update User</span>
	            </h4>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <div class="row">
              	<div class="col-lg-12">
              		<div class="form-group">
              			<label>Username</label>
              			<input type="text" v-model="input.username" class="form-control" placeholder="Username">
              		</div>
              		<div class="form-group">
              			<label>Name</label>
              			<input type="text" v-model="input.name" class="form-control" placeholder="Name">
              		</div>
              		<div class="form-group">
              			<label>Email</label>
              			<input type="email" v-model="input.email" class="form-control" placeholder="Email">
              		</div>
              		<div class="form-group">
              			<label>Role</label>
              			<select class="form-control" v-model="input.role">
              				<option v-for="(role, index) in roles" :value="index">{{role}}</option>
              			</select>
              		</div>
              		<div class="form-group">
              			<label>Password</label>
              			<input type="password" v-model="input.password" class="form-control" placeholder="Password">
              		</div>
              	</div>
              </div>
            </div>
            <div class="modal-footer justify-content-between">
              <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
              <button v-if="isCreate" type="button" class="btn btn-primary" @click="addUser"><i class="fa fa-plus"></i> Add User</button>
              <button v-else type="button" class="btn btn-primary" @click="updateUser"><i class="fa fa-plus"></i> Update User</button>
            </div>
          </div>
        </div>
      </div>
      <!-- End Modal -->
    </div>
</template>

<script>
	import Breadcrumb from '@/components/Breadcrumb.vue'
	import Pagination from '@/components/Pagination.vue'

	export default {
		name: "Home",
		components: {
			Breadcrumb,
			Pagination
		},
		data() {
			return {
				listUser: [],
				roles: [],
				isCreate: true,
				userId: '',
				input: {
					username: '',
					name: '',
					email: '',
					role: 0,
					password: ''
				},
				search: {
					username: '',
					name: '',
					email: '',
					role: ''
				},
				pagination: {
					response: null,
					page: 1,
					per_page: 10,
				}
			}
		},
		methods: {
			getListUser: function() {
				this.$http.get('api/administrator/user' + '?page='+this.pagination.page+'&perPage='+this.pagination.per_page+'&'+jQuery.param( this.search )).then((response) => {
					console.log(response.data)
          var data = response.data
          var status = data.statusCode
          if (status == 200) {
          	this.listUser = data.data.docs
          	this.pagination.response = data
          } else {
            swal('Warning', data.message, 'warning')
          }
        })
			},
			getListRoles: function() {
				this.$http.get('api/roles').then((response) => {
					console.log(response.data)
          var data = response.data
          var status = data.statusCode
          if (status == 200) {
          	this.roles = data.data
          } else {
            swal('Warning', data.message, 'warning')
          }
        })
			},
			addUser: function() {
				this.$http.post('api/administrator/user', this.input).then((response) => {
					console.log(response.data)
          var data = response.data
          var status = data.statusCode
          if (status == 200) {
            $('#add-modal').modal("hide")
            swal('Success', data.message, 'success')
            this.getListUser()
          } else {
            swal('Warning', data.message, 'warning')
          }
        })
			},
			updateUser: function() {
				this.$http.put('api/administrator/user/'+this.userId, this.input).then((response) => {
					console.log(response.data)
          var data = response.data
          var status = data.statusCode
          if (status == 200) {
            $('#add-modal').modal("hide")
            swal('Success', data.message, 'success')
            this.getListUser()
          } else {
            swal('Warning', data.message, 'warning')
          }
        })
			},
			deleteUser: function(userId) {
				this.userId = userId
				swal({
					title: "Warning!",
					text: "Do you want to delete this user?",
					icon: "warning",
					buttons: true,
					dangerMode: true
				}).then((willDelete) => {
					if (willDelete) {
						this.$http.delete('api/administrator/user/'+this.userId).then((response) => {
							console.log(response.data)
		          var data = response.data
		          var status = data.statusCode
		          if (status == 200) {
		            $('#add-modal').modal("hide")
		            swal('Success', data.message, 'success')
		            this.getListUser()
		          } else {
		            swal('Warning', data.message, 'warning')
		          }
		        })
					}
				})
			},
			searchUser: function() {
				$('#search-modal').modal("hide")
				this.getListUser()
			},
			clearField: function() {
				this.input.username = ''
				this.input.name = ''
				this.input.email = ''
				this.input.role = 0
				this.input.password = ''
			},
			setIsCreate: function(isCreate) {
				if (isCreate) {
					this.isCreate = true
					this.clearField()
				} else {
					this.isCreate = false
					this.clearField()
				}
			},
			modalUpdateUser: function(user) {
				this.setIsCreate(false)
				this.userId = user._id
				this.input.username = user.username
				this.input.name = user.name
				this.input.email = user.email
				this.input.role = user.roles
			},
			getPaginationData: function(data) {
				this.pagination.page = data.page
				this.pagination.perPage = data.perPage
				this.getListUser()
			}
		},
		mounted() {
			this.getListUser()
			this.getListRoles()
		}
	};
</script>
