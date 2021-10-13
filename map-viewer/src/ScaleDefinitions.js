export const scales = [
    {
      id: "global",
      name: "Global",
      label: "Compare ecosystem service values globally.",
      helpText: `Compare how different places anywhere on the globe 
        contribute nature's benefits to people.`,
      iconKey: "faglobe",
      defaultChecked: true,
    },
    {
      id: "national",
      name: "National",
      label: "Identify hotspots of ecosystem service values within a country.",
      helpText: `Identify hotspots of nature's benefits to people within a 
        country.`,
      iconKey: "giafrica",
      defaultChecked: false,
    },
    {
      id: "admin",
      name: "In-country Region",
      label: `Identify hotspots of ecoystem service values within a sub-national
              administrative unit (province, state, department, etc.)`,
      helpText: `Identify hotspots of nature's benefits to people for an 
        administrative region within a country (i.e., province, department, 
        state, etc.)`,
      iconKey: "bipolygon",
      defaultChecked: false,
    },
    {
      id: "local",
      name: "Local",
      label: `Provide an AOI (area of interest) and examine ecosystem service
              values in the surrounding area.`,
      helpText: `Draw an area of interest (AOI) to explore nature's benefits 
        to people in the surrounding watersheds.`,
      iconKey: "bimappin",
      defaultChecked: false,
    },
]

