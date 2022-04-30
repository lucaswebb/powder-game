class GameView {
    private context: CanvasRenderingContext2D;
    private WIDTH: number;
    private HEIGHT: number;

    constructor(size: Vec2D, canvas: HTMLCanvasElement) {
        this.context = canvas.getContext('2d');
        this.WIDTH = size.x;
        this.HEIGHT = size.y;
    }

    public renderParticles(particles: Particle[]): void {
        this.context.clearRect(0, 0, this.WIDTH, this.HEIGHT);
        for (let particle of particles) {
            this.context.fillStyle = particle.color;
            this.context.fillRect(particle.x * PARTICLE_SIZE + 1, this.HEIGHT - (particle.y * PARTICLE_SIZE + 1), PARTICLE_SIZE, PARTICLE_SIZE);
        }
    }

    public renderWalls(walls: Wall[]): void {
        // this.context.clearRect(0, 0, this.WIDTH, this.HEIGHT);
        for (let wall of walls) {
            this.context.fillStyle = Color.DeepBlue;
            this.context.fillRect(wall.x * PARTICLE_SIZE + 1, this.HEIGHT - (wall.y * PARTICLE_SIZE + 1), PARTICLE_SIZE, PARTICLE_SIZE);
        }
    }
}