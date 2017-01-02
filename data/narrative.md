---
title: Do Foreign Direct Investments Help Cities Innovate?
author: Arnaud Dyevre
date: November 30, 2016
---


# Intro

::: visualisation globe
  rotate: [0, -20]
  scale: .7
  autorotate: true
:::


# DV INFO: Markdown narrative

::: visualisation globe
  rotate: [0, -20]
  scale: .7
  autorotate: true
:::

This narrative is written in [Markdown](https://daringfireball.net/projects/markdown/).

The link reference above could also be written with a superscript, like this: [42].

When you use a superscript, a popup citation will appear before navigating to the link.

Examples of the DV control markup is in the next few sections.

[42]: https://daringfireball.net/projects/markdown/ "Official Markdown Documentation"

(CY 16/12)


# DV INFO: Choropleths

::: visualisation globe
  rotate: [2.3522, -48.8566]
  scale: 1
  choropleth: GDPpcRegion_r_ip
  label: Regional Gross Domestic Product Per Capita, in USD
  format: '.2s'
  colors: schemeBlues-7
  autorotate: false
:::

Users can rotate the globe on any slide by clicking and dragging.  To zoom, use the (+) and (-) buttons.

Choropleth colors: you can use any scheme [here](https://github.com/d3/d3-scale-chromatic).  The digit indicates how many quantiles to display.

Label formats: use a format specifier [here](https://github.com/d3/d3-format/blob/master/README.md)

'autorotate': set to true or false to control whether the globe spins.

(CY 16/12)


# DV INFO: Flow maps

::: visualisation globe
  rotate: [78.3522, -48.8566]
  scale: 2
  flows: Advanced economies
  flow-weight: investment_mm
:::

Flow maps show the relative weight of links via opacity.


# DV INFO: Flow maps (2)

::: visualisation globe
  rotate: [78.3522, -48.8566]
  scale: 2
  flows: Advanced economies|United States
  flow-weight: investment_mm
:::

You can show links from several groups using a vertical bar, like this:
```
flows: Advanced economies|United States
```

# Why do multinational firms invest abroad?


#

::: visualisation globe
  rotate: [2.3522, -48.8566]
  scale: 1
  autorotate: false
:::

Big, internationalised firms are investing large amounts of money abroad: a textile company may want to build a production plant where labour is cheap, or a tech company may want to set up a research centre where there is an abundance of qualified engineers.

#
::: visualisation globe
  rotate: [2.3522, -48.8566]
  scale: 1
  autorotate: false
  flows: World
  flow-weight: investment_mm
:::

These investments are called Foreign Direct Investments (FDIs) and In 2015 they amounted to 1.8 trillion US dollars [1]. or the equivalent of Italy’s Gross Domestic Product [2].

The most important investments are shown on the globe.

[1]: http://unctad.org/en/pages/PublicationWebflyer.aspx?publicationid=1555 "UNCTAD 2016"

[2]: https://www.imf.org/external/pubs/ft/weo/2016/01/weodata/download.aspx "GDP estimates in 2016, IMF World Economic Outlook Database"

#

::: visualisation globe
  rotate: [9, -50]
  scale: 1
  autorotate: false
  flows: Advanced economies
  flow-weight: investment_mm
:::

Almost two thirds of these investments came from developed economies, with Europe being the largest investing region ($576 billions).

#

::: visualisation globe
  rotate: [78.3522, -48.8566]
  scale: 1
  flows: United States
  flow-weight: investment_mm
:::

But the United States is the single largest investing country ($300 billions) [1].



# 

::: visualisation globe
  rotate: [2.3522, -57.8566]
  scale: 7
  choropleth: YearsofEducation_r
  label: Mean years of education
  format: '.1f'
  colors: schemeReds-5
:::

#
What motivates big companies to invest abroad? Why would they set up a factory or a research laboratory outside of their home country?

They want to tap into the specific qualities of a region: they are seeking **regional strategic assets** [4]. For instance, the Japanese car manufacturer Nissan decided in 1984 to build a plant in Sunderland, in the North East region of the UK. There are several other European localities that Nissan could have chosen: Lazio and Piedmont in Italy, or Nord-Pas-de-Calais in France are roughly as rich, populous and educated as the Noth East.

#
But Nissan chose the North East for reasons beyond the obvious characteristics of a region: the North East had many sophisticated auto part suppliers, it was easier to do business there than in France or Italy, and Nissan could benefit from fiscal arrangements there.

#
Similarly, the Dallas-based technology company Texas Instrument decided in 1985 to establish a software design facility in Bangalore, India. On paper, the Bangalore region looked very similar to nearby Punjab in Pakistan, or to the Zheijiang province in coastal China at that time.

#
What made the balance tilt in favour of Karnataka, the Indian state where Bangalore is, is its unique concentration of tech talents and its institutions.

More generally, innovative firms typically seek 3 types of strategic assets: specialised knowledge that is only present in this area, innovation-prone economic conditions [5] and favourable local institutional arrangements and norms [6] like a strong enforcement of intellectual property rights and patent law for instance.

[4]: http://www.tandfonline.com/doi/abs/10.1080/09654313.2015.1129395?journalCode=ceps20 "Crescenzi, Pietrobelli & Rabelloti (2016)"

[5]: http://journals.sagepub.com/doi/abs/10.1068/a43492?id=a43492& "Crescenzi & Rodrigues-Pose (2011)"

[6]: https://global.oup.com/academic/product/architectures-of-knowledge-9780199253326?cc=fr&lang=en& "Amin & Cohendet (2004)"


#

::: visualisation globe
  rotate: [2.3522, -48.8566]
  scale: 7
  choropleth: LnPopulationdensity_r_ip
  label: Population density (per ...)
  format: '.1f'
  colors: schemePiYG-7
:::

While multinational firms from both rich and emerging countries invest abroad to capitalise on regional assets, they do so in different ways.

First, MNEs from developing countries are less likely than those from rich countries to benefit from the technological competence of the region where they invest. As few of them can rival with the technological capabilities of the IBMs, Apples and Microsoft of the world, they often lack the absorptive capacity needed to fully take advantage of innovation-prone regional contexts [6].
Second, multinational firms from developing countries tend to invest in cities where a lot of companies are pursuing the same activity in the value chain (R&D or Design and Testing for instance), but they are not necessarily attracted by cluster or firms in the same industry (automobiles or computers for instance). The specialisation of a region in a particular stage of the value chain represents a clear and easily detectable indication of the availability of specialized externalities.

[6]: http://www.jstor.org/stable/2393553?seq=1#page_scan_tab_contents "Cohen and Levinthal (1990)"


#

::: visualisation globe
  rotate: [-37.6173, -55.7558]
  scale: 5
:::

In sum, multinational companies make their location and investment choices to use assets that are specific to a region. In this sense, they clearly benefit from setting a plant abroad. But do the host regions benefit from the newly implanted firms?

Economists have long seen technological change as one of the most powerful driver of economic development and welfare improvement. It is then crucial to know if developing regions gain from the interventions of technologically advanced firms. How does the evidence stack up?


#

::: visualisation globe
  rotate: [2.3522, -48.8566]
  scale: 7
  choropleth: allpat
  label: Population density (per ...)
  format: '.1f'
  colors: schemePiYG-7
:::

One common way to measure the innovative capacity of a city is to count the number of residents who are granted patents.

Based on this metric, local economies are extremely unequal in how much they innovate. The colours on the globe represent the patent counts, by region. While some regions are innovation hubs, most of the emerged land has no patent. Inequality in innovaton potential is even starker at the level of the city: in 2010, Tokyo –the most innovative city- had 9,580 patents, while more than 50,000 cities that patented at least once since 1975, did not have any patent at all that year [7].

[7]: http://rosencrantz.berkeley.edu/ "Data from the US Patents and Trademark Office"

::: visualisation globe
  rotate: [0, 0]
  scale: 2.3
:::

The distribution of patents is not only concentrated in few cities, it is also very stable over time: most of the innovative regions in 1975 remained innovative in 2010, and very few regions with no patents in 1975 became innovative.


#

::: visualisation globe
  rotate: [-46.625290, -23.533773]
  scale: 1
:::

To study the impact of foreign direct investment on regional patent count, let’s select a region that receives an FDI by an innovative firm in a given year. We then find another region that looks very similar to the first one, in this precise year. Using a statistical method called propensity score matching, we find the "twin" of a region with similar GDP, population and average level of education. The regions that receive a foreign intervention and those that do not are thus almost identical in every observable aspect except the fact that one has been visited by a foreign firm.

Comparing the patent count in the region receiving the FDI to that of the region with no FDI can give us a good idea of the effect of FDI on innovation.

#

::: visualisation trend
  category: All technologies
  region: All regions
:::

The patent count in regions that receive an intervention do indeed grow more than in regions that remained unvisited by foreign firms.

Some factors make regions more receptive to foreign firms’ interventions. Foreign direct investments in computers and drugs lead to powerful increase in regional innovation [DV zoom in to show results for these two sectors only]. Furthermore, you can notice that two continents stand out: Asia and Europe [DV selects the regions belonging to these two continents: Western Europe, Eastern Europe, East Asia, Southeast Asia and South Asia]. These continents are those that benefit the most from foreign interventions. (More on the interpretation of the results)

On the graph, you can explore the impacts of FDIs by technology and continent.

# Credits

ERC
LSE - Department of Geography and Environment
LSE - Communications Division
