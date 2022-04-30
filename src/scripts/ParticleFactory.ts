// import { ParticleType } from "./ParticleType";
// import { Stone } from "./Stone";

class ParticleFactory {
    public static getNewParticle(x: number, y: number, type: ParticleType): Particle {
        switch (type) {
            case ParticleType.Stone:
                return new Stone(x, y);
            case ParticleType.Sand:
                return new Sand(x, y);
            case ParticleType.Water:
                return new Water(x, y);
            case ParticleType.Oil:
                return new Oil(x, y);
            default:
                throw new TypeError("Unknown ParticleType " + type);
        }
    }
}
