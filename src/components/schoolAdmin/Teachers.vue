<template>
  <v-app>
    <v-toolbar flat color="white">
      <v-toolbar-title>Teachers</v-toolbar-title>
      <!-- {{idd}} -->
      <v-divider
        class="mx-2"
        inset
        vertical
      ></v-divider>
      <v-spacer></v-spacer>
      <mdb-btn size="sm" color="primary" @click="addTeacherModal = true"><mdb-icon icon="plus" class="mr-1"/> New teacher</mdb-btn>
    </v-toolbar>
    <v-data-table
      :headers="headers"
      :items="teachers"
      class="elevation-1"
    >
      <template slot="items" slot-scope="props">
        <td class="text-xs-left">{{ props.item.full_name }}</td>
        <td class="text-xs-left">{{ props.item.address }}</td>
        <td class="text-xs-left">{{ props.item.subject }}</td>
        <td class="text-xs-left">{{ props.item.section }}</td>
        <td class="text-xs-left">{{ props.item.level }}</td>
        <td class="text-xs-left">{{ props.item.username }}</td>
        <td class="text-xs-left">{{ props.item.password }}</td>
        <td class="text-xs-left layout px-0">
          <span @click="editItem(props.item)"><mdb-icon icon="edit" size="3x" class="action action-edit"/></span>
          <span @click="deleteItem(props.item)"><mdb-icon icon="trash" size="3x" class="action action-delete"/></span>
          <!-- <v-icon medium class="mr-2" color="orange darken-2" @click="editItem(props.item)">edit</v-icon>
          <v-icon medium color="red darken-2" @click="deleteItem(props.item)">delete</v-icon> -->
        </td>
      </template>
    </v-data-table>

    <modal size="fluid" v-if="addTeacherModal" @close="addTeacherModal = false">
      <modal-header>
        <modal-title>Add teacher</modal-title>
        <v-snackbar v-model="msg.snackbar" :color="msg.color" :multi-line="msg.mode === 'multi-line'" :timeout="msg.timeout" :vertical="msg.mode === 'vertical'" :top = "true">
            {{ msg.text }}
            <v-btn dark flat @click="msg.snackbar = false">Close</v-btn>
        </v-snackbar>
      </modal-header>
      <modal-body>
        <mdb-row>
          <mdb-col col="3">
            <mdb-input  v-model="addData.full_name" label="Teacher name" />
            <mdb-input  v-model="addData.address" label="Address" />
          </mdb-col>
          <mdb-col col="3">
            <mdb-card style="width: 22rem;" class="text-center">
              <mdb-card-header color="primary-color">Subject</mdb-card-header>
              <mdb-card-body>
                <mdb-list-group v-for="subject in addData.arr_subject">
                  <mdb-list-group-item> <span style="width: 30px;">{{subject}}</span> <span  @click="remove(subject,addData.arr_subject)"  class="remove-act"><mdb-icon icon="times"/></span>
                  </mdb-list-group-item>
                </mdb-list-group>
                <!-- <mdb-input type="text" label="Add new activity" @click="some"/> -->
                <div class="form-group">
                  <input type="text" v-model="addData.val_subject" class="form-control" v-on:keyup.enter="add(addData.arr_subject,addData.val_subject)" placeholder="Add subject, Hit enter">
                </div>
              </mdb-card-body>
            </mdb-card>
          </mdb-col>
          <mdb-col col="3">
            <mdb-card style="width: 22rem;" class="text-center">
              <mdb-card-header color="primary-color">Section</mdb-card-header>
              <mdb-card-body>
                <mdb-list-group v-for="section in addData.arr_section">
                  <mdb-list-group-item> <span style="width: 30px;">{{section}}</span> <span  @click="remove(section,addData.arr_section)"  class="remove-act"><mdb-icon icon="times"/></span>
                  </mdb-list-group-item>
                </mdb-list-group>
                <!-- <mdb-input type="text" label="Add new activity" @click="some"/> -->
                <div class="form-group">
                  <input type="text" v-model="addData.val_section" class="form-control" v-on:keyup.enter="add(addData.arr_section,addData.val_section)" placeholder="Add section, Hit enter">
                </div>
              </mdb-card-body>
            </mdb-card>
          </mdb-col>
          <mdb-col col="3">
            <mdb-card style="width: 22rem;" class="text-center">
              <mdb-card-header color="primary-color">Level</mdb-card-header>
              <mdb-card-body>
                <mdb-list-group v-for="level in addData.arr_level">
                  <mdb-list-group-item> <span style="width: 30px;">{{level}}</span> <span  @click="remove(level,addData.arr_level)"  class="remove-act"><mdb-icon icon="times"/></span>
                  </mdb-list-group-item>
                </mdb-list-group>
                <!-- <mdb-input type="text" label="Add new activity" @click="some"/> -->
                <div class="form-group">
                  <input type="text" v-model="addData.val_level" class="form-control" v-on:keyup.enter="add(addData.arr_level,addData.val_level)" placeholder="Add level, Hit enter">
                </div>
              </mdb-card-body>
            </mdb-card>
          </mdb-col>
      </mdb-row>
      </modal-body>
      <modal-footer>
        <mdb-btn color="primary" outline="success" size="sm" @click="addNewTeacher">Save</mdb-btn>
      </modal-footer>
    </modal>



    <modal size="fluid" v-if="editTeacherModal" @close="editTeacherModal = false">
      <modal-header>
        <modal-title>Edit teacher</modal-title>
        <v-snackbar v-model="editeMsg.snackbar" :color="editeMsg.color" :multi-line="editeMsg.mode === 'multi-line'" :timeout="editeMsg.timeout" :vertical="editeMsg.mode === 'vertical'" :top = "true">
            {{ editeMsg.text }}
            <v-btn dark flat @click="editeMsg.snackbar = false">Close</v-btn>
        </v-snackbar>
      </modal-header>
      <modal-body>
        <mdb-row>
          <mdb-col col="3">
            <mdb-input  v-model="editData.full_name" label="Teacher name" />
            <mdb-input  v-model="editData.address" label="Address" />
            <!-- <mdb-input  v-model="editData.username" label="Username" /> -->
            <input type="text" class="form-control" v-model="editData.username" v-on:keyup = "checkUsername(editData.username)" placeholder="Username">

            <mdb-input  v-model="editData.password" label="Password" />
          </mdb-col>
          <mdb-col col="3">
            <mdb-card style="width: 22rem;" class="text-center">
              <mdb-card-header color="primary-color">Subject</mdb-card-header>
              <mdb-card-body>
                <mdb-list-group v-for="subject in editData.subject">
                  <mdb-list-group-item> <span style="width: 30px;">{{subject}}</span> <span  @click="remove(subject,editData.subject)"  class="remove-act"><mdb-icon icon="times"/></span>
                  </mdb-list-group-item>
                </mdb-list-group>
                <!-- <mdb-input type="text" label="Add new activity" @click="some"/> -->
                <div class="form-group">
                  <input type="text" v-model="editedItem.subject" class="form-control" v-on:keyup.enter="add(editData.subject,editedItem.subject)" placeholder="Add subject, Hit enter">
                </div>
              </mdb-card-body>
            </mdb-card>
          </mdb-col>
          <mdb-col col="3">
            <mdb-card style="width: 22rem;" class="text-center">
              <mdb-card-header color="primary-color">Section</mdb-card-header>
              <mdb-card-body>
                <mdb-list-group v-for="section in editData.section">
                  <mdb-list-group-item> <span style="width: 30px;">{{section}}</span> <span  @click="remove(section,editData.section)"  class="remove-act"><mdb-icon icon="times"/></span>
                  </mdb-list-group-item>
                </mdb-list-group>
                <!-- <mdb-input type="text" label="Add new activity" @click="some"/> -->
                <div class="form-group">
                  <input type="text" v-model="editedItem.section" class="form-control" v-on:keyup.enter="add(editData.section,editedItem.section)" placeholder="Add section, Hit enter">
                </div>
              </mdb-card-body>
            </mdb-card>
          </mdb-col>
          <mdb-col col="3">
            <mdb-card style="width: 22rem;" class="text-center">
              <mdb-card-header color="primary-color">Level</mdb-card-header>
              <mdb-card-body>
                <mdb-list-group v-for="level in editData.level">
                  <mdb-list-group-item> <span style="width: 30px;">{{level}}</span> <span  @click="remove(level,editData.level)"  class="remove-act"><mdb-icon icon="times"/></span>
                  </mdb-list-group-item>
                </mdb-list-group>
                <!-- <mdb-input type="text" label="Add new activity" @click="some"/> -->
                <div class="form-group">
                  <input type="text" v-model="editedItem.level" class="form-control" v-on:keyup.enter="add(editData.level,editedItem.level)" placeholder="Add level, Hit enter">
                </div>
              </mdb-card-body>
            </mdb-card>
          </mdb-col>
      </mdb-row>
      </modal-body>
      <modal-footer>
        <mdb-btn color="primary" outline="success" size="sm" @click="editTeacher">Save changes</mdb-btn>
      </modal-footer>
    </modal>

    <modal size="sm" v-if="deleteSchoolModal" @close="deleteSchoolModal = false">
      <modal-header class="del-modal-header">
        <modal-title>Are you sure?</modal-title>
        <!-- <div class="modal-header d-flex justify-content-center">
         <p class="heading">Are you sure?</p>
        </div> -->
      </modal-header>
      <modal-body>
        <i class="fa fa-times fa-4x animated rotateIn" style="color:red"></i>
      </modal-body>
      <modal-footer>
        <mdb-btn color="primary" outline="danger" size="sm" @click="deleteSchool">Yes</mdb-btn>
        <mdb-btn color="danger" size="sm" @click="deleteSchoolModal = false">No</mdb-btn>
      </modal-footer>
    </modal>



  </v-app>
