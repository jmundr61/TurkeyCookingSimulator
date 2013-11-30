function ClockUI( stage, gameState ){
	var that = this;

	this.minuteRadius = 30;
	this.hourRadius = 0.7 * this.minuteRadius;
	this.clockX = 246;
	this.clockY = 146;

	this.getClockAngles = function( ){
		var currTime = new Date( gameState.currentTime );

		var hourAngle = 720 * ( currTime.getHours() / 24 ) - 90;
		var minuteAngle = 360 * ( currTime.getMinutes() / 60 ) - 90;
		return [ hourAngle, minuteAngle ];
	}

	var minuteLine = new createjs.Shape();
	minuteWidth = this.minuteRadius;
	minuteHeight = 1;
	minuteLine.graphics.beginFill('black').drawRect( 0, 0, minuteWidth, minuteHeight );
	minuteLine.regX = 0;
	minuteLine.regY = minuteHeight / 2;
	minuteLine.x = this.clockX;
	minuteLine.y = this.clockY;

	var hourLine = new createjs.Shape();
	hourWidth = this.hourRadius;
	hourHeight = 1;
	hourLine.graphics.beginFill('black').drawRect( 0, 0, hourWidth, hourHeight );
	hourLine.regX = 0;
	hourLine.regY = hourHeight / 2;
	hourLine.x = this.clockX;
	hourLine.y = this.clockY;

	stage.addChild( minuteLine );
	stage.addChild( hourLine );
	return {
		tick: function(){
			var angles = that.getClockAngles();
			hourLine.rotation = angles[0];
			minuteLine.rotation = angles[1];
		}
	}

}

function CookbookUI( stage, gameState ){
	var that = this;
	this.showingCookbook = false;

	var cookbookImg = new createjs.Bitmap("res/screens/KitchenScreen/Cookbook-Open.png");
	var closeButton = new Button( stage, gameState, 710, 10, 100, 50, null, null, function(){that.hideCookbook();} );
	var logEntries = [];
	this.hideCookbook = function(){

		stage.removeChild( closeButton );
		stage.removeChild( cookbookImg );
		for( i in logEntries ){
			stage.removeChild(logEntries[i]);
		}
		that.showingCookbook = false;
		gameState.pubsub.publish("Play", "Close_Cookbook");
	}

	// Show core temperature
	this.showCookbook = function(){
		if( !that.showingCookbook ){
			console.log("show cookbook---" + gameState.peekRecords );
			stage.addChild( cookbookImg );
			stage.addChild( closeButton );

			for( i in gameState.peekRecords ){
				var record = gameState.peekRecords[i];
				gameState.peekRecords[i].getTime();

				var logLine = new createjs.Text( "OFF", "12px Arial", "#ffffffff" );

				logLine.x = 520;
				logLine.y = 50 * i+ 165;
				logLine.textBaseline = "alphabetic";
				logLine.text = record.getContent();

				logEntries.push(logLine);
				stage.addChild(logLine);
			}

			that.showingCookbook = true;
		}
	}

	// change temperature, this one's for the UI
    gameState.pubsub.subscribe( "ShowCookbook", this.showCookbook );

}

