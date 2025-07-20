import React, { useState, useEffect } from 'react';
import styles from './Dashboard.module.css';
// Import your chart library here (e.g., Chart.js or Recharts)
// import { Line } from 'react-chartjs-2';
import Chart from '../components/Chart';
import { getAllSensors, getSystemStatus, getAllAlerts, acknowledgeAlert, startFiltration, flushSystem, downloadReport, getImageFeed, calibrateSensor, getSensorReadings, triggerThresholdNotification } from '../services/api';
import { useTranslation } from 'react-i18next';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import WelcomeMessage from '../components/WelcomeMessage';
import abImg from '../assets/ab.webp';
import abouImg from '../assets/abou.webp';
import aboutImg from '../assets/about.webp';

const mockSensors = [
  { label: 'pH', value: 7.2, unit: '', status: 'safe' },
  { label: 'Turbidity', value: 3, unit: 'NTU', status: 'warning' },
  { label: 'Temperature', value: 26, unit: '°C', status: 'safe' },
  { label: 'Heavy Metals', value: 0.002, unit: 'ppm', status: 'safe', details: { Lead: 0.002, Chromium: 0.0001 } },
];
const thresholds = {
  ph: { min: 6.5, max: 8.5 },
  turbidity: { max: 5 },
};
const alerts = [
  { type: 'warning', message: 'Turbidity exceeds safe levels', time: '2 min ago' },
  { type: 'safe', message: 'pH returned to normal', time: '5 min ago' },
];
const systemStatus = {
  online: true,
  lastPing: '2 minutes ago',
  ai: true,
  battery: '85%',
};

