const FPS = 24;

class GameController {
    size: Vec2D;
    paused: boolean;
    sim: Simulator;
    view: GameView;
    currentTool: Tool;
    tickInterval: number;
    currX: number;
    currY: number;
    toolIsSet: boolean;
    currentParticle: Particle;

    private mouseEvent: MouseEvent;
    private isMouseDown: boolean = false;
    private timer;

    constructor(size: Vec2D, canvas: HTMLCanvasElement) {
        this.size = size;
        this.view = new GameView(size, canvas);
        this.sim = new Simulator(size);
        this.currentTool = Placer.getInstance();
        Placer.setType(ParticleType["Stone"]);
        this.toolIsSet = true;
        this.paused = false;

        // scope is weird, setting function outside works, but is definitely janky
        let f = this.changeTool;
        // set particle button event listener
        let particleList = document.getElementsByClassName("particle");
        for (let i = 0; i < particleList.length; i++){
            particleList[i].addEventListener("click", function() {
                f("particle", particleList[i].innerHTML);
            });
        }
        
        // set tool button event listener
        let toolList = document.getElementsByClassName("tool");
        for (let i = 0; i < toolList.length; i++){
            toolList[i].addEventListener("click", function() {
                f("tool", toolList[i].innerHTML);
            });
        }

        // pause logic
        let pauseButton = document.getElementsByClassName("pause")[0];
        pauseButton.addEventListener("click", () => {
            if (this.paused){
                console.log("game unpause");
                this.tickInterval = setInterval(this.tick.bind(this), 1000/FPS);
                this.paused = false;
            }
            else {
                console.log("game pause");
                clearInterval(this.tickInterval);
                this.paused = true;
            }
        });

        // mouse clicking logic (updating x and y, adding/erasing particles)
        canvas.addEventListener("mousedown", (event: MouseEvent) => {
            this.mouseEvent = event;
            this.isMouseDown = event.button === 0;
            this.currX = event.offsetX;
            this.currY = event.offsetY;
    
            canvas.addEventListener("mousemove", (event: MouseEvent) => {
                this.mouseEvent = event;
                this.currX = event.offsetX;
                this.currY = event.offsetY;
                
                // this.timer = setInterval(this.spawnParticles.bind(this), 500);
            });
            document.addEventListener("mouseup", () => {
                this.isMouseDown = false;

                clearInterval(this.timer)
            });
            
            if (this.currentTool instanceof ToolTip){
                // set refresh rate faster for walls and erasers
                this.timer = setInterval(this.spawnParticles.bind(this), .005);
            }
            if (this.currentTool instanceof Placer){
                // every 40ms for new particle
                this.timer = setInterval(this.spawnParticles.bind(this), 40);
            }
                
        });
        // save this interval ID for pausing
        this.tickInterval = setInterval(this.tick.bind(this), 1000/FPS);
    }

    private spawnParticles(): void{
        // call the tool to interact with particles/walls
        this.currentTool.execute(this.currX, this.size.y - this.currY, this.sim);
        
    }

    private tick(): void {
        // main game loop
        // check if mouse is currently being clicked and handle that

        // if game is not paused, update the current pixel array using Simulator
        if (!this.paused) {
            this.sim.updateParticles();
        }
        

        // pass the current pixel array to GameView to be rendered every tick
        this.sim.particles = this.view.renderParticles(this.sim.particles);
        this.sim.walls = this.view.renderWalls(this.sim.walls);
    }

    

    private changeTool = (tip: string, name: string) => {
        switch(tip){
            case "particle": 
                let newPlacer = Placer.getInstance();
                Placer.setType(ParticleType[name]);
                this.currentTool = newPlacer;
                break;
            case "tool": 
                let newTool = ToolTip.getInstance();
                ToolTip.setType(ToolType[name]);
                this.currentTool = newTool;
                break;
            default:
                console.log("unknown tool");
        }
        
    }

}
