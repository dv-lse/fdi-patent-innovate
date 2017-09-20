---
title: Foreign Direct Investment and the world regions. Where? Why? And for Whom?
author:
  - Riccardo Crescenzi
  - Arnaud Dyèvre
  - Christopher W. York

date: September 20, 2017
---


#

::: visualisation globe
  rotate: [2.3522, -48.8566]
  scale: 1
  autorotate: true
:::

Multinationals mobilise enormous investments around the world. Their foreign activities are highly diverse in nature and relevance: they range from small production plants established by textile companies in places where labour is cheap, to fully-fledged research centres established by high-tech companies in regions where qualified engineers are easier to find.


#

::: visualisation globe
  autorotate: false
  flows: World
  flow-weight: investment_mm
  flow-detail: [ ['Invested', 'investment_mm', '$,d', 'm'] ]
  label: Top 100 FDI in 2014
:::

In 2015, global flows of **Foreign Direct Investments** (FDI) amounted to 1.8 trillion US dollars [1], the equivalent of Italy’s Gross Domestic Product [2]. 

The top 100 investments in 2014 are displayed on the globe. Mouse over the regions of destination or origin to get more information about the flows. 

You can rotate the globe, and zoom in or out with the buttons in bottom-right the corner.

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
  label: Most important FDI from industrialised nations
:::

Almost two thirds of these investments came from industrialised economies in 2015, with Europe being the largest investing region ($576 billions in FDI outflows) and the United States is the single largest investing country ($300 billions in FDI outflows) [1].

#

::: visualisation globe
  rotate: [78.3522, -48.8566]
  scale: 1
  autorotate: false
:::

What are the drivers of foreign investments by multinationals? What characteristics make countries, regions and cities attractive to multinationals?

In some cases, multinational corporations are simply attracted by the market size and the availaibility of low-cost inputs. In others, multinationals aim to tap into innovative ideas and the sophisticated local knowledge of their target regions, seeking **regional strategic assets** [3].

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

When multinationals look for the best location for their investment they compare various similar alternatives. For example, let’s look at the Japanese car manufacturer NISSAN, that decided in 1984 to build a new plant in Sunderland, in the North East region of the UK.

In principle a number of other European regions had characteristics similar to Sunderland. For example Lazio and Piedmont in Italy, or Nord-Pas-de-Calais in France. At the time they were roughly as wealthy, populous and rich in human capital as the North East of the UK.


#

::: visualisation globe
  rotate: [-52, -46]
  scale: 1.5
  flows: Nissan
  flow-weight: investment_mm
  flow-detail: [ ['Population', 'pop'], ['GDP/capita', 'GDP/cap'], ['Years education', 'educ'] ]
  detail-offset: 1.0
  detail-orientation: [ 8, 0, 3, 5 ]
  highlight-over: 0.1
  autorotate: false
:::

But a number of tangible and intangible factors influenced NISSAN’s decision to invest in Sunderland. In particular, the abundance of workers with relevant skills and knowledge (made redundant by the declining shipyard industry) played an important role in attracting NISSAN's FDI. In addition, the UK government at the time was commited to support the industrial recovery of the region.

A qualified workforce and the support of the government were some of the **regional strategic assets** of Sunderland in the mid-1980's.

(Mouse over the orange flows to get know the income, population and level of education of the regions where NISSAN could have invested)

#

::: visualisation globe
  rotate: [96.752984, -32.910409]
  scale: 1.5
  flows: Texas Instruments
  flow-weight: investment_mm
  flow-detail: false
  autorotate: false
:::

Similarly, the Dallas-based technology company TEXAS INSTRUMENTS decided in 1985 to establish a software design facility in Bangalore, India.

#

::: visualisation globe
  rotate: [-87.614656, -45.934513]
  scale: 1.5
  flows: Texas Instruments
  flow-weight: investment_mm
  flow-detail: [ ['Population', 'pop'], ['GDP/capita', 'GDP/cap'], ['Years education', 'educ'] ]
  detail-offset: 1.0
  detail-orientation: [ 9, 3, 4 ]
  highlight-over: 0.1
  autorotate: false
:::

On paper, the Bangalore region looked very similar to the nearby province of Punjab, in Pakistan, or to the Zhejiang province in coastal China. What made the balance tilt in favour of Bangalore was its unique concentration of emerging tech talents and its local institutions, conducive to innovative activities.

#

::: visualisation globe
  scale: 1
  autorotate: false
:::

Investment decisions (similar to those of NISSAN and TEXAS INSTRUMENTS) targeting European regions can teach us a lot about what multinationals look for in regions [3].
1. European multinationals investing in other European countries are attracted by the local innovation dynamism and favourable  socio-institutional environments of their host economies;
2. In contrast, US multinationals care more about market access and technological factors and less about local socio-institutional arrangements when compared to intra-EU investments;

[3]: http://www.tandfonline.com/doi/abs/10.1080/09654313.2015.1129395?journalCode=ceps20& "Crescenzi et al. (2016)"

#

::: visualisation globe
  scale: 1
  autorotate: false
:::

3. Finally, multinationals from emerging economies:
a) Are less likely to look for local technological dynamism in the regions where they invest. They often have  less developed absorptive capacities, needed to fully take advantage of innovation-prone regional environments.
b) They tend to ‘imitate’ the behaviour of other multinationals and invest in regions where other companies are pursuing similar activities (e.g. R&D or production).


