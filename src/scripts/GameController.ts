const FPS = 24;

class GameController {
    private x_size: number;
    private y_size: number;
    private paused: boolean;
    private sim: Simulator;
    private view: GameView;
    private currentTool: Tool;
    private tickInterval: number;

    constructor(x: number, y: number, ) {

        // save this interval ID for pausing
        this.tickInterval = setInterval(this.tick.bind(this), 1000 / FPS);
    }

    private tick(): void {
        // main game loop
    }

    private handleUserClick(): void {
        // if clicked on game area
        this.currentTool.execute(this.sim);
    }

    private changeTool(): void {

    }

    private reset(): void {

    }

    private pause(): void {

    }

}