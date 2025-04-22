import React, { useState, useEffect } from 'react';
import { getEnvOptions, getDatabaseOptions, getModuleOptions, getDatasourcesOptions } from './apis';

const TabConfiguration = ({
    tab,
    config,
    updateConfig,
    applyConfig
}) => {

    const [envOptions, setEnvOptions] = useState([]);
    const [databaseOptions, setDatabaseOptions] = useState([]);
    const [moduleOptions, setModuleOptions] = useState([]);
    const [dataSources, setDataSources] = useState([]);

    useEffect(() => {
        getEnvOptions().then(setEnvOptions).catch(() => setEnvOptions([]));
        getDatabaseOptions().then(setDatabaseOptions).catch(() => setDatabaseOptions([]));
        getModuleOptions().then(setModuleOptions).catch(() => setModuleOptions([]));
        getDatasourcesOptions().then(setDataSources).catch(() => setDataSources([]));
    }, []);

    const styles = {
        sidebarContent: {
            padding: '1rem'
        },
        sidebarTitle: {
            fontFamily: "'Inter', sans-serif",
            fontSize: '1.125rem',
            fontWeight: 600,
            marginBottom: '1rem',
            color: '#1f2937'
        },
        formGroup: {
            marginBottom: '1rem'
        },
        formLabel: {
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: '#374151',
            marginBottom: '0.25rem'
        },
        formSelect: {
            width: '100%',
            padding: '0.5rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            fontFamily: "'Inter', sans-serif"
        },
        formInput: {
            width: '100%',
            padding: '0.5rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            fontFamily: "'Inter', sans-serif"
        },
        timeRangeContainer: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem'
        },
        timeRangeInput: {
            width: '40%',
            padding: '0.5rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            fontFamily: "'Inter', sans-serif"
        },
        checkboxGroup: {
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            maxHeight: '7rem',
            overflowY: 'auto',
            padding: '0.25rem'
        },
        checkboxItem: {
            display: 'flex',
            alignItems: 'center',
            padding: '0.25rem 0.5rem'
        },
        checkboxLabel: {
            fontSize: '0.875rem',
            marginLeft: '0.5rem'
        },
        selectActionLinks: {
            display: 'flex',
            marginTop: '0.25rem'
        },
        actionLink: {
            fontSize: '0.75rem',
            color: '#2563eb',
            cursor: 'pointer',
            marginRight: '0.5rem'
        },
        divider: {
            color: '#d1d5db',
            margin: '0 0.25rem'
        },
        moduleButtonsContainer: {
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem'
        },
        moduleButton: (isActive) => ({
            padding: '0.25rem 0.75rem',
            borderRadius: '999px',
            fontSize: '0.75rem',
            fontWeight: 500,
            background: isActive ? '#dbeafe' : '#f3f4f6',
            color: isActive ? '#2563eb' : '#4b5563',
            border: `1px solid ${isActive ? '#bfdbfe' : '#e5e7eb'}`,
            cursor: 'pointer',
            transition: 'all 0.2s ease'
        }),
        applyButton: {
            width: '100%',
            background: '#2563eb',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'background 0.2s ease'
        }
    };


    // Toggle environment selection
    const toggleEnvironment = (env) => {
        const safeConfig = config || {};
        safeConfig.envs = safeConfig.envs || [];

        const updatedEnvs = safeConfig.envs.includes(env)
            ? safeConfig.envs.filter(e => e !== env)
            : [...safeConfig.envs, env];

        updateConfig({
            ...safeConfig,
            envs: updatedEnvs
        });
    };

    // Toggle database selection
    const toggleDatabase = (db) => {
        if (!config.databases) {
            config.databases = [];
        }

        const updatedDatabases = config.databases.includes(db)
            ? config.databases.filter(d => d !== db)
            : [...config.databases, db];

        updateConfig({
            ...config,
            databases: updatedDatabases
        });
    };

    // Toggle module selection
    const toggleModules = (md) => {
        if (!config.module) {
            config.module = [];
        }

        const updatedModules = config.module.includes(md)
            ? config.module.filter(m => m !== md)
            : [...config.module, md];

        updateConfig({
            ...config,
            module: updatedModules
        });
    };

    const selectAllEnvironments = () => {
        updateConfig({
            ...config,
            envs: [...envOptions]
        });
    };

    const clearEnvironments = () => {
        updateConfig({
            ...config,
            envs: []
        });
    };


    // Select all databases
    const selectAllDatabases = () => {
        updateConfig({
            ...config,
            databases: [...databaseOptions]
        });
    };

    const clearModules = () => {
        updateConfig({
            ...config,
            module: []
        });
    }

    const selectAllModules = () => {
        updateConfig({
            ...config,
            module: [...moduleOptions]
        });
    };

    // Clear all databases
    const clearDatabases = () => {
        updateConfig({
            ...config,
            databases: []
        });
    };

    return (
        <div style={styles.sidebarContent}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '1rem'
            }}>
                <input
                    type="text"
                    value={config?._tabTitle ?? tab.name}
                    placeholder="Tab Title"
                    onChange={(e) => {
                        // Call an update function passed from parent to change the tab title
                        updateConfig({
                            ...config,
                            _tabTitle: e.target.value
                        });
                    }}
                    style={styles.formInput}
                />
            </div>
            {/* Data Source Selection */}
            <div style={styles.formGroup}>
                <label style={styles.formLabel}>Data Source</label>
                {console.log("dataSources:", dataSources)}
                <select
                    style={styles.formSelect}
                    value={config.dataSource}
                    onChange={(e) => updateConfig({
                        ...config,
                        dataSource: e.target.value
                    })}
                >
                    {dataSources.map((source, idx) => (
                        <option key={idx} value={source}>
                            {source}
                        </option>
                    ))}
                </select>
            </div>
            {/* Time Range */}
            <div style={styles.formGroup}>
                <label style={styles.formLabel}>Time Range</label>
                <div style={styles.timeRangeContainer}>
                {console.log("config.timeRange.start:", config)}
                    <input
                        type="month"
                        style={styles.timeRangeInput}
                        value={config.timeRange.start}
                        onChange={(e) => updateConfig({
                            ...config,
                            timeRange: { ...config.timeRange, start: e.target.value }
                        })}
                    />
                    <input
                        type="month"
                        style={styles.timeRangeInput}
                        value={config.timeRange.end}
                        onChange={(e) => updateConfig({
                            ...config,
                            timeRange: { ...config.timeRange, end: e.target.value }
                        })}
                    />
                </div>
            </div>

            {/* Environments */}
            <div style={styles.formGroup}>
                <label style={styles.formLabel}>Environments</label>
                <div style={styles.checkboxGroup}>
                    {envOptions.map((env, idx) => (
                        <div key={idx} style={styles.checkboxItem}>
                            <input
                                type="checkbox"
                                id={`env-${env}`}
                                checked={config.envs?.includes(env)}
                                onChange={() => toggleEnvironment(env)}
                            />
                            <label htmlFor={`env-${env}`} style={styles.checkboxLabel}>{env}</label>
                        </div>
                    ))}
                </div>
                <div style={styles.selectActionLinks}>
                    <span style={styles.actionLink} onClick={selectAllEnvironments}>Select All</span>
                    <span style={styles.divider}>|</span>
                    <span style={styles.actionLink} onClick={clearEnvironments}>Clear</span>
                </div>
            </div>


            {/* Modules */}
            <div style={styles.formGroup}>
                <label style={styles.formLabel}>Modules</label>
                <div style={styles.checkboxGroup}>
                    {moduleOptions.map((md, idx) => (
                        <div key={idx} style={styles.checkboxItem}>
                            <input
                                type="checkbox"
                                id={`module-${md}`}
                                checked={config.module.includes(md)}
                                onChange={() => toggleModules(md)}
                            />
                            <label htmlFor={`module-${md}`} style={styles.checkboxLabel}>{md}</label>
                        </div>
                    ))}
                </div>

                <div style={styles.selectActionLinks}>
                    <span
                        style={styles.actionLink}
                        onClick={selectAllModules}
                    >
                        Select All
                    </span>
                    <span style={styles.divider}>|</span>
                    <span
                        style={styles.actionLink}
                        onClick={clearModules}
                    >
                        Clear
                    </span>
                </div>
            </div>

            {/* Databases */}
            <div style={styles.formGroup}>
                <label style={styles.formLabel}>Databases</label>
                <div style={styles.checkboxGroup}>
                    {databaseOptions.map((db, idx) => (
                        <div key={idx} style={styles.checkboxItem}>
                            <input
                                type="checkbox"
                                id={`db-${db}`}
                                checked={config.databases.includes(db)}
                                onChange={() => toggleDatabase(db)}
                            />
                            <label htmlFor={`db-${db}`} style={styles.checkboxLabel}>{db}</label>
                        </div>
                    ))}
                </div>
                <div style={styles.selectActionLinks}>
                    <span
                        style={styles.actionLink}
                        onClick={selectAllDatabases}
                    >
                        Select All
                    </span>
                    <span style={styles.divider}>|</span>
                    <span
                        style={styles.actionLink}
                        onClick={clearDatabases}
                    >
                        Clear
                    </span>
                </div>
            </div>

            {/* Cluster Regex */}
            <div style={styles.formGroup}>
                <label style={styles.formLabel}>Cluster Regex</label>
                <input
                    type="text"
                    placeholder="e.g. ^cluster-[0-9]+$"
                    style={styles.formInput}
                    value={config.clusterRegex}
                    onChange={(e) => updateConfig({
                        ...config,
                        clusterRegex: e.target.value
                    })}
                />
            </div>

            {/* Apply button */}
            <button
                style={styles.applyButton}
                onClick={applyConfig}
            >
                Apply Configuration
            </button>
        </div>
    );
};

export { TabConfiguration };