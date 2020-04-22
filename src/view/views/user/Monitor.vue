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

		        	<div class="col-lg-4" v-for="loket in listLoket">
		        		<div class="card">
		              <div class="card-header">
		                <h3 class="card-title"><i class="fas fa-user"></i> {{ loket.name }}</h3>
		              </div>
		              
		              <div class="card-body">
				        		<div class="row">
				        			<div class="col-lg-12 text-center">
				        				<h1 style="font-weight: 400;font-size: 70px">{{ listLastCalledNumber[loket._id] }}</h1>
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
				listLoket: [],
				listLastCalledNumber: [],
				listPlay: [],
				ws: null,
			}
		},
		methods: {
			getListLoket: function() {
				this.$http.get('api/user/loket').then((response) => {
          var data = response.data
          var status = data.statusCode
          if (status == 200) {
          	this.listLoket = data.data

          	// init last called number
          	$.each(this.listLoket, (index, loket) => {
          		this.$set(this.listLastCalledNumber, loket._id, '-')
          	})

          	// init websocket
						this.wsInit()
          } else {
            swal('Warning', data.message, 'warning')
          }
        })
			},
			toggle: function() {
        this.$refs['fullscreen'].toggle()
      },
      init: function() {
      	setInterval(() => {
					if (this.listPlay.length > 0) {
						if (responsiveVoice.isPlaying() !== true) {
							var shifted= this.listPlay.shift();
							responsiveVoice.speak(
							    shifted,
							    "Indonesian Female",
							    {
							     pitch: 1, 
							     rate: 0.7, 
							     volume: 7,
							    }
							);	
						}
					}
				}, 1500);
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
						if (url == '/queue/last-called-by-loket') {
							if (typeof response.data.last_call !== 'undefined' && typeof response.data.loket !== 'undefined') {
	          		this.$set(this.listLastCalledNumber, response.data.loket, response.data.last_call)
							}
						}

						// if call user
						if (url == '/queue/call' && response.statusCode == 200) {
							var text = response.data.text
							this.listPlay.push(text)
						}

					}
				}

				this.ws.onopen = () => {
					$.each(this.listLoket, (index, loket) => {
						this.ws.send(JSON.stringify({url: '/queue/last-called-by-loket', service_id: loket.service_id._id, loket_id: loket._id}))
					})
				}

			},

		},
		mounted() {
			this.init()
			this.getListLoket()
		},
		beforeDestroy() {
			this.ws.close()
		}
	};
</script>
