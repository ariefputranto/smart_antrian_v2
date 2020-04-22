<template>
    <div>
    	<!-- Content Header (Page header) -->
	    <breadcrumb :lists="[{url: '/', name: 'Home'}, {url: '/loket-user', name: 'Loket'}]"/>
	    <!-- /.content-header -->

	    <!-- Main content -->
	    <section class="content">
	      <div class="container">
	      	<!-- If not assigned -->
	        <div class="row" v-if="!isAssigned">
	        	<div class="col-lg-4" v-for="loket in listLoket">
	        		<div class="card">
	              <div class="card-header">
	                <h3 class="card-title"><i class="fas fa-user"></i> {{ loket.name }}</h3>
	              </div>
	              
	              <div class="card-body">
			        		<table class="table table-striped">
			        			<tbody>
			        				<tr>
			        					<td>Service</td>
			        					<td>:</td>
			        					<td>{{ loket.service_id !== null ? loket.service_id.name : '-' }}</td>
			        				</tr>
			        				<tr>
			        					<td>Code</td>
			        					<td>:</td>
			        					<td>{{ loket.service_id !== null ? loket.service_id.code : '-' }}</td>
			        				</tr>
			        				<tr>
			        					<td>Assign User</td>
			        					<td>:</td>
			        					<td>{{ loket.assign_user_id !== null ? loket.assign_user_id.name : '-' }}</td>
			        				</tr>
			        			</tbody>
			        		</table>
	              </div>

	              <div class="card-footer clearfix">
	              	<button v-if="loket.assign_user_id == null" type="button" class="btn btn-info float-right" @click="assignUser(loket)"><i class="fas fa-door-open"></i> Use</button>
	              </div>
	            </div>
	        	</div>
	        </div>

	        <!-- If assigned -->
	        <div class="row" v-else>
	        	<div class="col-lg-6 offset-lg-3">
	        		<div class="card">
	              <div class="card-header">
	                <h3 class="card-title"><i class="fas fa-user"></i> {{ singleLoket.name }}</h3>
	                <div class="card-tools">
	                  <ul class="nav nav-pills ml-auto">
	                    <li class="nav-item">
	                      <a class="nav-link" href="#" @click="unAssignUser()"><i class="fas fa-reply"></i> Back</a>
	                    </li>
	                  </ul>
	                </div>
	              </div>
	              
	              <div class="card-body">
			        		<div class="row">
			        			<div class="col-lg-12 text-center">
			        				<h1 style="font-weight: 400;font-size: 70px"> {{ lastCalledNumber }}</h1>
			        				<p>{{ countUnCalledQueue }} more remaining</p>
			        			</div>
			        		</div>
	              </div>

	              <div class="card-footer clearfix">
	              	<button type="button" @click="callUser" class="btn btn-info btn-lg"><i class="fas fa-volume-up"></i></button>
	              	<button type="button" @click="callNextUser" class="btn btn-success btn-lg float-right"><i class="fas fa-arrow-right"></i></button>
	              </div>
	            </div>
	        	</div>
	        </div>
	      </div>
	    </section>
    </div>
</template>

