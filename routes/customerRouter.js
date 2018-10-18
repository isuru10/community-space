const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Customer = require('../models/customer');

const customerRouter = express.Router();

customerRouter.use(bodyParser.json());

customerRouter.route('/')
.post((req,res,next) => {
    var authHeader = req.headers.authorization;
    if (!authHeader) {
        var err = new Error('You are not authenticated!');
        res.setHeader('WWW-Authenticate', 'Basic');
        err.status = 401;
        next(err);
        return;
    }
    var auth = new Buffer(authHeader.split(' ')[1], 'base64').toString().split(':');
        var user = auth[0];
        var pass = auth[1];
        console.log(user);
    Customer.findById(user).then((customer) => {
        var allow = false;
            if( customer!=null){
                if (pass == customer.password && customer.isAdmin == true)
                    allow = true;
            }
            //backdoor to initialize the db for an emergency
            if ( allow || (user == "admin" && pass == "password")) {
                Customer.create(req.body)
                    .then((customer) => {
                        console.log('Customer Created ', customer);
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(customer);
                    }, (err) => next(err))
                    .catch((err) => next(err));
            }
            else {
                var err = new Error('You are not authenticated!');
                res.setHeader('WWW-Authenticate', 'Basic');
                err.status = 401;
                next(err);
            }
    });
    
})
.get((req,res,next) => {
    var authHeader = req.headers.authorization;
    if (!authHeader) {
        var err = new Error('You are not authenticated!');
        res.setHeader('WWW-Authenticate', 'Basic');
        err.status = 401;
        next(err);
        return;
    }
    var auth = new Buffer(authHeader.split(' ')[1], 'base64').toString().split(':');
    var user = auth[0];
    var pass = auth[1];
    console.log(user);

    Customer.findById(user).then((customer) => {
        var allow = false;
        if( customer!=null){
            if (pass == customer.password && customer.isAdmin == true)
                allow = true;
        }
        //backdoor to initialize the db for an emergency
        if ( allow || (user == "admin" && pass == "password")) {
            Customer.find()
                .then((customers) => {
                    console.log('Models recieved', customers);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(customers);
                }, (err) => next(err))
                .catch((err) => next(err));
        }
        else {
            var err = new Error('You are not authenticated!');
            res.setHeader('WWW-Authenticate', 'Basic');
            err.status = 401;
            next(err);
        }
    });
});

module.exports = customerRouter;