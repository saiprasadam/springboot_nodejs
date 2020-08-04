var express = require('express');
var router = express.Router();
var axios = require("axios");

const { springHost, springPort } = require("../helpers/constants");

/* GET users listing. */
router.get('/', (req, res) => {
  var userData = {
    "email": '',
    "name": '',
    "password": '',
    "role": ''   
  }
  res.render('create_user.ejs',{userData :userData});
});

router.post('/addUser', (req, res) => {
  console.log("===>>" + req.body.name)
  const errors = {};  
  
  var email = req.body.email;
  var name = req.body.name;
  var password = req.body.password;
  var confirmPassword = req.body.confirmPassword;
  var role = req.body.role;

  if (name == "") {
    errors.nameValidaion = 'User Name is requerd';
  }
  if (password == "") {
    errors.passwordValidaion = 'Password is requerd';
  } else {
    var mailformat = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var patern = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (password.match(patern)) {
      if (password != confirmPassword) {
        errors.passwordValidaion = 'Password is not match';
      }
    } else {
      errors.passwordValidaion = 'Password is should one special char , one small case letter and minumn 8 character.';
    }
  }

  if (email == "") {
    errors.emailValidaion = 'Email is requerd'
  } else {
    if (email.match(mailformat)) {
      console.log("mail success")
    } else {
      errors.emailValidaion = 'This is not correct email format';
    }
  }
  var userData = {
    "email": email,
    "name": name,
    "password": password,
    "admin_access": true,
    "role": role
  }

  if(Object.keys(errors).length < 1) {
    let url = `http://${springHost}:${springPort}/insetUser`;

  axios({
    method: 'post',
    url: url,
    headers: {
     'Content-Type': 'application/json;charset=utf-8'
      },
    data: userData
  }).then((response) => {
    if(response.data.status){
      console.log(response.data.data);  
      errors.status = response.data.data;
     var userData = {
        "email": '',
        "name": '',
        "password": '',
        "role": ''   
      }
      res.render('create_user.ejs', { errormessage: errors,userData :userData })
    }   
  }, (error) => {
    console.log(error);
  }); 

  }else{
    
    res.render('create_user.ejs', { errormessage: errors,userData :userData })
  }
  
})

function clear() {
  console.log("***************************************88")
  res.render('create_user.ejs');
}
module.exports = router;
