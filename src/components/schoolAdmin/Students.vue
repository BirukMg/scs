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
      <mdb-btn size="sm" color="primary" @click="addStudentModal = true"><mdb-icon icon="plus" class="mr-1"/> New student</mdb-btn>
    </v-toolbar>
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
        <td class="text-xs-left">{{ props.item.level}}</td>
        <td class="text-xs-left">{{ props.item.password }}</td>
        <td class="text-xs-left layout px-0">
          <span @click="editItem(props.item)"><mdb-icon icon="edit" size="3x" class="action action-edit"/></span>
          <span @click="deleteItem(props.item)"><mdb-icon icon="trash" size="3x" class="action action-delete"/></span>
          <span @click="transfer(props.item)"><mdb-icon icon="location-arrow" size="3x" class="action action-transfer"/></span>
        </td>
      </template>
    </v-data-table>

    <div class="" style="margin-top: 20px;">
      <h1>Sent requests</h1>

      <v-data-table
        :headers="sentTransferStudentHeaders"
        :items="sentRequest"
        class="elevation-1"
      >
        <template slot="items" slot-scope="props">
          <td class="text-xs-left">{{ props.item.recieverName}}</td>
          <td class="text-xs-left">{{ props.item.studentId}}</td>
          <td class="text-xs-left">{{ props.item.name}}</td>
          <td class="text-xs-left">{{ props.item.level}}</td>
          <td class="text-xs-left layout px-0">
            <h4><mdb-badge :color="props.item.status.color" style="margin-top: 10px;">{{props.item.status.msg}}</mdb-badge></h4>
            <span @click="removeTrans(props.item)"><mdb-icon icon="times" size="2x" class="action action-delete"/></span>
          </td>
        </template>
      </v-data-table>
    </div>

    <div class="" style="margin-top: 20px;">
      <h1>New student requests</h1>

      <v-data-table
        :headers="transferStudentHeaders"
        :items="requestedStudent"
        class="elevation-1"
      >
        <template slot="items" slot-scope="props">
          <td class="text-xs-left">{{ props.item.senderName}}</td>
          <td class="text-xs-left">{{ props.item.studentId}}</td>
          <td class="text-xs-left">{{ props.item.name}}</td>
          <td class="text-xs-left">{{ props.item.level}}</td>
          <td class="text-xs-left layout px-0">
            <span @click="accept(props.item)"><mdb-icon icon="check" size="2x" class="action action-done"/></span>
            <span @click="reject(props.item)"><mdb-icon icon="times" size="2x" class="action action-delete"/></span>
          </td>
        </template>
      </v-data-table>
    </div>

    <mdb-modal v-if="addStudentModal" @close="addStudentModal = false">
      <mdb-modal-header>
        <mdb-modal-title>Add student</mdb-modal-title>
      </mdb-modal-header>
      <mdb-modal-body>
        <mdb-input  v-model="addData.full_name" label="Student name" />
        <mdb-input  v-model="addData.address" label="Address" />
        <mdb-input  v-model="addData.emrgency_call" label="Emergency call" />
        <mdb-input  v-model="addData.section" label="Section" />
        <mdb-input  v-model="addData.level" label="Level" />
      </mdb-modal-body>
      <mdb-modal-footer>
        <mdb-btn color="primary" outline="success" size="sm" @click="addNewStudent">Save</mdb-btn>
      </mdb-modal-footer>
    </mdb-modal>


    <mdb-modal v-if="editStudentModal" @close="editStudentModal = false">
      <mdb-modal-header>
        <mdb-modal-title>Edit student</mdb-modal-title>
      </mdb-modal-header>
      <mdb-modal-body>
        <mdb-input  v-model="editData.full_name" label="Student name" />
        <mdb-input  v-model="editData.address" label="Address" />
        <mdb-input  v-model="editData.emrgency_call" label="Emergency call" />
        <mdb-input  v-model="editData.section" label="Section" />
        <mdb-input  v-model="editData.level" label="Level" />
        <mdb-input  v-model="editData.password" label="Password" />
      </mdb-modal-body>
      <mdb-modal-footer>
        <mdb-btn color="primary" outline="success" size="sm" @click="editStudent">Save changes</mdb-btn>
      </mdb-modal-footer>
    </mdb-modal>
    <mdb-modal size="fluid" v-if="transferModal" @close="transferModal = false">
        <mdb-modal-header>
            <mdb-modal-title>Available Schools</mdb-modal-title>
        </mdb-modal-header>
        <mdb-modal-body>
          <v-data-table
            :headers="transferHeaders"
            :items="schools"
            class="elevation-1"
          >
            <template slot="items" slot-scope="props">
              <td class="text-xs-left">{{ props.item.name}}</td>
              <td class="text-xs-left">{{ props.item.address}}</td>
              <td class="text-xs-left">{{ props.item.level}}</td>
              <td class="text-xs-left">{{ props.item.email}}</td>
              <td class="text-xs-left layout px-0">
                <span @click="send(props.item)" v-if="props.item.id != school_id"><mdb-icon icon="check" size="2x" class="action action-done"/></span>
              </td>
            </template>
          </v-data-table>
        </mdb-modal-body>
        <mdb-modal-footer>
            <mdb-btn color="secondary" size="sm" @click.native="transferModal = false">Close</mdb-btn>
            <mdb-btn color="primary" size="sm">Save changes</mdb-btn>
        </mdb-modal-footer>
    </mdb-modal>
  </div>

  </v-app>
