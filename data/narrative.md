---
title: Do Foreign Direct Investments Help Cities Innovate?
author:
        - Riccardo Crescenzi
        - Arnaud Dyevre
date: January 2, 2017
---


#

::: visualisation globe
  rotate: [2.3522, -48.8566]
  scale: 1
  autorotate: true
:::

Multinationals mobilise enormous investments around the world. Their foreign activities are highly diverse in nature and relevance. Examples range from small production plants established by textile companies in places where labour is cheap, to fully-fledged research centres established by high-tech companies in regions where qualified engineers are easier to find.


#

::: visualisation globe
  autorotate: false
  flows: World
  flow-weight: investment_mm
  flow-detail: [ ['Invested', 'investment_mm', '$,d', 'm'] ]
  label: Top 100 FDIs in 2014
:::

Global flows of **Foreign Direct Investments** (FDIs) amounted to 1.8 trillion US dollars [1] in 2015, the equivalent of Italy’s Gross Domestic Product [2].

You can rotate the globe with your mouse and zoom in or out with the buttons in the corner.

[1]: http://unctad.org/en/pages/PublicationWebflyer.aspx?publicationid=1555 "UNCTAD 2016"

[2]: https://www.imf.org/external/pubs/ft/weo/2016/01/weodata/download.aspx "GDP estimates in 2016, IMF World Economic Outlook Database"

#

::: visualisation globe
  rotate: [-9, -50]
  scale: 1.3
  autorotate: false
  flows: Advanced economies
  flow-weight: investment_mm
  flow-detail: [ ['Invested', 'investment_mm', '$,d', 'm'] ]
  label: Most important FDIs from industrialised nations
:::

Almost two thirds of these investments came from industrialised economies, with Europe being the largest investing region ($576 billions in FDI outflows) and the United States is the single largest investing country ($300 billions) [1].

#

::: visualisation globe
  rotate: [78.3522, -48.8566]
  scale: 1
  autorotate: false
:::

What are the drivers of foreign investments by multinationals? What characteristics make countries, regions and cities attractive to multinationals?

In some cases multinational corporations are attracted by the size and market potential of the host economy or look for low-cost inputs (for example low wages). In other cases multinationals tap into innovative ideas and knowledge of their target regions, seeking **regional strategic assets** [3].

[3]: http://www.tandfonline.com/doi/abs/10.1080/09654313.2015.1129395?journalCode=ceps20& "Crescenzi et al. (2016)"

#

::: visualisation globe
  rotate: [-139.626112, -35.462933]
  scale: 1.5
  flows: Nissan
  flow-weight: investment_mm
  flow-detail: false
  autorotate: false
:::

When multinationals look for the best location for their investment they compare various similar alternatives. For example, let’s look at the Japanese car manufacturer Nissan that decided in 1984 to build a new plant in Sunderland, in the North East region of the UK.

In principle a number of other European regions had characteristics similar to Sunderland. For example Lazio and Piedmont in Italy, or Nord-Pas-de-Calais in France. At the time they were roughly as wealthy, populous and rich in human capital as the North East UK.


#

::: visualisation globe
  rotate: [-52, -46]
  scale: 1.45
  flows: Nissan
  flow-weight: investment_mm
  flow-detail: [ ['Population', 'pop'], ['GDP/capita', 'GDP/cap'], ['Years education', 'educ'] ]
  autorotate: false
:::

A number of tangible and intangible factors influenced Nissan’s decision to invest in Sunderland. An important role was played by the abundance of workers with relevant skills and knowledge (made redundant by the declining shipyard industry) as well as the commitment of the UK government to support the industrial recovery of the regions.

These were some of the **regional strategic assets** of Sunderland in the mid-1980's

#

::: visualisation globe
  rotate: [96.752984, -32.910409]
  scale: 1.5
  flows: Texas Instruments
  flow-weight: investment_mm
  flow-detail: false
  autorotate: false
:::

Similarly, the Dallas-based technology company Texas Instrument decided in 1985 to establish a software design facility in Bangalore, India.

#

::: visualisation globe
  rotate: [-87.614656, -45.934513]
  scale: 1.5
  flows: Texas Instruments
  flow-weight: investment_mm
  flow-detail: [ ['Population', 'pop'], ['GDP/capita', 'GDP/cap'], ['Years education', 'educ'] ]
  autorotate: false
:::

On paper, the Bangalore region looked very similar to the nearby province of Punjab in Pakistan, or to the Zheijiang province in coastal China in 1985. What made the balance tilt in favour of Bangalore (in the state of Karnataka) was its unique concentration of emerging tech talents and its local institutions, conducive to innovative activities.

#

::: visualisation globe
  scale: 1
  autorotate: false
:::

We studied thousands of investment decisions (similar to those of Nissan and Texas Instruments in the previous examples) targeting European regions.
1. European multinationals investing in other European countries are attracted by the local innovation dynamism and favourable  socio-institutional environments of their host economies;
2. US multinationals care more about market access and technological factors and less about local socio-institutional arrangements when compared to intra-EU investments;

#

::: visualisation globe
  scale: 1
  autorotate: false
:::

3. Multinationals from emerging economies:
a) Are less likely to look for local technological dynamism in the regions where they invest. They often have  less developed absorptive capacities, needed to fully take advantage of innovation-prone regional environments [4].
b) They tend to ‘imitate’ the behaviour of other multinationals and invest in regions where other companies are pursuing similar activities (e.g. R&D or production).


[4]: http://www.jstor.org/stable/2393553?seq=1#page_scan_tab_contents "Cohen and Levinthal (1990)"


#

