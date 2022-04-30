var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Color;
(function (Color) {
    Color["Tan"] = "#f5c242";
    Color["Gray"] = "#7a7777";
    Color["Brick"] = "#8a1920";
    Color["Blue"] = "#18a2f2";
    Color["DeepBlue"] = "#000080";
    Color["Brown"] = "#4a2910";
    Color["Oil"] = "#dbcf5c";
})(Color || (Color = {}));
var FPS = 60;
var PARTICLE_SIZE = 5; // How many pixels per side of each particle, should be odd
var GameController = /** @class */ (function () {
    function GameController(size, canvas) {
        var _this = this;
        this.isMouseDown = false;
        this.size = size;
        this.view = new GameView(size, canvas);
        this.sim = new Simulator(size);
        this.currentTool = Placer.getInstance();
        this.paused = false;
        // Tool changing
        document.getElementById("tool-box").addEventListener("click", function (event) {
            var target = event.target;
            if (target.parentElement.id == "particles" || target.parentElement.id == "tools") {
                document.getElementsByClassName("active")[0].className = "inactive";
                target.className = "active";
                if (target.parentElement.id == "particles") {
                    _this.currentTool = Placer.getInstance();
                    _this.currentTool.setType(ParticleType[target.innerHTML]);
                }
                else if (target.parentElement.id == "tools") {
                    var name = target.innerHTML;
                    _this.currentTool = window[name.concat("Tool")].getInstance();
                }
            }
        });
        // Slider
        var slider = document.getElementById("size_slider");
        slider.addEventListener("input", function () {
            PARTICLE_SIZE = slider.valueAsNumber;
            _this.reset();
        });
        // Pause Button
        var pauseButton = document.getElementsByClassName("pause_button")[0];
        pauseButton.addEventListener("click", function () {
            if (_this.paused) {
                _this.paused = false;
                pauseButton.innerHTML = "Pause";
            }
            else {
                _this.paused = true;
                pauseButton.innerHTML = "Play";
            }
        });
        // Reset Button
        document.getElementsByClassName("reset_button")[0].addEventListener("click", function () {
            _this.reset();
        });
        // Mouse listeners
        canvas.addEventListener("mousedown", function (event) {
            _this.mouseEvent = event;
            _this.isMouseDown = event.button === 0;
        });
        document.addEventListener("mouseup", function () {
            _this.isMouseDown = false;
        });
        canvas.addEventListener("mousemove", function (event) {
            _this.mouseEvent = event;
        });
        // save this interval ID for pausing
        this.tickInterval = setInterval(this.tick.bind(this), 1000 / FPS);
    }
    // Main game loop
    GameController.prototype.tick = function () {
        // check if mouse is currently being clicked and handle that
        if (this.isMouseDown) {
            this.currentTool.execute(Math.floor(this.mouseEvent.offsetX), this.size.y - Math.floor(this.mouseEvent.offsetY), this.sim);
        }
        // if game is not paused, update the current pixel array using Simulator
        if (!this.paused) {
            this.sim.updateParticles();
        }
        // pass the current pixel array to GameView to be rendered every tick
        this.view.renderParticles(this.sim.particles);
        this.view.renderWalls(this.sim.walls);
    };
    GameController.prototype.reset = function () {
        this.sim = new Simulator(this.size);
    };
    return GameController;
}());
var GameView = /** @class */ (function () {
    function GameView(size, canvas) {
        this.context = canvas.getContext('2d');
        this.WIDTH = size.x;
        this.HEIGHT = size.y;
    }
    GameView.prototype.renderParticles = function (particles) {
        this.context.clearRect(0, 0, this.WIDTH, this.HEIGHT);
        for (var _i = 0, particles_1 = particles; _i < particles_1.length; _i++) {
            var particle = particles_1[_i];
            this.context.fillStyle = particle.color;
            this.context.fillRect(particle.x * PARTICLE_SIZE + 1, this.HEIGHT - (particle.y * PARTICLE_SIZE + 1), PARTICLE_SIZE, PARTICLE_SIZE);
        }
    };
    GameView.prototype.renderWalls = function (walls) {
        // this.context.clearRect(0, 0, this.WIDTH, this.HEIGHT);
        for (var _i = 0, walls_1 = walls; _i < walls_1.length; _i++) {
            var wall = walls_1[_i];
            this.context.fillStyle = Color.DeepBlue;
            this.context.fillRect(wall.x * PARTICLE_SIZE + 1, this.HEIGHT - (wall.y * PARTICLE_SIZE + 1), PARTICLE_SIZE, PARTICLE_SIZE);
        }
    };
    return GameView;
}());
var Particle = /** @class */ (function () {
    function Particle(x, y) {
        this.density = 10; // used to determine if particles pass through each other, stone sinks in water
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
    }
    Particle.prototype.applyForce = function (x, y) {
        // recalculate velocity
    };
    return Particle;
}());
///<reference path="./Particle.ts" />
var Oil = /** @class */ (function (_super) {
    __extends(Oil, _super);
    function Oil(x, y) {
        var _this = _super.call(this, x, y) || this;
        _this.color = Color.Oil;
        _this.liquid = true;
        _this.density = 0.9;
        return _this;
    }
    Oil.prototype.toString = function () {
        return Color[this.color];
    };
    return Oil;
}(Particle));
// import { ParticleType } from "./ParticleType";
// import { Stone } from "./Stone";
var ParticleFactory = /** @class */ (function () {
    function ParticleFactory() {
    }
    ParticleFactory.getNewParticle = function (x, y, type) {
        switch (type) {
            case ParticleType.Stone:
                return new Stone(x, y);
            case ParticleType.Sand:
                return new Sand(x, y);
            case ParticleType.Water:
                return new Water(x, y);
            case ParticleType.Oil:
                return new Oil(x, y);
            default:
                throw new TypeError("Unknown ParticleType " + type);
        }
    };
    return ParticleFactory;
}());
var ParticleType;
(function (ParticleType) {
    ParticleType[ParticleType["Stone"] = 0] = "Stone";
    ParticleType[ParticleType["Water"] = 1] = "Water";
    ParticleType[ParticleType["Sand"] = 2] = "Sand";
    ParticleType[ParticleType["Oil"] = 3] = "Oil";
    ParticleType[ParticleType["Brick"] = 4] = "Brick";
    ParticleType[ParticleType["Lava"] = 5] = "Lava";
    ParticleType[ParticleType["C4"] = 6] = "C4";
    ParticleType[ParticleType["Dirt"] = 7] = "Dirt";
})(ParticleType || (ParticleType = {}));
// import { Simulator } from "./Simulator";
var Tool = /** @class */ (function () {
    function Tool() {
    }
    Tool.prototype.execute = function (x, y, sim) { };
    Tool.getInstance = function () { return null; };
    return Tool;
}());
///<reference path="./Tool.ts" />
// import { ParticleType } from "./ParticleType";
// import { Simulator } from "./Simulator";
// import { Tool } from "./Tool";
var Placer = /** @class */ (function (_super) {
    __extends(Placer, _super);
    function Placer() {
        var _this = _super.call(this) || this;
        _this.type = ParticleType.Stone;
        return _this;
    }
    Placer.getInstance = function () {
        return this.instance;
    };
    Placer.prototype.setType = function (type) {
        this.type = type;
    };
    Placer.prototype.execute = function (x, y, sim) {
        // console.log(Placer.type);
        sim.addParticles(x, y, this.type);
    };
    Placer.instance = new Placer();
    return Placer;
}(Tool));
///<reference path="./Particle.ts" />
var Sand = /** @class */ (function (_super) {
    __extends(Sand, _super);
    function Sand(x, y) {
        var _this = _super.call(this, x, y) || this;
        _this.color = Color.Tan;
        return _this;
    }
    Sand.prototype.toString = function () {
        return Color[this.color];
    };
    return Sand;
}(Particle));
var Simulator = /** @class */ (function () {
    function Simulator(canvasSize) {
        // instantiate empty particle and wall maps
        this.size = { x: Math.floor(canvasSize.x / PARTICLE_SIZE), y: Math.floor(canvasSize.y / PARTICLE_SIZE) };
        this.particle_map = Array(this.size.y);
        this.particles = new Array();
        this.wall_map = Array(this.size.y);
        this.walls = new Array();
        for (var x = 0; x < this.size.x; x++) {
            this.particle_map[x] = Array(this.size.y);
            this.wall_map[x] = Array(this.size.y);
            for (var y = 0; y < this.size.y; y++) {
                this.particle_map[x][y] = null;
                this.wall_map[x][y] = null;
            }
        }
        // add non-erasable walls as boundaries
        for (var x = 0; x < this.size.x; x++) {
            var temp_wall = new Wall(x, 0, false);
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
    Simulator.prototype.inBounds = function (x, y) {
        if (x < 0 || x > this.size.x - 1 || y < 0) {
            return false;
        }
        return true;
    };
    // Used the following as a significant reference point
    // https://github.com/The-Powder-Toy/The-Powder-Toy
    Simulator.prototype.updateParticles = function () {
        for (var _i = 0, _a = this.particles; _i < _a.length; _i++) {
            var p = _a[_i];
            var x = p.x;
            var y = p.y;
            // updates to velocity from gravity
            p.vy -= 0.2;
            if (p.liquid && p.vx != 0) {
                if (this.inBounds(x - 1, y)) {
                    if (this.particle_map[x - 1][y] == null) {
                        p.vx = -0.6;
                    }
                    else if (this.particle_map[x - 1][y].density < p.density) {
                        p.vx = -0.6;
                    }
                    else if (this.inBounds(x + 1, y)) {
                        if (this.particle_map[x + 1][y] == null) {
                            p.vx = 1;
                        }
                        else if (this.particle_map[x + 1][y].density < p.density) {
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
            }
            else {
                // now step along the velocity vector
                var dx = p.vx * interp_step / max_veloc;
                var dy = p.vy * interp_step / max_veloc;
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
            if (!this.doMove(p, fin_x, fin_y)) {
                if (p.liquid) {
                    p.vx = 0.01;
                }
                p.vy *= 0.5;
            }
        }
    };
    // 0, can't move
    // 1, can move to unoccupied space
    // 2, can move with swap
    Simulator.prototype.evalMove = function (p, new_x, new_y) {
        //check for out of bounds
        if (!this.inBounds(new_x, new_y)) {
            return 0;
        }
        // check for other particles at new location
        if (this.particle_map[new_x][new_y] != null) {
            // now compare densities
            // TODO
            // if p is denser than the particle at new_x, new_y, then swap locations
            if (p.density > this.particle_map[new_x][new_y].density) {
                return 2;
            }
            return 0;
        }
        // Check for walls
        if (this.wall_map[new_x][new_y] == null) {
            return 1;
        }
        else {
            return 0;
        }
    };
    Simulator.prototype.doMove = function (p, new_x, new_y) {
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
            }
            else {
                // only do this if we didn't swap!
                this.particle_map[p.x][p.y] = null;
                p.x = new_x;
                p.y = new_y;
                this.particle_map[new_x][new_y] = p;
                return true;
            }
        }
        return false;
    };
    Simulator.prototype.tryMove = function (p, new_x, new_y) {
        var e = this.evalMove(p, new_x, new_y);
        if (e == 0) {
            return false;
        }
        if (e == 1) {
            return true;
        }
        // TODO
        if (e == 2) {
            return true;
        }
    };
    Simulator.prototype.addParticles = function (x, y, type) {
        x = Math.floor(x / PARTICLE_SIZE);
        y = Math.floor(y / PARTICLE_SIZE);
        var testCase = this.particles.filter(function (p) {
            return p.x == x && p.y == y;
        });
        if (testCase.length == 0) {
            var toAdd = ParticleFactory.getNewParticle(x, y, type);
            this.particle_map[x][y] = toAdd;
            this.particles.push(toAdd);
        }
    };
    Simulator.prototype.addWalls = function (toAddPoints) {
        for (var _i = 0, toAddPoints_1 = toAddPoints; _i < toAddPoints_1.length; _i++) {
            var w = toAddPoints_1[_i];
            var x = Math.floor(w.x / PARTICLE_SIZE);
            var y = Math.floor(w.y / PARTICLE_SIZE);
            if (this.particle_map[x][y] == null && this.wall_map[x][y] == null) {
                var temp_wall = new Wall(x, y, true);
                this.wall_map[x][y] = temp_wall;
                this.walls.push(temp_wall);
            }
        }
    };
    Simulator.prototype.eraseArea = function (toErasePoints) {
        for (var _i = 0, toErasePoints_1 = toErasePoints; _i < toErasePoints_1.length; _i++) {
            var p = toErasePoints_1[_i];
            var x = Math.floor(p.x / PARTICLE_SIZE);
            var y = Math.floor(p.y / PARTICLE_SIZE);
            var part = this.particle_map[x][y];
            var wall = this.wall_map[x][y];
            if (part != null) {
                this.particles = this.particles.filter(function (item) { return item !== part; });
                this.particle_map[x][y] = null;
            }
            if (wall != null && wall.erasable) {
                this.walls = this.walls.filter(function (item) { return item !== wall; });
                this.wall_map[x][y] = null;
            }
        }
    };
    return Simulator;
}());
///<reference path="./Particle.ts" />
var Stone = /** @class */ (function (_super) {
    __extends(Stone, _super);
    function Stone(x, y) {
        var _this = _super.call(this, x, y) || this;
        _this.color = Color.Gray;
        return _this;
    }
    Stone.prototype.toString = function () {
        return "Stone";
    };
    return Stone;
}(Particle));
var ToolType;
(function (ToolType) {
    ToolType["Eraser"] = "Eraser";
    ToolType["Wall"] = "Wall";
})(ToolType || (ToolType = {}));
function getMouseCoords(event) {
    return { x: event.offsetX, y: event.offsetY };
}
var Wall = /** @class */ (function () {
    function Wall(x, y, erasable) {
        this.x = x;
        this.y = y;
        this.erasable = erasable;
    }
    return Wall;
}());
///<reference path="./Particle.ts" />
var Water = /** @class */ (function (_super) {
    __extends(Water, _super);
    function Water(x, y) {
        var _this = _super.call(this, x, y) || this;
        _this.color = Color.Blue;
        _this.liquid = true;
        _this.density = 1;
        return _this;
    }
    return Water;
}(Particle));
///<reference path="./Tool.ts" />
var EraserTool = /** @class */ (function (_super) {
    __extends(EraserTool, _super);
    function EraserTool() {
        return _super.call(this) || this;
    }
    EraserTool.getInstance = function () {
        if (!EraserTool.instance) {
            EraserTool.instance = new EraserTool();
        }
        return EraserTool.instance;
    };
    EraserTool.prototype.execute = function (x, y, sim) {
        var toErase = [];
        for (var i = -4; i < 5; i++) {
            for (var j = -4; j < 5; j++) {
                toErase.push({ x: x + i, y: y + i });
            }
        }
        sim.eraseArea(toErase);
    };
    return EraserTool;
}(Tool));
var WallTool = /** @class */ (function (_super) {
    __extends(WallTool, _super);
    function WallTool() {
        return _super.call(this) || this;
    }
    WallTool.getInstance = function () {
        if (!WallTool.instance) {
            WallTool.instance = new WallTool();
        }
        return WallTool.instance;
    };
    WallTool.prototype.execute = function (x, y, sim) {
        var toAdd = [];
        for (var i = -2; i < 3; i++) {
            for (var j = -2; j < 3; j++) {
                toAdd.push({ x: x + i, y: y + j });
            }
        }
        sim.addWalls(toAdd);
    };
    return WallTool;
}(Tool));
//# sourceMappingURL=app.js.map