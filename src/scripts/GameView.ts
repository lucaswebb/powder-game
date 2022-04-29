class GameView {
    private context: CanvasRenderingContext2D;
    private WIDTH: number;
    private HEIGHT: number;

    constructor(size: Vec2D, canvas: HTMLCanvasElement) {
        this.context = canvas.getContext('2d');
        this.WIDTH = size.x;
        this.HEIGHT = size.y;
    }

    public renderParticles(particles: Particle[]): Particle[] {
        this.context.clearRect(0, 0, this.WIDTH, this.HEIGHT);
        let retArr: Particle[] = particles.filter(p => p.toErase != true);
        for (let particle of retArr) {
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

        
    }

    public renderWalls(walls: Wall[]): Wall[] {
        // this.context.clearRect(0, 0, this.WIDTH, this.HEIGHT);
        let retArr: Wall[] = walls.filter(w => w.toErase != true);
        for (let wall of retArr) {
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
    }
}