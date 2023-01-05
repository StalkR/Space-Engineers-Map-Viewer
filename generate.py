#!/usr/bin/env python3
# Create a height and materials map of a planet.
# Generates 2 images:
# - map: heightmap + ores + legend
# - diff: heightmap at the ores locations
# Map viewer uses the first image for rendering, processing a single image is
# faster than pasting multiple layers.
# Unfortunately, at the locations where there is ore it means the map does not
# contain height map data anymore, so the diff map gives it back.

from lxml import etree
import numpy
import os
from PIL import Image
from PIL import ImageFont
from PIL import ImageDraw
import sys


black = (0, 0, 0)
white = (255, 255, 255)
red = (255, 0, 0)
lime = (0, 255, 0)
blue = (0, 0, 255)
yellow = (255, 255, 0)
yellow2 = (255, 255, 1)
cyan = (0, 255, 255)
magenta = (255, 0, 255)
maroon = (128, 0, 0)
olive = (128, 128, 0)
green = (0, 128, 0)
purple = (128, 0, 128)
teal = (0, 128, 128)
navy = (0, 0, 128)
orange = (255, 165, 0)
darkgreen = (0, 100, 0)

ores_colors = {
  "Iron": red,
  "Silicon": lime,
  "Cobalt": blue,
  "Nickel": yellow,
  "Magnesium": cyan,
  "Silver": magenta,
  "Ice": teal,
  "Gold": purple,
  "Platinum": maroon,
  "Uranium": green,

  # Expanse ores
  "Copper": orange,
  "Lead": navy,
  "Nickle": yellow2,
  "Titanium": darkgreen,
  "Tungsten": olive,
  "Uraninite": green,

  # DIE: Enduur ores
  "Vox": orange,
}

texture_position = {
  "up": (0, 0),
  "front": (0, 1),
  "right": (1, 1),
  "back": (2, 1),
  "down": (2, 2),
  "left": (3, 1),
}


if len(sys.argv) == 1:
  print("Usage: %s <PlanetGeneratorDefinitions.sbc> <planet name>" % sys.argv[0])
  raise SystemExit

definition_filename = sys.argv[1]

tree = etree.parse(definition_filename)
planets = [p.text for p in tree.xpath("//Definitions/Definition/Id/SubtypeId")]
planets += [p.text for p in tree.xpath("//Definitions/PlanetGeneratorDefinitions/PlanetGeneratorDefinition/Id/SubtypeId")]

if len(sys.argv) == 2:
  print("Planets: %s" % " ".join(planets))
  raise SystemExit

planet = sys.argv[2]
assert planet in planets

print("[*] generating files for: %s" % planet)

hillparams = tree.xpath("//Definitions/Definition[Id/SubtypeId='%s']/HillParams" % planet)
if not hillparams:
  hillparams = tree.xpath("//Definitions/PlanetGeneratorDefinitions/PlanetGeneratorDefinition[Id/SubtypeId='%s']/HillParams" % planet)
planet_min_hill = float(hillparams[0].attrib["Min"])
planet_max_hill = float(hillparams[0].attrib["Max"])

data_dir = os.path.join(os.path.dirname(definition_filename), "PlanetDataFiles", planet)

with Image.open(os.path.join(data_dir, "up.png")) as im:
  x, y = im.size
  assert x == y
  size = x
print("[*] tiles are %ix%i" % (size, size))
for k, v in texture_position.items():
  x, y = v 
  texture_position[k] = x * size, y * size

print("[*] planet definition: {name: %r, size: %i, hills: [%f, %f]}" % (planet, size, planet_min_hill, planet_max_hill))

ore_mappings = tree.xpath("//Definitions/Definition[Id/SubtypeId='%s']/OreMappings/Ore" % planet)
ore_mappings += tree.xpath("//Definitions/PlanetGeneratorDefinitions/PlanetGeneratorDefinition[Id/SubtypeId='%s']/OreMappings/Ore" % planet)

ores = {}
for ore in ore_mappings:
  # ore.attrib: Type, Value, Start, Depth
  name = ore.attrib["Type"].split("_")[0]  # Nickel_01, Iron_02 -> Nickel, Iron
  if name not in ores:
    ores[name] = []
  ores[name].append(int(ore.attrib["Value"], 10))
  assert name in ores_colors, "ore %s does not have a color assigned" % name
print("[*] ores on %s: %s" % (planet, ", ".join(ores.keys())))


print("[*] creating map for %s" % planet)
img = Image.new("RGB", (size * 4, size * 3), color=white)
imgdiff = Image.new("RGB", (size * 4, size * 3), color=white)

for k in sorted(texture_position.keys()):
  print("[*] copying heightmap tile %s" % k)
  x, y = texture_position[k]
  with Image.open(os.path.join(data_dir, "%s.png" % k)) as im:
    # convert from 16 to 8-bit, via numpy is faster
    with Image.fromarray(numpy.uint8(numpy.asarray(im) / 256)) as grey:
      img.paste(grey, (x, y))


print("[*] adding ores, keeping diff")
pix = img.load()
pixdiff = imgdiff.load()
for k in sorted(texture_position.keys()):
  x, y = texture_position[k]
  filename = os.path.join(data_dir, "%s_mat.png" % k)
  if not os.path.exists(filename):
    print("[-] no ores for tile %s" % k)
    continue
  print("[*] finding ores in tile %s" % k)
  with Image.open(filename) as im:
    assert im.size == (size, size)
    mat = im.load()
    for i in range(size):
      for j in range(size):
        for ore, values in ores.items():
          if len(mat[i, j]) == 3:
            r, g, b = mat[i, j]
          else:
            r, g, b, a = mat[i, j]
            if a != 255:
              print("tile %s at [%i, %i] is %s" % (k, i, j, repr(mat[i, j])))
          if b in values:
            pixdiff[x+i, y+j] = pix[x+i, y+j]
            pix[x+i, y+j] = ores_colors[ore]


print("[*] adding legend")
fonts_paths = [
  "/usr/share/fonts/microsoft/arial.ttf",
  "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
]
fonts = [f for f in fonts_paths if os.path.exists(f)]
assert len(fonts) > 0
font = fonts[0]
font100 = ImageFont.truetype(font, 100)
font200 = ImageFont.truetype(font, 200)

draw = ImageDraw.Draw(img)

margin = 200
x, y = margin, 2 * size + margin
draw.text((x, y), planet, fill=black, font=font200)
y += 300

line_height = 150
for ore in sorted(ores.keys()):
  offset, length = 20, 70
  square = (x, y + offset, x + length, y + offset + length)
  draw.rectangle(square, fill=ores_colors[ore])
  draw.text((x + 100, y), ore, fill=black, font=font100)
  y += line_height

draw.text((x, y), "low", fill=black, font=font100)
draw.text((x + 256*4 - 180, y), "high", fill=black, font=font100)
y += line_height

for i in range(255):
  grayscale = (i, i, i)
  draw.line((x + 4*i, y, x + 4*i, y + 200), fill=grayscale, width=4)

x, y = size + margin, size/2
draw.text((x, y), "South", fill=black, font=font100)

x, y = 3 * size + margin, 2 * size + size/2
draw.text((x, y), "North", fill=black, font=font100)

print("[*] saving images")
img.save("%s.png" % planet)
imgdiff.save("%s_diff.png" % planet)
