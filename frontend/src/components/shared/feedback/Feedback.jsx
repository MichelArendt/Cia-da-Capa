import React from 'react';
import PropTypes from 'prop-types';
// import './Message.scss'; // Import styles for the component

const Feedback = ({ type, children }) => {
  if (!children) return null; // Don't render anything if there's no content

  return <div className={`feedback feedback--${type}`}>{children}</div>;
};

Feedback.propTypes = {
  type: PropTypes.oneOf(['success', 'error', 'info', 'warning']).isRequired, // Restrict to specific types
  children: PropTypes.node, // Content inside the feedback
};

export default Feedback;