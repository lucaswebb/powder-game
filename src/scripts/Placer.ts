///<reference path="./Tool.ts" />
// import { ParticleType } from "./ParticleType";
// import { Simulator } from "./Simulator";
// import { Tool } from "./Tool";



class Placer extends Tool {
    private static instance: Placer = new Placer();
    private type: ParticleType;

    private constructor() {
        super();
        this.type = ParticleType.Stone
    }

    public static getInstance(): Placer {
        return this.instance;
    }

    public setType(type: ParticleType): void {
        this.type = type;
    }

    public execute(x: number, y: number, sim: Simulator): void {
        // console.log(Placer.type);
        sim.addParticles(x, y, this.type);
    }
}