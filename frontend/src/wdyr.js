import React from 'react';
import whyDidYouRender from '@welldone-software/why-did-you-render';

if (process.env.NODE_ENV !== 'production') {
  whyDidYouRender(React, {
    trackAllPureComponents: false, // Track only components explicitly marked
    trackHooks: true,              // Track hooks like useState, useEffect
    logOwnerReasons: false,              // Track hooks like useState, useEffect
  });

  console.log('why-did-you-render initialized');
}
