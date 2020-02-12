<template>
	<div class="content-header">
    <div class="container-fluid">
      <div class="row mb-2">
        <div class="col-sm-6">
          <h1 class="m-0 text-dark">{{ lists[lists.length - 1].name }}</h1>
        </div><!-- /.col -->
        <div class="col-sm-6">
          <ol class="breadcrumb float-sm-right">
            <li class="breadcrumb-item" v-bind:class="{ 'active': index == (lists.length - 1) }" v-for="(item, index) in lists"><router-link :to="item.url">{{ item.name }}</router-link></li>
            <!-- <li class="breadcrumb-item active">Dashboard v1</li> -->
          </ol>
        </div><!-- /.col -->
      </div><!-- /.row -->
    </div><!-- /.container-fluid -->
  </div>
</template>

<script>
	export default{
		name: "Breadcrumb",
		props: ['lists'],
	}
</script>