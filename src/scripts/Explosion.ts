///<reference path="./Tool.ts" />



class Explosion extends Tool {
    private static instance: Explosion;

    private constructor() {
        super();

    }

    public static getInstance(): Explosion {
        if (!Explosion.instance) {
            Explosion.instance = new Explosion();
        }

        return Explosion.instance;
    }

    public execute(x: number, y: number, sim: Simulator) {

    }

    public toString(): string {
        return "Explosion";
    }
}