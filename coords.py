#!/usr/bin/python
# Convert planet map coordinates to GPS and back.
# Note: planet position is its bounding box corner, not the center.

from lxml import etree
import math
import os
from PIL import Image
import sys

if len(sys.argv) < 6:
  print("Usage: %s <PlanetGeneratorDefinitions.sbc> <Planet name> <Planet position: X Y Z> <Radius> <Point on cubemap (X Y) or GPS (X Y Z)> [<planet position is center>]" % sys.argv[0])
  raise SystemExit

definition_filename = sys.argv[1]
planet = sys.argv[2]
planet_position = tuple(map(float, sys.argv[3].split(" ")))
planet_radius = int(sys.argv[4])
arg = tuple(map(float, sys.argv[5].split(" ")))
assert len(arg) in [2, 3], "invalid point (X Y) or GPS (X Y Z)"


# 2D point on a Cartesian pixel coordinate system with (0,0)
# in the upper left corner, x to the right and y down
CUBE = {
  "up": (0, 0),
  "front": (0, 1),
  "right": (1, 1),
  "back": (2, 1),
  "down": (2, 2),
  "left": (3, 1),
}

data_dir = os.path.join(os.path.dirname(definition_filename), "PlanetDataFiles", planet)
with Image.open(os.path.join(data_dir, "up.png")) as im:
  x, y = im.size
  assert x == y
  size = x

tree = etree.parse(definition_filename)
planets = [p.text for p in tree.xpath("//Definitions/Definition/Id/SubtypeId")]
planets += [p.text for p in tree.xpath("//Definitions/PlanetGeneratorDefinitions/PlanetGeneratorDefinition/Id/SubtypeId")]
assert planet in planets, "planets: %s" % (planets)
hillparams = tree.xpath("//Definitions/Definition[Id/SubtypeId='%s']/HillParams" % planet)
if not hillparams:
  hillparams = tree.xpath("//Definitions/PlanetGeneratorDefinitions/PlanetGeneratorDefinition[Id/SubtypeId='%s']/HillParams" % planet)
planet_min_hill = float(hillparams[0].attrib["Min"])
planet_max_hill = float(hillparams[0].attrib["Max"])


def planet_center(position, radius, max_hill):
  # planet bounding box is the smallest power of 2 larger than the maximum
  # diameter including hills
  max_hill_radius = radius * (1 + max_hill)
  size = 1
  while True:
    size *= 2
    if size > 2 * max_hill_radius:
      break
  x, y, z = position
  r = size/2
  return x+r, y+r, z+r

def planet_position_from_center(center, radius, max_hill):
  # planet bounding box is the smallest power of 2 larger than the maximum
  # diameter including hills
  max_hill_radius = radius * (1 + max_hill)
  size = 1
  while True:
    size *= 2
    if size > 2 * max_hill_radius:
      break
  x, y, z = center
  r = size/2
  return x-r, y-r, z-r


if len(sys.argv) == 7:
  print("[+] provided planet position is the center")
  center = planet_position
  planet_position = planet_position_from_center(center, planet_radius, planet_max_hill)
else:
  print("[+] provided planet position is the bounding box corner")
  center = planet_center(planet_position, planet_radius, planet_max_hill)


def map_point_to_cube_face(point2D, size):
  x, y = point2D
  for face, (a, b) in CUBE.items():
    a, b = x - a*size, y - b*size
    if 0 <= a < size and 0 <= b < size:
      return (face, (a, b))
  raise AssertionError("map point outside of any cube face")

def cubemap_2D_to_3D(face, x, y, r):
  # which cube face maps to which axis and direction
  # a custom planet with a labeled heightmap helps to visualize it
  #             _______ 
  #            /      /|  back
  #           /  up  / |               y
  #          /______/  |               ^   z
  #  left -> |      | <---- right      |  /
  #          | front| /                | /
  #          |______|/          x <----+/
  #             down

  # translate from [0, 2r] to [-r, r]
  x, y = x - r, y - r
  # then rotate
  return {
    "left":  ( r, -y, -x),
    "right": (-r, -y,  x),
    "up":    (-x,  r, -y),
    "down":  ( x, -r, -y),
    "back":  ( x, -y,  r),
    "front": (-x, -y, -r),
  }[face]

