import {Engine, Events, Common, Render, Runner, Body, Bodies, Composite} from 'matter-js';
import {Pool} from './Pool';
const config = require('./config.json');

// create an engine
const engine = Engine.create();

// create a renderer
const render = Render.create({
    element: document.getElementById('canvas'),
    engine: engine
});
Render.run(render);
const runner = Runner.create();
Runner.run(runner, engine);

// Reset the canvas
const {width: screenWidth, height: screenHeight} = config.dimensions;
render.canvas.width = screenWidth;
render.canvas.height = screenHeight;

// create the ground
const ground = Bodies.rectangle(screenWidth / 2, screenHeight - 30, screenWidth, 60, {isStatic: true});
Composite.add(engine.world, [ground]);

// create a pool of landers
const pool = new Pool(engine.world, render);

// Before anything change make the landers caculate their next move
Events.on(runner, 'beforeTick', () => {
    pool.update();
});

// After everything is updated limit the landers speed
Events.on(runner, 'afterUpdate', () => {
    pool.limit();
});
