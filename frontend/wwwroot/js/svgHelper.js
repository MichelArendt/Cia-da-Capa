window.getSvgViewBox = (element) => {
    if (!element) return "0 0 960 960"; // Default viewBox if element is null
    const pathElement = element.querySelector("path");
    if (pathElement) {
        const { x, y, width, height } = pathElement.getBBox();
        return `${x} ${y} ${width} ${height}`;
    }
    return "0 0 960 960";
};