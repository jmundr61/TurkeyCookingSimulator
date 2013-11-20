function GameState(){
	var that = this;

	var SCREEN_OUT = 1;
	var SCREEN_IN  = 2;
	var SCREEN_STABLE = 0;
	var screenAlpha = 1;

	this.pubsub = {};
	BindPubSub( this.pubsub );
	this.currentTime = new Date().getTime();
	this.oldTime = new Date().getTime();

	this.mainUI = new GameUI( "demoCanvas", this );
    createjs.Ticker.addEventListener( "tick", gameLoop );


    // Load all our resources:
    var queue = new createjs.LoadQueue(true);
    queue.installPlugin(createjs.Sound);
    //queue.addEventListener("fileload", handleFileComplete);
    queue.loadFile( {id: "sound", src:"res/sound/turkey_in_the_straw.mp3"} );

    this.screenState = 0;

	function gameLoop(){
		that.mainUI.draw();
	}

	return {
		"main": this
	}
}

function GameUI( canvasElem, gameState ){
	var that = this;

	this.stage = new createjs.Stage( canvasElem );
	this.stage.enableMouseOver(20);

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

	this.activeScreenObj = new KitchenScreen( this.stage, gameState );
	var textContent = new createjs.Text( "", "16px Arial", "#00000000" );
	textContent.x = 750;
	textContent.y = 30;
	that.stage.addChild( textContent);

	this.switchScreen = function( screenName ){
		//gameState.screenState = SCREEN_OUT;

		console.log("Switch screen called with" + screenName);
		that.stage.removeAllChildren();
		that.activeScreenObj = new that.screens[ screenName ]( that.stage, gameState );
		//var rect = new createjs.Rectangle(0, 0, 100, 100);
		that.stage.addChild( textContent );
	}


	gameState.pubsub.subscribe( "SwitchScreen", this.switchScreen );

	return {
		draw : function(){
			that.activeScreenObj.blit();
			textContent.text = createjs.Ticker.getMeasuredFPS().toFixed(1);
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
	var MILLIS_PER_CHAR = 50;

	this.dialogSpeed = 30;
	this.dialogState = DIALOG_PAUSING;

	this.dialogMotionQueue = [DIALOG_RECEDING,DIALOG_SHOWING,DIALOG_PAUSING];
	this.currDialogueSeq = new DialogueSequence();
	dialogQueue = [];


	this.dialogBox = new createjs.Bitmap("res/DialogueBox.png");
	this.dialogBox.x = 10;
	this.dialogBox.y = 435;

	this.textContent = new createjs.Text( "Hey there kids!", "16px Arial", "#00000000" );
	this.textContent.x = 195;
	this.textContent.y = 475;
	this.textContent.lineWidth = 600;
	this.textContent.lineHeight = 30;
	this.textContent.textBaseline = "alphabetic";

	this.dialogBox.addEventListener( "mouseover", function(){ document.body.style.cursor='pointer'; } );
 	this.dialogBox.addEventListener( "mouseout", function(){ document.body.style.cursor='default'; } );
 	this.dialogBox.addEventListener( "click",  function(){ clickEvent(); });

	this.textContent.addEventListener( "mouseover", function(){ document.body.style.cursor='pointer'; } );
 	this.textContent.addEventListener( "mouseout", function(){ document.body.style.cursor='default'; } );
 	this.textContent.addEventListener( "click", function(){ clickEvent(); });


 	// negate double setTimeout if clicked
 	var oldTime = new Date().getTime();
 	var delayCounter = 0;
 	var clickEvent = function( timer ){

 		// if there is more dialogue text, then keep going, otherwise, recede
 		if( that.currDialogueSeq.more() ){
 			that.dialogMotionQueue.push(DIALOG_SHOWING);
 			that.textContent.text=that.currDialogueSeq.next();
 			delayCounter = 0;
 			oldTime = new Date().getTime()
 		}else{
 			// pause and close dialog
 			setTimeout( function(){that.dialogMotionQueue.push(DIALOG_RECEDING)}, 1000 );
 		}
 	}
	stage.addChild( this.dialogBox );
	stage.addChild( this.textContent );

    return {
    	tick: function(){
    		delayCounter = new Date().getTime() - oldTime;

    		if(that.dialogBox.y ==435 && delayCounter > ( that.textContent.text.length * MILLIS_PER_CHAR ) ){
    			clickEvent();
    		}
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
    		if( that.dialogBox.y > 675 && that.dialogState == DIALOG_RECEDING ){
    			that.dialogBox.y = 675;
    			that.textContent.y = 705;
    			that.dialogState = DIALOG_PAUSING;
    			console.log( "Pausing on recede" + that.dialogBox.y );

    		}
    		if( that.dialogBox.y < 435 && that.dialogState == DIALOG_SHOWING ){
    			that.dialogBox.y = 435;
    			that.textContent.y = 465;
    			that.dialogState = DIALOG_PAUSING;
    			console.log( "Pausing on showing" + that.dialogBox.y );
    		}

    		/* next states if there are any on the queue */
    		if( that.dialogMotionQueue.length > 0 && that.dialogState == DIALOG_PAUSING ){
    			that.dialogState = that.dialogMotionQueue.shift();
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
