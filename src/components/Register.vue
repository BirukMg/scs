<template>
  <div class="background-page">
    <mdb-view>
      <video>
      </video>
      <mdb-mask class="d-flex justify-content-center align-items-center gradient">
        <mdb-container class="px-md-3 px-sm-0">
          <mdb-row>
            <mdb-col md="6" class="mb-4 white-text text-center">
              <router-link to="/"><h3 class="display-3 font-weight-bold mb-0 pt-md-5">SCS</h3></router-link>
              <h4 class="subtext-header mt-2 mb-4">Register your school and get students' best score</h4>
            </mdb-col>
            <mdb-col md="6" class="mb-4 white-text">
              <mdb-card>
                  <mdb-card-body class="login-content">
                    <v-snackbar v-model="msg.snackbar" :color="msg.color" :multi-line="msg.mode === 'multi-line'" :timeout="msg.timeout" :vertical="msg.mode === 'vertical'" :top = "true">
                        {{ msg.text }}
                        <v-btn dark flat @click="msg.snackbar = false">Close</v-btn>
                    </v-snackbar>
                    <h2 class="login-label text-center"><mdb-icon icon="home"/> Register</h2>
                    <div class="blue-text">
                      <mdb-input label="School name" icon="home" type="text" v-model="school.name"/>
                      <mdb-input label="Address" icon="address-card" type="text" v-model="school.address"/>
                      <mdb-input label="Level" icon="list" type="text" v-model="school.level"/>
                      <mdb-input label="Email" icon="envelope" type="text" v-model="school.email"/>
                      <div class="text-center">
                        <mdb-btn size="sm" color="primary" @click="sendRequest"><mdb-icon icon="send"/> Send</mdb-btn>
                      </div>
                    </div>
                  </mdb-card-body>
                </mdb-card>
            </mdb-col>
          </mdb-row>
        </mdb-container>
      </mdb-mask>
    </mdb-view>
  </div>
</template>

<script>
import axios from "axios"
import { mdbContainer, mdbRow, mdbCol, mdbView, mdbMask, mdbInput, mdbBtn, mdbIcon,mdbCard, mdbCardImage, mdbCardBody, mdbCardTitle, mdbCardText} from 'mdbvue';

export default {
  name: 'Register',
  components: {
    mdbContainer,
    mdbRow,
    mdbCol,
    mdbView,
    mdbMask,
    mdbInput,
    mdbBtn,
    mdbIcon,
    mdbCard,
    mdbCardImage,
    mdbCardBody,
    mdbCardTitle,
    mdbCardText
  },
  data(){
    return {
      msg:{
        snackbar: false,
        color: '',
        mode: '',
        timeout: 5000,
        text: ''
      },
      school: {
        name:"name",
        address: "address",
        level: "level",
        email: "email"
      }
    }
  },
  methods: {
      sendRequest: function () {
          if ( this.school.name == "" || this.school.address == "" || this.school.level == "" || this.school.email == "") {
            this.msg.text = "Some fildes are empty"
            this.msg.snackbar = true
            this.msg.color = "warning"
          }else {
            let data = {
                name: this.school.name,
                address: this.school.address,
                level: this.school.level,
                email: this.school.email
            }
            axios.post("http://"+ this.$store.state.serverIp +":3000/api/requests",data)
            .then(reqres => {
              this.msg.text = "Your requests is sent successfully"
              this.msg.snackbar = true
              this.msg.color = "success"
            }).catch(reqerr => {
              this.msg.text = "Something went wrong"
              this.msg.snackbar = true
              this.msg.color = "error"
            })
          }
      }
  }

};
</script>
<style scoped>

.background-page .gradient {
    background: #007bff;
}

.background-page .view video {
  top: 0!important;
  left: 0!important;
  transform: none!important;
  height: 100vh;
}

.background-page .navbar {
  transition: background .5s ease-in-out,padding .5s ease-in-out;
}

.top-nav-collapse {
  background-color: #563e91 !important;
}
.login-label{
  color: #212121;
}
.login-content{
  padding: 50px;
}

</style>