export const serviceMenuDetails = [
    {
      id: "nitrogen",
      label: "Clean water: nitrogen retention",
      helpText: {
        text: `Fertilizers like nitrogen are a major source of pollution for
       freshwater systems and drinking water. However, some of this nitrogen
       pollution may be retained by healthy ecosystems, therefore regulating
       water quality in streams. The people benefitting from nitrogen
       retention are those downstream from pollution sources, who would
       otherwise be exposed to nitrogen contamination in their drinking water.
       Nitrogen retention is modeled using the InVEST Nutrient Delivery Ratio
       model, adapted for global analysis, and downstream beneficiaries are
       derived from LandScan population data.`,
        metric: `Values are a unitless index representing nitrogen retention
        in natural and semi-natural areas multiplied by the number of people
        downstream of those areas.`,
        source: "Natural Capital Project",
        resolution: "~300m",
        date: "2015",
        coverage: "Global",
        license: {
          link: "https://creativecommons.org/licenses/by/4.0/",
          text: "CC-By Attribution 4.0 International",
        },
        citation: {
          text: `IN PREP: Rebecca Chaplin-Kramer, Rachel A Neugarten, 
        Richard P Sharp, Pamela M Collins, Stephen Polasky, David Hole, 
        Richard Schuster, Matthew Strimas-Mackey, Mark Mulligan, 
        Carter Brandon, Sandra Diaz, Etienne Fluet-Chouinard, Larry Gorenflo, 
        Justin A Johnson, Patrick W Keys, Kate Longley-Wood, 
        Peter B McIntyre, Monica Noon, Unai Pascual, Catherine Reidy Liermann,
        Patrick R Roehrdanz, Guido Schmidt-Traub, M. Rebecca Shaw, 
        Mark Spalding, Will R Turner, Arnout van Soesbergen, Reg A Watson
        bioRxiv 2020.11.08.361014`,
          link: "https://doi.org/10.1101/2020.11.08.361014",
        },
      },
      iconKey: "iowater",
      disable: false,
    },
    {
      id: "sediment",
      label: "Clean water: sediment retention",
      helpText: {
        text: `Erosion causes issues for land degradation and water quality,
       with sediments (e.g. sand, silt, gravel) clogging waterways and often
       carrying diseases that can lead to water-borne illness. However, some
       of this erosion may be retained by healthy ecosystems, therefore
       regulating water quality in streams. People and infrastructure
       benefitting from sediment retention are those downstream from erosion
       sources who would otherwise be impacted by poor water quality. Sediment
       retention is modeled using the InVEST Sediment Delivery Ratio model,
       adapted for global analysis, which maps overland sediment generation
       and delivery to the stream. Downstream beneficiaries are derived from
       LandScan population data.`, 
        metric: `Values are a unitless index representing sediment retention
        in natural and semi-natural areas multiplied by the number of people
        downstream of those areas.`,
        source: "Natural Capital Project",
        resolution: "~300m",
        date: "2015",
        coverage: "Global",
        license: {
          link: "https://creativecommons.org/licenses/by/4.0/",
          text: "CC-By Attribution 4.0 International",
        },
        citation: {
          text: `IN PREP: Rebecca Chaplin-Kramer, Rachel A Neugarten, 
        Richard P Sharp, Pamela M Collins, Stephen Polasky, David Hole, 
        Richard Schuster, Matthew Strimas-Mackey, Mark Mulligan, 
        Carter Brandon, Sandra Diaz, Etienne Fluet-Chouinard, Larry Gorenflo, 
        Justin A Johnson, Patrick W Keys, Kate Longley-Wood, 
        Peter B McIntyre, Monica Noon, Unai Pascual, Catherine Reidy Liermann,
        Patrick R Roehrdanz, Guido Schmidt-Traub, M. Rebecca Shaw, 
        Mark Spalding, Will R Turner, Arnout van Soesbergen, Reg A Watson
        bioRxiv 2020.11.08.361014`,
          link: "https://doi.org/10.1101/2020.11.08.361014",
        },
      },
      iconKey: "iowateroutline",
      disable: false,
    },
    {
      id: "coastalProtection",
      label: "Coastal storm risk reduction",
      helpText: {
        text: `Coastal habitats—such as coral reefs, mangroves, salt marsh,
       and seagrasses—protect shorelines from the impacts of storms by
       absorbing and reducing the strength of waves. These habitats reduce
       the risk of flooding and erosion for coastal communities. The amount
       of protection provided by coastal habitats depends on the coastline's
       physical exposure to coastal hazards and the location of coastal
       communities and infrastructure. To map risk reduction to coastal
       communities, we used methods based on the InVEST Coastal Vulnerability
       model and projected risk reduction value back to coastal habitats.
       The locations of coastal communities are derived from LandScan
       population data.`,
        metric: `Values are a unitless index of the coastal risk reduced by
        habitat multiplied by the number of people within the protective
        distance of the habitat.`,
        source: "Natural Capital Project",
        resolution: "~300m",
        date: "2015",
        coverage: "Global",
        license: {
          link: "https://creativecommons.org/licenses/by/4.0/",
          text: "CC-By Attribution 4.0 International",
        },
        citation: {
          text: `IN PREP: Rebecca Chaplin-Kramer, Rachel A Neugarten, 
        Richard P Sharp, Pamela M Collins, Stephen Polasky, David Hole, 
        Richard Schuster, Matthew Strimas-Mackey, Mark Mulligan, 
        Carter Brandon, Sandra Diaz, Etienne Fluet-Chouinard, Larry Gorenflo, 
        Justin A Johnson, Patrick W Keys, Kate Longley-Wood, 
        Peter B McIntyre, Monica Noon, Unai Pascual, Catherine Reidy Liermann,
        Patrick R Roehrdanz, Guido Schmidt-Traub, M. Rebecca Shaw, 
        Mark Spalding, Will R Turner, Arnout van Soesbergen, Reg A Watson
        bioRxiv 2020.11.08.361014`,
          link: "https://doi.org/10.1101/2020.11.08.361014",
        },
      },
      iconKey: "biwater",
      disable: false,
    },
    {
      id: "natureAccess",
      label: "Local nature access",
      helpText: {
        text: `Ecosystems provide numerous direct and indirect benefits to
       people, such as recreation, hunting and gathering, aesthetics
       (visual beauty), mental and physical health, cultural and traditional
       value, and sense of place. Many of these contributions depend on the
       ability of people to access nature, so proximity to natural lands
       is used as a proxy for nature’s contributions to people, and population
       is derived from LandScan data.`,
        metric: `Values represent the number of people within 10 km of 
        natural and semi-natural lands.`,
        source: "Natural Capital Project",
        resolution: "~300m",
        date: "2015",
        coverage: "Global",
        license: {
          link: "https://creativecommons.org/licenses/by/4.0/",
          text: "CC-By Attribution 4.0 International",
        },
        citation: {
          text: `IN PREP: Rebecca Chaplin-Kramer, Rachel A Neugarten, 
        Richard P Sharp, Pamela M Collins, Stephen Polasky, David Hole, 
        Richard Schuster, Matthew Strimas-Mackey, Mark Mulligan, 
        Carter Brandon, Sandra Diaz, Etienne Fluet-Chouinard, Larry Gorenflo, 
        Justin A Johnson, Patrick W Keys, Kate Longley-Wood, 
        Peter B McIntyre, Monica Noon, Unai Pascual, Catherine Reidy Liermann,
        Patrick R Roehrdanz, Guido Schmidt-Traub, M. Rebecca Shaw, 
        Mark Spalding, Will R Turner, Arnout van Soesbergen, Reg A Watson
        bioRxiv 2020.11.08.361014`,
          link: "https://doi.org/10.1101/2020.11.08.361014",
        },
      },
      iconKey: "titree",
      disable: false,
    },
    {
      id: "pollination",
      label: "Crop pollination",
      helpText: {
        text: `Up to two-thirds of all crops require some degree of animal
       pollination to reach their maximum yields, and natural habitat around
       farmlands can support healthy populations of wild pollinators
       (e.g. bees, birds, other insects) by providing them with foraging and
       nesting resources. The potential contribution of wild pollinators to
       nutrition production is based on the sufficiency of habitat that
       surrounds farmlands and how dependent a given crop is on pollination.`,
        metric: `Values represent the average equivalent number of people
        fed by pollination-dependent crops, attributed to nearby ecosystems
        based on the area of pollinator habitat within the pollinator flight
        distance of crops.`,
        source: "Natural Capital Project",
        resolution: "~300m",
        date: "2015",
        coverage: "Global",
        license: {
          link: "https://creativecommons.org/licenses/by/4.0/",
          text: "CC-By Attribution 4.0 International",
        },
        citation: {
          text: `IN PREP: Rebecca Chaplin-Kramer, Rachel A Neugarten, 
        Richard P Sharp, Pamela M Collins, Stephen Polasky, David Hole, 
        Richard Schuster, Matthew Strimas-Mackey, Mark Mulligan, 
        Carter Brandon, Sandra Diaz, Etienne Fluet-Chouinard, Larry Gorenflo, 
        Justin A Johnson, Patrick W Keys, Kate Longley-Wood, 
        Peter B McIntyre, Monica Noon, Unai Pascual, Catherine Reidy Liermann,
        Patrick R Roehrdanz, Guido Schmidt-Traub, M. Rebecca Shaw, 
        Mark Spalding, Will R Turner, Arnout van Soesbergen, Reg A Watson
        bioRxiv 2020.11.08.361014`,
          link: "https://doi.org/10.1101/2020.11.08.361014",
        },
      },
      iconKey: "gibee",
      disable: true,
    },
    {
      id: "grazing",
      label: "Livestock grazing",
      helpText: {
        text: "Help text here.",
        metric: ``,
        source: "Natural Capital Project",
        resolution: "~300m",
        date: "2015",
        coverage: "Global",
        license: {
          link: "https://creativecommons.org/licenses/by/4.0/",
          text: "CC-By Attribution 4.0 International",
        },
        citation: "citation",
      },
      iconKey: "gicow",
      disable: true,
    },
]

