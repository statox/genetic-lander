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
        const DNAPool: number[] = [];
        let results = [];

        let totalFitness = 0;
        let maxFitness = 0;
        let avgFitness = 0;
        let totalBonus = 0;
        let maxBonus = 0;
        let avgBonus = 0;

        // Get the fitness of each lander and push it proportionally
        // to DNAPool
        for (const lander of this.landers) {
            // add fitness to the pool
            const fitness = this.getRawFitness(lander);
            DNAPool.push(fitness);

            // compute stats
            results.push({
                fitness,
                pos: lander.pos.y,
                fuel: lander.fuel,
                bonus: lander.bonus
            });
            totalFitness += fitness;
            totalBonus += lander.bonus;
            if (fitness > maxFitness) {
                maxFitness = fitness;
            }
            if (lander.bonus > maxBonus) {
                maxBonus = lander.bonus;
            }
        }
        avgFitness = totalFitness / this.landers.length;
        avgBonus = totalBonus / this.landers.length;
        console.log({
            totalFit: totalFitness.toFixed(0).padStart(12, ' '),
            maxFit: maxFitness.toFixed(0).padStart(9, ' '),
            avgFit: avgFitness.toFixed(0).padStart(8, ' '),
            maxBon: maxBonus.toFixed(0).padStart(5, ' '),
            avgBon: avgBonus.toFixed(0).padStart(5, ' ')
        });

        const DNAPoolPercentage = DNAPool.sort((a, b) => {
            return a - b;
        }).reduce((a, v) => {
            if (!a.length) {
                a.push(v);
            } else {
                a.push(v + a[a.length - 1]);
            }
            return a;
        }, []);

        // Reset each lander
        // Take two parents in the pool make the crossover and mutate the child
        const landerDNAs = this.landers.map((l) => l.DNA);
        this.landers = [];
        let selectionsStats = new Array(this.size).fill(0);
        for (let i = 0; i < this.size; i++) {
            const rand1 = Math.random() * totalFitness;
            let ip1 = 0;
            while (DNAPoolPercentage[ip1] < rand1 && ip1 < DNAPool.length - 1) {
                ip1 += 1;
            }
            const p1 = landerDNAs[ip1];
            selectionsStats[ip1] += 1;

            const rand2 = Math.random() * totalFitness;
            let ip2 = 0;
            while (DNAPoolPercentage[ip2] < rand2 && ip2 < DNAPool.length - 1) {
                ip2 += 1;
            }
            const p2 = landerDNAs[ip2];
            selectionsStats[ip2] += 1;

            const newDNA = DNA.cross(p1, p2);
            newDNA.mutate();
            this.landers.push(new Lander(this.p5, i, newDNA));

            // this.landers.push(new Lander(this.p5, i));
        }
        // console.table(selectionsStats);
    }

    // Define fitness between
    // 1: crashed
    // x: bestFuel for position
    getRawFitness(lander: Lander) {
        if (lander.crashed) {
            return 1;
        }
        return lander.pos.y * lander.fuel * lander.bonus;
    }
}
