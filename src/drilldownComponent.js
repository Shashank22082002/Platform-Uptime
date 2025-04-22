// ... existing code above ...


const thStyle = {
    backgroundColor: '#f5f5f5',
    padding: '10px',
    textAlign: 'left',
    borderBottom: '1px solid #ddd',
    cursor: 'pointer'
  };
  
  const tdStyle = {
    padding: '10px',
    borderBottom: '1px solid #ddd'
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '16px'
  };

const DrilldownTable = ({ sortedDrilldown, sortConfig, handleSort }) => {
  if (!sortedDrilldown || Object.keys(sortedDrilldown).length === 0) {
    return <p style={{ color: '#666' }}>No incident details available for this month.</p>;
  }

  return (
    <>
      {Object.entries(sortedDrilldown).map(([category, items]) => (
        <div key={category} style={{ marginBottom: '32px', overflowX: 'auto' }}>
          <h4 style={{ margin: '16px 0 8px 0', fontWeight: 600 }}>{category}</h4>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th 
                  style={thStyle}
                  onClick={() => handleSort('database')}
                >
                  Database
                  {sortConfig.key === 'database' && (
                    <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                  )}
                </th>
                <th 
                  style={thStyle}
                  onClick={() => handleSort('cluster')}
                >
                  Cluster
                  {sortConfig.key === 'cluster' && (
                    <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                  )}
                </th>
                <th 
                  style={thStyle}
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
                  <td style={tdStyle}>{item.database}</td>
                  <td style={tdStyle}>{item.cluster}</td>
                  <td style={{...tdStyle, textAlign: 'right'}}>{item.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </>
  );
};

export  {DrilldownTable};