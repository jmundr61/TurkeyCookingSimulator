function ClockUI( stage, gameState ){
	var that = this;

	this.minuteRadius = 40;
	this.hourRadius = 0.7 * this.minuteRadius;
	this.clockX = 300;
	this.clockY = 100;

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

function OvenUI( stage ){
	var that = this;

	this.ovenLight = new createjs.Shape();
	this.analogClock = "";
	this.text = new createjs.Text( "325F", "50px Arial", "#ff7700" );
	this.text.x = 70;
	this.text.y = 100;
	this.text.textBaseline = "alphabetic";

    //Create a Shape DisplayObject.
    this.circle = new createjs.Shape();
    this.circle.graphics.beginFill( "red" ).drawCircle( 0, 0, 40 );
    this.ovenLight.graphics.beginFill( "red" ).drawCircle( 223, 73, 5 );

    //Set position of Shape instance.
    this.circle.x = this.circle.y = 50;

    this.picture = new createjs.Bitmap( "res/Base_Game_Screen.png" );
    //this.picture.scaleX = this.picture.scaleY = 0.5;
    stage.addChild( this.picture );
    stage.addChild( this.circle );
    stage.addChild( this.ovenLight );
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
