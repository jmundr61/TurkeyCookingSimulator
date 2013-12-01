//Useful Websites
// http://math.stackexchange.com/questions/406082/numerical-method-to-solve-a-trigonometric-cotangent-function-transient-heat
// http://web.cecs.pdx.edu/~gerry/epub/pdf/transientConductionSphere.pdf
// http://web.cecs.pdx.edu/~gerry/epub/
//http://highered.mcgraw-hill.com/sites/dl/free/0073129305/314124/cen29305_ch04.pdf
//http://www.nt.ntnu.no/users/skoge/prost/proceedings/aiche-2005/topical/pdffiles/T9/papers/554a.pdf
//http://www.rohanliston.com/portfolio/just-for-fun?id=23

//Global Variables for Turkey
density = 1050; // kg/m3 Assuming Density of Water 1000 kg/m3
cp = 2000 // 2810 J/kg K for Turkey. Extra is to semi-account for water evaporation energy
heatConvection = 9; // W/m2 K Some Reasonable estimate for natural Convection. Change as needed. 5-25
thermalConduct = 0.412 // W/m K // Chicken
globalTime = 0;

function celsiusToFarenheit(celsius) {
farenheit = (celsius*(9/5)) + 32;
return(farenheit)
}

function farenheitToCelsius (farenheit) {
celsius = (farenheit*(9/5)) + 32;
return(celsius)
}

function poundsToKilograms(pounds) {
kilograms = (pounds * 0.453592);
return(kilograms)
}

function calculateRadius(weight) {
//Using Ratios for a rectangular Box Turkey
ratioLvG=1.4; //1.4, Turkey length vs shoulder girth
ratioLvH=2; //2, Turkey length vs height from resting position

length = Math.pow(weight/((1/ratioLvG)*(1/ratioLvH)*density),(1/3))
depth = 1/(ratioLvG /length);
height = 1/(ratioLvH /length);
simpleRadius = length/2; //Doesn't take into account equal Volume

rectangleVolume = depth*height*length; //m^3  Multiple by 1/3 to account for triangular shape and empty Space
complexRadius = Math.pow(rectangleVolume/((4/3)*Math.PI), 1/3); //Volume of 3D Box = 3D Sphere

console.log("Simple Radius  " + simpleRadius + " Meters")
console.log("Complex Radius  " + complexRadius + " Meters")
return(complexRadius)
}


function findAllRoots(min,max,splitsNum,Biot) {
var step = ( max - min ) / ( splitsNum - 1 );
var storage = [];
	for (var i = step; i < max; i=i+step ) {
		negativeTest = lambdaFormula(i-step, Biot)*lambdaFormula(i, Biot);
		if (negativeTest <= 0) {
			answer = bisectionMethod(i-step,i,Biot);
			if (answer !=undefined) {
				storage.push(answer);
			}
		}
		else {
			//console.log("No Bracketed Root " + negativeTest)
		}
	}
return(storage)	
}
	  
	
function bisectionMethod(min,max,Biot) {
errorTolerance = (1/Math.pow(10,8))
result = Infinity // some large value to ensure the calculation goes through.
negativeTest =lambdaFormula(min, Biot)*lambdaFormula(max, Biot)
	if (negativeTest <=0 ) {
		var antiFreeze=0;
		while (Math.abs(result) > errorTolerance && antiFreeze<=500) { //The greater the antiFreeze, the more wasted cycles around a singularity	
			lambdaN = (min+max)/2
			result=lambdaFormula(lambdaN, Biot)
			if (Math.abs(result) <= errorTolerance && result<=errorTolerance) {
				return (lambdaN); //At Root
			}
			else if ((lambdaFormula(min, Biot)*lambdaFormula(lambdaN, Biot))>=0) {
				min=lambdaN;
			}
			else if ((lambdaFormula(max, Biot)*lambdaFormula(lambdaN, Biot))>=0) {
				max=lambdaN;
			}
			antiFreeze++
		}
	}
}

function lambdaFormula(lambdaN, Biot) { 
result = 1-lambdaN*(1/Math.tan(lambdaN))-Biot;
return(result)
}

function oven() {
this.tempInfini=20; //C
this.setTemp = 20;
this.steadyTemp = 20;
this.steadyTimer = 0;
var proportional = 0.004; // This value is arbitrary to how fast you want the temperatures to converge. (Or oscillate, which could be realistic as well)
var errorTolerance = 10; //Stove is accurate to 25 degree Celcius Should hopefully oscillate below that value.

	this.changeTemp = function(setTemp) {
		this.setTemp = setTemp;
	}

	this.equalizeTemp = function() { // Equalize Temp will need to be sent each time iteration
		var error = Math.abs(this.setTemp-this.tempInfini);
		if (this.setTemp>this.tempInfini) {
			this.tempInfini = this.tempInfini + error*proportional;
		}
		else if (this.setTemp<this.tempInfini) {
			this.tempInfini = this.tempInfini - error*proportional;
		}
		if (error>errorTolerance) {
			return (true) //Need to run the Heat Calculations again next cycle
		}
		else {
		this.steadyTemp = this.tempInfini;
		}
	}
}

function layerModel(name,radiusPercentage) {
	this.name = name;
	this.radiusPercent=radiusPercentage;
	this.initialTemp = 20;
	this.waterLost = 0;
	this.finalTemperature = 20;
}
 

