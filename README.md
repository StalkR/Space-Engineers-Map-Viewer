# Space Engineers Map Viewer

The map viewer gives you an overview how planets look like, both from a terrain
perspective (where are low and high points) as well as where are the ores.
With the web interface you can also drag/zoom and click to get the GPS.

Check it out at: https://stalkr.github.io/Space-Engineers-Map-Viewer/

# How does it work?

It reads the game files and world data, in particular:
  * planet definition: min/max hills, which ores are present
  * planet height map and ores: how is the terrain, where are the ores
  * world data: where is the planet located, what's the radius

From that, it shows a flat cube map with the terrain and ores. Just with that
image you can have an idea of how the planet looks like.
With the web page, you can drag, zoom and click, and using 2D <-> 3D math
convert between a point on the map and its GPS coordinates.

It's all client side and no data is collected.

# Other applications

This approach could be used to build more powerful or just different ore
detector gameplay, to enhance the game experience.

Range: all the current mods for more powerful ore detectors are just increasing
the radius, but still using the game search function which does not scale.
With the ore data at hand, it's possible to implement this differently.

Different gameplay ideas:
  * an ore detector block per ore, with increasing construction requirements,
    requiring the player to progress through the tech tree at the same time
  * an ore detector on a display, giving you just an arrow, or a beep sound
    that only increases as you get closer to the ore
  * an ore detector that can search further, but at great cost in power and/or
    time
  * an ore detector that works one sector at a time, leaving a GPS log of what
    was found and where, on a display
  * one could go as far as eliminating ores as implemented in the game, and
    implementing them server-side only, then using special blocks of detector
    and mining to reveal and mine them; this would avoid client-side knowledge
    of all the ores, as demonstrated by this
  * etc.

# Supported maps

