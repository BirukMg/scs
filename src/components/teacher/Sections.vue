<template>
  <v-app>
    <v-toolbar flat color="white">
      <v-toolbar-title>Students</v-toolbar-title>
      <v-divider
        class="mx-2"
        inset
        vertical
      ></v-divider>
      <v-spacer></v-spacer>
      <v-flex xs12 sm6 d-flex class="select-section">
        <v-select :items="selectSection" label="Sections" v-model="sectionvalue" class="select-section-each"></v-select>
        <v-select :items="selectLevel" label="Level" v-model="levelvalue" class="select-section-each"></v-select>
        <span @click="getStudents" class="search-student"><v-icon small class="mr-2" color="blue darken-2">search</v-icon> Search</span>
      </v-flex>
    </v-toolbar>
    <v-data-table
      :headers="headers"
      :items="students"
      class="elevation-1"
    >
      <template slot="items" slot-scope="props">
        <td class="text-xs-left">{{ props.item.student_id }}</td>
        <td class="text-xs-left">{{ props.item.full_name }}</td>
        <td class="text-xs-left">{{ props.item.level }}</td>
        <td class="text-xs-left">{{ props.item.section }}</td>
        <td class="text-xs-left layout px-0">
          <span @click="editItem(props.item)"><mdb-icon icon="star" size="2x" class="action action-edit"/></span>
        </td>
      </template>
    </v-data-table>
    <mdb-modal v-if="scoreModal" @close="scoreModal = false">
      <mdb-modal-header>
        <mdb-modal-title>Add student</mdb-modal-title>
      </mdb-modal-header>
      <mdb-modal-body style="padding: 50px;">
        <mdb-row>
          <mdb-col sm="8">
            <v-select :items="selectSemister" label="Semister" v-model="semistervalue" class="select-section-each"></v-select>
          </mdb-col>
        </mdb-row>
          <v-flex xs12>
            <v-subheader color="black" class="pl-0">Homework</v-subheader>
            <v-slider v-model="activity.homework" thumb-label="always"></v-slider>
          </v-flex>
          <v-flex xs12>
            <v-subheader color="black" class="pl-0">Classwork</v-subheader>
            <v-slider v-model="activity.classwork" thumb-label="always"></v-slider>
          </v-flex>
          <v-flex xs12>
            <v-subheader color="black" class="pl-0">Assignment</v-subheader>
            <v-slider v-model="activity.assignment" thumb-label="always"></v-slider>
          </v-flex>
          <v-flex xs12>
            <v-subheader color="black" class="pl-0">Participation</v-subheader>
            <v-slider v-model="activity.participation" thumb-label="always"></v-slider>
          </v-flex>
          <v-flex xs12>
            <v-subheader color="black" class="pl-0">Condact</v-subheader>
            <v-slider v-model="activity.conduct" thumb-label="always"></v-slider>
          </v-flex>
      </mdb-modal-body>
      <mdb-modal-footer>
        <mdb-btn color="primary" outline="success" size="sm" @click="score">Save</mdb-btn>
      </mdb-modal-footer>
    </mdb-modal>
  </v-app>