#

::: visualisation globe
  scale: 1
  autorotate: false
:::

In sum, the location decisions of multinationals reflect the complex matching between the characteristics of the investing company and the specificities of their host countries, regions and cities.

Understanding the location strategies of multinationals is of paramount importance for policy-makers across the globe who aim to attract new investments to their jurisdictions in order to promote innovation, growth and employment.

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

Economists have long seen innovation and technological progress as some of the most powerful drivers of economic development and wealth. Therefore, in order to assess the impact of multinationals on their host economies we looked at innovation in cities across the globe. One crude way to measure the innovative capacity of cities and regions is to count the number of patents granted to their residents/inventors.

Based on this statistic, local economies are extremely unequal in their innovation potential. The bubbles on the globe represent regional patent counts in 2012. While some regions are innovation hubs, most of the emerged land has no patent at all [4].

[4]: http://www.patentsview.org/download/ "Data from the US Patents and Trademark Office"

#

::: visualisation globe
  rotate: [-87.614656, -45.934513]
  scale: 1.5
  symbols: diff2
  symbol-detail: []
  max-radius: 15
  color: rgba(255,153,0,.6)
  thresholds: []
  label: Regions rising to the 100 most innovative
  autorotate: false
:::

The distribution of patents is not only concentrated in few cities, it is also very stable over time: the most innovative regions in 1975 remained the most innovative in 2012, and very few regions with no patents in 1975 became hubs of innovation over the next four decades.

You can see on the map the handful of regions who managed to break into the top 100 of the most innovative localities (between 1975 and 2012).

#

::: visualisation globe
  rotate: [-46.625290, -23.533773]
  scale: 1
  autorotate: false
:::

Have foreign investments helped cities to become more innovative? To answer this, we looked at (almost) all regions of the world [5]. We systematically compared regions that received an initial foreign investment with those that – although similar in many observable characteristics – did not and looked at their performance over time.

More technically, the regions that receive a foreign intervention ("treated" regions) and those that do not ("counterfactual" regions) are almost identical in every observable aspect except the fact that one has been visited by a foreign firm. Treated and counterfactual regions are ‘matched’ on the basis of their GDP, population and average educational attainment, using a statistical method called  **propensity score matching**.

[5]: www. "Crescenzi, Dyèvre & Neffke (2017), Forthcoming"


#

::: visualisation globe
  rotate: [-77.614656, -12.934513]
  scale: 1
  flows: Texas Instruments
  flow-weight: investment_mm
  flow-detail: []
  detail-offset: 1.0
  autorotate: false
:::

In our example of the FDI project by Texas Instrument in Bangalore, one can compare the patent count in Bangalore following the entry of the foreign company to the average patent counts in Punjab (Pakistan) and Zhejian (China). Comparing the patenting activity in the region receiving the FDI to that of other very similar regions with no FDI can give us a good idea of the ‘incremental’ effect of FDI on innovation.


#

::: visualisation trend
  category: All technologies
  region: All regions
:::

The patenting activity (our measure of innovation) in regions that receive foreign investments does grow more than in regions that remained untouched by foreign firms in the same period.

The graph on the right shows the difference in patent count between the ‘treated’ and the ‘counterfactual’ regions (in logarithms). If the blue region is above 0, one can say that the patent count in the treated region is significantly higher than the control.

We center the first time when a foreign company is patenting abroad at time 0 on the graph. Everything to the left of 0 are the years pre-dating the arrival of the foreign firm in the country, everything to the right is the aftermath of the investment.

#

::: visualisation trend
  category: All technologies
  region: East Asia
  explore: true
:::

Furthermore, two continents stand out: Asia and Europe. These continents are benefiting the most from foreign investments. Asian and European firms appear to be more likely to absorb the knowledge transmitted through firms investing abroad.

Conversely, while Latin America attracts a substantial amount of foreign firms, the impacts on local economies are more nuanced in terms of patents.

You can explore the results by technologies and macro regions by clicking on the categories of your choice in the menus.


#

::: visualisation trend
  category: All technologies
  region: All regions
  explore: true
:::

Overall, global economic integration and investment flows have a positive impact on local innovation. While domestic innovation efforts remain important, foreign knowledge brought by multinationals helps cities and regions kickstart their transformations into innovation hubs.

Surprisingly, the most innovative firms are not necessarily the ones that help regions innovate the most. We find that the 1% of multinationals firms with the most patents lead to smaller increase in regional innovation, in the region where they invest. In part because they are not as integrated in the local economies as smaller, slightly less innovative firms.


#

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

You can explore on he globe how regional innovation benefit from foreign investments.

Each blue bubble shows the average impact of a foreign investment on patent increase. The bigger the bubble, the larger the increase in patent production. The flows in orange are the 100 most impactful investments, outside the USA.

# Credits

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

London School of Economics and Political Science
*R. Crescenzi, A. Dyèvre & C. York*

The research leading to these results has received funding from the European Research Council under the European Union Horizon 2020 Programme H2020/2014-2020) (Grant Agreement n 639633-MASSIVE-ERC-2014-STG). All errors and omissions are our own.

Data Visualisation created by LSE, supported by funding for knowledge exchange via Higher Education Innovation Funding (HEIF).
