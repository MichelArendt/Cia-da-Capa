import React, { useState, useEffect } from 'react';

// Rename to reflect its purpose more clearly
export function ContentLoader({ fetchData, children, emptyMessage = "Vazio" }) {
  const [status, setStatus] = useState('LOADING');
  const [data, setData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchData();
        if (result && result.length > 0) {
          setData(result);
          setStatus('SUCCESS');
        } else {
          setStatus('EMPTY');
        }
      } catch (error) {
        console.error("Passed:", fetchData);
        console.error("Error fetching data:", error);
        setStatus('EMPTY');
      }
    };

    setStatus('LOADING');
    // Check if fetchData is a function before calling it
    if (typeof fetchData === 'function') {
      loadData();
    }
  }, [fetchData]);

  return (
    <div className="content-loader">
      {status === 'LOADING' && (
        <div className="loader">
          <div className="spinner"></div>
        </div>
      )}
      {status === 'SUCCESS' && children(data)}
      {status === 'EMPTY' && <div>{emptyMessage}</div>}
    </div>
  );
}

export default ContentLoader;