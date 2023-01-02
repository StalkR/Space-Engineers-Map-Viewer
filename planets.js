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
// https://steamcommunity.com/sharedfiles/filedetails/?id=2439920241
const Comet = new PlanetDefinition({name: "DIE/Comet", size: 2048, hills: [-0.1, 0.1]});
const Odin = new PlanetDefinition({name: "DIE/Odin", size: 2048, hills: [-0.05, 0.20]});
const Prthvi = new PlanetDefinition({name: "DIE/Prthvi", size: 2048, hills: [-0.01, 0.12]});
const Purgatory = new PlanetDefinition({name: "DIE/Purgatory", size: 2048, hills: [-0.05, 0.20]});
const Triborg = new PlanetDefinition({name: "DIE/Triborg", size: 2048, hills: [-0.01, 0.12]});

// DIE Enduur
// https://wiki.sigmadraconis.games/en/spaceengies/enduur/home
// https://steamcommunity.com/sharedfiles/filedetails/?id=2831947074
const Corpus = new PlanetDefinition({name: "DIE_Enduur/Corpus", size: 2048, hills: [-0.05, 0.2]});
const Corpus_Triborg = new PlanetDefinition({name: "DIE_Enduur/Corpus-Triborg", size: 2048, hills: [-0.03, 0.03]});
const Floe = new PlanetDefinition({name: "DIE_Enduur/Floe", size: 2048, hills: [-0.1, 0.1]});
const Greer = new PlanetDefinition({name: "DIE_Enduur/Greer", size: 2048, hills: [-0.05, 0.2]});
const Greer_Triborg = new PlanetDefinition({name: "DIE_Enduur/Greer-Triborg", size: 2048, hills: [-0.03, 0.03]});
const Voxliae = new PlanetDefinition({name: "DIE_Enduur/Voxliae", size: 2048, hills: [-0.05, 0.05]});

// Draconis Expanse
// https://wiki.sigmadraconis.games/en/spaceengies/expanse/home
// https://steamcommunity.com/sharedfiles/filedetails/?id=2661197847
const Ceres = new PlanetDefinition({name: "Expanse/Ceres", size: 2048, hills: [-0.022, 0.05]});
const Deimos = new PlanetDefinition({name: "Expanse/Deimos", size: 2048, hills: [-0.4, 0]});
const Europa_E = new PlanetDefinition({name: "Expanse/Europa_E", size: 2048, hills: [-0.03, 0.06]});
const Ganymede = new PlanetDefinition({name: "Expanse/Ganymede", size: 2048, hills: [-0.1, 0.5]});
//const Hygeia = new PlanetDefinition({name: "Expanse/Hygeia", size: 2048, hills: [-0.7, 0]}); // unused
const Io = new PlanetDefinition({name: "Expanse/Io", size: 2048, hills: [-0.05, 0.2]});
const Jupiter = new PlanetDefinition({name: "Expanse/Jupiter", size: 2048, hills: [-0.03, 0.03]});
const Mars_E = new PlanetDefinition({name: "Expanse/Mars_E", size: 2048, hills: [-0.01, 0.01]});
const Moon_E = new PlanetDefinition({name: "Expanse/Moon_E", size: 2048, hills: [-0.03, 0.03]});
const Phobos = new PlanetDefinition({name: "Expanse/Phobos", size: 2048, hills: [-0.1, 0.1]});
const Rhea = new PlanetDefinition({name: "Expanse/Rhea", size: 2048, hills: [-0.01, 0.12]});
const Saturn = new PlanetDefinition({name: "Expanse/Saturn", size: 2048, hills: [-0.03, 0.03]});
const Titan_E = new PlanetDefinition({name: "Expanse/Titan", size: 2048, hills: [-0.03, 0.03]});
//const Uranus = new PlanetDefinition({name: "Expanse/Uranus", size: 2048, hills: [-0.05, 0.2]}); // no data files
const Vesta = new PlanetDefinition({name: "Expanse/Vesta", size: 2048, hills: [0, 1]});
// Planet 26 https://steamcommunity.com/sharedfiles/filedetails/?id=2079185441
const Planet26 = new PlanetDefinition({name: "Expanse/Planet-26", size: 2048, hills: [-0.03, 0.03]});

