<template id="">
  <v-app>
     <mdbBtn color="primary" @click.native="showStudents = true">Add Member</mdbBtn>
    <modal size="fluid" v-if="showStudents" @close="showStudents = false" class="available-students">
      <modal-header>
        <modal-title>Available Students</modal-title>
        <v-snackbar v-model="msg.snackbar" :color="msg.color" :multi-line="msg.mode === 'multi-line'" :timeout="msg.timeout" :vertical="msg.mode === 'vertical'" :top = "true">
            {{ msg.text }}
            <v-btn dark flat @click="msg.snackbar = false">Close</v-btn>
          </v-snackbar>
      </modal-header>
      <modal-body class="available-students">

        <v-data-table
          :headers="headers"
          :items="students"
          class="elevation-1"
        >
          <template slot="items" slot-scope="props">
            <td class="text-xs-left">{{ props.item.student_id }}</td>
            <td class="text-xs-left">{{ props.item.full_name }}</td>
            <td class="text-xs-left">{{ props.item.address }}</td>
            <td class="text-xs-left">{{ props.item.emrgency_call }}</td>
            <td class="text-xs-left">{{ props.item.section }}</td>
            <td class="text-xs-left layout px-0">
              <span @click="addMember(props.item)"><mdb-icon icon="plus" size="3x" class="action action-edit" style="color: green"/></span>
            </td>
          </template>
        </v-data-table>

      </modal-body>
      <modal-footer>
        <mdbBtn color="secondary" size="sm" @click.native="showStudents = false">Close</mdbBtn>
      </modal-footer>
    </modal>
    <v-data-table
      :headers="Membersheaders"
      :items="studentsInClub"
      class="elevation-1"
    >
      <template slot="items" slot-scope="props">
        <td class="text-xs-left">{{ props.item.sid }}</td>
        <td class="text-xs-left">{{ props.item.fullname }}</td>
        <td class="text-xs-left">{{ props.item.activity }}</td>
        <td class="text-xs-left">{{ props.item.level }}</td>
        <td class="text-xs-left layout px-0">
          <span @click="view(props.item)"><mdb-icon icon="eye" size="3x" class="action action-edit" style="color: blue"/></span>
          <span @click="deleteItem(props.item)"><mdb-icon icon="trash" size="3x" class="action action-edit" style="color: red"/></span>
        </td>
      </template>
    </v-data-table>
    <modal size="md" v-if="score" @close="closeModal">
      <modal-header>
        <modal-title>Score</modal-title>
      </modal-header>
      <modal-body>
        <div  v-if="star">
          <strong><p>{{act}}</p></strong>
          <div class="form-inline">
            <v-slider v-model="num" thumb-color="blue" thumb-label="always" class="sld"></v-slider>
            <mdbBtn color="success" size="sm" @click="done">Done</mdbBtn>
          </div>
        </div>
        <div  v-for="(score , activity) in activities">
          <div class="form-inline">
              <v-subheader class="pl-0"><strong>{{activity}}: </strong></v-subheader>
              <v-icon small color="yellow darken-2" @click="up(activity,score)">star</v-icon>
          </div>
            <mdb-progress :value="score"><strong>{{score}} %</strong></mdb-progress>
        </div>
      </modal-body>
      <modal-footer>
        <mdbBtn color="secondary" size="sm" @click="closeModal">Close</mdbBtn>
      </modal-footer>
    </modal>
     <mdb-modal size="sm" v-if="deleteModal" @close="deleteModal = false">
      <mdb-modal-header class="del-modal-header">
        <mdb-modal-title>Are you sure?</mdb-modal-title>
      </mdb-modal-header>
      <mdb-modal-body>
        <i class="fa fa-times fa-4x animated rotateIn" style="color:red"></i>
      </mdb-modal-body>
      <mdb-modal-footer>
        <mdb-btn color="primary" outline="danger" size="sm" @click="deleteMember">Yes</mdb-btn>
        <mdb-btn color="danger" size="sm" @click="deleteModal = false">No</mdb-btn>
      </mdb-modal-footer>
    </mdb-modal>
  </v-app>
