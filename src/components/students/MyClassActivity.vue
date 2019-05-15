<template id="">
  <v-app class="main-body">
    <mdb-container>
    <mdb-row>
      <mdb-col col="4">
        <v-select :items="year" label="Year" v-model="yearValue"></v-select>
      </mdb-col>
      <mdb-col col="4">
        <v-select :items="semister" label="Semister" v-model="semisterValue"></v-select>
      </mdb-col>
      <mdb-col col="4">
        <div class="search-activity">
          <span @click="searchActivity()"><v-icon small class="mr-2" color="blue darken-2">search</v-icon> Search</span>
          <v-btn small @click="score" class="btn-all">All</v-btn>
        </div>
      </mdb-col>
    </mdb-row>
      <mdb-row>
        <mdb-col col="12">
        <h1>{{time}}</h1>
          <mdb-bar-chart v-if="isAll" :data="classActivityData" :options="classActivityOptions" :width="1000" :height="400"></mdb-bar-chart>
          <mdb-bar-chart v-if="isSelected" :data="selectedClassActivityData" :options="selectedClassActivityOptions" :width="1000" :height="400"></mdb-bar-chart>
        </mdb-col>
      </mdb-row>
    </mdb-container>
  </v-app>
</template>
<script>
  import axios from 'axios'
  import { mdbRow,mdbCol,mdbBarChart, mdbContainer } from 'mdbvue';
  export default{
    components: {
      mdbRow,
      mdbCol,
      mdbBarChart,
      mdbContainer
    },
    data(){
      return{
      yearValue : "",
      semisterValue : "",
      year: [2011,2012,2013],
      semister: [1,2],
      time:"",
        isAll: false,
        isSelected: false,
        classActivityData: {
          labels: ["Homework", "Classwork", "Assignment", "Participation", "Conduct"],
          datasets: [{
            label: 'Total class Activity',
            data: [],
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
        selectedClassActivityData: {
          labels: ["Homework", "Classwork", "Assignment", "Participation", "Conduct"],
          datasets: [{
            label: ' Selected year score',
            data: [],
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
        classActivityOptions: {
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
        },
        selectedClassActivityOptions: {
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
    mounted() {
      console.log('Nothing gets called before me!')
      this.score()
    },
    methods:{
      score(){
        this.isSelected = false
        var arr = []
        let filter = {
          where: {
            login_id: this.$store.state.users + "_id"
          }
        }

        axios.get('http://'+ this.$store.state.serverIp +':3000/api/students?filter='+ JSON.stringify(filter))
        .then(res => {
          let filterActivity = {
            where : {
              studentId: res.data[0].id + "_id"
            }
          }
          axios.get('http://'+ this.$store.state.serverIp +':3000/api/classActivities?filter='+ JSON.stringify(filterActivity))
          .then(res => {
            console.log(res);
              this.classActivityData.datasets[0].data = []
            for (var i = 0; i < res.data.length; i++) {
              arr.push(res.data[i].homework)
            }
            this.classActivityData.datasets[0].data.push(this.sum(arr)/res.data.length);
            arr = []
            for (var i = 0; i < res.data.length; i++) {
              arr.push(res.data[i].classwork)
            }
            this.classActivityData.datasets[0].data.push(this.sum(arr)/res.data.length);
            arr = []
            for (var i = 0; i < res.data.length; i++) {
              arr.push(res.data[i].assignment)
            }
            this.classActivityData.datasets[0].data.push(this.sum(arr)/res.data.length);
            arr = []
            for (var i = 0; i < res.data.length; i++) {
              arr.push(res.data[i].participation)
            }
            this.classActivityData.datasets[0].data.push(this.sum(arr)/res.data.length);
            arr = []
            for (var i = 0; i < res.data.length; i++) {
              arr.push(res.data[i].conduct)
            }
            this.classActivityData.datasets[0].data.push(this.sum(arr)/res.data.length);
            arr = []
            this.isAll = true
          })
        })
        axios.get('http://'+ this.$store.state.serverIp +':3000/api/classActivities?filter='+ JSON.stringify(filter))
        .then(res => {
          for (var i = 0; i < res.data.length; i++) {
            arr.push(res.data[i].homework)
          }
          this.classActivityData.datasets[0].data.push(this.sum(arr)/res.data.length);
          arr = []
          for (var i = 0; i < res.data.length; i++) {
            arr.push(res.data[i].classwork)
          }
          this.classActivityData.datasets[0].data.push(this.sum(arr)/res.data.length);
          arr = []
          for (var i = 0; i < res.data.length; i++) {
            arr.push(res.data[i].assignment)
          }
          this.classActivityData.datasets[0].data.push(this.sum(arr)/res.data.length);
          arr = []
          for (var i = 0; i < res.data.length; i++) {
            arr.push(res.data[i].participation)
          }
          this.classActivityData.datasets[0].data.push(this.sum(arr)/res.data.length);
          arr = []
          for (var i = 0; i < res.data.length; i++) {
            arr.push(res.data[i].conduct)
          }
          this.classActivityData.datasets[0].data.push(this.sum(arr)/res.data.length);
          arr = []
          this.isAll = true
        }).catch(err => console.log(err))
      },
      searchActivity(){
        this.isSelected = false
        this.isAll = false
        this.selectedClassActivityData.datasets[0].data = []

        let filterStudent = {
          where: {
            login_id: this.$store.state.users + "_id"
          }
        }
        axios.get('http://'+ this.$store.state.serverIp +':3000/api/students?filter='+ JSON.stringify(filterStudent))
        .then(res => {
          console.log(res.data[0].id + "_id");
          let filterClassActivity = {
            where: {
              studentId : res.data[0].id + "_id"
            }
          }
          if (this.yearValue != "") {
            filterClassActivity.where.year = this.yearValue
          }
          if (this.semisterValue != "") {
            filterClassActivity.where.semister = this.semisterValue
          }
          axios.get('http://'+ this.$store.state.serverIp +':3000/api/classActivities?filter='+ JSON.stringify(filterClassActivity))
          .then(res => {
            let arr = []
            for (var i = 0; i < res.data.length; i++) {
              arr.push(res.data[i].homework)
            }
            this.selectedClassActivityData.datasets[0].data.push(this.sum(arr)/res.data.length);
            arr = []
            for (var i = 0; i < res.data.length; i++) {
              arr.push(res.data[i].classwork)
            }
            this.selectedClassActivityData.datasets[0].data.push(this.sum(arr)/res.data.length);
            arr = []
            for (var i = 0; i < res.data.length; i++) {
              arr.push(res.data[i].assignment)
            }
            this.selectedClassActivityData.datasets[0].data.push(this.sum(arr)/res.data.length);
            arr = []
            for (var i = 0; i < res.data.length; i++) {
              arr.push(res.data[i].participation)
            }
            this.selectedClassActivityData.datasets[0].data.push(this.sum(arr)/res.data.length);
            arr = []
            for (var i = 0; i < res.data.length; i++) {
              arr.push(res.data[i].conduct)
            }
            this.selectedClassActivityData.datasets[0].data.push(this.sum(arr)/res.data.length);
            arr = []
            this.isAll = false
            this.isSelected = true
            console.log(this.selectedClassActivityData.datasets[0].data);
          })
        })
        if (this.yearValue != "") {
          filter.where.year = this.yearValue
        }
        if (this.semisterValue != "") {
          filter.where.semister = this.semisterValue
        }
        console.log(filter.where);
        axios.get('http://'+ this.$store.state.serverIp +':3000/api/classActivities?filter='+ JSON.stringify(filter))
        .then(res => {
          let arr = []
          for (var i = 0; i < res.data.length; i++) {
            arr.push(res.data[i].homework)
          }
          this.selectedClassActivityData.datasets[0].data.push(this.sum(arr)/res.data.length);
          arr = []
          for (var i = 0; i < res.data.length; i++) {
            arr.push(res.data[i].classwork)
          }
          this.selectedClassActivityData.datasets[0].data.push(this.sum(arr)/res.data.length);
          arr = []
          for (var i = 0; i < res.data.length; i++) {
            arr.push(res.data[i].assignment)
          }
          this.selectedClassActivityData.datasets[0].data.push(this.sum(arr)/res.data.length);
          arr = []
          for (var i = 0; i < res.data.length; i++) {
            arr.push(res.data[i].participation)
          }
          this.selectedClassActivityData.datasets[0].data.push(this.sum(arr)/res.data.length);
          arr = []
          for (var i = 0; i < res.data.length; i++) {
            arr.push(res.data[i].conduct)
          }
          this.selectedClassActivityData.datasets[0].data.push(this.sum(arr)/res.data.length);
          arr = []
          this.isAll = false
          this.isSelected = true
          console.log(this.selectedClassActivityData.datasets[0].data);
        })
      },
      sum(arr){
        var sum = arr.reduce(function(arr, b) { return arr + b; }, 0);
        return sum
      }
    },
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
