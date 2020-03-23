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
	              	<button v-if="loket.assign_user_id == null" type="button" class="btn btn-info float-right"><i class="fas fa-door-open"></i> Use</button>
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
	              </div>
	              
	              <div class="card-body">
			        		<div class="row">
			        			<div class="col-lg-12 text-center">
			        				<h1 style="font-weight: 400;font-size: 70px">A11</h1>
			        				<p>5 more remaining</p>
			        			</div>
			        		</div>
	              </div>

	              <div class="card-footer clearfix">
	              	<button type="button" class="btn btn-info btn-lg"><i class="fas fa-redo-alt"></i></button>
	              	<button type="button" class="btn btn-success btn-lg float-right"><i class="fas fa-arrow-right"></i></button>
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
				listLoket: [],
				singleLoket: {}
			}
		},
		methods: {
			getListLoket: function() {
				this.$http.get('api/user/loket' + '?'+jQuery.param( this.search )).then((response) => {
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
          	} else {
          		this.isAssigned = false
          	}
          } else {
            swal('Warning', data.message, 'warning')
          }
        })
			}
		},
		mounted() {
			this.getListLoket()
			this.checkIsAssigned()
		}
	};
</script>
