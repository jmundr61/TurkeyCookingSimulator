function TurkeyLayer( name, percentRadius, turkeyModel, ovenModel ){
	var that = this;

    this.name = name;
    this.initialTemp = 20;
    this.waterContent = 100000;
    this.Qdot = 0;
    this.finalTemperature = 20;

    return {
    	updateTemperatureTick: function(){
    		that.finalTemperature = UtilityFunctions.transientSphereSeries( turkeyModel.density,
    																		turkeyModel.thermalConduct,
    																		turkeyModel.heatConvection,
    																		turkeyModel.cp,
    																		percentRadius * turkeyModel.totalRadius,
    																		turkeyModel.totalRadius,
    																		that.initialTemp,
    																		ovenModel.tempInfini,
    																		ovenModel.globalTime );
	        that.initialTemp = that.finalTemperature;
    	}
    }
}

function TurkeyModel( weight, ovenModel ){
	this.density = 996; 	 	 // kg/m3 Assuming Density of Water 1000 kg/m3
	this.cp = 2810;			 	 // J/kg K for Turkey
	this.heatConvection = 5; 	 // W/m2 K Some Reasonable estimate for natural Convection. Change as needed. 5-25
	this.thermalConduct = 0.412; // W/m K // Chicken

	this.totalRadius = UtilityFunctions.calculateRadius( weight, this.density );
	this.totalLayers = [ new TurkeyLayer("Skin", 0.85, this, ovenModel ),
						 new TurkeyLayer("Body", 0.45, this, ovenModel ),
						 new TurkeyLayer("Core", 0.05, this, ovenModel ) ];

	// Whenever temperature is changed
	this.updateLayerTemps = function() {
			for (var i in this.totalLayers ){
		        this.totalLayers[i].updateTemperatureTick();
	    }
	}
}

function OvenModel( turkeyWeight, gameState ) {
	var that = this;
	this.tempInfini = 20; //C
	this.setTemp = 20;
	this.globalTime = 0;

	var turkey = new TurkeyModel( 8, this );

	var proportional = 0.1; // This value is arbitrary to how fast you want the temperatures to converge. (Or oscillate, which could be realistic as well)
	var errorTolerance = 5; //Stove is accurate to 1 degree Celcius Should hopefully oscillate below that value.
   	// Equalize temp will need to be sent each time iteration
   	this.equalizeTemp= function(){
            var error = Math.abs(this.setTemp-this.tempInfini);
            if( this.setTemp>this.tempInfini ){
                    this.tempInfini = this.tempInfini + error*proportional;
            }
            else if( this.setTemp<this.tempInfini ){
                    this.tempInfini = this.tempInfini - error*proportional;
            }

            if( error>errorTolerance ) {
                    return (true) //Need to run the Heat Calculations again next cycle
            }
    	}
    return {

    	changeTemp: function(setTemp){
    		console.log("temp changed to " + setTemp);
            that.setTemp = setTemp;
    	},
	    secondTick: function(){
	    	if ( that.equalizeTemp() ) {

	    		// Turn on oven light
				//gameState.pubsub.publish( "OvenLight", "On" );

				//Reset the model's time calculation if there are major changes in the tolerance of the temperature
			    that.globalTime = 0;
			}
			else {

				// Turn off oven light
				//gameState.pubsub.publish( "OvenLight", "Off" );

				that.globalTime = that.globalTime + 60;
			}
				console.log( that.tempInfini )
				turkey.updateLayerTemps();
	    },
	    getTurkeyState: function(){

	    }
	}
}


