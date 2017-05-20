#pragma strict

var lambda: double;
var I: double;
private var direction = ExactVector(0, 1, 0);

function alpha() {
	return lambda * 17975103610.5;
}

function beta() {
	return 0.00000125663706 * I / (2 * 3.141592653589);
}

function getE(r: ExactVector) {
	var R = r.length();
	return r.normalize().multiply(alpha() / R);
}

function getB(r: ExactVector) {
	var R = r.length();
	return r.normalize().crossProduct(direction).multiply(beta()).divide(R);
}

function Start () {
	
}

function Update () {

}