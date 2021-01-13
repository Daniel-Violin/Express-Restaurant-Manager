const express = require('express');
const app = express();
const fs = require('fs');
//data structures used to store data
//initial data for stats page
let resData = [];
//list of restaurant names
let resNames = [];
//list of restaurant ids
let resIDs = [];
//list of restaurant objects
let restaurants = [];

//read files from the restaurant directory
fs.readdir('./restaurants', (err, files)=>{
	filesArray = files;
	for (var i in files){
		var data = require("./restaurants/"+files[i]);
		//update the files array
		filesArray[i] = data;
		//update the various lists used to facilitate sending information to pug and the client
		resData.push({id:"/restaurants/"+filesArray[i]['id'], name: filesArray[i]['name']});
		restaurants.push({id: parseInt(filesArray[i]['id']), name: filesArray[i]['name'], menu: filesArray[i]['menu'], min_order: filesArray[i]['min_order'], delivery_fee: filesArray[i]['delivery_fee']})
		resNames.push(filesArray[i]['name']);
		resIDs.push(filesArray[i]['id']);
		
	}
	//use pug as our view engine
	app.set("view engine", "pug");
	app.use(express.json());
	app.use(express.static(__dirname));
	
	//===================================================//
						//GET
	//===================================================//	
	
	//get request to home and return the index page
	app.get('/', (req, res,next) => {
		res.render("pages/index"); 
	});
	
	
	//get request to /restaurants
	app.get('/restaurants', (req, res, next) => {
		//if a json is being requested, send a json back of the ids
		res.format({
		"application/json": function(){
			res.send(JSON.stringify({"restaurants": resIDs}));
		},
		//if a html is being requested, render the stats page 
		"text/html": () => { res.render("pages/stats",{restaurants}); }		
		});
	});
	
	//get request to /addrestaurant -> sends the form.html file
	app.get('/addrestaurant', (req, res,next) => {
		res.sendFile(__dirname + '/form.html');
	});
	//get request to a /restaurants/restID 
	app.get('/restaurants/:restID', (req,res,next) => {
		//get the id of the restaurant being requested
		let id = req.params.restID;
		//loop through our restaurants and get the restaurant that has the same id
		for (var i in restaurants){
			if (restaurants[i].id.toString()=== id){
				let obj = restaurants[i];
				//if a json is being requested return a json of the restaurant object
				res.format({
					'application/json': function (){
						res.status = 200;
						res.send(JSON.stringify(restaurants[i]));
						res.end()
					//if an html is being requested render the data page for that restaurant
					},
					'text/html': function (){
						res.status = 200;
						res.render("pages/data", {obj} )
					}
				});
			}
		}
	});
	
	//===================================================//
						//POST
	//===================================================//		
	//post request to /restaurants
	app.post('/restaurants', (req,res,next) => {
		//create a full new restaurant object with a menu set to null (is set to an empty object later)
		let temp = req["body"];
		temp["menu"] = null;
		//update restaurant data array
		resData.push({id:resIDs.length, name: temp["name"]});
		temp["id"] = resIDs.length;
		//update restaurants array
		restaurants.push(temp);
		console.log(temp);
		//update the names array
		resNames.push(temp["name"]);
		//update the id array
		resIDs.push(resIDs.length);
		//return json of restaurant
		res.status(200).json(temp)
	});
	//put request to update restaurant info with id restID
	app.put('/restaurants/:restID', (req,res,next) => {
		
		//get restID item
		let id = req.params.restID;
		//flag to check if the id is valid
		let found = false

		let temp = req["body"];
		//loop through restaurants and update the restaurant at the requested id
		//if it is found in our list, set the found flag to true (the id is valid)
		for (var i in restaurants){
			if (restaurants[i].id.toString() === id){
				found = true
				restaurants[i] = req["body"];
			}
		}
		//update our other data structure for our /restaurants page in case the user decided to change the name of the restaurant
		
			
		//if it was a valid id send back a blank succesful request
		if (found){
			res.status = 200;
			res.send("");
			res.end()
		//if it was not a valid id send back a 404 error
		}else{
			res.status = 404;
			res.send("error");
			res.end();
		}
	});
	app.listen(3000);
	console.log("Server listening at http://localhost:3000");
});