export const supportMenuDetails = [
    {
      id: "lulc",
      label: "Land use/land cover",
      helpText: {
        text: `A land use/land cover (LULC) map displays how people are using
        the land (e.g. agriculture, urban) and the different types of
        vegetation cover (e.g. forest, wetland). An LULC map is an important
        dataset used in modeling nature's different benefits to people
        presented here. For the Sediment and Nitrogen models, each type of
        land use/land cover receives a value related to erosion potential or
        nitrogen application. Pollination uses the LULC map to identify
        agriculture and pollinator habitat. Nature access defines natural
        lands via the LULC, as are coastal terrestrial habitats used by the
        Coastal Risk model. The original European Space Agency (ESA) map
        defines 37 different types of land use/land cover, which have been
        combined into 9 groups for more simplified viewing.`,
        metric: "N/A",
        source: "ESA",
        resolution: "~300m",
        date: "2015",
        coverage: "Global",
        license: {
          link: "http://maps.elie.ucl.ac.be/CCI/viewer/download.php",
          text: "Land Cover CCI Terms of Use.",
        },
        citation: {
          text: "Land Cover CCI Product User Guide Version 2. Tech. Rep. (2017).",
          link: "http://maps.elie.ucl.ac.be/CCI/viewer/download/ESACCI-LC-Ph2-PUGv2_2.0.pdf",
        },
      },
      iconKey: "mdlandscape",
      disable: false,
    },
    {
      id: "population",
      label: "Population",
      helpText: {
        text: `To determine the location and number of people who receive
        various benefits from nature, LandScan population data from 2017 is
        used.`,
        metric: "N/A",
        source: "Oak Ridge National Laboratory.",
        resolution: "~1km",
        date: "2017",
        coverage: "Global",
        license: {
          link: "https://landscan.ornl.gov/license",
          text: "LandScan license",
        },
        citation: {
          text: `A. N. Rose, J. J. McKee, M. L. Urban, E. A. Bright, LandScan
          2017 (2018).`,
          link: "https://landscan.ornl.gov/).",
        },
      },
      iconKey: "ioiospeople",
      disable: false,
    },
    {
      id: "coastal-habitat",
      label: "Coastal Habitats",
      helpText: {
        text: `Mangroves, corals, seagrasses, salt marshes, wetlands and
        coastal forest are the natural habitats included in modeling Coastal
        Storm Risk Reduction. These habitats reduce the impact of wind and
        waves, which helps protect coastal communities from inundation,
        erosion, and wind damage during storms.`,
        metric: "N/A",
        source: [
          {type: "text", text: "Mangroves: "},
          {
            type: "link", link: "https://www.globalmangrovewatch.org/",
            linkText: "Global Mangrove Watch"},
          {type: "text", text: " from, "},
          {
            type: "link", link: "https://data.unep-wcmc.org/datasets/45",
            linkText: "UNEP-WCMC"},
          {type: "break"},
          {type: "text", text: "Corals: "},
          {
            type: "link", link: "https://www.wri.org/research/reefs-risk-revisited",
            linkText: "World Resources Institute - Reefs at Risk Revisited"},
          {type: "break"},
          {type: "text", text: "Seagrasses: UNEP-WCMC Ocean Data Viewer - "},
          {
            type: "link", link: "https://data.unep-wcmc.org/datasets/7",
            linkText: "Global Distribution of Seagrasses"},
          {type: "break"},
          {type: "text", text: "Salt marshes: Global Distribution of Saltmarshes - from "},
          {
            type: "link", link: "https://data.unep-wcmc.org/datasets/43",
            linkText: "UNEP-WCMC"},
          {type: "break"},
          {type: "text", text: "Wetlands and coastal forest/scrub: "},
          {
            type: "link", link: "http://www.esa-landcover-cci.org/?q=node/164",
            linkText: "European Space Agency Climate Change Initiative 2017"},
        ],
        resolution: [
          {type: "text", text: "Mangroves: 30m-300m"},
          {type: "break"},
          {type: "text", text: "Corals: 500m"},
          {type: "break"},
          {type: "text", text: "Seagrasses: Not provided by source"},
          {type: "break"},
          {type: "text", text: "Salt marshes: Variable"},
          {type: "break"},
          {type: "text", text: "Wetlands and coastal forest/scrub: ~500m"},
          {type: "break"},
        ],
        date: [
          {type: "text", text: "Mangroves: 2016"},
          {type: "break"},
          {type: "text", text: "Corals: 2011"},
          {type: "break"},
          {type: "text", text: "Seagrasses: 2017"},
          {type: "break"},
          {type: "text", text: "Salt marshes: 2015"},
          {type: "break"},
          {type: "text", text: "Wetlands and coastal forest/scrub: 2015"},
          {type: "break"},
        ],
        coverage: "Global",
        license: [
          {type: "text", text: "Mangroves: "},
          {
            type: "link", link: "https://creativecommons.org/licenses/by/4.0/",
            linkText: "CC-By Attribution 4.0 Internation"},
          {type: "break"},
          {type: "text", text: "Corals: "},
          {
            type: "link", link: "https://creativecommons.org/licenses/by/3.0/",
            linkText: "Create Commons Attribution 3.0 Unported (CC BY 3.0)"},
          {type: "break"},
          {type: "text", text: "Seagrasses: "},
          {
            type: "link", link: "https://www.unep-wcmc.org/policies/general-data-license-excluding-wdpa#data_policy",
            linkText: "UNEP-WCMC General data license"},
          {type: "break"},
          {type: "text", text: "Salt marshes: "},
          {
            type: "link", link: "https://creativecommons.org/licenses/by-nc/3.0/legalcode",
            linkText: "Attribution-NonCommercial 3.0 Unported"},
          {type: "break"},
          {type: "text", text: "Wetlands and coastal forest/scrub: "},
          {
            type: "link", link: "http://maps.elie.ucl.ac.be/CCI/viewer/download.php",
            linkText: "Land Cover CCI Terms of Use"},
        ],
        citation: [
          {type: "text", text: `P. Bunting et al., The Global Mangrove Watch—A
            New 2010 Global Baseline of Mangrove Extent. Remote Sens. 10, 1669
            (2018).`},
          {type: "break"},
          {type: "break"},
          {type: "text", text: `L. Burke, K. Reytar, M. Spalding, A. Perry,
            “Reefs at Risk Revisited” (World Resources Institute, 2011),
            (available at `},
          {
            type: "link", link: "http://www.wri.org/publication/reefs-risk-revisited",
            linkText: "http://www.wri.org/publication/reefs-risk-revisited)."},
          {type: "break"},
          {type: "break"},
          {type: "text", text: `UNEP-WCMC, F. T. Short, “Global distribution
            of seagrasses (version 6.0)” (UN Environment World Conservation
            Monitoring Centre, Cambridge, UK, 2017)`},
          {type: "break"},
          {type: "break"},
          {type: "text", text: `Mcowen C, Weatherdon LV, Bochove J, Sullivan E,
            Blyth S, Zockler C, Stanwell-Smith D, Kingston N, Martin CS,
            Spalding M, Fletcher S (2017). A global map of saltmarshes (v6.1).
            Biodiversity Data Journal 5: e11764. Paper DOI:
            https://doi.org/10.3897/BDJ.5.e11764; Data DOI: `},
          {
            type: "link", link: "https://doi.org/10.34892/07vk-ws51",
            linkText: "https://doi.org/10.34892/07vk-ws51"},
          {type: "break"},
          {type: "break"},
          {type: "text", text: `Land Cover CCI Product User Guide Version 2.
            Tech. Rep. (2017). Available at: `},
          {
            type: "link", link: "http://maps.elie.ucl.ac.be/CCI/viewer/download/ESACCI-LC-Ph2-PUGv2_2.0.pdf",
            linkText: "maps.elie.ucl.ac.be/CCI/viewer/download/ESACCI-LC-Ph2-PUGv2_2.0.pdf"},
        ],
      },
      iconKey: "gicoral",
      disable: false,
      subLayerCtrl: true,
      subLayerIds: [
        'wetland', 'seagrass', 'mangroves', 'forest-scrub', 'coral-reef'
      ],
    },
    {
      id: "protected-areas",
      label: "Protected Areas",
      helpText: {
        text: ``,
        metric: "N/A",
        source: "",
        resolution: "",
        date: "",
        coverage: "Global",
        license: {
          link: "",
          text: "",
        },
        citation: {
          text: ``,
          link: "",
        },
      },
      iconKey: "giplantsandanimals",
      disable: false,
    },
    {
      id: "rivers",
      label: "Rivers",
      helpText: {
        text: `The InVEST Sediment and Nutrient models trace the path of
        erosion and nutrient from their origins until they reach a stream.
        While in-stream processes are not modelled, the assumption is that
        once these reach a river, they can cause water quality issues for
        people and infrastructure downstream. So, it is often useful to
        visualize rivers along with hydrologic service maps, to understand
        which rivers and downstream communities are likely to benefit when
        natural lands hold back sediment and nutrient from entering the
        water supply.  `,
        metric: "N/A",
        source: "",
        resolution: "",
        date: "",
        coverage: "Global",
        license: {
          link: "",
          text: "",
        },
        citation: {
          text: ``,
          link: "",
        },
      },
      iconKey: "ioiosconstruct",
      disable: true,
    },
]

