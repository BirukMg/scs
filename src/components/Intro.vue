<template>
  <div class="background-page">
    <mdb-view>
      <video>
      </video>
      <mdb-mask class="d-flex justify-content-center align-items-center gradient">
        <mdb-container class="px-md-3 px-sm-0">
          <mdb-row>
            <mdb-col md="12" class="mb-4 white-text text-center">
              <h3 class="display-3 font-weight-bold mb-0">SCS</h3>
              <h3 class="display-3 font-weight-bold mb-0 pt-md-5">Welcome to SCS</h3>
              <hr class="hr-light my-4 w-100"/>
              <h4 class="subtext-header mt-2 mb-4"><strong>where students' best credit score is stored</strong></h4>
            </mdb-col>
          </mdb-row>
          <mdb-row>
            <mdb-col md="4">
            </mdb-col>
            <mdb-col md="6">
              <router-link to="/login"><mdb-btn outline="white" rounded color="white"><mdb-icon icon="sign-in"/> Login</mdb-btn></router-link>
              <router-link to="/schoolReg"><mdb-btn outline="white" rounded color="white"><mdb-icon icon="home"/> Register as School</mdb-btn></router-link>
            </mdb-col>
          </mdb-row>
        </mdb-container>
      </mdb-mask>
    </mdb-view>
  </div>
</template>

<script>
import { mdbContainer, mdbRow, mdbCol, mdbView, mdbMask, mdbInput, mdbBtn, mdbIcon, mdbNavbar, mdbNavItem, mdbNavbarNav, mdbNavbarToggler, mdbNavbarBrand  } from 'mdbvue';

export default {
  name: 'Intro',
  components: {
    mdbContainer,
    mdbRow,
    mdbCol,
    mdbView,
    mdbMask,
    mdbInput,
    mdbBtn,
    mdbIcon,
    mdbNavbar,
    mdbNavItem,
    mdbNavbarNav,
    mdbNavbarToggler,
    mdbNavbarBrand
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

</style>
