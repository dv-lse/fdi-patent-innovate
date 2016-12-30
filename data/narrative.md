---
title: Do Foreign Direct Investments Help Cities Innovate?
author: Arnaud Dyevre
date: November 30, 2016
---


# Where do multinational firms invest?

::: visualisation globe
  rotate: [0, -20]
  scale: .7
  autorotate: true
:::

How do they make these investment decisions?


# DV INFO: Markdown narrative

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


`
# **How big?** The importance of Foreign Direct Investments
`
#
Large, internationalised firms are investing massive amounts of money abroad: a textile company may want to build a production plant where labour is cheap, or a tech company may want to set up a research centre where there is an abundance of qualified engineers.

# ***World***
These investments are called Foreign Direct Investments (FDIs) and In 2015 they amounted to 1.8 trillion US dollars [1]. or the equivalent of Italy’s Gross Domestic Product [2].

The most important investments are shown on the globe.

[1]: http://unctad.org/en/pages/PublicationWebflyer.aspx?publicationid=1555 "UNCTAD 2016"

[2]: https://www.imf.org/external/pubs/ft/weo/2016/01/weodata/download.aspx "GDP estimates in 2016, IMF World Economic Outlook Database"

# ***Industrialised economies***

Almost two thirds of these investments (63%) came from developed economies [the animation is showing flows from developed economies in 2014, arrows represent the dollar value, if there are too many messy flows we may want to use only the top 50 or 75% of flows], with Europe being the largest investing region ($576 billions).

# ***United States***

But the United States is the single largest investing country ($300 billions) [the animation is showing investments from the United States in 2014] [1].

::: visualisation globe
  rotate: [78.3522, -48.8566]
  scale: 2
  flows: United States
  flow-weight: investment_mm
:::


*AD 13/12: Need to discuss with Christopher how to show the flows:
- keep only the top 15 (for AD and RC the more the better)?
- bundling of flows? (idea suggested by Christopher early in the development of the project)
- number of flows represented needs to be selected so as to show the geographical spread of FDIs (if selecting the top 15 only shows Europe<->US flows, not very convincing)*

*refs: 1. World FDIs figures: UNCTAD, 2016
*2. GDP estimates in 2016: IMF, World Economic Outlook Database

# **Why?** MNEs want to take advantage of regional strategic assets and region-specific institutional arrangements

::: visualisation globe
  rotate: [2.3522, -57.8566]
  scale: 7
  choropleth: YearsofEducation_r
  label: Mean years of education
  format: '.1f'
  colors: schemeReds-5
:::