const Planets = {
  "StarSystem: Alien": Alien.new({radius: 60000, x: 0, y: 0, z: 5600000}),
  "StarSystem: EarthLike": EarthLike.new({radius: 60000, x: -131072, y: -131072, z: -131072}),
  "StarSystem: Europa": Europa.new({radius: 9500, x: 900000, y: 0, z: 1600000}),
  "StarSystem: Mars": Mars.new({radius: 60000, x: 900000, y: 0, z: 1500000}),
  "StarSystem: Moon": Moon.new({radius: 9500, x: 0, y: 120000, z: -130000}),
  "StarSystem: Pertam": Pertam.new({radius: 30066.5, x: -4000000, y: -65000, z: -800000}),
  "StarSystem: Titan": Titan.new({radius: 9500, x: 20000, y: 210000, z: 5780000}),
  "StarSystem: Triton": Triton.new({radius: 40126.5, x: -350000, y: -2500000, z: 300000}),

  "DIE: Pelican Comet": Comet.new({radius: 9500, x: 568042.33, y: -1522069.87, z: -2777607.37}),
  "DIE: Odin": Odin.new({radius: 60000, x: -404206.12, y: -2135630.17, z: -2890260.25}),
  "DIE: Prthvi": Prthvi.new({radius: 60000, x: -1353956.52, y: -1862080.05, z: -2204718.27}),
  "DIE: Purgatory": Purgatory.new({radius: 60000, x: 199862.54, y: -2986181.56, z: -2584882.5}),
  "DIE: Triborg-Alpha": Triborg.new({radius: 9500, x: -183502.35, y: -2169922.99, z: -2771080.01}),
  "DIE: Triborg-Beta": Triborg.new({radius: 9500, x: -341249.57, y: -1992606.53, z: -2592841.46}),
  "DIE: Triborg-Gamma": Triborg.new({radius: 9500, x: -332422.71, y: -1912175, z: -2920072.99}),

  "DIE Enduur: Corpus": Corpus.new({radius: 12500, x: 418037.01, y: 418037.01, z: 413798.24}),
  "DIE Enduur: Corpus Triborg": Corpus_Triborg.new({radius: 7500, x: 532295.03, y: 532295.03, z: 421990.24}),
  "DIE Enduur: Floe": Floe.new({radius: 30000, x: -65536, y: -65536, z: -65536}),
  "DIE Enduur: Greer": Greer.new({radius: 12500, x: -469557.71, y: -431205.35, z: -446566.32}),
  "DIE Enduur: Greer Triborg": Greer_Triborg.new({radius: 7500, x: -522602.95, y: -484250.59, z: -438374.32}),
  "DIE Enduur: Voxliae": Voxliae.new({radius: 30000, x: -561474.36, y: 2170452.80, z: -1089313.76}),

  "Expanse: Ceres": Ceres.new({radius: 15750, x: -16384, y: 1982397, z: 53415}),
  "Expanse: Deimos": Deimos.new({radius: 7875, x: 1275523, y: 75523, z: 75523}),
  "Expanse: Earth": Planet26.new({radius: 105000, x: -65536, y: -414204, z: -35032}),
  "Expanse: Europa": Europa_E.new({radius: 18375, x: 538951, y: 3133081, z: -128062}),
  "Expanse: Ganymede": Ganymede.new({radius: 30625, x: -476427, y: 3124031, z: -311666}),
  "Expanse: Io": Io.new({radius: 19250, x: -237940, y: 3152026, z: 373597}),
  "Expanse: Jupiter": Jupiter.new({radius: 245000, x: -262144, y: 2937856, z: -262144}),
  "Expanse: Mars_E": Mars_E.new({radius: 78750, x: 1134464, y: -65536, z: -65536}),
  "Expanse: Moon_E": Moon_E.new({radius: 24500, x: 75992, y: -272676, z: 106496}),
  "Expanse: Phobos": Phobos.new({radius: 7000, x: 1174003, y: -25996, z: -150989}),
  "Expanse: Rhea": Rhea.new({radius: 15750, x: 210462, y: 6366519, z: 96753}),
  "Expanse: Saturn": Saturn.new({radius: 105000, x: 161310, y: 6430504, z: -65536}),
  "Expanse: Titan_E": Titan.new({radius: 17500, x: 169680, y: 6472465, z: -170932}),
  //"Expanse: Uranus": Uranus.new({radius: 140000, x: -2165814, y: 9441638, z: 381820}),
  "Expanse: Vesta": Vesta.new({radius: 10500, x: -1548239, y: 1268995, z: -51288}),
};
