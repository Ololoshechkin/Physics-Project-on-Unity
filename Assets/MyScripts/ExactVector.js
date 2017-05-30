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
	public function rotateX(alpha: double) {
		return Martrix3d.rotaterOverX(alpha).mulVec(this);
	}
	public function rotateY(alpha: double) {
		return Martrix3d.rotaterOverY(alpha).mulVec(this);
	}
	public function rotateZ(beta: double) {
		return Martrix3d.rotaterOverZ(beta).mulVec(this);
	}
}


class Martrix3d {

	private var data = [
		[0.0d, 0.0d, 0.0d], 
		[0.0d, 0.0d, 0.0d], 
		[0.0d, 0.0d, 0.0d]
	];
	public function Martrix3d() {}

	public function setRow(i: int, vector: double[]) {
		data[i] = vector;
	}

	private function productRowVec(row: int, v: ExactVector) {
		var sum = 0.0d;
		for (var j = 0; j < 3; j++) {
			sum += data[row][j] * (j == 0 ? v.x : (j == 1 ? v.y : v.z)); 
		}
		return sum;
	}

	public function mulVec(v: ExactVector) {
		return ExactVector(
			productRowVec(0, v),
			productRowVec(1, v),
			productRowVec(2, v)
		);
	}

	public static function rotaterOverX(alpha: double) {
		var result = Martrix3d();
		result.setRow(0, [1d, 0d, 				0d			   ]);
		result.setRow(1, [0d, Math.Cos(alpha), -Math.Sin(alpha)]);
		result.setRow(2, [0d, Math.Sin(alpha),  Math.Cos(alpha)]);
		return result;
	}

	public static function rotaterOverY(alpha: double) {
		var result = Martrix3d();
		result.setRow(0, [Math.Cos(alpha),  0d, Math.Sin(alpha)]);
		result.setRow(1, [0d, 				1d, 			 0d]);
		result.setRow(2, [-Math.Sin(alpha), 0d, Math.Cos(alpha)]);
		return result;
	}

	public static function rotaterOverZ(alpha: double) {
		var result = Martrix3d();
		result.setRow(0, [Math.Cos(alpha), -Math.Sin(alpha), 0d]);
		result.setRow(1, [Math.Sin(alpha), Math.Cos(alpha), 0d]);
		result.setRow(2, [0d, 					0d, 		  1d]);
		return result;
	}

}