UtilityFunctions = {

	// Cache the lambda if the Biot number does not change, to avoid expensive root-finding operations
	cachedBiot: null,
	cachedLambda: null,

	// Using Ratios for a rectangular Box Turkey
	calculateRadius: function(weight, density) {

		var ratioLvG=1.4; //1.4, Turkey length vs shoulder girth
		var ratioLvH=2; //2, Turkey length vs height from resting position

		var length = Math.pow(weight/((1/ratioLvG)*(1/ratioLvH)*density),(1/3))
		var depth = 1/(ratioLvG /length);
		var height = 1/(ratioLvH /length);
		var simpleRadius = length/2; //Doesn't take into account equal Volume

		var rectangleVolume = depth*height*length*(1/3); //m^3  Multiple by 1/3 to account for triangular shape and empty Space
		var complexRadius = Math.pow(rectangleVolume/((4/3)*Math.PI), 1/3); //Volume of 3D Box = 3D Sphere

		console.log("Simple Radius  " + simpleRadius + " Meters")
		console.log("Complex Radius  " + complexRadius + " Meters")
		return complexRadius;
	},

	findAllRoots: function(min,max,splitsNum,Biot) {
		var step = ( max - min ) / ( splitsNum - 1 );
		var answer;
		var negativeTest;
		var storage = [];
        for (var i = step; i < max; i=i+step ) {
                negativeTest = this.lambdaFormula(i-step, Biot)*this.lambdaFormula(i, Biot);
                if (negativeTest <= 0) {
                         answer = this.bisectionMethod(i-step,i,Biot);
                        if (answer !=undefined) {
                                storage.push(answer);
                        }
                }
                else {
                        //console.log("No Bracketed Root " + negativeTest)
                }
        }
		return storage;
	},

	bisectionMethod: function(min,max,Biot) {
		errorTolerance = (1/Math.pow(10,8))
		result = Infinity // some large value to ensure the calculation goes through.
		negativeTest =this.lambdaFormula(min, Biot)*this.lambdaFormula(max, Biot)
        if (negativeTest <=0 ) {
            var antiFreeze=0;
            while (Math.abs(result) > errorTolerance && antiFreeze<=500) { //The greater the antiFreeze, the more wasted cycles around a singularity        
                    lambdaN = (min+max)/2
                    result=this.lambdaFormula(lambdaN, Biot)
                    if (Math.abs(result) <= errorTolerance && result<=errorTolerance) {
                            return (lambdaN); //At Root
                    }
                    else if ((this.lambdaFormula(min, Biot)*this.lambdaFormula(lambdaN, Biot))>=0) {
                            min=lambdaN;
                    }
                    else if ((this.lambdaFormula(max, Biot)*this.lambdaFormula(lambdaN, Biot))>=0) {
                            max=lambdaN;
                    }
                    antiFreeze++
            }
        }
	},

	lambdaFormula: function( lambdaN, Biot ) {
		var result = 1-lambdaN*(1/Math.tan(lambdaN))-Biot;
		return(result)
	},

	transientSphereSeries: function( density, thermalConduct, heatConvection, cp, rPosition, rTotal, tempInitial, tempInfini, t ){
		var min = 0;
		var max = 1000; // This are for setting Lambda boundaries and nothing else

		var sum=0;
		var alpha = thermalConduct/(density*cp);
		var lambdaN;
		var sinPortion;
		var exponentialPortion;
		var frontCoefficientPortion;


		//console.log("Alpha is " + alpha)

		var Fourier = (alpha*t)/Math.pow(rTotal,2)
		//console.log("Fourier is " +  Fourier)

		var biotNum = heatConvection * rTotal/thermalConduct

	    if ( biotNum != this.cachedBiot ) {
	            console.log("Recalculating Lambda Terms")
	            this.cachedLambda = this.findAllRoots(min,max,max*Math.PI*10,biotNum)
	            this.cachedBiot = biotNum;
	    }

		//console.log("The Biot Value is " + biotNum)

		for (var i = 0; i<this.cachedLambda.length; i++) {
		        var lambdaN = this.cachedLambda[i];
		        var sinPortion= Math.sin(lambdaN*rPosition/rTotal)/(lambdaN*rPosition/rTotal);
		        var exponentialPortion = (1/Math.exp(Math.pow(lambdaN,2)*Fourier));
		        var frontCoefficientPortion = 4*(Math.sin(lambdaN)-(lambdaN*Math.cos(lambdaN)))/ (2*lambdaN-Math.sin(2*lambdaN));
		        sum = frontCoefficientPortion*exponentialPortion*sinPortion + sum;
		}

		tempAtTimeAndRadius=(sum*(tempInitial-tempInfini))+tempInfini

		console.log("The Temperature at radius " + rPosition + " m and time " + t + " seconds is " + tempAtTimeAndRadius + " C or " + this.C2F(tempAtTimeAndRadius) + " F");
		return(tempAtTimeAndRadius)
	},

	/* Utility Functions */
	C2F: function( celsius ){
		return ( (celsius*(9/5)) + 32 );
	},
	F2C: function( farenheit ) {
		return ( (farenheit-32) *(5/9) );
	},
	lbs2kgs: function(){
		return pounds * 0.453592
	},
	randRange: function(lowVal,highVal) {
	     return Math.floor(Math.random()*(highVal-lowVal+1))+lowVal;
	}
}

//Running the Program Stuff
/*
var ovenObject = new OvenModel();
var turkey = new TurkeyModel( 8, ovenObject );

globalTime=0;
setInterval(function(){ovenObject.secondTick()},100);
ovenObject.changeTemp(100)
function time() {
    console.clear()
    if (ovenObject.equalizeTemp() ) {
            globalTime = 0; //Reset the model's time calculation if there are major changes in the tolerance of the temperature
    }
	else {globalTime = globalTime +60 }
    console.log( ovenObject.tempInfini )
    turkey.updateLayerTemps();
}

*/