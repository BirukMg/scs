<template>
  <div class="flexible-content">
    <!--Navbar-->
    <navbar class="flexible-navbar white" position="top" name="MDB" href="#" scrolling>
      <navbar-collapse>
        <navbar-nav right>
          <!-- <navbar-item>{{this.$store.state.user.username}}</navbar-item> -->
          <navbar-item>{{this.$store.state.schoolName}}</navbar-item>
          <navbar-item><mdb-btn size="sm" color="primary" @click="logout"><fa icon="sign-out" class="mr-2"/>Logout</mdb-btn></navbar-item>
        </navbar-nav>
      </navbar-collapse>
    </navbar>
    <!--/.Navbar-->
    <!-- Sidebar -->
    <div class="sidebar-fixed position-fixed">
      <a><img alt="" class=" logo-img" src="../../assets/logo.jpg"/></a>
      <list-group class="list-group-flush">
        <router-link to="students" @click.native="activeItem = 1">
          <list-group-item :action="true" :class="activeItem === 1 && 'active'"><fa icon="graduation-cap" class="mr-3"/>Students</list-group-item>
        </router-link>
        <router-link to="teachers" @click.native="activeItem = 2">
          <list-group-item :action="true" :class="activeItem === 2 && 'active'"><fa icon="book" class="mr-3"/>Teachers</list-group-item>
        </router-link>
        <router-link to="clubs"  @click.native="activeItem = 3">
          <list-group-item :action="true" :class="activeItem === 3 && 'active'"><fa icon="certificate" class="mr-3"/>Clubs</list-group-item>
        </router-link>
        <router-link to="schoolProfile" @click.native="activeItem = 4">
          <list-group-item :action="true" :class="activeItem === 4 && 'active'"><fa icon="user" class="mr-3"/>Profile</list-group-item>
        </router-link>
        <!-- <router-link to="/404" @click.native="activeItem = 5">
          <list-group-item :action="true" :class="activeItem === 5 && 'active'"><fa icon="exclamation" class="mr-3"/>Account managment</list-group-item>
        </router-link> -->
      </list-group>
    </div>
    <!-- /Sidebar  -->
    <main>
      <div class="mt-5 p-3">
        <!-- {{this.$store.state.user}} -->
        <router-view></router-view>
      </div>
    </main>
  </div>
</template>

<script>
import axios from 'axios'
import {mapState} from 'vuex'
import {Badge, Container, Navbar, NavbarItem, NavbarNav, NavbarCollapse, Btn,mdbBtn, Fa, ListGroup, ListGroupItem, CardBody, Footer, waves } from 'mdbvue'

export default {
  name: 'super',
  components: {
    Badge,
    Container,
    Navbar,
    NavbarItem,
    NavbarNav,
    NavbarCollapse,
    Btn,
    mdbBtn,
    ListGroup,
    ListGroupItem,
    Fa,
    CardBody,
  },
  data () {
    return {
      activeItem: 1,
      count: 0
    }
  },
  beforeMount () {
    // this.countRequest()
    this.$store.dispatch('getRequest'),
    this.$store.dispatch('isLog'),
    this.notLog()
  },
  methods: {
    logout(){
      this.$store.dispatch('logout')
      .then(() => this.$router.push('/'))
      .catch(err => console.log(err))
    },
    notLog(){
      if (this.$store.state.status == "logged out") {
        this.$router.push('/')
      }
    }
  },
  // computed: {[
  //   ...mapState(requestCount)
  // ]}
  mixins: [waves]
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
main {
  background-color: #EDEDEE;
}

.flexible-content {
  transition: padding-left 0.3s;
  padding-left: 270px;
}

.flexible-navbar {
  transition: padding-left 0.5s;
  padding-left: 270px;
}

.sidebar-fixed {
  left: 0;
  top: 0;
  height: 100vh;
  width: 270px;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
  z-index: 1050;
  background-color: #fff;
  padding: 1.5rem;
  padding-top: 0;
}

.sidebar-fixed .logo-wrapper img{
  width: 100%;
  padding: 2.5rem;
}

.sidebar-fixed .list-group-item {
  display: block !important;
  transition: background-color 0.3s;
}

.sidebar-fixed .list-group .active {
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
  border-radius: 5px;
}

@media (max-width: 1199.98px) {
  .sidebar-fixed {
    display: none;
  }
  .flexible-content {
    padding-left: 0;
  }
  .flexible-navbar {
    padding-left: 10px;
  }
}

.navbar-light .navbar-brand {
  margin-left: 15px;
  color: #2196f3 !important;
  font-weight: bolder;
}
.logo-img{
  width: 100px;
  height: 100px;
  margin: 25px 0px 10px 50px;
}
.req-count{
  margin-left: 50px;
}
</style>
