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
	this.uiElems.push( new ClockUI( stage, gameState ) )
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