function turkeyModel(weight) {
this.totalRadius = calculateRadius(weight)
this.skin = new layerModel("Skin",0.85)
this.body = new layerModel("Body",0.45)
this.core = new layerModel("Core",0.01)

	this.cookCondition = function(cookValue) {
		var multiplier = 1;
			if (cookValue>=multiplier*250000) {
				return("House Fire")
			}
			else if(cookValue>=multiplier*150000) {
				return("Charcoal")
			}
			else if (cookValue>=multiplier*80000) {
				return("Dry")
			}
			else if (cookValue>=multiplier*18000) {
				return("Cooked")
			}			
			else if (cookValue>=multiplier*5000) {
				return("Undercooked")
			}		
			else {
				return("Raw")
			}	
	}

	this.resetLayerTemps = function () {
		this.skin.initialTemp = this.skin.finalTemperature;
		this.body.initialTemp = this.body.finalTemperature;
		this.core.initialTemp = this.core.finalTemperature;
	}
		
	this.updateLayerTemps = function() {
	//Temperature Calculations
		this.skin.finalTemperature = transientSphereSeries (this.skin.radiusPercent*this.totalRadius,this.totalRadius,this.skin.initialTemp,ovenObject.steadyTemp,globalTime)
		this.body.finalTemperature = transientSphereSeries (this.body.radiusPercent*this.totalRadius,this.totalRadius,this.body.initialTemp,ovenObject.steadyTemp,globalTime)
		this.core.finalTemperature = transientSphereSeries (this.core.radiusPercent*this.totalRadius,this.totalRadius,this.core.initialTemp,ovenObject.steadyTemp,globalTime)
		
	//Water Loss Calculations
		this.skin.waterLost = this.skin.waterLost + waterLoss(this.skin.finalTemperature)
		this.body.waterLost = this.body.waterLost + waterLoss(this.body.finalTemperature)
		this.core.waterLost = this.core.waterLost + waterLoss(this.core.finalTemperature)
			
		console.log("Skin: "+ this.skin.waterLost + " " + turkey.cookCondition(this.skin.waterLost));
		console.log("Body: "+ this.body.waterLost + " " + turkey.cookCondition(this.body.waterLost));
		console.log("Core: "+ this.core.waterLost + " " + turkey.cookCondition(this.core.waterLost));
	}
}

function sphereVolume (radius) {
return((4/3)*Math.PI*Math.pow(radius,3))
}

function sphereSurfaceArea(radius) {
return (4*Math.PI*Math.pow(radius,2))
}

function waterLoss(temperature) {
return (Math.pow(10,(temperature-20)/80)-1)
}

var oldBiot=null;
function transientSphereSeries (rPosition,rTotal,tempInitial,tempInfini,t) {
var min = 0;
var max = 10000; // This are for setting Lambda boundries and nothing else
//thermalConduct = ((tempInitial-20)*(0.13/60)) + 0.32;
var sum=0;
var alpha = thermalConduct/(density*cp)
//console.log("Alpha is " + alpha)

var Fourier = (alpha*t)/Math.pow(rTotal,2)
//console.log("Fourier is " +  Fourier)

var biotNum = heatConvection * rTotal/thermalConduct

	if (biotNum != oldBiot) {
		console.log("Recalculating Lambda Terms")
		lambdaTerms = findAllRoots(min,max,max*Math.PI*10,biotNum)
		oldBiot = biotNum;
	}

//console.log("The Biot Value is " + biotNum)

for (var i = 0; i<lambdaTerms.length; i++) {
	lambdaN = lambdaTerms[i]
	sinPortion= Math.sin(lambdaN*rPosition/rTotal)/(lambdaN*rPosition/rTotal);
	exponentialPortion = (1/Math.exp(Math.pow(lambdaN,2)*Fourier))
	frontCoefficientPortion = 4*(Math.sin(lambdaN)-(lambdaN*Math.cos(lambdaN)))/ (2*lambdaN-Math.sin(2*lambdaN))
	sum = frontCoefficientPortion*exponentialPortion*sinPortion + sum
}
tempAtTimeAndRadius=(sum*(tempInitial-tempInfini))+tempInfini

console.log("The Temperature at radius " + rPosition + " m and time " + t/60/60 + " hours is " + tempAtTimeAndRadius + " C or " + celsiusToFarenheit(tempAtTimeAndRadius) + " F");
return(tempAtTimeAndRadius)
}


//Running the Program Stuff

ovenObject = new oven ();
turkey = new turkeyModel(7.257);

setInterval(function(){time()},1000);

totalCookTime = 0;
scale = 1
function time() {
	console.clear()
	var equalized = ovenObject.equalizeTemp()
	if (ovenObject.steadyTimer>=80*scale && equalized) {
		ovenObject.steadyTimer = 0;
		ovenObject.steadyTemp = ovenObject.tempInfini
		turkey.resetLayerTemps();
		globalTime = 0; //Reset the model's time calculation if there are major changes in the tolerance of the temperature
	}
		else {
		globalTime = globalTime + scale;
		ovenObject.steadyTimer = ovenObject.steadyTimer + scale;
		totalCookTime = totalCookTime + scale;
		}
		
	console.log(ovenObject.tempInfini)
	console.log(ovenObject.steadyTemp)
	console.log(ovenObject.steadyTimer)
	console.log(totalCookTime/60/60 +" hours")
	turkey.updateLayerTemps();
}