class PlanetDefinition {
  constructor(args) {
    this.name = args.name;
    this.size = args.size;
    this.min_hill = args.hills[0];
    this.max_hill = args.hills[1];
  }
  new(args) {
    return new Planet({
      map_src: "maps/"+this.name+".png",
      diff_src: "maps/"+this.name+"_diff.png",
      size: this.size,
      min_hill: this.min_hill,
      max_hill: this.max_hill,
      position: {x: args.x, y: args.y, z: args.z},
      radius: args.radius,
    })
  }
}

class Planet {
  // how each face of the cube is layed flat onto the map
  static CUBEMAP = {
    "up": {x: 0, y: 0},
    "front": {x: 0, y: 1},
    "right": {x: 1, y: 1},
    "back": {x: 2, y: 1},
    "down": {x: 2, y: 2},
    "left": {x: 3, y: 1},
  };

  static ORES = {
    "Iron": [255, 0, 0],
    "Silicon": [0, 255, 0],
    "Cobalt": [0, 0, 255],
    "Nickel": [255, 255, 0],
    "Magnesium": [0, 255, 255],
    "Silver": [255, 0, 255],
    "Ice": [0, 128, 128],
    "Gold": [128, 0, 128],
    "Platinum": [128, 0, 0],
    "Uranium": [0, 128, 0],
  }

  constructor(args) {
    this.size = args.size;
    this.position = args.position;
    this.radius = args.radius;
    this.min_hill_radius = this.radius * (1 + args.min_hill);
    this.max_hill_radius = this.radius * (1 + args.max_hill);
    this.center = Planet.Center(this.position, this.max_hill_radius);
    this.map_src = args.map_src;
    this.diff_src = args.diff_src;
    this.loaded = false;
  }

  async load() {
    this.map = await this._load_img_ctx(this.map_src);
    this.diff = await this._load_img_ctx(this.diff_src);
  }

