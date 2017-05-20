#pragma strict

import System.Collections.Generic;

var balls: GameObject[];
var thread: GameObject;
var interacter: GameObject;
private var x = 20;
private var y = 20;
private var width = 200;
private var delta = 10;
private var height = 90;
private var textFields = new Dictionary.<String, String>();
private var shouldDeleteTrail = 0;
private var interactionEOn: boolean = false;
private var interactionBOn: boolean = false;
private var gravityOn: boolean = false;

function resetConstraints() {
	x = 20;
	y = 40;
	width = 200;
	delta = 10;
	height = 90;
}

function Start () {
	textFields["q"] = "-0.2";
	textFields["lambda"] = "0.00000001";
	textFields["velocity"] = "50";
	textFields["mass"] = "0.01";
	textFields["I"] = "10";
	for (var i = 0; i < balls.length; i++) {
		textFields["radius(" + i + ")"] = "" + balls[i].GetComponent(Transform).position.x;
	}
}

function OnGUI() {
	resetConstraints();
	GUI.Box(new Rect(10, 10, (width + delta) * (9 + balls.length) + 10, height + 30), "Menu");
	var tmpDict = new Dictionary.<String, String>();
	for (var key: String in textFields.Keys) {
		GUI.Box(new Rect (x, y - 20, width, height), key);
		tmpDict[key] = GUI.TextField(Rect (x, y, width, height), textFields[key], 100);
		x += width + delta;
	}
	interactionEOn = GUI.Toggle(Rect(x, y, width / 2, height), interactionEOn, "Interaction(E)");
	x += width / 2 + delta;
	interactionBOn = GUI.Toggle(Rect(x, y, width / 2, height), interactionBOn, "Interaction(B)");
	x += width / 2 + delta;
	gravityOn = GUI.Toggle(Rect(x, y, width / 2, height), gravityOn, "gravity");
	x += width / 2 + delta;
	textFields = tmpDict;
	if (GUI.Button(Rect(x, y, width, height), "Preview")) {
		for (var i = 0; i < balls.length; i++) {
			var ball = balls[i];
			ball.GetComponent(Transform).position = Vector3(double.Parse(textFields["radius(" + i + ")"]), 0, 0);
			shouldDeleteTrail = 10;
			ball.GetComponent(PhysicsBehaviour).resetState();
		}
	}
	x += width + delta;
	if (GUI.Button(Rect(x, y, width, height), "Start")) {
		thread.GetComponent(ThreadPhysics).lambda = double.Parse(textFields["lambda"]);
		thread.GetComponent(ThreadPhysics).I = double.Parse(textFields["I"]);
		interacter.GetComponent(BallsInteraction).activeE = interactionEOn;
		interacter.GetComponent(BallsInteraction).activeB = interactionBOn;
		for (i = 0; i < balls.length; i++) {
		    ball = balls[i];
			ball.GetComponent(Transform).position = Vector3(double.Parse(textFields["radius(" + i + ")"]), 0, 0);
			ball.GetComponent(PhysicsBehaviour).gravityOn = gravityOn;
			ball.GetComponent(PhysicsBehaviour).q = double.Parse(textFields["q"]);
			ball.GetComponent(PhysicsBehaviour).mass = double.Parse(textFields["mass"]);
			ball.GetComponent(PhysicsBehaviour).velocityModulo = double.Parse(textFields["velocity"]);
			shouldDeleteTrail = 10;
			ball.GetComponent(PhysicsBehaviour).resetState();
			ball.GetComponent(PhysicsBehaviour).startMoving();
		}
    }
}

function Update () {
	for (var ball in balls) {
		if (shouldDeleteTrail != 0) {
			ball.GetComponent(TrailRenderer).time = 0;
			shouldDeleteTrail--;
		} else {
			ball.GetComponent(TrailRenderer).time = 1000;
		}
	}
}

