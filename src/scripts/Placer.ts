class Placer extends Tool {
    private static instance: Placer;

    private constructor() {
        super();

    }

    public static getInstance(): Placer {
        if (!Placer.instance) {
            Placer.instance = new Placer();
        }

        return Placer.instance;
    }

}