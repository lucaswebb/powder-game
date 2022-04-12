///<reference path="./Tool.ts" />

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

    public static setType(type: ParticleType) {
        this.type = type;
    }

    public execute(x: number, y: number, sim: Simulator) {
    }
}