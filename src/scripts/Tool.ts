// import { Simulator } from "./Simulator";

abstract class Tool {

    protected constructor() {

    }

    public execute(x: number, y: number, sim: Simulator): void {

    }

    public getType(){
        
    }


    public toString(): string{
        return "Tool";
    }

}