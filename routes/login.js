var express = require('express');
var router = express.Router();
var axios = require("axios");
const { springHost, springPort } = require("../helpers/constants");

router.get('/', (req, res) => {
    console.log("Login Page requested");
    res.render('login.ejs');
});

router.post('/sendTemporaryPassword', (req, res) => {
    console.log("sentData page requested" + req.body.name);
    let url = `http://${springHost}:${springPort}/sendTemporaryPassword`;
    var userData = {
        userName: req.body.name,
        email: req.body.email
    }
    axios({
        method: 'post',
        url: url,
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        data: userData
    }).then((response) => {
        if (response.data.status) {
            console.log(response.data.data);
            res.render('login.ejs', { errormessage: response.data.data });
        }
    }, (error) => {
        console.log(error);
    });
})
router.post('/validate', (req, res) => {
    console.log("Validate page requested");
    var errormessage = 'Invalid Username/password';
    let url = `http://${springHost}:${springPort}/getUser?name=${req.body.username}`;

    axios.get(url).then(function (response) {
        console.log("Fetching user details from: " + url);
        const status = response.status;
        if (status != 200) {
            console.error("Status is not 200");
            console.error("Error message: " + response.data);
            throw Error("Unable to continue, status received: " + status);
        }
        const data = response.data;
        if (data.name == req.body.username && data.password == req.body.password) {
            console.log("Successfully authenticated username: " + data.name);
            console.log("role " + data.role)
            if (data.role == "user") {
                res.render('homepage.ejs', { username: req.body.username });
            } else if (data.role == "admin") {
                res.render('admin_homepage.ejs', { username: req.body.username });
            }
        }
        else {
            console.log("Unable to log in username: " + data.name);
            res.render('login.ejs', { errormessage: errormessage });
        }
    }).catch(function (error) {
        console.error(`Error: ${error.message}`);
    });
});

module.exports = router;