</template>
<script>
  import axios from 'axios'
  import {mdbBtn,mdbIcon,mdbListGroup, mdbListGroupItem,Badge,mdbModal, mdbModalHeader, mdbModalTitle, mdbModalBody, mdbModalFooter,mdbRow,mdbCol,mdbInput, mdbCard, mdbCardBody, mdbCardTitle, mdbCardText,mdbCardHeader, mdbBadge} from 'mdbvue'
  export default {
    components:{
      mdbBtn,
      mdbIcon,
      mdbListGroup,
      mdbListGroupItem,Badge,mdbModal, mdbModalHeader, mdbModalTitle, mdbModalBody, mdbModalFooter,mdbRow,mdbCol,mdbInput, mdbCard, mdbCardBody, mdbCardTitle, mdbCardText,mdbCardHeader, mdbBadge
    },
    data: () => ({
      transferModal: false,
      addData:{
        full_name:'',
        address:'',
        emrgency_call: '',
        section:'',
        level:''
      },
      editData:{},
      schoolName: '',
      school: {},
      addStudentModal: false,
      editStudentModal: false,
      headers: [
        {text: 'ID #',align: 'left',value: 'id'},
        { text: 'Full name',align: 'left', value: 'name' },
        { text: 'Address',  align: 'left',value: 'address' },
        { text: 'Emergency call',  align: 'left',value: 'emergency_call' },
        { text: 'Section',  align: 'left',value: 'section' },
        { text: 'Level',  align: 'left',value: 'level' },
        { text: 'Password',  align: 'left',value: 'password' },
        { text: 'Actions',sortable: false,  align: 'left'},
      ],
      transferHeaders: [
        { text: 'Name',  align: 'left',value: 'name' },
        { text: 'Address',  align: 'left',value: 'address' },
        { text: 'Level',  align: 'left',value: 'level' },
        { text: 'Email',  align: 'left',value: 'email' },
        { text: 'Actions',sortable: false,  align: 'left'},
      ],
      sentTransferStudentHeaders: [
        { text: 'To',  align: 'left',value: 'school' },
        { text: 'Student ID',  align: 'left',value: 'student_id' },
        { text: 'Student Name',  align: 'left',value: 'student_name' },
        { text: 'Level',  align: 'left',value: 'level' },
        { text: 'Actions',sortable: false,  align: 'left'},
      ],
      transferStudentHeaders: [
        { text: 'From',  align: 'left',value: 'school' },
        { text: 'Student ID',  align: 'left',value: 'student_id' },
        { text: 'Student Name',  align: 'left',value: 'student_name' },
        { text: 'Level',  align: 'left',value: 'level' },
        { text: 'Actions',sortable: false,  align: 'left'},
      ],
      students: [],
      schools:[],
      requestedStudent:[],
      sentRequest:[],
      myData:{},
      school_id:'',
      editedIndex: -1,
      studentId: "",
      studentData: "",
      editedItem: {
        student_id: "",
        full_name: "",
        address: "",
        emrgency_call: "",
        section:"",
        level:"",
        school_id: ""
      },
      defaultItem: {
        student_id: "",
        full_name: "",
        address: "",
        emrgency_call: "",
        section:"",
        level: "",
        school_id: ""
      }
    }),
    created () {
      this.getSchools()
      this.initialize()
    },

    methods: {
      getSchools(){
        axios.get('http://'+ this.$store.state.serverIp +':3000/api/schools')
        .then(res => {
          this.schools = res.data
        })
      },
      initialize(){
        let filterMe = {
          where: {
            adminId : this.$store.state.users + "_id"
          }
        }
        axios.get("http://"+ this.$store.state.serverIp +":3000/api/schools?filter="+ JSON.stringify(filterMe))
        .then(res => {
          this.school_id = res.data[0].id;
          this.schoolName = res.data[0].name;
          let filterRequest = {
            where: {
              recieverId : res.data[0].id + "_tid"
            }
          }
          let filterSentRequest = {
            where: {
              senderId : res.data[0].id + "_id"
            }
          }
          let filterStudents = {
            where: {
              school_id: res.data[0].id + "_id"
            }
          }
          axios.get("http://"+ this.$store.state.serverIp +":3000/api/transfer_requests?filter="+ JSON.stringify(filterRequest))
          .then(res => {
            this.requestedStudent = res.data
          }).catch(err => console.log(err))
          axios.get("http://"+ this.$store.state.serverIp +":3000/api/transfer_requests?filter="+ JSON.stringify(filterSentRequest))
          .then(res => {
            this.sentRequest = res.data
          }).catch(err => console.log(err))
          axios.get("http://"+ this.$store.state.serverIp +":3000/api/students?filter="+ JSON.stringify(filterStudents))
          .then(res => {
            // console.log(res.data);
            this.students = res.data;
          }).catch(err => console.log(err))
        })
      },
      addNewStudent(){
        var loginId = ""
        let pass = this.randomPassword();
        var StudentData = {
           student_id : this.sidGenerater(),
           full_name : this.addData.full_name,
           address : this.addData.address,
           emrgency_call : this.addData.emrgency_call,
           school_id: this.school_id + "_id",
           section:this.addData.section,
           level: this.addData.level,
           startedYear: (new Date()).getFullYear() - 7,
           login_id: "",
           password: pass
        }
        let uname = StudentData.student_id;
        axios.post("http://"+ this.$store.state.serverIp +":3000/api/logins",{username:uname,email:this.tempo(),password:pass})
        .then(logres => {
          StudentData.login_id = logres.data.id + "_id"
          axios.post('http://'+ this.$store.state.serverIp +':3000/api/roles',{role:"Student",userId:logres.data.id})
          .then(res => {
          }).catch(err => console.log(err))
          axios.post('http://'+ this.$store.state.serverIp +':3000/api/students',StudentData)
          .then(schoolres => {
            this.initialize()
            this.students.push(this.editedItem)
          }).catch(err => console.log(err))
        })
      },

      editItem (item) {
        this.editedIndex = this.students.indexOf(item)
        this.editData = Object.assign({}, item)
        this.editStudentModal = true
      },

      editStudent(){
        var EditedStudentData = {
           full_name : this.editData.full_name,
           address : this.editData.address,
           emrgency_call : this.editData.emrgency_call,
           section:this.editData.section,
           level: this.editData.level,
           password: this.editData.password
        }
        axios.patch("http://"+ this.$store.state.serverIp +":3000/api/students/" + this.editData.id,EditedStudentData)
        .then(res => {
            let loginId = res.data.login_id.substring(0,res.data.login_id.length-3)
            axios.patch("http://"+ this.$store.state.serverIp +":3000/api/logins/" + loginId, {password: EditedStudentData.password})
            .then(res => {
              this.initialize()
              this.editStudentModal = false
            })
        })
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
      transfer(item){
        this.transferModal = true
        this.studentData = item
      },
      send(item){
        let transferRequestData = {
          senderId: this.studentData.school_id,
          senderName: this.schoolName,
          recieverName: item.name,
          recieverId: item.id + "_tid",
          studentId: this.studentData.student_id,
          sid: this.studentData.id,
          name: this.studentData.full_name,
          level: this.studentData.level,
          status: {msg: 'Pending',color: 'warning-color'}
        }
        axios.post('http://'+ this.$store.state.serverIp +':3000/api/transfer_requests',transferRequestData)
        .then(res => {
          this.initialize()
          console.log(res);
        })
      },
      accept(item){
        axios.patch("http://"+ this.$store.state.serverIp +":3000/api/students/" + item.sid,{school_id:this.school_id + "_id"})
        .then(res => {
          let status = {
            msg: 'Accepted',
            color: 'success-color'
          }
          axios.patch("http://"+ this.$store.state.serverIp +":3000/api/transfer_requests/" + item.id,{status: status})
          .then(res => {
            this.removeTrans(res.data)
          })
        })
      },
      reject(item){
        let status = {
          msg: 'Rejected',
          color: 'danger-color'
        }
        axios.patch("http://"+ this.$store.state.serverIp +":3000/api/transfer_requests/" + item.id,{status: status})
        .then(res => {
          console.log(res);
        })
      },
      removeTrans(item){
        // console.log()
        axios.delete('http://localhost:3000/api/transfer_requests/' + item.id)
        .then(res => {
          console.log(res)
          this.initialize()
        })

      },
      close () {
        this.dialog = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
      },

      save () {
        if (this.editedIndex > -1) {
          var EditedStudentData = {
             full_name : this.editedItem.full_name,
             address : this.editedItem.address,
             emrgency_call : this.editedItem.emrgency_call,
             section:this.editedItem.section,
             level: this.editedItem.level
          }
          axios.patch("http://"+ this.$store.state.serverIp +":3000/api/students/" + this.studentId, EditedStudentData)
          .then(res => {
            console.log(res);
          })
          Object.assign(this.students[this.editedIndex], this.editedItem)
        } else {
          
        }
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
        return this.schoolName.substring(0,4) + "-" + sidNum + "-" + batch.substring(2,4);
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
<style media="screen">
.action:hover{
  cursor: pointer;
}
.action{
  margin: 5px 0px 0px 15px
}
.action-edit{
  color: orange;
}
.action-delete{
  color: red;
}
.action-transfer{
  color: blue;
}
.action-done{
  color: green
}
</style>
