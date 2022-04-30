const FPS = 60;
let PARTICLE_SIZE = 5; // How many pixels per side of each particle, should be odd

class GameController {
    size: Vec2D;
    paused: boolean;
    sim: Simulator;
    view: GameView;
    currentTool: Tool;
    tickInterval: number;

    private mouseEvent: MouseEvent;
    private isMouseDown: boolean = false;

    constructor(size: Vec2D, canvas: HTMLCanvasElement) {
        this.size = size;
        this.view = new GameView(size, canvas);
        this.sim = new Simulator(size);
        this.currentTool = Placer.getInstance();
        this.paused = false;

        // Tool changing
        document.getElementById("tool-box").addEventListener("click", (event) => {
            var target = <HTMLElement> event.target;
            if (target.parentElement.id == "particles" || target.parentElement.id == "tools") {
                document.getElementsByClassName("active")[0].className = "inactive";
                target.className = "active";
                if (target.parentElement.id == "particles") {
                    this.currentTool = Placer.getInstance();
                    (<Placer>this.currentTool).setType(ParticleType[target.innerHTML]);
                } else if (target.parentElement.id == "tools") {
                    var name = target.innerHTML;
                    this.currentTool = window[name.concat("Tool")].getInstance();
                }
            }
        });

        // Slider
        var slider = document.getElementById("size_slider");
        slider.addEventListener("input", () => {
            PARTICLE_SIZE = (<HTMLInputElement> slider).valueAsNumber;
            this.reset();
        });

        // Pause Button
        let pauseButton = document.getElementsByClassName("pause_button")[0];
        pauseButton.addEventListener("click", () => {
            if (this.paused){
                this.paused = false;
                pauseButton.innerHTML = "Pause";
            } else {
                this.paused = true;
                pauseButton.innerHTML = "Play";
            }
        });

        // Reset Button
        document.getElementsByClassName("reset_button")[0].addEventListener("click", () => {
            this.reset();
        });

        // Mouse listeners
        canvas.addEventListener("mousedown", (event: MouseEvent) => {
            this.mouseEvent = event;
            this.isMouseDown = event.button === 0;
        });

        document.addEventListener("mouseup", () => {
            this.isMouseDown = false;
        });

        canvas.addEventListener("mousemove", (event: MouseEvent) => {
            this.mouseEvent = event;
        });

        // save this interval ID for pausing
        this.tickInterval = setInterval(this.tick.bind(this), 1000/FPS);
    }

    // Main game loop
    private tick(): void {

        // check if mouse is currently being clicked and handle that
        if (this.isMouseDown) {
            this.currentTool.execute(Math.floor(this.mouseEvent.offsetX), this.size.y - Math.floor(this.mouseEvent.offsetY), this.sim)
        }

        // if game is not paused, update the current pixel array using Simulator
        if (!this.paused) {
            this.sim.updateParticles();
        }

        // pass the current pixel array to GameView to be rendered every tick
        this.view.renderParticles(this.sim.particles);
        this.view.renderWalls(this.sim.walls);
    }

    private reset(): void {
        this.sim = new Simulator(this.size);
    }
}
