function GameState(){
	var that = this;

	this.pubsub = {};
	BindPubSub( this.pubsub );
	this.currentTime = new Date().getTime();
	this.oldTime = new Date().getTime();

    // Load all our resources:
    var queue = new createjs.LoadQueue(true);
    queue.installPlugin(createjs.Sound);
    //queue.addEventListener("fileload", handleFileComplete);
    queue.loadFile( {id: "TitleMusicFile", src:"res/sound/turkey_in_the_straw.mp3"} );
    queue.loadFile( {id: "MarketBackgroundSoundFile", src:"res/sound/supermarket.mp3"} );
    queue.loadFile( {id: "MarketBackgroundSoundFile", src:"res/items/FrillsBox.png"} );

    this.screenState = 0;
    this.newScreen = "";


    // Game State flags
    this.turkeyBought = false;
	this.marketItems = {
		"FrillsBox" : new MarketItem( this, "FrillsBox", 133,92, 100, "res/items/FrillsBox.png", "res/items/FrillsBoxGlow.png" ),
	    "TuTempProberkey" : new MarketItem( this, "TuTempProberkey", 200, 57, 100, "res/items/TempProbe.png", "res/items/TempProbeGlow.png" ),
	    "OvenLightBox" : new MarketItem( this, "OvenLightBox", 131,222, 100, "res/items/OvenLightBox.png", "res/items/OvenLightBoxGlow.png" ),

	    "Alarm" : new MarketItem( this, "Alarm", 173,248, 100, "res/items/Alarm.png", "res/items/AlarmGlow.png" ),
		"Cookbook" : new MarketItem( this, "Cookbook", 283,203, 100, "res/items/Cookbook1.png", "res/items/Cookbook1Glow.png" ),
	    "StuffingRepurposed" : new MarketItem( this, "StuffingRepurposed",  510,197, 100, "res/items/StuffingRepurposed.png", "res/items/StuffingRepurposedGlow.png" ),
	    "StuffingExquisite" : new MarketItem( this, "StuffingExquisite", 458,210, 100, "res/items/StuffingExquisite.png", "res/items/StuffingExquisiteGlow.png" ),
	    "StuffingSpecial" : new MarketItem( this, "StuffingSpecial", 390,220, 100, "res/items/StuffingSpecial.png", "res/items/StuffingSpecialGlow.png" ),

	    "Turkey1" : new MarketItem( this, "Turkey1", 170,350, 100, "res/items/Turkey5.png", "res/items/Turkey5Glow.png" ),
	    "Turkey2": new MarketItem( this, "Turkey2", 540,320, 100, "res/items/Turkey4.png", "res/items/Turkey4Glow.png" ),
	    "Turkey3" : new MarketItem( this, "Turkey3", 265,415, 100, "res/items/Turkey3.png", "res/items/Turkey3Glow.png" ),
	    "Turkey4": new MarketItem( this, "Turkey4", 474,357, 100, "res/items/Turkey2.png", "res/items/Turkey2Glow.png" ),
		"Turkey5": new MarketItem( this, "Turkey5", 368,426, 100, "res/items/Turkey1.png", "res/items/Turkey1Glow.png" )
	};

	this.purchasedItems = [];
	
	// did we already show the player the kitchen intro?
	this.kitchenIntro = false;

	this.mainUI = new GameUI( "demoCanvas", this );
    createjs.Ticker.addEventListener( "tick", gameLoop );

	function gameLoop(){
		that.mainUI.draw();
	}

	return {
	//	"main": this
	}
}
/*
	createjs.Sound.registerSound("res/sound/supermarket.mp3", "TitleMusic");
	var backgroundSound = createjs.Sound.createInstance("TitleMusic");  // play using id.  Could also use full sourcepath or event.src.
	var backgroundSounds = createjs.Sound.createInstance("TitleMusic");
	backgroundSound.setPosition(0);
	backgroundSound.volume = 1;
	setTimeout(function(){ backgroundSounds.play();},2000);

	backgroundSound.play();

	// loop-de-loop
 	backgroundSound.addEventListener("complete", playAgain);
 	backgroundSound.addEventListener("complete", playAgainMe);
 	function playAgain(event) {
 		backgroundSound.setPosition(0);
     	backgroundSound.play();
     	
 	}
 	function playAgainMe(event){
 		setTimeout(function(){ backgroundSounds.play();},1000);
 	}
*/

