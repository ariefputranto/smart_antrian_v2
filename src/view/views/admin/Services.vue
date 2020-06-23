<template>
    <div>
    	<!-- Content Header (Page header) -->
	    <breadcrumb :lists="[{url: '/', name: 'Home'}, {url: '/services', name: 'Services'}]"/>
	    <!-- /.content-header -->

	    <!-- Main content -->
	    <section class="content">
	      <div class="container">
	        <div class="row">
	        	<div class="col-lg-12">
	        		<div class="card">
	              <div class="card-header">
	                <h3 class="card-title">Services</h3>
	                <div class="card-tools">
	                  <ul class="nav nav-pills ml-auto">
	                    <li class="nav-item">
	                      <a class="nav-link" href="#" data-toggle="modal" data-target="#search-modal"><i class="fa fa-search"></i> Search</a>
	                    </li>
	                    <li class="nav-item">
	                      <a class="nav-link" href="#" data-toggle="modal" data-target="#add-modal" @click="setIsCreate(true)"><i class="fa fa-plus"></i> Add Service</a>
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
			        					<th>Number of Loket</th>
			        					<th>Code</th>
			        					<th>Action</th>
			        				</tr>
			        			</thead>
			        			<tbody>
			        				<tr v-for="service in listService">
			        					<td>{{ service.name }}</td>
			        					<td>{{ service.description }}</td>
			        					<td>{{ service.number_loket }}</td>
			        					<td>{{ service.code }}</td>
			        					<td>
			        						<button class="btn btn-sm btn-primary" title="Update Service" data-toggle="modal" data-target="#add-modal" @click="modalUpdateService(service)" style="margin-right: 5px"><i class="fa fa-check-square"></i></button>
			        						<button class="btn btn-sm btn-danger" title="Delete Service" @click="deleteService(service._id)"><i class="fa fa-trash"></i></button>
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
              <h4 class="modal-title">Search Service</h4>
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
              	</div>
              </div>
            </div>
            <div class="modal-footer justify-content-between">
              <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary" @click="searchService"><i class="fa fa-search"></i> Search</button>
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
              	<span v-if="isCreate">Add Service</span>
              	<span v-else>Update Service</span>
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
              			<label>Number of Loket</label>
              			<input type="number" v-model="input.number_loket" class="form-control" placeholder="Number of Loket">
              		</div>
              		<div class="form-group">
              			<label>Code</label>
              			<input type="text" v-model="input.code" class="form-control" placeholder="Code">
              		</div>
              	</div>
              </div>
            </div>
            <div class="modal-footer justify-content-between">
              <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
              <button v-if="isCreate" type="button" class="btn btn-primary" @click="addService"><i class="fa fa-plus"></i> Add Service</button>
              <button v-else type="button" class="btn btn-primary" @click="updateService"><i class="fa fa-plus"></i> Update Service</button>
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
				listService: [],
				isCreate: true,
				serviceId: '',
				input: {
					name: '',
					description: '',
					number_loket: '',
					code: ''
				},
				search: {
					name: '',
				},
				pagination: {
					response: null,
					page: 1,
					per_page: 10,
				}
			}
		},
		methods: {
			getListService: function() {
				this.$http.get('api/admin/services' + '?page='+this.pagination.page+'&perPage='+this.pagination.per_page+'&'+jQuery.param( this.search )).then((response) => {
          var data = response.data
          var status = data.statusCode
          if (status == 200) {
          	this.listService = data.data.docs
          	this.pagination.response = data
          } else {
            swal('Warning', data.message, 'warning')
          }
        }, error => {
        	swal('Warning', error.message, 'warning')
        })
			},
			addService: function() {
				this.$http.post('api/admin/services', this.input).then((response) => {
          var data = response.data
          var status = data.statusCode
          if (status == 200) {
            $('#add-modal').modal("hide")
            swal('Success', data.message, 'success')
            this.getListService()
          } else {
            swal('Warning', data.message, 'warning')
          }
        }, error => {
        	swal('Warning', error.message, 'warning')
        })
			},
			updateService: function() {
				this.$http.put('api/admin/services/'+this.serviceId, this.input).then((response) => {
          var data = response.data
          var status = data.statusCode
          if (status == 200) {
            $('#add-modal').modal("hide")
            swal('Success', data.message, 'success')
            this.getListService()
          } else {
            swal('Warning', data.message, 'warning')
          }
        }, error => {
        	swal('Warning', error.message, 'warning')
        })
			},
			deleteService: function(serviceId) {
				this.serviceId = serviceId
				swal({
					title: "Warning!",
					text: "Do you want to delete this service?",
					icon: "warning",
					buttons: true,
					dangerMode: true
				}).then((willDelete) => {
					if (willDelete) {
						this.$http.delete('api/admin/services/'+this.serviceId).then((response) => {
		          var data = response.data
		          var status = data.statusCode
		          if (status == 200) {
		            $('#add-modal').modal("hide")
		            swal('Success', data.message, 'success')
		            this.getListService()
		          } else {
		            swal('Warning', data.message, 'warning')
		          }
		        }, error => {
		        	swal('Warning', error.message, 'warning')
		        })
					}
				})
			},
			searchService: function() {
				$('#search-modal').modal("hide")
				this.getListService()
			},
			clearField: function() {
				this.input.name = ''
				this.input.description = ''
				this.input.number_loket = ''
				this.input.code = ''
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
			modalUpdateService: function(service) {
				this.setIsCreate(false)
				this.serviceId = service._id
				this.input.name = service.name
				this.input.description = service.description
				this.input.number_loket = service.number_loket
				this.input.code = service.code
			},
			getPaginationData: function(data) {
				this.pagination.page = data.page
				this.pagination.perPage = data.perPage
				this.getListService()
			}
		},
		mounted() {
			this.getListService()
		}
	};
</script>
