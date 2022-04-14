const FPS = 24;

class GameController {
    private size: Vec2D;
    private paused: boolean;
    private sim: Simulator;
    private view: GameView;
    private currentTool: Tool;
    private tickInterval: number;

    constructor(size: Vec2D, canvas: HTMLCanvasElement) {
        this.size = size;
        this.view = new GameView(canvas);
        this.sim = new Simulator();
        let f = this.changeTool;
        let particleList = document.getElementsByClassName("particle");
        for (let i = 0; i < particleList.length; i++){
            particleList[i].addEventListener("click", function() {
                f("particle", particleList[i].innerHTML);
            });
        }

        let toolList = document.getElementsByClassName("tool");
        for (let i = 0; i < toolList.length; i++){
            toolList[i].addEventListener("click", function() {
                f("tool", toolList[i].innerHTML);
            });
        }

        let gameMap = document.getElementById("canvasContainer");
        let gameMapiFrame = gameMap.children[0] as HTMLElement;
        console.log(gameMapiFrame);
        console.log("test");
        gameMapiFrame.onclick= this.handleUserClick;

        

        // save this interval ID for pausing
        this.tickInterval = setInterval(this.tick.bind(this), 1000 / FPS);
    }



    private tick(): void {
        // main game loop
        // check if mouse is currently being clicked and handle that

        // if game is not paused, update the current pixel array using Simulator
        if (!this.paused) {
            this.sim.updateParticles();
        }

        // pass the current pixel array to GameView to be rendered every tick
        this.view.renderParticles(this.sim.particles);
    }

    private handleUserClick(): void {
        var mouseFlag;
        // if clicked on game area
        //this.currentTool.execute(this.sim);
        // console.log("Anthony you pretty cool");
        let timer;

        let gameCanvas = document.getElementById("canvasContainer");
        let gameMap = gameCanvas.children[0] as HTMLElement;

        function mousedown(e){
            console.log(e.clientX, e.clientY)
            // mouseFlag 
            gameMap.addEventListener("mousemove", mousemove);

        }

        function mousemove(e){
            console.log(e.clientX, e.clientY);
            // gameMap.addEventListener("mouseup", mouseup, false);
        }

        function mouseup(e){
            console.log("called");
            // clearInterval(timer);
            gameMap.removeEventListener("mousemove", mousemove);
        }
        gameMap.addEventListener("mousedown", mousedown);
        gameMap.addEventListener("mouseup", mouseup);
        
    }

    public changeTool(tip: string, name: string): void {
        var num: number = null;
        switch(tip){
            case "particle": 
                num = ParticleType[name];
                let newPlacer = Placer.getInstance();
                var particleType = ParticleType[name];
                Placer.setType(ParticleType[name]);
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
    }



    private reset(): void {

    }

    private pause(): void {

    }

}