/* Screens, inheritance would be nice */
function LoadingTitleScreen( stage, gameState ){
	var that = this;
    this.picture = new createjs.Bitmap( "res/Loading-Title.png" );
    this.ovenLight = new createjs.Shape();
    this.ovenLight.graphics.beginFill( "red" ).drawCircle( 396, 318, 5 );

    stage.addChild( this.picture );
	stage.addChild( this.ovenLight );

    this.uiElems = [];
	this.uiElems.push( new DialogUI( stage, gameState ) );
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

    this.background = new createjs.Bitmap( "res/Main-Screen.png" );
    stage.addChild( this.background );

    var turkeyAnimations = { peck:[14,24,"peck"], ruffle:[0,13,"ruffle"], stare:[25,35,"stare"] };
	var data = {
    	images: ["res/TurkeySprite.png"],
     	frames: { width:400, height:350 },
     	animations: turkeyAnimations
 	};

	var spriteSheet = new createjs.SpriteSheet(data);
 	var animation = new createjs.Sprite(spriteSheet, "stare");
 	animation.x = 200;
 	animation.y = 210;

 	animation.addEventListener("tick", handleTick);
 	function handleTick(event) {
 		if ( turkeyAnimations[event.currentTarget.currentAnimation][1] == event.currentTarget.currentFrame ){
 			event.currentTarget.paused = true;
 		}
	    // Click happened.
 	}
 	stage.addChild(animation);

 	this.grassLayer = new createjs.Bitmap( "res/Grass.png" );
 	stage.addChild( this.grassLayer );

	// buttons info/credits/start
 	new ImgButton( stage, gameState, 571,527, "res/MainScreen/ButtonStart.png", "res/MainScreen/ButtonStart.png","SwitchScreen", "DifficultyScreen", "Click"  );
 	new ImgButton( stage, gameState, 17,470, "res/MainScreen/ButtonHelp.png", "res/MainScreen/ButtonHelp.png","SwitchScreen", "InfoScreen", "Click"  );
 	new ImgButton( stage, gameState, 17,527, "res/MainScreen/ButtonCredits.png", "res/MainScreen/ButtonCredits.png","SwitchScreen", "CreditsScreen", "Click"  );

 	gameState.pubsub.publish( "BackgroundLoop", {name:"TitleMusic", pos:5650, volume:1} );
    this.uiElems = [];

    return {
		blit : function(){
			// Randomly do stuff

			if( createjs.Ticker.getTicks() %50 == 0 ){

				animation.gotoAndPlay(["peck", "ruffle", "stare"][UtilityFunctions.randRange(0,2)]);
			}
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

 	// Easy/Hard Button
 	stage.addChild( new Button( stage, gameState, 170, 40, 450, 105, "SwitchScreen", "KitchenScreen" ) );
 	stage.addChild( new Button( stage, gameState, 170, 150, 450, 105, "SwitchScreen", "KitchenScreen" ) );

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

	// Fade out any other sounds
	gameState.pubsub.publish( "FadeOut", "" );

	this.background = new createjs.Bitmap( "res/kitchen.png" );
    stage.addChild( this.background );

	this.uiElems = [];

	for(var i in gameState.purchasedItems ){
		console.log(gameState.purchasedItems);
		gameState.purchasedItems[i].draw( stage, 403+100*i, 350 );
	}

	this.uiElems.push( gameState.ovenUI ? gameState.ovenUI : ( gameState.ovenUI = new OvenUI( stage, gameState ) ) );
	this.uiElems.push( new ClockUI( stage, gameState ) );
	this.uiElems.push( new WindowUI( stage, gameState ) )
	stage.addChild( new Button( stage, gameState, 500, 40, 450, 105, "SwitchScreen", "MarketScreen" ) );

	// If player did not buy a turkey, tell them
	if( !gameState.turkeyBought ){
		gameState.pubsub.publish( "ShowDialog", {seq:"KitchenInitial", autoAdvance:false} );
	}

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

    this.background = new createjs.Bitmap( "res/screens/MarketScreen.png" );
    var price = new createjs.Text( "100", "24px Arial", "#00000000" );
    	price.x = 725;
	 	price.y = 500;

	var wallet = new createjs.Text( gameState.wallet, "24px Arial", "#00000000" );
   		wallet.x = 725;
	 	wallet.y = 550;

	// Play soundz
	gameState.pubsub.publish( "Play", {name:"Entrance", volume:0.3} );
	gameState.pubsub.publish( "BackgroundLoop", {name:"MarketMusic", volume:1} );
	gameState.pubsub.publish( "BackgroundLoop", {name:"MarketSound", volume:0.4} );

    stage.addChild( this.background );
    stage.addChild(price);
    stage.addChild(wallet);

    this.uiElems = [];
    this.uiElems.push( new ImgButton( stage, gameState, 690,0, "res/items/ExitSign.png", "res/items/ExitGlow.png","SwitchScreen", "KitchenScreen", "Click"  ) );
    var marketItemKeys = Object.keys(gameState.marketItems);
    for (var index in marketItemKeys ) {
    	gameState.marketItems[marketItemKeys[index]].draw( stage );
    }
	this.topground = new createjs.Bitmap( "res/screens/MarketTopShelf.png" );
	stage.addChild( this.topground );
	

	 this.showPrice = function( cost ){
	 	price.text = cost;
	 }
	 gameState.pubsub.subscribe( "ShowPrice", this.showPrice );
    this.setWalletAmount = function(newAmount){
    	wallet.text=gameState.wallet=newAmount;

    }

    gameState.pubsub.subscribe("WalletAmount", this.setWalletAmount);


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
