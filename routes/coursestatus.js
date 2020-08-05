var express = require('express');
var router = express.Router();

var axios = require("axios");

let { springHost, springPort } = require("../helpers/constants");
router.get("/:userId", function (req, res, next) {
  let params = req.params;
  let courseId = params.userId;
  console.log("Fetching resource with ID: " + courseId);
  if (!courseId) {
    let error = new Error("Course ID not found");
    error.statusCode = 400
    return next(error);
  }
  let url = `http://${springHost}:${springPort}/getCourseStatus/${courseId}`;
  return axios.get(url).then(function (response) {
    // Process the response data and render an EJS file
	let data = [];

    if (response.status != 200) {
      let error = new Error(response.data);
      error.statusCode = response.status;
      return next(error);
    }
	console.log("response---"+JSON.stringify(response.data));
	//	const data = JSON.stringify(response.data);
const keys = Object.values(response.data)
for (const key of keys) {
  console.log(key)
data.push(key);
console.log("data--"+data)
}

      console.log("course status");
	  
	  console.log(data);
console.log(data[0]+data[1]+data[2]+data[3]);
	
    return res.render("user_courseDetail.ejs",{ "courseName":data[0],"endDate": data[1],"id":data[2],"state":data[3],"startDate":data[4]});
  }).catch(function (err) {
    let error = new Error("Unable to access resource: " + err);
    error.statusCode = 500;
    return next(error);
  })
});

module.exports = router;
