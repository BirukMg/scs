<template>
  <v-app>
    <v-toolbar flat color="white">
      <v-toolbar-title>Clubs</v-toolbar-title>
      <v-divider
        class="mx-2"
        inset
        vertical
      ></v-divider>
      <v-spacer></v-spacer>
      <mdb-btn size="sm" color="primary" @click="addClubsModal = true"><mdb-icon icon="plus" class="mr-1"/> New club</mdb-btn>
    </v-toolbar>
    <v-data-table
      :headers="headers"
      :items="clubs"
      class="elevation-1"
    >
      <template slot="items" slot-scope="props">
        <td class="text-xs-left">{{ props.item.name }}</td>
        <td class="text-xs-left">{{ props.item.activities }}</td>
        <td class="text-xs-left">{{ props.item.category }}</td>
        <td class="text-xs-left">{{ props.item.username }}</td>
        <td class="text-xs-left">{{ props.item.password }}</td>
        <td class="text-xs-left layout px-0">
          <span @click="editItem(props.item)"><mdb-icon icon="edit" size="3x" class="action action-edit"/></span>
          <span @click="deleteItem(props.item)"><mdb-icon icon="trash" size="3x" class="action action-delete"/></span>
          <!-- <v-icon medium class="mr-2" color="blue darken-2" @click="editItem(props.item)">visibility</v-icon> -->
          <!-- <v-icon medium class="mr-2" color="orange darken-2" @click="editItem(props.item)">edit</v-icon>
          <v-icon medium color="red darken-2" @click="deleteItem(props.item)">delete</v-icon> -->
        </td>
      </template>
    </v-data-table>
    <modal size="md" v-if="addClubsModal" @close="addClubsModal = false">
      <modal-header>
        <modal-title>Add club</modal-title>
        <v-snackbar v-model="msg.snackbar" :color="msg.color" :multi-line="msg.mode === 'multi-line'" :timeout="msg.timeout" :vertical="msg.mode === 'vertical'" :top = "true">
            {{ msg.text }}
            <v-btn dark flat @click="msg.snackbar = false">Close</v-btn>
        </v-snackbar>
      </modal-header>
      <modal-body>
        <mdb-row>
          <mdb-col col="6">
              <mdb-input type="text" label="Club name" v-model="clubData.name"/>
              <v-select :items="clubCategory" label="Category" v-model="clubData.category"></v-select>
          </mdb-col>
          <mdb-col col="6">
            <div style="margin-top: 30px;">
              <mdb-list-group v-for="act in clubData.activity">
                <mdb-list-group-item> <span style="width: 30px;">{{act}}</span> <span  @click="removeAct(act,clubData.activity)"  class="remove-act"><mdb-icon icon="times"/></span>
                </mdb-list-group-item>
              </mdb-list-group>
              <!-- <mdb-input type="text" label="Add new activity" @click="some"/> -->
              <div class="form-group">
                <input type="text" v-model="newActivity" class="form-control" v-on:keyup.enter="addActivity(clubData.activity,newActivity)" placeholder="Add new activity, Hit enter">
              </div>
            </div>
          </mdb-col>
      </mdb-row>
      </modal-body>
      <modal-footer>
        <mdb-btn color="primary" outline="success" size="sm" @click="addNewClub">Save</mdb-btn>
      </modal-footer>
    </modal>



    <modal size="md" v-if="editClubsModal" @close="editClubsModal = false">
      <modal-header>
        <modal-title>Edit club</modal-title>
      </modal-header>
      <modal-body>
        <mdb-row>
          <mdb-col col="6">
              <mdb-input type="text" label="Club name" v-model="editedItem.name"/>
              <v-select :items="clubCategory" label="Category" v-model="editedItem.category"></v-select>
              <mdb-input type="text" label="Username" v-model="editedItem.username"/>
              <mdb-input type="text" label="Password" v-model="editedItem.password"/>
          </mdb-col>
          <mdb-col col="6">
            <div style="margin-top: 30px;">
              <mdb-list-group v-for="act in editedItem.activities">
                <mdb-list-group-item> <span style="width: 30px;">{{act}}</span> <span  @click="removeAct(act,editedItem.activities)"  class="remove-act"><mdb-icon icon="times"/></span>
                </mdb-list-group-item>
              </mdb-list-group>
              <!-- <mdb-input type="text" label="Add new activity" @click="some"/> -->
              <div class="form-group">
                <input type="text" v-model="newActivityToEdit" class="form-control" v-on:keyup.enter="addActivity(editedItem.activities,newActivityToEdit)" placeholder="Add new activity, Hit enter">
              </div>
            </div>
          </mdb-col>
      </mdb-row>
      </modal-body>
      <modal-footer>
        <mdb-btn color="primary" outline="success" size="sm" @click="editClub">Save</mdb-btn>
      </modal-footer>
    </modal>

  </v-app>
