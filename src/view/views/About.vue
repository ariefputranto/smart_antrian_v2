<template>
    <!-- Content Header (Page header) -->
    <breadcrumb :lists="[{url: '/', name: 'Home'}, {url: '/about', name: 'About'}]"/>
    <!-- /.content-header -->

    <!-- Main content -->
    <section class="content">
      <div class="container-fluid">
        <h1>This is an about page</h1>
      </div><!-- /.container-fluid -->
    </section>
</template>

<script>
	import Breadcrumb from '@/components/Breadcrumb.vue'
	export default{
		name: "about",
		components: {
			Breadcrumb
		}
	}

</script>