  async _load_img_ctx(src) {
    const img = await this._load_img(src);
    const canvas = new OffscreenCanvas(img.width, img.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    return {img: img, ctx: ctx};
  }

  _load_img(src) {
    return new Promise(resolve => {
      const img = new Image(this.size * 4, this.size * 3);
      img.src = src;
      img.onload = () => resolve(img);
      img.onerror = () => resolve(undefined);
    });
  }

  static Center(position, max_hill_radius) {
    // planet bounding box is the smallest power of 2 larger than the maximum
    // diameter including hills
    let box = 1;
    while (true) {
      box *= 2;
      if (box > 2 * max_hill_radius) {
        break;
      }
      if (box == Infinity) throw("invalid args");
    }
    return {
      x: position.x + box/2,
      y: position.y + box/2,
      z: position.z + box/2,
    }
  }

  point_to_world(px, py) {
    let face = "";
    let x = 0;
    let y = 0;
    for (const [f, v] of Object.entries(Planet.CUBEMAP)) {
      const a = px - v.x*this.size;
      const b = py - v.y*this.size;
      if (0 <= a && a < this.size && 0 <= b && b < this.size) {
        face = f;
        x = a;
        y = b;
        break;
      }
    }
    if (!face) return undefined;

    // We lost a bit of altitude precision: RGB 8-bit vs. grayscale 16-bit.
    // We made an RGB for the ores, we could make a separate heightmap but that
    // would be heavy, that's why we made a diff map (also RGB).
    // Since we would mostly care about precise altitude where ores are, we
    // could make the diff map 16-bit grayscale, unfortunately the browser
    // loads everything as RGB anyway. We could work around this by writing our
    // own PNG parser and load the file data directly, but as this point we
    // also don't specifically need to use PNG, we could use anything.
    // In the end, the complexity isn't worth the additional altitude precision.
    const height_bits = 8;
    let height = this.map.ctx.getImageData(px, py, 1, 1).data[0];
    if (this.ore(pixel)) {
      height = this.diff.ctx.getImageData(px, py, 1, 1).data[0];
    }
    const altitude = this.min_hill_radius + height * (this.max_hill_radius - this.min_hill_radius) / (2 ** height_bits);

    // let origin be the center of the cube of size, i.e. from -r to r
    // we can translate and resize to actual world coordinates after
    const r = this.size/2;

    // which cube face maps to which axis and direction
    // a custom planet with a labeled heightmap helps to visualize it
    //             _______ 
    //            /      /|  back
    //           /  up  / |               y
    //          /______/  |               ^   z
    //  left -> |      | <---- right      |  /
    //          | front| /                | /
    //          |______|/          x <----+/
    //             down

    // translate from [0, 2r] to [-r, r]
    const p = {x: x - r, y: y - r};

    // then rotate
    const v = {
      "left":  {x:    r, y: -p.y, z: -p.x},
      "right": {x:   -r, y: -p.y, z:  p.x},
      "up":    {x: -p.x, y:    r, z: -p.y},
      "down":  {x:  p.x, y:   -r, z: -p.y},
      "back":  {x:  p.x, y: -p.y, z:    r},
      "front": {x: -p.x, y: -p.y, z:   -r},
    }[face];

    // expand vector to the desired altitude, then translate to world center
    const length = Math.sqrt(v.x**2 + v.y**2 + v.z**2);
    return {
      x: altitude * v.x / length + this.center.x,
      y: altitude * v.y / length + this.center.y,
      z: altitude * v.z / length + this.center.z,
    };
  }

  world_to_point(x, y, z) {
    const v = this._find_face(x - this.center.x, y - this.center.y, z - this.center.z);
    if (!(0 <= v.x && v.x < this.size && 0 <= v.y && v.y < this.size)) {
      return undefined;
    }
    const c = Planet.CUBEMAP[v.face];
    return {x: Math.floor(v.x + c.x*this.size),
            y: Math.floor(v.y + c.y*this.size)};
  }

  _find_face(x, y, z) {
    const r = this.size/2;

    // cube of size L, i.e. from -L to L centered on origin
    // vector from origin, we want to find which face and coordinates it intersects
    // each face is on a fixed x, y or z plane
    // we grow the vector until its x, y or z hits the plane
    // then we check if the point is within face boundaries

    const length = Math.sqrt(x**2 + y**2 + z**2);
    const faces = {};
    if (x != 0) {
      const L = r*length/x;
      faces["left"] = {x: r, y: L*y/length, z: L*z/length};
      faces["right"] = {x: -r, y: L*y/length, z: L*z/length};
    }
    if (y != 0) {
      const L = r*length/y;
      faces["up"] = {x: L*x/length, y: r, z: L*z/length};
      faces["down"] = {x: L*x/length, y: -r, z: L*z/length};
    }
    if (z != 0) {
      const L = r*length/z
      faces["back"] = {x: L*x/length, y: L*y/length, z: r};
      faces["front"] = {x: L*x/length, y: L*y/length, z: -r};
    }

    for (const [face, v] of Object.entries(faces)) {
      // dot product is positive if two vectors have same direction
      if (-r <= v.x && v.x <= r &&
          -r <= v.y && v.y <= r &&
          -r <= v.z && v.z <= r &&
          v.x*x + v.y*y + v.z*z >= 0) {
        const p = this._cubemap_3D_to_2D(face, v.x, v.y, v.z, r);
        return {face: face, x: p.x, y: p.y};
      }
    }

    return undefined;
  }

  _cubemap_3D_to_2D(face, x, y, z, r) {
    // rotate
    const v = {
      "left":  {x: -z, y: -y},
      "right": {x: -z, y:  y},
      "up":    {x: -x, y: -z},
      "down":  {x: -x, y:  z},
      "back":  {x:  x, y: -y},
      "front": {x:  x, y:  y},
    }[face]
    // then translate from [-r, r] to [0, 2r]
    return {x: v.x + r, y: v.y + r}
  }

  ore(pixel) {
    for (const [ore, color] of Object.entries(Planet.ORES)) {
      if (color[0] == pixel[0] && color[1] == pixel[1] && color[2] == pixel[2]) {
        return ore;
      }
    }
    return "";
  }
};
