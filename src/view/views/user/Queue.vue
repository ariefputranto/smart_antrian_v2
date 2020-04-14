<style type="text/css" scoped>
	.fullscreen {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		background: #f4f6f9;
		padding-top: 50px;
		z-index: 1600;
	}
</style>
<template>
    <div>
    	<!-- Content Header (Page header) -->
	    <breadcrumb :lists="[{url: '/', name: 'Home'}, {url: '/loket', name: 'Loket'}]"/>
	    <!-- /.content-header -->

	    <!-- Main content -->
      <div id="content-wrapper" v-bind:class="{ 'fullscreen': fullscreen }">
      	<section class="content">
		      <div class="container">
		        <div class="row">
		        	<div class="col-lg-12">
		        		<div class="card" v-for="service in listService" style="cursor: pointer;" @click="getNewQueue(service)">
		              <div class="card-body" style="text-align: center;">
				        		<h3>{{ service.name }}</h3>
		              </div>
		            </div>
		        	</div>
		        </div>
		      </div>
		    </section>
      </div>

      <print 
      	:number="print.lastNumber"
      	:company="print.company"
      	:description="print.description"
      	:service="print.service"
      	ref="printNumber" 
      	style="display: none;"
      	></print>

    	<!-- Fullscreen buttom -->
      <div class="container">
        <div class="row">
        	<div class="col-lg-12">
        		<button type="button" class="btn btn-primary" style="margin-bottom: 20px" @click="toggle">Enter Fullscreen</button>
        	</div>
        </div>
      </div>

    </div>
</template>

<script>
	import Breadcrumb from '@/components/Breadcrumb.vue'
	import Print from "@/components/Print.vue"

	export default {
		name: "Home",
		components: {
			Breadcrumb,
			Print
		},
		data() {
			return {
				listService: [],
				fullscreen: false,
				print: {
					lastNumber: '-',
					company: '',
					description: '',
					service: '',
				}
			}
		},
		methods: {
			getListService: function() {
				this.$http.get('api/user/services').then((response) => {
          var data = response.data
          var status = data.statusCode
          if (status == 200) {
          	this.listService = data.data
          } else {
            swal('Warning', data.message, 'warning')
          }
        })
			},
			toggle: function() {
        // this.$refs['fullscreen'].enter()
        this.fullscreen = true
      },
      getNewQueue: function(service) {
      	this.print.company = service.service_provider_id.name
      	this.print.description = service.service_provider_id.description
      	this.print.service = service.name
      	this.$refs.printNumber.print()
      }
		},
		mounted() {
			this.getListService()
		}
	};
</script>
