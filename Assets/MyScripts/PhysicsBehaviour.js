#pragma strict

var thread : GameObject;
var mass: double;
var q: double;
var velocityModulo: double;
var gravityOn: boolean;

function alpha() {
	return 0.00000125663706 / (4 * 3.141592653589) * q;
}
function kq() {
	return 8987551787.36818 * q;
}
private var g = ExactVector(0.0, -9.812, 0.0);
private var threadPos: ExactVector;
private var physicsMaker: ExactTransform;
private var externalE: ExactVector = ExactVector(0, 0, 0);
private var externalB: ExactVector = ExactVector(0, 0, 0);

function radiusVector() {
	return ExactVector(
		transform.position.x - threadPos.x,
		0.0,
		transform.position.z - threadPos.z
	);
}

function E(r: ExactVector) {
	return thread.GetComponent(ThreadPhysics).getE(r).add(externalE);
}

function B(r: ExactVector) {
	return thread.GetComponent(ThreadPhysics).getB(r).add(externalB);
}

function setExternalE(extE: ExactVector) {
	this.externalE = extE;
}

function setExternalB(extB: ExactVector) {
	this.externalB = extB;
}

function getOwnE(r: ExactVector) {
	var R = r.length();
	return r.normalize().multiply(kq() / (R * R));
}

function getOwnB(r: ExactVector) {
	var R = r.length();
	return physicsMaker.getVelocity().multiply(alpha()).crossProduct(r).divide(R * R * R);
}

function kullonsForce() {
	return E(radiusVector()).multiply(q);
}

function lorenceForce() {
	return physicsMaker.getVelocity().crossProduct(B(radiusVector())).multiply(q);
}

function gravityForce() {
	if (!gravityOn) {
		return ExactVector(0, 0, 0);
	}
	return g.multiply(mass);
}

function getForce() {
	return kullonsForce().add(gravityForce()).add(lorenceForce());
}	

public function startMoving() {
	physicsMaker.start();
}

public function resetState() {
	physicsMaker.reset(
		ExactVector(
			GetComponent(Transform).position
		),
		mass
	);
	physicsMaker.setVelocity(
		radiusVector().normalize().rotateXZ().multiply(velocityModulo)
	);
}

function Start () {
	physicsMaker = ExactTransform(
		GetComponent(Transform).position,
		mass
	);
	threadPos = ExactVector(thread.transform.position);
	physicsMaker.setVelocity(
		radiusVector().normalize().rotateXZ().multiply(velocityModulo)
	);
}

function FixedUpdate() {
	physicsMaker.setForce(getForce());
	GetComponent(Transform).position = physicsMaker.getPos();
}

function Update () {
	physicsMaker.setForce(getForce());
	GetComponent(Transform).position = physicsMaker.getPos();
}