#pragma strict

var balls: GameObject[]; 
var activeE: boolean;
var activeB: boolean;


function updateForces() {
	for (var i = 0; i < balls.length; i++) {
		var sumE = ExactVector(0, 0, 0);
		var sumB = ExactVector(0, 0, 0);
		var pos = ExactVector(balls[i].GetComponent(Transform).position);
		for (var j = 0; j < balls.length; j++) {
			if (i == j) {
				continue;
			}
			var r = pos.subtract(
				ExactVector(balls[j].GetComponent(Transform).position)
			);
			if (activeE) {
				sumE = sumE.add(
					balls[j].GetComponent(PhysicsBehaviour).getOwnE(r)
				);
			}
			if (activeB) {
				sumB = sumB.add(
					balls[j].GetComponent(PhysicsBehaviour).getOwnB(r)
				);
			}
		}
		balls[i].GetComponent(PhysicsBehaviour).setExternalE(sumE);
		balls[i].GetComponent(PhysicsBehaviour).setExternalB(sumB);
	}
}

function Start () {
	updateForces();
}

function FixedUpdate() {
	updateForces();
}

function Update () {
	updateForces();
}