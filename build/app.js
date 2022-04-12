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
        this.vy = 1;
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
    return Explosion;
}(Tool));
var FPS = 24;
var GameController = /** @class */ (function () {
    function GameController(size, canvas) {
        this.size = size;
        this.view = new GameView(canvas);
        this.sim = new Simulator();
        var f = this.changeTool;
        var particleList = document.getElementsByClassName("particle");
        var _loop_1 = function (i) {
            particleList[i].addEventListener("click", function () {
                f("particle", particleList[i].innerHTML);
            });
        };
        for (var i = 0; i < particleList.length; i++) {
            _loop_1(i);
        }
        var toolList = document.getElementsByClassName("tool");
        var _loop_2 = function (i) {
            toolList[i].addEventListener("click", function () {
                f("tool", toolList[i].innerHTML);
            });
        };
        for (var i = 0; i < toolList.length; i++) {
            _loop_2(i);
        }
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
        this.view.renderParticles(this.sim.particles);
    };
    GameController.prototype.handleUserClick = function () {
        // if clicked on game area
        //this.currentTool.execute(this.sim);
    };
    GameController.prototype.changeTool = function (tip, name) {
        var num = null;
        switch (tip) {
            case "particle":
                num = ParticleType[name];
                var newPlacer = Placer.getInstance();
                var particleType = ParticleType[name];
                Placer.setType(particleType);
                this.currentTool = newPlacer;
                console.log(this.currentTool);
                break;
            case "tool":
                num = ToolType[name];
                console.log(ToolType[num]);
                break;
            default:
                console.log("unknown tool");
        }
    };
    GameController.prototype.reset = function () {
    };
    GameController.prototype.pause = function () {
    };
    return GameController;
}());
var GameView = /** @class */ (function () {
    function GameView(canvas) {
        this.context = canvas.getContext('2d');
    }
    GameView.prototype.renderParticles = function (particles) {
        this.context.clearRect(0, 0, 800, 600);
        for (var _i = 0, particles_1 = particles; _i < particles_1.length; _i++) {
            var particle = particles_1[_i];
            this.context.fillStyle = "red";
            this.context.fillRect(particle.x, particle.y, 2, 2);
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
        return _super.call(this) || this;
    }
    Placer.getInstance = function () {
        Placer.instance = new Placer();
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
    function Simulator() {
        this.particles = new Array();
        for (var i = 0; i < 100; i++) {
            this.particles.push(ParticleFactory.getNewParticle(i, i, ParticleType.Stone));
        }
    }
    Simulator.prototype.updateParticles = function () {
        // apply gravity to each particle
        for (var _i = 0, _a = this.particles; _i < _a.length; _i++) {
            var p = _a[_i];
            p.y = p.y + p.vy;
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
var ToolType;
(function (ToolType) {
    ToolType[ToolType["Eraser"] = 0] = "Eraser";
    ToolType[ToolType["Explosion"] = 1] = "Explosion";
})(ToolType || (ToolType = {}));
///<reference path="./Particle.ts" />
var Water = /** @class */ (function (_super) {
    __extends(Water, _super);
    function Water() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Water;
}(Particle));
//# sourceMappingURL=app.js.map