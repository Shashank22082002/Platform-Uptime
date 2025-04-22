import { useEffect, useState } from 'react';
import { getStats } from './apis';


const StatsHeatmap = ({ config }) => {
    console.log("Recieved Stats Config in stats heatmap" , statsConfig);

    if (!config || Object.keys(config).length === 0) {
        return <p style={{ color: '#666' }}>Invalid Config recieved.</p>;
    }

    useEffect(() => {
        const loadStats = async () => {
          setLoading(true);
          setError(null);
          try {
            // Use config ID if available, otherwise use default
            const configId = config?.id || 'DEFAULT_WIDGET_ID';
            const response = await getStats(configId);
            
            if (response.success === false) {
              throw new Error(response.error || 'Failed to fetch stats');
            }
            
            // Process stats data into correct format
            const uptimeTable = processStatsResponse(response.data);
            
            setStatsTable(uptimeTable);
            if (uptimeTable && Object.keys(uptimeTable).length > 0) {
              setSelectedEnv(Object.keys(uptimeTable)[0]);
            }
            processHeatmapData(uptimeTable);
          } catch (err) {
            setError(err.message || 'Failed to fetch stats');
          } finally {
            setLoading(false);
          }
        };
        
        loadStats();
      }, [config]);

}

export {StatsHeatmap}