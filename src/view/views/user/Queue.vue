<template>
    <div>
    	<!-- Content Header (Page header) -->
	    <breadcrumb :lists="[{url: '/', name: 'Home'}, {url: '/loket', name: 'Loket'}]"/>
	    <!-- /.content-header -->

	    <!-- Main content -->
	    <section class="content">
	      <div class="container">
	        <div class="row">
	        	<div class="col-lg-12">
	        		<div class="card">
	              <div class="card-header">
	                <h3 class="card-title">Loket</h3>
	                <div class="card-tools">
	                  <ul class="nav nav-pills ml-auto">
	                    <li class="nav-item">
	                      <a class="nav-link" href="#" data-toggle="modal" data-target="#search-modal"><i class="fa fa-search"></i> Search</a>
	                    </li>
	                    <li class="nav-item">
	                      <a class="nav-link" href="#" data-toggle="modal" data-target="#add-modal" @click="setIsCreate(true)"><i class="fa fa-plus"></i> Add Loket</a>
	                    </li>
	                  </ul>
	                </div>
	              </div>
	              
	              <div class="card-body">
			        		<table class="table table-stripped table-bordered">
			        			<thead>
			        				<tr>
			        					<th>Name</th>
			        					<th>Service</th>
			        					<th>Token Expire</th>
			        					<th>Latitude</th>
			        					<th>Longitude</th>
			        					<th>Inner Range</th>
			        					<th>Outer Range</th>
			        					<th>Assigned User</th>
			        					<th>Action</th>
			        				</tr>
			        			</thead>
			        		</table>
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
				listLoket: []
			}
		},
		methods: {
			getListLoket: function() {
				console.log('test')
			}
		},
		mounted() {
			this.getListLoket()
		}
	};
</script>
