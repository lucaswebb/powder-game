abstract class Particle {
    public x: number;
    public y: number;
    public vx: number;
    public vy: number;
    public color: Color;
    public mass: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 1;
    }

    applyForce(x: number, y: number): void {
        // recalculate velocity
    }
}