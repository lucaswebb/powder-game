// import { Placer } from "./Placer";
// import { Simulator } from "./Simulator";
// import { Tool } from "./Tool";

class ToolTip extends Tool {
    private static type: ToolType;
    private static instance: ToolTip;

    private constructor() {
        super();
        
    }

    public static getInstance(): ToolTip {
        ToolTip.instance = new ToolTip();
        return ToolTip.instance;
    }

    public static setType(type: ToolType) {
        this.type = type;
    }

    public execute(x: number, y: number, sim: Simulator) {

    }

    public toString(): string {
        return ToolType[ToolTip.type];
    }
}