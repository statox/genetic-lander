import P5 from 'p5';
import {DNA} from './DNA';
import {FLOOR_HEIGHT} from './Floor';

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
    baseVertices: P5.Vector[];
    screenVertices: P5.Vector[];
    isTouchingGround: boolean;
    DNA: DNA;
    fuel: number;

    constructor(p5) {
        this.p5 = p5;
        this.pos = p5.createVector(250, 0);

        this.pos.x = p5.map(Math.random(), 0, 1, 0, p5.width);
        this.pos.y = p5.map(Math.random(), 0, 1, p5.height / 2, 0);

        this.speed = p5.createVector(0, 0);
        this.acceleration = p5.createVector(0, -1);

        this.r_acceleration = 0;
        this.r_speed = 0;
        this.rotation = p5.createVector(1, 0);

        this.rotation.rotate(p5.map(Math.random(), 0, 1, -1, 1));

        this.size = 50;
        this.isTouchingGround = false;

        this.animation_ts = {
            rotate_clockwise: 0,
            rotate_counterclockwise: 0,
            thrust: 0
        };

        this.DNA = new DNA();
        this.fuel = 300;

        // The vertices representing the lander in the sqare of 1x1
        // these vertices are scaled, translated and rotated depending on this.size
        // this.pos and this.rotation in this.setScreenVertices
        // The screen vertices returned are actually the points on screen
        // used by this.draw()
        this.baseVertices = [
            p5.createVector(0, 1),
            p5.createVector(0, -1),
            p5.createVector(0, 0),
            p5.createVector(-0.45, 1),
            p5.createVector(0, 0),
            p5.createVector(0.45, 1),
            p5.createVector(0, 0)
        ];
    }

    setScreenVertices() {
        this.screenVertices = [];
        for (const v of this.baseVertices) {
            this.screenVertices.push(
                v
                    .copy()
                    .rotate(this.rotation.heading())
                    .mult(this.size / 2)
                    .add(this.pos)
            );
        }
    }

    // If one or more screenVertices is clipping in the ground (i.e. we touched the ground)
    // return the distance it is clipped into the ground
    // otherwise return 0
    distanceInGround() {
        let max = 0;
        for (const v of this.screenVertices) {
            if (v.y > this.p5.height - FLOOR_HEIGHT) {
                max = v.y - (this.p5.height - FLOOR_HEIGHT);
            }
        }
        return max;
    }

    freeze() {
        // used to debug
        this.speed.setMag(0);
        this.r_speed = 0;
        this.acceleration.setMag(0);
        this.r_acceleration = 0;
    }

    // Apply the thrust force to the lander parallel to this.rotation
    thrust() {
        if (this.fuel <= 0) {
            return;
        }
        this.fuel -= 1;
        const force = this.rotation.copy().rotate(-this.p5.HALF_PI);
        force.setMag(1);
        this.applyForce(force);
        this.animation_ts.thrust = this.p5.millis() + 100;
    }

    rotate(clockwise: boolean) {
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

    decideInputs() {
        const inputs = this.DNA.outputs({position: this.pos.y, rotation: this.rotation.heading()});
        if (inputs.thrust) {
            this.thrust();
        }
        if (inputs.rotation_clockwise) {
            this.rotate(true);
        }
        if (inputs.rotation_counterclockwise) {
            this.rotate(false);
        }
    }

    move() {
        this.decideInputs();
        // Handle velocity
        this.speed.add(this.acceleration);
        this.speed.limit(10);
        this.pos.add(this.speed);
        this.acceleration.setMag(0);

        // Handle rotation
        this.r_speed += this.r_acceleration;
        this.r_speed = Math.min(this.r_speed, 1);
        this.rotation.rotate(this.r_speed);
        this.r_acceleration = 0;

        // Calculate the on screen position
        this.setScreenVertices();

        // Handle touching the ground
        const distanceInGround = this.distanceInGround();
        if (distanceInGround > 0) {
            this.pos.y = this.pos.y - distanceInGround;
            this.r_speed = 0;
            this.isTouchingGround = true;
            if (this.speed.y > -2) {
                this.speed.y = this.speed.y * -0.5;
                this.speed.x = this.speed.x * 0.5;
            } else {
                this.speed.y = 0;
            }
        } else {
            this.isTouchingGround = false;
        }

        // Handle horizontal screen edges wrapping
        if (this.pos.x < 0) {
            this.pos.x = this.p5.width;
        } else if (this.pos.x > this.p5.width) {
            this.pos.x = 0;
        }
    }

    drawAnimations() {
        const now = this.p5.millis();
        this.p5.push();
        this.p5.translate(this.pos.x, this.pos.y);
        this.p5.rotate(this.rotation.heading());
        this.p5.strokeWeight(1);
        if (now < this.animation_ts.thrust) {
            this.p5.stroke(247, 143, 7);
            this.p5.triangle(-this.size / 10, this.size / 2, this.size / 10, this.size / 2, 0, this.size / 2 + 30);
        }
        if (now < this.animation_ts.rotate_clockwise) {
            this.p5.stroke(3, 150, 173);
            this.p5.triangle(0, -this.size / 3, -10, -this.size / 3 - 5, -10, -this.size / 3 + 5);
        }
        if (now < this.animation_ts.rotate_counterclockwise) {
            this.p5.stroke(3, 150, 173);
            this.p5.triangle(0, -this.size / 3, 10, -this.size / 3 - 5, 10, -this.size / 3 + 5);
        }
        this.p5.pop();
    }

    draw() {
        this.p5.stroke(255);
        if (this.isTouchingGround) {
            this.p5.stroke(255, 0, 0);
        }
        this.p5.strokeWeight(5);
        this.p5.beginShape();
        for (const v of this.screenVertices) {
            this.p5.vertex(v.x, v.y);
        }
        this.p5.endShape('close');
        this.drawAnimations();
        // this.drawStats();
    }

    drawStats() {
        this.p5.noStroke();
        this.p5.fill(255);
        const rotationText = `Rot ${this.p5
            .degrees(this.rotation.heading())
            .toFixed(0)} deg / ${this.rotation.heading().toFixed(2)}rad`;
        const velText = `Vel x ${this.speed.x.toFixed(1)} / y ${this.speed.y.toFixed(1)}`;
        const posText = `Pos x ${this.pos.y.toFixed(1)} / y ${this.pos.y.toFixed(1)}`;
        const vertText = this.screenVertices.map((v) => `${v.x.toFixed(0)};${v.y.toFixed(0)}`).join('\n');
        this.p5.text(rotationText, 0, 10);
        this.p5.text(velText, 0, 30);
        this.p5.text(posText, 0, 50);
        this.p5.text(vertText, 0, 70);
    }
}
