#pragma strict

class ExactTransform {

	private var coordinate: ExactVector;
	private var velocity: ExactVector = ExactVector(0, 0, 0);
	private var mass: double;
	private var stop = true;

	public function ExactTransform(pos: Vector3, m: double) {
		this.coordinate = ExactVector(pos);
		this.mass = m;
	}

	public function applyB(bq: ExactVector) {
		if (stop) {
			return;
		}
		if (bq.length2() == 0.0) {
			return;
		}
		var dt = Time.deltaTime * 0.7;
		var bn = bq.normalize();
		bq = bq.multiply(dt / mass);
		var vt = velocity.scalarProduct(bn);
		var vn = velocity.subtract(bn.multiply(vt));
		if (vn.length2() == 0.0) {
			return;
		}
		var vn2 = vn.crossProduct(bn);
		var ang = bq.length();
		vn = vn.multiply(Math.Cos(ang)).add(vn2.multiply(Math.Sin(ang)));
		velocity = vn.add(bn.multiply(vt));
	}

	public function setForce(force: ExactVector) {
		if (stop) {
			return;
		}
		var dt = Time.deltaTime * 0.7;
		var acceleration = force.divide(mass);
		coordinate = coordinate.add(velocity.multiply(dt));
		velocity = velocity.add(acceleration.multiply(dt));
	}

	public function setVelocity(vel: ExactVector) {
		velocity = new ExactVector(vel);
	}

	public function getVelocity() {
		return new ExactVector(velocity);
	}

	public function getPos() {
		return coordinate.toVector3();
	}

	public function reset(pos: ExactVector, m: double) {
		this.coordinate = pos;
		this.velocity = ExactVector(0, 0, 0);
		this.mass = m;
		this.stop = true;
	}

	public function start() {
		stop = false;
	}

}

