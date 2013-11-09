function GameState(){
	var that = this;

	this.pubsub = {};
	BindPubSub( this.pubsub );

	this.oldTime = new Date().getTime();

	this.mainUI = new GameUI( "demoCanvas", this );
    createjs.Ticker.addEventListener( "tick", gameLoop );

	function gameLoop(){
		if( ( new Date().getTime() - that.oldTime )  > 1000 ){
			// It's been at least one second, do logic loop depending on difference
			console.log("One second");
			that.oldTime = new Date().getTime();
		}
		that.mainUI.draw();
	}

	return {
		"main": this
	}
}

function GameUI( canvasElem, gameState ){
	var that = this;

	this.stage = new createjs.Stage( canvasElem );
	this.activeScreenName = "EndingScreen";
	this.activeScreenObj = {};

	/* Initialize All Screens */
	this.screens = {
		"LoadingTitleScreen" : LoadingTitleScreen,
		"InfoHelpScreen" 	 : InfoHelpScreen,
		"MainScreen" 	 	 : MainScreen,
		"DifficultyScreen" 	 : DifficultyScreen,
		"KitchenScreen"		 : KitchenScreen,
		"MarketScreen"		 : MarketScreen,
		"TurkeyOutScreen"	 : TurkeyOutScreen,
		"EndingScreen"		 : EndingScreen,
		"ScoreScreen"		 : ScoreScreen,
		"CreditsScreen"		 : CreditsScreen
	}

	this.activeScreenObj = new MainScreen( this.stage, gameState );

	this.switchScreen = function( screenName ){
		console.log("Switch screen called with" + screenName);
		that.stage.removeAllChildren();
		that.activeScreenObj = new that.screens[ screenName ]( that.stage, gameState );
	}

	gameState.pubsub.subscribe( "SwitchScreen", this.switchScreen );

	return {
		draw : function(){
			that.activeScreenObj.blit();
			that.stage.update();
		}
	}
}

/* Screens, inheritance would be nice */
function LoadingTitleScreen( stage, gameState ){
	var that = this;
    this.picture = new createjs.Bitmap( "res/Loading-Title.png" );
    this.ovenLight = new createjs.Shape();
    this.ovenLight.graphics.beginFill( "red" ).drawCircle( 396, 318, 5 );
    this.ovenLight.addEventListener( "click", function(){alert("hello world")});

    stage.addChild( this.picture );
	stage.addChild( this.ovenLight );

    this.uiElems = [];
	this.uiElems.push( new DialogUI( stage ) );

	return {
		blit : function(){

			// Draw all the uiElements
	        for( var index in that.uiElems ){
				that.uiElems[ index ].tick();
			}
		}
	}
}

function InfoHelpScreen( stage, gameState ){
		var that = this;

    this.background = new createjs.Bitmap( "res/Main.png" );
    stage.addChild( this.background );

    this.uiElems = [];
    return {
		blit : function(){

			// Draw all the uiElements
	        for( var index in that.uiElems ){
				that.uiElems[ index ].tick();
			}
		}
	}


}

function MainScreen( stage, gameState ){
	var that = this;

    this.background = new createjs.Bitmap( "res/Main.png" );
    stage.addChild( this.background );

    // buttons info/credits/start
    var infoButton = new createjs.Shape();
 	infoButton.graphics.beginFill("#ffffff").drawRect(13, 445, 222, 65);
 	infoButton.alpha = 0.1;
 	infoButton.addEventListener( "click", function(){ gameState.pubsub.publish( "SwitchScreen", "InfoHelpScreen" ) } );

 	var creditsButton = new createjs.Shape();
 	creditsButton.graphics.beginFill("#ffffff").drawRect(13, 515, 222, 65);
 	creditsButton.alpha = 0.1;
 	creditsButton.addEventListener( "click",  function(){ gameState.pubsub.publish( "SwitchScreen", "CreditsScreen" ) } );

	var startButton = new createjs.Shape();
 	startButton.graphics.beginFill("#ffffff").drawRect(564, 520, 222, 65);
 	startButton.alpha = 0.1;
 	startButton.addEventListener( "click",  function(){ gameState.pubsub.publish( "SwitchScreen", "DifficultyScreen" ) } );

 	stage.addChild( infoButton );
 	stage.addChild( creditsButton );
 	stage.addChild( startButton );
    this.uiElems = [];

    return {
		blit : function(){

			// Draw all the uiElements
	        for( var index in that.uiElems ){
				that.uiElems[ index ].tick();
			}
		}
	}

//start button

}

