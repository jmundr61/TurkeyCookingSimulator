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

    //createjs.Sound.addEventListener("fileload", createjs.proxy(loadHandler, this));
    createjs.Sound.registerSound("res/sound/turkey_in_the_straw.mp3", "sound");

	var instance = createjs.Sound.createInstance("sound");  // play using id.  Could also use full sourcepath or event.src.
	instance.setPosition(5650);
	instance.volume = 0.5;

	instance.play();

	// loop-de-loop
 	instance.addEventListener("complete", playAgain);
 	function playAgain(event) {
 		instance.setPosition(5650);
     	instance.play();
 	}

	// buttons info/credits/start
 	stage.addChild( new Button( stage, gameState, 13, 445, 222, 65, "SwitchScreen", "InfoHelpScreen" ) );
 	stage.addChild( new Button( stage, gameState, 13, 515, 222, 65, "SwitchScreen", "CreditsScreen" ) );
 	stage.addChild( new Button( stage, gameState, 564, 520, 222, 65, "SwitchScreen", "DifficultyScreen" ) );

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

 	// Easy/Hard Button
 	stage.addChild( new Button( stage, gameState, 170, 40, 450, 105, "SwitchScreen", "MarketScreen" ) );
 	stage.addChild( new Button( stage, gameState, 170, 150, 450, 105, "SwitchScreen", "MarketScreen" ) );

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
	this.background = new createjs.Bitmap( "res/kitchen.png" );
    stage.addChild( this.background );

	this.uiElems = [];

	this.uiElems.push( new OvenUI( stage, gameState ) );
	this.uiElems.push( new ClockUI( stage, gameState ) );
	this.uiElems.push( new WindowUI( stage, gameState ) )
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

    this.background = new createjs.Bitmap( "res/Store-Screen-Clean.png" );
    stage.addChild( this.background );
    stage.addChild( new Button( stage, gameState, 13, 445, 222, 65, "SwitchScreen", "KitchenScreen" ) );

    this.uiElems = [];
    this.uiElems.push( new MarketItem( stage, gameState, 275,195, 100, "res/items/Alarm.png", "res/items/AlarmGlow.png" ) );
    this.uiElems.push( new MarketItem( stage, gameState, 200,200, 100, "res/items/Bottle1.png", "res/items/Bottle1.png" ) );
    this.uiElems.push( new MarketItem( stage, gameState, 456,123, 100, "res/items/Bottle2.png", "res/items/Bottle2.png" ) );
    this.uiElems.push( new MarketItem( stage, gameState, 312,222, 100, "res/items/Bottle3.png", "res/items/Bottle3.png" ) );
    this.uiElems.push( new MarketItem( stage, gameState, 300,400, 100, "res/items/Cookbook1.png", "res/items/Cookbook1Glow.png" ) );
    this.uiElems.push( new MarketItem( stage, gameState, 12,11, 100, "res/items/FrillsBox.png", "res/items/FrillsBoxGlow.png" ) );
    this.uiElems.push( new MarketItem( stage, gameState, 44,222, 100, "res/items/OvenLightBox.png", "res/items/OvenLightBoxGlow.png" ) );
    this.uiElems.push( new MarketItem( stage, gameState, 66,444, 100, "res/items/StuffingExquisite.png", "res/items/StuffingExquisiteGlow.png" ) );
    this.uiElems.push( new MarketItem( stage, gameState,  293,12, 100, "res/items/StuffingRepurposed.png", "res/items/StuffingRepurposedGlow.png" ) );
    this.uiElems.push( new MarketItem( stage, gameState, 438,200, 100, "res/items/StuffingSpecial.png", "res/items/StuffingSpecialGlow.png" ) );
    this.uiElems.push( new MarketItem( stage, gameState, 444,334, 100, "res/items/TempProbe.png", "res/items/TempProbeGlow.png" ) );
    this.uiElems.push( new MarketItem( stage, gameState, 555,33, 100, "res/items/Turkey1.png", "res/items/Turkey1Glow.png" ) );
    this.uiElems.push( new MarketItem( stage, gameState, 200,200, 100, "res/items/Turkey2.png", "res/items/Turkey2Glow.png" ) );
    this.uiElems.push( new MarketItem( stage, gameState, 100,100, 100, "res/items/Turkey3.png", "res/items/Turkey3Glow.png" ) );
    this.uiElems.push( new MarketItem( stage, gameState, 122,349, 100, "res/items/Turkey4.png", "res/items/Turkey4Glow.png" ) );
    this.uiElems.push( new MarketItem( stage, gameState, 96,406, 100, "res/items/Turkey5.png", "res/items/Turkey5Glow.png" ) );

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
