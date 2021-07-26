import P5 from 'p5';
import {DNA} from './DNA';
import {Lander} from './Lander';

export class Pool {
    p5: P5;
    size: number;
    landers: Lander[];
    ttl: number;

    constructor(p5: P5) {
        this.p5 = p5;
        this.size = 100;
        this.ttl = 500;
        this.landers = [];
        for (let i = 0; i < this.size; i++) {
            this.landers.push(new Lander(p5, i));
        }
    }

    reset() {
        this.ttl = 300;
    }

    update() {
        this.ttl -= 1;
        let roundFinished = true;
        for (const lander of this.landers) {
            lander.move();
            lander.draw();

            if (!lander.crashed && lander.fuel > 0) {
                roundFinished = false;
            }
        }

        if (roundFinished || this.ttl <= 0) {
            this.createNewPool();
            this.reset();
        }
    }

    // Reset this.landers to a new generation with new genes
    createNewPool() {
        const DNAPool = [];
        let results = [];
        // Get the fitness of each lander and push it proportionally
        // to DNAPool
        for (const lander of this.landers) {
            const fitness = this.getRawFitness(lander);
            results.push({
                fitness,
                pos: lander.pos.y,
                fuel: lander.fuel
            });
            for (let _ = 0; _ < fitness; _++) {
                DNAPool.push(lander.DNA);
            }
        }

        // Compute stats for debugging
        let maxFitness = 0;
        let avgFitness = 0;
        for (const r of results.sort((a, b) => {
            return a.fitness - b.fitness;
        })) {
            avgFitness += r.fitness;
            if (r.fitness > maxFitness) {
                maxFitness = r.fitness;
            }
        }
        avgFitness = avgFitness / results.length;
        console.log({maxFitness, avgFitness});

        // Reset each lander
        // Take two parents in the pool make the crossover and mutate the child
        this.landers = [];
        for (let i = 0; i < this.size; i++) {
            const ip1 = Math.floor(Math.random() * DNAPool.length);
            const p1 = DNAPool[ip1];
            const ip2 = Math.floor(Math.random() * DNAPool.length);
            const p2 = DNAPool[ip2];

            const newDNA = DNA.cross(p1, p2);
            newDNA.mutate();

            this.landers.push(new Lander(this.p5, i, newDNA));
        }
    }

    // Define fitness between
    // 1: crashed
    // x: bestFuel for position
    getRawFitness(lander: Lander) {
        if (lander.crashed) {
            return 1;
        }
        return lander.pos.y * lander.fuel;
    }
}