function DifficultyScreen( stage, gameState ){
	var that = this;

	this.background = new createjs.Bitmap( "res/Difficulty-Selection.png" );
    stage.addChild( this.background );

    var easyButton = new createjs.Shape();
 	easyButton.graphics.beginFill("#ffffff").drawRect(170, 40, 450, 105);
 	easyButton.alpha = 0.1;
 	easyButton.addEventListener( "click",  function(){ gameState.pubsub.publish( "SwitchScreen", "KitchenScreen" ) } );

    var hardButton = new createjs.Shape();
 	hardButton.graphics.beginFill("#ffffff").drawRect(170, 150, 450, 105);
 	hardButton.alpha = 0.1;
 	hardButton.addEventListener( "click",  function(){ gameState.pubsub.publish( "SwitchScreen", "KitchenScreen" ) } );

 	stage.addChild( easyButton );
 	stage.addChild( hardButton );

	return {
		blit : function(){

			// Draw all the uiElements
	        for( var index in that.uiElems ){
				that.uiElems[ index ].tick();
			}
		}
	}
}

function KitchenScreen( stage, gameState ){
	var that = this;
	this.uiElems = [];

	this.uiElems.push( new OvenUI( stage ) );
	this.uiElems.push( new DialogUI( stage ) );

	return {
		blit : function(){

			// Draw all the uiElements
	        for( var index in that.uiElems ){
				that.uiElems[ index ].tick();
			}
		}
	}
}

function MarketScreen( stage, gameState ){
	var that = this;

    this.background = new createjs.Bitmap( "res/Main.png" );
    stage.addChild( this.background );

    this.uiElems = [];
    return {
		blit : function(){

			// Draw all the uiElements
	        for( var index in that.uiElems ){
				that.uiElems[ index ].tick();
			}
		}
	}


}

function TurkeyOutScreen( stage, gameState ){
		var that = this;

    this.background = new createjs.Bitmap( "res/Main.png" );
    stage.addChild( this.background );

    this.uiElems = [];
    return {
		blit : function(){

			// Draw all the uiElements
	        for( var index in that.uiElems ){
				that.uiElems[ index ].tick();
			}
		}
	}


}

function EndingScreen( stage, gameState ){
		var that = this;

    this.background = new createjs.Bitmap( "res/Main.png" );
    stage.addChild( this.background );

    this.uiElems = [];
    return {
		blit : function(){

			// Draw all the uiElements
	        for( var index in that.uiElems ){
				that.uiElems[ index ].tick();
			}
		}
	}


}

function ScoreScreen( stage, gameState ){
		var that = this;

    this.background = new createjs.Bitmap( "res/Main.png" );
    stage.addChild( this.background );

    this.uiElems = [];
    return {
		blit : function(){

			// Draw all the uiElements
	        for( var index in that.uiElems ){
				that.uiElems[ index ].tick();
			}
		}
	}

	// Retry Button
}

function CreditsScreen( stage, gameState ){
		var that = this;

    this.background = new createjs.Bitmap( "res/Main.png" );
    stage.addChild( this.background );

    this.uiElems = [];
    return {
		blit : function(){

			// Draw all the uiElements
	        for( var index in that.uiElems ){
				that.uiElems[ index ].tick();
			}
		}
	}
	//
}

/* Object models */
function TurkeyModel( weight ){
	this.weight = weight;
}

function OvenModel(){
	this.temperature = "";
}


