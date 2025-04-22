import { PlusCircle, X } from 'lucide-react';

// Tab System Component - Manages tabs
const TabSystem = ({ tabs, activeTabId, selectTab, addTab, removeTab, isLoading }) => {
    const styles = {
      tabsBar: {
        display: 'flex',
        alignItems: 'center',
        background: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '0 0.5rem'
      },
      tabsContainer: {
        display: 'flex',
        flex: 1,
        overflowX: 'auto',
        msOverflowStyle: 'none', // Hide scrollbar in IE and Edge
        scrollbarWidth: 'none', // Hide scrollbar in Firefox
      },
      tab: (isActive) => ({
        display: 'flex',
        alignItems: 'center',
        padding: '0.75rem 1rem',
        marginRight: '0.25rem',
        borderRadius: '0.25rem 0.25rem 0 0',
        cursor: 'pointer',
        fontFamily: "'Inter', sans-serif",
        fontSize: '0.875rem',
        fontWeight: 500,
        color: isActive ? '#2563eb' : '#4b5563',
        background: isActive ? '#eff6ff' : 'transparent',
        borderBottom: isActive ? '2px solid #2563eb' : 'none',
        transition: 'all 0.2s ease'
      }),
      tabCloseIcon: {
        marginLeft: '0.5rem',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      },
      addTabButton: {
        display: 'flex',
        alignItems: 'center',
        marginLeft: '0.5rem',
        padding: '0.25rem 0.5rem',
        borderRadius: '0.25rem',
        background: 'transparent',
        border: 'none',
        color: '#2563eb',
        cursor: 'pointer',
        fontSize: '0.875rem',
        fontWeight: 500,
        transition: 'background 0.2s ease'
      },
      addTabText: {
        marginLeft: '0.25rem'
      }
    };
    
    return (
      <div style={styles.tabsBar}>
        <div style={styles.tabsContainer}>
          {isLoading ? (
            <div style={{ padding: '0.75rem 1rem', color: '#6b7280' }}>Loading tabs...</div>
          ) : (
            tabs.map(tab => (
              <div
                key={tab.id}
                style={styles.tab(tab.id === activeTabId)}
                onClick={() => selectTab(tab.id)}
              >
                {tab.name}
                {tabs.length > 1 && (
                  <span 
                    style={styles.tabCloseIcon} 
                    onClick={(e) => removeTab(tab.id, e)}
                  >
                    <X size={14} />
                  </span>
                )}
              </div>
            ))
          )}
        </div>
        <button 
          style={styles.addTabButton}
          onClick={addTab}
          disabled={isLoading}
        >
          <PlusCircle size={16} />
          <span style={styles.addTabText}>New Tab</span>
        </button>
      </div>
    );
  };

  export { TabSystem }