#pragma strict

var deltaX = 60.0;
var deltaY = 60.0;
var speedX = 5.0;
var speedY = 5.0;

private var dx = Vector3(deltaX, 0, 0);
private var dy = Vector3(0, deltaY, 0);
private var d2x = Vector3(speedX, 0, 0);
private var d2y = Vector3(0, speedY, 0);

enum MoveDirection {None, Up, Down, Left, Right};
private var direction = MoveDirection.None;


function moveX(c: double) {
	GetComponent(Transform).Translate(dx * c);
	dx += d2x;
}

function moveY(c: double) {
	GetComponent(Transform).Translate(dy * c);
	dy += d2y;
}

function resetSpeed() {
	dx = Vector3(deltaX, 0, 0);
 	dy = Vector3(0, deltaY, 0);
}

function Start () {

}

function Update () {
	if (Input.GetKeyDown ("left")) {
		direction = MoveDirection.Left;
	}
	if (Input.GetKeyDown ("right")) {
		direction = MoveDirection.Right;
	}
	if (Input.GetKeyDown ("up")) {
		direction = MoveDirection.Up;
	}
	if (Input.GetKeyDown ("down")) {
		direction = MoveDirection.Down;
	}
	if (!Input.anyKey) {
		direction = MoveDirection.None;
	}
	switch (direction) {
		case MoveDirection.None:
			resetSpeed();
			break;
		case MoveDirection.Left:
			moveX(-Time.deltaTime);
			break;
		case MoveDirection.Right:
			moveX(Time.deltaTime);
			break;
		case MoveDirection.Up:
			moveY(Time.deltaTime);
			break;
		case MoveDirection.Down:
			moveY(-Time.deltaTime);
			break;
	}
}







