// Default planets from Custom Scenario > Star System
const Alien = new PlanetDefinition({name: "StarSystem/Alien", size: 2048, hills: [-0.01, 0.12]});
const EarthLike = new PlanetDefinition({name: "StarSystem/EarthLike", size: 2048, hills: [-0.01, 0.12]});
const Europa = new PlanetDefinition({name: "StarSystem/Europa", size: 2048, hills: [-0.03, 0.06]});
const Mars = new PlanetDefinition({name: "StarSystem/Mars", size: 2048, hills: [-0.01, 0.12]});
const Moon = new PlanetDefinition({name: "StarSystem/Moon", size: 2048, hills: [-0.03, 0.03]});
const Pertam = new PlanetDefinition({name: "StarSystem/Pertam", size: 2048, hills: [-0.025, 0.025]});
const Titan = new PlanetDefinition({name: "StarSystem/Titan", size: 2048, hills: [-0.03, 0.03]});
const Triton = new PlanetDefinition({name: "StarSystem/Triton", size: 2048, hills: [-0.05, 0.2]});

// DIE Enduur
// https://wiki.sigmadraconis.games/en/spaceengies/enduur/home
// https://steamcommunity.com/sharedfiles/filedetails/?id=2831947604
const Corpus = new PlanetDefinition({name: "DIE/Corpus", size: 2048, hills: [-0.05, 0.2]});
const Greer = new PlanetDefinition({name: "DIE/Greer", size: 2048, hills: [-0.05, 0.2]});

const Planets = {
  "StarSystem: Alien": Alien.new({radius: 60000, x: 0, y: 0, z: 5600000}),
  "StarSystem: EarthLike": EarthLike.new({radius: 60000, x: -131072, y: -131072, z: -131072}),
  "StarSystem: Europa": Europa.new({radius: 9500, x: 900000, y: 0, z: 1600000}),
  "StarSystem: Mars": Mars.new({radius: 60000, x: 900000, y: 0, z: 1500000}),
  "StarSystem: Moon": Moon.new({radius: 9500, x: 0, y: 120000, z: -130000}),
  "StarSystem: Pertam": Pertam.new({radius: 30066.5, x: -4000000, y: -65000, z: -800000}),
  "StarSystem: Titan": Titan.new({radius: 9500, x: 20000, y: 210000, z: 5780000}),
  "StarSystem: Triton": Triton.new({radius: 40126.5, x: -350000, y: -2500000, z: 300000}),

  "DIE: Corpus": Corpus.new({radius: 12500, x: 418037.01, y: 418037.01, z: 413798.24}),
  "DIE: Greer": Greer.new({radius: 12500, x: -469557.71, y: -431205.35, z: -446566.32}),
};
