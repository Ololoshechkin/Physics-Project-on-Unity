#pragma strict

var thread : GameObject;
var mass: double;
var q: double;
var velocityModulo: double;
var defaultDirection: ExactVector;
var velocityXAlpha: double;
var velocityZAlpha: double;
var gravityOn: boolean;
var velocityPrefab: GameObject;

private var arrow: GameObject;
private var arrowCreated = false;

function velocityDirection() {
	return defaultDirection.rotateX(velocityXAlpha).rotateZ(velocityZAlpha).normalize();
}

function createArrow() {
	arrow = Instantiate(
		velocityPrefab, 
		GetComponent(Transform).position, 
		Quaternion.FromToRotation(
			Vector3(0, 0, 0),
			defaultDirection.toVector3()
		)
	);
	arrowCreated = true;
}

function getVelocity() {
	return velocityDirection().multiply(velocityModulo);
}

function drawVelocity() {
	if (!arrowCreated) {
		createArrow();
	}
	arrow.GetComponent(Transform).rotation = Quaternion.Euler(velocityXAlpha, 0, velocityZAlpha);
}

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

function getForceNoLorence() {
	return kullonsForce().add(gravityForce());
}	

public function startMoving() {
	Destroy(arrow);
	arrowCreated = false;
	physicsMaker.start();
}

public function resetState() {
	physicsMaker.reset(
		ExactVector(
			GetComponent(Transform).position
		),
		mass
	);
	physicsMaker.setVelocity(getVelocity());
	drawVelocity();
}

function Start () {
	physicsMaker = ExactTransform(
		GetComponent(Transform).position,
		mass
	);
	threadPos = ExactVector(thread.transform.position);
	defaultDirection = radiusVector().normalize().rotateXZ();
	drawVelocity();
	physicsMaker.setVelocity(getVelocity());
}

function FixedUpdate() {
	var force = getForceNoLorence();
	var b = B(radiusVector());
	physicsMaker.applyB(b.multiply(q));
	physicsMaker.setForce(force);
	GetComponent(Transform).position = physicsMaker.getPos();
}

function Update () {
	var force = getForceNoLorence();
	var b = B(radiusVector());
	physicsMaker.applyB(b.multiply(q));
	physicsMaker.setForce(force);
	GetComponent(Transform).position = physicsMaker.getPos();
}
