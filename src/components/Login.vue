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
              <h4 class="subtext-header mt-2 mb-4"><strong>Welcome</strong></h4>
            </mdb-col>
            <mdb-col md="6" class="mb-4 white-text">
              <mdb-card>
                  <mdb-card-body class="login-content">
                    <v-snackbar v-model="msg.snackbar" :color="msg.color" :multi-line="msg.mode === 'multi-line'" :timeout="msg.timeout" :vertical="msg.mode === 'vertical'" :top = "true">
                        {{ msg.text }}
                        <v-btn dark flat @click="msg.snackbar = false">Close</v-btn>
                    </v-snackbar>
                    <h2 class="login-label text-center">Sign in</h2>
                    <div class="blue-text">
                      <mdb-input label="Username" icon="user" type="text" v-model="username"/>
                      <mdb-input label="Password" icon="lock" type="password" v-model="password"/>
                      <div class="text-center">
                        <mdb-btn size="sm" color="primary" @click="login"><mdb-icon icon="sign-in"/> Login</mdb-btn>
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
import axios from 'axios'
import { mdbContainer, mdbRow, mdbCol, mdbView, mdbMask, mdbInput, mdbBtn, mdbIcon,mdbCard, mdbCardImage, mdbCardBody, mdbCardTitle, mdbCardText} from 'mdbvue';

export default {
  name: 'Login',
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
      username : "admin",
      password : "1234"
    }
  },
	methods: {
	 	login: function () {

        if (this.username == "" && this.password == "") {
          this.msg.text = "Username and password required"
          this.msg.snackbar = true
          this.msg.color = "warning"
        }else if (this.username == "") {
          this.msg.text = "Username required"
          this.msg.snackbar = true
          this.msg.color = "warning"
        }else if (this.password == "") {
          this.msg.text = "Password required"
          this.msg.snackbar = true
          this.msg.color = "warning"
        }else {
          let username = this.username
          let password = this.password
          this.$store.dispatch('login', { username, password })
          .then(res => {
            let filter = {
              where: {
                userId: res.data.userId
              }
            }
            axios.get("http://"+ this.$store.state.serverIp +":3000/api/roles?filter="+ JSON.stringify(filter) + "&access_token=" + res.data.id)
            .then(roleres => {
              // console.log(roleres);
              let role = roleres.data[0].role;
              if (role == "SuperAdmin") {
                this.$router.push('/superAdmin')
              }else if (role == "SchoolAdmin") {
                this.$router.push('/schoolAdmin')
              }else if (role == "Club") {
                this.$router.push('/clubAdmin')
              }else if (role == "Teacher") {
                this.$router.push('/teacher')
              }else if (role == "Student") {
                this.$router.push('/student')
              }

              // console.log(roleres.data[0].role);
            }).catch(err => {
              console.log(err);
              alert("login faild")
            })
            // console.log(res.data.userId);
          })
          .catch(err => {
            this.msg.text = "Incorrect Username or Password"
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
