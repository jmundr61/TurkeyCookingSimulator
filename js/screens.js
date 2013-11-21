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
	this.background = new createjs.Bitmap( "res/kitchen.png" );
    stage.addChild( this.background );

	this.uiElems = [];


	for(var i in gameState.purchasedItems){
		console.log(gameState.purchasedItems);
		gameState.purchasedItems[i].draw( stage, 403+100*i, 350 );
	}

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
    this.uiElems = [];
    this.uiElems.push( new ImgButton( stage, gameState, 690,0, "res/items/ExitSign.png", "res/items/ExitGlow.png","SwitchScreen", "KitchenScreen"  ) );
    var marketItemKeys = Object.keys(gameState.marketItems);
    for (var index in marketItemKeys ) {
    	gameState.marketItems[marketItemKeys[index]].draw( stage );
    }
	this.topground = new createjs.Bitmap( "res/TopShelf.png" );
	stage.addChild( this.topground );

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
