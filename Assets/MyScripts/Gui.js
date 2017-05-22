#pragma strict

import System.Collections.Generic;

var balls: GameObject[];
var thread: GameObject;
var interacter: GameObject;
private var x: float = 20;
private var y: float = 40;
private var width: float = 200;
private var delta: float = 10;
private var height: float = 20;
private var textWidth: float = 70;
private var textFields = new Dictionary.<String, String>();
private var shouldDeleteTrail = 0;
private var interactionEOn: boolean = false;
private var interactionBOn: boolean = false;
private var gravityOn: boolean = false;
private var menuDelta: float = 30;
private var SCREEN_HEIGHT: float = Screen.height;
private var SCREEN_WIDTH: float = Screen.width;
private var minSliderRatio: float;
private var maxSliderRatio: float;
private var hSliderValue: float = 1.0;

function resetConstraints() {
    x = 20 * hSliderValue;
    y = 40 * hSliderValue;
    width = 200 * hSliderValue;
    delta = 10 * hSliderValue;
    height = 20 * hSliderValue;
    textWidth = 70 * hSliderValue;
    menuDelta = 30 * hSliderValue;
}

function getBoxWidth() {
	return width + textWidth + menuDelta;
}

function getBoxHeight() {
	return (height + delta) * (10.0 + balls.length) + menuDelta;
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
	minSliderRatio = (SCREEN_HEIGHT / 8.0) / getBoxHeight();
	maxSliderRatio = SCREEN_HEIGHT / getBoxHeight();
}

function OnGUI() {
	resetConstraints();
	GUI.Box(
		new Rect(
			x / 2, 
			y / 2,
			getBoxWidth(),
			getBoxHeight()
		),
		"Menu"
	);
	var tmpDict = new Dictionary.<String, String>();
	for (var key: String in textFields.Keys) {
		GUI.Box(new Rect (x, y, textWidth, height), key);
		tmpDict[key] = GUI.TextField(Rect (x + textWidth, y, width, height), textFields[key], 100);
		y += height + delta;
	}
	interactionEOn = GUI.Toggle(Rect(x, y, width, height), interactionEOn, "Interaction(E)");
	y += height / 2 + delta;
	interactionBOn = GUI.Toggle(Rect(x, y, width, height), interactionBOn, "Interaction(B)");
	y += height / 2 + delta;
	gravityOn = GUI.Toggle(Rect(x, y, width / 2, height), gravityOn, "gravity");
	y += height / 2 + delta;
	textFields = tmpDict;
	if (GUI.Button(Rect(x, y, width, height), "Preview")) {
		for (var i = 0; i < balls.length; i++) {
			var ball = balls[i];
			ball.GetComponent(Transform).position = Vector3(double.Parse(textFields["radius(" + i + ")"]), 0, 0);
			shouldDeleteTrail = 10;
			ball.GetComponent(PhysicsBehaviour).resetState();
		}
	}
    y += height + delta;
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
    y += height + delta;
    hSliderValue = GUI.HorizontalSlider(
    	new Rect(
    		x, 
    		y,
    		Math.Max(width, SCREEN_WIDTH/ 16),
    		Math.Max(height, SCREEN_HEIGHT * 0.1)
    	), 
    	hSliderValue, 
    	minSliderRatio, 
    	maxSliderRatio
    );
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