<script>
	import Breadcrumb from '@/components/Breadcrumb.vue'

	export default {
		name: "Home",
		components: {
			Breadcrumb,
		},
		data() {
			return {
				isAssigned: false,
				lastCalledNumber: '',
				countUnCalledQueue: 0,
				listLoket: [],
				singleLoket: {},
				currentUser: {},
				ws: null
			}
		},
		methods: {
			getListLoket: function() {
				this.$http.get('api/user/loket').then((response) => {
          var data = response.data
          var status = data.statusCode
          if (status == 200) {
          	this.listLoket = data.data
          } else {
            swal('Warning', data.message, 'warning')
          }
        })
			},
			checkIsAssigned: function() {
				this.$http.get('api/user/loket/check-assigned-user').then((response) => {
          var data = response.data
          var status = data.statusCode
          if (status == 200) {
          	if (data.data !== null) {
          		this.isAssigned = true
          		this.singleLoket = data.data
							this.wsInit()
          	} else {
          		this.isAssigned = false
          	}
          } else {
            swal('Warning', data.message, 'warning')
          }
        })
			},
			assignUser: function(loket) {
				if (loket != null) {
					var loket_id = loket._id
					var params = {
						assign_user_id: this.currentUser._id
					}

					this.$http.put('api/user/loket/' + loket_id, params).then((response) => {
	          var data = response.data
	          var status = data.statusCode
	          if (status == 200) {
	            swal('Success', data.message, 'success')
	            this.init()
	          } else {
	            swal('Warning', data.message, 'warning')
	          }
	        })
				}
			},
			unAssignUser: function() {
				if (typeof this.singleLoket._id !== 'undefined') {
					var loket_id = this.singleLoket._id
					var params = {
						assign_user_id: null
					}

					this.$http.put('api/user/loket/' + loket_id, params).then((response) => {
	          var data = response.data
	          var status = data.statusCode
	          if (status == 200) {
	            swal('Success', data.message, 'success')
	            this.init()
	          } else {
	            swal('Warning', data.message, 'warning')
	          }
	        })
				}
			},
			getCurrentUser: function() {
				this.$http.get('api/user').then((response) => {
          var data = response.data
          var status = data.statusCode
          if (status == 200) {
          	if (data.data !== null) {
          		this.currentUser = data.data
          	}
          } else {
            swal('Warning', data.message, 'warning')
          }
        })
			},
			wsInit: function() {
				// Init ws
				const host = location.origin.replace(/^http/, 'ws') + '/' + localStorage.service_provider
				this.ws = new WebSocket(host)

				this.ws.onmessage = msg => {
					console.log(msg.data)
					var response = JSON.parse(msg.data)
					if (typeof response.data.url !== 'undefined') {
						var url = response.data.url

						// if last called
						if (url == '/queue/last-called') {
							if (typeof response.data.last_call !== 'undefined') {
								this.lastCalledNumber = response.data.last_call
								console.log(this.lastCalledNumber)
							}
						}

						// get count
						if (url == '/queue/count') {
							if (typeof response.data.count_queue !== 'undefined') {
								this.countUnCalledQueue = response.data.count_queue
								console.log(this.countUnCalledQueue)
							}
						}

						// get new queue
						if (url == '/queue/new') {
							if (this.singleLoket.service_id._id == response.data.queue.service_id) {
								this.ws.send(JSON.stringify({url: '/queue/count', service_id: this.singleLoket.service_id._id}))
							}
						}

					}
				}

				this.ws.onopen = () => {
					if (typeof this.singleLoket._id !== 'undefined') {
						this.ws.send(JSON.stringify({url: '/queue/last-called', service_id: this.singleLoket.service_id._id, loket_id: this.singleLoket._id}))
						this.ws.send(JSON.stringify({url: '/queue/count', service_id: this.singleLoket.service_id._id}))
					}
				}
			},

			callUser: function() {
				if (typeof this.singleLoket._id !== 'undefined') {
					console.log('call')
					var text = 'Nomor antrian. ' + this.lastCalledNumber + '. Silahkan menuju ke ' + this.singleLoket.name
					this.ws.send(JSON.stringify({url: '/queue/call', loket: this.singleLoket._id, text: text}))
				}
			},

			callNextUser: function() {
				if (typeof this.singleLoket._id !== 'undefined') {
					var params = {
						loket_id: this.singleLoket._id
					}

					this.$http.post('api/user/queue/call', params).then((response) => {
	          var data = response.data
	          var status = data.statusCode
	          if (status != 200) {
	          	swal('Warning', data.message, 'warning')
	          }
	        })
				}
			},

			init: function() {
				this.getListLoket()
				this.checkIsAssigned()
				this.getCurrentUser()
			}
		},
		mounted() {
			this.init()
		},
		beforeDestroy() {
			this.ws.close()
		}
	};
</script>
