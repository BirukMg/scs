<template id="">
  <div class="main-body">
    <mdb-container>
    <mdb-row>
      <mdb-col col="3"></mdb-col>
      <mdb-col col="6">
        <v-select :items="clubs" label="My clubs" v-model="clubValue"  @change="searchActivity"></v-select>
      </mdb-col>
      <mdb-col col="3"></mdb-col>
    </mdb-row>
      <mdb-row>
        <mdb-col col="12">
        <h1>{{clubActivityData.datasets.data}}</h1>
          <mdb-bar-chart v-if="is" :data="clubActivityData" :options="clubActivityOptions" :width="1000" :height="400"></mdb-bar-chart>
        </mdb-col>
      </mdb-row>
    </mdb-container>
  </div>
</template>
<script>
  import axios from 'axios'
  import { mdbRow,mdbCol,mdbBarChart, mdbContainer } from 'mdbvue';
  export default{
    name: 'clubActivity',
    components: {
      mdbRow,
      mdbCol,
      mdbBarChart,
      mdbContainer
    },
    data(){
      return{
      clubValue : "",
      clubs: [],
      cid: {},
      sid:"",
      clubName:"",
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
            login_id: this.$store.state.users + "_id"
          }
        }
        axios.get("http://"+ this.$store.state.serverIp +":3000/api/students?filter="+ JSON.stringify(filterClub))
        .then(res => {
          this.sid =  res.data[0].student_id
          let filterClub = {
            where : {
              sid: res.data[0].student_id
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
                this.cid[res.data[0].name] = res.data[0].id
              })
            }
          })
        })
      },
      searchActivity(){
        this.is = false
        this.clubActivityData.labels = []
        this.clubActivityData.datasets[0].data = []
        let arr = []
        let filterClubActivity = {
          where : {
            sid: this.sid,
            cid: this.cid[this.clubValue] + "_id"
          }
        }
        axios.get("http://"+ this.$store.state.serverIp +":3000/api/cmems?filter="+ JSON.stringify(filterClubActivity))
        .then(res => {
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
      }
    },
    created:function(){
      this.initialize()
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
