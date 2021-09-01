import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import * as d3 from "d3";

const D3Legend = (props) => {

  const d3Container = useRef(null);
  const numberStops = props.legendStyle[props.serviceType].colors.length - 1;
  const colors = props.legendStyle[props.serviceType].colors;
  let colorOffsets = [];
  colors.forEach((colorHex, index) => {
    const colorPct = ((index / numberStops) * 100.0).toFixed(2);
    colorOffsets.push(
      {offset: `${colorPct}%`, color: colorHex}
    );
  });

  useEffect(() => {
    console.log(colorOffsets);

    if(props.serviceType && d3Container.current){
      const svg = d3.select(d3Container.current);

      const defs = svg.append("defs");
      let linearGradient = defs.append("linearGradient")
        .attr("id", `linear-gradient-${props.serviceType}`);
      linearGradient.selectAll("stop")
        .data(colorOffsets)
        //.data([
          //{offset: "0%", color: props.legendStyle[props.serviceType].colors[0]},
          //{offset: "100%", color: props.legendStyle[props.serviceType].colors[1]}
        //])
        .enter().append("stop")
        .attr("offset", function(d) { return d.offset; })
        .attr("stop-color", function(d) { return d.color; });

      svg.append("rect")
        .attr("width", 220)
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
  legendStyle: PropTypes.object.isRequired,
}

export default D3Legend;