*AD: This slide will change... After discussion with Riccardo, it appears that he would prefer to focus on firm-specific examples rather than show all flows in the world.
Ideas of firm-specific examples:
- Renault-Nissan investing in Sunderland rather than somewhere else (or maybe more recent example, Nissan's FDI happened in 1985)
- Hewlett-Packard and Texas Instruments investing in Bangalore *

What motivates big companies to invest abroad? Why would they set up a factory or a research laboratory outside of their home country?

They want to tap into the specific qualities of a region: they are seeking regional strategic assets [4]. For example, firms who want to conquer new markets are interested in regions with a lot of consumers with substantial purchasing powers. Have a look at the locations where multinational firms are creating new sales subsidiaries [DV automatically selects “Sales” as Global Value Chain stage] + [display the GDP of the regions as different colours on a heatmap]: they are opening them in the richest regions. By contrast, look at where IT companies are concentrating R&D labs and management activities [DV automatically selects “Headquarters” as a GVC stage and it selects the industry “IT and Software”] + [display the average level of education in the regions, as different colours on a heatmap]: these are mostly regions with the most educated population (and workforce).

For innovative activities, firms typically seek 3 types of strategic assets: specialised knowledge that is only present in this area, innovation-prone economic conditions [5] and favourable local institutional arrangements and norms [6] like a strong enforcement of intellectual property rights and patent law for instance.

*refs: 4. Crescenzi, Pietrobelli & Rabelloti (2015)
*5. Crescenzi and Rodrigues-Pose (2011)
*6. Amin and Cohendet (2004)

# **How?** Firms from developed and emerging economies invest differently

::: visualisation globe
  rotate: [2.3522, -48.8566]
  scale: 7
  choropleth: LnPopulationdensity_r_ip
  label: Population density (per ...)
  format: '.1f'
  colors: schemePiYG-7
:::

*I am not convinced that this is a very useful aspect of the narrative. At least for the main point that we are trying to get across. I suggest we work on the other aspects first and come back to this slide later.*
*AD: As discussed a few weeks ago, I agree that this part is not fundamental. Can we however keep the text as a new slide? But without any other animation*

While multinational firms from both rich and emerging countries invest abroad to capitalise on regional assets, they do so in different ways.

First, MNEs from developing countries are less likely than those from rich countries to benefit from the technological competence of the region where they invest. As few of them can rival with the technological capabilities of the IBMs, Apples and Microsoft of the world, they often lack the absorptive capacity needed to fully take advantage of innovation-prone regional contexts [6].
Second, multinational firms from developing countries tend to invest in cities where a lot of companies are pursuing the same activity in the value chain (R&D or Design and Testing for instance), but they are not necessarily attracted by cluster or firms in the same industry (automobiles or computers for instance). The specialisation of a region in a particular stage of the value chain represents a clear and easily detectable indication of the availability of specialized externalities.

*6. Cohen and Levinthal (1990)*

# Transition

::: visualisation globe
  rotate: [-37.6173, -55.7558]
  scale: 5
:::

In sum, multinational companies make their location and investment choices to use assets that are specific to a region. In this sense, they clearly benefit from setting a plant abroad. But do the host regions benefit from the newly implanted firms?

Economists have long seen technological change as one of the most powerful driver of economic development and welfare improvement. It is then crucial to know if developing regions gain from the interventions of technologically advanced firms. How does the evidence stack up?

# What is the impact of investments on the ability to innovate of the host region? 

# **How unequal?** Innovation capacity is very unequal and stable over time

One common way to measure the innovative capacity of a city is to count the number of inventors who are granted patents in this city.

Based on this metric, cities are extremely unequal in how much they innovate. The spikes on the globe represent the [logarithms of] the patent counts, by city. While some regions are very “spiky”, most of the emerged land has no patent. In 2010, Tokyo –the most innovative city- had 9,580 patents, while more than 50,000 cities that patented at some point earlier, did not have any patent at all that year [7].

*AD 13/12: Quizz will change, will compare inequality in patents to inequality in the World or in the US*

---

*Quiz.*

Let’s compare inequality in patent count to wealth inequality. In the UK, it is estimated that the 10% richest individuals in Britain own 47% of the country’s wealth [8]. This is a quite unequal distribution of wealth. But how unequal is the distribution of patents in the world according to you? In 2005, what share of patents did the top 10% of the regions own?

50% 60% 70% 80% 90% ?

*correct answer 90%

---

*refs: 7. Data from the US Patents and Trademark Office*
*8. Office of National Statistics, WAS database for the OECD (data accessed via IFS paper: http://onlinelibrary.wiley.com/doi/10.1111/j.1475-5890.2016.12084/full)*

::: visualisation globe
  rotate: [0, 0]
  scale: 2.3
:::

The distribution of patents is not only concentrated in few cities, it is also very stable over time: out of the regions that were in the bottom quintile of patent count between 1975 and 1990, only 0.21% reached the top quintile between 1991 and 2010. Conversely, only 0.11% went from the top to the bottom quintile [9]. You can use the year cursor to see how patenting evolves from 1975 to 2005.

**AD: so I think we will not use the cursor by year? We are using patent count in 2005 only if I remember correctly? If that's the case, we will not write the last sentence.

*refs: 9. Authors’ calculations, based on US Trademark and Patent Office data

# **Finding twin pairs of regions**

::: visualisation globe
  rotate: [-46.625290, -23.533773]
  scale: 1
:::

To study the impact of foreign direct investment on regional patent count, let’s select a region that receives an FDI by an innovative firm in a given year. We then find another region that looks very similar to the first one, in this precise year. Using a statistical method called propensity score matching, we find the statistical twin of a region with similar GDP, population and average level of education. The regions that receive a foreign intervention and those that do not are thus almost identical in every observable aspect except the fact that they have been visited by a foreign firm.

Imagine for instance that the CEO of an American tech firm decides to build a lab in a high-growth country. He hesitates between a region in Mexico and another in Costa Rica: they have the same level of education, same GDP per capita and the same population. They would both be great locations for the new lab. In the end, the CEO just decides to flip a coin to decide where to go: Mexico is the lucky winner and the lab that she built starts to boost innovative activity in the region. By comparing the patent counts in Mexico and Costa Rica, we can then estimate how valuable a foreign direct investment is to Mexico’s innovative capacity.

You can click on a region and see to which other it is matched [the visualisation highlights the regions that receive the treatment and when the user mouse over one, it highlights this particular region and the others (2?) to which it is matched]

# **Results:** The impact of foreign intervention on city-level innovation

::: visualisation trend
  category: All technologies
  region: All regions
:::

Patent counts in the regions that receive an intervention does indeed grow more than in regions that did not. [DV shows the overall difference-indifferences graph, for all regions and technologies]

Some factors make regions more receptive to foreign firms’ interventions. Foreign direct investments in computers and drugs lead to powerful increase in regional innovation [DV zoom in to show results for these two sectors only]. Furthermore, you can notice that two continents stand out: Asia and Europe [DV selects the regions belonging to these two continents: Western Europe, Eastern Europe, East Asia, Southeast Asia and South Asia]. These continents are those that benefit the most from foreign interventions. (More on the interpretation of the results)

On the graph, you can explore the impacts of FDIs by technology and continent.

# References cited

*Amin, A., & Cohendet, P. (2004). Architectures of knowledge: Firms, capabilities and communities. Oxford: Oxford University Press.*

*Cohen, W. M., & Levinthal D. A. (1990). Absorptive capacity: A new perspective on learning and innovation. Administrative Science Quarterly, 35(1), 128–152. doi:10.2307/2393553*

*Crescenzi, R., & Rodríguez-Pose, A. (2011). Innovation and regional growth in the European Union. Berlin: Springer-Verlag.*

*United Nations Conference on Trade and Development (UNCTAD), 2016*

*World Investment Report 2015: Investor Nationality: Policy Challenges (UNCTAD: Geneva)*
