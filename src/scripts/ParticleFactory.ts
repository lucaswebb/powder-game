enum ParticleType {
    Stone,
    Water,
    Sand,
    Oil,
    Brick,
    Lava,
    C4,
    Dirt
}

class ParticleFactory {
    public static getNewParticle(x: number, y: number, type: ParticleType): Particle {
        switch (type) {
            case ParticleType.Stone:
                return new Stone(x, y);

            default:
                throw new TypeError("Unknown ParticleType " + type);
        }
    }
}
