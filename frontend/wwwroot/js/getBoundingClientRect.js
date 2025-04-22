window.getBoundingClientRect = (element) => {
    if (!element) {
        console.error("Unable to get bounding rect for: " + element)
        return null;
    }
    //console.log("element.getBoundingClientRect():", JSON.stringify(element.getBoundingClientRect()));
    return element.getBoundingClientRect();
};