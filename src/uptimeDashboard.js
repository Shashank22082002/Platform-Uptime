import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { getDrilldown, getStats } from './Dashboard/apis';

const COLORS = ['#4caf50', '#f44336'];
const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

// Styles
const styles = {
  container: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    margin: '20px auto',
    width: '100%'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    flexWrap: 'wrap'
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '0',
    background: 'linear-gradient(90deg, #00bcd4 0%, #4caf50 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  heatmapContainer: {
    overflowX: 'auto',
    marginBottom: '32px'
  },
  heatmapTable: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px'
  },
  heatmapHeader: {
    padding: '12px',
    textAlign: 'center',
    fontWeight: '600',
    backgroundColor: '#f5f5f5',
    position: 'relative'
  },
  heatmapCell: (value) => ({
    padding: '12px',
    textAlign: 'center',
    fontWeight: value >= 99.99 ? '600' : '400',
    backgroundColor: getCellBackgroundColor(value),
    cursor: value !== null ? 'pointer' : 'default',
    transition: 'all 0.2s ease',
    position: 'relative'
  }),
  statContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '16px',
    marginBottom: '32px'
  },
  statCard: (color) => ({
    backgroundColor: color === 'blue' ? '#e3f2fd' : color === 'green' ? '#e8f5e9' : '#ffebee',
    padding: '16px',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  }),
  statTitle: {
    fontSize: '18px',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: '8px'
  },
  statValue: (color) => ({
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center',
    color: color === 'blue' ? '#1976d2' : color === 'green' ? '#388e3c' : '#d32f2f'
  }),
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '16px'
  },
  chartContainer: {
    height: '400px',
    marginBottom: '32px'
  },
  button: {
    backgroundColor: '#f5f5f5',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    marginLeft: '8px',
    cursor: 'pointer'
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '300px',
    fontSize: '20px'
  },
  error: {
    backgroundColor: '#ffebee',
    padding: '16px',
    borderRadius: '4px',
    color: '#d32f2f'
  },
  noData: {
    backgroundColor: '#fff9c4',
    padding: '16px',
    borderRadius: '4px',
    color: '#f57f17'
  },
  legendContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
    marginTop: '16px'
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center'
  },
  legendColor: (color) => ({
    width: '20px',
    height: '20px',
    backgroundColor: color,
    marginRight: '8px'
  }),
  drilldownSection: {
    marginBottom: '32px'
  },
  pieChartGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px'
  },
  summaryContainer: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '16px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  },
  summaryTitle: {
    fontSize: '18px',
    fontWeight: '500',
    marginBottom: '12px'
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px'
  },
  summaryCard: (color) => ({
    backgroundColor: color,
    padding: '12px',
    borderRadius: '4px'
  }),
  summaryLabel: {
    fontSize: '14px',
    color: '#666'
  },
  summaryValue: (color) => ({
    fontSize: '20px',
    fontWeight: 'bold',
    color: color
  }),
  drilldownTable: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '16px'
  },
  tableHeader: {
    backgroundColor: '#f5f5f5',
    padding: '10px',
    textAlign: 'left',
    borderBottom: '1px solid #ddd',
    cursor: 'pointer'
  },
  tableCell: {
    padding: '10px',
    borderBottom: '1px solid #ddd'
  },
  clickPrompt: {
    fontSize: '14px',
    color: '#666',
    textAlign: 'center'
  }
};

// Function to determine cell background color based on uptime percentage
const getCellBackgroundColor = (value) => {
  if (value === null) return '#f4f4f5'; // Soft neutral gray

  if (value >= 99.99) return '#e6f3ea'; // Soft sage green
  if (value >= 99.9) return '#e0f2f1'; // Mint seafoam
  if (value >= 99.5) return '#fff5e6'; // Soft peach
  if (value >= 99.0) return '#f0f4f8'; // Pale blue-gray
  if (value >= 98.0) return '#faf5e6'; // Light buttercream
  if (value >= 95.0) return '#fff0e6'; // Soft coral
  return '#ffebee'; // Soft pastel red
};

// Format month for better display in the header
const formatMonth = (monthStr) => {
  if (!monthStr) return '';
  const [month, year] = monthStr.split('/');
  // Convert year to short format (e.g., '24)
  const shortYear = year.slice(2);
  return `${month}/${shortYear}`;
};

