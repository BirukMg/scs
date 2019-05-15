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
                  <mdb-btn size="sm" class="request-btn" color="success" v-on:click='sendRequest(requestinfo.id)'>Request</mdb-btn>
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
    getClubsInSchool(){
      let filter = {
        where: {
          school_id:"some"
        }
      }
      axios.get("http://localhost:3000/api/clubs?filter="+ JSON.stringify(filter))
      .then(res => {
        this.requestInfo = res.data
        console.log(this.requestInfo)
      }).catch(err => console.log(err))

    }
  },
  created: function(){
        this.getClubsInSchool()
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
.request-btn{
  width: 300px;
}
</style>
