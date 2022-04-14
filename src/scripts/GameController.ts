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
        this.view = new GameView(size, canvas);
        this.sim = new Simulator(size);

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
        this.view.renderParticles(this.sim.particles, this.sim.walls);
    }

    private handleUserClick(): void {
        // if clicked on game area
        //this.currentTool.execute(this.sim);
    }

    private changeTool(): void {

    }

    private reset(): void {

    }

    private pause(): void {

    }

}