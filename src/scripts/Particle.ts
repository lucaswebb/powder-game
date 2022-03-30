abstract class Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: Color;
    mass: number;

    applyForce(x: number, y: number): void {
        // recalculate velocity
    }
}