///<reference path="./Tool.ts" />

// import { Simulator } from "./Simulator";
// import { Tool } from "./Tool";

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

    public toString(): string {
        return "Eraser";
    }
}