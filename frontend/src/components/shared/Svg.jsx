import React, { useState, useEffect, useRef } from 'react';
import { svgPaths } from '/src/utils/svgPaths'; // Adjust the path if necessary

const Svg = ({ type, width = 20, height = 20, fill, sizes, styleResponsive, ...props }) => {
  const svgEl = useRef(null);
  const [viewBox, setViewBox] = useState("0 0 960 960"); // Default viewBox

  let pathData = svgPaths[type];

  if (sizes) {
    width = sizes[0];
    height = sizes[1]
  }

  if (!pathData) {
    console.warn(`No SVG found for type: ${type}`);
    pathData = svgPaths['block'];
  }

  // Compute the viewBox after the component mounts
  useEffect(() => {
    if (svgEl.current) {
      const pathElement = svgEl.current.querySelector("path");
      if (pathElement) {
        const { x, y, width, height } = pathElement.getBBox();
        setViewBox(`${x} ${y} ${width} ${height}`);
      }
    }
  }, [type, pathData]);


  //   const { xMin, xMax, yMin, yMax } = [...svgEl.children].reduce((acc, el) => {
  //     const { x, y, width, height } = el.getBBox();
  //     if (!acc.xMin || x < acc.xMin) acc.xMin = x;
  //     if (!acc.xMax || x + width > acc.xMax) acc.xMax = x + width;
  //     if (!acc.yMin || y < acc.yMin) acc.yMin = y;
  //     if (!acc.yMax || y + height > acc.yMax) acc.yMax = y + height;
  //     return acc;
  //   }, {});


  // const viewbox = `${xMin} ${yMin} ${xMax - xMin} ${yMax - yMin}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      fill={fill}
      viewBox={viewBox}
      ref={svgEl}
      {...props}
    >
      <path d={pathData} />
    </svg>
  );
};

export default Svg;