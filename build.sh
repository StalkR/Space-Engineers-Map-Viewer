#!/bin/bash
# Rebuild maps images

rm -f maps/*/*.png

pushd maps/DIE
for p in Comet Triborg Prthvi Odin Purgatory; do
  python3 "../../generate.py" "../../../../Workshop/Mods/2439920241_draconis_impossible_planets/Data/PlanetGeneratorDefinitions.sbc" "$p" || exit 1
done
popd

pushd maps/DIE_Enduur
for p in Corpus Corpus-Triborg Floe Greer Greer-Triborg Voxliae; do
  python3 "../../generate.py" "../../../DIE-DraconisCode/\!Mods/DraconisDIE_Planets/Data/DIEPlanets_PlanetGeneratorDefinitions.sbc" "$p" || exit 1
done
popd

pushd maps/Expanse
for p in Ceres Deimos Europa_E Ganymede Hygeia Io Jupiter Mars_E Moon_E Phobos Rhea Saturn Titan Vesta; do
  python3 "../../generate.py" "../../../../Workshop/Mods/2661197847_expanse_planet_files/Data/$p.sbc" "$p" || exit 1
done
python3 "../../generate.py" "../../../../Workshop/Mods/2079185441_planet_26_2_0/Data/Planet262.0.sbc" "Planet-26" || exit 1
popd

pushd maps/StarSystem
for f in Alien EarthLike Europa Mars Moon Titan; do
  python3 "../../generate.py" "../../../../Game/Install/Content/Data/PlanetGeneratorDefinitions.sbc" "$p" || exit 1
done
for p in Pertam Triton; do
  python3 "../../generate.py" "../../../../Game/Install/Content/Data/$p.sbc" "$p" || exit 1
done
