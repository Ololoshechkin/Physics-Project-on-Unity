#pragma strict

var balls: GameObject[];

function Start () {
	
}

function OnGUI() {
	if (GUI.Button(Rect(10, 10, 200, 200), "Start")) {
		for (var ball in balls) {
			ball.GetComponent(PhysicsBehaviour).startMoving();
		}
	}
}

function Update () {
	if (GUI.Button(Rect(10, 10, 200, 200), "Start")) {
		for (var ball in balls) {
			ball.GetComponent(PhysicsBehaviour).startMoving();
		}
	}
}
