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
        let f = this.changeTool;
        let particleList = document.getElementsByClassName("particle");
        for (let i = 0; i < particleList.length; i++){
            particleList[i].addEventListener("click", function() {
                f("particle", particleList[i].innerHTML);
            });
            // particleList[i].addEventListener("click",
            //     this.changeTool.bind("particle", particleList[i].innerHTML)
            // );
        
        }
        
        let toolList = document.getElementsByClassName("tool");
        for (let i = 0; i < toolList.length; i++){
            toolList[i].addEventListener("click", function() {
                f("tool", toolList[i].innerHTML);
            });
        }

        let pauseButton = document.getElementsByClassName("pause")[0];
        let pauseFunction = this.pause;
        pauseButton.addEventListener("click", function() {
            pauseFunction();
        })
        
        
        
        // gameMapiFrame.onclick = this.handleUserClick;

        canvas.addEventListener("mousedown", (event: MouseEvent) => {
            this.mouseEvent = event;
            this.isMouseDown = event.button === 0;
            this.currX = event.offsetX;
            this.currY = event.offsetY;
            console.log(this.currentTool.toString());
            console.log(this.currX, this.currY);
            console.log(event.clientX, event.clientY);
    
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
                if(ToolTip.getType() == ToolType.Wall){
                    this.timer = setInterval(this.spawnParticles.bind(this), .002);
                }
                if(ToolTip.getType() == ToolType.Eraser){
                    this.timer = setInterval(this.eraseParticles.bind(this), .002);
                }
            }
            if (this.currentTool instanceof Placer){
                this.timer = setInterval(this.spawnParticles.bind(this), 40);
            }
                
        });
        // save this interval ID for pausing
        this.tickInterval = setInterval(this.tick.bind(this), 1000/FPS);
    }

    private spawnParticles(): void{
        // console.log(this.currX, this.currY);
        // console.log(this.currentTool);
        if(this.toolIsSet){
            this.currentTool.execute(this.currX, this.size.y - this.currY, this.sim);
        }
        else{
            console.log("no tool dummy")
        }
    }

    private eraseParticles(): void{
        this.currentTool.execute(this.currX, this.size.y - this.currY, this.sim);
    }

    private tick(): void {
        // main game loop
        // check if mouse is currently being clicked and handle that

        // if game is not paused, update the current pixel array using Simulator
        if (!this.paused) {
            this.sim.updateParticles();
        }
        

        // if (this.isMouseDown) {
        //     this.sim.addParticles(Math.floor(this.mouseEvent.offsetX), Math.floor(this.mouseEvent.offsetY), Placer.getType())
        // }

        // pass the current pixel array to GameView to be rendered every tick
        this.sim.particles = this.view.renderParticles(this.sim.particles);
        this.sim.walls = this.view.renderWalls(this.sim.walls);
    }

    private handleUserClick = () => {
        var mouseFlag;
        var thing;
        // if clicked on game area
        // this.currentTool.execute(this.sim);
        let timer;
        this.toolIsSet = (this.currentTool != undefined)
    
        let gameCanvas = document.getElementById("canvasContainer");
        let gameMap = gameCanvas.children[0] as HTMLElement;
    
        let mousedown = (e) => {
            this.currX = e.clientX;
            this.currY = e.clientY;
            mouseFlag = true;
            console.log(this.currentTool.toString());
    
            gameMap.addEventListener("mousemove", mousemove);
    
            timer = setInterval(this.spawnParticles.bind(this), 500);
        }
    
    
    
    
        let mousemove = (e) => {
            this.currX = e.clientX;
            this.currY = e.clientY;
            // gameMap.addEventListener("mouseup", mouseup, false);
        }
    
        let mouseup = (e) => {
    
            clearInterval(timer);
            gameMap.removeEventListener("mousemove", mousemove);
        }
        gameMap.addEventListener("mousedown", mousedown);
        gameMap.addEventListener("mouseup", mouseup);
    
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


    private reset(): void {

    }

    private pause(): void {

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
    }

}
