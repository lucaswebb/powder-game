// import { ParticleFactory } from "./ParticleFactory";
// import { ParticleType } from "./ParticleType";

class Simulator {
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


        // for (let i = 0; i < 100; i++) {
        //     this.particles.push(ParticleFactory.getNewParticle(i, i, ParticleType.Stone));
        // }

        // this.particles.push(ParticleFactory.getNewParticle(99, 99, ParticleType.Stone));
    }

    // Used the following as a significant reference point
    // https://github.com/The-Powder-Toy/The-Powder-Toy

    public updateParticles(): void {
        for (var p of this.particles) {
            var x = p.x;
            var y = p.y;

            // updates to velocity from gravity
            p.vy -= 0.5;


            // if the particle is not moving, skip, code because movement is next
            if (p.vx == 0 && p.vy == 0) {
                continue;
            }

            // now try to move the particle in the direction of its velocity
            // interpolate to check for anything in the way
            // scale our steps by the max component of velocity to limit our max error
            var max_veloc = Math.max(Math.abs(p.vx), Math.abs(p.vy));

            // stepsize that specifies the resolution of the interpolation
            // 1 is perfect, 2 is half the amount of checks
            var interp_step = 1;

            // variables to store where we are going to try to move the particle to
            // both an exact float representation and a rounded int
            var fin_xf, fin_yf, fin_x, fin_y;

            if (max_veloc < interp_step) {
                fin_xf = x + p.vx;
                fin_yf = y + p.vy;
                fin_x = Math.round(fin_xf);
                fin_y = Math.round(fin_yf);
            } else {
                // now step along the velocity vector
                var dx = p.vx * interp_step/max_veloc;
                var dy = p.vy * interp_step/max_veloc;
                fin_xf = x;
                fin_yf = y;

                while (true) {
                    max_veloc -= interp_step;
                    fin_xf += dx;
                    fin_yf += dy;
                    fin_x = Math.round(fin_xf);
                    fin_y = Math.round(fin_yf);

                    // no obstacles found along velocity vector
                    if (max_veloc <= 0) {
                        fin_xf = x + p.vx;
                        fin_yf = y + p.vy;
                        fin_x = Math.round(fin_xf);
                        fin_y = Math.round(fin_yf);
                        break;
                    }

                    // check for obstacles
                    if (this.evalMove(p, fin_x, fin_y) == 0) {
                        break;
                    }
                }
            }

            // console.log(p.vy, fin_y);

            if(!this.doMove(p, fin_x, fin_y)) {
                //p.vx = 0;
                p.vy *= 0.5;
            }
        }
    }

    // 0, can't move
    // 1, can move to unoccupied space
    // 2, can move with swap
    private evalMove(p: Particle, new_x: number, new_y: number): number {
        // check for other particles at new location
        if (this.particle_map[new_x][new_y] != null) {
            // now compare densities
            // TODO
            // for now particles just bounce off each other
            // if p is denser than the particle at new_x, new_y, then swap locations
            return 0;
        }

        // Check for walls
        if (this.wall_map[new_x][new_y] == null) {
            return 1;
        } else {
            return 0;
        }
    }

    private doMove(p: Particle, new_x: number, new_y: number):  boolean {
        if (p.x == new_x && p.y == new_y) {
            return true;
        }
        if (this.tryMove(p, new_x, new_y)) {
            // only do this if we didn't swap!
            // TODO
            this.particle_map[p.x][p.y] = null;
            p.x = new_x;
            p.y = new_y;
            this.particle_map[new_x][new_y] = p;
            return true;
        }
        return false;
    }

    private tryMove(p: Particle, new_x: number, new_y: number): boolean {
        var e = this.evalMove(p, new_x, new_y);
        if (e == 0) {
            return false;
        }
        if (e == 1) {
            return true;
        }
        // TODO
        // if (e == 2){
        //
        // }
    }

    public addParticles(x: number, y: number, type: ParticleType): void {
        var testCase = this.particles.filter(function (p) {
            return p.x == x && p.y == y
        });
        if(testCase.length == 0){
            var toAdd = ParticleFactory.getNewParticle(x, y, type);
            this.particle_map[x][y] = toAdd;
            this.particles.push(toAdd);
        }
    }

    public addWalls(x: number, y: number): void {
        // adding walls in 5x5 area
        let sub_xvals = [x-2, x-1, x, x+1, x+2,
                        x-2, x-1, x, x+1, x+2,
                        x-2, x-1, x, x+1, x+2,
                        x-2, x-1, x, x+1, x+2,
                        x-2, x-1, x, x+1, x+2]
        let sub_yvals = [y+2, y+2, y+2, y+2, y+2,
                        y+1, y+1, y+1, y+1, y+1,
                        y, y, y, y, y,
                        y-1, y-1, y-1, y-1, y-1,
                        y-2, y-2, y-2, y-2, y-2]

        for(let i = 0; i < 9; i++){
            var testCase = this.walls.filter(w => w.x == sub_xvals[i] && w.y == sub_yvals[i]);
            if(testCase.length == 0){
                var toAdd = new Wall(sub_xvals[i], sub_yvals[i], true);
                this.wall_map[sub_xvals[i]][sub_yvals[i]] = toAdd;
                this.walls.push(toAdd);
            }
        }

        
    }

    

    public eraseParticles(x: number ,y: number): void {
        // erase in 5x5 area, just like walls
        let sub_xvals = [x-2, x-1, x, x+1, x+2,
                        x-2, x-1, x, x+1, x+2,
                        x-2, x-1, x, x+1, x+2,
                        x-2, x-1, x, x+1, x+2,
                        x-2, x-1, x, x+1, x+2];
        let sub_yvals = [y+2, y+2, y+2, y+2, y+2,
                        y+1, y+1, y+1, y+1, y+1,
                        y, y, y, y, y,
                        y-1, y-1, y-1, y-1, y-1,
                        y-2, y-2, y-2, y-2, y-2];

        for(let i = 0; i < 25; i++){
            // make sure particle is there
            // if(this.particle_map[sub_xvals[i]][sub_yvals[i]] != null){
            //     let toErase = this.particle_map[sub_xvals[i]][sub_yvals[i]];
            //     const index = this.particles.indexOf(toErase, 0);
            //     this.particle_map[sub_xvals[i]][sub_yvals[i]] = null;
            //     this.particles[index].toErase = true;
            // }

            let removeArray = this.particles.filter(p => p.x == sub_xvals[i] && p.y == sub_yvals[i]);

            for (var p of removeArray){
                const index = this.particles.indexOf(p);
                this.particle_map[p.x][p.y] = null;
                this.particles[index].toErase = true;
            }

        }
    }

    public eraseWalls(x: number ,y: number): void {
        // erase in 5x5 area
        let sub_xvals = [x-2, x-1, x, x+1, x+2,
                        x-2, x-1, x, x+1, x+2,
                        x-2, x-1, x, x+1, x+2,
                        x-2, x-1, x, x+1, x+2,
                        x-2, x-1, x, x+1, x+2];
        let sub_yvals = [y+2, y+2, y+2, y+2, y+2,
                        y+1, y+1, y+1, y+1, y+1,
                        y, y, y, y, y,
                        y-1, y-1, y-1, y-1, y-1,
                        y-2, y-2, y-2, y-2, y-2];

        for(let i = 0; i < 25; i++){
            // make sure wall is there
            // if(this.wall_map[sub_xvals[i]][sub_yvals[i]] != null){
            //     // check that wall is erasable
            //     if(this.wall_map[sub_xvals[i]][sub_yvals[i]].erasable){
            //         let toErase = this.wall_map[sub_xvals[i]][sub_yvals[i]];
            //         const index = this.walls.indexOf(toErase, 0);
            //         this.wall_map[sub_xvals[i]][sub_yvals[i]] = null;
            //         // some logic is breaking here
            //         this.walls[index].toErase = true;
            //     }
                
            // }
            let removeArray = this.walls.filter(w => w.x == sub_xvals[i] && w.y == sub_yvals[i]);

            for (var w of removeArray){
                const index = this.walls.indexOf(w);
                this.wall_map[w.x][w.y] = null;
                this.walls[index].toErase = true;
            }
            

        }
    }
}