const Dashboard: React.FC = () => {
  const [sensors, setSensors] = useState<any[]>([]);
  const [systemStatus, setSystemStatus] = useState<any>({ online: false, lastPing: '', ai: false, battery: '' });
  const [alerts, setAlerts] = useState<any[]>([]);
  const [aiEnabled, setAiEnabled] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(10);
  const [chartData, setChartData] = useState<any[]>([]);
  const [heavyMetalsChartData, setHeavyMetalsChartData] = useState<any[]>([]);
  const [loadingCharts, setLoadingCharts] = useState(true);
  const [imageFeed, setImageFeed] = useState<string>('');
  const { t, i18n } = useTranslation();
  const [dateFilter, setDateFilter] = useState<string>('');
  const [exporting, setExporting] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeName, setWelcomeName] = useState('');

  useEffect(() => {
    if (localStorage.getItem('showWelcome') === '1') {
      setShowWelcome(true);
      setWelcomeName(localStorage.getItem('welcomeName') || '');
      setTimeout(() => {
        setShowWelcome(false);
        localStorage.removeItem('showWelcome');
        localStorage.removeItem('welcomeName');
      }, 2200);
    }
  }, []);

  // Fetch all dashboard data
  const fetchDashboardData = async () => {
    setLoadingCharts(true);
    try {
    const [sensorRes, statusRes, alertRes, imageRes] = await Promise.all([
        getAllSensors(),
      getSystemStatus(),
        getAllAlerts(),
        getImageFeed()
    ]);
      
    const sensorsList = sensorRes.data?.sensors || [];
    setSensors(sensorsList);
    setSystemStatus(statusRes.data || {});
    setAiEnabled(statusRes.data?.ai || false);
    setAlerts(alertRes.data?.alerts || []);
      setImageFeed(imageRes.data?.url || imageRes.data || '');

    // Fetch readings for each sensor
    const readingsByType: Record<string, any> = {};
    const heavyMetalsReadings: { time: string, heavyMetals: number }[] = [];
    const promises = sensorsList.map(async (sensor: any) => {
        try {
          const readingsRes = await getSensorReadings(sensor.id, 20, '7d');
      const readings = readingsRes.data?.readings || [];
      if (sensor.type === 'heavy_metals' || sensor.label === 'Heavy Metals') {
        readings.forEach((r: any) => {
          heavyMetalsReadings.push({
            time: new Date(r.timestamp).toLocaleDateString(),
            heavyMetals: parseFloat(r.value)
          });
        });
      } else {
        readings.forEach((r: any) => {
          const t = new Date(r.timestamp).toLocaleTimeString();
          if (!readingsByType[t]) readingsByType[t] = {};
          readingsByType[t][sensor.type || sensor.label] = parseFloat(r.value);
          readingsByType[t].time = t;
        });
          }
        } catch (error) {
          console.error(`Error fetching readings for sensor ${sensor.id}:`, error);
      }
    });
    await Promise.all(promises);
      
    // Build chart data for pH, turbidity, temperature
    const chartRows = (Object.values(readingsByType) as any[]).sort((a: any, b: any) => (a.time > b.time ? 1 : -1));
    setChartData(chartRows);
      
    // Build heavy metals chart data
    heavyMetalsReadings.sort((a, b) => (a.time > b.time ? 1 : -1));
    setHeavyMetalsChartData(heavyMetalsReadings);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Use mock data as fallback
      setSensors(mockSensors);
      setSystemStatus(systemStatus);
      setAlerts(alerts);
    } finally {
    setLoadingCharts(false);
    }
  };

  // Fetch chart data for a specific date (simulate for now)
  const fetchChartData = async (date?: string) => {
    // TODO: Replace with real API call for filtered data
    setChartData([
      { time: '10:00', ph: 7.1, turbidity: 2.8, temperature: 25.5 },
      { time: '10:01', ph: 7.2, turbidity: 3.0, temperature: 26.0 },
      { time: '10:02', ph: 7.3, turbidity: 2.9, temperature: 25.8 },
      { time: '10:03', ph: 7.2, turbidity: 3.1, temperature: 26.1 },
      { time: '10:04', ph: 7.1, turbidity: 2.7, temperature: 25.7 },
    ]);
  };

  React.useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(() => {
      fetchDashboardData();
    }, autoRefresh * 1000);
    return () => clearInterval(interval);
  }, [autoRefresh, dateFilter]);

  // Button handlers
  const handleStartFiltration = async () => { 
    try {
      await startFiltration(); 
    } catch (error) {
      console.error('Error starting filtration:', error);
    }
  };
  
  const handleRecalibrate = async () => { 
    try {
      if (sensors.length) {
        for (const s of sensors) {
          await calibrateSensor(s.id); 
        }
      }
    } catch (error) {
      console.error('Error recalibrating sensors:', error);
    }
  };
  
  const handleRefresh = fetchDashboardData;
  
  const handleFlushSystem = async () => { 
    try {
      await flushSystem(); 
    } catch (error) {
      console.error('Error flushing system:', error);
    }
  };
  
  const handleAcknowledge = async (id: number) => { 
    try {
      await acknowledgeAlert(id); 
      fetchDashboardData(); 
    } catch (error) {
      console.error('Error acknowledging alert:', error);
    }
  };
  
  const handleDownloadReport = async () => { 
    try {
      const response = await downloadReport(); 
      const blob = response.data;
      const url = URL.createObjectURL(blob); 
      const a = document.createElement('a'); 
      a.href = url; 
      a.download = 'report.csv'; 
      a.click(); 
      URL.revokeObjectURL(url); 
    } catch (error) {
      console.error('Error downloading report:', error);
    }
  };
  
  const handleViewImageFeed = () => { 
    if (imageFeed) window.open(imageFeed, '_blank'); 
  };

  const handleTriggerNotification = async (sensorId: number, sensorName: string) => {
    try {
      const res = await triggerThresholdNotification(sensorId);
      if (res.data?.success) {
        alert(`Threshold notification sent for ${sensorName}! Check all registered users' email inboxes.`);
      } else {
        alert('Failed to send notification: ' + (res.data?.message || 'Unknown error'));
      }
    } catch (error: any) {
      console.error('Trigger notification error:', error);
      alert('Failed to send notification: ' + (error.response?.data?.message || error.message));
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    const csv = [
      'Time,pH,Turbidity,Temperature',
      ...chartData.map(row => `${row.time},${row.ph},${row.turbidity},${row.temperature}`)
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    saveAs(blob, 'sensor-data.csv');
  };

  // Export to PDF
  const handleExportPDF = () => {
    setExporting(true);
    
    try {
      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(20);
      doc.setTextColor(47, 133, 90); // #2F855A
      doc.text('Nanopure Water Quality Report', 14, 20);
      
      // Report metadata
      doc.setFontSize(12);
      doc.setTextColor(26, 54, 93); // #1A365D
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);
      doc.text(`System Status: ${systemStatus.online ? 'Online' : 'Offline'}`, 14, 37);
      doc.text(`AI Controller: ${aiEnabled ? 'Enabled' : 'Disabled'}`, 14, 44);
      
      // Current Sensor Readings
      doc.setFontSize(16);
      doc.setTextColor(47, 133, 90);
      doc.text('Current Sensor Readings', 14, 60);
      
      const sensorData = sensors.map(s => [
        s.name || s.label,
        `${s.lastReading ?? s.value} ${s.unit}`,
        s.status === 'safe' ? 'Safe' : s.status === 'warning' ? 'Warning' : 'Danger'
      ]);
      
      autoTable(doc, {
        head: [['Sensor', 'Value', 'Status']],
        body: sensorData,
        startY: 70,
        headStyles: { fillColor: [47, 133, 90] },
        styles: { fontSize: 10 }
      });
      
      // Historical Data
      if (chartData.length > 0) {
        doc.setFontSize(16);
        doc.setTextColor(47, 133, 90);
        doc.text('Historical Data (Last 5 Readings)', 14, 120);
        
        const historicalData = chartData.slice(-5).map(row => [
          row.time,
          row.ph || 'N/A',
          row.turbidity || 'N/A',
          row.temperature || 'N/A'
        ]);
        
        autoTable(doc, {
          head: [['Time', 'pH', 'Turbidity', 'Temperature']],
          body: historicalData,
          startY: 130,
          headStyles: { fillColor: [47, 133, 90] },
          styles: { fontSize: 9 }
        });
      }
      
      // Alerts
      if (alerts.length > 0) {
        doc.setFontSize(16);
        doc.setTextColor(47, 133, 90);
        doc.text('Recent Alerts', 14, 180);
        
        const alertData = alerts.slice(-5).map(a => [
          a.severity === 'high' || a.type === 'warning' ? 'Warning' : 'Info',
          a.message,
          a.time || a.createdAt || 'N/A'
        ]);
        
        autoTable(doc, {
          head: [['Type', 'Message', 'Time']],
          body: alertData,
          startY: 190,
          headStyles: { fillColor: [47, 133, 90] },
          styles: { fontSize: 9 }
        });
      }
      
      // System Information
      doc.setFontSize(16);
      doc.setTextColor(47, 133, 90);
      doc.text('System Information', 14, 240);
      
      const systemInfo = [
        ['Battery Level', systemStatus.battery || 'N/A'],
        ['Last Ping', systemStatus.lastPing ? new Date(systemStatus.lastPing).toLocaleString() : 'N/A'],
        ['Auto Refresh', `${autoRefresh} seconds`],
        ['Thresholds', `pH: ${systemStatus.phMin ?? 6.5}-${systemStatus.phMax ?? 8.5}, Turbidity: Max ${systemStatus.turbidityMax ?? 5} NTU`]
      ];
      
      autoTable(doc, {
        head: [['Property', 'Value']],
        body: systemInfo,
        startY: 250,
        headStyles: { fillColor: [47, 133, 90] },
        styles: { fontSize: 10 }
      });
      
      // Footer
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text('Nanopure Water Filtration System - Generated by AI-Powered Dashboard', 14, doc.internal.pageSize.height - 10);
      
      // Save the PDF
      doc.save(`nanopure-report-${new Date().toISOString().split('T')[0]}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF report. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  // Language switch
  const handleSwitchLanguage = () => {
    const next = i18n.language === 'en' ? 'lg' : i18n.language === 'lg' ? 'sw' : 'en';
    i18n.changeLanguage(next);
  };

  return (
    <div
      className={styles.dashboardBg}
      style={{
        backgroundImage: `url(${require('../assets/cont.jpeg')})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className={styles.dashboardOverlay}></div>
      {showWelcome && <WelcomeMessage name={welcomeName} />}
      <div className={styles.dashboard}>
        {/* Live Sensor Graph */}
        <div className={styles.liveGraphCard}>
          <h2 className={styles.sectionTitle}>{t('Live Sensor Results and Real-Time Water Quality Monitoring')}</h2>
          {loadingCharts ? <div>Loading chart...</div> : <Chart data={chartData} />}
        </div>
        {/* Live Sensor Cards */}
        <div className={styles.sensorCardRow}>
          {sensors.map((s, i) => (
            <div key={s.id || i} className={`${styles.sensorCard} ${styles[s.status]}`}>
              <div className={styles.sensorLabel}>{s.name || s.label}</div>
              <div className={styles.sensorValue}>
                <span className={styles.pulseDot} />
                {s.lastReading ?? s.value} <span className={styles.sensorUnit}>{s.unit}</span>
              </div>
              {s.label === 'Heavy Metals' && s.details && (
                <div className={styles.heavyMetalsList}>
                  {(Object.entries(s.details) as [string, any][]).map(([metal, val]) => (
                    <div key={metal}>{metal}: {String(val)} ppm</div>
                  ))}
                </div>
              )}
              <div className={styles.sensorStatus}>{s.status === 'safe' ? '✅ Safe' : s.status === 'warning' ? '⚠️ Warning' : '❌ Danger'}</div>
              <button 
                className={styles.notificationBtn} 
                onClick={() => handleTriggerNotification(s.id, s.name || s.label)}
                title="Send threshold notification to all users"
              >
                📧 Send Alert
              </button>
            </div>
          ))}
        </div>
        {/* Interactive Graphs */}
        <div className={styles.chartsRow}>
          <div className={styles.chartCard}>
            <h2 className={styles.chartTitle}>{t('pH Trends')}</h2>
            {loadingCharts ? <div>Loading chart...</div> : <Chart data={chartData} dataKey="ph" color="#2563eb" name="pH" />}
          </div>
          <div className={styles.chartCard}>
            <h2 className={styles.chartTitle}>{t('Turbidity Changes')}</h2>
            {loadingCharts ? <div>Loading chart...</div> : <Chart data={chartData} dataKey="turbidity" color="#f59e42" name="Turbidity" />}
          </div>
          <div className={styles.chartCard}>
            <h2 className={styles.chartTitle}>{t('Heavy Metals Weekly')}</h2>
            {loadingCharts ? <div>Loading chart...</div> : <Chart data={heavyMetalsChartData} dataKey="heavyMetals" color="#2F855A" name="Heavy Metals (ppm)" />}
          </div>
        </div>
        {/* Sensor Control Buttons */}
        <div className={styles.controlPanel}>
          <button className={styles.controlBtn} onClick={handleStartFiltration}>{t('Start Filtration')}</button>
          <button className={styles.controlBtn} onClick={handleRecalibrate}>{t('Recalibrate Sensors')}</button>
          <button className={styles.controlBtn} onClick={handleRefresh}>{t('Refresh Values')}</button>
          <button className={styles.controlBtn} onClick={handleFlushSystem}>{t('Flush System')}</button>
        </div>
        {/* Threshold Quick View */}
        <div className={styles.thresholdsCard}>
          <h2 className={styles.sectionTitle}>{t('Thresholds')}</h2>
          <div>pH Alert: Min {systemStatus.phMin ?? 6.5}, Max {systemStatus.phMax ?? 8.5}</div>
          <div>Turbidity Alert: Max {systemStatus.turbidityMax ?? 5} NTU</div>
          <button className={styles.linkBtn} onClick={() => window.location.href='/settings'}>{t('Go to Full Settings')}</button>
        </div>
        {/* System Status Panel */}
        <div className={styles.statusPanel}>
          <h2 className={styles.sectionTitle}>{t('System Status')}</h2>
          <div>Status: {systemStatus.online ? '✅ Online' : '❌ Offline'}</div>
          <div>Last Ping: {systemStatus.lastPing ? new Date(systemStatus.lastPing).toLocaleTimeString() : ''}</div>
          <div>AI Controller: <input type="checkbox" checked={aiEnabled} onChange={e => setAiEnabled(e.target.checked)} /> {aiEnabled ? 'ON' : 'OFF'}</div>
          <div>Battery: {systemStatus.battery}</div>
        </div>
        {/* Alert Center */}
        <div className={styles.alertCenter}>
          <h2 className={styles.sectionTitle}>{t('Alert Center')}</h2>
          {alerts.map((a, i) => (
            <div key={a.id || i} className={styles.alertItem}>
              <span>{a.severity === 'high' || a.type === 'warning' ? '⚠️' : '✅'}</span> {a.message} <span className={styles.alertTime}>{a.time || a.createdAt}</span>
              <button className={styles.ackBtn} onClick={() => handleAcknowledge(a.id)}>{t('Acknowledge')}</button>
            </div>
          ))}
        </div>
        {/* Quick Access Buttons */}
        <div className={styles.quickAccessRow}>
          <button className={styles.quickBtn} onClick={() => window.location.href='/settings'}>{t('Go to Full Settings')}</button>
          <button className={styles.quickBtn} onClick={handleDownloadReport}>{t('Download Report')}</button>
          <button className={`${styles.quickBtn} ${styles.pdfBtn}`} onClick={handleExportPDF} disabled={exporting}>
            {exporting ? '📄 Generating PDF...' : '📄 Export PDF Report'}
          </button>
          <button className={styles.quickBtn} onClick={handleViewImageFeed}>{t('View Image Feed')}</button>
          <button className={styles.quickBtn} onClick={handleSwitchLanguage}>{t('Switch Language')}</button>
        </div>
        {/* Advanced Features */}
        <div className={styles.advancedPanel}>
          <h2 className={styles.sectionTitle}>{t('Advanced Features')}</h2>
          <div>Auto-Refresh Timer: <select value={autoRefresh} onChange={e => setAutoRefresh(Number(e.target.value))}>
            <option value={5}>5s</option>
            <option value={10}>10s</option>
            <option value={60}>1min</option>
          </select></div>
          <div>Filter Data by Date: <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} /></div>
          <button className={styles.quickBtn} onClick={handleExportCSV}>{t('Export to CSV')}</button>
          <button className={styles.quickBtn} onClick={handleExportPDF} disabled={exporting}>{exporting ? t('Exporting...') : t('Export to PDF')}</button>
          <div className={styles.aiStatus}>{t('AI currently monitoring turbidity patterns')}</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 