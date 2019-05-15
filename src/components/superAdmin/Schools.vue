<template>
  <v-app>
    <v-toolbar flat color="white">
      <v-toolbar-title>Schools</v-toolbar-title>
      <v-divider
        class="mx-2"
        inset
        vertical
      ></v-divider>
      <v-spacer></v-spacer>
      <mdb-btn size="sm" color="primary" @click="addSchoolModal = true"><mdb-icon icon="plus" class="mr-1"/> New school</mdb-btn>
    </v-toolbar>
    <v-data-table
      :headers="headers"
      :items="schools"
      class="elevation-1"
    >
      <template slot="items" slot-scope="props">
        <td>{{ props.item.name }}</td>
        <td class="text-xs-left">{{ props.item.address }}</td>
        <td class="text-xs-left">{{ props.item.level }}</td>
        <td class="text-xs-left">{{ props.item.email }}</td>
        <td class="text-xs-left">{{ props.item.username }}</td>
        <td class="text-xs-left">{{ props.item.password }}</td>
        <td class="text-xs-left layout px-0">
          <span @click="editItem(props.item)"><mdb-icon icon="edit" size="3x" class="action action-edit"/></span>
          <span @click="deleteItem(props.item)"><mdb-icon icon="trash" size="3x" class="action action-delete"/></span>
          <!-- <v-icon medium class="mr-2" color="orange darken-2" @click="editItem(props.item)">edit</v-icon> -->
          <!-- <v-icon medium color="red darken-2" @click="deleteItem(props.item)">delete</v-icon> -->
        </td>
      </template>
    </v-data-table>
    <mdb-modal v-if="addSchoolModal" @close="addSchoolModal = false">
      <mdb-modal-header>
        <v-snackbar v-model="msg.snackbar" :color="msg.color" :multi-line="msg.mode === 'multi-line'" :timeout="msg.timeout" :vertical="msg.mode === 'vertical'" :top = "true">
            {{ msg.text }}
            <v-btn dark flat @click="msg.snackbar = false">Close</v-btn>
        </v-snackbar>
        <mdb-modal-title>Add school</mdb-modal-title>
      </mdb-modal-header>
      <mdb-modal-body>
        <mdb-input  v-model="addData.name" label="School name" />
        <mdb-input  v-model="addData.address" label="Address" />
        <mdb-input  v-model="addData.level" label="Level" />
        <!-- <mdb-input  v-model="addData.email" label="Email" /> -->
        <input type="text" class="form-control"v-model="addData.email" v-on:keyup = "checkEmail(addData.email)" placeholder="Email">
      </mdb-modal-body>
      <mdb-modal-footer>
        <mdb-btn color="primary" outline="success" size="sm" @click="addNewSchool">Save</mdb-btn>
      </mdb-modal-footer>
    </mdb-modal>


    <mdb-modal v-if="editSchoolModal" @close="editSchoolModal = false">
      <mdb-modal-header>
        <v-snackbar v-model="editeMsg.snackbar" :color="editeMsg.color" :multi-line="editeMsg.mode === 'multi-line'" :timeout="editeMsg.timeout" :vertical="editeMsg.mode === 'vertical'" :top = "true">
            {{ editeMsg.text }}
            <v-btn dark flat @click="editeMsg.snackbar = false">Close</v-btn>
        </v-snackbar>
        <mdb-modal-title>Edit school</mdb-modal-title>
      </mdb-modal-header>
      <mdb-modal-body>
        <mdb-input  v-model="editData.name" label="School name" />
        <mdb-input  v-model="editData.address" label="Address" />
        <mdb-input  v-model="editData.level" label="Level" />
        <mdb-input  v-model="editData.email" label="Email" />
        <!-- <mdb-input  v-model="editData.username" v-on:keyup = "checkUsername" label="Username"/> -->
        <input type="text" class="form-control" v-model="editData.username" v-on:keyup = "checkUsername(editData.username)" placeholder="Username">
        <mdb-input  v-model="editData.password" label="Password" />
      </mdb-modal-body>
      <mdb-modal-footer>
        <mdb-btn color="primary" outline="success" size="sm" @click="editSchool">Save changes</mdb-btn>
      </mdb-modal-footer>
    </mdb-modal>


    <mdb-modal size="sm" v-if="deleteSchoolModal" @close="deleteSchoolModal = false">
      <mdb-modal-header class="del-modal-header">
        <mdb-modal-title>Are you sure?</mdb-modal-title>
      </mdb-modal-header>
      <mdb-modal-body>
        <i class="fa fa-times fa-4x animated rotateIn" style="color:red"></i>
      </mdb-modal-body>
      <mdb-modal-footer>
        <mdb-btn color="primary" outline="danger" size="sm" @click="deleteSchool">Yes</mdb-btn>
        <mdb-btn color="danger" size="sm" @click="deleteSchoolModal = false">No</mdb-btn>
      </mdb-modal-footer>
    </mdb-modal>
  </v-app>
