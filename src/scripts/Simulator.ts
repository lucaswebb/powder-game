class Simulator {
    // Array of all particles
    public particles: Particle[];

    // Map of all spaces on the game board, empty spaces are null
    private particle_map: Particle[][];

    // Map of walls
    private wall_map: Wall[][];
    public walls: Wall[];

    size: Vec2D;


    constructor(canvasSize: Vec2D) {
        // instantiate empty particle and wall maps
        this.size = {x: Math.floor(canvasSize.x/PARTICLE_SIZE), y: Math.floor(canvasSize.y/PARTICLE_SIZE)};

        this.particle_map = Array(this.size.y);
        this.particles = new Array();
        this.wall_map = Array(this.size.y);
        this.walls = new Array();

        for (let x = 0; x < this.size.x; x++) {
            this.particle_map[x] = Array(this.size.y);
            this.wall_map[x] = Array(this.size.y);
            for (let y = 0; y < this.size.y; y++) {
                this.particle_map[x][y] = null;
                this.wall_map[x][y] = null;
            }
        }

        // add non-erasable walls as boundaries
        for (let x = 0; x < this.size.x; x++) {
            let temp_wall = new Wall(x, 0, false);
            this.wall_map[x][0] = temp_wall;
            this.walls.push(temp_wall);
        }

        // side walls
        // for (let y = 0; y < this.size.y; y++) {
        //     let temp_wall = new Wall(0, y, false);
        //     this.wall_map[0][y] = temp_wall;
        //     this.walls.push(temp_wall);
        //     temp_wall = new Wall(this.size.x - 1, y, false);
        //     this.wall_map[this.size.x - 1][y] = temp_wall;
        //     this.walls.push(temp_wall);
        // }
    }

    private inBounds(x: number, y: number): boolean {
        if (x < 0 || x > this.size.x - 1 || y < 0){
            return false;
        }
        return true;
    }

    // Used the following as a significant reference point
    // https://github.com/The-Powder-Toy/The-Powder-Toy
    public updateParticles(): void {
        for (var p of this.particles) {
            var x = p.x;
            var y = p.y;

            // updates to velocity from gravity
            p.vy -= 0.2;

            if (p.liquid &&  p.vx != 0) {
                if (this.inBounds(x-1, y)){
                    if (this.particle_map[x-1][y] == null) {
                        p.vx = -0.6;
                    } else if (this.particle_map[x-1][y].density < p.density) {
                        p.vx = -0.6;
                    } else if (this.inBounds(x+1, y)) {
                        if (this.particle_map[x+1][y] == null) {
                            p.vx = 1;
                        } else if (this.particle_map[x+1][y].density < p.density) {
                            p.vx = 1;
                        }
                    }
                }
            }

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
                if (p.liquid){
                    p.vx = 0.01;
                }
                p.vy *= 0.5;
            }
        }
    }

    // 0, can't move
    // 1, can move to unoccupied space
    // 2, can move with swap
    private evalMove(p: Particle, new_x: number, new_y: number): number {
        //check for out of bounds
        if (!this.inBounds(new_x, new_y)) {
            return 0;
        }

        // check for other particles at new location
        if (this.particle_map[new_x][new_y] != null) {
            // now compare densities
            // TODO
            // if p is denser than the particle at new_x, new_y, then swap locations
            if (p.density > this.particle_map[new_x][new_y].density){
                return 2;
            }
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
            // swap
            if (this.particle_map[new_x][new_y] != null) {
                var toSwap = this.particle_map[new_x][new_y];
                toSwap.x = p.x;
                toSwap.y = p.y;
                this.particle_map[p.x][p.y] = toSwap;
                p.x = new_x;
                p.y = new_y;
                this.particle_map[new_x][new_y] = p;
            } else {
                // only do this if we didn't swap!
                this.particle_map[p.x][p.y] = null;
                p.x = new_x;
                p.y = new_y;
                this.particle_map[new_x][new_y] = p;
                return true;
            }
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
        if (e == 2){
            return true;
        }
    }

    public addParticles(x: number, y: number, type: ParticleType): void {
        x = Math.floor(x/PARTICLE_SIZE);
        y = Math.floor(y/PARTICLE_SIZE);
        var testCase = this.particles.filter(function (p) {
            return p.x == x && p.y == y
        });
        if(testCase.length == 0){
            var toAdd = ParticleFactory.getNewParticle(x, y, type);
            this.particle_map[x][y] = toAdd;
            this.particles.push(toAdd);
        }
    }

    public addWalls(toAddPoints: Array<Vec2D>): void {
        for (var w of toAddPoints) {
            var x = Math.floor(w.x/PARTICLE_SIZE);
            var y = Math.floor(w.y/PARTICLE_SIZE);

            if (this.particle_map[x][y] == null && this.wall_map[x][y] == null) {
                let temp_wall = new Wall(x, y, true);
                this.wall_map[x][y] = temp_wall;
                this.walls.push(temp_wall);
            }
        }
    }

    public eraseArea(toErasePoints: Array<Vec2D>): void {
        for (var p of toErasePoints) {
            var x = Math.floor(p.x/PARTICLE_SIZE);
            var y = Math.floor(p.y/PARTICLE_SIZE);

            var part = this.particle_map[x][y];
            var wall = this.wall_map[x][y];

            if (part != null) {
                this.particles = this.particles.filter(item => item !== part);
                this.particle_map[x][y] = null;
            }

            if (wall != null && wall.erasable) {
                this.walls = this.walls.filter(item => item !== wall);
                this.wall_map[x][y] = null;
            }
        }
    }
}
