export class DNA {
    genes: {
        coef_position: number;
        threshold_position: number;
        coef_rotation_clockwise: number;
        threshold_rotation_clockwise: number;
        coef_rotation_counterclockwise: number;
        threshold_rotation_counterclockwise: number;
    };

    constructor() {
        this.genes = {
            coef_position: Math.random(),
            threshold_position: Math.random() * 100,

            coef_rotation_clockwise: Math.random() - 0.5,
            threshold_rotation_clockwise: Math.random(),

            coef_rotation_counterclockwise: Math.random() - 0.5,
            threshold_rotation_counterclockwise: Math.random()
        };
    }

    outputs({position, rotation}) {
        let result = {
            thrust: false,
            rotation_clockwise: false,
            rotation_counterclockwise: false
        };
        if (this.genes.coef_position * position > this.genes.threshold_position) {
            result.thrust = true;
        }
        if (this.genes.coef_rotation_clockwise * rotation > this.genes.threshold_rotation_clockwise) {
            result.rotation_clockwise = true;
        }
        if (this.genes.coef_rotation_counterclockwise * rotation > this.genes.threshold_rotation_counterclockwise) {
            result.rotation_counterclockwise = true;
        }
        return result;
    }
}
