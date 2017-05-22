#pragma strict

import System;

class ExactVector {
	public var x : double;
	public var y : double;
	public var z : double;
	public function ExactVector(x: double, y: double, z: double) {
		this.x = x;
		this.y = y;
		this.z = z;
	}
	public function ExactVector(vec: Vector3) {
		this.x = vec.x;
		this.y = vec.y;
		this.z = vec.z;
	}
	public function ExactVector(vec: ExactVector) {
		this.x = vec.x;
		this.y = vec.y;
		this.z = vec.z;
	}
	public function add(other: ExactVector) {
		return ExactVector(x + other.x, y + other.y, z + other.z);
	}
	public function subtract(other: ExactVector) {
		return ExactVector(x - other.x, y - other.y, z - other.z);
	}
	public function multiply(alpha: double) {
		return ExactVector(x * alpha, y * alpha, z * alpha);
	}
	public function divide(alpha: double) {
		return ExactVector(x / alpha, y / alpha, z / alpha);
	}
	public function length2() {
		return x * x + y * y + z * z;
	}
	public function length() {
		return Math.Sqrt(x * x + y * y + z * z);
	}
	public function normalize() {
		var L = length();
		return ExactVector(x / L, y / L, z / L);
	}
	public function toVector3() {
		return Vector3(x, y, z);
	}
	public function rotateXZ() {
		return ExactVector(-z, y, x);
	}
	public function scalarProduct(other: ExactVector) {
		return x * other.x + y * other.y + z * other.z;
	}
	public function crossProduct(other: ExactVector) {
		return ExactVector(
			y * other.z - z * other.y,
			-(x * other.z - z * other.x),
			x * other.y - y * other.x
		);
	}
	public function cosinus(other: ExactVector) {
		return scalarProduct(other) / (length() * other.length());
	}
	public function sinus(other: ExactVector) {
		return crossProduct(other).length() / (length() * other.length());
	}
}
