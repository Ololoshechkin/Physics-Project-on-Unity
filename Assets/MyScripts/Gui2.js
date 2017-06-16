#pragma strict

import UnityEngine.SceneManagement;

function Start () {
}

function OnGUI() {
	if (GUI.Button(Rect(10, 10, 300, 100), "general task")) {
		Application.LoadLevel("scene1");
	}
	if (GUI.Button(Rect(320, 10, 300, 100), "molecula")) {
		Application.LoadLevel("scene2");
	}
	if (GUI.Button(Rect(630, 10, 300, 100), "triangle")) {
		Application.LoadLevel("sceneTriangle");
	}
	if (GUI.Button(Rect(10, 110, 300, 100), "cube")) {
		Application.LoadLevel("scene2_2");
	}
	if (GUI.Button(Rect(320, 110, 300, 100), "R^3 cubed dipole")) {
		Application.LoadLevel("FSM");
	}
	if (GUI.Button(Rect(630, 110, 300, 100), "Exit (hope to see u soon)")) {
		Application.Quit();
	}
}

function Update () {
}
