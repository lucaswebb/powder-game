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
var Particle = /** @class */ (function () {
    function Particle(x, y) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.toErase = false;
    }
    Particle.prototype.applyForce = function (x, y) {
        // recalculate velocity
    };
    Particle.prototype.toString = function () {
        return "Particle";
    };
    return Particle;
}());
///<reference path="./Particle.ts" />
var Brick = /** @class */ (function (_super) {
    __extends(Brick, _super);
    function Brick() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Brick;
}(Particle));
///<reference path="./Particle.ts" />
var C4 = /** @class */ (function (_super) {
    __extends(C4, _super);
    function C4() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return C4;
}(Particle));
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
///<reference path="./Particle.ts" />
var Dirt = /** @class */ (function (_super) {
    __extends(Dirt, _super);
    function Dirt(x, y) {
        var _this = _super.call(this, x, y) || this;
        _this.color = Color.Brown;
        return _this;
    }
    Dirt.prototype.toString = function () {
        return Color[this.color];
    };
    return Dirt;
}(Particle));
// import { Simulator } from "./Simulator";
var Tool = /** @class */ (function () {
    function Tool() {
    }
    Tool.prototype.execute = function (x, y, sim) {
    };
    Tool.prototype.getType = function () {
    };
    Tool.prototype.toString = function () {
        return "Tool";
    };
    return Tool;
}());
///<reference path="./Tool.ts" />
// import { Simulator } from "./Simulator";
// import { Tool } from "./Tool";
var Eraser = /** @class */ (function (_super) {
    __extends(Eraser, _super);
    function Eraser() {
        return _super.call(this) || this;
    }
    Eraser.getInstance = function () {
        if (!Eraser.instance) {
            Eraser.instance = new Eraser();
        }
        return Eraser.instance;
    };
    Eraser.prototype.execute = function (x, y, sim) {
        // I don't know why I put this here, it's handled in tooltip
        // sim.eraseParticles(x, y);
        // sim.eraseWalls(x,y);
    };
    Eraser.prototype.toString = function () {
        return "Eraser";
    };
    return Eraser;
}(Tool));
///<reference path="./Tool.ts" />
var Explosion = /** @class */ (function (_super) {
    __extends(Explosion, _super);
    function Explosion() {
        return _super.call(this) || this;
    }
    Explosion.getInstance = function () {
        if (!Explosion.instance) {
            Explosion.instance = new Explosion();
        }
        return Explosion.instance;
    };
    Explosion.prototype.execute = function (x, y, sim) {
    };
    Explosion.prototype.toString = function () {
        return "Explosion";
    };
    return Explosion;
}(Tool));
var FPS = 24;
var GameController = /** @class */ (function () {
    function GameController(size, canvas) {
        var _this = this;
        this.isMouseDown = false;
        this.changeTool = function (tip, name) {
            switch (tip) {
                case "particle":
                    var newPlacer = Placer.getInstance();
                    Placer.setType(ParticleType[name]);
                    _this.currentTool = newPlacer;
                    break;
                case "tool":
                    var newTool = ToolTip.getInstance();
                    ToolTip.setType(ToolType[name]);
                    _this.currentTool = newTool;
                    break;
                default:
                    console.log("unknown tool");
            }
        };
        this.size = size;
        this.view = new GameView(size, canvas);
        this.sim = new Simulator(size);
        this.currentTool = Placer.getInstance();
        Placer.setType(ParticleType["Stone"]);
        this.toolIsSet = true;
        this.paused = false;
        document.getElementById("tool-box").addEventListener("click", function (event) {
            var target = event.target;
            console.log(target.parentElement.id);
            if (target.parentElement.id == "particles") {
                document.getElementsByClassName("active")[0].className = "inactive";
                target.className = "active";
                _this.changeTool("particle", target.innerHTML);
            }
            else if (target.parentElement.id == "tools") {
                document.getElementsByClassName("active")[0].className = "inactive";
                target.className = "active";
                _this.changeTool("tool", target.innerHTML);
            }
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
        document.getElementsByClassName("reset_button")[0].addEventListener("click", function () {
            _this.reset();
        });
        // mouse clicking logic (updating x and y, adding/erasing particles)
        canvas.addEventListener("mousedown", function (event) {
            _this.mouseEvent = event;
            _this.isMouseDown = event.button === 0;
            _this.currX = event.offsetX;
            _this.currY = event.offsetY;
            canvas.addEventListener("mousemove", function (event) {
                _this.mouseEvent = event;
                _this.currX = event.offsetX;
                _this.currY = event.offsetY;
                // this.timer = setInterval(this.spawnParticles.bind(this), 500);
            });
            document.addEventListener("mouseup", function () {
                _this.isMouseDown = false;
                clearInterval(_this.timer);
            });
            if (_this.currentTool instanceof ToolTip) {
                // set refresh rate faster for walls and erasers
                _this.timer = setInterval(_this.spawnParticles.bind(_this), .005);
            }
            if (_this.currentTool instanceof Placer) {
                // every 40ms for new particle
                _this.timer = setInterval(_this.spawnParticles.bind(_this), 40);
            }
        });
        // save this interval ID for pausing
        this.tickInterval = setInterval(this.tick.bind(this), 1000 / FPS);
    }
    GameController.prototype.spawnParticles = function () {
        // call the tool to interact with particles/walls
        this.currentTool.execute(this.currX, this.size.y - this.currY, this.sim);
    };
    GameController.prototype.tick = function () {
        // main game loop
        // check if mouse is currently being clicked and handle that
        // if game is not paused, update the current pixel array using Simulator
        if (!this.paused) {
            this.sim.updateParticles();
        }
        // pass the current pixel array to GameView to be rendered every tick
        this.sim.particles = this.view.renderParticles(this.sim.particles);
        this.sim.walls = this.view.renderWalls(this.sim.walls);
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
        var retArr = particles.filter(function (p) { return p.toErase != true; });
        for (var _i = 0, retArr_1 = retArr; _i < retArr_1.length; _i++) {
            var particle = retArr_1[_i];
            // if (!particle.toErase){
            this.context.fillStyle = particle.color;
            this.context.fillRect(particle.x, this.HEIGHT - particle.y, 2, 2);
            // }
            // else{
            //     console.log("at least it's in here")
            //     this.context.fillStyle = "white";
            //     this.context.clearRect(particle.x, this.HEIGHT - particle.y, 3, 3);
            // }
        }
        return retArr;
    };
    GameView.prototype.renderWalls = function (walls) {
        // this.context.clearRect(0, 0, this.WIDTH, this.HEIGHT);
        var retArr = walls.filter(function (w) { return w.toErase != true; });
        for (var _i = 0, retArr_2 = retArr; _i < retArr_2.length; _i++) {
            var wall = retArr_2[_i];
            // if (!wall.toErase){
            this.context.fillStyle = Color.DeepBlue;
            this.context.fillRect(wall.x, this.HEIGHT - wall.y, 3, 3);
            // }
            // else{
            //     console.log("at least it's in here")
            //     this.context.fillStyle = "white";
            //     this.context.clearRect(wall.x, this.HEIGHT - wall.y, 3, 3);
            // }
        }
        return retArr;
    };
    return GameView;
}());
///<reference path="./Particle.ts" />
var Lava = /** @class */ (function (_super) {
    __extends(Lava, _super);
    function Lava() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Lava;
}(Particle));
///<reference path="./Particle.ts" />
var Oil = /** @class */ (function (_super) {
    __extends(Oil, _super);
    function Oil(x, y) {
        var _this = _super.call(this, x, y) || this;
        _this.color = Color.Oil;
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
            case ParticleType.Dirt:
                return new Dirt(x, y);
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
///<reference path="./Tool.ts" />
// import { ParticleType } from "./ParticleType";
// import { Simulator } from "./Simulator";
// import { Tool } from "./Tool";
var Placer = /** @class */ (function (_super) {
    __extends(Placer, _super);
    function Placer() {
        return _super.call(this) || this;
    }
    Placer.getInstance = function () {
        Placer.instance = new Placer();
        return Placer.instance;
    };
    Placer.setType = function (type) {
        this.type = type;
    };
    Placer.getType = function () {
        return this.type;
    };
    Placer.prototype.execute = function (x, y, sim) {
        // console.log(Placer.type);
        sim.addParticles(x, y, Placer.getType());
    };
    Placer.prototype.toString = function () {
        return ParticleType[Placer.type];
    };
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
// import { ParticleFactory } from "./ParticleFactory";
// import { ParticleType } from "./ParticleType";
var Simulator = /** @class */ (function () {
    function Simulator(size) {
        // instantiate empty particle and wall maps
        this.particle_map = Array(size.y);
        this.particles = new Array();
        this.wall_map = Array(size.y);
        this.walls = new Array();
        for (var x = 0; x < size.x; x++) {
            this.particle_map[x] = Array(size.y);
            this.wall_map[x] = Array(size.y);
            for (var y = 0; y < size.y; y++) {
                this.particle_map[x][y] = null;
                this.wall_map[x][y] = null;
            }
        }
        // add non-erasable walls as boundaries
        for (var x = 0; x < size.x; x++) {
            var temp_wall = new Wall(x, 0, false);
            this.wall_map[x][0] = temp_wall;
            this.walls.push(temp_wall);
        }
        for (var y = 0; y < size.y; y++) {
            var temp_wall = new Wall(0, y, false);
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
    Simulator.prototype.updateParticles = function () {
        for (var _i = 0, _a = this.particles; _i < _a.length; _i++) {
            var p = _a[_i];
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
                //p.vx = 0;
                p.vy *= 0.5;
            }
        }
    };
    // 0, can't move
    // 1, can move to unoccupied space
    // 2, can move with swap
    Simulator.prototype.evalMove = function (p, new_x, new_y) {
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
            // only do this if we didn't swap!
            // TODO
            this.particle_map[p.x][p.y] = null;
            p.x = new_x;
            p.y = new_y;
            this.particle_map[new_x][new_y] = p;
            return true;
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
        // if (e == 2){
        //
        // }
    };
    Simulator.prototype.addParticles = function (x, y, type) {
        var testCase = this.particles.filter(function (p) {
            return p.x == x && p.y == y;
        });
        if (testCase.length == 0) {
            var toAdd = ParticleFactory.getNewParticle(x, y, type);
            this.particle_map[x][y] = toAdd;
            this.particles.push(toAdd);
        }
    };
    Simulator.prototype.addWalls = function (x, y) {
        // adding walls in 5x5 area
        var sub_xvals = [x - 2, x - 1, x, x + 1, x + 2,
            x - 2, x - 1, x, x + 1, x + 2,
            x - 2, x - 1, x, x + 1, x + 2,
            x - 2, x - 1, x, x + 1, x + 2,
            x - 2, x - 1, x, x + 1, x + 2];
        var sub_yvals = [y + 2, y + 2, y + 2, y + 2, y + 2,
            y + 1, y + 1, y + 1, y + 1, y + 1,
            y, y, y, y, y,
            y - 1, y - 1, y - 1, y - 1, y - 1,
            y - 2, y - 2, y - 2, y - 2, y - 2];
        var _loop_1 = function (i) {
            testCase = this_1.walls.filter(function (w) { return w.x == sub_xvals[i] && w.y == sub_yvals[i]; });
            if (testCase.length == 0) {
                toAdd = new Wall(sub_xvals[i], sub_yvals[i], true);
                this_1.wall_map[sub_xvals[i]][sub_yvals[i]] = toAdd;
                this_1.walls.push(toAdd);
            }
        };
        var this_1 = this, testCase, toAdd;
        for (var i = 0; i < 9; i++) {
            _loop_1(i);
        }
    };
    Simulator.prototype.eraseParticles = function (x, y) {
        // erase in 5x5 area, just like walls
        var sub_xvals = [x - 2, x - 1, x, x + 1, x + 2,
            x - 2, x - 1, x, x + 1, x + 2,
            x - 2, x - 1, x, x + 1, x + 2,
            x - 2, x - 1, x, x + 1, x + 2,
            x - 2, x - 1, x, x + 1, x + 2];
        var sub_yvals = [y + 2, y + 2, y + 2, y + 2, y + 2,
            y + 1, y + 1, y + 1, y + 1, y + 1,
            y, y, y, y, y,
            y - 1, y - 1, y - 1, y - 1, y - 1,
            y - 2, y - 2, y - 2, y - 2, y - 2];
        var _loop_2 = function (i) {
            // make sure particle is there
            // if(this.particle_map[sub_xvals[i]][sub_yvals[i]] != null){
            //     let toErase = this.particle_map[sub_xvals[i]][sub_yvals[i]];
            //     const index = this.particles.indexOf(toErase, 0);
            //     this.particle_map[sub_xvals[i]][sub_yvals[i]] = null;
            //     this.particles[index].toErase = true;
            // }
            var removeArray = this_2.particles.filter(function (p) { return p.x == sub_xvals[i] && p.y == sub_yvals[i]; });
            for (var _i = 0, removeArray_1 = removeArray; _i < removeArray_1.length; _i++) {
                var p = removeArray_1[_i];
                var index = this_2.particles.indexOf(p);
                this_2.particle_map[p.x][p.y] = null;
                this_2.particles[index].toErase = true;
            }
        };
        var this_2 = this;
        for (var i = 0; i < 25; i++) {
            _loop_2(i);
        }
    };
    Simulator.prototype.eraseWalls = function (x, y) {
        // erase in 5x5 area
        var sub_xvals = [x - 2, x - 1, x, x + 1, x + 2,
            x - 2, x - 1, x, x + 1, x + 2,
            x - 2, x - 1, x, x + 1, x + 2,
            x - 2, x - 1, x, x + 1, x + 2,
            x - 2, x - 1, x, x + 1, x + 2];
        var sub_yvals = [y + 2, y + 2, y + 2, y + 2, y + 2,
            y + 1, y + 1, y + 1, y + 1, y + 1,
            y, y, y, y, y,
            y - 1, y - 1, y - 1, y - 1, y - 1,
            y - 2, y - 2, y - 2, y - 2, y - 2];
        var _loop_3 = function (i) {
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
            var removeArray = this_3.walls.filter(function (w) { return w.x == sub_xvals[i] && w.y == sub_yvals[i]; });
            for (var _i = 0, removeArray_2 = removeArray; _i < removeArray_2.length; _i++) {
                var w = removeArray_2[_i];
                var index = this_3.walls.indexOf(w);
                this_3.wall_map[w.x][w.y] = null;
                this_3.walls[index].toErase = true;
            }
        };
        var this_3 = this;
        for (var i = 0; i < 25; i++) {
            _loop_3(i);
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
// import { Placer } from "./Placer";
// import { Simulator } from "./Simulator";
// import { Tool } from "./Tool";
var ToolTip = /** @class */ (function (_super) {
    __extends(ToolTip, _super);
    function ToolTip() {
        return _super.call(this) || this;
    }
    ToolTip.getInstance = function () {
        ToolTip.instance = new ToolTip();
        return ToolTip.instance;
    };
    ToolTip.setType = function (type) {
        this.type = type;
    };
    ToolTip.getType = function () {
        return this.type;
    };
    ToolTip.prototype.execute = function (x, y, sim) {
        if (ToolTip.getType() == ToolType.Wall) {
            sim.addWalls(x, y);
        }
        if (ToolTip.getType() == ToolType.Eraser) {
            sim.eraseParticles(x, y);
            sim.eraseWalls(x, y);
        }
    };
    ToolTip.prototype.toString = function () {
        return ToolType[ToolTip.type];
    };
    return ToolTip;
}(Tool));
var ToolType;
(function (ToolType) {
    ToolType[ToolType["Eraser"] = 0] = "Eraser";
    ToolType[ToolType["Explosion"] = 1] = "Explosion";
    ToolType[ToolType["Wall"] = 2] = "Wall";
})(ToolType || (ToolType = {}));
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
        return _this;
    }
    return Water;
}(Particle));
//# sourceMappingURL=app.js.map