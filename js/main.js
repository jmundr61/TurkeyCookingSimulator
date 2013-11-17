function GameState(){
	var that = this;

	this.pubsub = {};
	BindPubSub( this.pubsub );
	this.currentTime = new Date().getTime();

	this.oldTime = new Date().getTime();

	this.mainUI = new GameUI( "demoCanvas", this );
    createjs.Ticker.addEventListener( "tick", gameLoop );

	function gameLoop(){
		if( ( new Date().getTime() - that.oldTime )  > 1000 ){

			// It's been at least one second, do logic loop depending on difference
			console.log("One second");

			// Maintain our own internal clock
			that.currentTime+=1000;

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
