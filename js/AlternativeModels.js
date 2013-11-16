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