function OvenUI( stage, gameState ){
	var that = this;
	var OVEN_CLOSED = 0;
	var OVEN_PEEK = 1;
	var OVEN_OPEN = 2;

	this.ovenDoor = OVEN_CLOSED;

	// Important Model, dummy placeholder
	var ovenModel = { secondTick:function(){} };

	var ovenLight = new createjs.Shape();
	ovenLight.graphics.beginFill( "black" ).drawCircle( 181, 126, 2 );

	// Oven light control
	this.changeOvenLight = function( state ){
		if( state == "On" ){
			ovenLight.visible = false;
		} else {
			ovenLight.visible = true;
		}
	}

	var turkeyStates = [
		new createjs.Bitmap( "res/screens/KitchenScreen/TurkeyState1.svg" ),
		new createjs.Bitmap( "res/screens/KitchenScreen/TurkeyState2.svg" ),
		new createjs.Bitmap( "res/screens/KitchenScreen/TurkeyState3.svg" ),
		new createjs.Bitmap( "res/screens/KitchenScreen/TurkeyState4.svg" ),
		new createjs.Bitmap( "res/screens/KitchenScreen/TurkeyState5.svg" )
	];
	// place turkeys in oven
	for (i in turkeyStates){
		turkeyStates[i].alpha = 0;
		turkeyStates[i].scaleX = turkeyStates[i].scaleY = 0.2;
		turkeyStates[i].x = 75;
		turkeyStates[i].y = 258;
	}

	var temperatureText = new createjs.Text( "OFF", "40px Arial", "#ff7700" );
	temperatureText.x = 50;
	temperatureText.y = 147;
	temperatureText.textBaseline = "alphabetic";

	var lightPressedImg = new createjs.Bitmap( "res/screens/KitchenScreen/LightButtonDepressed.png" );
	lightPressedImg.alpha = 0;

	var doorClosedLightOff = new createjs.Bitmap( "res/screens/KitchenScreen/DoorClosedLightOff.png" );
	doorClosedLightOff.alpha = 1;

	var doorClosedLightOn = new createjs.Bitmap( "res/screens/KitchenScreen/DoorClosedLightOn.png" );
	doorClosedLightOn.alpha = 0;

	var doorPeekLightOff = new createjs.Bitmap( "res/screens/KitchenScreen/DoorPeekLightOff.png" );
	doorPeekLightOff.alpha = 0;

	var doorPeekLightOn = new createjs.Bitmap( "res/screens/KitchenScreen/DoorPeekLightOn.png" );
	doorPeekLightOn.alpha = 0;

	var doorOpen = new createjs.Bitmap( "res/screens/KitchenScreen/DoorOpen.png" );
	doorOpen.alpha = 0;

	var redState = new createjs.Bitmap( "res/screens/KitchenScreen/OvenTurnRedState.png" );
	redState.alpha = 0;

	var panFront = new createjs.Bitmap( "res/screens/KitchenScreen/PanFront.png" );
	panFront.alpha = 0;

	this.changeTemperature = function( direction ){

		if( gameState.turkeyBought ){
			if( temperatureText.text == "OFF" && direction == "Up" ) temperatureText.text = "125";
			if( !( temperatureText.text == "OFF" && direction == "Down" ) ){

				var temp = ( direction == "Up" ? parseInt(temperatureText.text)+25 : parseInt(temperatureText.text)-25);

				 // Check lower bound for OFF
				 temp = temp < 150 ? temp = "OFF" : temp;

				 // Check upper bound
				 // if over 1100 F, burn house down
				 if( temp > 1100 ){
				 	console.log("You have died in a fire");
				 	return;
				 }

				 temperatureText.text = temp;
			}

			 // Tell our model to set the actual temperature
			 ovenModel.changeTemp( UtilityFunctions.F2C( temperatureText.text == "OFF" ? 125 : parseInt( temperatureText.text ) ) );
		}
		else{
			gameState.pubsub.publish("ShowDialog",{seq:"EmptyOven", autoAdvance: true});
		}
	}

	this.ovenLightToggle = function(){

		lightPressedImg.alpha = lightPressedImg.alpha == 0 ? 1 : 0;

		// Only work if the user bought an oven light
		if( gameState.boughtOvenLight ){
			if( that.ovenDoor == OVEN_CLOSED){
				doorClosedLightOn.alpha = lightPressedImg.alpha == 0 ? 0 : 1;
				doorClosedLightOff.alpha = lightPressedImg.alpha == 0 ? 1 : 0;
				doorOpen.alpha = 0;
			}
			else if( that.ovenDoor == OVEN_PEEK ){
				doorPeekLightOn.alpha = lightPressedImg.alpha == 0 ? 0 : 1;
				doorPeekLightOff.alpha = lightPressedImg.alpha == 0 ? 1 : 0;
				doorOpen.alpha = 0;
			}
		}else{
			// say it only once
			if( lightPressedImg.alpha == 1)
				gameState.pubsub.publish( "ShowDialog", {seq:"BrokenLight", autoAdvance:true} );
		}
	}

	this.startTurkeyModel = function(){
		console.log("weight is" + gameState.turkeyWeight)
		ovenModel = new OvenModel( gameState.turkeyWeight, gameState );
	}

	var handleBar = new createjs.Shape();
 	handleBar.graphics.beginFill("#ffffff").drawRect(20, 190, 300, 20);
 	handleBar.alpha = 0.5;
 	handleBar.addEventListener( "mouseover", function(){ document.body.style.cursor='pointer'; } );
 	handleBar.addEventListener( "mouseout", function(){ document.body.style.cursor='default'; } );
 	handleBar.addEventListener( "pressup", handlePress );

	// Look for a drag event
	function handlePress(event) {
		if( event.stageY > 300 && that.ovenDoor != OVEN_OPEN ){
			that.ovenDoor = OVEN_OPEN;
			doorPeekLightOn.alpha = doorClosedLightOn.alpha = 0;
			doorPeekLightOff.alpha = doorClosedLightOff.alpha = 0;
			doorOpen.alpha = 1;
			handleBar.graphics.clear();
			handleBar.graphics.beginFill("#ffffff").drawRect(5, 450, 400, 60);
			handleBar.alpha = 0.5;

			gameState.pubsub.publish( "Play", "Oven_Door_Full_Open" );
		}else if (that.ovenDoor == OVEN_OPEN ){
			that.ovenDoor = OVEN_PEEK;
			gameState.pubsub.publish( "Play", "Oven_Door_Full_Close" );
			handleBar.graphics.clear();
		 	handleBar.graphics.beginFill("#ffffff").drawRect(20, 190, 300, 20);
 			handleBar.alpha = 0.5;
			ovenPeek();
		}
	}

	handleBar.addEventListener( "click", ovenPeek );

	function ovenPeek(){
		if( that.ovenDoor == OVEN_CLOSED && that.ovenDoor != OVEN_OPEN ){
			gameState.pubsub.publish( "Play", "Oven_Door_Peek_Open" );
			doorPeekLightOn.alpha = lightPressedImg.alpha == 0 ? 0 : 1;
			doorPeekLightOff.alpha = lightPressedImg.alpha == 0 ? 1 : 0;
			doorClosedLightOn.alpha = 0;
			doorClosedLightOff.alpha = 0;
			doorOpen.alpha = 0;
			that.ovenDoor = OVEN_PEEK;

			handleBar.y = 48;
		}
		else if (that.ovenDoor == OVEN_PEEK){
			doorClosedLightOn.alpha = lightPressedImg.alpha == 0 ? 0 : 1;
			doorClosedLightOff.alpha = lightPressedImg.alpha == 0 ? 1 : 0;
			doorPeekLightOn.alpha = 0;
			doorPeekLightOff.alpha = 0;
			that.ovenDoor = OVEN_CLOSED;
			gameState.pubsub.publish( "Play", "Oven_Door_Peek_Close" );
			doorOpen.alpha = 0;
			handleBar.y = 0;
		}
	}

	// Show core temperature
	this.showTempDialog = function(){
		if( that.ovenDoor == OVEN_CLOSED ){
			gameState.pubsub.publish("ShowDialog", {seq:"OpenDoor", autoAdvance:true});
		}
		else{
			state = ovenModel.getTurkeyState();
			gameState.pubsub.publish( "ShowDialog", {seq:"custom", autoAdvance:false, customText:"Hmm.. the core temperature of the turkey is " + UtilityFunctions.C2F(state.core.temp).toFixed(2) + " F" } );
			gameState.pubsub.publish( "AddRecord", "Core temperature measured: " + UtilityFunctions.C2F(state.core.temp).toFixed(2) + " F" );
		}
	}

	new CookbookUI( stage, gameState );

	// change temperature, this one's for the UI
    gameState.pubsub.subscribe( "ChangeTemperature", this.changeTemperature );
    gameState.pubsub.subscribe( "ShowTempDialog", this.showTempDialog );
    gameState.pubsub.subscribe( "OvenLightToggle", this.ovenLightToggle );
	gameState.pubsub.subscribe( "OvenLight", this.changeOvenLight );
	gameState.pubsub.subscribe( "StartTurkeyModel", this.startTurkeyModel );


    this.secondTick = function(diff){
    		//ovenModel.secondTick();
    		gameState.currentTime += diff;
	}

	gameState.pubsub.subscribe( "SkipTime", function(){
		console.log("Skipping time");
		for(var i = 0; i < 1200; i++){
			that.secondTick( 1000 );
		}
	});

    return {
    	tick: function(){
    		// IMPORTANT: SECOND TIMER
    		var diff = Date.now() - gameState.oldTime;
			if( diff > 10000 ){
				gameState.oldTime = Date.now();
    			that.secondTick( diff );
    			console.log(new Date( gameState.currentTime) );

	    		if( gameState.turkeyBought ){

					// what's the state of the turkey
					turkeyState = ovenModel.getTurkeyState();
					turkeyStates[0].alpha = 1;
				/*	if( turkeyState["skin"]["cond"][0] == "Undercooked" )
						turkeyStates[1].alpha = turkeyState["skin"]["cond"][1];
					if( turkeyState["skin"]["cond"][0] == "Cooked" )
						turkeyStates[2].alpha = turkeyState["skin"]["cond"][1];
					if( turkeyState["skin"]["cond"][0] == "Dry" )
						turkeyStates[3].alpha = turkeyState["skin"]["cond"][1];
					if( turkeyState["skin"]["cond"][0] == "Charcoal" )
						turkeyStates[4].alpha = turkeyState["skin"]["cond"][1];
					if( turkeyState["skin"]["cond"][0] == "House Fire" )
						turkeyStates[4].alpha = 1;
					*/
				}
			}
    	},
    	render: function(){

		    stage.addChild( ovenLight );
		    stage.addChild( temperatureText );

		    stage.addChild( this.text );
		    stage.addChild( lightPressedImg);
			// Turkey goes here
				// did the player actually buy a turkey? if so, determine its cooked state
				if( gameState.turkeyBought ){

					// what's the state of the turkey
					turkeyState = ovenModel.getTurkeyState();
					turkeyStates[0].alpha = 1;
					if( turkeyState["skin"]["cond"] == "Undercooked" )
						turkeyStates[1].alpha = turkeyState["skin"]["cond"][1];
					if( turkeyState["skin"]["cond"] == "Cooked" )
						turkeyStates[2].alpha = turkeyState["skin"]["cond"][1];
					if( turkeyState["skin"]["cond"] == "Dry" )
						turkeyStates[3].alpha = turkeyState["skin"]["cond"][1];
					if( turkeyState["skin"]["cond"] == "Charcoal" )
						turkeyStates[4].alpha = turkeyState["skin"]["cond"][1];
					if( turkeyState["skin"]["cond"] == "House Fire" )
						turkeyStates[4].alpha = 1;

					panFront.alpha = 1;
					for(i in turkeyStates){
						stage.addChild(turkeyStates[i]);

					}
					stage.addChild(panFront);
				}
			// Pan front goes here
			stage.addChild( panFront );
			stage.addChild( doorPeekLightOn);
		    stage.addChild( doorPeekLightOff);

		    stage.addChild( doorClosedLightOn);
		    stage.addChild( doorClosedLightOff);

		    stage.addChild( doorOpen);
		    stage.addChild( new Button( stage, gameState, 45, 163, 41, 17, "ChangeTemperature", "Up" ) );
		    stage.addChild( new Button( stage, gameState, 95, 163, 41, 17, "ChangeTemperature", "Down" ) );
		    stage.addChild( new Button( stage, gameState, 145, 163, 41, 17, "OvenLightToggle", "" ) );
		    if( gameState.hard == false )
		    	stage.addChild( new Button( stage, gameState, 220, 120, 50, 50, "SkipTime", "" ) );
			stage.addChild( handleBar);
    		return this;
    	}
	}
}