function GameModel(){
	this.timeElapsed = 0;
	this.ovenModel = new OvenModel();
	this.turkeyModel = new TurkeyModel();
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

function DialogUI( stage ){
	var that = this;
	// Dialog States
	var DIALOG_RECEDING = 0;
	var DIALOG_SHOWING = 1;
	var DIALOG_PAUSING = 2;

	this.dialogSpeed = 15;
	this.dialogState = DIALOG_PAUSING;

	this.dialogMotionQueue = [DIALOG_RECEDING,DIALOG_SHOWING,DIALOG_RECEDING];
	dialogQueue = [];


	// Replace with bitmap
	this.dialogBox = new createjs.Shape();
	this.dialogBox.graphics.beginFill( "#00ffff" ).drawRect( 0, 450, 800, 150 );

	this.textContent = new createjs.Text( "Hello World This is some conversation text", "20px Arial", "#ff7700" );
	this.textContent.x = 50;
	this.textContent.y = 500;
	this.textContent.textBaseline = "alphabetic";

	stage.addChild( this.dialogBox );
	stage.addChild( this.textContent );

    return {
    	tick: function(){

    		if( that.dialogState == DIALOG_RECEDING ){
	    		that.dialogBox.y+=that.dialogSpeed;
	    		that.textContent.y +=that.dialogSpeed;
	    		console.log( "Receding" + that.dialogBox.y );
    		}
    		if( that.dialogState == DIALOG_SHOWING ){
    			that.dialogBox.y-=that.dialogSpeed;
    			that.textContent.y -=that.dialogSpeed;
    			console.log( "Advancing" + that.dialogBox.y );
    		}

    		// toggle states
    		if( that.dialogBox.y > 150 && that.dialogState == DIALOG_RECEDING ){
    			that.dialogBox.y = 150;
    			that.textContent.y = 650;
    			that.dialogState = DIALOG_PAUSING;
    			console.log( "Pausing on recede" + that.dialogBox.y );

    		}
    		if( that.dialogBox.y < 0 && that.dialogState == DIALOG_SHOWING ){
    			that.dialogBox.y = 0;
    			that.textContent.y = 500;
    			that.dialogState = DIALOG_PAUSING;
    			console.log( "Pausing on showing" + that.dialogBox.y );
    		}

    		/* next states if there are any on the queue */
    		if( that.dialogMotionQueue.length > 0 && that.dialogState == DIALOG_PAUSING ){
    			that.dialogState = that.dialogMotionQueue.pop();
    		}
    	},

    	minDialog: function(){
    		that.dialogMotionQueue.push( DIALOG_RECEDING );
    	},

    	maxDialog: function(){
    		that.dialogMotionQueue.push( DIALOG_SHOWING );
    	},
	}
}

function Dialogue( character, text ){
	var that = this;
	this.text = text;
	this.character = character;

	return {
		getText: function(){
			return that.text;
		},

		getCharacter: function(){
			return that.character;
		},

		getDuration: function(){

		// length of text, for each dialog
		},
	}
	// Render one character at a time
}

function BindPubSub( obj ){
	(function(q) {
	    var topics = {}, subUid = -1;
	    q.subscribe = function(topic, func) {
	        if (!topics[topic]) {
	            topics[topic] = [];
	        }
	        var token = (++subUid).toString();
	        topics[topic].push({
	            token: token,
	            func: func
	        });
	        return token;
	    };

	    q.publish = function(topic, args) {
	        if (!topics[topic]) {
	            return false;
	        }
	        setTimeout(function() {
	            var subscribers = topics[topic],
	                len = subscribers ? subscribers.length : 0;

	            while (len--) {
	                subscribers[len].func(args);
	            }
	        }, 0);
	        return true;

	    };

	    q.unsubscribe = function(token) {
	        for (var m in topics) {
	            if (topics[m]) {
	                for (var i = 0, j = topics[m].length; i < j; i++) {
	                    if (topics[m][i].token === token) {
	                        topics[m].splice(i, 1);
	                        return token;
	                    }
	                }
	            }
	        }
	        return false;
	    };
	}(obj));
}