</template>

<script>
import axios from 'axios'
import {mdbProgress, Badge,Modal, ModalBody, ModalHeader, ModalFooter,ModalTitle,mdbBtn,mdbModal,mdbModalBody,mdbModalFooter,mdbModalHeader,mdbIcon,mdbModalTitle } from 'mdbvue';
export default {
name: 'ModalExamplesPage',
components: {
  mdbProgress,
  Badge,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  ModalTitle,
  mdbBtn,
  mdbModal,mdbModalBody,mdbModalFooter,mdbModalHeader,mdbIcon,mdbModalTitle
},
data() {
  return {
    deleteModal: false,
    msg:{
      snackbar: false,
      color: '',
      mode: '',
      timeout: 2000,
      text: ''
    },
    alert: true,
    switch1: true,
    showStudents: false,
    clubData: null,
    star: false,
    slider: 50,
    score:false,
    headers: [
      {text: 'ID #',align: 'left',value: 'id'},
      { text: 'Full name',align: 'left', value: 'name' },
      { text: 'Address',  align: 'left',value: 'address' },
      { text: 'Emergency call',  align: 'left',value: 'emergency_call' },
      { text: 'Section',  align: 'left',value: 'emergency_call' },
      { text: 'Actions',sortable: false,  align: 'left'},
    ],
    Membersheaders: [
      {text: 'ID #',align: 'left',value: 'id'},
      { text: 'Full name',align: 'left', value: 'name' },
      { text: 'Activity %',  align: 'left',value: 'activity' },
      { text: 'Level',  align: 'left',value: 'level' },
      { text: 'Actions',sortable: false,  align: 'left'},
    ],
    students: [],
    studentsInClub: [],
    activities:{},
    upActivity:{},
    num:50,
    act:"",
    sid:"",
    members:[],
    editedIndex: -1,
    editedItem: {
      student_id: "",
      full_name: "",
      address: "",
      emrgency_call: "",
      section:"",
      school_id: ""
    },
    defaultItem: {
      student_id: "",
      full_name: "",
      address: "",
      emrgency_call: "",
      section:"",
      school_id: ""
    },
    deleteData: {}
  }
},
created () {
  this.initialize()
},

methods: {
  initialize () {
    let filterClub = {
      where: {
        login_id: this.$store.state.users + "_id"
      }
    }
    axios.get("http://"+ this.$store.state.serverIp +":3000/api/clubs?filter="+ JSON.stringify(filterClub))
    .then(res => {
      this.clubData = res.data[0]
      console.log(this.clubData);
      let filterAvailableStudent = {
        where: {
          school_id: res.data[0].school_id
        }
      }
      axios.get("http://"+ this.$store.state.serverIp +":3000/api/students?filter="+ JSON.stringify(filterAvailableStudent))
      .then(res => {
        this.students = res.data;
      }).catch(err => console.log(err))
      let filterStudentsInClub = {
        where: {
          cid: res.data[0].id + "_id"
        }
      }
      axios.get("http://"+ this.$store.state.serverIp +":3000/api/cmems?filter="+ JSON.stringify(filterStudentsInClub))
      .then(res => {
        this.studentsInClub = res.data;
        for (var i = 0; i < this.studentsInClub.length; i++) {
          this.studentsInClub[i].activity = this.percentage(this.studentsInClub[i].activity);
        }
      }).catch(err => console.log(err))
    })
  },
  addMember(item){
    const index = this.students.indexOf(item)
    const id = item.id
    let filterExist = {
      where: {
        mid: item.id + "_" + this.clubData.id.substr(this.clubData.id.length - 10)
      }
    }
    axios.get("http://"+ this.$store.state.serverIp +":3000/api/cmems?filter="+ JSON.stringify(filterExist))
    .then(res => {
      if (res.data.length == 0) {
        let filter = {
          where: {
            id:item.id
          }
        }

        axios.get("http://"+ this.$store.state.serverIp +":3000/api/students?filter="+ JSON.stringify(filter))
        .then(res => {
          console.log(item.id);
          console.log(this.$store.state.token.userId);
          var membersData = {
            sid: res.data[0].student_id,
            cid: this.clubData.id + "_id",
            ccategory: this.clubData.category,
            fullname: res.data[0].full_name,
            activity: {},
            level: "7",
            mid: item.id + "_" + this.clubData.id.substr(this.clubData.id.length - 10)
          }
          let filterClub = {
            where: {
              id:this.clubData.id
            }
          }
          axios.get("http://"+ this.$store.state.serverIp +":3000/api/clubs?filter="+ JSON.stringify(filterClub))
          .then(res => {
            for (var i = 0; i < res.data[0].activities.length; i++) {
              membersData.activity[res.data[0].activities[i]] = 0
            }
            axios.post("http://"+ this.$store.state.serverIp +":3000/api/cmems",membersData)
            .then(res => {
              this.initialize()
              this.msg.text = "Member added successfully"
              this.msg.snackbar = true
              this.msg.color = "success"
              }).catch(err => console.log(err))
            }).catch(err => console.log(err))

        })
      }else{
        this.msg.text = "Member alredy exist"
        this.msg.snackbar = true
        this.msg.color = "warning"
      }
    })
  },
  deleteItem(item){
    this.deleteModal = true
    this.deleteData = Object.assign({}, item)
  },
  deleteMember(){
    let filterMem = {
      where: {
        mid: this.deleteData.mid
      }
    }
    axios.get("http://"+ this.$store.state.serverIp +":3000/api/cmems?filter="+ JSON.stringify(filterMem))
    .then(res => {
      axios.delete('http://'+ this.$store.state.serverIp +':3000/api/cmems/' + res.data[0].id)
      .then(res => {
        this.initialize()
        this.deleteModal = false
        console.log(res)
      })
    })
  },
  view(item){
    this.score = true
    let filterMembers = {
      where: {
        id:item.id
      }
    }
    axios.get("http://"+ this.$store.state.serverIp +":3000/api/cmems?filter="+ JSON.stringify(filterMembers))
    .then(res => {
      this.activities = res.data[0].activity
      this.sid = res.data[0].id
      // console.log(this.sid);
    })
  },
  up(a,s){
    this.star = true
    this.act = a;
    this.num = s;
  },
  done(){
    // this.num = this.s
    let filterActivity = {
      where: {
        id:this.sid
      }
    }
    axios.get("http://"+ this.$store.state.serverIp +":3000/api/cmems?filter="+ JSON.stringify(filterActivity))
    .then(res => {
      this.upActivity = res.data[0].activity
      delete this.upActivity[this.act]
      this.upActivity = Object.assign({[this.act]:this.num}, res.data[0].activity);
      axios.patch('http://'+ this.$store.state.serverIp +':3000/api/cmems/' + this.sid,{
        activity: this.upActivity
      })
      .then(response => {
        this.activities[this.act] = this.num
        this.initialize();
      })
      .catch(err => {
        console.log(err);
      });
    })

    this.star = false

  },
  percentage(obj){
    const value = []
    var sum,percent
    for(var propName in obj) {
        if(obj.hasOwnProperty(propName)) {
            var propValue = obj[propName];
            value.push(propValue)
        }
    }
    sum = value.reduce(function(value, b) { return value + b; }, 0);
    percent = sum/value.length
    return percent
  },
  closeModal(){
    this.score = false
    this.star = false
  }
}
}
</script>


<style scoped>
  .available-students{
    padding: 50px;
  }
  .swc{
    margin-top: 13px;
  }
  .sld{
    margin-top: 25px;
  }
</style>