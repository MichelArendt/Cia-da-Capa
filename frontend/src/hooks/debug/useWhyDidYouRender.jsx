const useWhyDidYouRender = (component, options = {}) => {
  if (process.env.NODE_ENV === 'development') {
    component.whyDidYouRender = {
      logOnDifferentValues: true, // Logs prop/state differences causing re-renders
      ...options,                // Merge with any custom options passed
    };
  }
};

export default useWhyDidYouRender;