</template>
<script>
  import axios from 'axios'
  import {mdbBtn,mdbIcon,mdbListGroup, mdbListGroupItem,Badge,Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter,mdbRow,mdbCol,mdbInput} from 'mdbvue'
  export default {
    components:{
      mdbBtn,
      mdbIcon,
      mdbListGroup,
      mdbListGroupItem,Badge,Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter,mdbRow,mdbCol,mdbInput
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
      clubId: '',
      school_id: '',
      clubData: {
        name: '',
        category: '',
        activity: []
      },
      // "Sport","Volentery","Entertaiment","Health"
      newActivity:  '',
      newActivityToEdit: '',
      clubCategory: [],
      dialog: false,
      addClubsModal: false,
      editClubsModal: false,
      headers: [
        {text: 'Name',align: 'left',value: 'name'},
        { text: 'Activities',align: 'left', value: 'activities'},
        { text: 'Category',align: 'left', value: 'category'},
        { text: 'Username',align: 'left', value: 'username'},
        { text: 'Password',align: 'left', value: 'password'},
        { text: 'Actions',sortable: false,  align: 'left'},

      ],
      clubs: [],
      activity: [],
      editedIndex: -1,
      editedItem: {
        name: "",
        activities: "",
        username:"",
        password:""
      },
      defaultItem: {
        name: "",
        activities: ""
      }
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
          this.school_id = res.data[0].id
          let filterClubs = {
            where: {
              school_id: res.data[0].id + "_id"
            }
          }
          axios.get("http://"+ this.$store.state.serverIp +":3000/api/clubs?filter="+ JSON.stringify(filterClubs))
          .then(res => {
            this.clubs = res.data;
            for (var i = 0; i < this.clubs.length; i++) {
              this.clubs[i].activities = this.clubs[i].activities.toString()
            }
          }).catch(err => console.log(err))
        })
        axios.get('http://'+ this.$store.state.serverIp +':3000/api/categories')
        .then(res => {
          this.clubCategory = res.data[0].category
        })
      },

      editItem (item) {
        this.editedIndex = this.clubs.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.editedItem.activities = this.editedItem.activities.split(",")
        this.editClubsModal = true
        this.clubId = item.id
      },
      editClub(){
        let editedClubData = {
          name: this.editedItem.name,
          category: this.editedItem.category,
          activities: this.editedItem.activities,
          username: this.editedItem.username,
          password: this.editedItem.password
        }
        axios.patch("http://"+ this.$store.state.serverIp +":3000/api/clubs/" + this.clubId,editedClubData)
        .then(res => {
            let loginId = res.data.login_id.substring(0,res.data.login_id.length-3)
            axios.patch("http://"+ this.$store.state.serverIp +":3000/api/logins/" + loginId, {username: editedClubData.username, password: editedClubData.password})
            .then(res => {
              // console.log(res);
            })
            this.initialize()
            this.editClubsModal = false
        })
      },

      deleteItem (item) {
        const index = this.clubs.indexOf(item)
        const id = item.id
        const user = item.login_id
        let filter = {
          where: {
            userId:user
          }
        }
        axios.delete('http://'+ this.$store.state.serverIp +':3000/api/clubs/'+item.id)
        .then(() => this.clubs.splice(index, 1))
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
      addNewClub(){
        if (this.isEmpty(this.clubData.name) && this.isEmpty(this.clubData.category)) {
          this.msg.text = "Fileds must be filled"
          this.msg.snackbar = true
          this.msg.color = "warning"
        }else if (this.isEmpty(this.clubData.name)) {
          this.msg.text = "Club name is required"
          this.msg.snackbar = true
          this.msg.color = "warning"
        }else if (this.isEmpty(this.clubData.category)) {
          this.msg.text = "Club category is required"
          this.msg.snackbar = true
          this.msg.color = "warning"
        }else if (this.clubData.activity.length == 0) {
          this.msg.text = "Club activity cannot be empty"
          this.msg.snackbar = true
          this.msg.color = "warning"
        }else {
          var loginId = ""
          let uname = this.clubData.name.substring(0,4) + '@scs';
          let pass = this.randomPassword();
          var clubData = {
             name : this.clubData.name,
             activities : this.clubData.activity,
             category: this.clubData.category,
             username: uname,
             password: pass,
             login_id: '',
             school_id: this.school_id + "_id"
          }

          axios.post("http://"+ this.$store.state.serverIp +":3000/api/logins",{username:uname,email:this.tempo(),password:pass})
          .then(logres => {
            clubData.login_id = logres.data.id + "_id"
            axios.post('http://'+ this.$store.state.serverIp +':3000/api/roles',{role:"Club",userId:logres.data.id})
            .then(res => {
              console.log(res);
            }).catch(err => console.log(err))
            axios.post('http://'+ this.$store.state.serverIp +':3000/api/clubs',clubData)
            .then(res => {
              this.initialize();
              this.msg.text = "Club added successfully"
              this.msg.snackbar = true
              this.msg.color = "success"
            }).catch(err => console.log(err))
          })
        }
      },
      randomPassword: function(){
        var dafaultPassword = "";
        var possiblePassword = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890!@#$%^&*()}{><,.?}";

        for (var i = 0; i < 10; i++)
          dafaultPassword += possiblePassword.charAt(Math.floor(Math.random() * possiblePassword.length));
        return dafaultPassword;
      },
      isEmpty(value){
        if (value == '') {
          return true
        }else {
          return false
        }
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
      addActivity(arry,newValue) {
        if (newValue == '') {
          return false
        }else {
          arry.push(newValue)
        }
        // console.log(newValue);
      },
      removeAct(value,arr){
        arr.splice(arr.indexOf(value),1)
      }
    }
  }
</script>
<style scoped>
.remove-act{
  color: red;
  position: absolute;
  right: 20px;
}
.remove-act:hover{
  cursor: pointer;
}
</style>