function WindowUI( stage, gameState ){

	var dayNight = new createjs.Bitmap("res/Test4-217.svg");
	dayNight.y=30;
	var secondCounter = 0;
	dayNight.x = -(new Date().getHours()*682.625);

	var ground = new createjs.Bitmap( "res/screens/Window/Ground.png" );
	var houses = new createjs.Bitmap( "res/screens/Window/Housefar.png" );
	var streetLight = new createjs.Bitmap( "res/screens/Window/StreetlightGlow.png" );
	streetLight.alpha = 0;

	var treeAnimations = { rustle:[0,17,"rustle"], still:[0,0,"still"] };
	var data = {
    	images: ["res/screens/Window/Tree_Animation.png"],
     	frames: { width:386, height:287 },
     	animations: treeAnimations
 	};
	var spriteSheet = new createjs.SpriteSheet(data);
 	var animation = new createjs.Sprite(spriteSheet, "treeAnimations");
 	animation.x = 415;
 	animation.y = 30;
	
	// Fast forward, move sky
	gameState.pubsub.subscribe( "SkipTime", function(){
		dayNight.x -=  dayNight.x < -15583 ? 0 : (11.38 * 20);
	});

    stage.addChild( dayNight );
    stage.addChild( ground );
    stage.addChild( houses );
    stage.addChild( streetLight );
    stage.addChild( animation );
return {

	tick: function(){

		// move the sky
		secondCounter++;
		if( secondCounter > 60 ){
			dayNight.x-=11.38;
			secondCounter = 0;
		}

		// move the overlay
		//console.log(dayNight.x);
		if( dayNight.x < -15583 )
			dayNight.x = 0;

		// turn on lights
		if( dayNight.x < 0 && dayNight.x > -4545 ){
			// turn on random window lights
			streetLight.alpha = 1;
		}
		else if( dayNight.x < -11687 ){
			streetLight.alpha = 1;
		}
		else
			streetLight.alpha = 0;
	}
}
}

