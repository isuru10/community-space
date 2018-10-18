const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Model = require('../models/model');
const Customer = require('../models/customer');

const modelRouter = express.Router();

modelRouter.use(bodyParser.json());

modelRouter.route('/')
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
                Model.find()
                    .then((models) => {
                        console.log('Models recieved', models);
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(models);
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
                Model.create(req.body)
                    .then((model) => {
                        console.log('Model Created ', model);
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(model);
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
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /models');
    })
    .delete((req, res, next) => {
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
        
        Customer.findById(user).then((customer) => {
            var allow = false;
            if( customer!=null){
                if (pass == customer.password && customer.isAdmin == true)
                    allow = true;
            }
            //backdoor to initialize the db for an emergency
            if ( allow || (user == "admin" && pass == "password")) {
                Model.remove({})
                    .then((resp) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(resp);
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

    module.exports = modelRouter;