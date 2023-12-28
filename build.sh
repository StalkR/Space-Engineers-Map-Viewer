#!/bin/bash
# Rebuild maps images
# Create junctions:
# mklink /J "DIE" "<path to DIE planets folder>"
# mklink /J "SE" "<path to Space Engineers folder>"

rm -f maps/*/*.png

pushd maps/DIE
python3 '../../generate.py' '../../DIE/Data/Caldera.sbc' 'Caldera' || exit 1
python3 '../../generate.py' '../../DIE/Data/Planet_Qun.sbc' 'Corpus' || exit 1
python3 '../../generate.py' '../../DIE/Data/Greer-P-3549.sbc' 'Greer' || exit 1
python3 '../../generate.py' '../../DIE/Data/Planet_Kimi.sbc' 'Kimi' || exit 1
python3 '../../generate.py' '../../DIE/Data/PlanetGeneratorDefinitions_Mora.sbc' 'Mora' || exit 1
python3 '../../generate.py' '../../DIE/Data/Ryke_PlanetGeneratorDefinitions.sbc' 'Ryke117' || exit 1
python3 '../../generate.py' '../../DIE/Data/Planet_Tohil.sbc' 'Tohil' || exit 1
popd

pushd maps/StarSystem
for p in Alien EarthLike Europa Mars Moon Titan; do
  python3 '../../generate.py' '../../SE/Content/Data/PlanetGeneratorDefinitions.sbc' "$p" || exit 1
done
for p in Pertam Triton; do
  python3 '../../generate.py' "../../SE/Content/Data/$p.sbc" "$p" || exit 1
done