export const coastalHabitats = [
    {
      id: "forest-scrub",
      label: "Forest / Scrub",
      helpText: {
        text: ``,
        metric: "N/A",
        source: "",
        resolution: "",
        date: "",
        coverage: "Global",
        license: {
          link: "",
          text: "",
        },
        citation: {
          text: ``,
          link: "",
        },
      },
      iconKey: "ioiosconstruct",
      disable: true,
      subLayer: true,
      subLayerParent: "cvhabs",
      legend: false,
    },
    {
      id: "wetland",
      label: "Wetlands",
      helpText: {
        text: ``,
        metric: "N/A",
        source: "",
        resolution: "",
        date: "",
        coverage: "Global",
        license: {
          link: "",
          text: "",
        },
        citation: {
          text: ``,
          link: "",
        },
      },
      iconKey: "ioiosconstruct",
      disable: true,
      subLayer: true,
      subLayerParent: "cvhabs",
      legend: false,
    },
    {
      id: "seagrass",
      label: "Seagrass",
      helpText: {
        text: ``,
        metric: "N/A",
        source: "",
        resolution: "",
        date: "",
        coverage: "Global",
        license: {
          link: "",
          text: "",
        },
        citation: {
          text: ``,
          link: "",
        },
      },
      iconKey: "ioiosconstruct",
      disable: true,
      subLayer: true,
      subLayerParent: "cvhabs",
      legend: false,
    },
    {
      id: "saltmarsh",
      label: "Saltmarsh",
      helpText: {
        text: ``,
        metric: "N/A",
        source: "",
        resolution: "",
        date: "",
        coverage: "Global",
        license: {
          link: "",
          text: "",
        },
        citation: {
          text: ``,
          link: "",
        },
      },
      iconKey: "ioiosconstruct",
      disable: true,
      subLayer: true,
      subLayerParent: "cvhabs",
      legend: false,
    },
    {
      id: "mangroves",
      label: "Mangroves",
      helpText: {
        text: ``,
        metric: "N/A",
        source: "",
        resolution: "",
        date: "",
        coverage: "Global",
        license: {
          link: "",
          text: "",
        },
        citation: {
          text: ``,
          link: "",
        },
      },
      iconKey: "ioiosconstruct",
      disable: true,
      subLayer: true,
      subLayerParent: "cvhabs",
      legend: false,
    },
    {
      id: "coral-reef",
      label: "Coral Reefs",
      helpText: {
        text: ``,
        metric: "N/A",
        source: "",
        resolution: "",
        date: "",
        coverage: "Global",
        license: {
          link: "",
          text: "",
        },
        citation: {
          text: ``,
          link: "",
        },
      },
      iconKey: "ioiosconstruct",
      disable: true,
      subLayer: true,
      subLayerParent: "cvhabs",
      legend: false,
    },
]

