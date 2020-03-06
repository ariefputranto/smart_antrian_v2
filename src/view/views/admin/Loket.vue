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
			        			<tbody>
			        				<tr v-for="loket in listLoket">
			        					<td>{{ loket.name }}</td>
			        					<td>{{ loket.service_id.name }}</td>
			        					<td>{{ loket.token_expiration_time }}</td>
			        					<td>{{ Math.round(loket.latitude * 100) / 100 }}</td>
			        					<td>{{ Math.round(loket.longitude * 100) / 100 }}</td>
			        					<td>{{ loket.inner_distance }} Km</td>
			        					<td>{{ loket.outer_distance }} Km</td>
			        					<td>{{ typeof loket.assign_user_id !== 'undefined' && loket.assign_user_id !== null ? loket.assign_user_id.name : '-' }}</td>
			        					<td>
			        						<button class="btn btn-sm btn-primary" title="Update Loket" data-toggle="modal" data-target="#add-modal" @click="modalUpdateLoket(loket)" style="margin-right: 5px"><i class="fa fa-check-square"></i></button>
			        						<button class="btn btn-sm btn-danger" title="Delete Loket" @click="deleteLoket(loket._id)"><i class="fa fa-trash"></i></button>
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
              <h4 class="modal-title">Search Loket</h4>
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
              			<label>Service</label>
              			<select class="form-control" v-model="search.service">
              				<option value="">None</option>
              				<option v-for="service in listService" :value="service._id">{{service.name}}</option>
              			</select>
              		</div>
              		<div class="form-group">
              			<label>Assigned User</label>
              			<select class="form-control" v-model="search.assign_user">
              				<option value="">None</option>
              				<option v-for="user in listUser" :value="user._id">{{user.name}}</option>
              			</select>
              		</div>
              	</div>
              </div>
            </div>
            <div class="modal-footer justify-content-between">
              <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary" @click="searchLoket"><i class="fa fa-search"></i> Search</button>
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
              	<span v-if="isCreate">Add Loket</span>
              	<span v-else>Update Loket</span>
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
              			<label>Service</label>
              			<select class="form-control" v-model="input.service_id">
              				<option value="">None</option>
              				<option v-for="service in listService" :value="service._id">{{service.name}}</option>
              			</select>
              		</div>
              		<div class="form-group">
              			<label>Token Expired</label>
              			<input type="number" v-model="input.token_expiration_time" class="form-control" placeholder="Token Expired (In second)">
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
								      ref="loketMap"
								      @click="mapClickChanged"
              			>
              				<l-tile-layer :url="map.url_tile"></l-tile-layer>
              				<l-marker :lat-lng="map.markerLatLng" :draggable="true" @update:lat-lng="markerChanged"></l-marker>
              			</l-map>
              		</div>
              		<div class="form-group">
              			<label>Assigned User</label>
              			<select class="form-control" v-model="input.assign_user_id">
              				<option value="">None</option>
              				<option v-for="user in listUser" :value="user._id">{{user.name}}</option>
              			</select>
              		</div>
              	</div>
              </div>
            </div>
            <div class="modal-footer justify-content-between">
              <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
              <button v-if="isCreate" type="button" class="btn btn-primary" @click="addLoket"><i class="fa fa-plus"></i> Add Loket</button>
              <button v-else type="button" class="btn btn-primary" @click="updateLoket"><i class="fa fa-plus"></i> Update Loket</button>
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
				listLoket: [],
				listService: [],
				listUser: [],
				isCreate: true,
				loketId: '',
				input: {
					name: '',
					service_id: '',
					token_expiration_time: '',
					inner_distance: '',
					outer_distance: '',
					latitude: -7.280547,
					longitude: 112.797532,
					assign_user_id: '',
				},
				search: {
					name: '',
					service: '',
					assign_user: ''
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
			getListLoket: function() {
				this.$http.get('api/admin/loket' + '?page='+this.pagination.page+'&perPage='+this.pagination.per_page+'&'+jQuery.param( this.search )).then((response) => {
          var data = response.data
          var status = data.statusCode
          if (status == 200) {
          	this.listLoket = data.data.docs
          	this.pagination.response = data
          } else {
            swal('Warning', data.message, 'warning')
          }
        })
			},
			getListService: function() {
				this.$http.get('api/admin/services/all').then((response) => {
          var data = response.data
          var status = data.statusCode
          if (status == 200) {
          	this.listService = data.data
          } else {
            swal('Warning', data.message, 'warning')
          }
        })
			},
			getListUser: function() {
				this.$http.get('api/admin/user/all').then((response) => {
          var data = response.data
          var status = data.statusCode
          if (status == 200) {
          	this.listUser = data.data
          } else {
            swal('Warning', data.message, 'warning')
          }
        })
			},
			addLoket: function() {
				this.$http.post('api/admin/loket', this.input).then((response) => {
          var data = response.data
          var status = data.statusCode
          if (status == 200) {
            $('#add-modal').modal("hide")
            swal('Success', data.message, 'success')
            this.getListLoket()
          } else {
            swal('Warning', data.message, 'warning')
          }
        })
			},
			updateLoket: function() {
				this.$http.put('api/admin/loket/'+this.loketId, this.input).then((response) => {
          var data = response.data
          var status = data.statusCode
          if (status == 200) {
            $('#add-modal').modal("hide")
            swal('Success', data.message, 'success')
            this.getListLoket()
          } else {
            swal('Warning', data.message, 'warning')
          }
        })
			},
			deleteLoket: function(loketId) {
				this.loketId = loketId
				swal({
					title: "Warning!",
					text: "Do you want to delete this loket?",
					icon: "warning",
					buttons: true,
					dangerMode: true
				}).then((willDelete) => {
					if (willDelete) {
						this.$http.delete('api/admin/loket/'+this.loketId).then((response) => {
		          var data = response.data
		          var status = data.statusCode
		          if (status == 200) {
		            $('#add-modal').modal("hide")
		            swal('Success', data.message, 'success')
		            this.getListLoket()
		          } else {
		            swal('Warning', data.message, 'warning')
		          }
		        })
					}
				})
			},
			searchLoket: function() {
				$('#search-modal').modal("hide")
				this.getListLoket()
			},
			clearField: function() {
				this.input.name = ''
				this.input.service_id = ''
				this.input.token_expiration_time = ''
				this.input.inner_distance = ''
				this.input.outer_distance = ''
				this.input.assign_user_id = ''

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
			modalUpdateLoket: function(loket) {
				this.setIsCreate(false)
				this.loketId = loket._id

				this.input.name = loket.name
				this.input.service_id = loket.service_id._id
				this.input.token_expiration_time = loket.token_expiration_time
				this.input.inner_distance = loket.inner_distance
				this.input.outer_distance = loket.outer_distance
				this.input.latitude = loket.latitude
				this.input.longitude = loket.longitude
				this.input.assign_user_id = typeof loket.assign_user_id !== 'undefined' && loket.assign_user_id !== null ? loket.assign_user_id._id : ''

				this.map.center = [loket.latitude, loket.longitude]
				this.map.markerLatLng = [loket.latitude, loket.longitude]
			},
			getPaginationData: function(data) {
				this.pagination.page = data.page
				this.pagination.perPage = data.perPage
				this.getListLoket()
			},
			// fix map
			mapModalShown: function() {
				console.log('on map modal shown')
	      setTimeout(() => {
	        this.$refs.loketMap.mapObject.invalidateSize(); 
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
			this.getListLoket()
			this.getListService()
			this.getListUser()
			this.getCurrentLocation()
		}
	};
</script>
