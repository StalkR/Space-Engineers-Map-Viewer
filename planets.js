// Default planets from Custom Scenario > Star System
const Alien = new PlanetDefinition({name: "StarSystem/Alien", size: 2048, hills: [-0.01, 0.12]});
const EarthLike = new PlanetDefinition({name: "StarSystem/EarthLike", size: 2048, hills: [-0.01, 0.12]});
const Europa = new PlanetDefinition({name: "StarSystem/Europa", size: 2048, hills: [-0.03, 0.06]});
const Mars = new PlanetDefinition({name: "StarSystem/Mars", size: 2048, hills: [-0.01, 0.12]});
const Moon = new PlanetDefinition({name: "StarSystem/Moon", size: 2048, hills: [-0.03, 0.03]});
const Pertam = new PlanetDefinition({name: "StarSystem/Pertam", size: 2048, hills: [-0.025, 0.025]});
const Titan = new PlanetDefinition({name: "StarSystem/Titan", size: 2048, hills: [-0.03, 0.03]});
const Triton = new PlanetDefinition({name: "StarSystem/Triton", size: 2048, hills: [-0.05, 0.2]});

// Draconis Impossible Extended
// https://wiki.sigmadraconis.games/doku.php?id=di:draconis_impossible
// https://steamcommunity.com/sharedfiles/filedetails/?id=2439920241
const Comet = new PlanetDefinition({name: "DIE/Comet", size: 2048, hills: [-0.1, 0.1]});
const Odin = new PlanetDefinition({name: "DIE/Odin", size: 2048, hills: [-0.05, 0.20]});
const Prthvi = new PlanetDefinition({name: "DIE/Prthvi", size: 2048, hills: [-0.01, 0.12]});
const Purgatory = new PlanetDefinition({name: "DIE/Purgatory", size: 2048, hills: [-0.05, 0.20]});
const Triborg = new PlanetDefinition({name: "DIE/Triborg", size: 2048, hills: [-0.01, 0.12]});

const Planets = {
  "StarSystem: Alien": Alien.new({radius: 60000, x: 0, y: 0, z: 5600000}),
  "StarSystem: EarthLike": EarthLike.new({radius: 60000, x: -131072, y: -131072, z: -131072}),
  "StarSystem: Europa": Europa.new({radius: 9500, x: 900000, y: 0, z: 1600000 }),
  "StarSystem: Mars": Mars.new({radius: 60000, x: 900000, y: 0, z: 1500000 }),
  "StarSystem: Moon": Moon.new({radius: 9500, x: 0, y: 120000, z: -130000, }),
  "StarSystem: Pertam": Pertam.new({radius: 30066.5, x: -4000000, y: -65000, z: -800000, }),
  "StarSystem: Titan": Titan.new({radius: 9500, x: 20000, y: 210000, z: 5780000 }),
  "StarSystem: Triton": Triton.new({radius: 40126.5, x: -350000, y: -2500000, z: 300000 }),
  "DIE: Pelican Comet": Comet.new({radius: 9500, x: 568042.33, y: -1522069.87, z: -2777607.37 }),
  "DIE: Odin": Odin.new({radius: 60000, x: -404206.12, y: -2135630.17, z: -2890260.25 }),
  "DIE: Prthvi": Prthvi.new({radius: 60000, x: -1353956.52, y: -1862080.05, z: -2204718.27}),
  "DIE: Purgatory": Purgatory.new({radius: 60000, x: 199862.54, y: -2986181.56, z: -2584882.5}),
  "DIE: Triborg-Alpha": Triborg.new({radius: 9500, x: -183502.35, y: -2169922.99, z: -2771080.01}),
  "DIE: Triborg-Beta": Triborg.new({radius: 9500, x: -341249.57, y: -1992606.53, z: -2592841.46}),
  "DIE: Triborg-Gamma": Triborg.new({radius: 9500, x: -332422.71, y: -1912175, z: -2920072.99}),
};
