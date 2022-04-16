// import { ParticleFactory } from "./ParticleFactory";
// import { ParticleType } from "./ParticleType";

class Simulator implements Iterator<Particle> {
    // Array of all particles
    public particles: Particle[];

    // Map of all spaces on the game board, empty spaces are null
    private particle_map: Particle[][];

    // Map of walls
    private wall_map: Wall[][];
    public walls: Wall[];


    constructor(size: Vec2D) {
        // instantiate empty particle and wall maps
        this.particle_map = Array(size.y);
        this.particles = new Array();
        this.wall_map = Array(size.y);
        this.walls = new Array();

        for (let x = 0; x < size.x; x++) {
            this.particle_map[x] = Array(size.y);
            this.wall_map[x] = Array(size.y);
            for (let y = 0; y < size.y; y++) {
                this.particle_map[x][y] = null;
                this.wall_map[x][y] = null;
            }
        }

        // add non-erasable walls as boundaries
        for (let x = 0; x < size.x; x++) {
            let temp_wall = new Wall(x, 0, false);
            this.wall_map[x][0] = temp_wall;
            this.walls.push(temp_wall);
        }

        for (let y = 0; y < size.y; y++) {
            let temp_wall = new Wall(0, y, false);
            this.wall_map[0][y] = temp_wall;
            this.walls.push(temp_wall);
            temp_wall = new Wall(size.x - 1, y, false);
            this.wall_map[size.x - 1][y] = temp_wall;
            this.walls.push(temp_wall);
        }


        for (let i = 0; i < 100; i++) {
            this.particles.push(ParticleFactory.getNewParticle(i, i, ParticleType.Stone));
        }
    }

    public updateParticles(): void {
        for (var p of this.particles) {
            var x = p.x;
            var y = p.y;

            // updates to velocity from gravity
            p.vy -= 0.5;


            // if the particle is not moving, skip, code for movement is next
            if (p.vx == 0 && p.vy == 0) {
                continue;
            }

            // now try to move the particle in the direction of its velocity
            // interpolate to check for anything in the way
            var max_veloc = Math.max(Math.abs(p.vx), Math.abs(p.vy));

            let interp_step = 2;


        }
    }

    // 1, can move
    // 0, can't move
    private eval_move(p: Particle, new_x: number, new_y: number): number {
        // check for other particles at new location
        if (this.particle_map[new_x][new_y] != null) {
            // now compare weights
            // TODO
            // for now particles just bounce off each other
            return 0;
        }

        // Check for walls
        if (this.wall_map[new_x][new_y] == null) {
            return 1;
        } else {
            return 0;
        }
    }

    public addParticles(toAdd: Particle): void {
        var x: number = toAdd.x;
        var y: number = toAdd.y;
        this.particle_map[x][y] = toAdd;
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