class WallTool extends Tool {
    private static instance: WallTool;

    private constructor() {
        super();
    }

    public static getInstance(): WallTool {
        if (!WallTool.instance) {
            WallTool.instance = new WallTool();
        }

        return WallTool.instance;
    }

    public execute(x: number, y: number, sim: Simulator) {
        var toAdd = [];
        for (let i = -2; i < 3; i++) {
            for (let j = -2; j < 3; j++) {
                toAdd.push({x: x + i, y: y + j})
            }
        }
        sim.addWalls(toAdd);
    }
}