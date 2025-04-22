import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Sliders } from 'lucide-react';
import { TabContent } from './TabContent';
import { TabConfiguration } from './TabConfiguration';
import { TabFooter } from './TabFooter';
import { TabSystem } from './TabSystem';
import { INITIAL_TAB_CONFIG } from '../../constants/DashboardConstants';
import { saveConfiguration, getAllConfigurations } from './apis';

// Styles
const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        background: '#f9fafb',
        fontFamily: "'Inter', sans-serif"
    },
    header: {
        borderBottom: '1px solid #e5e7eb',
        background: 'white',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        zIndex: 10
    },
    headerContent: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.5rem 1rem'
    },
    titleContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
    },
    title: {
        fontFamily: "'Inter', sans-serif",
        fontSize: '1.25rem',
        fontWeight: 600,
        color: '#1f2937'
    },
    button: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.5rem',
        color: '#4b5563',
        borderRadius: '0.375rem',
        cursor: 'pointer',
        border: '1px solid #e5e7eb',
        background: 'white',
        fontFamily: "'Inter', sans-serif",
        transition: 'all 0.2s ease'
    },
    buttonText: {
        marginLeft: '0.25rem',
        fontWeight: 500,
        fontSize: '0.875rem'
    },
    mainContent: {
        display: 'flex',
        flex: 1,
        overflow: 'hidden'
    },
    sidebar: (isOpen) => ({
        flexShrink: 0,
        background: 'white',
        borderRight: '1px solid #e5e7eb',
        overflowY: 'auto',
        transition: 'width 0.3s ease',
        width: isOpen ? '16rem' : '0',
        display: 'block'
    }),
    contentArea: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
    },
    contentWrapper: {
        flex: 1,
        overflowY: 'auto',
        padding: '1.5rem'
    },
    footer: {
        background: 'white',
        borderTop: '1px solid #e5e7eb',
        padding: '0.5rem 1rem'
    },
    footerContent: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.75rem',
        color: '#6b7280',
        fontFamily: "'Inter', sans-serif"
    },
    loadingContent: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: '#6b7280',
        fontSize: '1.25rem',
        fontWeight: 500
    }
};

