// import { Simulator } from "./Simulator";

abstract class Tool {

    public execute(x: number, y: number, sim: Simulator): void {}

    public static getInstance(): Tool { return null}

}