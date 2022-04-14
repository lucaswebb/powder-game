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
    }
    Particle.prototype.applyForce = function (x, y) {
        // recalculate velocity
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
    // add some basic default colors here
})(Color || (Color = {}));
///<reference path="./Particle.ts" />
var Dirt = /** @class */ (function (_super) {
    __extends(Dirt, _super);
    function Dirt() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Dirt;
}(Particle));
var Tool = /** @class */ (function () {
    function Tool() {
    }
    Tool.prototype.execute = function (x, y, sim) {
    };
    return Tool;
}());
///<reference path="./Tool.ts" />
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
    };
    return Eraser;
}(Tool));
var FPS = 24;
var GameController = /** @class */ (function () {
    function GameController(size, canvas) {
        this.size = size;
        this.view = new GameView(size, canvas);
        this.sim = new Simulator(size);
        // save this interval ID for pausing
        this.tickInterval = setInterval(this.tick.bind(this), 1000 / FPS);
    }
    GameController.prototype.tick = function () {
        // main game loop
        // check if mouse is currently being clicked and handle that
        // if game is not paused, update the current pixel array using Simulator
        if (!this.paused) {
            this.sim.updateParticles();
        }
        // pass the current pixel array to GameView to be rendered every tick
        this.view.renderParticles(this.sim.particles, this.sim.walls);
    };
    GameController.prototype.handleUserClick = function () {
        // if clicked on game area
        //this.currentTool.execute(this.sim);
    };
    GameController.prototype.changeTool = function () {
    };
    GameController.prototype.reset = function () {
    };
    GameController.prototype.pause = function () {
    };
    return GameController;
}());
var GameView = /** @class */ (function () {
    function GameView(size, canvas) {
        this.context = canvas.getContext('2d');
        this.WIDTH = size.x;
        this.HEIGHT = size.y;
    }
    GameView.prototype.renderParticles = function (particles, walls) {
        this.context.clearRect(0, 0, this.WIDTH, this.HEIGHT);
        for (var _i = 0, particles_1 = particles; _i < particles_1.length; _i++) {
            var particle = particles_1[_i];
            this.context.fillStyle = "red";
            this.context.fillRect(particle.x, this.HEIGHT - particle.y, 2, 2);
        }
        for (var _a = 0, walls_1 = walls; _a < walls_1.length; _a++) {
            var wall = walls_1[_a];
            this.context.fillStyle = "grey";
            this.context.fillRect(wall.x, this.HEIGHT - wall.y, 2, 2);
        }
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
    function Oil() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Oil;
}(Particle));
var ParticleFactory = /** @class */ (function () {
    function ParticleFactory() {
    }
    ParticleFactory.getNewParticle = function (x, y, type) {
        switch (type) {
            case ParticleType.Stone:
                return new Stone(x, y);
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
var Placer = /** @class */ (function (_super) {
    __extends(Placer, _super);
    function Placer() {
        var _this = _super.call(this) || this;
        Placer.instance = new Placer();
        return _this;
    }
    Placer.getInstance = function () {
        return Placer.instance;
    };
    Placer.setType = function (type) {
        this.type = type;
    };
    Placer.prototype.execute = function (x, y, sim) {
    };
    return Placer;
}(Tool));
///<reference path="./Particle.ts" />
var Sand = /** @class */ (function (_super) {
    __extends(Sand, _super);
    function Sand() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Sand;
}(Particle));
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
        for (var i = 0; i < 100; i++) {
            this.particles.push(ParticleFactory.getNewParticle(i, i, ParticleType.Stone));
        }
    }
    Simulator.prototype.updateParticles = function () {
        for (var _i = 0, _a = this.particles; _i < _a.length; _i++) {
            var p = _a[_i];
            var x = p.x;
            var y = p.y;
            // updates to velocity from gravity
            p.vy -= 0.5;
            // if the particle is not moving, skip, code for movement is next
            if (p.vx == 0 && p.vy == 0) {
                continue;
            }
            // now try to move the particle in the direction of it's velocity
            p.y += p.vy;
        }
    };
    Simulator.prototype.addParticles = function (toAdd) {
    };
    Simulator.prototype.eraseParticles = function (toEraseX, toEraseY) {
    };
    Simulator.prototype.hasNext = function () {
        return false;
    };
    Simulator.prototype.next = function () {
        return undefined;
    };
    Simulator.prototype.reset = function () {
    };
    return Simulator;
}());
///<reference path="./Particle.ts" />
var Stone = /** @class */ (function (_super) {
    __extends(Stone, _super);
    function Stone(x, y) {
        return _super.call(this, x, y) || this;
    }
    return Stone;
}(Particle));
///<reference path="./Particle.ts" />
var Water = /** @class */ (function (_super) {
    __extends(Water, _super);
    function Water() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Water;
}(Particle));
var Wall = /** @class */ (function () {
    function Wall(x, y, erasable) {
        this.x = x;
        this.y = y;
        this.erasable = erasable;
    }
    return Wall;
}());
//# sourceMappingURL=app.js.map