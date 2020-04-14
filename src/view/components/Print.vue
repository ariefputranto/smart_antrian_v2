<style scoped type="text/css">
    .nomor_antrian{
      font-weight: bolder;
      font-size: 36px;
    }
    .nama_layanan{
      font-weight: bold;
    }
    .text-center {
      text-align: center;
    }
    .m-0 {
      margin: 0;
    }
    .mb-0 {
      margin-bottom: 0;
    }
    .mt-0 {
      margin-top: 0;
    }
    hr{
      border: none;
      background: transparent;
      display: block;
      width: 100%;
      border-top: solid 5px #333; 
    }
</style>

<template>
	<div class="content-header" id="print">
    <div class="container-fluid">
      <div class="row mb-2">
        <div class="col-sm-8 offset-sm-2">
          <h4 class="m-0 text-center">{{ company }}</h4>
          <h6 class="m-0 text-center">{{ description }}</h6>
          <h6 class="m-0 text-center">Date : {{ dateNow }} WIB</h6>
          <hr>
          <h1 class="mb-0 text-center nomor_antrian">{{ number }}</h1>
          <h5 class="mt-0 text-center nama_layanan">{{ service.toUpperCase() }}</h5>
          <hr>
          <h6 class="m-0 text-center">Your number will be called shortly</h6>
          <h6 class="m-0 text-center">Thank you for waiting</h6>
        </div>
      </div><!-- /.row -->
    </div><!-- /.container-fluid -->
  </div>
</template>

<script>
  import moment from "moment-timezone"

	export default{
		name: "Print",
		props: ['number', 'company', 'description', 'service'],
    data() {
      return {
        dateNow: moment().tz('Asia/Jakarta').format('lll')
      }
    },
    methods: {
      print: function() {
        setTimeout(() => {
          // Get HTML to print from element
          const prtHtml = document.getElementById('print').innerHTML;

          // Get all stylesheets HTML
          let stylesHtml = '';
          for (const node of [...document.querySelectorAll('link[rel="stylesheet"], style')]) {
            stylesHtml += node.outerHTML;
          }

          // Open the print window
          const WinPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');

          WinPrint.document.write(`<!DOCTYPE html>
          <html>
            <head>
              ${stylesHtml}
            </head>
            <body>
              ${prtHtml}
            </body>
          </html>`);

          WinPrint.document.close();
          WinPrint.focus();
          WinPrint.print();
          WinPrint.close();
        }, 200)
      }
    }
	}
</script>