</template>
<script>
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
      msg:{
        snackbar: false,
        color: '',
        mode: '',
        timeout: 2000,
        text: ''
      },
      editeMsg:{
        snackbar: false,
        color: '',
        mode: '',
        timeout: 2000,
        text: ''
      },
      isExist: false,
      backup: {
        username: '',
        email: ''
      },
      addSchoolModal: false,
      editSchoolModal: false,
      deleteSchoolModal:false,
      deleteSchoolData:null,
      schoolId: "",
      check: false,
      headers: [
        {
          text: 'Name',
          align: 'left',
          value: 'name'
        },
        { text: 'Address',align: 'left', value: 'address' },
        { text: 'Level',  align: 'left',value: 'level' },
        { text: 'Email',  align: 'left',value: 'email' },
        { text: 'Username',  align: 'left',value: 'username' },
        { text: 'Password',  align: 'left',value: 'password' },
        { text: 'Actions', sortable: false, align: 'left'},

      ],
      schools: [],
      editedIndex: -1,
      addData: {
        name: '',
        address: '',
        level: '',
        email: ''
      },
      editData: {}
    }),
    created () {
      this.initialize()
    },

    methods: {
      initialize () {
        axios.get("http://"+ this.$store.state.serverIp +":3000/api/schools")
        .then(res => {
          this.schools = res.data;
        }).catch(err => console.log(err))
      },

      editItem (item) {
        this.schoolId = item.id
        this.backup.username = item.username
        this.backup.email = item.email
        this.editData = Object.assign({}, item)
        this.editSchoolModal = true
      },
      editSchool(){
        if(this.isEmpty(this.editData.name) && this.isEmpty(this.editData.address) && this.isEmpty(this.editData.level) && this.isEmpty(this.editData.email)){
          this.editeMsg.text = "Fileds must be filled"
          this.editeMsg.snackbar = true
          this.editeMsg.color = "warning"
        }else if (this.isEmpty(this.editData.name)) {
          this.editeMsg.text = "School name required"
          this.editeMsg.snackbar = true
          this.editeMsg.color = "warning"
        }else if (this.isEmpty(this.editData.address)) {
          this.editeMsg.text = "School address required"
          this.editeMsg.snackbar = true
          this.editeMsg.color = "warning"
        }else if (this.isEmpty(this.editData.level)) {
          this.editeMsg.text = "School level required"
          this.editeMsg.snackbar = true
          this.editeMsg.color = "warning"
        }else if (this.isEmpty(this.editData.email)) {
          this.editeMsg.text = "School email required"
          this.editeMsg.snackbar = true
          this.editeMsg.color = "warning"
        }else if (!this.validateEmail(this.editData.email)) {
          this.editeMsg.text = "Invalid email"
          this.editeMsg.snackbar = true
          this.editeMsg.color = "warning"
        }else if (this.isEmpty(this.editData.username)) {
          this.editeMsg.text = "Username required"
          this.editeMsg.snackbar = true
          this.editeMsg.color = "warning"
        }else if (this.isEmpty(this.editData.password)) {
          this.editeMsg.text = "Password required"
          this.editeMsg.snackbar = true
          this.editeMsg.color = "warning"
        }else if (this.isExist) {
          this.editeMsg.text = "Username is alredy taken"
          this.editeMsg.snackbar = true
          this.editeMsg.color = "warning"
        }else {
          var EditedSchoolData = {
            name : this.editData.name,
            address : this.editData.address,
            level : this.editData.level,
            email : this.editData.email,
            username : this.editData.username,
            password : this.editData.password
          }
          axios.patch("http://"+ this.$store.state.serverIp +":3000/api/schools/" + this.editData.id,EditedSchoolData)
          .then(res => {
              let loginId = res.data.adminId.substring(0,res.data.adminId.length-3)
              axios.patch("http://"+ this.$store.state.serverIp +":3000/api/logins/" + loginId, {username:EditedSchoolData.username,password: EditedSchoolData.password})
              .then(res => {
                this.initialize()
                this.editSchoolModal = false
              })
          })
        }
      },

      addNewSchool(){
        if(this.isEmpty(this.addData.name) && this.isEmpty(this.addData.address) && this.isEmpty(this.addData.level) && this.isEmpty(this.addData.email)){
          this.msg.text = "Fileds must be filled"
          this.msg.snackbar = true
          this.msg.color = "warning"
        }else if (this.isEmpty(this.addData.name)) {
          this.msg.text = "School name required"
          this.msg.snackbar = true
          this.msg.color = "warning"
        }else if (this.isEmpty(this.addData.address)) {
          this.msg.text = "School address required"
          this.msg.snackbar = true
          this.msg.color = "warning"
        }else if (this.isEmpty(this.addData.level)) {
          this.msg.text = "School level required"
          this.msg.snackbar = true
          this.msg.color = "warning"
        }else if (this.isEmpty(this.addData.email)) {
          this.msg.text = "School email required"
          this.msg.snackbar = true
          this.msg.color = "warning"
        }else if (!this.validateEmail(this.addData.email)) {
          this.msg.text = "Invalid email"
          this.msg.snackbar = true
          this.msg.color = "warning"
        }else if (this.isExist) {
          this.msg.text = "Email is alredy in use"
          this.msg.snackbar = true
          this.msg.color = "warning"
        }else {
          let filter = {
            where: {
              email : this.addData.email
            }
          }
          axios.get("http://"+ this.$store.state.serverIp +":3000/api/logins?filter="+ JSON.stringify(filter))
          .then(res => {
              var adminId = ""
              var schoolData = {
                 name : this.addData.name,
                 address : this.addData.address,
                 level : this.addData.level,
                 email : this.addData.email,
                 username : '',
                 password : this.randomPassword(),
                 adminId: ""
              }
              schoolData.username = schoolData.name.substring(0,4)+ this.randNum() + '@scs';
              let pass = this.randomPassword();
              axios.post("http://"+ this.$store.state.serverIp +":3000/api/logins",{username:schoolData.username,email:this.addData.email,password:schoolData.password})
              .then(logres => {
                schoolData.adminId = logres.data.id + "_id"
                axios.post('http://'+ this.$store.state.serverIp +':3000/api/roles',{role:"SchoolAdmin",userId:logres.data.id})
                .then(res => {
                  console.log(res);
                }).catch(err => console.log(err))
                console.log(this.addData.name);
                axios.post('http://'+ this.$store.state.serverIp +':3000/api/schools',schoolData)
                .then(schoolres => {
                  this.initialize()
                  this.msg.text = "School successfully added"
                  this.msg.snackbar = true
                  this.msg.color = "success"
                }).catch(err => console.log(err))
              })

          })
        }
      },
      deleteItem (item) {
        this.deleteSchoolModal = true
        this.deleteSchoolData = item
      },
      deleteSchool(){
        const id = this.deleteSchoolData.id
        const user = this.deleteSchoolData.adminId

        console.log(user);
        let filter = {
          where: {
            userId:user.substring(0,user.length-3)
          }
        }
        axios.delete('http://'+ this.$store.state.serverIp +':3000/api/schools/'+this.deleteSchoolData.id)
        .then(() => {
          this.initialize()
          this.deleteSchoolModal = false
        })
        .catch(err => console.log(err))

        axios.get("http://"+ this.$store.state.serverIp +":3000/api/roles?filter="+ JSON.stringify(filter))
        .then(res => {
          console.log(res);
          axios.delete('http://'+ this.$store.state.serverIp +':3000/api/roles/'+res.data[0].id)
          .then(() => console.log("role delted"))
          .catch(err => console.log(err))
        })
        axios.delete('http://'+ this.$store.state.serverIp +':3000/api/logins/'+ user.substring(0,user.length-3))
        .then(() => console.log(this.deleteSchoolData.adminId))
        .catch(err => console.log(err))
      },
      isEmpty(value){
        if (value == '') {
          return true
        }else {
          return false
        }
      },
      validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      },
      randomPassword: function(){
        var dafaultPassword = "";
        var possiblePassword = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890!@#$%^&*()}{><,.?}";

        for (var i = 0; i < 10; i++)
          dafaultPassword += possiblePassword.charAt(Math.floor(Math.random() * possiblePassword.length));
        return dafaultPassword;
      },
      checkUsername(username){
        let filter = {
          where: {
            username : username
          }
        }
        axios.get("http://"+ this.$store.state.serverIp +":3000/api/logins?filter="+ JSON.stringify(filter))
        .then(res => {
          if (res.data.length > 0) {
            if (res.data[0].username == this.backup.username) {
                this.isExist = false
            }else {
                this.isExist = true
            }
          }else {
            this.isExist = false
          }
        })
      },
      checkEmail(email){
        let filter = {
          where: {
            email : email
          }
        }
        axios.get("http://"+ this.$store.state.serverIp +":3000/api/logins?filter="+ JSON.stringify(filter))
        .then(res => {
          if (res.data.length > 0) {
            if (res.data[0].email == this.backup.email) {
                this.isExist = false
            }else {
                this.isExist = true
            }
          }else {
            this.isExist = false
          }
        })
      },
      randNum: function(){
        var rand_num = "";
        var possibleNum = "1234567890";

        for (var i = 0; i < 2; i++)
          rand_num += possibleNum.charAt(Math.floor(Math.random() * possibleNum.length));
        return rand_num;
      }
    }
  }
</script>
<style>
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
  .del-modal-header{
    background-color: red;
    color: white;
    font-weight: bold;
    padding-left: 35%;
  }
</style>
