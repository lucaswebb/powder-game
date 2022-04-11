class GameView {
    private context: CanvasRenderingContext2D;

    constructor(canvas: HTMLCanvasElement) {
        this.context = canvas.getContext('2d');
    }

    public renderParticles(particles: Particle[]): void {
        this.context.clearRect(0, 0, 800, 600);

        for (var particle of particles) {
            this.context.fillStyle = "red";
            this.context.fillRect(particle.x, particle.y, 2, 2);
        }
    }
}