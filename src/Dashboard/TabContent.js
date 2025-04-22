import { Settings } from 'lucide-react';
import UptimeComponent from '../uptimeDashboard';
import { StatsHeatmap } from './StatsHeatmap';


const moduleOptions = [
  { id: 'uptime', label: 'Uptime' },
  { id: 'performance', label: 'Performance' },
  { id: 'security', label: 'Security' },
  { id: 'errors', label: 'Errors' }
];

const TabContent = ({ tab, config }) => {
  const getModuleLabel = (id) => moduleOptions.find(m => m.id === id)?.label || 'Not set';

  const styles = {
    contentBox: {
      background: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '0.5rem',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
      padding: '1rem',
      height: '100%'
    },
    contentCenter: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      textAlign: 'center'
    },
    contentIcon: {
      color: '#2563eb',
      marginBottom: '1rem'
    },
    contentTitle: {
      fontSize: '1.25rem',
      fontWeight: 600,
      color: '#1f2937',
      marginBottom: '0.5rem',
      fontFamily: "'Inter', sans-serif"
    },
    contentText: {
      color: '#4b5563',
      maxWidth: '28rem',
      fontFamily: "'Inter', sans-serif'",
      marginBottom: '1.5rem'
    },
    configSummary: {
      background: '#f3f4f6',
      border: '1px solid #e5e7eb',
      borderRadius: '0.5rem',
      padding: '1rem',
      maxWidth: '28rem',
      margin: '0 auto'
    },
    configSummaryTitle: {
      fontSize: '0.875rem',
      fontWeight: 600,
      color: '#374151',
      marginBottom: '0.5rem'
    },
    configSummaryItem: {
      fontSize: '0.875rem',
      color: '#4b5563',
      margin: '0.25rem 0'
    }
  };

  console.log('TabContent: tab', tab);

  return (
    <div style={styles.contentBox}>
      <div style={styles.contentCenter}>
        <Settings size={48} style={styles.contentIcon} />
        <h2 style={styles.contentTitle}>{tab?.name || 'Untitled Tab'}</h2>
        <p style={styles.contentText}>
          Configure this widget using the panel on the left. Settings below reflect the current configuration.
        </p>

        <div style={styles.configSummary}>
          <div style={styles.configSummaryTitle}>Widget Configuration</div>
          <div style={styles.configSummaryItem}>
            <strong>Data Source:</strong> {config?.dataSource || 'Not set'}
          </div>
          <div style={styles.configSummaryItem}>
            <strong>Time Range:</strong> {(config?.timeRange?.start || 'Not set')} to {(config?.timeRange?.end || 'Not set')}
          </div>
          <div style={styles.configSummaryItem}>
            <strong>Environments:</strong> {Array.isArray(config?.envs) && config.envs.length > 0 ? config.envs.join(', ') : 'None selected'}
          </div>
          <div style={styles.configSummaryItem}>
            <strong>Module:</strong> {getModuleLabel(config?.module)}
          </div>
          <div style={styles.configSummaryItem}>
            <strong>Databases:</strong> {Array.isArray(config?.databases) && config.databases.length > 0 ? config.databases.join(', ') : 'None selected'}
          </div>
          <div style={styles.configSummaryItem}>
            <strong>Cluster Regex:</strong> {config?.clusterRegex || 'Not set'}
          </div>
        </div>

        <StatsHeatmap config={tab}/>

      </div>
      <UptimeComponent tab={tab} />
    </div>
  );
};

export { TabContent };
