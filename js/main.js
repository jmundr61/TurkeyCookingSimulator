function GameState(){
	var that = this;

	this.pubsub = {};
	BindPubSub( this.pubsub );
	this.currentTime = new Date().getTime();
	this.oldTime = new Date().getTime();

	this.name = "";
	this.gender = "";
	this.wallet = 1000;

    // Load all our resources:
    var queue = new createjs.LoadQueue(true);
    queue.addEventListener("progress", function(event){
    	that.pubsub.publish("Load", (event.progress*100/25));
    });

    that.mainUI = new GameUI( "demoCanvas", that );
    createjs.Ticker.addEventListener( "tick", gameLoop );
    queue.addEventListener("complete", function(event){
    	// Finished loading
    });
    queue.installPlugin(createjs.Sound);

    //
    queue.loadFile( {id: "DialogueBoxFile", src:"res/screens/GUI/DialogueBox.png"} );
    /*queue.loadFile( {id:"res/screens/LoadingScreen/Turkey0.png", src: "res/screens/LoadingScreen/Turkey0.png"} );
    queue.loadFile( {id:"res/screens/LoadingScreen/Turkey25.png", src: "res/screens/LoadingScreen/Turkey25.png"} );
    queue.loadFile( {id:"res/screens/LoadingScreen/Turkey50.png", src: "res/screens/LoadingScreen/Turkey50.png"} );
    queue.loadFile( {id:"res/screens/LoadingScreen/Turkey75.png", src: "res/screens/LoadingScreen/Turkey75.png"} );
    queue.loadFile( {id:"res/screens/LoadingScreen/TurkeyDone.png", src: "res/screens/LoadingScreen/TurkeyDone.png"} );*/

    //queue.addEventListener("fileload", handleFileComplete);
    // Load image assets
    queue.loadFile( {id: "TurkeySpriteFile", src:"res/screens/MainScreen/TurkeySprite.png"} );
    queue.loadFile( {id: "MainBackgroundFile", src:"res/screens/MainScreen/Main-Screen.png"} );
    queue.loadFile( {id: "OverlayGrassFile", src:"res/screens/MainScreen/Grass.png"} );
    queue.loadFile( {id: "StartButtonFile", src:"res/screens/MainScreen/ButtonStart.png"} );
    queue.loadFile( {id: "HelpButtonFile", src:"res/screens/MainScreen/ButtonHelp.png"} );
    queue.loadFile( {id: "CreditsButtonFile", src:"res/screens/MainScreen/ButtonCredits.png"} );

    queue.loadFile( {id: "MarketScreenfile", src:"res/screens/MarketScreen/MarketScreen.png"} );

    // Load sound assets
    queue.loadFile( {id: "TitleMusicFile", src:"res/sound/turkey_in_the_straw.mp3"} );
    queue.loadFile( {id: "MarketBackgroundSoundFile", src:"res/sound/Store/supermarket.mp3"} );
	queue.loadFile( {id: "MarketSoundFile", src:"res/sound/Store/Waterford.mp3"} );

	// UI sounds
    queue.loadFile( {id: "UIPopFile", src:"res/sound/GUI/pop.mp3"} );
    queue.loadFile( {id: "UILowClickFile", src:"res/sound/GUI/lowclick.mp3"} );
    queue.loadFile( {id: "UIClickFile", src:"res/sound/GUI/click.mp3"} );
    queue.loadFile( {id: "UIBuzzFile", src:"res/sound/GUI/buzz.mp3"} );

    
    // Market Items
    queue.loadFile( {id: "FrillsBox.png", src:"res/items/FrillsBox.png"} );
    queue.loadFile( {id: "res/items/FrillsBox.png", src:"res/items/FrillsBox.png"});
    queue.loadFile( {id: "res/items/FrillsBoxGlow.png", src:"res/items/FrillsBoxGlow.png"});
    queue.loadFile( {id: "res/items/TempProbe.png", src:"res/items/TempProbe.png"});
    queue.loadFile( {id: "res/items/TempProbeGlow.png", src:"res/items/TempProbeGlow.png"});

	queue.loadFile( {id: "res/items/OvenLightBox.png", src:"res/items/OvenLightBox.png"});
    queue.loadFile( {id: "res/items/OvenLightBoxGlow.png", src:"res/items/OvenLightBoxGlow.png"});

	queue.loadFile( {id: "res/items/Alarm.png", src:"res/items/Alarm.png"});
    queue.loadFile( {id: "res/items/AlarmGlow.png", src:"res/items/AlarmGlow.png"});

	queue.loadFile( {id: "res/items/Cookbook1.png", src:"res/items/Cookbook1.png"});
    queue.loadFile( {id: "res/items/Cookbook1Glow.png", src:"res/items/Cookbook1Glow.png"});

	queue.loadFile( {id: "res/items/StuffingRepurposed.png", src:"res/items/StuffingRepurposed.png"});
    queue.loadFile( {id: "res/items/StuffingRepurposedGlow.png", src:"res/items/StuffingRepurposedGlow.png"});

	queue.loadFile( {id: "res/items/StuffingExquisite.png", src:"res/items/StuffingExquisite.png"});
    queue.loadFile( {id: "res/items/StuffingExquisiteGlow.png", src:"res/items/StuffingExquisiteGlow.png"});

	queue.loadFile( {id: "res/items/StuffingSpecial.png", src:"res/items/StuffingSpecial.png"});
    queue.loadFile( {id: "res/items/StuffingSpecialGlow.png", src:"res/items/StuffingSpecialGlow.png"});

	queue.loadFile( {id: "res/items/Turkey5.png", src:"res/items/Turkey5.png"});
    queue.loadFile( {id: "res/items/Turkey5Glow.png", src:"res/items/Turkey5Glow.png"});

    queue.loadFile( {id: "res/items/Turkey4.png", src:"res/items/Turkey4.png"});
    queue.loadFile( {id: "res/items/Turkey4Glow.png", src:"res/items/Turkey4Glow.png"});

	queue.loadFile( {id: "res/items/Turkey3.png", src:"res/items/Turkey3.png"});
    queue.loadFile( {id: "res/items/Turkey3Glow.png", src:"res/items/Turkey3Glow.png"});

	queue.loadFile( {id: "res/items/Turkey2.png", src:"res/items/Turkey2.png"});
    queue.loadFile( {id: "res/items/Turkey2Glow.png", src:"res/items/Turkey2Glow.png"});

	queue.loadFile( {id: "res/items/Turkey1.png", src:"res/items/Turkey1.png"});
    queue.loadFile( {id: "res/items/Turkey1Glow.png", src:"res/items/Turkey1Glow.png"});


    this.screenState = 0;
    this.newScreen = "";


    // Game State flags
    this.turkeyBought = false;
	this.marketItems = {
		"FrillsBox" : new MarketItem( this, "FrillsBox", 133,92, 2000, "res/items/FrillsBox.png", "res/items/FrillsBoxGlow.png" ),
	    "TuTempProberkey" : new MarketItem( this, "TuTempProberkey", 200, 57, 100, "res/items/TempProbe.png", "res/items/TempProbeGlow.png" ),
	    "OvenLightBox" : new MarketItem( this, "OvenLightBox", 131,222, 300, "res/items/OvenLightBox.png", "res/items/OvenLightBoxGlow.png" ),

	    "Alarm" : new MarketItem( this, "Alarm", 173,248, 500, "res/items/Alarm.png", "res/items/AlarmGlow.png" ),
		"Cookbook" : new MarketItem( this, "Cookbook", 283,203, 400, "res/items/Cookbook1.png", "res/items/Cookbook1Glow.png" ),
	    "StuffingRepurposed" : new MarketItem( this, "StuffingRepurposed",  510,197, 200, "res/items/StuffingRepurposed.png", "res/items/StuffingRepurposedGlow.png" ),
	    "StuffingExquisite" : new MarketItem( this, "StuffingExquisite", 458,210, 300, "res/items/StuffingExquisite.png", "res/items/StuffingExquisiteGlow.png" ),
	    "StuffingSpecial" : new MarketItem( this, "StuffingSpecial", 390,220, 500, "res/items/StuffingSpecial.png", "res/items/StuffingSpecialGlow.png" ),

	    "Turkey1" : new MarketItem( this, "Turkey1", 170,350, 100, "res/items/Turkey5.png", "res/items/Turkey5Glow.png" ),
	    "Turkey2": new MarketItem( this, "Turkey2", 540,320, 100, "res/items/Turkey4.png", "res/items/Turkey4Glow.png" ),
	    "Turkey3" : new MarketItem( this, "Turkey3", 265,415, 100, "res/items/Turkey3.png", "res/items/Turkey3Glow.png" ),
	    "Turkey4": new MarketItem( this, "Turkey4", 474,357, 100, "res/items/Turkey2.png", "res/items/Turkey2Glow.png" ),
		"Turkey5": new MarketItem( this, "Turkey5", 368,426, 100, "res/items/Turkey1.png", "res/items/Turkey1Glow.png" )
	};

	this.purchasedItems = [];

	// did we already show the player the kitchen intro?
	this.kitchenIntro = false;

    function addHighScore(name, turkeyPoundage, cookTime, score){
    	var scores = {};
    	var now = new Date();
    	if( !localStorage.getItem("highScores") ){
    		scores = JSON.parse( localStorage.getItem("highScores") );
    	}

    	scores[now.getYear()+"/"+now.getMonth()+"/"+now.getDay()] = {
    			"name" : name,
    			"weight" : turkeyPoundage,
    			"cookTime" : cookTime,
    			"score" : score
    	};

    	localStorage.setItem("highScores", JSON.stringfy(scores));
    }

	function gameLoop(){
		that.mainUI.draw();
	}

	return {
	//	"main": this
	}
}

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
		"LoadingScreen" 	 : LoadingScreen,
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

	var soundManager = new SoundManager( gameState );

	this.activeScreenObj = new LoadingScreen( this.stage, gameState );
	var textContent = new createjs.Text( "", "20px Arial", "#00000000" );
	textContent.x = 750;
	textContent.y = 30;
	this.stage.addChild( textContent);
	var overlay = new createjs.Shape();
 	overlay.graphics.beginFill("#fffffff").drawRect(0, 0, 800, 600 );
 	overlay.alpha = 0;
	this.stage.addChild(overlay);

	var dialogManager = new DialogUI( this.stage, gameState );

	// delay for fade in and fade-out
	this.switchScreen = function( screenName ){
		gameState.screenState = SCREEN_OUT;
		dialogManager.minDialog();
		console.log("Switch screen called with" + screenName);
		gameState.newScreen = screenName;
	};
	this.actuallySwitchScreen = function( screenName ){
		that.stage.removeAllChildren();
		that.activeScreenObj = new that.screens[ screenName ]( that.stage, gameState );
		that.stage.addChild( textContent );
		that.stage.addChild( overlay );
		dialogManager.render();
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
			dialogManager.tick();
			textContent.text = createjs.Ticker.getMeasuredFPS().toFixed(1);
			that.stage.update();
		}
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