function GameUI( canvasElem, gameState ){
	var that = this;

	var SCREEN_OUT = 1;
	var SCREEN_IN  = 2;
	var SCREEN_STABLE = 0;

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

	this.activeScreenObj = new MarketScreen( this.stage, gameState );
	var textContent = new createjs.Text( "", "20px Arial", "#00000000" );
	textContent.x = 750;
	textContent.y = 30;
	this.stage.addChild( textContent);
	var overlay = new createjs.Shape();
 	overlay.graphics.beginFill("#fffffff").drawRect(0, 0, 800, 600 );
 	overlay.alpha = 0;
	this.stage.addChild(overlay);

	var soundManager = new SoundManager( gameState );

	// delay for fade in and fade-out
	this.switchScreen = function( screenName ){
		gameState.screenState = SCREEN_OUT;
		gameState.pubsub.publish( "FadeOut", "" );
		console.log("Switch screen called with" + screenName);
		gameState.newScreen = screenName;
	};
	this.actuallySwitchScreen = function( screenName ){
		that.stage.removeAllChildren();
		that.activeScreenObj = new that.screens[ screenName ]( that.stage, gameState );
		that.stage.addChild( textContent );
		that.stage.addChild( overlay );
	};

	gameState.pubsub.subscribe( "SwitchScreen", this.switchScreen );
	gameState.pubsub.subscribe( "ActuallySwitchScreen", this.actuallySwitchScreen );

	// Allow items to be removed if they don't have access to stage
	gameState.pubsub.subscribe("RemoveItems", function(items){
		for (var index in items ){
			that.stage.removeChild(items[index]);
		}
	});

	return {
		draw : function(){
			if( gameState.screenState == SCREEN_OUT ){
				overlay.alpha +=0.3;
			}
			if( gameState.screenState == SCREEN_IN ){
				overlay.alpha -=0.3;
			}
			if( overlay.alpha > 1.0 ){
				gameState.screenState = SCREEN_IN;
				overlay.alpha = 1;
				gameState.pubsub.publish( "ActuallySwitchScreen", gameState.newScreen );
			}
			if( overlay.alpha  < 0.0 ){
				gameState.screenState = SCREEN_STABLE;
				overlay.alpha = 0;
			}
			soundManager.tick();
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
	var MILLIS_PER_CHAR = 100;

	this.dialogSpeed = 30;
	this.dialogState = DIALOG_PAUSING;

	this.dialogMotionQueue = [DIALOG_SHOWING];
	this.currDialogueSeq = new DialogueSequence();
	dialogQueue = [];

	this.dialogBox = new createjs.Bitmap("res/DialogueBox.png");
	this.dialogBox.x = 10;
	this.dialogBox.y = 675;

	this.textContent = new createjs.Text( "Hey there kids!", "24px Arial", "#00000000" );
	this.textContent.x = 205;
	this.textContent.y = 705;
	this.textContent.lineWidth = 565;
	this.textContent.lineHeight = 30;
	this.textContent.textBaseline = "alphabetic";

	this.dialogBox.addEventListener( "mouseover", function(){ document.body.style.cursor='pointer'; } );
 	this.dialogBox.addEventListener( "mouseout", function(){ document.body.style.cursor='default'; } );
 	this.dialogBox.addEventListener( "click",  function(){ setTimeout( clickEvent, 100); });

	this.textContent.addEventListener( "mouseover", function(){ document.body.style.cursor='pointer'; } );
 	this.textContent.addEventListener( "mouseout", function(){ document.body.style.cursor='default'; } );
 	this.textContent.addEventListener( "click", function(){ setTimeout( clickEvent, 100); });


 	// negate double setTimeout if clicked
 	var oldTime = new Date().getTime();
 	var delayCounter = 0;
 	var clickEvent = function( timer ){

 		// if there is more dialogue text, then keep going, otherwise, recede
 		if( that.currDialogueSeq.more() ){
 			setTimeout( function(){ that.dialogMotionQueue.push(DIALOG_SHOWING) }, 1000);
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
    			that.textContent.y = 480;
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
