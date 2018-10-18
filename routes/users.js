var express = require('express');
var router = express.Router();
const Customer = require('../models/customer');
/* GET users listing. */
router.post('/authenticateAdmin', function (req, res, next) {
  console.log(req.headers.authorization);
  var authHeader = req.headers.authorization;
  var auth = new Buffer(authHeader.split(' ')[1], 'base64').toString().split(':');
  console.log(auth[0]=="admin")
  var user = auth[0];
  var pass = auth[1];
  Customer.findById(user).then((customer) => {
    //backdoor to initialize the db or for an emergency
    if (
      (user === "admin" && pass === "password")||(pass == customer.password && customer.isAdmin == true)) {
      res.json({ success: true });
    }
    else {
      res.json({ success: false });
    }
  }).catch((err) => res.json({ success: false }));

});

router.post('/authenticateUser', function (req, res, next) {
  console.log(req.headers.authorization);
  var authHeader = req.headers.authorization;
  var auth = new Buffer(authHeader.split(' ')[1], 'base64').toString().split(':');
  var user = auth[0];
  var pass = auth[1];
  Customer.findById(user).then((customer) => {
    //backdoor to initialize the db or for an emergency
    if (pass == customer.password && customer.isAdmin == false) {
      res.json({ success: true });
    }
    else {
      res.json({ success: false });
    }
  }).catch((err) => res.json({ success: false }));

});

module.exports = router;
