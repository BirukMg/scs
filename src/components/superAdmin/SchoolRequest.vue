<template>
  <div>
    <mdb-container class="main">
      <mdb-row>
        <mdb-col xl="4" v-for="requestinfo in requestInfo" class="top">
          <mdb-card style="width: 22rem;">
            <mdb-card-header color="primary-color" tag="h3">{{requestinfo.name}}</mdb-card-header>
            <mdb-card-body>
              <mdb-card-text>School Address: {{requestinfo.address}}</mdb-card-text>
              <mdb-card-text>School Level: {{requestinfo.level}}</mdb-card-text>
              <mdb-card-text>School Email: {{requestinfo.email}}</mdb-card-text>
              <mdb-row>
                <mdb-col>
                  <mdb-btn size="sm" color="danger" v-on:click='deleteRequest(requestinfo.id)'>Remove</mdb-btn>
                  <mdb-btn size="sm" color="success" v-on:click='acceptRequest(requestinfo.id)'>Accept</mdb-btn>
                </mdb-col>
              </mdb-row>
          </mdb-card-body>
        </mdb-card>
      </mdb-col>
    </mdb-row>
  </mdb-container>
</div>
</template>
<script>
import axios from 'axios'
import {mdbCardBody,mdbBtn,mdbCardText,mdbCardTitle,mdbCardHeader,mdbCard,mdbContainer,mdbRow,mdbCol,Badge,mdbIcon,Navbar, NavbarItem, NavbarNav, NavbarCollapse, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, mdbInput, Btn, waves, mdbNavbarBrand } from 'mdbvue';

export default {
  name: 'NavigationPage',
  components: {
    mdbCardBody,mdbBtn,mdbCardText,mdbCardTitle,
    mdbCardHeader,
    mdbCard,
    mdbContainer,
    mdbRow,
    mdbCol,
    Badge,
    mdbIcon,
    Navbar,
    NavbarItem,
    NavbarNav,
    NavbarCollapse,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    mdbInput,
    Btn,
    waves,
    mdbNavbarBrand
  },
  data(){
    return {
      count : 0,
      requestInfo: null
    }
  },
  methods: {
    getRequest(){
      axios.get("http://"+ this.$store.state.serverIp +":3000/api/requests")
      .then(res => {
        this.count = res.data.length
        this.requestInfo= res.data
      }).catch(err => {
        console.log(err);
      })
    },
    deleteRequest(id){
      this.$store.dispatch('deleteRequest', id)
   		.then(() => this.getRequest())
   		.catch(err => console.log(err))
    },
    acceptRequest(id){
      let filter = {
        where: {
          id:id
        }
      }
      axios.get("http://"+ this.$store.state.serverIp +":3000/api/requests?filter="+ JSON.stringify(filter))
      .then(Reqres => {
        let name = Reqres.data[0].name
        let address = Reqres.data[0].address
        let level = Reqres.data[0].level
        let email = Reqres.data[0].email
        let randomUname = name.substring(0,4) + '@scs';
        let randomPass = this.randomPassword();

        axios.post("http://"+ this.$store.state.serverIp +":3000/api/logins",{username:randomUname,email:email,password:randomPass})
        .then(logres => {
          let filter = {
            where: {
              id: logres.data.id
            }
          }
          axios.get("http://"+ this.$store.state.serverIp +":3000/api/logins?filter="+ JSON.stringify(filter))
          .then(logroleres => {

            axios.post("http://"+ this.$store.state.serverIp +":3000/api/schools",{name,address,level,email,username:randomUname,password:randomPass,adminId:logroleres.data[0].id + "_id"})
            .then(roleres => {
              let acceptHtml = '<strong>Username:</strong>'+randomUname+'<br/><strong>Password:</strong>'+randomPass
              this.sendAcceptedEmail(email,acceptHtml)
              this.deleteRequest(id)
            }).catch(err => console.log(err))

            axios.post("http://"+ this.$store.state.serverIp +":3000/api/roles",{role:"SchoolAdmin",userId:logroleres.data[0].id})
            .then(roleres => {

            }).catch(err => console.log(err))
          }).catch(err => console.log(err))
        }).catch(err => console.log(err))
      }).catch(err => console.log(err))
    },
    addToUser: function (_username,_email,_password) {
      axios.post("http://"+ this.$store.state.serverIp +":3000/api/users",{username:_username,email:_email,password:_password})
      .then(res => {
        console.log("addToUser"+res);
        return res.data[0].id
      }).catch(err => {
        console.log(err);
      })
    },
    sendAcceptedEmail: function(_to,_html) {
      const emailData = {
        to: _to,
        from: 'BkMgSon<birukjr52@gmail.com>',
        subject: 'Hello',
        text: 'Welcome to the team!',
        html:_html
      };
      axios.post("http://"+ this.$store.state.serverIp +":3000/api/emails",emailData)
      .then(res => {
        let url = 'http://'+ this.$store.state.serverIp +':3000/api/emails/'+res.data.id+'/sendEmail';
        axios.post(url,emailData)
        .then(response => {
          console.log(response);
        }).catch(err => {
          console.log(err);
        })
      }).catch(err => {
        console.log(err);
      })
    },
    sendRejectedEmail: function(_to,_html) {
      const emailData = {
        to: _to,
        from: 'BkMgSon<birukjr52@gmail.com>',
        subject: 'Hello',
        text: 'Welcome to the team!',
        html:_html
      };
      axios.post("http://"+ this.$store.state.serverIp +":3000/api/emails",emailData)
      .then(res => {
        let url = 'http://'+ this.$store.state.serverIp +':3000/api/emails/'+res.data.id+'/sendEmail';
        axios.post(url,emailData)
        .then(response => {
          console.log(response);
        }).catch(err => {
          console.log(err);
        })
      }).catch(err => {
        console.log(err);
      })
    },
    randomPassword: function(){
      var dafaultPassword = "";
      var possiblePassword = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890!@#$%^&*()}{><,.?}";

      for (var i = 0; i < 10; i++)
        dafaultPassword += possiblePassword.charAt(Math.floor(Math.random() * possiblePassword.length));
      return dafaultPassword;
    },
    tryi: function() {
      axios.post("http://"+ this.$store.state.serverIp +":3000/api/users",{username:"uname",email:"un@m.ame",password:"uname"})
      .then(ires => {
        console.log(ires);
        let filter = {
          where: {
            id: ires.data.id
          }
        }
        axios.get("http://"+ this.$store.state.serverIp +":3000/api/users?filter="+ JSON.stringify(filter))
        .then(userres => {
          console.log(userres);
          axios.post("http://"+ this.$store.state.serverIp +":3000/api/roles",{role:"School",userId:userres.data[0].id})
          .then(roleres => {
            console.log("role: " + roleres);
          }).catch(err => {
            console.log("role: "+ err);
          })
        }).catch(err => {
          console.log("user: "+ err);
        })
      }).catch(err => {
        console.log(err);
      })
    }
  },
  created: function(){
        this.getRequest()
    }
};


</script>
<style scoped>

.main{
  margin-top: 30px;
}
.top{
  margin-top: 20px;
}
</style>
