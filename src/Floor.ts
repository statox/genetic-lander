import P5 from 'p5';

const FLOOR_HEIGHT = 10;

const drawFloor = (p5: P5) => {
    p5.fill(255);
    p5.rect(0, p5.height - FLOOR_HEIGHT, p5.width, p5.height);
};

export {FLOOR_HEIGHT, drawFloor};
