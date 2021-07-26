import P5 from 'p5';
import 'p5/lib/addons/p5.dom';
import './styles.scss';
import {Lander} from './Lander';
import {drawFloor} from './Floor';

const sketch = (p5: P5) => {
    // let lander: Lander;
    let landers: Lander[];
    let time: number;
    let gravity: P5.Vector;
    // let D: number;
    let W: number;
    let H: number;
    let frameRateHistory: number[];

    p5.setup = () => {
        // Creating and positioning the canvas
        H = 800;
        W = 700;
        frameRateHistory = new Array(10).fill(0);
        const canvas = p5.createCanvas(W, H);
        canvas.parent('app');

        // lander = new Lander(p5);
        landers = [];
        for (let i = 0; i < 10; i++) {
            landers.push(new Lander(p5));
        }
        time = 0;
        gravity = p5.createVector(0, 0.5);
    };

    p5.draw = () => {
        p5.background(30, 30, 30);
        drawFloor(p5);
        time++;
        for (const lander of landers) {
            lander.move();
            lander.draw();
            lander.applyForce(gravity);
        }
        drawFPS();
        handleInputs();
    };

    const drawFPS = () => {
        const fpsText = `${getFrameRate()} fps`;
        p5.noStroke();
        p5.fill(255);
        p5.text(fpsText, p5.width - p5.textWidth(fpsText), 10);
    };
    const getFrameRate = () => {
        frameRateHistory.shift();
        frameRateHistory.push(p5.frameRate());
        let total = frameRateHistory.reduce((a, b) => a + b) / frameRateHistory.length;
        return total.toFixed(0);
    };

    const handleInputs = () => {
        let SPACE = 32;
        if (p5.keyIsDown(SPACE)) {
            for (const lander of landers) {
                lander.freeze();
            }
        }
        if (p5.keyIsDown(p5.UP_ARROW)) {
            for (const lander of landers) {
                lander.thrust();
            }
        }
        if (p5.keyIsDown(p5.LEFT_ARROW)) {
            for (const lander of landers) {
                lander.rotate(false);
            }
        }
        if (p5.keyIsDown(p5.RIGHT_ARROW)) {
            for (const lander of landers) {
                lander.rotate(true);
            }
        }
    };
};

new P5(sketch);
