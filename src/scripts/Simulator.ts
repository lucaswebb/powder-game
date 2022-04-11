class Simulator implements Iterator<Particle> {
    // Array of all particles
    public particles: Particle[];

    // Map of all spaces on the game board, empty spaces are null
    private particle_map: Particle[][];


    constructor() {
        this.particles = new Array();
        for (let i = 0; i < 100; i++) {
            this.particles.push(ParticleFactory.getNewParticle(i, i, ParticleType.Stone));
        }
    }

    public updateParticles(): void {
        // apply gravity to each particle
        for (var p of this.particles) {
            p.y = p.y + p.vy;
        }
    }

    public addParticles(toAdd: Particle[][]): void {

    }

    public eraseParticles(toEraseX: number[], toEraseY: number[]): void {

    }

    hasNext(): boolean {
        return false;
    }

    next(): Particle {
        return undefined;
    }

    reset(): void {

    }

}