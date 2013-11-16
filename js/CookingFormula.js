//Useful Websites
// http://math.stackexchange.com/questions/406082/numerical-method-to-solve-a-trigonometric-cotangent-function-transient-heat
// http://web.cecs.pdx.edu/~gerry/epub/pdf/transientConductionSphere.pdf
// http://web.cecs.pdx.edu/~gerry/epub/

//Global Variables for Turkey
density = 996; // kg/m3 Assuming Density of Water 1000 kg/m3
cp = 2810 // J/kg K for Turkey
heatConvection = 5; // W/m2 K Some Reasonable estimate for natural Convection. Change as needed. 5-25
thermalConduct = 0.412 // W/m K

function celsiusToFarenheit(celsius) {
farenheit = (celsius*(9/5)) + 32;
return(farenheit)
}

function poundsToKilograms(pounds) {
kilograms = (pounds * 0.453592);
return(kilograms)
}

function findClosest(value,array) {
closestDiff = null;
closestPosition = null;
	for (var i=0;i<array.length;i++) {
		diff = Math.abs(value-array[i])
		if (diff<closestDiff || closestDiff == null) {
			closestPosition=i;
			closestDiff = diff;
		} 
	}
	return ([closestPosition,array[closestPosition]])
}

function biotSphereCoefficients (Biot) {
Bi = [0.01, 0.02, 0.04, 0.06, 0.08, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40, 50, 100, 10000]
lambdaOne = [0.1730, 0.2445, 0.3450, 0.4217, 0.4860, 0.5423, 0.7593, 0.9208, 1.0528, 1.1656, 1.2644, 1.3525, 1.4320, 1.5044, 1.5708, 2.0288, 2.2889, 2.4556, 2.5704, 2.6537, 2.7165, 2.7654, 2.8044, 2.8363, 2.9857, 3.3072, 3.0632, 3.0788, 3.1102, 3.1416]
alphaOne = [ 1.0030, 1.0060, 1.0120, 1.0179, 1.0239, 1.0298, 1.0592, 1.0880, 1.1164, 1.1441, 1.1713, 1.1978, 1.2236, 1.2488, 1.2732, 1.4793, 1.6227, 1.7202, 1.7870, 1.8338, 1.8673, 1.8920, 1.9106, 1.9249, 1.9781, 1.9898, 1.9942, 1.9962, 1.9990, 2 ]
position = findClosest(Biot,Bi)[0]
return([lambdaOne[position], alphaOne[position]])
}


function calculateRadius(weight) {
//Using Ratios for a rectangular Box Turkey
ratioLvG=1.4; //1.4, Turkey length vs shoulder girth
ratioLvH=2; //2, Turkey length vs height from resting position

length = Math.pow(weight/((1/ratioLvG)*(1/ratioLvH)*density),(1/3))
depth = 1/(ratioLvG /length);
height = 1/(ratioLvH /length);
simpleRadius = length/2; //Doesn't take into account equal Volume

rectangleVolume = depth*height*length*(1/3); //m^3  Multiple by 1/3 to account for triangular shape and empty Space
complexRadius = Math.pow(rectangleVolume/((4/3)*Math.PI), 1/3); //Volume of 3D Box = 3D Sphere

console.log("Simple Radius  " + simpleRadius + " Meters")
console.log("Complex Radius  " + complexRadius + " Meters")
return(complexRadius)
}

function lumpedCapacitance (outerRadius,radiusInner,tempInitial,tempInfini,heatConvectionTerm,t) {
volume = (4/3)*Math.PI*Math.pow(outerRadius,3) - (4/3)*Math.PI*Math.pow(radiusInner,3); //3D Sphere
surfaceArea = 4*Math.PI*Math.pow(outerRadius,2); //3D Sphere
mass = density * volume;
charLength = volume/surfaceArea ;
biotNum = heatConvectionTerm * charLength/thermalConduct
console.log("The Biot Value is " + biotNum)
b=(heatConvectionTerm)/(density*charLength*cp)
console.log("The time constant b is "+ b)
tempAtTime = Math.exp(-b*t)*(tempInitial-tempInfini)+tempInfini;
console.log("The Temperature at time " + t +" seconds is " + tempAtTime)
qDot = -1*heatConvectionTerm*surfaceArea*(tempAtTime-tempInfini) //Heat Transfer Rate Useful for water Loss
console.log("The Heat Flux is " + qDot )
return([tempAtTime,qDot])
}




function lumpedCapacitanceMethod (outerRadius,radiusInner,tempInitial,tempInfini, t) {
volume = (4/3)*Math.PI*Math.pow(outerRadius,3) - (4/3)*Math.PI*Math.pow(radiusInner,3); //3D Sphere
surfaceArea = 4*Math.PI*Math.pow(outerRadius,2); //3D Sphere
mass = density * volume;
charLength = volume/surfaceArea ;
biotNum = heatConvection * charLength/thermalConduct
console.log("The Biot Value is " + biotNum)
b=(heatConvection)/(density*charLength*cp)
console.log("The time constant b is "+ b)
tempAtTime = Math.exp(-b*t)*(tempInitial-tempInfini)+tempInfini;
console.log("The Temperature at time " + t +" seconds is " + tempAtTime)
Qdot = -1*heatConvection*surfaceArea*(tempAtTime-tempInfini) //Heat Transfer Rate Useful for water Loss
console.log("The Heat Flux is " + Qdot )
return(tempAtTime)
}


