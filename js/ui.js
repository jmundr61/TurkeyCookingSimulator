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

function OvenUI( stage, gameState ){
	var that = this;
	var OVEN_CLOSED = 0;
	var OVEN_PEEK = 1;
	var OVEN_OPEN = 2;

	this.ovenDoor = OVEN_CLOSED;

	// Important Model
	var ovenModel = new OvenModel( 8, gameState );

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

	gameState.pubsub.subscribe( "OvenLight", this.changeOvenLight );

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

	this.changeTemperature = function( direction ){

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

	this.ovenLightToggle = function(){

		lightPressedImg.alpha = lightPressedImg.alpha == 0 ? 1 : 0;
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
			handleBar.y = 330;
		}else if (that.ovenDoor == OVEN_OPEN ){
			that.ovenDoor = OVEN_PEEK;
			ovenPeek();
		}
	}

	handleBar.addEventListener( "click", ovenPeek );

	function ovenPeek(){
		if( that.ovenDoor == OVEN_CLOSED || that.ovenDoor == OVEN_OPEN ){
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
			doorOpen.alpha = 0;
			handleBar.y = 0;
		}
	}
	// change temperature, this one's for the UI
    gameState.pubsub.subscribe( "ChangeTemperature", this.changeTemperature );
    gameState.pubsub.subscribe( "OvenLightToggle", this.ovenLightToggle );

    this.secondTick = function(){
    		ovenModel.secondTick();
    		gameState.currentTime += 1000;
	}

    setInterval(this.secondTick, 1000);

    stage.addChild( this.text );
    stage.addChild(lightPressedImg);
	// Turkey goes here

	stage.addChild(doorPeekLightOn);
    stage.addChild(doorPeekLightOff);

    stage.addChild(doorClosedLightOn);
    stage.addChild(doorClosedLightOff);

    stage.addChild(doorOpen);
	stage.addChild(handleBar);

    return {
    	tick: function(){},
    	render: function(){
		    //Set position of Shape instance.
		    stage.addChild( ovenLight );
		    stage.addChild( new Button( stage, gameState, 45, 163, 41, 17, "ChangeTemperature", "Up" ) );
		    stage.addChild( new Button( stage, gameState, 95, 163, 41, 17, "ChangeTemperature", "Down" ) );
		    stage.addChild( new Button( stage, gameState, 145, 163, 41, 17, "OvenLightToggle", "" ) );
		    stage.addChild( temperatureText );
    		return this;
    	}
	}
}

function WindowUI( stage, gameState ){
return {
	tick: function(){}
}
}

function MarketItem( gameState, name, x, y, cost, mouseOutImg, mouseOverImg, funnyDescription, weight ){
	var that = this;
	console.log("Loading market item" + name);
		this.name = name;
		this.bought = false;
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
 		mouseOver.addEventListener( "click", function(){
 			if(!that.bought && cost <= gameState.wallet ){
 				console.log(that.name);
	 			if( that.name.indexOf("Turkey") != -1 && gameState.turkeyBought != true){
	 				gameState.turkeyBought = true;
				    gameState.marketItems[ that.name ].delete();
				    gameState.pubsub.publish("Play", {name:"Buy", volume:0.7} );
				    gameState.pubsub.publish("WalletAmount", gameState.wallet - Math.abs(cost))
	 			}
	 			// can we buy this? Only possible if you already bought a turkey
	 			else if( !that.name.indexOf("Turkey") != -1 && gameState.turkeyBought == true ){
		 			gameState.purchasedItems.push( objReturn );
		 			gameState.marketItems[ that.name ].delete();
		 			that.bought = true;
		 			gameState.pubsub.publish("Play", {name:"Buy", volume:0.7});
		 			gameState.pubsub.publish("WalletAmount", gameState.wallet - Math.abs(cost));
		 		}
		 		// One turkey only
		 		else if( that.name.indexOf("Turkey") != -1 && gameState.turkeyBought == true ){
		 			gameState.pubsub.publish( "ShowDialog", {seq:"CannotBuyTurkey", autoAdvance:false} );
		 			gameState.pubsub.publish( "Play", "Error" );
		 		}
		 		// Buy turkey first
		 		else{
		 			gameState.pubsub.publish( "ShowDialog", {seq:"BuyTurkeyFirst", autoAdvance:false} );
		 			gameState.pubsub.publish( "Play", "Error" );
		 		}
 			}
 			else{
 				gameState.pubsub.publish( "ShowDialog", {seq:"NoMoney", autoAdvance:false} );
	 			gameState.pubsub.publish( "Play", "Error" );
	 		}
 		});

 		mouseOver.visible = false;
 	var objReturn = {
		tick: function(){},
		getName: function(){return that.name;},
		delete: function( stage ){
			gameState.pubsub.publish("RemoveItems", [mouseOut, mouseOver]);
		},
		draw: function( stage, newx, newy ){
			if( newx && newy ){
				mouseOut.x = mouseOver.x = newx;
				mouseOut.y = mouseOver.y = newy;
			}
			stage.addChild( mouseOut );
	    	stage.addChild( mouseOver );
		}
	}
	return objReturn;
}



function ImgButton( stage, gameState, x, y, mouseOutImg, mouseOverImg, eventCmd, arg, sound ){
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
 			gameState.pubsub.publish( eventCmd, arg )
 		} );
 		mouseOver.visible = false;
    	stage.addChild( mouseOut );
    	stage.addChild( mouseOver );

	return {
		tick: function(){}
	}
}

function Button( stage, gameState, x_orig, y_orig, x_dest, y_dest, eventCmd, arg ){
	var that = this;

	var button = new createjs.Shape();
 	button.graphics.beginFill("#ffffff").drawRect(x_orig, y_orig, x_dest, y_dest);
 	button.alpha = 0.5;
 	button.addEventListener( "click", function(){ gameState.pubsub.publish( eventCmd, arg ) } );
 	button.addEventListener( "mouseover", function(){ document.body.style.cursor='pointer'; } );
 	button.addEventListener( "mouseout", function(){ document.body.style.cursor='default'; } );
 	gameState.pubsub.publish( "Play", "Click" );
	return button;

}