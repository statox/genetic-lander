import P5 from 'p5';

export class Lander {
    pos: P5.Vector;
    speed: P5.Vector; // Vertical-horizontal speed
    acceleration: P5.Vector; // Vertical-horizontal acc
    r_speed: number; // Rotational speed
    r_acceleration: number; // Rotational acceleration
    direction: P5.Vector; // The inclination of the object
    size: number;
    p5: P5;
    animations_ts: {
        rotate_left: number;
        rotate_right: number;
        thrust: number;
    };
    rotation: P5.Vector;
    animation_ts: {
        rotate_clockwise: number;
        rotate_counterclockwise: number;
        thrust: number;
    };

    constructor(p5) {
        this.p5 = p5;
        this.pos = p5.createVector(250, 0);
        this.speed = p5.createVector(0, 0);
        this.acceleration = p5.createVector(0, -1);

        this.r_acceleration = 0;
        this.r_speed = 0;
        this.rotation = p5.createVector(1, 0);
        this.size = 300;

        this.animation_ts = {
            rotate_clockwise: 0,
            rotate_counterclockwise: 0,
            thrust: 0
        };
    }
    isTouchingGround() {
        // body
    }
    freeze() {
        // used to debug
        this.speed.setMag(0);
        this.r_speed = 0;
        this.acceleration.setMag(0);
        this.r_acceleration = 0;
    }
    thrust() {
        const force = this.rotation.copy().rotate(-this.p5.HALF_PI);
        force.setMag(1);
        this.applyForce(force);
        this.animation_ts.thrust = this.p5.millis() + 100;
    }
    rotate(clockwise: boolean) {
        //let rotation = -this.p5.PI / 300;
        let rotation = -0.001;
        if (clockwise) {
            rotation = -rotation;
            this.animation_ts.rotate_clockwise = this.p5.millis() + 100;
        } else {
            this.animation_ts.rotate_counterclockwise = this.p5.millis() + 100;
        }
        this.applyRotation(rotation);
    }
    applyForce(force: P5.Vector) {
        this.acceleration.add(force);
    }
    applyRotation(rotation: number) {
        this.r_acceleration += rotation;
    }
    move() {
        this.speed.add(this.acceleration);
        this.speed.limit(10);
        this.pos.add(this.speed);
        this.acceleration.setMag(0);

        this.r_speed += this.r_acceleration;
        this.r_speed = Math.min(this.r_speed, 1);
        this.rotation.rotate(this.r_speed);
        this.r_acceleration = 0;

        if (this.pos.y + this.size / 2 >= this.p5.height) {
            this.pos.y = this.p5.height - this.size / 2;
            if (this.speed.y > -2) {
                this.speed.y = this.speed.y * -0.5;
            } else {
                this.speed.y = 0;
                this.speed.x = 0;
            }
        }

        if (this.pos.x < 0) {
            this.pos.x = this.p5.width;
        } else if (this.pos.x > this.p5.width) {
            this.pos.x = 0;
        }
    }
    drawAnimations() {
        const now = this.p5.millis();
        if (now < this.animation_ts.thrust) {
            this.p5.stroke(247, 143, 7);
            this.p5.line(0, this.size / 2, 0, this.size / 2 + 30);
        }
        if (now < this.animation_ts.rotate_clockwise) {
            this.p5.stroke(3, 150, 173);
            this.p5.line(0, -this.size / 3, -50, -this.size / 3);
        }
        if (now < this.animation_ts.rotate_counterclockwise) {
            this.p5.stroke(3, 150, 173);
            this.p5.line(0, -this.size / 3, 50, -this.size / 3);
        }
    }
    draw() {
        this.p5.stroke(255);
        this.p5.strokeWeight(5);
        this.p5.push();
        this.p5.translate(this.pos.x, this.pos.y);
        this.p5.rotate(this.rotation.heading());
        this.p5.line(0, -this.size / 2, 0, this.size / 2);
        this.p5.line(0, 0, -this.size / 3, this.size / 2);
        this.p5.line(0, 0, this.size / 3, this.size / 2);
        this.drawAnimations();
        this.p5.pop();

        this.p5.stroke('red');
        this.p5.strokeWeight(2);
    }
}