function MarketItem( gameState, name, x, y, cost, mouseOutImg, mouseOverImg, mouseOutKitchenImg, mouseOverKitchenImg, funnyDescription, weight ){
	var that = this;
		this.name = name;
		this.bought = false;

		var mouseOverKitchen = new createjs.Bitmap( mouseOverKitchenImg );
		var mouseOutKitchen = new createjs.Bitmap( mouseOutKitchenImg );

		var mouseOver = new createjs.Bitmap( mouseOverImg );
		var mouseOut = new createjs.Bitmap( mouseOutImg );

		mouseOver.x = mouseOut.x = x;
		mouseOver.y = mouseOut.y = y;
	 	mouseOut.addEventListener( "mouseover", function(){
	 		document.body.style.cursor='pointer';
	 		mouseOver.visible = true;
	 		mouseOut.visible = false;
	 		gameState.pubsub.publish("ShowPrice", cost );
	 		gameState.pubsub.publish("ShowDesc", {title:that.name, desc:funnyDescription, weight:weight} );
	 	});
 		mouseOut.addEventListener( "mouseout", function(){
 			document.body.style.cursor='default';
 			mouseOver.visible = false;
 			mouseOut.visible = true;
 			gameState.pubsub.publish("ClearClipboard", {});
 		} );
 		mouseOver.addEventListener( "mouseover", function(){
 			document.body.style.cursor='pointer';
 			mouseOver.visible = true;
 			mouseOut.visible = false;
 			gameState.pubsub.publish("ShowPrice", cost );
 			gameState.pubsub.publish("ShowDesc", {title:that.name, desc:funnyDescription, weight:weight} );
 		});
 		mouseOver.addEventListener( "mouseout", function(){
 			document.body.style.cursor='default';
 			mouseOver.visible = false;
 			mouseOut.visible = true;
 			gameState.pubsub.publish("ClearClipboard", {});
 		} );


	 	mouseOutKitchen.addEventListener( "mouseover", function(){
	 		document.body.style.cursor='pointer';
	 		mouseOverKitchen.visible = true;
	 		mouseOutKitchen.visible = false;
	 	});
 		mouseOutKitchen.addEventListener( "mouseout", function(){
 			document.body.style.cursor='default';
 			mouseOverKitchen.visible = false;
 			mouseOverKitchen.visible = true;
 		} );
 		mouseOverKitchen.addEventListener( "mouseover", function(){
 			document.body.style.cursor='pointer';
 			mouseOverKitchen.visible = true;
 			mouseOutKitchen.visible = false;
 		});
 		mouseOverKitchen.addEventListener( "mouseout", function(){
 			document.body.style.cursor='default';
 			mouseOverKitchen.visible = false;
 			mouseOutKitchen.visible = true;
 		} );

 		// We've bought the item, now we click it in the Kitchen
 		mouseOverKitchen.addEventListener("click",function(){
 			if ( that.name.indexOf("Temperature") != -1 ){
 				gameState.pubsub.publish( "ShowTempDialog", "" );
 			}

 			if ( that.name.indexOf("Cookbook") != -1 ){
 				console.log("click, show cookbook");
 				gameState.pubsub.publish("ShowCookbook","");
 				gameState.pubsub.publish("Play", "Open_Cookbook");
 			}
 		});

 		mouseOver.addEventListener( "click", function(){
 			if(!that.bought && cost <= gameState.wallet ){

	 			if( that.name.indexOf("Turkey") != -1 && gameState.turkeyBought != true){
	 				gameState.turkeyBought = true;
	 				gameState.turkeyWeight = weight;
				    gameState.marketItems[ that.name ].delete();
				    gameState.pubsub.publish("Play", {name:"Buy", volume:0.7} );
				    gameState.pubsub.publish("WalletAmount", gameState.wallet - Math.abs(cost))
				    gameState.pubsub.publish("StartTurkeyModel","");
	 			}
	 			// can we buy this? Only possible if you already bought a turkey
	 			else if( that.name.indexOf("Turkey") == -1 && gameState.turkeyBought == true ){

	 				// if we bought an oven light, enable it!
	 				if( that.name.indexOf("Light") != -1 ) gameState.boughtOvenLight = true;

		 			gameState.purchasedItems.push( objReturn );
		 			gameState.marketItems[ that.name ].delete();
		 			that.bought = true;
		 			gameState.pubsub.publish("Play", {name:"Buy", volume:0.7});
		 			gameState.pubsub.publish("WalletAmount", gameState.wallet - Math.abs(cost));
		 		}
		 		// One turkey only
		 		else if( that.name.indexOf("Turkey") != -1 && gameState.turkeyBought == true ){
		 			gameState.pubsub.publish( "ShowDialog", {seq:"CannotBuyTurkey", autoAdvance:true} );
		 			gameState.pubsub.publish( "Play", "Error" );
		 		}
		 		// Buy turkey first
		 		else{
		 			gameState.pubsub.publish( "ShowDialog", {seq:"BuyTurkeyFirst", autoAdvance:true} );
		 			gameState.pubsub.publish( "Play", "Error" );
		 		}
 			}
 			else{
 				gameState.pubsub.publish( "ShowDialog", {seq:"NoMoney", autoAdvance:true} );
	 			gameState.pubsub.publish( "Play", "Error" );
	 		}
 		});

 		mouseOver.visible = false;
 	var objReturn = {
		tick: function(){},
		getName: function(){return that.name;},
		delete: function( stage ){
			gameState.pubsub.publish("RemoveItems", [mouseOut, mouseOver]);

			delete gameState.marketItems[that.name];
		},
		draw: function( stage, newx, newy ){
			if( newx && newy ){
				mouseOut.x = mouseOver.x = newx;
				mouseOut.y = mouseOver.y = newy;
			}

			if( gameState.newScreen == "KitchenScreen" ){
				stage.addChild( mouseOutKitchen );
				mouseOverKitchen.visible = false;
	    		stage.addChild( mouseOverKitchen );
	    		return;
			}

			stage.addChild( mouseOut );
	    	stage.addChild( mouseOver );
		}
	}
	return objReturn;
}



