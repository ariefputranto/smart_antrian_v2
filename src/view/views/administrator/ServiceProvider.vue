<template>
    <div>
    	<!-- Content Header (Page header) -->
	    <breadcrumb :lists="[{url: '/', name: 'Home'}, {url: '/service-provider', name: 'Service Provider'}]"/>
	    <!-- /.content-header -->

	    <!-- Main content -->
	    <section class="content">
	      <div class="container">
	        <div class="row">
	        	<div class="col-lg-12">
	        		<div class="card">
	              <div class="card-header">
	                <h3 class="card-title">Service Provider</h3>
	                <div class="card-tools">
	                  <ul class="nav nav-pills ml-auto">
	                    <li class="nav-item">
	                      <a class="nav-link" href="#" data-toggle="modal" data-target="#search-modal"><i class="fa fa-search"></i> Search</a>
	                    </li>
	                    <li class="nav-item">
	                      <a class="nav-link" href="#" data-toggle="modal" data-target="#add-modal" @click="setIsCreate(true)"><i class="fa fa-plus"></i> Add Service Provider</a>
	                    </li>
	                  </ul>
	                </div>
	              </div>
	              
	              <div class="card-body">
			        		<table class="table table-stripped table-bordered">
			        			<thead>
			        				<tr>
			        					<th>Name</th>
			        					<th>Description</th>
			        					<th>Type</th>
			        					<th>Icon</th>
			        					<th>Latitude</th>
			        					<th>Longitude</th>
			        					<th>Inner Range</th>
			        					<th>Outer Range</th>
			        					<th>Action</th>
			        				</tr>
			        			</thead>
			        			<tbody>
			        				<tr v-for="service in listServiceProvider">
			        					<td>{{ service.name }}</td>
			        					<td>{{ service.description }}</td>
			        					<td>{{ service.type }}</td>
			        					<td>{{ service.icon }}</td>
			        					<td>{{ Math.round(service.latitude * 100) / 100 }}</td>
			        					<td>{{ Math.round(service.longitude * 100) / 100 }}</td>
			        					<td>{{ service.inner_distance }} Km</td>
			        					<td>{{ service.outer_distance }} Km</td>
			        					<td>
			        						<button class="btn btn-sm btn-primary" title="Update Service Provider" data-toggle="modal" data-target="#add-modal" @click="modalUpdateServiceProvider(service)" style="margin-right: 5px"><i class="fa fa-check-square"></i></button>
			        						<button class="btn btn-sm btn-danger" title="Delete Service Provider" @click="deleteServiceProvider(service._id)"><i class="fa fa-trash"></i></button>
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
              <h4 class="modal-title">Search Service Providers</h4>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <div class="row">
              	<div class="col-lg-12">
              		<div class="form-group">
              			<label>Name</label>
              			<input type="text" v-model="search.name" class="form-control" placeholder="Name">
              		</div>
              		<div class="form-group">
              			<label>Description</label>
              			<input type="text" v-model="search.description" class="form-control" placeholder="Description">
              		</div>
              		<div class="form-group">
              			<label>Type</label>
              			<input type="text" v-model="search.type" class="form-control" placeholder="Type">
              		</div>
              	</div>
              </div>
            </div>
            <div class="modal-footer justify-content-between">
              <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary" @click="searchServiceProvider"><i class="fa fa-search"></i> Search</button>
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
              	<span v-if="isCreate">Add Service Provider</span>
              	<span v-else>Update Service Provider</span>
	            </h4>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <div class="row">
              	<div class="col-lg-12">
              		<div class="form-group">
              			<label>Name</label>
              			<input type="text" v-model="input.name" class="form-control" placeholder="Name">
              		</div>
              		<div class="form-group">
              			<label>Description</label>
              			<input type="text" v-model="input.description" class="form-control" placeholder="Description">
              		</div>
              		<div class="form-group">
              			<label>Type</label>
              			<input type="text" v-model="input.type" class="form-control" placeholder="Type">
              		</div>
              		<div class="form-group">
              			<label>Icon</label>
              			<input type="file" ref="file" @change="fileChanged" class="form-control">
              		</div>
              		<div class="form-group" v-if="input.icon.length > 0">
              			<label style="display: block;">Preview</label>
              			<img :src="imagePath + input.icon" style="max-width: 300px;margin-left: auto;margin-right: auto;display: block;">
              		</div>
              		<div class="form-group">
              			<label>Inner Distance</label>
              			<input type="number" v-model="input.inner_distance" class="form-control" placeholder="Inner Distance (In Km)">
              		</div>
              		<div class="form-group">
              			<label>Outer Distance</label>
              			<input type="number" v-model="input.outer_distance" class="form-control" placeholder="Outer Distance (In Km)">
              		</div>
              		<div class="form-group">
              			<label>Map</label>
              			<l-map
              				style="height: 300px; width: 100%"
								      :zoom="map.zoom"
								      :center="map.center"
								      ref="serviceProviderMap"
								      @click="mapClickChanged"
              			>
              				<l-tile-layer :url="map.url_tile"></l-tile-layer>
              				<l-marker :lat-lng="map.markerLatLng" :draggable="true" @update:lat-lng="markerChanged"></l-marker>
              			</l-map>
              		</div>
              	</div>
              </div>
            </div>
            <div class="modal-footer justify-content-between">
              <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
              <button v-if="isCreate" type="button" class="btn btn-primary" @click="addServiceProvider"><i class="fa fa-plus"></i> Add Service Provider</button>
              <button v-else type="button" class="btn btn-primary" @click="updateServiceProvider"><i class="fa fa-plus"></i> Update Service Provider</button>
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

	// leaflet
	import 'leaflet/dist/leaflet.css'
	import L from 'leaflet'
	import { LMap, LTileLayer, LMarker } from 'vue2-leaflet'

	export default {
		name: "Home",
		components: {
			Breadcrumb,
			Pagination,
			LMap,
	    LTileLayer,
	    LMarker
		},
		data() {
			return {
				listServiceProvider: [],
				isCreate: true,
				serviceProviderId: '',
				imagePath: 'public/uploads/',
				input: {
					name: '',
					description: '',
					type: '',
					icon: '',
					inner_distance: '',
					outer_distance: '',
					latitude: -7.280547,
					longitude: 112.797532,
				},
				search: {
					name: '',
					description: '',
					type: ''
				},
				pagination: {
					response: null,
					page: 1,
					per_page: 10,
				},
				map: {
					url_tile: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
					zoom: 13,
					center: [-7.280547, 112.797532],
					markerLatLng: [-7.280547, 112.797532,]
				}
			}
		},
		methods: {
			getListServiceProvider: function() {
				this.$http.get('api/administrator/service-provider' + '?page='+this.pagination.page+'&perPage='+this.pagination.per_page+'&'+jQuery.param( this.search )).then((response) => {
          var data = response.data
          var status = data.statusCode
          if (status == 200) {
          	this.listServiceProvider = data.data.docs
          	this.pagination.response = data
          } else {
            swal('Warning', data.message, 'warning')
          }
        })
			},
			addServiceProvider: function() {
				if (typeof this.input.icon.name == 'string') {
					var formData = new FormData()
					formData.append('name', this.input.name)
					formData.append('description', this.input.description)
					formData.append('type', this.input.type)
					formData.append('icon', this.input.icon)
					formData.append('inner_distance', this.input.inner_distance)
					formData.append('outer_distance', this.input.outer_distance)
					formData.append('latitude', this.input.latitude)
					formData.append('longitude', this.input.longitude)
				} else {
					var formData = this.input
				}

				this.$http.post('api/administrator/service-provider', formData).then((response) => {
          var data = response.data
          var status = data.statusCode
          if (status == 200) {
            $('#add-modal').modal("hide")
            swal('Success', data.message, 'success')
            this.getListServiceProvider()
          } else {
            swal('Warning', data.message, 'warning')
          }
        })
			},
			updateServiceProvider: function() {
				if (typeof this.input.icon.name == 'string') {
					var formData = new FormData()
					formData.append('name', this.input.name)
					formData.append('description', this.input.description)
					formData.append('type', this.input.type)
					formData.append('icon', this.input.icon)
					formData.append('inner_distance', this.input.inner_distance)
					formData.append('outer_distance', this.input.outer_distance)
					formData.append('latitude', this.input.latitude)
					formData.append('longitude', this.input.longitude)
				} else {
					var formData = this.input
				}

				this.$http.put('api/administrator/service-provider/'+this.serviceProviderId, formData).then((response) => {
          var data = response.data
          var status = data.statusCode
          if (status == 200) {
            $('#add-modal').modal("hide")
            swal('Success', data.message, 'success')
            this.getListServiceProvider()
          } else {
            swal('Warning', data.message, 'warning')
          }
        })
			},
			deleteServiceProvider: function(serviceProviderId) {
				this.serviceProviderId = serviceProviderId
				swal({
					title: "Warning!",
					text: "Do you want to delete this service provider?",
					icon: "warning",
					buttons: true,
					dangerMode: true
				}).then((willDelete) => {
					if (willDelete) {
						this.$http.delete('api/administrator/service-provider/'+this.serviceProviderId).then((response) => {
		          var data = response.data
		          var status = data.statusCode
		          if (status == 200) {
		            $('#add-modal').modal("hide")
		            swal('Success', data.message, 'success')
		            this.getListServiceProvider()
		          } else {
		            swal('Warning', data.message, 'warning')
		          }
		        })
					}
				})
			},
			searchServiceProvider: function() {
				$('#search-modal').modal("hide")
				this.getListServiceProvider()
			},
			clearField: function() {
				this.input.name = ''
				this.input.description = ''
				this.input.type = ''
				this.input.icon = ''
				this.input.inner_distance = ''
				this.input.outer_distance = ''
				this.$refs.file.value = ''

				this.map.center = [-7.280547, 112.797532]
				this.map.markerLatLng = [-7.280547, 112.797532]
			},
			setIsCreate: function(isCreate) {
				if (isCreate) {
					this.isCreate = true
					this.clearField()
				} else {
					this.isCreate = false
					this.clearField()
				}

			  this.mapModalShown()
			},
			modalUpdateServiceProvider: function(serviceProvider) {
				this.setIsCreate(false)
				this.serviceProviderId = serviceProvider._id
				this.input.name = serviceProvider.name
				this.input.description = serviceProvider.description
				this.input.type = serviceProvider.type
				this.input.icon = typeof serviceProvider.icon == 'undefined' ? '' : serviceProvider.icon
				this.input.inner_distance = serviceProvider.inner_distance
				this.input.outer_distance = serviceProvider.outer_distance

				if (serviceProvider.latitude && serviceProvider.longitude) {
					this.map.center = [serviceProvider.latitude, serviceProvider.longitude]
					this.map.markerLatLng = [serviceProvider.latitude, serviceProvider.longitude]
				}
			},
			getPaginationData: function(data) {
				this.pagination.page = data.page
				this.pagination.perPage = data.perPage
				this.getListServiceProvider()
			},
			fileChanged: function() {
				this.input.icon = this.$refs.file.files[0]
			},

			// fix map
			mapModalShown: function() {
				console.log('on map modal shown')
	      setTimeout(() => {
	        this.$refs.serviceProviderMap.mapObject.invalidateSize(); 
	      }, 500);
	    },
	    getCurrentLocation: function() {
	    	// Try HTML5 geolocation.
        if (navigator.geolocation) {
            console.log('location allowed')
            navigator.geolocation.getCurrentPosition((position) => {
                console.log(position)
                this.map.center = [position.coords.latitude, position.coords.longitude]
            }, function() {
                console.log('no location access');
                $.getJSON('https://ipapi.co/json/', (result) => {
                    console.log(result);
		                this.map.center = [parseFloat(result.latitude), parseFloat(result.longitude)]
                });
            });
        } else {
            console.log('no location access');
            $.getJSON('https://ipapi.co/json/', (result) => {
                console.log(result);
                this.map.center = [parseFloat(result.latitude), parseFloat(result.longitude)]
            });
        }
	    },
	    markerChanged: function(latlng) {
	    	this.input.latitude = latlng.lat
	    	this.input.longitude = latlng.lng
	    },
	    mapClickChanged: function(event){
	    	this.map.markerLatLng = event.latlng
	    }
		},
		mounted() {
			this.getListServiceProvider()
			this.getCurrentLocation()
		}
	};
</script>
