import React, { useState, useEffect, ReactNode } from 'react';

// Exporting the Status enum for use in parent components
export enum ContentLoaderStatus {
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  EMPTY = 'EMPTY',
}

// Define the props for the uncontrolled mode (using fetchData)
interface UncontrolledProps<T> {
  fetchData: () => Promise<T[]>;        // Function to fetch data
  displayMessage?: string;              // Message displayed during loading
  fallbackContent?: ReactNode;          // Content displayed when data is empty
  children: (data: T[]) => ReactNode;   // Render prop to render the data
}

// Define the props for the controlled mode (parent provides status and data)
interface ControlledProps<T> {
  status?: ContentLoaderStatus;         // Status provided by parent (defaults to LOADING)
  data?: T[];                           // Data provided by parent (defaults to empty array)
  displayMessage?: string;              // Message displayed during loading
  fallbackContent?: ReactNode;          // Content displayed when data is empty
  children?: (data: T[]) => ReactNode;  // Optional render prop to render the data
}

// Combine the two prop types into a union type
type ContentLoaderProps<T> = UncontrolledProps<T> | ControlledProps<T>;

const ContentLoader = <T,>(props: ContentLoaderProps<T>) => {
  // State for internal status and data (used in uncontrolled mode)
  const [internalStatus, setInternalStatus] = useState<ContentLoaderStatus>(ContentLoaderStatus.LOADING);
  const [internalData, setInternalData] = useState<T[]>([]);

  // Variables for current status and data, used in both modes
  let currentStatus: ContentLoaderStatus;
  let currentData: T[] | undefined;
  const { displayMessage = 'Carregando...', fallbackContent = 'Vazio' } = props;

  if ('fetchData' in props) {
    // Uncontrolled mode: component manages its own state
    const {
      fetchData,
      children,
    } = props;
    currentStatus = internalStatus;
    currentData = internalData;

    useEffect(() => {
      const loadData = async () => {
        try {
          // Fetch data using the provided fetchData function
          const result = await fetchData();
          if (result && result.length > 0) {
            // Data fetched successfully
            setInternalData(result);
            setInternalStatus(ContentLoaderStatus.SUCCESS);
          } else {
            // No data returned
            setInternalStatus(ContentLoaderStatus.EMPTY);
          }
        } catch (error) {
          // console.error('Passed:', fetchData);
          console.error('Error fetching data:', error);
          // Error occurred while fetching data
          setInternalStatus(ContentLoaderStatus.EMPTY);
        }
      };

      // Start loading data
      setInternalStatus(ContentLoaderStatus.LOADING);
      loadData();
    }, [fetchData]);
  } else {
    // Controlled mode: parent provides status and data
    const {
      status = ContentLoaderStatus.LOADING,  // Default status to LOADING
      data = [],                             // Default data to empty array
      children,
    } = props;
    currentStatus = status;
    currentData = data;
  }

  // UseEffect to log currentStatus in both modes
  useEffect(() => {
    console.log('ContentLoader status:', currentStatus);
  }, [currentStatus]);

  // Rendering logic based on currentStatus
  return (
    <div className="content-loader">
      {currentStatus === ContentLoaderStatus.LOADING && (
        <>
          <div className="content-loader__spinner-container">
            <div className="content-loader__spinner"></div>
          </div>
          {displayMessage && <span>{displayMessage}</span>}
        </>
      )}
      {currentStatus === ContentLoaderStatus.SUCCESS && currentData && props.children && props.children(currentData)}
      {currentStatus === ContentLoaderStatus.EMPTY && fallbackContent}
    </div>
  );
};

export default ContentLoader;
