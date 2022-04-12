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
        // if clicked on game area
        //this.currentTool.execute(this.sim);
    }

    public changeTool(tip: string, name: string): void {
        var num: number = null;
        switch(tip){
            case "particle": 
                num = ParticleType[name];
                let newPlacer = Placer.getInstance();
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
    }



    private reset(): void {

    }

    private pause(): void {

    }

}