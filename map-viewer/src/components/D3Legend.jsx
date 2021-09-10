import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import * as d3 from "d3";

function formatColors(colors, numberStops) {
    let colorOffsets = [];
    colors.forEach((colorHex, index) => {
      const colorPct = ((index / numberStops) * 100.0).toFixed(2);
      colorOffsets.push(
        {offset: `${colorPct}%`, color: colorHex}
      );
    });
  return colorOffsets;
}

const D3Legend = (props) => {

  const d3Container = useRef(null);
  //const svgEl = d3.select(d3Container.current);
  //svgEl.selectAll("*").remove();

  useEffect(() => {
    if(props.serviceType && d3Container.current){
      const numberStops = props.legendStyle[props.serviceType].colors.length - 1;
      const colors = props.legendStyle[props.serviceType].colors;
      const colorOffsets = formatColors(colors, numberStops);

      console.log("d3 legend useeffect");
      const svg = d3.select(d3Container.current);
      // This line is key in having a removed legends color not replace an
      // existing legends color. I wonder if this should go in a cleanup
      // function, like ComponentWillUnmount
      svg.selectAll("*").remove();

      if(props.legendStyle[props.serviceType].type === 'ordinal'){
        const keys = props.legendStyle[props.serviceType].colorKeys;
        const colors = props.legendStyle[props.serviceType].colors;

        const size = 20;
        svg.selectAll("mydots")
          .data(keys)
          .enter()
          .append("rect")
            //.attr("x", 100)
            .attr("y", function(d,i){ return i*(size+5)})
            .attr("width", size)
            .attr("height", size)
            .style("fill", function(d,i){ return colors[i]});

        svg.selectAll("mylabels")
          .data(keys)
          .enter()
          .append("text")
            .attr("x", 10 + size*1.2)
            .attr("y", function(d,i){ return i*(size+5) + (size/2)})
            .text(function(d){ return d})
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle");

      }
      else{
        const defUpdate = svg.selectAll("defs").data([1]);
        const defEnter = defUpdate.enter().append("defs");
        defEnter.append("linearGradient");

        const linearGradient = defUpdate.merge(defEnter);
        linearGradient
          .select("linearGradient")
          .attr("id", `linear-gradient-${props.serviceType}`)
          .selectAll("stop")
          .data(colorOffsets)
          .enter().append("stop")
          .attr("offset", function(d) { return d.offset; })
          .attr("stop-color", function(d) { return d.color; });

        defUpdate.exit().remove();

        const update = svg.selectAll("g").data([1]);

        const enter = update.enter().append("g");
        //enter.selectAll("rect").remove();
        enter.append("rect");

        const bar = update.merge(enter);

        bar
          .select("rect")
          .attr("width", 220)
          .attr("height", 15)
          .style("fill", `url(#linear-gradient-${props.serviceType})`);
          //.style("fill", `${colors[1]}`);

        update.exit().remove();
      }
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
        className={"d3-legend " + props.legendStyle[props.serviceType].type}
        ref={d3Container}
      />
      {props.legendStyle[props.serviceType].type !== 'ordinal' &&
        <>
          <span className="d3-x-axis">Low</span>
          <span className="d3-x-axis">Med</span>
          <span className="d3-x-axis">High</span>
        </>
      }
    </>
  );
}

D3Legend.propTypes = {
  serviceType: PropTypes.string.isRequired,
  legendStyle: PropTypes.object.isRequired,
}

export default D3Legend;
