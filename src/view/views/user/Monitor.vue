<template>
    <div>
    	<!-- Content Header (Page header) -->
	    <breadcrumb :lists="[{url: '/', name: 'Home'}, {url: '/loket', name: 'Loket'}]"/>
	    <!-- /.content-header -->

	    <!-- Main content -->
	    <section class="content">
	      <div class="container">
	        <div class="row">
	        	<div class="col-lg-4">
	        		<div class="card">
	              <div class="card-header">
	                <h3 class="card-title"><i class="fas fa-user"></i> Loket A</h3>
	              </div>
	              
	              <div class="card-body">
			        		<div class="row">
			        			<div class="col-lg-12 text-center">
			        				<h1 style="font-weight: 400;font-size: 70px">A11</h1>
			        			</div>
			        		</div>
	              </div>
	            </div>
	        	</div>
	        	<div class="col-lg-4">
	        		<div class="card">
	              <div class="card-header">
	                <h3 class="card-title"><i class="fas fa-user"></i> Loket A</h3>
	              </div>
	              
	              <div class="card-body">
			        		<div class="row">
			        			<div class="col-lg-12 text-center">
			        				<h1 style="font-weight: 400;font-size: 70px">A11</h1>
			        			</div>
			        		</div>
	              </div>
	            </div>
	        	</div>
	        	<div class="col-lg-4">
	        		<div class="card">
	              <div class="card-header">
	                <h3 class="card-title"><i class="fas fa-user"></i> Loket A</h3>
	              </div>
	              
	              <div class="card-body">
			        		<div class="row">
			        			<div class="col-lg-12 text-center">
			        				<h1 style="font-weight: 400;font-size: 70px">A11</h1>
			        			</div>
			        		</div>
	              </div>
	            </div>
	        	</div>
	        	<div class="col-lg-4">
	        		<div class="card">
	              <div class="card-header">
	                <h3 class="card-title"><i class="fas fa-user"></i> Loket A</h3>
	              </div>
	              
	              <div class="card-body">
			        		<div class="row">
			        			<div class="col-lg-12 text-center">
			        				<h1 style="font-weight: 400;font-size: 70px">A11</h1>
			        			</div>
			        		</div>
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
