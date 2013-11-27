/* Screens, inheritance would be nice */
function LoadingScreen( stage, gameState ){
	var that = this;
	this.lastPercent = -1;
    this.picture = new createjs.Bitmap( "res/screens/LoadingScreen/Loading-Title.png" );
    this.pictureFront = new createjs.Bitmap( "res/screens/LoadingScreen/PanFront.png" );
    this.cooking = new createjs.Bitmap( "res/screens/LoadingScreen/TextCooking.png" );
    this.done = new createjs.Bitmap( "res/screens/LoadingScreen/TextDone.png" );
    this.turkeyState = [ new createjs.Bitmap( "res/screens/LoadingScreen/Turkey0.png" ),
    					 new createjs.Bitmap( "res/screens/LoadingScreen/Turkey25.png" ),
    					 new createjs.Bitmap( "res/screens/LoadingScreen/Turkey50.png" ),
    					 new createjs.Bitmap( "res/screens/LoadingScreen/Turkey75.png" ),
    					 new createjs.Bitmap( "res/screens/LoadingScreen/TurkeyDone.png" ) ];

	this.done.alpha= 0;
	stage.addChild( this.picture );
	stage.addChild( this.cooking );
	stage.addChild( this.done );
	stage.addChild( this.turkeyState[0] );

	var textContent = new createjs.Text( "0 %", "25px Arial", "#ffffffff" );
	textContent.x = 500;
	textContent.y = 20;
	stage.addChild( textContent);

	gameState.pubsub.subscribe( "Load", function(percent){
		textContent.text = (percent * 25).toFixed(2) + " %";
		var wholeNum = percent.toFixed(0);
		if( that.lastPercent != percent){
			that.lastPercent = percent;
			stage.addChild( that.turkeyState[wholeNum] );
			stage.addChild( that.pictureFront );
		}

		//If we're still on image one, don't fade it out, it's the base image!
		if(  wholeNum != 0 )
			that.turkeyState[wholeNum].alpha = percent.toFixed(2) - wholeNum;

		// Done!
		if(  wholeNum == 4 ){
			that.turkeyState[4].alpha = 1;
			that.cooking.alpha=0;
			that.done.alpha = 1;

			that.done.addEventListener( "mouseover", function(){ document.body.style.cursor='pointer'; } );
		 	that.done.addEventListener( "mouseout", function(){ document.body.style.cursor='default'; } );
 			that.done.addEventListener( "click",  function(){ gameState.pubsub.publish("SwitchScreen", "MainScreen"); });

			that.turkeyState[4].addEventListener( "mouseover", function(){ document.body.style.cursor='pointer'; } );
		 	that.turkeyState[4].addEventListener( "mouseout", function(){ document.body.style.cursor='default'; } );
 			that.turkeyState[4].addEventListener( "click",  function(){ gameState.pubsub.publish("SwitchScreen", "MainScreen"); });
		}
	});

	stage.addChild( this.pictureFront );

	return {
		blit : function(){
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

    this.background = new createjs.Bitmap( "res/screens/MainScreen/Main-Screen.png" );
    stage.addChild( this.background );

    var turkeyAnimations = { peck:[14,24,"peck"], ruffle:[0,13,"ruffle"], stare:[25,35,"stare"] };
	var data = {
    	images: ["res/screens/MainScreen/TurkeySprite.png"],
     	frames: { width:400, height:350 },
     	animations: turkeyAnimations
 	};

	var spriteSheet = new createjs.SpriteSheet(data);
 	var animation = new createjs.Sprite(spriteSheet, "stare");
 	animation.x = 140;
 	animation.y = 210;

 	animation.addEventListener("tick", handleTick);
 	function handleTick(event) {
 		if ( turkeyAnimations[event.currentTarget.currentAnimation][1] == event.currentTarget.currentFrame ){
 			event.currentTarget.paused = true;
 		}
	    // Click happened.
 	}
 	stage.addChild(animation);

 	this.grassLayer = new createjs.Bitmap( "res/screens/MainScreen/Grass.png" );
 	this.grassLayer.x = -60;
 	stage.addChild( this.grassLayer );

	// buttons info/credits/start
 	new ImgButton( stage, gameState, 571,527, "res/screens/MainScreen/ButtonStart.png", "res/screens/MainScreen/ButtonStart.png","SwitchScreen", "DifficultyScreen", "Click"  );
 	new ImgButton( stage, gameState, 17,470, "res/screens/MainScreen/ButtonHelp.png", "res/screens/MainScreen/ButtonHelp.png","SwitchScreen", "InfoScreen", "Click"  );
 	new ImgButton( stage, gameState, 17,527, "res/screens/MainScreen/ButtonCredits.png", "res/screens/MainScreen/ButtonCredits.png","SwitchScreen", "CreditsScreen", "Click"  );

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

    this.background = new createjs.Bitmap( "res/screens/DifficultyScreen/Difficulty-Selection.png" );
    stage.addChild( this.background );

    var turkeyAnimations = { peck:[14,24,"peck"], ruffle:[0,13,"ruffle"], stare:[25,35,"stare"] };
	var data = {
    	images: ["res/screens/MainScreen/TurkeySprite.png"],
     	frames: { width:400, height:350 },
     	animations: turkeyAnimations
 	};

	var spriteSheet = new createjs.SpriteSheet(data);
 	var animation = new createjs.Sprite(spriteSheet, "stare");
 	animation.x = 140;
 	animation.y = 210;

 	animation.addEventListener("tick", handleTick);
 	function handleTick(event) {
 		if ( turkeyAnimations[event.currentTarget.currentAnimation][1] == event.currentTarget.currentFrame ){
 			event.currentTarget.paused = true;
 		}
	    // Click happened.
 	}
 	stage.addChild(animation);

 	this.grassLayer = new createjs.Bitmap( "res/screens/MainScreen/Grass.png" );
 	this.grassLayer.x = -60;
 	stage.addChild( this.grassLayer );

 	// Difficulty selection UI
 	this.buttonsAndText = new createjs.Bitmap( "res/screens/DifficultyScreen/ButtonsandText.png" );
 	stage.addChild( this.buttonsAndText );

 	this.maleSelection = new createjs.Bitmap( "res/screens/DifficultyScreen/ButtonMale.png" );
 	stage.addChild( this.maleSelection );

 	this.femaleSelection = new createjs.Bitmap( "res/screens/DifficultyScreen/ButtonFemale.png" );
 	this.femaleSelection.alpha = 0;
 	stage.addChild( this.femaleSelection );

 	var nameInput = new createjs.Text( "", "48px Arial", "#00000000" );
   		nameInput.x = 47;
	 	nameInput.y = 85;
	 	nameInput.lineWidth = 175;

	stage.addChild( nameInput );

	// handle keyboard typing
    document.onkeyup = function(event){
    	// keycode
    	var keynum = 48;
    	  if(window.event){ // IE
            	keynum = event.keyCode;
            }
           else{
              	if(event.which){ // Netscape/Firefox/Opera
            		keynum = event.which;
                }
            }

            if( keynum != 8 && keynum < 91 && keynum > 47 && nameInput.text.length < 22 )
            	nameInput.text += String.fromCharCode(keynum);
    };


    // Backspace gets special treatment
    document.onkeydown = function(event){
    	    	var keynum = 0;
    	  if(window.event){ // IE
            	keynum = event.keyCode;
            }
           else{
              	if(event.which){ // Netscape/Firefox/Opera
            		keynum = event.which;
                }
            }

            if(keynum == 8 && nameInput.text.length > 0 )
            	nameInput.text = nameInput.text.substr(0, nameInput.text.length-1);
        event.preventDefault();
    }

    gameState.name = nameInput.text;

 	// Easy/Hard Button
 	stage.addChild( new Button( stage, gameState, 500, 235, 100, 55, "ChangeGender", "Male" ) );
 	stage.addChild( new Button( stage, gameState, 500, 300, 100, 55, "ChangeGender", "Female" ) );

 	stage.addChild( new Button( stage, gameState, 503, 370, 200, 55, null, null, function(){ gameState.hard = false; gameState.pubsub.publish("SwitchScreen", "KitchenScreen"); } ) );
 	stage.addChild( new Button( stage, gameState, 500, 495, 205, 55, null, null, function(){ gameState.hard = true; gameState.pubsub.publish("SwitchScreen", "KitchenScreen"); } ) );

 	stage.addChild( new Button( stage, gameState, 35, 495, 85, 55, "SwitchScreen", "MainScreen" ) );

 	gameState.pubsub.subscribe( "ChangeGender", function(gender){
 		gameState.gender=gender;
 		if( gender == "Male" ){
 			that.maleSelection.alpha = 1;
 			that.femaleSelection.alpha = 0;
 		}else{
 			that.maleSelection.alpha = 0;
 			that.femaleSelection.alpha = 1;
 		}
 	})
	return {
		blit : function(){
			if( createjs.Ticker.getTicks() %50 == 0 ){
				animation.gotoAndPlay(["peck", "ruffle", "stare"][UtilityFunctions.randRange(0,2)]);
			}

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

	this.background = new createjs.Bitmap( "res/screens/KitchenScreen/KitchenScreen.png" );
    stage.addChild( this.background );

	this.uiElems = [];

	for(var i in gameState.purchasedItems ){
		console.log(gameState.purchasedItems);
		gameState.purchasedItems[i].draw( stage );
	}

	this.uiElems.push( gameState.ovenUI ? gameState.ovenUI.render() : ( gameState.ovenUI = new OvenUI( stage, gameState ) ).render() );
	this.uiElems.push( new ClockUI( stage, gameState ) );
	this.uiElems.push( new WindowUI( stage, gameState ) )
	stage.addChild( new Button( stage, gameState, 500, 40, 450, 105, "SwitchScreen", "MarketScreen" ) );
	stage.addChild( new Button( stage, gameState, 14, 17, 73, 45, "SwitchScreen", "HelpScreen" ) );

	new ImgButton( stage, gameState, 0,0, "res/screens/KitchenScreen/StoreBrochure.png", "res/screens/KitchenScreen/StoreBrochureGlow.png", "SwitchScreen", "MarketScreen", "Click"  );

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

    this.background = new createjs.Bitmap( "res/screens/MarketScreen/MarketScreen.png" );
    var price = new createjs.Text( "", "16px Arial", "#00000000" );
    	price.x = 120;
	 	price.y = 560;

	var wallet = new createjs.Text( "$" + parseFloat(gameState.wallet).toFixed(2), "20px Arial", "#00000000" );
   		wallet.x = 725;
	 	wallet.y = 550;

 	var walletTag = new createjs.Bitmap("res/items/Wallet.png");
		walletTag.x = 670;
		walletTag.y = 535;

	var clipboardImg = new createjs.Bitmap("res/items/Clipboard.png");
		clipboardImg.x = 5;
		clipboardImg.y = 315;

	var clipboardTitle = new createjs.Text( "Shopping List", "18px Arial", "#00000000" );
   		clipboardTitle.x = 25;
	 	clipboardTitle.y = 385;
	 	clipboardTitle.lineWidth = 175;

	var clipboardText = new createjs.Text( "Turkey", "16px Arial", "#00000000" );
   		clipboardText.x = 23;
	 	clipboardText.y = 425;
	 	clipboardText.lineWidth = 173;

	var clipboardWeight = new createjs.Text( "", "16px Arial", "#00000000" );
   		clipboardWeight.x = 120;
	 	clipboardWeight.y = 540;
	 	clipboardWeight.lineWidth = 175;

	// Play soundz
	gameState.pubsub.publish( "Play", {name:"Entrance", volume:0.3} );
	gameState.pubsub.publish( "BackgroundLoop", {name:"MarketMusic", volume:1} );
	gameState.pubsub.publish( "BackgroundLoop", {name:"MarketBackgroundSound", volume:0.4} );

    stage.addChild(this.background);

    stage.addChild(wallet);
    stage.addChild(walletTag);
    stage.addChild(clipboardImg);

    stage.addChild(clipboardTitle);
    stage.addChild(clipboardText);
    stage.addChild(clipboardWeight);
    stage.addChild(price);

    this.uiElems = [];
    this.uiElems.push( new ImgButton( stage, gameState, 690,0, "res/items/ExitSign.png", "res/items/ExitGlow.png","SwitchScreen", "KitchenScreen", "Click"  ) );
    var marketItemKeys = Object.keys(gameState.marketItems);
    for (var index in marketItemKeys ) {
    	gameState.marketItems[marketItemKeys[index]].draw( stage );
    }

	this.topground = new createjs.Bitmap( "res/screens/MarketScreen/MarketTopShelf.png" );
	stage.addChild( this.topground );


	this.showPrice = function( cost ){
		price.text = "$ " + ( cost == NaN ? "" : parseFloat(cost).toFixed(2) );
	}

	this.clearClipboard = function(){
		price.text = "";
		clipboardTitle.text = "";
		clipboardText.text = "";
		clipboardWeight.text = "";
	}

	this.showDesc = function( desc ){
	 	clipboardTitle.text = desc.title;
	 	clipboardText.text = desc.desc;
	 	if( desc.weight ){
	 		clipboardWeight.text = desc.weight.toFixed(2) + " lbs.";
	 	}
	}

    this.setWalletAmount = function(newAmount){
    	wallet.text="$" + ( gameState.wallet=newAmount.toFixed(2) );
    }

    gameState.pubsub.subscribe("ShowDesc", this.showDesc);
	gameState.pubsub.subscribe("ShowPrice", this.showPrice );
    gameState.pubsub.subscribe("WalletAmount", this.setWalletAmount);
    gameState.pubsub.subscribe("ClearClipboard", this.clearClipboard);

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
