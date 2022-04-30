///<reference path="./Tool.ts" />

// Singleton Pattern
class EraserTool extends Tool {
    private static instance: EraserTool;

    private constructor() {
        super();
    }

    public static getInstance(): EraserTool {
        if (!EraserTool.instance) {
            EraserTool.instance = new EraserTool();
        }

        return EraserTool.instance;
    }

    // Command Pattern
    public execute(x: number, y: number, sim: Simulator) {
        var toErase = [];
        for (let i = -4; i < 5; i++) {
            for (let j = -4; j < 5; j++) {
                toErase.push({x: x + i, y: y + i})
            }
        }
        sim.eraseArea(toErase);
    }
}