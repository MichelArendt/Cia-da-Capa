import React from 'react';
import { svgPaths } from '../utils/svgPaths'; // Adjust the path if necessary

const Svg = ({ type, width = "24px", height = "24px", fill, sizes, styleResponsive, ...props }) => {
  var pathData = svgPaths[type];

  if (sizes) {
    width = sizes[0];
    height = sizes[1]
  }

  if (!pathData) {
    console.warn(`No SVG found for type: ${type}`);
    pathData = svgPaths['block'];
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      fill={fill}
      viewBox="0 -960 960 960"
      {...props}
    >
      <path d={pathData} />
    </svg>
  );
};

export default Svg;