def cubemap_3D_to_2D(face, x, y, z, r):
  # rotate
  x, y = {
    "left":  (-z, -y),
    "right": (-z,  y),
    "up":    (-x, -z),
    "down":  (-x,  z),
    "back":  ( x, -y),
    "front": ( x,  y),
  }[face]
  # then translate from [-r, r] to [0, 2r]
  return round(x + r), round(y + r)

def cube_face_to_space(face, point2D, size):
  x, y = point2D
  r = size/2

  # let origin be the center of the cube of size, i.e. from -r to r
  # we can translate and resize to actual world coordinates after
  a, b, c = cubemap_2D_to_3D(face, x, y, r)

  # we want to know where it intersects with the sphere of radius r
  # we just need to resize the vector: u = r * v / |v|
  length = math.sqrt(a**2 + b**2 + c**2)
  return r*a/length, r*b/length, r*c/length

def altitude_at(face, point):
  with Image.open(os.path.join(data_dir, "%s.png" % face)) as im:
    heightmap = im.load()
    min_hill = planet_radius * (1 + planet_min_hill)
    max_hill = planet_radius * (1 + planet_max_hill)
    return min_hill + heightmap[point] * (max_hill - min_hill) / 2**16

def space_to_world(point3D, altitude):
  x, y, z = point3D
  a, b, c = center

  # expand vector to the desired altitude
  length = math.sqrt(x**2 + y**2 + z**2)
  x, y, z = altitude*x/length, altitude*y/length, altitude*z/length

  # translate to world center
  return x+a, y+b, z+c

def point_to_world(point):
  face, point2D = map_point_to_cube_face(point, size)
  point3D = cube_face_to_space(face, point2D, size)
  altitude = altitude_at(face, point2D)
  return space_to_world(point3D, altitude)


def find_face(vector3D, r):
  # cube of size L, i.e. from -L to L centered on origin
  # vector from origin, we want to find which face and coordinates it intersects
  # each face is on a fixed x, y or z plane
  # we grow the vector until its x, y or z hits the plane
  # then we check if the point is within face boundaries

  x, y, z = vector3D
  length = math.sqrt(x**2 + y**2 + z**2)

  faces = {}
  if x != 0:
    L = r*length/x
    faces["left"] = r, L*y/length, L*z/length
    faces["right"] = -r, L*y/length, L*z/length
  if y != 0:
    L = r*length/y
    faces["up"] = L*x/length, r, L*z/length
    faces["down"] = L*x/length, -r, L*z/length
  if z != 0:
    L = r*length/z
    faces["back"] = L*x/length, L*y/length, r
    faces["front"] = L*x/length, L*y/length, -r

  for face, (a, b, c) in faces.items():
    # dot product is positive if two vectors have same direction
    if -r <= a <= r and -r <= b <= r and -r <= c <= r and a*x + b*y + c*z >= 0:
      return face, cubemap_3D_to_2D(face, a, b, c, r)

  raise AssertionError("invalid GPS")

def world_to_point(point3D):
  a, b, c = center
  x, y, z = point3D
  face, (x, y) = find_face((x - a, y - b, z - c), size/2)

  assert 0 <= x < size and 0 <= y < size, "face %s [%i, %i] is invalid" % (face, x, y)

  # then we can convert easily to the cubemap
  a, b = CUBE[face]
  return x + a*size, y + b*size


# planet position (bounding box corner) and center
print("GPS:%s position:%f:%f:%f:#FF0000FF:" % (planet, *planet_position))
print("GPS:%s center:%f:%f:%f:#FFFF00FF:" % (planet, *center))

# test points to visualize cubemap faces and orientation, and verify roundtrip point-gps-point
for face, (a, b) in CUBE.items():
  p = a*size + 512, b*size + 512
  gps = point_to_world(p)
  print("[%i, %i] -> GPS:%s (face %s, top-left):%f:%f:%f:#FFFF0000:" % (*p, planet, face, *gps))
  assert world_to_point(gps) == p
  p = a*size + 1024, b*size + 1024
  gps = point_to_world(p)
  print("[%i, %i] -> GPS:%s (face %s):%f:%f:%f:#FFFF0000:" % (*p, planet, face, *gps))
  assert world_to_point(gps) == p

if len(arg) == 2:
  gps = point_to_world(arg)
  print("GPS:%s point:%f:%f:%f:#FF0000FF:" % (planet, *gps))
  assert world_to_point(gps) == arg
  raise SystemExit

print("GPS is at [%i, %i]" % world_to_point(arg))
