import React, { useEffect, useState } from 'react';
import Diagram from './components/Diagram';

function App() {
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });

  useEffect(() => {
    // Listen for messages from the VS Code extension
    const handleMessage = (event: MessageEvent) => {
      if (event.data.command === 'updateGraph') {
        setGraphData(event.data.data);
      }
    };

    // Add the event listener
    window.addEventListener('message', handleMessage);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Diagram initialData={graphData} />
    </div>
  );
}

export default App;