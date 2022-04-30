///<reference path="./Particle.ts" />

class Water extends Particle {
    constructor(x: number, y: number){
        super(x,y);
        this.color = Color.Blue;
        this.liquid = true;
        this.density = 1;
    }

}