import React from 'react';
import { svgPaths } from '../utils/svgPaths'; // Adjust the path if necessary

const Svg = ({ type, width = "24px", height = "24px", fill = "#fff", ...props }) => {
  const pathData = svgPaths[type];

  if (!pathData) {
    console.warn(`No SVG found for type: ${type}`);
    return null;
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={height}
      width={width}
      fill={fill}
      viewBox="0 -960 960 960"
      {...props}
    >
      <path d={pathData} />
    </svg>
  );
};

export default Svg;