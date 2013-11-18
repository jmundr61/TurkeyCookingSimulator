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

	var temperatureText = new createjs.Text( "325", "40px Arial", "#ff7700" );
	temperatureText.x = 50;
	temperatureText.y = 147;
	temperatureText.textBaseline = "alphabetic";

    //Create a Shape DisplayObject.
    this.circle = new createjs.Shape();
    this.circle.graphics.beginFill( "red" ).drawCircle( 0, 0, 40 );
    this.circle.x = 0;
    this.circle.y = 0;

    //Set position of Shape instance.
    stage.addChild( this.circle );
    stage.addChild( ovenLight );
    stage.addChild( new Button( stage, gameState, 45, 163, 41, 17, "ChangeTemperature", "Up" ) );
    stage.addChild( new Button( stage, gameState, 95, 163, 41, 17, "ChangeTemperature", "Down" ) );
    stage.addChild( temperatureText );

	this.changeTemperature = function( direction ){

		if( temperatureText.text == "OFF" && direction == "Up" ) temperatureText.text = "150";
		if( !( temperatureText.text == "OFF" && direction == "Down" ) ){

			var temp = ( direction == "Up" ? parseInt(temperatureText.text)+25 : parseInt(temperatureText.text)-25);

			 // Check lower bound for OFF
			 temp = temp < 150 ? temp = "OFF" : temp;

			 // Check upper bound
			 // Set up to 500, then it's BROIL @ 980

			 temperatureText.text = temp;
		}

		 // Tell our model to set the actual temperature
		 ovenModel.changeTemp( UtilityFunctions.F2C( temperatureText.text == "OFF" ? 150 : parseInt( temperatureText.text ) ) );
	}

    // change temperature, this one's for the UI
    gameState.pubsub.subscribe( "ChangeTemperature", this.changeTemperature );

    this.secondTick = function(){
    		ovenModel.secondTick();
    		gameState.currentTime += 1000;
	}

    setInterval(this.secondTick, 500);
    
    stage.addChild( this.text );

    return {
    	tick: function(){
    		// Circle will move 10 units to the right.
        	that.circle.x += 1;

        	// Will cause the circle to wrap back
        	if ( that.circle.x > stage.canvas.width ) { that.circle.x = 0; }
    	}
	}
}

function WindowUI( stage, gameState ){
return {
	tick: function(){}
}
}

function Item(){
		/*img.onPress = function(e) {
	    document.body.style.cursor='move';
	    offset = {x:e.stageX - e.target.x, y:e.stageY - e.target.y};

	    e.onMouseMove = drag;
	}*/

}

function Button( stage, gameState, x_orig, y_orig, x_dest, y_dest, eventCmd, arg ){
	var that = this;

	var infoButton = new createjs.Shape();
 	infoButton.graphics.beginFill("#ffffff").drawRect(x_orig, y_orig, x_dest, y_dest);
 	infoButton.alpha = 0.5;
 	infoButton.addEventListener( "click", function(){ gameState.pubsub.publish( eventCmd, arg ) } );

	infoButton.onMouseOver = function(e) {
		alert("mouseover");
    	document.body.style.cursor='pointer';
	}

	infoButton.onMouseOut = function(e) {
	    document.body.style.cursor='default';
	}

	return infoButton;

}