</template>
<script>
  import axios from 'axios'
  import {mdbBtn,mdbIcon,mdbListGroup, mdbListGroupItem,Badge,Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter,mdbRow,mdbCol,mdbInput, mdbCard, mdbCardBody, mdbCardTitle, mdbCardText,mdbCardHeader} from 'mdbvue'
  export default {
    components:{
      mdbBtn,
      mdbIcon,
      mdbListGroup,
      mdbListGroupItem,Badge,Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter,mdbRow,mdbCol,mdbInput, mdbCard, mdbCardBody, mdbCardTitle, mdbCardText,mdbCardHeader
    },
    data: () => ({
      deleteSchoolModal: false,
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
      addData: {
        arr_section: [],
        arr_subject: [],
        arr_level: [],
        val_subject: '',
        val_section: '',
        val_level: '',
        full_name: '',
        address: ''
      },
      editData: {},
      teacherId: '',
      school_id:'',
      addTeacherModal: false,
      editTeacherModal: false,
      headers: [
        {text: 'Full name',align: 'left',value: 'name'},
        { text: 'Address',align: 'left', value: 'address' },
        { text: 'subject',  align: 'left',value: 'subject' },
        { text: 'section',  align: 'left',value: 'section' },
        { text: 'Level',  align: 'left',value: 'level' },
        { text: 'Username',  align: 'left',value: 'username' },
        { text: 'Password',  align: 'left',value: 'password' },
        { text: 'Actions',sortable: false,  align: 'left'},
      ],
      teachers: [],
      subject: [],
      section: [],
      level: [],
      editedIndex: -1,
      editedItem: {
        subject:"",
        section: "",
        level: ""
      },
      teacherData: {
        full_name: "",
        address: "",
        subject: "",
        section: "",
        level: ""
      },
      deleteTeacherData:null
    }),
    created () {
      this.initialize()
    },

    methods: {
      initialize () {
        let filterSchool = {
          where: {
            adminId: this.$store.state.users + "_id"
          }
        }
        axios.get("http://"+ this.$store.state.serverIp +":3000/api/schools?filter="+ JSON.stringify(filterSchool))
        .then(res => {
          this.school_id = res.data[0].id;
          let filterTeachers = {
            where: {
              school_id: res.data[0].id + "_id"
            }
          }
          axios.get("http://"+ this.$store.state.serverIp +":3000/api/teachers?filter="+ JSON.stringify(filterTeachers))
          .then(res => {
            console.log(res.data);
            this.teachers = res.data;
            for (var i = 0; i < this.teachers.length; i++) {
              this.teachers[i].subject = this.teachers[i].subject.toString()
              this.teachers[i].section = this.teachers[i].section.toString()
              this.teachers[i].level = this.teachers[i].level.toString()
            }
          }).catch(err => console.log(err))
        })
      },

      editItem (item) {
        this.editedIndex = this.teachers.indexOf(item)
        this.editData = Object.assign({}, item)
        this.teacherId = item.id
        this.backup.username = item.username
        this.editTeacherModal = true
        this.editData.subject = this.editData.subject.split(",")
        this.editData.section = this.editData.section.split(",")
        this.editData.level = this.editData.level.split(",")
      },
      editTeacher(){
        if (this.isEmpty(this.editData.full_name) && this.isEmpty(this.editData.address)) {
          this.editeMsg.text = "Fileds must be filled"
          this.editeMsg.snackbar = true
          this.editeMsg.color = "warning"
        }else if (this.isEmpty(this.editData.full_name)) {
          this.editeMsg.text = "Teacher name is required"
          this.editeMsg.snackbar = true
          this.editeMsg.color = "warning"
        }else if (this.isEmpty(this.editData.address)) {
          this.editeMsg.text = "Teacher address is required"
          this.editeMsg.snackbar = true
          this.editeMsg.color = "warning"
        }else if (this.editData.subject.length == 0) {
          this.editeMsg.text = "Subject cannot be empty"
          this.editeMsg.snackbar = true
          this.editeMsg.color = "warning"
        }else if (this.editData.section.length == 0) {
          this.editeMsg.text = "Section cannot be empty"
          this.editeMsg.snackbar = true
          this.editeMsg.color = "warning"
        }else if (this.editData.level.length == 0) {
          this.editeMsg.text = "Level cannot be empty"
          this.editeMsg.snackbar = true
          this.editeMsg.color = "warning"
        }else if (this.isEmpty(this.editData.username)) {
          this.editeMsg.text = "Username is required"
          this.editeMsg.snackbar = true
          this.editeMsg.color = "warning"
        }else if (this.isEmpty(this.editData.password)) {
          this.editeMsg.text = "Password address is required"
          this.editeMsg.snackbar = true
          this.editeMsg.color = "warning"
        }else if (this.isExist) {
          this.editeMsg.text = "Username is alredy taken"
          this.editeMsg.snackbar = true
          this.editeMsg.color = "warning"
        }else {
          let editedTeacherData = {
            full_name: this.editData.full_name,
            address: this.editData.address,
            section: this.editData.section,
            subject: this.editData.subject,
            level: this.editData.level,
            username: this.editData.username,
            password: this.editData.password
          }
          axios.patch("http://"+ this.$store.state.serverIp +":3000/api/teachers/" + this.editData.id,editedTeacherData)
          .then(res => {
              let loginId = res.data.login_id.substring(0,res.data.login_id.length-3)
              axios.patch("http://"+ this.$store.state.serverIp +":3000/api/logins/" + loginId, {username: this.editData.username, password: this.editData.password})
              .then(res => {
                this.initialize()
                this.editTeacherModal = false
              })
          })
        }
      },
      deleteItem (item) {
        this.deleteSchoolModal = true
        this.deleteTeacherData = item
        console.log(this.deleteTeacherData);
      },
      deleteSchool(){
        const id = this.deleteTeacherData.id
        const user = this.deleteTeacherData.login_id
        let filter = {
          where: {
            userId:user.substring(0,user.length-3)
          }
        }
        axios.delete('http://'+ this.$store.state.serverIp +':3000/api/teachers/'+this.deleteTeacherData.id)
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
        .then(() => console.log(this.deleteTeacherData.login_id))
        .catch(err => console.log(err))
      },
      deleteItems (item) {
        const index = this.teachers.indexOf(item)
        const id = item.id
        const user = item.login_id
        let filter = {
          where: {
            userId:user
          }
        }
        axios.delete('http://'+ this.$store.state.serverIp +':3000/api/teachers/'+item.id)
        .then(() => this.teachers.splice(index, 1))
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
      addNewTeacher(){
        if (this.isEmpty(this.addData.full_name) && this.isEmpty(this.addData.address)) {
          this.msg.text = "Fileds must be filled"
          this.msg.snackbar = true
          this.msg.color = "warning"
        }else if (this.isEmpty(this.addData.full_name)) {
          this.msg.text = "Teacher name is required"
          this.msg.snackbar = true
          this.msg.color = "warning"
        }else if (this.isEmpty(this.addData.address)) {
          this.msg.text = "Teacher address is required"
          this.msg.snackbar = true
          this.msg.color = "warning"
        }else if (this.addData.arr_subject.length == 0) {
          this.msg.text = "Subject cannot be empty"
          this.msg.snackbar = true
          this.msg.color = "warning"
        }else if (this.addData.arr_section.length == 0) {
          this.msg.text = "Section cannot be empty"
          this.msg.snackbar = true
          this.msg.color = "warning"
        }else if (this.addData.arr_level.length == 0) {
          this.msg.text = "Level cannot be empty"
          this.msg.snackbar = true
          this.msg.color = "warning"
        }else {
          let uname = this.addData.full_name.substring(0,4) + '@scs';
          let pass = this.randomPassword();
          var loginId = ""
          var TeacherData = {
             full_name : this.addData.full_name,
             address : this.addData.address,
             subject: this.addData.arr_subject,
             section: this.addData.arr_section,
             level: this.addData.arr_level,
             login_id: "",
             school_id: this.school_id + "_id",
             username: uname,
             password: pass
          }
          axios.post("http://"+ this.$store.state.serverIp +":3000/api/logins",{username:uname,email:this.tempo(),password:pass})
          .then(logres => {
            TeacherData.login_id = logres.data.id +"_id"
            axios.post('http://'+ this.$store.state.serverIp +':3000/api/roles',{role:"Teacher",userId:logres.data.id})
            .then(res => {
              console.log(res);
            }).catch(err => console.log(err))
            axios.post('http://'+ this.$store.state.serverIp +':3000/api/teachers',TeacherData)
            .then(schoolres => {
              this.initialize()
              this.msg.text = "Teacher added successfully"
              this.msg.snackbar = true
              this.msg.color = "success"
            }).catch(err => console.log(err))
          })
        }
      },
      isEmpty(value){
        if (value == '') {
          return true
        }else {
          return false
        }
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
      addSuject: function() {
        this.subject.push(this.editedItem.subject)
      },
      addSection: function() {
        this.section.push(this.editedItem.section)
      },
      addLevel: function() {
        this.level.push(this.editedItem.level)
      },
      addArr(value,arr){
        arr.push(value)
      },
      removeArr(value,arr){
        arr.splice(arr.indexOf(value),1)
      },
      add(arry,newValue) {
        if (newValue == '') {
          return false
        }else {
          arry.push(newValue)
        }
      },
      remove(value,arr){
        arr.splice(arr.indexOf(value),1)
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
<style media="screen">
  .pointer:hover{
    cursor: pointer;
  }
  .remove-act{
    color: red;
    position: absolute;
    right: 20px;
  }
  .remove-act:hover{
    cursor: pointer;
  }
</style>