function ImgButton( stage, gameState, x, y, mouseOutImg, mouseOverImg, eventCmd, arg, sound, altfunc ){
		var mouseOver = new createjs.Bitmap( mouseOverImg );
		var mouseOut = new createjs.Bitmap( mouseOutImg );
		mouseOver.x = mouseOut.x = x;
		mouseOver.y = mouseOut.y = y;
	 	mouseOut.addEventListener( "mouseover", function(){ document.body.style.cursor='pointer'; mouseOver.visible = true; mouseOut.visible = false;  } );
 		mouseOut.addEventListener( "mouseout", function(){ document.body.style.cursor='default'; mouseOver.visible = false; mouseOut.visible = true; } );
 		mouseOver.addEventListener( "mouseover", function(){ document.body.style.cursor='pointer'; mouseOver.visible = true; mouseOut.visible = false;  } );
 		mouseOver.addEventListener( "mouseout", function(){ document.body.style.cursor='default'; mouseOver.visible = false; mouseOut.visible = true; } );
 		mouseOver.addEventListener( "click", function(){
 			if( sound ){
 				gameState.pubsub.publish("Play", sound );
 			}
 			if( !altfunc){
 				gameState.pubsub.publish( eventCmd, arg );
 				return;
 			}
 			altfunc();
 		} );
 		mouseOver.visible = false;
    	stage.addChild( mouseOut );
    	stage.addChild( mouseOver );

	return {
		tick: function(){}
	}
}

function Button( stage, gameState, x_orig, y_orig, x_dest, y_dest, eventCmd, arg, altfunc ){
	var that = this;
	console.log("button clicked with "+ arg);

	var button = new createjs.Shape();
 	button.graphics.beginFill("#ffffff").drawRect(x_orig, y_orig, x_dest, y_dest);
 	button.alpha = 0.1;
 	button.addEventListener( "click", function(){ 
 		gameState.pubsub.publish( "Play", "Click" );
		if( !altfunc ){
			gameState.pubsub.publish( eventCmd, arg );
			return;
		}
		console.log(altfunc);
		altfunc();
 		gameState.pubsub.publish( eventCmd, arg );
	 } );
 	button.addEventListener( "mouseover", function(){ document.body.style.cursor='pointer'; } );
 	button.addEventListener( "mouseout", function(){ document.body.style.cursor='default'; } );
	return button;
}
