import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import * as d3 from "d3";

const legendStyle = {
  'sediment': {
    id: 'sediment',
    name: 'Sediment Deposition Pct',
    colorStops: ['0', '100'],
    colors: ['#f2f2e6', '#664830'],
    },
  'nitrogen': {
    id: 'nitrogen',
    name: 'Nitrogen Pct',
    colorStops: ['0-26', '26-51', '51-76', '76-100', '101+'],
    colors: ['#dae1f2', '#114cab'],
  },
  'access': {
    id: 'access',
    name: 'Access to Nature Pct',
    colorStops: ['0-26', '26-51', '51-76', '76-100', '101+'],
    colors: ['#e5f2da', '#0e5720'],
  },
}

const D3Legend = (props) => {

  const d3Container = useRef(null);

  useEffect(() => {

    if(props.serviceType && d3Container.current){
      const svg = d3.select(d3Container.current);

      const defs = svg.append("defs");
      let linearGradient = defs.append("linearGradient")
        .attr("id", `linear-gradient-${props.serviceType}`);
      linearGradient.selectAll("stop")
        .data([
          {offset: "0%", color: legendStyle[props.serviceType].colors[0]},
          {offset: "100%", color: legendStyle[props.serviceType].colors[1]}
        ])
        .enter().append("stop")
        .attr("offset", function(d) { return d.offset; })
        .attr("stop-color", function(d) { return d.color; });

      svg.append("rect")
        .attr("width", 200)
        .attr("height", 15)
        .style("fill", `url(#linear-gradient-${props.serviceType})`);

      defs.exit()
        .remove();
    }
  },
  //React Hook useEffect has an unnecessary dependency: 'd3Container.current'.
  //Either exclude it or remove the dependency array. Mutable values like 
  //'d3Container.current' aren't valid dependencies because mutating them 
  //doesn't re-render the component  react-hooks/exhaustive-deps
  //[props.serviceType, d3Container.current])
  [props.serviceType])

  return (
    <>
      <svg
        className="d3-legend"
        ref={d3Container}
      />
      <span className="d3-x-axis">Low</span>
      <span className="d3-x-axis">Med</span>
      <span className="d3-x-axis">High</span>
    </>
  );
}

D3Legend.propTypes = {
  serviceType: PropTypes.string.isRequired,
}

export default D3Legend;
