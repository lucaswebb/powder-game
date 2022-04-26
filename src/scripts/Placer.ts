///<reference path="./Tool.ts" />
// import { ParticleType } from "./ParticleType";
// import { Simulator } from "./Simulator";
// import { Tool } from "./Tool";



class Placer extends Tool {
    private static type: ParticleType;
    private static instance: Placer;

    private constructor() {
        super();
        
    }

    public static getInstance(): Placer {
        Placer.instance = new Placer();
        return Placer.instance;
    }

    public static setType(type: ParticleType): void {
        this.type = type;
    }

    public static getType(): ParticleType{
        return this.type;
    }

    public execute(x: number, y: number, sim: Simulator): void {
        // console.log(Placer.type);
        sim.addParticles(x, y, Placer.getType());
    }

    public toString(): string {
        return ParticleType[Placer.type];
    }
}