export const protectedLayers = [
    {
      id: "protected-points",
      label: "Protected points",
      helpText: {
        text: ``,
        metric: "N/A",
        source: "",
        resolution: "",
        date: "",
        coverage: "Global",
        license: {
          link: "",
          text: "",
        },
        citation: {
          text: ``,
          link: "",
        },
      },
      iconKey: "ioiosconstruct",
      disable: true,
      subLayer: true,
      subLayerParent: "protected-areas",
      legend: false,
    },
    {
      id: "protected-asia-pacific",
      label: "Protected areas",
      helpText: {
        text: ``,
        metric: "N/A",
        source: "",
        resolution: "",
        date: "",
        coverage: "Global",
        license: {
          link: "",
          text: "",
        },
        citation: {
          text: ``,
          link: "",
        },
      },
      iconKey: "ioiosconstruct",
      disable: true,
      subLayer: true,
      subLayerParent: "protected-areas",
      legend: false,
    },
    {
      id: "protected-la-caribbean",
      label: "Protected areas",
      helpText: {
        text: ``,
        metric: "N/A",
        source: "",
        resolution: "",
        date: "",
        coverage: "Global",
        license: {
          link: "",
          text: "",
        },
        citation: {
          text: ``,
          link: "",
        },
      },
      iconKey: "ioiosconstruct",
      disable: true,
      subLayer: true,
      subLayerParent: "protected-areas",
      legend: false,
    },
    {
      id: "protected-af-polar-wa",
      label: "Protected areas",
      helpText: {
        text: ``,
        metric: "N/A",
        source: "",
        resolution: "",
        date: "",
        coverage: "Global",
        license: {
          link: "",
          text: "",
        },
        citation: {
          text: ``,
          link: "",
        },
      },
      iconKey: "ioiosconstruct",
      disable: true,
      subLayer: true,
      subLayerParent: "protected-areas",
      legend: false,
    },
    {
      id: "protected-north-america",
      label: "Protected areas",
      helpText: {
        text: ``,
        metric: "N/A",
        source: "",
        resolution: "",
        date: "",
        coverage: "Global",
        license: {
          link: "",
          text: "",
        },
        citation: {
          text: ``,
          link: "",
        },
      },
      iconKey: "ioiosconstruct",
      disable: true,
      subLayer: true,
      subLayerParent: "protected-areas",
      legend: false,
    },
    {
      id: "protected-eu-0",
      label: "Protected areas",
      helpText: {
        text: ``,
        metric: "N/A",
        source: "",
        resolution: "",
        date: "",
        coverage: "Global",
        license: {
          link: "",
          text: "",
        },
        citation: {
          text: ``,
          link: "",
        },
      },
      iconKey: "ioiosconstruct",
      disable: true,
      subLayer: true,
      subLayerParent: "protected-areas",
      legend: false,
    },
    {
      id: "protected-eu-1",
      label: "Protected areas",
      helpText: {
        text: ``,
        metric: "N/A",
        source: "",
        resolution: "",
        date: "",
        coverage: "Global",
        license: {
          link: "",
          text: "",
        },
        citation: {
          text: ``,
          link: "",
        },
      },
      iconKey: "ioiosconstruct",
      disable: true,
      subLayer: true,
      subLayerParent: "protected-areas",
      legend: false,
    },
    {
      id: "protected-eu-2",
      label: "Protected areas",
      helpText: {
        text: ``,
        metric: "N/A",
        source: "",
        resolution: "",
        date: "",
        coverage: "Global",
        license: {
          link: "",
          text: "",
        },
        citation: {
          text: ``,
          link: "",
        },
      },
      iconKey: "ioiosconstruct",
      disable: true,
      subLayer: true,
      subLayerParent: "protected-areas",
      legend: false,
    },
]
