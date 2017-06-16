#pragma strict

var thread : GameObject;
var mass: double;
var q: double;
var velocityModulo: double;
var defaultDirection: ExactVector;
var velocityXAlpha: double;
var velocityYAlpha: double;
var velocityZAlpha: double;
var gravityOn: boolean;
var arrow: GameObject;
var bindingEnabled = false;
var shouldDrawBinding = false;
var bindingObject: GameObject[];
var bindingMiddleCilinder: GameObject;
private var bindingMiddle: GameObject[];
private var length: double[];
var k: double = 100000.0;

function getExactPosition() {
	return physicsMaker.getPos();
}

function distToBinding(i: int) {
	var ithBind = bindingObject[i];
	return ithBind.GetComponent(PhysicsBehaviour).getExactPosition().subtract(getExactPosition()).length();
}

function dirToBinding(i: int) {
	var ithBind = bindingObject[i];
	return ithBind.GetComponent(PhysicsBehaviour).getExactPosition().subtract(getExactPosition()).normalize();
}

function dxBinding(i: int) {
	var len222: double = length[i];
	return distToBinding(i) - len222;
}

function ithHookesForce(i: int) {
	return dirToBinding(i).multiply(dxBinding(i)).multiply(k);
}

function HookesForce() {
	if (!bindingEnabled) {
		return ExactVector(0, 0, 0);
	}
	var ans = ExactVector(0, 0, 0);
	for (var i = 0; i < bindingObject.length; i++) {
		ans = ans.add(ithHookesForce(i));
	}
	return ans;
}

function drawBinding(i: int) {
	Debug.Log("drawing : " + i);
	var dirBin = dirToBinding(i);
	var distBin = distToBinding(i);
	var dirBinMulDist = dirBin.multiply(distBin);
	var curBindingMiddle: GameObject = bindingMiddle[i];
	if (shouldDrawBinding) {
		curBindingMiddle.GetComponent(Transform).position = getExactPosition().add(
			dirBinMulDist.multiply(0.5)).toVector3();
		curBindingMiddle.GetComponent(Transform).LookAt(bindingObject[i].GetComponent(Transform).position);
		curBindingMiddle.GetComponent(Transform).localScale = Vector3(0.33, 0.33, distBin * 0.95);
	}
}

function drawBindings() {
	for (var i = 0; i < bindingMiddle.length; i++) {
		drawBinding(i);
	}
}

private var arrowCreated = false;

function velocityDirection() {
	return defaultDirection.rotateX(velocityXAlpha).rotateY(velocityYAlpha).rotateZ(velocityZAlpha).normalize();
}

function createArrow() {
	arrow.GetComponent(MeshRenderer).enabled = true;
	arrowCreated = true;
}

function destroyArrow() {
	arrow.GetComponent(MeshRenderer).enabled = false;
	arrowCreated = false;
}

function getVelocity() {
	return velocityDirection().multiply(velocityModulo);
}

function drawVelocity() {
	if (!arrowCreated) {
		createArrow();
	}
	arrow.GetComponent(Transform).rotation = Quaternion.LookRotation(
		velocityDirection().rotateXZ().multiply(-1.0).toVector3()
	);
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
	return kullonsForce().add(gravityForce()).add(HookesForce());
}

public function startMoving() {
	destroyArrow();
	physicsMaker.setVelocity(getVelocity());
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
	destroyArrow();
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
	length = new double[bindingObject.length];
	bindingMiddle = new GameObject[bindingObject.length];
	for (var i = 0; i < bindingObject.length; i++) {
		length[i] = ExactVector((bindingObject[i] as GameObject).GetComponent(Transform).position 
				- GetComponent(Transform).position).length();
		bindingMiddle[i] = Instantiate(bindingMiddleCilinder);
	}
}

function FixedUpdate() {
	for (var i = 0; i < 50; i++) {
		var force = getForceNoLorence();
		var b = B(radiusVector());
		physicsMaker.applyB(b.multiply(q));
		physicsMaker.setForce(force);
		GetComponent(Transform).position = physicsMaker.getPos().toVector3();
	}
}

function Update () {
	drawBindings();
	/*var force = getForceNoLorence();
	var b = B(radiusVector());
	physicsMaker.applyB(b.multiply(q));
	physicsMaker.setForce(force);
	GetComponent(Transform).position = physicsMaker.getPos();*/
}
