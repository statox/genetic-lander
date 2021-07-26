import P5 from 'p5';
import 'p5/lib/addons/p5.dom';
import './styles.scss';
import {Lander} from './Lander';
import {drawFloor} from './Floor';
import {Pool} from './Pool';

const sketch = (p5: P5) => {
    let pool: Pool;
    let time: number;
    let gravity: P5.Vector;
    let W: number;
    let H: number;
    let frameRateHistory: number[];

    p5.setup = () => {
        // Creating and positioning the canvas
        H = 800;
        W = 900;
        frameRateHistory = new Array(10).fill(0);
        const canvas = p5.createCanvas(W, H);
        canvas.parent('app');

        pool = new Pool(p5);
        time = 0;
    };

    p5.draw = () => {
        p5.background(30, 30, 30);
        drawFloor(p5);
        time++;
        pool.update(p5);
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
            for (const lander of pool.landers) {
                lander.freeze();
            }
        }
        if (p5.keyIsDown(p5.UP_ARROW)) {
            for (const lander of pool.landers) {
                lander.thrust();
            }
        }
        if (p5.keyIsDown(p5.LEFT_ARROW)) {
            for (const lander of pool.landers) {
                lander.rotate(false);
            }
        }
        if (p5.keyIsDown(p5.RIGHT_ARROW)) {
            for (const lander of pool.landers) {
                lander.rotate(true);
            }
        }
    };
};

new P5(sketch);
