<template>
  <div id="chart">
    <apexchart type=radialBar height=350 :options="chartOptions" :series="series" />
  </div>
</template>

<script>
  import axios from 'axios'
  export default {
    data: function() {
      return {
        series: [70],
         chartOptions: {
           plotOptions: {
             radialBar: {
               hollow: {
                 size: '70%',
               }
             },
           },
           labels: ['Cricket']
         }
      }
    },
};
</script>
