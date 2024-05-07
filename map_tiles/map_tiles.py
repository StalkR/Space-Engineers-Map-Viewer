#!/usr/bin/env python3
# Work with tiles: join, blur edges, split.

from PIL import Image
import sys

# o-x->  (x, y) as per the arrows
# y      rotation in degrees, counterclockise
# v      tile order is top to bottom, left to right
TILES = {
  'up': {
    'back':  {'x': 1, 'y': 0, 'r': 180},
    'left':  {'x': 0, 'y': 1, 'r': -90},
    'up':    {'x': 1, 'y': 1, 'r':   0},
    'right': {'x': 2, 'y': 1, 'r':  90},
    'front': {'x': 1, 'y': 2, 'r':   0},
  },
  'front': {
    'up':    {'x': 1, 'y': 0, 'r':   0},
    'left':  {'x': 0, 'y': 1, 'r':   0},
    'front': {'x': 1, 'y': 1, 'r':   0},
    'right': {'x': 2, 'y': 1, 'r':   0},
    'down':  {'x': 1, 'y': 2, 'r': 180},
  },
  'right': {
    'up':    {'x': 1, 'y': 0, 'r': -90},
    'front': {'x': 0, 'y': 1, 'r':   0},
    'right': {'x': 1, 'y': 1, 'r':   0},
    'back':  {'x': 2, 'y': 1, 'r':   0},
    'down':  {'x': 1, 'y': 2, 'r': -90},
  },
  'back': {
    'up':    {'x': 1, 'y': 0, 'r': 180},
    'right': {'x': 0, 'y': 1, 'r':   0},
    'back':  {'x': 1, 'y': 1, 'r':   0},
    'left':  {'x': 2, 'y': 1, 'r':   0},
    'down':  {'x': 1, 'y': 2, 'r':   0},
  },
  'left': {
    'up':    {'x': 1, 'y': 0, 'r':  90},
    'back':  {'x': 0, 'y': 1, 'r':   0},
    'left':  {'x': 1, 'y': 1, 'r':   0},
    'front': {'x': 2, 'y': 1, 'r':   0},
    'down':  {'x': 1, 'y': 2, 'r':  90},
  },
  'down': {
    'back':  {'x': 1, 'y': 0, 'r':   0},
    'right': {'x': 0, 'y': 1, 'r':  90},
    'down':  {'x': 1, 'y': 1, 'r':   0},
    'left':  {'x': 2, 'y': 1, 'r': -90},
    'front': {'x': 1, 'y': 2, 'r': 180},
  },
}

CORNERS = {
  'top-left':     {'x': lambda x:     x, 'y': lambda y:     y},
  'top-right':    {'x': lambda x: 2*x-1, 'y': lambda y:     y},
  'bottom-left':  {'x': lambda x:     x, 'y': lambda y: 2*y-1},
  'bottom-right': {'x': lambda x: 2*x-1, 'y': lambda y: 2*y-1},
}

EDGES = {
  'top':    {'s':    CORNERS['top-left'], 'x': 1, 'y': 0},
  'left':   {'s':    CORNERS['top-left'], 'x': 0, 'y': 1},
  'right':  {'s':   CORNERS['top-right'], 'x': 0, 'y': 1},
  'bottom': {'s': CORNERS['bottom-left'], 'x': 1, 'y': 0},
}

EDGE_SIZE = 20

def size_and_mode():
  with Image.open('up.png') as im:
    w, h = im.size
    assert w == h
    print('[*] tiles are %ix%i of mode %s' % (w, w, im.mode))
    return w, im.mode

def join():
  size, mode = size_and_mode()
  for center_tile, placement in TILES.items():
    join_tile(center_tile, placement, size, mode)

def join_tile(center_tile, placement, size, mode):
  print('[*] join tile %s' % center_tile)
  with Image.new(mode, (size * 3, size * 3)) as dst:
    for tile, v in placement.items():
      print('  [*] copying tile %s' % tile)
      x, y, r = v['x'], v['y'], v['r']
      with Image.open('%s.png' % tile) as src:
        dst.paste(src.rotate(r), (x*size, y*size))
    dst.save('%s_joined.png' % center_tile)

def split():
  size, mode = size_and_mode()
  for center_tile, placement in TILES.items():
    split_tile(center_tile, placement, size, mode)

def split_tile(center_tile, placement, size, mode):
  print('[*] splitting tile %s' % center_tile)
  v = placement[center_tile]
  x, y, r = v['x'], v['y'], v['r']
  with Image.new(mode, (size, size)) as dst:
    with Image.open('%s_joined.png' % center_tile) as src:
      dst.paste(src.crop((x*size, y*size, (x+1)*size, (y+1)*size)).rotate(-r))
    dst.save('%s.png' % center_tile)

def blur_edges():
  size, mode = size_and_mode()
  for center_tile in TILES:
    blur_tile(center_tile, size, mode)

def blur_tile(center_tile, size, mode):
  print('[*] blurring tile %s' % center_tile)
  with Image.open('%s_joined.png' % center_tile) as src:
    org = src.load()
    with Image.open('%s_joined.png' % center_tile) as dst:
      pix = dst.load()
      for edge, v in EDGES.items():
        print('  [*] blurring %s' % edge)
        sx, sy, dx, dy = v['s']['x'](size), v['s']['y'](size), v['x'], v['y']
        for i in range(size):
          blur(org, pix, sx+i*dx, sy+i*dy, dy, dx)  # perpendicular blur
    dst.save('%s_joined.png' % center_tile)

def blur(org, pix, x, y, dx, dy):
  avg = sum(org[x+i*dx, y+i*dy] for i in range(-EDGE_SIZE, EDGE_SIZE))/EDGE_SIZE/2
  for i in range(-EDGE_SIZE, EDGE_SIZE):
    pix[x+i*dx, y+i*dy] = int((org[x+i*dx, y+i*dy]*abs(i) + avg*(EDGE_SIZE-abs(i)))/EDGE_SIZE)

def main():
  arg = sys.argv[1] if len(sys.argv) == 2 else ''
  if arg == 'join': join()
  elif arg == 'blur_edges': blur_edges()
  elif arg == 'split': split()
  else:
    print('Usage: %s <join|blur_edges|split>' % sys.argv[0])
    raise SystemExit


if __name__ == '__main__':
  main()
