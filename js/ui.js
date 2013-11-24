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

    //Create a Shape DisplayObject.
    this.circle = new createjs.Shape();
    this.circle.graphics.beginFill( "red" ).drawCircle( 0, 0, 40 );
    this.circle.x = 0;
    this.circle.y = 0;



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

    // change temperature, this one's for the UI
    gameState.pubsub.subscribe( "ChangeTemperature", this.changeTemperature );

    this.secondTick = function(){
    		ovenModel.secondTick();
    		gameState.currentTime += 1000;
	}

    setInterval(this.secondTick, 1000);

    stage.addChild( this.text );

    return {
    	tick: function(){
    		// Circle will move 10 units to the right.
        	that.circle.x += 1;

        	// Will cause the circle to wrap back
        	if ( that.circle.x > stage.canvas.width ) { that.circle.x = 0; }
    	},
    	render: function(){
		    //Set position of Shape instance.
		    stage.addChild( that.circle );
		    stage.addChild( ovenLight );
		    stage.addChild( new Button( stage, gameState, 45, 163, 41, 17, "ChangeTemperature", "Up" ) );
		    stage.addChild( new Button( stage, gameState, 95, 163, 41, 17, "ChangeTemperature", "Down" ) );
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

function MarketItem( gameState, name, x, y, cost, mouseOutImg, mouseOverImg ){
	var that = this;
		this.name = name;
		this.bought = false;
		var mouseOver = new createjs.Bitmap( mouseOverImg );
		var mouseOut = new createjs.Bitmap( mouseOutImg );
		mouseOver.x = mouseOut.x = x;
		mouseOver.y = mouseOut.y = y;
	 	mouseOut.addEventListener( "mouseover", function(){ document.body.style.cursor='pointer'; mouseOver.visible = true; mouseOut.visible = false; gameState.pubsub.publish("ShowPrice", cost ); } );
 		mouseOut.addEventListener( "mouseout", function(){ document.body.style.cursor='default'; mouseOver.visible = false; mouseOut.visible = true; gameState.pubsub.publish("ShowPrice", "" ); } );
 		mouseOver.addEventListener( "mouseover", function(){ document.body.style.cursor='pointer'; mouseOver.visible = true; mouseOut.visible = false;  gameState.pubsub.publish("ShowPrice", cost ); } );
 		mouseOver.addEventListener( "mouseout", function(){ document.body.style.cursor='default'; mouseOver.visible = false; mouseOut.visible = true; gameState.pubsub.publish("ShowPrice", "" );} );
 		mouseOver.addEventListener( "click", function(){
 			if(!that.bought && cost <= gameState.wallet ){
	 			if( that.name.indexOf("Turkey") == 0 && gameState.turkeyBought != true){
	 				gameState.turkeyBought = true;
				    gameState.marketItems[ that.name ].delete();
				    gameState.pubsub.publish("Play", {name:"Buy", volume:0.7} );
				    gameState.pubsub.publish("WalletAmount", gameState.wallet - Math.abs(cost))
	 			}
	 			// can we buy this? Only possible if you already bought a turkey
	 			else if( !that.name.indexOf("Turkey") ==  0 && gameState.turkeyBought == true ){
		 			gameState.purchasedItems.push( objReturn );
		 			gameState.marketItems[ that.name ].delete();
		 			that.bought = true;
		 			gameState.pubsub.publish("Play", {name:"Buy", volume:0.7});
		 			gameState.pubsub.publish("WalletAmount", gameState.wallet - Math.abs(cost));
		 		}
		 		// One turkey only
		 		else if( that.name.indexOf("Turkey") == 0 && gameState.turkeyBought == true ){
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