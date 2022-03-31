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
