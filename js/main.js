function GameState(){
	var that = this;

	this.pubsub = {};
	BindPubSub( this.pubsub );
	this.currentTime = new Date().getTime();
	this.oldTime = new Date().getTime();

	this.name = "";
	this.gender = "Male";
	this.wallet = 40.00;

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

    // Screens
    queue.loadFile( {id: "res/screens/DifficultyScreen/Difficulty-Selection.png", src:"res/screens/DifficultyScreen/Difficulty-Selection.png"} );
	queue.loadFile( {id: "res/screens/DifficultyScreen/ButtonMale.png", src:"res/screens/DifficultyScreen/ButtonMale.png"} );
    queue.loadFile( {id: "res/screens/DifficultyScreen/ButtonFemale.png", src:"res/screens/DifficultyScreen/ButtonFemale.png"} );

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

    // Kitchen Items
	queue.loadFile( {id: "res/screens/KitchenScreen/TurkeyState1.svg", src:"res/screens/KitchenScreen/TurkeyState1.svg"});
	queue.loadFile( {id: "res/screens/KitchenScreen/TurkeyState2.svg", src:"res/screens/KitchenScreen/TurkeyState2.svg"});
	queue.loadFile( {id: "res/screens/KitchenScreen/TurkeyState3.svg", src:"res/screens/KitchenScreen/TurkeyState3.svg"});
	queue.loadFile( {id: "res/screens/KitchenScreen/TurkeyState4.svg", src:"res/screens/KitchenScreen/TurkeyState4.svg"});
	queue.loadFile( {id: "res/screens/KitchenScreen/TurkeyState5.svg", src:"res/screens/KitchenScreen/TurkeyState5.svg"});

	queue.loadFile( {id: "res/screens/KitchenScreen/TempProbeKitchenGlow.png", src:"res/screens/KitchenScreen/TempProbeKitchenGlow.png"});
	queue.loadFile( {id: "res/screens/KitchenScreen/TempProbeKitchen.png", src:"res/screens/KitchenScreen/TempProbeKitchen.png"});

	queue.loadFile( {id: "res/screens/KitchenScreen/StuffingSpecialKitchenGlow.png", src:"res/screens/KitchenScreen/StuffingSpecialKitchenGlow.png"});
	queue.loadFile( {id: "res/screens/KitchenScreen/StuffingSpecialKitchen.png", src:"res/screens/KitchenScreen/StuffingSpecialKitchen.png"});

	queue.loadFile( {id: "res/screens/KitchenScreen/StuffingRepurposedKitchenGlow.png", src:"res/screens/KitchenScreen/StuffingRepurposedKitchenGlow.png"});
	queue.loadFile( {id: "res/screens/KitchenScreen/StuffingRepurposedKitchen.png", src:"res/screens/KitchenScreen/StuffingRepurposedKitchen.png"});

	queue.loadFile( {id: "res/screens/KitchenScreen/StuffingExquisiteKitchenGlow.png", src:"res/screens/KitchenScreen/StuffingExquisiteKitchenGlow.png"});
	queue.loadFile( {id: "res/screens/KitchenScreen/StuffingExquisiteKitchen.png", src:"res/screens/KitchenScreen/StuffingExquisiteKitchen.png"});

	queue.loadFile( {id: "res/screens/KitchenScreen/StoreBrochureGlow.png", src:"res/screens/KitchenScreen/StoreBrochureGlow.png"});
	queue.loadFile( {id: "res/screens/KitchenScreen/StoreBrochure.png", src:"res/screens/KitchenScreen/StoreBrochure.png"});

	queue.loadFile( {id: "res/screens/KitchenScreen/FrillsBoxKitchenGlow.png", src:"res/screens/KitchenScreen/FrillsBoxKitchenGlow.png"});
	queue.loadFile( {id: "res/screens/KitchenScreen/FrillsBoxKitchen.png", src:"res/screens/KitchenScreen/FrillsBoxKitchen.png"});

	queue.loadFile( {id: "res/screens/KitchenScreen/DoorPeekLightOn.png", src:"res/screens/KitchenScreen/DoorPeekLightOn.png"});
	queue.loadFile( {id: "res/screens/KitchenScreen/DoorPeekLightOff.png", src:"res/screens/KitchenScreen/DoorPeekLightOff.png"});

	queue.loadFile( {id: "res/screens/KitchenScreen/DoorOpen.png", src:"res/screens/KitchenScreen/DoorOpen.png"});
	queue.loadFile( {id: "res/screens/KitchenScreen/DoorClosedLightOn.png", src:"res/screens/KitchenScreen/DoorClosedLightOn.png"});
	queue.loadFile( {id: "res/screens/KitchenScreen/DoorClosedLightOff.png", src:"res/screens/KitchenScreen/DoorClosedLightOff.png"});
	queue.loadFile( {id: "res/screens/KitchenScreen/CookbookKitchenGlow.png", src:"res/screens/KitchenScreen/CookbookKitchenGlow.png"});
	queue.loadFile( {id: "res/screens/KitchenScreen/CookbookKitchen.png", src:"res/screens/KitchenScreen/CookbookKitchen.png"});
	queue.loadFile( {id: "res/screens/KitchenScreen/AlarmKitchenGlow.png", src:"res/screens/KitchenScreen/AlarmKitchenGlow.png"});
	queue.loadFile( {id: "res/screens/KitchenScreen/AlarmKitchen.png", src:"res/screens/KitchenScreen/AlarmKitchen.png"});

	queue.loadFile( {id: "res/screens/KitchenScreen/PanFront.png", src:"res/screens/KitchenScreen/PanFront.png"});
	queue.loadFile( {id: "res/screens/KitchenScreen/OvenTurnRedState.png", src:"res/screens/KitchenScreen/OvenTurnRedState.png"});
	queue.loadFile( {id: "res/screens/KitchenScreen/LightButtonDepressed.png", src:"res/screens/KitchenScreen/LightButtonDepressed.png"});

    // Market Items

    queue.loadFile( {id: "res/screens/MarketScreen/MarketTopShelf.png", src:"res/screens/MarketScreen/MarketTopShelf.png"});

	queue.loadFile( {id: "res/items/Clipboard.png", src:"res/items/Clipboard.png"});
    queue.loadFile( {id: "res/items/Wallet.png", src:"res/items/Wallet.png"});

    queue.loadFile( {id: "res/items/FrillsBox.png", src:"res/items/ExitSign.png"});
    queue.loadFile( {id: "res/items/FrillsBoxGlow.png", src:"res/items/ExitGlow.png"});

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
    this.ovenLightBought = false;
    var randomWeight = [ (UtilityFunctions.randRange(10,22)+"."+UtilityFunctions.randRange(10,99)),
    					 (UtilityFunctions.randRange(10,22)+"."+UtilityFunctions.randRange(10,99)),
    					 (UtilityFunctions.randRange(10,22)+"."+UtilityFunctions.randRange(10,99)),
    					 (UtilityFunctions.randRange(10,22)+"."+UtilityFunctions.randRange(10,99)),
    					 (UtilityFunctions.randRange(10,22)+"."+UtilityFunctions.randRange(10,99))
    				    ];

	this.marketItems = {
		"Frills Box" : new MarketItem( this, "Frills Box", 133,92, 3.00, "res/items/FrillsBox.png", "res/items/FrillsBoxGlow.png", "Some people dress up their dogs. Others dress up their house. Why not dress up your turkey?" ),
	    "Temperature Probe" : new MarketItem( this, "Temperature Probe", 200, 57, 9.00, "res/items/TempProbe.png", "res/items/TempProbeGlow.png", "Ensure your food is cooked with this handy thermometer. Now with easy to read LED display" ),
	    "Oven Light in a Box" : new MarketItem( this, "Oven Light in a Box", 131,222, 15.00, "res/items/OvenLightBox.png", "res/items/OvenLightBoxGlow.png", "This will allow checking on your turkey without letting the heat out." ),

	    "Alarm Clock" : new MarketItem( this, "Alarm Clock", 173,248, 6.00, "res/items/Alarm.png", "res/items/AlarmGlow.png", "Have you ever wanted to control time? Now you can. Digital readout counts down until time of choice. Audible alarm" ),
		"Cookbook" : new MarketItem( this, "Cookbook", 283,203, 3.00, "res/items/Cookbook1.png", "res/items/Cookbook1Glow.png", "How do I cook turkey? Handy note space included for writing down temperature measurements" ),
	    "Repurposed Stuffing" : new MarketItem( this, "Repurposed Stuffing",  510,197, 2.00, "res/items/StuffingRepurposed.png", "res/items/StuffingRepurposedGlow.png","At least 80% original breadcrumb. Guaranteed to contain no avian products" ),
	    "Exquisite Stuffing" : new MarketItem( this, "Exquisite Stuffing", 458,210, 3.00, "res/items/StuffingExquisite.png", "res/items/StuffingExquisiteGlow.png", "Colonial merchants once traveled the four reaches of the Earth to bring back the ingredients contained in this very box" ),
	    "Special Stuffing" : new MarketItem( this, "Special Stuffing", 390,220, 6.00, "res/items/StuffingSpecial.png", "res/items/StuffingSpecialGlow.png", "Once rated as the most handsome man in the universe. Scott and his patented special stuffing will set you on the path to food heaven" ),

	    "Organic Turkey" : new MarketItem( this, "Organic Turkey", 180,360, randomWeight[0]*2.00, "res/items/Turkey5.png", "res/items/Turkey5Glow.png", "All natural. No hormones. No antibiotics. Free Range. Lead Free", parseFloat(randomWeight[0]) ),
	    "Free Range Turkey": new MarketItem( this, "Free Range Turkey", 540,320, randomWeight[1]*1.25, "res/items/Turkey4.png", "res/items/Turkey4Glow.png", "Our turkeys have wide open spaces to roam and are fed with only the highest quality feed.", parseFloat(randomWeight[1]) ),
	    "Sunny Farms Turkey" : new MarketItem( this, "Sunny Farms Turkey", 265,415, randomWeight[2]*0.85, "res/items/Turkey3.png", "res/items/Turkey3Glow.png", "100% Turkey product from Sunny Farms Heavy Industries, Ltd.", parseFloat(randomWeight[2]) ),
	    "Pastured Turkey": new MarketItem( this, "Pastured Turkey", 474,357, randomWeight[3]*1.75, "res/items/Turkey2.png", "res/items/Turkey2Glow.png", "Grassy fields and natural ingredients allow our turkeys to have a better life, and taste great.", parseFloat(randomWeight[3]) ),
		"General Turkey": new MarketItem( this, "General Turkey", 378,426, randomWeight[4]*1.00, "res/items/Turkey1.png", "res/items/Turkey1Glow.png", "100% General Satisfaction Guaranteed", parseFloat(randomWeight[4]) )
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

	this.activeScreenObj = new KitchenScreen( this.stage, gameState );
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
