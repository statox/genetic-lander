import P5 from 'p5';
import 'p5/lib/addons/p5.dom';
import './styles.scss';
import {Lander} from './Lander';

const sketch = (p5: P5) => {
    let lander: Lander;
    let time: number;
    let gravity: P5.Vector;
    let D: number;

    p5.setup = () => {
        // Creating and positioning the canvas
        D = 500;
        const canvas = p5.createCanvas(D, D);
        canvas.parent('app');

        lander = new Lander(p5);
        time = 0;
        gravity = p5.createVector(0, 0.5);
    };

    p5.draw = () => {
        p5.background(30, 30, 30);
        time++;
        lander.move();
        lander.draw();

        lander.applyForce(gravity);
        handleInputs();
    };

    const handleInputs = () => {
        let SPACE = 32;
        if (p5.keyIsDown(SPACE)) {
            lander.freeze();
        }
        if (p5.keyIsDown(p5.UP_ARROW)) {
            lander.thrust();
        }
        if (p5.keyIsDown(p5.LEFT_ARROW)) {
            lander.rotate(false);
        }
        if (p5.keyIsDown(p5.RIGHT_ARROW)) {
            lander.rotate(true);
        }
    };
};

new P5(sketch);
