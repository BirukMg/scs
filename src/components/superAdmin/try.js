acceptRequest(id){
  let filter = {
    where: {
      id:id
    }
  }
  axios.get("http://localhost:3000/api/requests?filter="+ JSON.stringify(filter))
  .then(Reqres => {
    let name = Reqres.data[0].name
    let address = Reqres.data[0].address
    let level = Reqres.data[0].level
    let email = Reqres.data[0].email
    let randomUname = name.substring(0,4) + '@scs';
    let randomPass = this.randomPassword();

    axios.post("http://localhost:3000/api/logins",{username:randomUname,email:email,password:randomPass})
    .then(logres => {
      let filter = {
        where: {
          id: logres.data.id
        }
      }
      axios.get("http://localhost:3000/api/logins?filter="+ JSON.stringify(filter))
      .then(logroleres => {

        axios.post("http://localhost:3000/api/schools",{name,address,level,email,adminId:logroleres.data[0].id})
        .then(roleres => {
          let acceptHtml = '<strong>Username:</strong>'+randomUname+'<br/><strong>Password:</strong>'+randomPass
          this.sendAcceptedEmail(email,acceptHtml)
        }).catch(err => console.log(err))

        axios.post("http://localhost:3000/api/roles",{role:"School",userId:logroleres.data[0].id})
        .then(roleres => {

        }).catch(err => console.log(err))
      }).catch(err => console.log(err))
    }).catch(err => console.log(err))
  }).catch(err => console.log(err))
}





acceptRequest(id){
let filter = {
  where: {
    id:id
  }
}
axios.get("http://localhost:3000/api/requests?filter="+ JSON.stringify(filter))
.then(Reqres => {
  let name = Reqres.data[0].name
  let address = Reqres.data[0].address
  let level = Reqres.data[0].level
  let email = Reqres.data[0].email

  axios.post("http://localhost:3000/api/schools",{name,address,level,email})
  .then(schoolres => {
    let randomUname = name.substring(0,4) + '@scs';
    let randomPass = this.randomPassword();
    this.deleteRequest(id);
    let acceptHtml = '<strong>Username:</strong>'+randomUname+'<br/><strong>Password:</strong>'+randomPass
    this.sendAcceptedEmail(email,acceptHtml)
    axios.post("http://localhost:3000/api/logins",{username:randomUname,email:email,password:randomPass})
    .then(ires => {
      console.log(ires);
      let filter = {
        where: {
          id: ires.data.id
        }
      }
      axios.get("http://localhost:3000/api/logins?filter="+ JSON.stringify(filter))
      .then(userres => {
        console.log(userres);
        axios.post("http://localhost:3000/api/roles",{role:"School",userId:userres.data[0].id})
        .then(roleres => {
          console.log("role: " + roleres);
        }).catch(err => {
          console.log("role: "+ err);
        })
      }).catch(err => {
        console.log("user: "+ err);
      })

      // console.log("addToUser"+res);
    }).catch(err => {
      console.log(err);
    })

  }).catch(err => {
    console.log(err)
  })
}).catch(err => {
  console.log(err)
})
}
