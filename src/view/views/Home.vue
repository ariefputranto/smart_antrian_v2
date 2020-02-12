<template>
    <div>
    	<!-- Content Header (Page header) -->
	    <breadcrumb :lists="[{url: '/', name: 'Home'}]"/>
	    <!-- /.content-header -->

	    <!-- Main content -->
	    <section class="content">
	      <div class="container-fluid">
	        <HelloWorld msg="Welcome to Your Vue.js App" />
	      </div><!-- /.container-fluid -->
	    </section>
    </div>
</template>

<script>
	// @ is an alias to /src
	import HelloWorld from "@/components/HelloWorld.vue"
	import Breadcrumb from '@/components/Breadcrumb.vue'

	export default {
		name: "Home",
		components: {
			HelloWorld,
			Breadcrumb
		}
	};
</script>
