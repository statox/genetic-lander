import {Composite, Render, World} from 'matter-js';
import {Lander} from './Lander';

export class Pool {
    size: number;
    landers: Lander[];
    world: World;
    render: Render;
    tick: number;

    constructor(world: World, render: Render) {
        this.size = 20;
        this.tick = 0;
        this.world = world;
        this.render = render;
        this.createGeneration();
    }

    createGeneration() {
        this.landers = [];
        for (let i = 0; i < this.size; i++) {
            const l = new Lander(i);
            this.landers.push(l);
            Composite.add(this.world, [l.body]);
        }
    }

    reset() {
        this.landers.forEach((l) => {
            Composite.remove(this.world, l.body);
        });

        this.tick = 0;
        this.createGeneration();
    }

    update() {
        let allFinished = true;
        let notFinished = 0;
        let maxMotion = -1;
        this.landers.forEach((l) => {
            l.drive();
            // In theory l.body.motion should hold this value but it seems to be always 0
            // so computing it myself
            const motion = l.body.speed * l.body.speed + l.body.angularSpeed * l.body.angularSpeed;
            if (motion > maxMotion) {
                maxMotion = motion;
            }
            if (motion > 0.1) {
                allFinished = false;
                notFinished++;
            }
        });

        // We use this.tick because when we reset a generation the landers haven't moved
        // so the first update see them all as sleeping and that reset the generation again
        // The tick is used to avoid the reset at first step
        if (allFinished && this.tick > 2) {
            console.log('reset', this.tick);
            this.reset();
        }
        this.tick++;
    }

    limit() {
        this.landers.forEach((l) => {
            l.limitSpeed();
            l.wrapAroundScreen();
        });
    }
}
