#pragma strict

var targets: Transform[];
private var curTarget = 0;

function setTarget() {
	GetComponent(MouseOrbitExtended).target = targets[curTarget];
}

function Start () {
	setTarget();
}

function Update () {
	if (Input.GetKeyDown ("space")) {
		curTarget = (curTarget + 1) % targets.length;
		setTarget();
    }
    if (Input.GetKeyDown ("r")) {
		GetComponent(MouseOrbitExtended).isActive = !GetComponent(MouseOrbitExtended).isActive; 
    }
}