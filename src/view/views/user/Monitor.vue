<template>
    <div>
    	<!-- Content Header (Page header) -->
	    <breadcrumb :lists="[{url: '/', name: 'Home'}, {url: '/loket', name: 'Loket'}]"/>
	    <!-- /.content-header -->

	    <!-- Main content -->
	  	<fullscreen ref="fullscreen" style="background: #f4f6f9;padding-top: 50px">
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
		  </fullscreen>

    	<!-- Fullscreen buttom -->
      <div class="container">
        <div class="row">
        	<div class="col-lg-12">
        		<button type="button" class="btn btn-primary" @click="toggle" style="margin-bottom: 20px">Enter Fullscreen</button>
        	</div>
        </div>
      </div>
    </div>
</template>

<script>
	import Breadcrumb from '@/components/Breadcrumb.vue'
	import Fullscreen from "vue-fullscreen/src/component.vue"

	export default {
		name: "Home",
		components: {
			Breadcrumb,
			Fullscreen,
		},
		data() {
			return {
				listLoket: []
			}
		},
		methods: {
			getListLoket: function() {
				console.log('test')
			},
			toggle: function() {
        this.$refs['fullscreen'].toggle()
      }
		},
		mounted() {
			this.getListLoket()
		}
	};
</script>
