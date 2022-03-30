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
}