// Main Dashboard Component
const Dashboard = () => {
    // State to control the visibility of the config sidebar
    const [isNavOpen, setIsNavOpen] = useState(true);

    // Tab system state
    const [tabs, setTabs] = useState([]);
    const [activeTabId, setActiveTabId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Active configuration state
    const [activeConfig, setActiveConfig] = useState(INITIAL_TAB_CONFIG);

    // Fetch tabs from the API when the component mounts
    useEffect(() => {
        const fetchTabs = async () => {
            setIsLoading(true);  // Start loading
            try {
                const response = await getAllConfigurations();
                if (response.success) {
                    const initialTabs = response.data.map((config) => ({
                        id: config.id,  // Using the ID from the backend
                        name: config.name || 'New Tab',
                        config: config.config,
                    }));
                    setTabs(initialTabs);
                    setActiveTabId(initialTabs[0]?.id);
                    setActiveConfig(initialTabs[0]?.config);
                } else {
                    alert('Failed to load configurations');
                }
            } catch (error) {
                console.error('Error fetching configurations:', error);
                alert('Error fetching configurations');
            } finally {
                setIsLoading(false);  // Stop loading
            }
        };

        fetchTabs();
    }, []);  // Run this effect only once on mount

    // Toggle navigation sidebar
    const toggleNav = () => {
        setIsNavOpen(!isNavOpen);
    };

    // Add a new tab
    const addTab = () => {
        if (isLoading) return;

        const newTabId = crypto.randomUUID();  // Generate a new unique ID for the new tab
        const newTab = {
            id: newTabId,
            name: 'New Widget',
            config: {
                _tabTitle: '',
                dataSource: '',
                timeRange: { start: '', end: '' },
                envs: [],
                databases: [],
                module: [],
                clusterRegex: ''
            },
        };

        setTabs([...tabs, newTab]);
        setActiveTabId(newTabId);  // Set the new tab as the active tab
    };

    // Remove a tab
    const removeTab = (id, e) => {
        e.stopPropagation(); // Prevent the tab from being selected when clicking the remove button

        // Don't remove if it's the last tab
        if (tabs.length <= 1) return;

        const updatedTabs = tabs.filter((tab) => tab.id !== id);
        setTabs(updatedTabs);

        // If we're removing the active tab, activate the first tab
        if (id === activeTabId) {
            setActiveTabId(updatedTabs[0].id);
            setActiveConfig(updatedTabs[0].config);
        }
    };

    // Select a tab
    const selectTab = (id) => {
        setActiveTabId(id);

        // Find the tab and update the active configuration
        const selectedTab = tabs.find((tab) => tab.id === id);
        if (selectedTab) {
            setActiveConfig(selectedTab.config);
        }
    };

    // Update configuration for the active tab
    const updateActiveConfig = (newConfig) => {
        setActiveConfig(newConfig);
    };

    const applyConfig = async () => {
        try {
            const updatedTabs = tabs.map((tab) => {
                if (tab.id === activeTabId) {
                    const { _tabTitle, ...restConfig } = activeConfig;
                    return {
                        ...tab,
                        name: _tabTitle || tab.name,
                        config: restConfig,
                    };
                }
                return tab;
            });

            const cleanConfig = { ...activeConfig };
            const { _tabTitle, ...finalConfig } = cleanConfig;

            await saveConfiguration({
                tabId: activeTabId,
                name: _tabTitle || activeTab?.name,
                config: finalConfig,
            });

            setTabs(updatedTabs);
            alert('Configuration applied successfully!');
        } catch (error) {
            console.error('Error applying configuration:', error);
            alert('Failed to apply configuration. Please try again.');
        }
    };

    // Get the active tab
    const activeTab = tabs.find((tab) => tab.id === activeTabId) || null;

    return (
        <div style={styles.container}>
            {/* Header */}
            <header style={styles.header}>
                <div style={styles.headerContent}>
                    <div style={styles.titleContainer}>
                        <LayoutDashboard color="#2563eb" size={24} />
                        <h1 style={styles.title}>DataViz Dashboard</h1>
                    </div>
                    <div>
                        <button onClick={toggleNav} style={styles.button}>
                            <Sliders size={20} />
                            <span style={styles.buttonText}>
                                {isNavOpen ? 'Hide Config' : 'Show Config'}
                            </span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div style={styles.mainContent}>
                <div style={styles.sidebar(isNavOpen)}>
                    {isNavOpen && !isLoading && activeTab && (
                        <TabConfiguration
                            tab={activeTab}
                            config={activeConfig}
                            updateConfig={updateActiveConfig}
                            applyConfig={applyConfig}
                        />
                    )}
                </div>

                {/* Content Area with Tabs */}
                <div style={styles.contentArea}>
                    {/* Tab System */}
                    <TabSystem
                        tabs={tabs}
                        activeTabId={activeTabId}
                        selectTab={selectTab}
                        addTab={addTab}
                        removeTab={removeTab}
                        isLoading={isLoading}
                    />

                    {/* Content */}
                    <div style={styles.contentWrapper}>
                        {isLoading ? (
                            <div style={styles.loadingContent}>
                                Loading dashboard content...
                            </div>
                        ) : (
                            <TabContent
                                tab={activeTab}
                                config={activeConfig}
                            />
                        )}
                    </div>

                    {/* Tab Footer */}
                    {!isLoading && activeTab && (
                        <TabFooter tab={activeTab} />
                    )}
                </div>
            </div>

            {/* Dashboard Footer */}
            <footer style={styles.footer}>
                <div style={styles.footerContent}>
                    <div>© 2025 DataViz Dashboard</div>
                    <div>Last updated: April 21, 2025</div>
                </div>
            </footer>
        </div>
    );
};

export default Dashboard;
