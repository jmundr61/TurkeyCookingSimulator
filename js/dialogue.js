function DialogueSequence( sequence ){

	var targetStory = story[sequence].slice(0);

	return {
		next: function(){
			return targetStory.shift().split(": ")[1];
		},
		more: function(){
			return targetStory.length > 0;
		}
	}
}

function DialogUI( stage, gameState ){
	var that = this;
	// Dialog States
	var DIALOG_RECEDING = 0;
	var DIALOG_SHOWING = 1;
	var DIALOG_PAUSING = 2;
	var MILLIS_PER_CHAR = 100;

	this.dialogSpeed = 30;
	this.dialogState = DIALOG_PAUSING;

	this.dialogMotionQueue = [DIALOG_RECEDING];
	this.currDialogueSeq = new DialogueSequence("Null");
	dialogQueue = [];

	this.dialogBox = new createjs.Bitmap("res/screens/GUI/DialogueBox.png");
	this.dialogBox.x = 10;
	this.dialogBox.y = 675;

	this.textContent = new createjs.Text( "", "24px Arial", "#00000000" );
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

 	this.showDialog= function( textSeq ){
 		that.currDialogueSeq = new DialogueSequence( textSeq.seq );
 		that.textContent.text=that.currDialogueSeq.next();
 		that.autoAdvance = textSeq.autoAdvance;
 		that.dialogMotionQueue = [DIALOG_SHOWING];
 	}

 	gameState.pubsub.subscribe( "ShowDialog", this.showDialog );

 	// negate double setTimeout if clicked
 	var oldTime = new Date().getTime();
 	var delayCounter = 0;
 	var clickEvent = function( timer ){

 		// if there is more dialogue text, then keep going, otherwise, recede
 		if( that.currDialogueSeq.more() ){
 			setTimeout( function(){ that.dialogMotionQueue.push(DIALOG_SHOWING) }, 500);
 			that.textContent.text=that.currDialogueSeq.next();
 			delayCounter = 0;
 			oldTime = new Date().getTime()
 		}else{
 			// pause and close dialog
 			setTimeout( function(){that.dialogMotionQueue.push(DIALOG_RECEDING)}, 500 );
 		}
 	}

	stage.addChild( this.dialogBox );
	stage.addChild( this.textContent );

    return {
    	tick: function(){
    		delayCounter = new Date().getTime() - oldTime;

    		if( that.autoAdvance == true && that.dialogBox.y ==435 && delayCounter > ( that.textContent.text.length * MILLIS_PER_CHAR ) ){
    			clickEvent();
    		}

    		if( that.dialogState == DIALOG_RECEDING ){
	    		that.dialogBox.y+=that.dialogSpeed;
	    		that.textContent.y +=that.dialogSpeed;
	    		//console.log( "Receding" + that.dialogBox.y );
    		}
    		if( that.dialogState == DIALOG_SHOWING ){
    			that.dialogBox.y-=that.dialogSpeed;
    			that.textContent.y -=that.dialogSpeed;
    			//console.log( "Advancing" + that.dialogBox.y );
    		}

    		// toggle states
    		if( that.dialogBox.y > 675 && that.dialogState == DIALOG_RECEDING ){
    			that.dialogBox.y = 675;
    			that.textContent.y = 735;
    			that.dialogState = DIALOG_PAUSING;
    			//console.log( "Pausing on recede" + that.dialogBox.y );

    		}
    		if( that.dialogBox.y < 435 && that.dialogState == DIALOG_SHOWING ){
    			that.dialogBox.y = 435;
    			that.textContent.y = 480;
    			that.dialogState = DIALOG_PAUSING;
    			//console.log( "Pausing on showing" + that.dialogBox.y );
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
    	render: function(){
			stage.addChild( that.dialogBox );
			stage.addChild( that.textContent );
    	}
	}
}