* Default planets from Custom Scenario > Star System
  * [Alien](https://github.com/StalkR/Space-Engineers-Map-Viewer/tree/master/maps/StarSystem/Alien.png)
  * [EarthLike](https://github.com/StalkR/Space-Engineers-Map-Viewer/tree/master/maps/StarSystem/EarthLike.png)
  * [Europa](https://github.com/StalkR/Space-Engineers-Map-Viewer/tree/master/maps/StarSystem/Europa.png)
  * [Mars](https://github.com/StalkR/Space-Engineers-Map-Viewer/tree/master/maps/StarSystem/Mars.png)
  * [Moon](https://github.com/StalkR/Space-Engineers-Map-Viewer/tree/master/maps/StarSystem/Moon.png)
  * [Pertam](https://github.com/StalkR/Space-Engineers-Map-Viewer/tree/master/maps/StarSystem/Pertam.png)
  * [Titan](https://github.com/StalkR/Space-Engineers-Map-Viewer/tree/master/maps/StarSystem/Titan.png)
  * [Triton](https://github.com/StalkR/Space-Engineers-Map-Viewer/tree/master/maps/StarSystem/Triton.png)
* Draconis Impossible Extended (DIE): with [Draconis Impossible Planets](https://steamcommunity.com/sharedfiles/filedetails/?id=2439920241)
  * [Comet](https://github.com/StalkR/Space-Engineers-Map-Viewer/tree/master/maps/DIE/Comet.png)
  * [Triborg](https://github.com/StalkR/Space-Engineers-Map-Viewer/tree/master/maps/DIE/Triborg.png)
  * [Prthvi](https://github.com/StalkR/Space-Engineers-Map-Viewer/tree/master/maps/DIE/Prthvi.png)
  * [Odin](https://github.com/StalkR/Space-Engineers-Map-Viewer/tree/master/maps/DIE/Odin.png)
  * [Purgatory](https://github.com/StalkR/Space-Engineers-Map-Viewer/tree/master/maps/DIE/Purgatory.png)
* DIE Enduur: with [SigDrac Enduur Planets](https://steamcommunity.com/sharedfiles/filedetails/?id=2831947074)
  * [Corpus](https://github.com/StalkR/Space-Engineers-Map-Viewer/tree/master/maps/DIE_Enduur/Corpus.png)
  * [Corpus Triborg](https://github.com/StalkR/Space-Engineers-Map-Viewer/tree/master/maps/DIE_Enduur/Corpus_Triborg.png)
  * [Floe](https://github.com/StalkR/Space-Engineers-Map-Viewer/tree/master/maps/DIE_Enduur/Floe.png)
  * [Greer](https://github.com/StalkR/Space-Engineers-Map-Viewer/tree/master/maps/DIE_Enduur/Greer.png)
  * [Greer Triborg](https://github.com/StalkR/Space-Engineers-Map-Viewer/tree/master/maps/DIE_Enduur/Greer_Triborg.png)
  * [Voxliae](https://github.com/StalkR/Space-Engineers-Map-Viewer/tree/master/maps/DIE_Enduur/Voxliae.png)
* Draconis Expanse: with [Expanse Planet Files](https://steamcommunity.com/sharedfiles/filedetails/?id=2661197847) and [Planet 26 2.0](https://steamcommunity.com/sharedfiles/filedetails/?id=2079185441)
  * [Ceres](https://github.com/StalkR/Space-Engineers-Map-Viewer/tree/master/maps/Expanse/Ceres.png)
  * [Deimos](https://github.com/StalkR/Space-Engineers-Map-Viewer/tree/master/maps/Expanse/Deimos.png)
  * [Europa (expanse)](https://github.com/StalkR/Space-Engineers-Map-Viewer/tree/master/maps/Expanse/Europa_E.png)
  * [Ganymede](https://github.com/StalkR/Space-Engineers-Map-Viewer/tree/master/maps/Expanse/Ganymede.png)
  * [Hygeia](https://github.com/StalkR/Space-Engineers-Map-Viewer/tree/master/maps/Expanse/Hygeia.png)
  * [Io](https://github.com/StalkR/Space-Engineers-Map-Viewer/tree/master/maps/Expanse/Io.png)
  * [Jupiter](https://github.com/StalkR/Space-Engineers-Map-Viewer/tree/master/maps/Expanse/Jupiter.png)
  * [Mars (expanse)](https://github.com/StalkR/Space-Engineers-Map-Viewer/tree/master/maps/Expanse/Mars_E.png)
  * [Moon (expanse)](https://github.com/StalkR/Space-Engineers-Map-Viewer/tree/master/maps/Expanse/Moon_E.png)
  * [Phobos](https://github.com/StalkR/Space-Engineers-Map-Viewer/tree/master/maps/Expanse/Phobos.png)
  * [Planet 26](https://github.com/StalkR/Space-Engineers-Map-Viewer/tree/master/maps/Expanse/Planet-26.png)
  * [Rhea](https://github.com/StalkR/Space-Engineers-Map-Viewer/tree/master/maps/Expanse/Rhea.png)
  * [Saturn](https://github.com/StalkR/Space-Engineers-Map-Viewer/tree/master/maps/Expanse/Saturn.png)
  * [Titan](https://github.com/StalkR/Space-Engineers-Map-Viewer/tree/master/maps/Expanse/Titan.png)
  * [Vesta](https://github.com/StalkR/Space-Engineers-Map-Viewer/tree/master/maps/Expanse/Vesta.png)

# How to add maps

1. Download mod (e.g. using [Steam Workshop Downloader](https://steamworkshopdownloader.io/))
2. Extract it (e.g. `unzip 123456_mod.zip`)
3. Run `python generate.py Data/PlanetGeneratorDefinitions.sbc`
    * it show size and min/max hills
    * it generate the images
    * the filename can be different, but the extension remains `.sbc`
4. Edit `planets.js`
    * size (e.g. `2048`) is the cube map width
    * `min_hill` and `max_hill` are from the `.sbc` file
    * `position` and `radius` depend on how your world was created, use [SEToolBox](https://github.com/mmusu3/SEToolbox/releases) to see the values
    * note `position` is the bounding box corner, not the planet center; you can use `coords.py` to convert

# Bugs, feature requests, questions

Create a [new issue](https://github.com/StalkR/Space-Engineers-Map-Viewer/issues/new).