function transientSphereOneTerm (rPosition,rTotal,tempInitial,tempInfini,t) {
alpha = thermalConduct/(density*cp)
console.log("Alpha is " + alpha)

Fourier = (alpha*t)/Math.pow(rTotal,2)
console.log("Fourier is " +  Fourier)
biotNum = heatConvection * rTotal/thermalConduct
console.log("The Biot Value is " + biotNum)
temp=biotSphereCoefficients(biotNum)
lambdaOne=temp[0];
alphaOne=temp[1];
console.log("lambda1 is " + lambdaOne)
console.log("A1 is " + alphaOne)

//This is only valid for Fourier greater than 0.2
sinPortion= Math.sin(lambdaOne*rPosition/rTotal)/(lambdaOne*rPosition/rTotal);
expotentialPortion = alphaOne*(1/Math.exp(Math.pow(lambdaOne,2)*Fourier))
tempAtTimeAndRadius=(sinPortion*expotentialPortion*(tempInitial-tempInfini))+tempInfini
console.log("The Temperature at radius " + rPosition + " m and time " + t + "  seconds is " + tempAtTimeAndRadius + " C or " + celsiusToFarenheit(tempAtTimeAndRadius) + " F");
}

function findAllRoots (Biot) {
limit = 50; //Terms to Compute too
storage = [];
	for (var k=0; k<=limit; k++) {
		minK = (k+0.5)*Math.PI;
		maxK = (k+1)*Math.PI;
		answer = bisectionMethod(minK,maxK,Biot);
		if (answer !=undefined) {
		storage.push(answer);
		}
	}
//console.log(storage)
return(storage)
}

function findAllRootsAlternative (min,max,splitsNum,Biot) {
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
	  
function linspace(min, max, length) {
var arr = new Array(length);
var step = ( max - min ) / ( length - 1 );
for (var i = 0; i < length; ++i )
        arr[i] = min + ( i * step )
      return arr
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
this.tempInfini=0; //C
this.setTemp = 0;
var proportional = 0.01; // This value is arbitrary to how fast you want the temperatures to converge. (Or oscillate, which could be realistic as well)
var errorTolerance = 1; //Stove is accurate to 1 degree Celcius Should hopefully oscillate below that value.

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
	}
}
ovenObject = new oven ();

function Turkey(weight,time) {

totalRadius = calculateRadius(weight)
	function Layer(name) {
	this.name = name
	this.temperature = 20;
	this.waterContent =100;
	this.Qdot = 0;
	}
	
skin= new Layer("Skin")
body = new Layer("Body")
core = new Layer("Core")

skin.temperature = lumpedCapacitance(totalRadius,totalRadius*0.85,skin.temperature,ovenTemp,airConvection,time)[0]
body.temperature = lumpedCapacitance(totalRadius*0.85,totalRadius*0.30,body.temperature,skin.temperature,airConvection*1000,time)[0]
core.temperature = lumpedCapacitance(totalRadius*0.30,0,core.temperature,body.temperature,airConvection*1000,time)[0]
} 


function transientSphereSeries (rPosition,rTotal,tempInitial,tempInfini,t) {
var sum=0;
var alpha = thermalConduct/(density*cp)
console.log("Alpha is " + alpha)

var Fourier = (alpha*t)/Math.pow(rTotal,2)
console.log("Fourier is " +  Fourier)
var biotNum = heatConvection * rTotal/thermalConduct
console.log("The Biot Value is " + biotNum)

var min = 0;
var max = 1000;

lambdaTerms=findAllRootsAlternative (min,max,max*Math.PI*10,biotNum)
	for (var i = 0; i<lambdaTerms.length; i++) {
		lambdaN = lambdaTerms[i]

		sinPortion= Math.sin(lambdaN*rPosition/rTotal)/(lambdaN*rPosition/rTotal);
		exponentialPortion = (1/Math.exp(Math.pow(lambdaN,2)*Fourier))
		frontCoefficientPortion = 4*(Math.sin(lambdaN)-(lambdaN*Math.cos(lambdaN)))/ (2*lambdaN-Math.sin(2*lambdaN))
		sum = frontCoefficientPortion*exponentialPortion*sinPortion + sum
}
tempAtTimeAndRadius=(sum*(tempInitial-tempInfini))+tempInfini
console.log("The Temperature at radius " + rPosition + " m and time" + t + " seconds is " + tempAtTimeAndRadius + " C or " + celsiusToFarenheit(tempAtTimeAndRadius) + " F");
return(tempAtTimeAndRadius)
}


setInterval(function(){time()},1000);

function time() {
ovenObject.equalizeTemp();

}