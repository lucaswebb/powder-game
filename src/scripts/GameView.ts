class GameView {
    private context: CanvasRenderingContext2D;
    private WIDTH: number;
    private HEIGHT: number;

    constructor(size: Vec2D, canvas: HTMLCanvasElement) {
        this.context = canvas.getContext('2d');
        this.WIDTH = size.x;
        this.HEIGHT = size.y;
    }

    public renderParticles(particles: Particle[], walls: Wall[]): void {
        this.context.clearRect(0, 0, this.WIDTH, this.HEIGHT);

        for (let particle of particles) {
            this.context.fillStyle = particle.color;
            this.context.fillRect(particle.x, this.HEIGHT - particle.y, 2, 2);
        }

        for (let wall of walls) {
            this.context.fillStyle = "grey";
            this.context.fillRect(wall.x, this.HEIGHT - wall.y, 2, 2);
        }
    }
}