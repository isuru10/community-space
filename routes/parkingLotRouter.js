const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const ParkingLot = require('../models/parkingLot');
const Customer = require('../models/customer');

const parkingLotRouter = express.Router();

parkingLotRouter.use(bodyParser.json());

parkingLotRouter.route('/')
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
            ParkingLot.create(req.body)
            .then((lot) => {
                console.log('Lot Created ', lot);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(lot);
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
            ParkingLot.find()
                .then((lots) => {
                    console.log('Models recieved', lots);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(lots);
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

parkingLotRouter.route('/findnearby')
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
            var lat = req.body.lat;
            var lon = req.body.lon;
            ParkingLot.find()
                .then((lots) => {
                    console.log('Models recieved', lots);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');

                    var closest = [];
                    lots.forEach(lot => {
                        var d = getDistanceFromLatLonInKm(lot.latitude,lot.longitude,lat,lon);
                        if(d < 0.4){
                            closest.push(lot);
                        }
                    });
                    
                    res.json(closest);
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

parkingLotRouter.route('/:parkingLotId')
.put((req,res,next) => {
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
            var query = {'_id' : req.params.parkingLotId};
            ParkingLot.findOneAndUpdate(query, req.body, {upsert:true}, function(err, doc){
                if (err) return res.send(500, { error: err });
                return res.send("succesfully saved");
            });
            
        }
        else {
            var err = new Error('You are not authenticated!');
            res.setHeader('WWW-Authenticate', 'Basic');
            err.status = 401;
            next(err);
        }
    });
});

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
  }
  
  function deg2rad(deg) {
    return deg * (Math.PI/180)
  }

module.exports = parkingLotRouter;