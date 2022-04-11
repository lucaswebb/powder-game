///<reference path="./Tool.ts" />

class Eraser extends Tool {
    private static instance: Eraser;

    private constructor() {
        super();

    }

    public static getInstance(): Eraser {
        if (!Eraser.instance) {
            Eraser.instance = new Eraser();
        }

        return Eraser.instance;
    }

    public execute(x: number, y: number, sim: Simulator) {

    }
}