// DrilldownTable Component
const DrilldownTable = ({ data, sortConfig, handleSort }) => {
  if (!data || Object.keys(data).length === 0) {
    return <p style={{ color: '#666' }}>No incident details available for this month.</p>;
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      {Object.entries(data).map(([category, items]) => (
        <div key={category} style={{ marginBottom: '24px' }}>
          <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>{category}</h4>
          <table style={styles.drilldownTable}>
            <thead>
              <tr>
                <th 
                  style={styles.tableHeader}
                  onClick={() => handleSort('database')}
                >
                  Database
                  {sortConfig.key === 'database' && (
                    <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                  )}
                </th>
                <th 
                  style={styles.tableHeader}
                  onClick={() => handleSort('cluster')}
                >
                  Cluster
                  {sortConfig.key === 'cluster' && (
                    <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                  )}
                </th>
                <th 
                  style={styles.tableHeader}
                  onClick={() => handleSort('count')}
                >
                  Incident Count
                  {sortConfig.key === 'count' && (
                    <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                  )}
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white' }}>
                  <td style={styles.tableCell}>{item.database}</td>
                  <td style={styles.tableCell}>{item.cluster}</td>
                  <td style={{ ...styles.tableCell, textAlign: 'right' }}>{item.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

const UptimeDashboard = ({ config }) => {
  // State
  const [statsTable, setStatsTable] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEnv, setSelectedEnv] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [showDrilldown, setShowDrilldown] = useState(false);
  const [drilldownData, setDrilldownData] = useState({});
  const [sortedDrilldown, setSortedDrilldown] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: 'count', direction: 'desc' });
  const [heatmapData, setHeatmapData] = useState([]);
  const [heatmapMonths, setHeatmapMonths] = useState([]);

  // Fetch stats data
  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      setError(null);
      try {
        // Use config ID if available, otherwise use default
        const configId = config?.id || 'DEFAULT_WIDGET_ID';
        console.log('configId', configId);
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

  // Process stats API response
  const processStatsResponse = (data) => {
    if (!Array.isArray(data)) return null;
    
    const uptimeTable = {};
    data.forEach(item => {
      const env = item.env;
      const month = item.month;
      const uptime = item.uptime != null ? Math.round(item.uptime * 100) / 100 : null;
      const incidents = item.red_cells != null ? item.red_cells : 0;
      const maxTotal = item.max_total_cells;

      if (!uptimeTable[env]) uptimeTable[env] = {};
      uptimeTable[env][month] = { 
        "uptime": uptime, 
        "red": incidents, 
        "green": maxTotal - incidents, 
        "total": maxTotal 
      };
    });

    return uptimeTable;
  };

  // Fetch drilldown data
  useEffect(() => {
    const loadDrilldown = async () => {
      if (selectedEnv && selectedMonth) {
        setDrilldownData({});
        setSortedDrilldown({});
        try {
          const configId = config?.id || 'DEFAULT_WIDGET_ID';
          const response = await getDrilldown(configId, selectedEnv, selectedMonth);
          
          if (response.success === false) {
            throw new Error(response.error || 'Failed to fetch drilldown data');
          }
          
          setDrilldownData(response.data || {});
        } catch (err) {
          console.error('Failed to fetch drilldown:', err);
          setDrilldownData({});
        }
      } else {
        setDrilldownData({});
        setSortedDrilldown({});
      }
    };
    
    loadDrilldown();
  }, [selectedEnv, selectedMonth, config]);

  // Sort drilldown data when data or sortConfig changes
  useEffect(() => {
    if (drilldownData && Object.keys(drilldownData).length > 0) {
      const sorted = {};
      Object.entries(drilldownData).forEach(([category, items]) => {
        sorted[category] = [...items].sort((a, b) => {
          if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
          if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
          return 0;
        });
      });
      setSortedDrilldown(sorted);
    } else {
      setSortedDrilldown({});
    }
  }, [drilldownData, sortConfig]);

  // Processing heatmap data
  const processHeatmapData = (uptimeTable) => {
    if (!uptimeTable) return;

    // Collect all unique months across all environments
    const allMonths = new Set();
    Object.values(uptimeTable).forEach(envData => {
      Object.keys(envData).forEach(month => allMonths.add(month));
    });

    // Sort months chronologically
    const sortedMonths = Array.from(allMonths).sort((a, b) => {
      const [aMonth, aYear] = a.split('/');
      const [bMonth, bYear] = b.split('/');

      if (aYear !== bYear) return parseInt(aYear) - parseInt(bYear);
      return MONTHS.indexOf(aMonth) - MONTHS.indexOf(bMonth);
    });
    setHeatmapMonths(sortedMonths);

    // Sort environments, putting prod environments first
    const sortedEnvs = Object.keys(uptimeTable).sort((a, b) => {
      const getSortKey = (env) => {
        if (!env.startsWith('prod')) return [0, env]; // Non-prod envs first, sorted alphabetically
        if (env === 'prod0') return [1, 0];
        if (env === 'prod') return [1, 1];

        const match = env.match(/^prod(\d+)$/);
        if (match) return [1, parseInt(match[1], 10)];

        return [2, env]; // fallback
      };

      const [aGroup, aValue] = getSortKey(a);
      const [bGroup, bValue] = getSortKey(b);

      if (aGroup !== bGroup) return aGroup - bGroup;
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue);
      }
      return aValue - bValue;
    });

    // Create heatmap data
    const heatmap = sortedEnvs.map(env => {
      const envRow = { env };

      sortedMonths.forEach(month => {
        const envData = uptimeTable[env][month];
        if (envData) {
          const uptimePercentage = envData["uptime"] || 100;
          envRow[month] = parseFloat(uptimePercentage);
        } else {
          envRow[month] = null; // No data for this month
        }
      });

      return envRow;
    });

    setHeatmapData(heatmap);
  };

  // Handler functions
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleHeatmapCellClick = (env, month) => {
    setSelectedEnv(env);
    setSelectedMonth(month);
    setShowDrilldown(true);

    // Scroll to the drilldown section
    setTimeout(() => {
      const drilldownElement = document.getElementById('drilldown-section');
      if (drilldownElement) {
        drilldownElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleBarClick = (data) => {
    setSelectedMonth(data.monthYear);
    setShowDrilldown(true);
  };

  // Prepare chart data for selected environment
  const prepareChartData = () => {
    const chartData = [];

    if (statsTable && selectedEnv && statsTable[selectedEnv]) {
      const envData = statsTable[selectedEnv];

      Object.entries(envData).forEach(([monthYear, statValues]) => {
        const [month, year] = monthYear.split('/');

        chartData.push({
          name: `${month}/${year}`,
          monthYear: monthYear,
          uptime: statValues.uptime,
          green: statValues.green,
          incidents: statValues.red,
          total: statValues.total
        });
      });

      // Sort chronologically
      chartData.sort((a, b) => {
        const [aMonth, aYear] = a.monthYear.split('/');
        const [bMonth, bYear] = b.monthYear.split('/');

        if (aYear !== bYear) return parseInt(aYear) - parseInt(bYear);
        return MONTHS.indexOf(aMonth) - MONTHS.indexOf(bMonth);
      });
    }

    return chartData;
  };

  // Loading, error, and no data states
  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div style={styles.error}>Error: {error}</div>;
  }

  if (!statsTable) {
    return <div style={styles.noData}>No data available</div>;
  }

  const chartData = prepareChartData();
  
  // Prepare pie chart data for selected environment and month
  const pieData = selectedMonth && statsTable && selectedEnv && statsTable[selectedEnv][selectedMonth] ? [
    { name: 'Uptime', value: statsTable[selectedEnv][selectedMonth].green || 0 },
    { name: 'Incidents', value: statsTable[selectedEnv][selectedMonth].red || 0 }
  ] : [];

  // Calculate statistics
  const totalGreen = chartData.reduce((acc, curr) => acc + curr.green, 0);
  const totalIncidents = chartData.reduce((acc, curr) => acc + curr.incidents, 0);
  const averageUptimePercentage = chartData.length > 0 ?
    ((totalGreen / (totalGreen + totalIncidents)) * 100).toFixed(2) : 0;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Platform Uptime Dashboard</h1>
      </div>

      <div style={styles.heatmapContainer}>
        <h2 style={styles.sectionTitle}>Platform Uptime (%)</h2>
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '16px' }}>
          Click on any cell to see detailed incident information
        </p>

        <div style={styles.heatmapContainer}>
          <table style={styles.heatmapTable}>
            <thead>
              <tr>
                <th style={{ ...styles.heatmapHeader, textAlign: 'left', minWidth: '120px' }}>Environment</th>
                {heatmapMonths.map(month => (
                  <th key={month} style={styles.heatmapHeader}>
                    {formatMonth(month)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {heatmapData.map(row => (
                <tr key={row.env}>
                  <td style={{ ...styles.heatmapCell(null), textAlign: 'left', fontWeight: '600' }}>{row.env}</td>
                  {heatmapMonths.map(month => (
                    <td
                      key={`${row.env}-${month}`}
                      style={styles.heatmapCell(row[month])}
                      onClick={() => row[month] !== null && handleHeatmapCellClick(row.env, month)}
                      title={row[month] !== null ? `${row.env} - ${month}: ${row[month]}%` : 'No data'}
                    >
                      {row[month] !== null ? (row[month] === 100 ? '100' : row[month]) : '-'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={styles.legendContainer}>
          <div style={styles.legendItem}>
            <div style={styles.legendColor('#e8f5e9')}></div>
            <span>100%</span>
          </div>
          <div style={styles.legendItem}>
            <div style={styles.legendColor('#f1f8e9')}></div>
            <span>≥99.9%</span>
          </div>
          <div style={styles.legendItem}>
            <div style={styles.legendColor('#fffde7')}></div>
            <span>≥99.5%</span>
          </div>
          <div style={styles.legendItem}>
            <div style={styles.legendColor('#fff8e1')}></div>
            <span>≥99.0%</span>
          </div>
          <div style={styles.legendItem}>
            <div style={styles.legendColor('#fff3e0')}></div>
            <span>≥98.0%</span>
          </div>
          <div style={styles.legendItem}>
            <div style={styles.legendColor('#fbe9e7')}></div>
            <span>≥95.0%</span>
          </div>
          <div style={styles.legendItem}>
            <div style={styles.legendColor('#ffebee')}></div>
            <span>&lt;95.0%</span>
          </div>
        </div>
      </div>

      <div style={styles.statContainer}>
        <div style={styles.statCard('blue')}>
          <h2 style={styles.statTitle}>Total Months</h2>
          <p style={styles.statValue('blue')}>{chartData.length}</p>
        </div>
        <div style={styles.statCard('green')}>
          <h2 style={styles.statTitle}>Average Uptime</h2>
          <p style={styles.statValue('green')}>{averageUptimePercentage}%</p>
        </div>
        <div style={styles.statCard('red')}>
          <h2 style={styles.statTitle}>Total Incidents</h2>
          <p style={styles.statValue('red')}>{totalIncidents}</p>
        </div>
      </div>

      <div style={{ marginBottom: '32px' }}>
        <h2 style={styles.sectionTitle}>Monthly Uptime Statistics for {selectedEnv}</h2>
        <div style={styles.chartContainer}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              barSize={20}
              onClick={(e) => e && e.activePayload && handleBarClick(e.activePayload[0].payload)}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={70}
                tick={{ fontSize: 12 }}
              />
              <YAxis />
              <Tooltip
                formatter={(value, name) => {
                  if (name === 'uptime') return `${value}%`;
                  return value;
                }}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Legend />
              <Bar
                dataKey="green"
                fill="#4caf50"
                name="Uptime"
                stackId="a"
              />
              <Bar
                dataKey="incidents"
                fill="#f44336"
                name="Incidents"
                stackId="a"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p style={styles.clickPrompt}>Click on a bar to view detailed incident information for that month</p>
      </div>

      {selectedMonth && (
        <div id="drilldown-section" style={styles.drilldownSection}>
          <h2 style={styles.sectionTitle}>
            Uptime for {selectedEnv} - {selectedMonth}
            <button
              style={styles.button}
              onClick={() => setShowDrilldown(!showDrilldown)}
            >
              {showDrilldown ? 'Hide Details' : 'Show Details'}
            </button>
          </h2>

          <div style={styles.pieChartGrid}>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => value} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div>
              <div style={styles.summaryContainer}>
                <h3 style={styles.summaryTitle}>Summary</h3>
                <div style={styles.summaryGrid}>
                  <div style={styles.summaryCard('#e8f5e9')}>
                    <p style={styles.summaryLabel}>Total Uptime</p>
                    <p style={styles.summaryValue('#388e3c')}>
                      {pieData[0]?.value || 0}
                    </p>
                  </div>
                  <div style={styles.summaryCard('#ffebee')}>
                    <p style={styles.summaryLabel}>Total Incidents</p>
                    <p style={styles.summaryValue('#d32f2f')}>
                      {pieData[1]?.value || 0}
                    </p>
                  </div>
                  <div style={styles.summaryCard('#e3f2fd')}>
                    <p style={styles.summaryLabel}>Uptime Percentage</p>
                    <p style={styles.summaryValue('#1976d2')}>
                      {pieData.length > 0 ?
                        ((pieData[0].value / (pieData[0].value + pieData[1].value)) * 100).toFixed(2) : 0}%
                    </p>
                  </div>
                  <div style={styles.summaryCard('#f3e5f5')}>
                    <p style={styles.summaryLabel}>Total Records</p>
                    <p style={styles.summaryValue('#7b1fa2')}>
                      {pieData.reduce((sum, item) => sum + item.value, 0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {showDrilldown && (
            <div style={{ marginTop: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>Incident Details</h3>
              <DrilldownTable
                data={sortedDrilldown}
                sortConfig={sortConfig}
                handleSort={handleSort}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UptimeDashboard;