///<reference path="./Tool.ts" />

class Explosion extends Tool {
    private static instance: Explosion;

    private constructor() {
        super();

    }

    public static getInstance(): Eraser {
        if (!Explosion.instance) {
            Explosion.instance = new Explosion();
        }

        return Explosion.instance;
    }

    public execute(x: number, y: number, sim: Simulator) {

    }
}