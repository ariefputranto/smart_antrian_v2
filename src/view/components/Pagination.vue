<template>
	<div class="card-footer clearfix">
    <ul class="pagination pagination-sm m-0 float-right">
      <li class="page-item"><a class="page-link" @click="firstPage">&laquo;</a></li>
      <li class="page-item"><a class="page-link" @click="nextBatchPagination(false)">...</a></li>
      <li class="page-item" v-for="paginate in pagination.list_show_page" v-bind:class="[ paginate == pagination.page ? 'active' : '' ]"><a class="page-link" @click="setPage( paginate )">{{ paginate }}</a></li>
      <li class="page-item"><a class="page-link" @click="nextBatchPagination(true)">...</a></li>
      <li class="page-item"><a class="page-link" @click="lastPage()">&raquo;</a></li>
    </ul>
  </div>
</template>

<script>
	export default{
		name: "Pagination",
    props: ['data'],
    data() {
      return {
        pagination: {
          page: 1,
          per_page: 10,
          last_page: 0,
          per_show_page: 6,
          start_show_page: 1,
          list_show_page: [],
        },
      }
    },
    watch: {
      data: function(newData, oldData) {
        console.log(newData)
        if (newData.statusCode == 200) {
          this.pagination.last_page = newData.data.totalPages
          this.calculatePagination();
        } else {
          this.pagination.last_page = 0;
        }
      }
    },
    methods: {
      // Pagination Start
      changePerPage: function() {
        this.pagination.page = 1
        this.$emit('get_data', {page: this.pagination.page, perPage: this.pagination.per_page})
      },
      firstPage: function() {
        this.pagination.page = 1
        this.$emit('get_data', {page: this.pagination.page, perPage: this.pagination.per_page})
      },
      // prevPage: function() {
      //   if (this.pagination.page > 1) {
      //     this.pagination.page = this.pagination.page - 1
      //     this.$emit('get_data')
      //   }
      // },
      // nextPage: function() {
      //   if (this.pagination.page < this.pagination.last_page) {
      //     this.pagination.page = this.pagination.page + 1
      //     this.$emit('get_data')
      //   }
      // },
      lastPage: function() {
        this.pagination.page = this.pagination.last_page
        this.$emit('get_data', {page: this.pagination.page, perPage: this.pagination.per_page})
      },
      setPage: function(page) {
        this.pagination.page = page
        this.$emit('get_data', {page: this.pagination.page, perPage: this.pagination.per_page})
      },
      calculatePagination: function() {
        if (this.pagination.last_page >= this.pagination.per_show_page) {
          this.pagination.start_show_page = Math.floor((this.pagination.page - 1) / this.pagination.per_show_page) * this.pagination.per_show_page + 1

          var index = 0
          this.pagination.list_show_page = []
          while (index < this.pagination.per_show_page) {
            if (this.pagination.start_show_page + index <= this.pagination.last_page) {
              this.pagination.list_show_page.push(this.pagination.start_show_page + index)
            }
            index++
          }
        } else {
          var index = 0
          this.pagination.start_show_page = 1
          this.pagination.list_show_page = []
          while (index < this.pagination.last_page) {
            if (this.pagination.start_show_page + index <= this.pagination.last_page) {
              this.pagination.list_show_page.push(this.pagination.start_show_page + index)
            }
            index++
          }
        }
      },
      nextBatchPagination: function(is_next) {
        if (this.pagination.last_page >= this.pagination.per_show_page) {
          if (is_next) {
            var is_allow = this.pagination.start_show_page + this.pagination.per_show_page <= this.pagination.last_page
            this.pagination.start_show_page = is_allow ? this.pagination.start_show_page + this.pagination.per_show_page : this.pagination.last_page
          } else {
            var is_allow = this.pagination.start_show_page - this.pagination.per_show_page > 0
            this.pagination.start_show_page = is_allow ? this.pagination.start_show_page - this.pagination.per_show_page : 1
          }

          var index = 0
          this.pagination.list_show_page = []
          while (index < this.pagination.per_show_page) {
            if (this.pagination.start_show_page + index <= this.pagination.last_page) {
                this.pagination.list_show_page.push(this.pagination.start_show_page + index)
            }
            index++
          }
        }
      }
      // Pagination End
    }
	}
</script>