//default res object to send to sever
let res = {"name": "", "delivery_fee": 0, "min_order": 0};
//current restaurant selected in the change data menu
let currentRes = {}
//stores some data about the restaurants (received from server)
let resData = []; 
//list of ids for the current restaurant
let idList = [];

//Called on page load.
function init(){
	//initialize the current restaurant
	currentRes = JSON.parse(document.getElementById("catInput").name);
}
function save(){
	//used to send the correct url
	let chunks = window.location.href.split('/');
	let resID = chunks[chunks.length-1];
	
	//change the name,fee,min data if they were updated
	let name = document.getElementById("resNameInput").value;
	let fee = document.getElementById("resFeeInput").value;
	let min = document.getElementById("resMinInput").value;
	currentRes["name"] = name;
	currentRes["delivery_fee"] = fee;
	currentRes["min_order"] = min;
	//Request to update data on server
	let request = new XMLHttpRequest();
	request.onreadystatechange = function(){	
		if(this.readyState == 4 && this.status == 200){ //if its reggie
			//if it is successful, alert the user and output a confirmation message to console
			temp = this.responseText
			console.log("received!");
			alert("Successfully Saved!");
		}
	}
	//custom url that tells the server the currently selected restaurant
	request.open("PUT","http://localhost:3000/restaurants/"+resID,true);
	request.setRequestHeader('Content-type', 'application/json');
	request.send(JSON.stringify(currentRes));
}
//function to edit the current html/current restaurant object before saving (adds new categories)
function addCategory(){
	//get the data entered into the text field 
	let category = document.getElementById("catInput").value;

	//get the dropdown menu
	let dmenu = document.getElementById("dropdown");
	
	//change the null value to an empty object
	if (currentRes["menu"]== null){
		currentRes["menu"] = {}
	}
	//check if the category exists, if it does then do not allow it to be added
	var myEle = document.getElementById(category);
	if (myEle){
		alert("That category cannot be added!");
		document.getElementById("catInput").textContent = ""
	//check if it is empty, if it is then do not allow it to be added
	}else if (category == ""){
		alert("That category cannot be added!");
		document.getElementById("catInput").textContent = ""
	//otherwise it is good to go and can be added to the menu
	}else{
		currentRes.menu[category] = {}
		//create new div for new category
		var elem = document.createElement('div');
		elem.id = category;
		
		//create new header to display the category
		document.body.appendChild(elem);
		var h = document.createElement("h3");   
		h.innerHTML = category;             
		document.getElementById(category).appendChild(h);
		//update the dropdown menu
		var newOption = document.createElement("OPTION");
		newOption.textContent = category;
		newOption.value = category;
		dmenu.appendChild(newOption);   
	}
}
//helper function used to return the food ids in the menu
function getIDs(){
	let ids = []
	Object.keys(currentRes.menu).forEach(key =>{
		//For each menu item in the category
		Object.keys(currentRes.menu[key]).forEach(id => {
			ids.push(id);
		});
	}); 
	return ids
}
//function to edit the current html/current restaurant object before saving (adds new foods to categories)
function addItem(){
	//get the current selected category in the dropdown
	let dmenu = document.getElementById("dropdown");
	let cat = dmenu.options[dmenu.selectedIndex].text
	//get the data the user entered for the food item
	let itemName = document.getElementById("itemNameInput").value
	let itemDesc = document.getElementById("itemDescInput").value
	let itemPrice = document.getElementById("itemPriceInput").value
	
	//gets the unique id for the item
	//by nature of the given data we have, adding +2 to the number of unique ids
	//always creates a unique one
	let ids = getIDs();
	if (idList.length != 0){
		ids = idList
	}
	ids.push(ids.length+2);
	idList = ids;
	uniqueID = ids.length+2;
	//check if any of the fields are empty
	if (itemName == "" || itemDesc == "" || itemPrice == ""){
		alert("Please fill out all the categories!");
		document.getElementById("catInput").textContent = ""
	//if they aren't we can update the menu!
	}else{
		
		var myEle = document.getElementById(cat);
		//create new item's id
		var hID = document.createElement("h4");
		hID.innerHTML = "Item id: "+uniqueID;
		//create new item's name
		var pName = document.createElement("p");
		pName.innerHTML = "Item Name: "+itemName;
		//create new item's description
		var pDesc = document.createElement("p");
		pDesc.innerHTML = "Item Description: "+itemDesc;
		//create new item's price 
		var pPrice = document.createElement("p");
		pPrice.innerHTML = "Price: "+itemPrice +"$"
		
		//update the current Restaurant object
		currentRes.menu[cat][uniqueID] = {};
		console.log(currentRes.menu[cat]);
		currentRes.menu[cat][uniqueID]["name"] = itemName;
		currentRes.menu[cat][uniqueID]["price"] = itemPrice;
		currentRes.menu[cat][uniqueID]["description"] = itemDesc;
		
		console.log(currentRes.menu);
		//if the category exists
		if (myEle){
			//update the html
			document.getElementById(cat).appendChild(hID);
			document.getElementById(cat).appendChild(pName);
			document.getElementById(cat).appendChild(pPrice);
			document.getElementById(cat).appendChild(pDesc);
		//else it was unsucessful
		}else{
			console.log("unsuccesful");
		}
	}
}
//function to add restaurant to list of restaurants on server
function addRestaurant(){
	//get the name, delivery_fee and min_order of the restaurant and update the res object to send it
	let name = document.getElementById("resNameInput").value;
	let fee = document.getElementById("resFeeInput").value;
	let min = document.getElementById("resMinInput").value;
	res["name"] = name;
	res["delivery_fee"] = fee;
	res["min_order"] = min;
	//post request to send new res object to server
	let request = new XMLHttpRequest();
	request.onreadystatechange = function(){	
		if(this.readyState == 4 && this.status == 200){ //if its reggie
			temp = JSON.parse(this.responseText)
			//update information stored on client
			currentRes = temp;
			resData.push(temp);
			console.log(temp);
			//alert user, redirect to newly created restaurant and reset the res object
			alert("Successfully Added");
			window.location.replace("http://localhost:3000/restaurants/"+temp["id"].toString());
			res = {"name": "", "delivery_fee": 0, "min_order": 0};
		}
	}
	request.open("POST","http://localhost:3000/restaurants",true);
	request.setRequestHeader('Content-type', 'application/json');
	request.send(JSON.stringify(res));
}