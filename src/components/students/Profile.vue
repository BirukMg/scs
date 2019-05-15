<template>
  <v-app>

    <mdb-container>
      <mdb-line-chart :data="totalScoreData" :options="totolScoreOptions" :width="1000" :height="500"></mdb-line-chart>
    </mdb-container>
  </v-app>
</template>

<script>
import axios from 'axios'
import { mdbLineChart, mdbContainer } from 'mdbvue';

export default {
  name: 'TotalScore',
  components: {
    mdbLineChart,
    mdbContainer
  },
  data() {
    return {
      totalScoreData: {
        labels: [],
        datasets: [
          {
            label: "Total Activity Score",
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: []
          }
        ]
      },
      totolScoreOptions: {
        responsive: false,
        maintainAspectRatio: false,
        scales: {
          xAxes: [{
            gridLines: {
              display: true,
              color: "rgba(0, 0, 0, 0.1)",
            }
          }],
          yAxes: [{
            gridLines: {
              display: true,
              color: "rgba(0, 0, 0, 0.1)",
            }
          }],
        }
      }
    };
  },
  created () {
    this.initialize()
  },
  methods: {
    initialize(){
      let filterStudent = {
        where: {
          login_id: this.$store.state.users + "_id"
        }
      }
      axios.get("http://"+ this.$store.state.serverIp +":3000/api/students?filter="+ JSON.stringify(filterStudent))
      .then(res => {
        let yearArr = []
        for (var i = res.data[0].startedYear; i <= (new Date()).getFullYear() - 7; i++) {
          this.totalScoreData.labels.push(i)
          let filterTotalSore = {
            where: {
              studentId: res.data[0].id + "_id",
              year: i
            }
          }
          axios.get("http://"+ this.$store.state.serverIp +":3000/api/classActivities?filter="+ JSON.stringify(filterTotalSore))
          .then(res => {
            yearArr = []
            let cool = []
            for (var i = 0; i < res.data.length; i++) {
              cool = []
              cool.push(res.data[i].homework)
              cool.push(res.data[i].classwork)
              cool.push(res.data[i].assignment)
              cool.push(res.data[i].participation)
              cool.push(res.data[i].conduct)
              yearArr.push(this.sum(cool)/5)
            }
            this.totalScoreData.datasets[0].data.push(this.sum(yearArr)/2)
            console.log(this.totalScoreData.datasets[0].data);
          })
        }
        console.log(yearArr);
      })
    },
    sum(arr){
      var sum = arr.reduce(function(arr, b) { return arr + b; }, 0);
      return sum
    }
  }
};
</script>
