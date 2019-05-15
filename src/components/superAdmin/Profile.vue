<template id="">
  <mdb-container>
    <mdb-col sm="6">
      <v-snackbar v-model="msg.snackbar" :color="msg.color" :multi-line="msg.mode === 'multi-line'" :timeout="msg.timeout" :vertical="msg.mode === 'vertical'" :top = "true">
          {{ msg.text }}
          <v-btn dark flat @click="msg.snackbar = false">Close</v-btn>
      </v-snackbar>
      <mdb-list-group>
        <mdb-list-group-item :active="true">Club category</mdb-list-group-item>
        <div  v-for="category in categoryList">
          <mdb-list-group-item>
            {{category}}
            <span class="remove" @click="removeCategory(category)"><mdb-icon style="color: red; float:right;" icon="times"/></span>
          </mdb-list-group-item>
        </div>
      </mdb-list-group>
      <div class="form-group">
        <!-- <input type="text" v-model="categoryValue" class="form-control" v-on:keyup.enter="addCategory" placeholder="Add category, Hit enter"> -->
        <div class="input-group md-form form-sm form-2 pl-0">
          <input type="text" v-model="categoryValue" class="form-control" v-on:keyup.enter="addCategory" placeholder="Add category, Hit enter">
          <div class="input-group-append">
            <span class="input-group-text green lighten-3 remove" @click="done"><i class="fa fa-check text-white" aria-hidden="true"></i></span>
          </div>
        </div>
      </div>
    </mdb-col>
  </mdb-container>
</template>
<script>
  import axios from 'axios'
  import { mdbListGroup, mdbListGroupItem,mdbContainer,mdbIcon,mdbCol,mdbInput } from 'mdbvue';
  export default {
    name: 'Setting',
    components: {
      mdbListGroup, mdbListGroupItem,mdbContainer,mdbIcon,mdbCol,mdbInput
    },
    data: () => ({
      categoryList : [],
      categoryValue: '',
      msg:{
        snackbar: false,
        color: '',
        mode: '',
        timeout: 2000,
        text: ''
      }
    }),
    created () {
      this.initialize()
    },
    methods:{
      initialize(){
        axios.get('http://'+ this.$store.state.serverIp +':3000/api/categories')
        .then(res => {
          this.categoryList = res.data[0].category
        })
      },
      addCategory(){
        if (this.categoryValue == "") {
          this.msg.text = "Please add category"
          this.msg.snackbar = true
          this.msg.color = "warning"
        }else{
          this.categoryList.push(this.categoryValue)
        }
      },
      removeCategory(index){
        this.categoryList.splice(this.categoryList.indexOf(index),1)
      },
      done(){
        axios.get('http://'+ this.$store.state.serverIp +':3000/api/categories')
        .then(res => {
          if (res.data.length == 0) {
            axios.post('http://'+ this.$store.state.serverIp +':3000/api/categories',{category:this.categoryList})
            .then(res => {
              this.initialize()
            })
          }else{
            axios.patch("http://" + this.$store.state.serverIp + ":3000/api/categories/" + res.data[0].id,{category:this.categoryList})
            .then(res => {
              this.initialize()
            })
          }
        })
      }
    }
  }
</script>
<style>
  .remove{
    cursor: pointer;
  }
</style>