</template>
<script>
  import ethiopianDate from 'ethiopian-date'
  import axios from 'axios'
  import {mdbBtn,mdbIcon,mdbListGroup, mdbListGroupItem,Badge,mdbModal, mdbModalHeader, mdbModalTitle, mdbModalBody, mdbModalFooter,mdbRow,mdbCol,mdbInput, mdbCard, mdbCardBody, mdbCardTitle, mdbCardText,mdbCardHeader} from 'mdbvue'
  export default {
    components:{
      mdbBtn,
      mdbIcon,
      mdbListGroup,
      mdbListGroupItem,Badge,mdbModal, mdbModalHeader, mdbModalTitle, mdbModalBody, mdbModalFooter,mdbRow,mdbCol,mdbInput, mdbCard, mdbCardBody, mdbCardTitle, mdbCardText,mdbCardHeader
    },
    data: () => ({
      scoreModal: false,
      headers: [
        {text: 'ID #',align: 'left',value: 'id'},
        { text: 'Full name',align: 'left', value: 'name' },
        { text: 'Level',  align: 'left',value: 'level' },
        { text: 'Section',  align: 'left',value: 'emergency_call' },
        { text: 'Actions',sortable: false,  align: 'left'},

      ],
      students: [],
      selectSection: [],
      selectSemister: [1,2],
      selectLevel: [],
      sectionvalue: "",
      semistervalue:"",
      levelvalue: "",
      editedIte:{
        a:100
      },
      editedIndex: -1,
      activity: {
        homework: 0,
        classwork: 0,
        assignment: 0,
        participation: 0,
        conduct: 0,
      },
      defaultItem: {
        homework: 0,
        classwork: 0,
        assignment: 0,
        participation: 0,
        conduct: 0,
      }
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Add Activity' : 'Add Activity'
      }
    },

    watch: {
      dialog (val) {
        val || this.close()
      }
    },

    created () {
      this.getSections()
    },

    methods: {
      initialize () {
        axios.get("http://"+ this.$store.state.serverIp +":3000/api/students")
        .then(res => {
          console.log(res.data);
          this.students = res.data;
        }).catch(err => console.log(err))
      },
      getSections(){
        let filter = {
          where: {
            login_id : this.$store.state.users + "_id"
          }
        }
        axios.get("http://"+ this.$store.state.serverIp +":3000/api/teachers?filter="+ JSON.stringify(filter))
        .then(res => {
          console.log(res);
          this.selectSection = res.data[0].section
          this.selectLevel = res.data[0].level
        }).catch(err => console.log(err))
      },

      editItem (item) {
        this.editedIndex = this.students.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.scoreModal = true
        console.log(this.editedItem.student_id)
      },

      score(){
        var activityData = {
           year: new Date().getMonth() >= 9 ? new Date().getFullYear() - 7 : new Date().getFullYear() - 8,
           semister : this.semistervalue,
           homework : this.activity.homework,
           classwork : this.activity.classwork,
           assignment: this.activity.assignment,
           participation:this.activity.participation,
           conduct: this.activity.conduct,
           studentId: this.students[0].id + "_id",
           student_uniqueid: this.editedItem.student_id,
           teacherId: this.$store.state.token.userId
        }
        console.log(activityData);
        console.log(this.students[0].id);
        axios.post("http://"+ this.$store.state.serverIp +":3000/api/classActivities",activityData)
        .then(res => {
          this.scoreModal = false
        }).catch(err => console.log(err))
      },

      deleteItem (item) {
        const index = this.students.indexOf(item)
        const id = item.id
        const user = item.login_id
        let filter = {
          where: {
            userId:user
          }
        }
        axios.delete('http://'+ this.$store.state.serverIp +':3000/api/students/'+item.id)
        .then(() => this.students.splice(index, 1))
        .catch(err => console.log(err))

        axios.get("http://"+ this.$store.state.serverIp +":3000/api/roles?filter="+ JSON.stringify(filter))
        .then(res => {
          axios.delete('http://'+ this.$store.state.serverIp +':3000/api/roles/'+res.data[0].id)
          .then(() => console.log("role deleted"))
          .catch(err => console.log(err))
        })

        axios.delete('http://'+ this.$store.state.serverIp +':3000/api/logins/'+user)
        .then(() => console.log("login deleted"))
        .catch(err => console.log(err))
      },

      close () {
        this.dialog = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
      },
      getStudents:function() {
        let filter = {
          where: {
            section: this.sectionvalue,
            level: this.levelvalue
          }
        }
        axios.get("http://"+ this.$store.state.serverIp +":3000/api/students?filter="+ JSON.stringify(filter))
        .then(res => {
          this.students = res.data;
          console.log(res);
        }).catch(err => console.log(err))
      },
      randomPassword: function(){
        var dafaultPassword = "";
        var possiblePassword = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890!@#$%^&*()}{><,.?}";

        for (var i = 0; i < 10; i++)
          dafaultPassword += possiblePassword.charAt(Math.floor(Math.random() * possiblePassword.length));
        return dafaultPassword;
      },
      sidGenerater: function(){
        var sidNum = "";
        var batch = (new Date()).getFullYear() - 7 +"";
        var number = "1234567890";

        for (var i = 0; i < 4; i++)
          sidNum += number.charAt(Math.floor(Math.random() * number.length));
        let sid = "some/" + sidNum + "/" + batch.substring(2,4);
        return sid;
      },
      tempo: function(){
        var dafaultPassword = "";
        var possiblePassword = "1234567890";

        for (var i = 0; i < 3; i++)
          dafaultPassword += possiblePassword.charAt(Math.floor(Math.random() * possiblePassword.length));
        var tem = "willcheck" + dafaultPassword + "@office.com"
        return tem;
      },
    }
  }
</script>
<style scoped>
.select-section{
  margin: 20px 20px 0px 20px;
}
.select-section-each{
  margin-left: 10px;
}
.cardAc{
  z-index: 2;
}
.search-student{
  margin-top: 25px;
  cursor: pointer;
}


</style>
