import {Vector, Bodies, Body, Composite, Bounds} from 'matter-js';
const config = require('./config.json');

const lander_body = [Vector.create(0, -1), Vector.create(-0.5, 1), Vector.create(0.5, 1)];

export class Lander {
    id: number;
    body: Matter.Body;
    size: number;
    thrustForce: Vector;
    rotationVelocity: number;
    fuel: number;

    constructor(id: number) {
        this.id = id;
        this.size = 25;
        this.fuel = 100;

        this.rotationVelocity = 0.01;
        this.thrustForce = Vector.create(0, -0.01);

        // this.body = Bodies.fromVertices(Math.random() * config.dimensions.width, 100, [lander_body]);
        this.body = Bodies.fromVertices(100, 100, [lander_body]);
        Body.scale(this.body, this.size, this.size);
        Body.setAngle(this.body, Math.random() * 2 - 1);

        // Set the collisionFilter group to -1 so that the lander
        // collide with the ground but not the other landers
        Body.set(this.body, {
            collisionFilter: {
                ...this.body.collisionFilter,
                group: -1
            }
        });
    }

    wrapAroundScreen() {
        const {width: screenWidth, height: screenHeight} = config.dimensions;
        if (this.body.position.x < 0) {
            Body.setPosition(this.body, {
                x: screenWidth,
                y: this.body.position.y
            });
        } else if (this.body.position.x > screenWidth) {
            Body.setPosition(this.body, {
                x: 0,
                y: this.body.position.y
            });
        }

        // If the lander manages to get under the ground because of buggy physics
        // simply immobilize it
        if (this.body.position.y > screenHeight * 1.2) {
            Body.set(this.body, {isSleeping: true});
        }
    }

    limitSpeed() {
        const max = 10;
        const magSq = Vector.magnitudeSquared(this.body.velocity);
        if (magSq > max * max) {
            let v = Vector.div(this.body.velocity, Math.sqrt(magSq));
            v = Vector.mult(v, max);
            Body.setVelocity(this.body, v);
        }

        const maxAngular = 0.1;
        const currentAngularVel = this.body.angularVelocity;
        if (Math.abs(currentAngularVel) > maxAngular) {
            Body.setAngularVelocity(this.body, (currentAngularVel < 0 ? -1 : 1) * maxAngular);
        }
    }

    getDistanceToGround() {
        return 600 - this.body.position.y;
    }

    drive() {
        if (this.getDistanceToGround() < 200) {
            this.thrust();
        }
        if (this.body.angle > 0) {
            this.rotate(false);
        }
        if (this.body.angle < 0) {
            this.rotate(true);
        }

        if (this.body.position.x > 600) {
            this.rotate(false);
        } else if (this.body.position.x < 600) {
            this.rotate(true);
        }
    }

    thrust() {
        if (this.fuel <= 0) {
            return;
        }
        this.fuel -= 1;
        const force = Vector.rotate(this.thrustForce, this.body.angle);
        Body.applyForce(this.body, this.body.position, force);
    }

    rotate(clockwise: boolean) {
        if (this.fuel <= 0) {
            return;
        }
        this.fuel -= 0.1;
        const curentAngularVel = this.body.angularVelocity;
        Body.setAngularVelocity(this.body, curentAngularVel + (clockwise ? 1 : -1) * this.rotationVelocity);
    }
}
