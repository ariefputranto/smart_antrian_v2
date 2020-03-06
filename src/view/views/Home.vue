<template>
    <div>
    	<!-- Content Header (Page header) -->
	    <breadcrumb :lists="[{url: '/', name: 'Home'}]"/>
	    <!-- /.content-header -->

	    <!-- Main content -->
	    <section class="content">
	      <div class="container-fluid">
	      </div><!-- /.container-fluid -->
	    </section>
    </div>
</template>

<script>
	// @ is an alias to /src
	import Breadcrumb from '@/components/Breadcrumb.vue'

	export default {
		name: "Home",
		components: {
			Breadcrumb
		}
	};
</script>