::: visualisation globe
  scale: 1
  autorotate: false
:::

In sum, the location decisions of multinationals reflect the complex and dynamic matching between the characteristics of the investing company (including its origin in the example discussed above) and the specificities of their host countries, regions and cities.

Understanding the location strategies of multinationals is of paramount importance for policy-makers across the globe that aim to attract new investments to their jurisdictions in order to promote innovation, growth and employment.

But do host economies really benefit from foreign investment?


#

::: visualisation globe
  rotate: [2.3522, -48.8566]
  scale: 2
  symbols: allpat
  symbol-detail: [ [ 'Patents', 'allpat', ',d' ] ]
  thresholds: [100, 1000, 4000, 10000, 20000, 40000]
  label: Number of patents by region (2012)
  autorotate: false
:::

Economists have long seen innovation and technological among the most powerful drivers of economic development and wealth. Therefore, in order to assess the impact of multinationals on their host economies we looked at innovation in cities across the globe. One crude way to measure the innovative capacity of cities and regions is to count the number of patents granted to their residents/inventors.

Based on this statistic, local economies are extremely unequal in their innovation potential. The colours on the globe represent regional patent counts in 2015. While some regions are innovation hubs, most of the emerged land has no patent at all [7].

[7]: http://www.patentsview.org/download/ "Data from the US Patents and Trademark Office"

#

::: visualisation globe
  rotate: [-87.614656, -45.934513]
  scale: 2
  symbols: diff2
  symbol-detail: []
  max-radius: 15
  color: rgba(255,153,0,.6)
  thresholds: []
  label: Regions rising to patenting top 100
  autorotate: false
:::

The distribution of patents is not only concentrated in few cities, it is also very stable over time: the most innovative regions in 1975 remained the most innovative in 2005, and very few regions with no patents in 1975 became hubs of innovation over the next four decades.

#

::: visualisation globe
  rotate: [-46.625290, -23.533773]
  scale: 1
  autorotate: false
:::

Have foreign investments helped cities to become more innovative? To answer we looked at (almost) all regions of the world. We systematically compared regions that received an initial foreign investment with those that – although similar in many observable characteristics – did not and looked at their performance over time.

More technically, the regions that receive a foreign intervention ("treated" regions) and those that do not ("counterfactual" regions) are almost identical in every observable aspect except the fact that one has been visited by a foreign firm. Treated and control regions are ‘matched’ on the basis of their GDP, population and average educational attainment, using a statistical method called  **propensity score matching**.

#

::: visualisation globe
  rotate: [-77.614656, -12.934513]
  scale: 1
  flows: Texas Instruments
  flow-weight: investment_mm
  flow-detail: []
  autorotate: false
:::

In our example of the FDI project by Texas Instrument in Bangalore, one can compare the patent count in Bangalore following the entry of the foreign company to the average of patent counts in Punjab (Pakistan) and Zehjian (China). Comparing the patenting activity in the region receiving the FDI to that of other very similar regions with no FDI can give us a good idea of the ‘incremental’ effect of FDI on innovation.


#

::: visualisation trend
  category: All technologies
  region: All regions
:::

The patenting activity (our measure of innovation) in regions that receive foreign investments does grow more than in regions that remained untouched by foreign firms in the same period.

The graph on the right shows the difference in patent count between the ‘treated’ and the ‘counterfactual’ regions (in logarithms). If the blue region is above 0, one can say that the patent count in the treated region is significantly higher than the control.

We aggregate all the years when a foreign company is patenting abroad at time 0 on the graph. Everything to the left of 0 are the years pre-dating the arrival of the foreign firm in the country, everything to the right is the aftermath of the investment.


#

::: visualisation trend
  category: All technologies
  region: Western Europe
:::

Some factors make regions more receptive to foreign firms’ interventions. For example, foreign investments in ‘computers’ and ‘drugs’ lead to sharp increases in regional innovation.

#

::: visualisation trend
  category: All technologies
  region: East Asia
  explore: true
:::

Furthermore, two continents stand out: Asia and Europe. These continents are those that benefit the most from foreign investments. Asian and European firms appear to be more likely to absorb the knowledge transmitted through firms investing abroad.

Conversely, while Latin America attracts a substantial amount of foreign firms, the impacts on local economies are more nuanced in terms of patents.

You can explore the results by technologies and macro regions by clicking on the categories of your choice in the menus.


#

::: visualisation trend
  category: All technologies
  region: All regions
  explore: true
:::

Global economic integration and investment flows have positive impact on local innovation. While national and regional innovation efforts are crucially important foreign firms help cities and regions innovate.

The size of the impact depends largely on the technology and the area of the world where firms operate.

Surprisingly, the most innovative firms are not necessarily the ones that help regions innovate the most. We find that the top 5% of multinationals firms with the most patents lead to smaller increase in innovation, in the region where they invest.



# Conclusion & Credits

::: visualisation globe
  flows: World
  flow-weight: investment_mm
  flow-detail: false
  symbols: didAll
  max-radius: 30
  thresholds: [ 1, 6, 20, 60 ]
  symbol-detail: [ [ 'Est. increase', 'didAll', '.1f' ] ]
  label: Increase in patents (over 10 years)
  autorotate: false
:::


R. Crescenzi, A. Dyèvre & C. York

London School of Economics and Political Science

The research leading to these results has received funding from the European Research Council under the European Unions Horizon 2020 Programme H2020/2014-2020) (Grant Agreement n 639633-MASSIVE-ERC-2014-STG).

Data Visualisation created by LSE, supported by funding for knowledge exchange via Higher Education Innovation Funding (HEIF).

All errors and omissions are our own.
