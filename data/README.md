---
title: Data File Formats
author: Christopher York
date: November 15, 2016
---


# Files to drive data visualisation

- **narrative.md**.  Slides to display (Markdown)
- **regions_topo.json**.  Region boundaries (TopoJSON)
- **110m.json**.  Country boundaries from [Natural Earth](https://github.com/topojson/world-atlas) (TopoJSON)


# Format: **regions.csv**

*One line per region in the shapefile*

- **geoid_r**. Region id in regions_topo.json (only for 1-1780, empty otherwise)
- **GDPpc_rIp**.  Region's GDP per capita, 2005 (interpolated)
- **educ_rIp**. Average years of education for region, 2005 (interpolated)
- **pop_rIp**.  Region population, 2005 (interpolated)
- **popd_rIp**.  Population density of region, 2005 (interpolated)
- **allpat**.  Number of patents in 2005


# Format: **results.csv**

**It is unclear whether drilling down to specific regions will be useful.  An alternative approach is to aggregate by continent/technology pairs.  In this case, put the continent name in the region column, and leave the region id empty.**

*One line per technology/region pair, with the following columns*

- **cat**. Technology category + use "All" for stats over all technologies
- **region**.  Region name or continent name + use "All" for stats over entire world
- **geoid_r**.  Region ID if it has one; empty otherwise (e.g. for a continent)
- **t-10**. Estimated change at T-10 years
- **t-9**. ... at T-9 years
- **etc, etc**
- **t+0**
- **t+1**
- **etc, etc**
- **t+10**.  ...
- **t-10_chg**. Error at T-10 years
- **t-8_err**.
- **etc, etc**
