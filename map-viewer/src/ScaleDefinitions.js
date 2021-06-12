export const scales = [
    {
      id: "global",
      name: "Global:",
      label: "Compare ecosystem service values globally.",
      helpText: "Help text here.",
      iconKey: "fcglobe",
      defaultChecked: true,
    },
    {
      id: "national",
      name: "National:",
      label: "Identify hotspots of ecosystem service values within a country.",
      helpText: "Help text here.",
      iconKey: "giafrica",
      defaultChecked: false,
    },
    {
      id: "admin",
      name: "Department or State:",
      label: `Identify hotspots of ecoystem service values within a sub-national
              administrative unit (province, state, department, etc.)`,
      helpText: "Help text here.",
      iconKey: "fcglobe",
      defaultChecked: false,
    },
    {
      id: "watershed",
      name: "Watershed",
      label: `Watershed scale.`,
      helpText: "Help text here.",
      iconKey: "fcglobe",
      defaultChecked: false,
    },
    {
      id: "local",
      name: "Local:",
      label: `Provide an AOI (area of interest) and examine ecosystem service
              values in the surrounding area.`,
      helpText: "Help text here.",
      iconKey: "grmaplocation",
      defaultChecked: false,
    },
]

export const serviceMenuDetails = [
    {
      id: "sediment",
      label: "Clean water: sediment retention",
      helpText: "Help text here.",
      iconKey: "fcglobe",
    },
    {
      id: "nitrogen",
      label: "Clean water: nitrogen retention",
      helpText: "Help text here.",
      iconKey: "fcglobe",
    },
    {
      id: "pollination",
      label: "Crop pollination",
      helpText: "Help text here.",
      iconKey: "fcglobe",
    },
    {
      id: "coastal-protection",
      label: "Coastal storm risk reduction",
      helpText: "Help text here.",
      iconKey: "fcglobe",
    },
    {
      id: "nature-access",
      label: "Local nature access",
      helpText: "Help text here.",
      iconKey: "fcglobe",
    },
    {
      id: "grazing",
      label: "Livestock grazing",
      helpText: "Help text here.",
      iconKey: "fcglobe",
    },
]
