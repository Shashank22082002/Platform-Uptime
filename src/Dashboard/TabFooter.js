// Tab Footer Component
const TabFooter = ({ tab }) => {
    const styles = {
      footer: {
        padding: '0.75rem 1rem',
        borderTop: '1px solid #e5e7eb',
        background: 'white'
      },
      footerContent: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.75rem',
        color: '#6b7280'
      }
    };
    
    return (
      <div style={styles.footer}>
        <div style={styles.footerContent}>
          <div>Tab ID: {tab?.id || 'Loading...'}</div>
          <div>Last updated: April 21, 2025</div>
        </div>
      </div>
    );
  };

  export { TabFooter}