<template id="">
  <div class="main-body">
    <mdb-container>
    <mdb-row>
      <mdb-col col="3"></mdb-col>
      <mdb-col col="6">
        <select class="browser-default custom-select" @change="searchActivity" v-model="clubValue">
          <option v-for="club in clubs" :key="club">{{club}}</option>
        </select>
      </mdb-col>
      <mdb-col col="3"></mdb-col>
    </mdb-row>
      <mdb-row>

        <mdb-col col="12">
        <h1>{{clubActivityData.datasets.data}}</h1>
          <mdb-bar-chart v-if="is" :data="clubActivityData" :options="clubActivityOptions" :width="1000" :height="400"></mdb-bar-chart>
        </mdb-col>

      </mdb-row>
      <mdb-row>
        <mdb-col sm="4" v-for="(value,key) in category[0]">
          <mdb-container>
            <h3><mdb-badge color="default-color">{{key}}</mdb-badge></h3>
            <mdb-progress :value="value" style="background-color: #ccc"><strong>{{value}} %</strong></mdb-progress>
          </mdb-container>
        </mdb-col>
      </mdb-row>

      <mdb-row>
        <mdb-line-chart :data="totalScoreData" :options="totolScoreOptions" :width="1000" :height="500"></mdb-line-chart>
      </mdb-row>
    </mdb-container>
  </div>
</template>
<script>
  import axios from 'axios'
  import { mdbRow,mdbCol,mdbBarChart, mdbContainer,mdbProgress,mdbBadge, mdbLineChart } from 'mdbvue';
  export default{
    name: 'clubActivity',
    components: {
      mdbRow,
      mdbCol,
      mdbBarChart,
      mdbContainer,mdbProgress,mdbBadge, mdbLineChart
    },
    data(){
      return{
      category: [],
      clubValue : "",
      clubs: [],
      cid: {},
      sid:"",
      clubName:"",
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
      },
        is: false,
        clubActivityData: {
          labels: [],
          datasets: [{
            label: 'Total Score',
            data: [20],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
              'rgba(255,99,132,1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1,
          }]
        },
        clubActivityOptions: {
          responsive: false,
          maintainAspectRatio: false,
          scales: {
            xAxes: [{
              barPercentage: 1,
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
      }
    },
    methods:{
      initialize(){
        let filterClub = {
            where : {
              sid: this.$route.params.student_id
            }
          }
          axios.get("http://"+ this.$store.state.serverIp +":3000/api/cmems?filter="+ JSON.stringify(filterClub))
          .then(res => {
            for (var i = 0; i < res.data.length; i++) {
              let filterClubName = {
                where : {
                  id: res.data[i].cid.substring(0,24)
                }
              }
              axios.get("http://"+ this.$store.state.serverIp +":3000/api/clubs?filter="+ JSON.stringify(filterClubName))
              .then(res => {
                this.clubs.push(res.data[0].name)
                console.log(this.clubs)
                this.cid[res.data[0].name] = res.data[0].id
              })
            }
          })
      },
      searchActivity(){
        this.is = false
        this.clubActivityData.labels = []
        this.clubActivityData.datasets[0].data = []
        let arr = []
        let filterClubActivity = {
          where : {
            sid: this.$route.params.student_id,
            cid: this.cid[this.clubValue] + "_id"
          }
        }
        axios.get("http://"+ this.$store.state.serverIp +":3000/api/cmems?filter="+ JSON.stringify(filterClubActivity))
        .then(res => {
          console.log(res)
          for (var actName in res.data[0].activity) {
            this.clubActivityData.labels.push(actName)
            this.clubActivityData.datasets[0].data.push(res.data[0].activity[actName])
          }
          this.is = true
        })
      },
      sum(arr){
        var sum = arr.reduce(function(arr, b) { return arr + b; }, 0);
        return sum
      },some(){
        axios.get('http://"+ this.$store.state.serverIp +":3000/api/categories')
        .then(categoryRes => {
          var arry = []
          var obj = {}
          for (var i = 0; i < categoryRes.data[0].category.length; i++) {
            let filterActivity = {
              where : {
                sid: this.$route.params.student_id,
                ccategory: categoryRes.data[0].category[i]
              }
            }
            axios.get("http://"+ this.$store.state.serverIp +":3000/api/cmems?filter="+ JSON.stringify(filterActivity))
            .then(cmemRes => {
              arry = []
                if (cmemRes.data.length != 0) {
                  for (var i = 0; i < cmemRes.data.length; i++) {
                    for (var variable in cmemRes.data[i].activity) {
                      if (cmemRes.data[i].activity.hasOwnProperty(variable)) {
                        arry.push(cmemRes.data[i].activity[variable])
                      }
                    }
                    obj[cmemRes.data[i].ccategory] = this.sum(arry)/arry.length
                  }
              }
              this.category.push(obj)
            })
          }
        })
      },
      totalClassActivity(){
      let filterStudent = {
        where: {
          student_id: this.$route.params.student_id
        }
      }
      axios.get("http://"+ this.$store.state.serverIp +":3000/api/students?filter="+ JSON.stringify(filterStudent))
      .then(res => {
        let yearArr = []
        for (var i = res.data[0].startedYear; i <= (new Date()).getFullYear() - 7; i++) {
          this.totalScoreData.labels.push(i)
          let filterTotalSore = {
            where: {
              student_uniqueid: this.$route.params.student_id,
              year: i
            }
          }
          axios.get("http://"+ this.$store.state.serverIp +":3000/api/classActivities?filter="+ JSON.stringify(filterTotalSore))
          .then(res => {
            console.log(res)
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
              // console.log(cool);
            }
            // console.log(yearArr);
            this.totalScoreData.datasets[0].data.push(this.sum(yearArr)/2)
            console.log(this.totalScoreData.datasets[0].data);
          })
        }
        console.log(yearArr);
      })
    }
    },
    created:function(){
      this.initialize()
      this.some()
      this.totalClassActivity()
    }
  }
</script>
<style scoped>
.search-activity{
  margin-top: 25px;
  margin-left: -100px;
  cursor: pointer;
}
.btn-all{
  margin-top: -5px;
}
</style>
