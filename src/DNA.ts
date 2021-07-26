const MUTATION_RATE = 0.1; // 0: no mutation - 1: 100% variation
export class DNA {
    genes: {
        coef_position: number;
        coef_speedY: number;
        threshold_thrust: number;

        coef_rotation_clockwise: number;
        threshold_rotation_clockwise: number;

        coef_rotation_counterclockwise: number;
        threshold_rotation_counterclockwise: number;

        coef_distanceToCenter_rotation_clockwise: number;
        coef_distanceToCenter_rotation_counterclockwise: number;
    };

    constructor() {
        this.genes = {
            coef_position: Math.random(),
            // coef_position: 0,

            // coef_speedY: Math.random(),
            coef_speedY: 0,

            threshold_thrust: Math.random() * 100,
            // threshold_thrust: Math.random() * 5,

            coef_rotation_clockwise: Math.random() - 0.5,
            coef_distanceToCenter_rotation_clockwise: Math.random() - 0.5,
            threshold_rotation_clockwise: Math.random(),

            coef_rotation_counterclockwise: Math.random() - 0.5,
            coef_distanceToCenter_rotation_counterclockwise: Math.random() - 0.5,
            threshold_rotation_counterclockwise: Math.random()
        };
    }

    outputs({position, rotation, speedY, distanceToCenter}) {
        let result = {
            thrust: false,
            rotation_clockwise: false,
            rotation_counterclockwise: false
        };
        if (this.genes.coef_speedY * speedY + this.genes.coef_position * position > this.genes.threshold_thrust) {
            result.thrust = true;
        }
        if (
            this.genes.coef_distanceToCenter_rotation_clockwise * distanceToCenter +
                this.genes.coef_rotation_clockwise * rotation >
            this.genes.threshold_rotation_clockwise
        ) {
            result.rotation_clockwise = true;
        }
        if (
            this.genes.coef_distanceToCenter_rotation_counterclockwise * distanceToCenter +
                this.genes.coef_rotation_counterclockwise * rotation >
            this.genes.threshold_rotation_counterclockwise
        ) {
            result.rotation_counterclockwise = true;
        }
        return result;
    }

    // Take two parents and return a new DNA with the mean of each parent's genes
    static cross(D1: DNA, D2: DNA): DNA {
        const child = new DNA();
        child.genes.coef_position = (D1.genes.coef_position + D2.genes.coef_position) / 2;
        child.genes.coef_speedY = (D1.genes.coef_speedY + D2.genes.coef_speedY) / 2;
        child.genes.threshold_thrust = (D1.genes.threshold_thrust + D2.genes.threshold_thrust) / 2;
        child.genes.coef_rotation_clockwise = (D1.genes.coef_rotation_clockwise + D2.genes.coef_rotation_clockwise) / 2;
        child.genes.threshold_rotation_clockwise =
            (D1.genes.threshold_rotation_clockwise + D2.genes.threshold_rotation_clockwise) / 2;
        child.genes.coef_rotation_counterclockwise =
            (D1.genes.coef_rotation_counterclockwise + D2.genes.coef_rotation_counterclockwise) / 2;
        child.genes.threshold_rotation_counterclockwise =
            (D1.genes.threshold_rotation_counterclockwise + D2.genes.threshold_rotation_counterclockwise) / 2;

        return child;
    }

    // Mutate each gene of the DNS by MUTATION_RATE%
    mutate() {
        this.genes.coef_position += (Math.random() - 0.5) * MUTATION_RATE;
        this.genes.coef_speedY += (Math.random() - 0.5) * MUTATION_RATE;
        this.genes.threshold_thrust += (Math.random() - 0.5) * MUTATION_RATE;
        this.genes.coef_rotation_clockwise += (Math.random() - 0.5) * MUTATION_RATE;
        this.genes.threshold_rotation_clockwise += (Math.random() - 0.5) * MUTATION_RATE;
        this.genes.coef_rotation_counterclockwise += (Math.random() - 0.5) * MUTATION_RATE;
        this.genes.threshold_rotation_counterclockwise += (Math.random() - 0.5) * MUTATION_RATE;
    }
}
