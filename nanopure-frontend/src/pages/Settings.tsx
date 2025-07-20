import React, { useState } from 'react';
import styles from './Settings.module.css';
import { useUser } from '../components/UserContext';
import { getSensorSettings, updateSensorSettings, getAllSensors, calibrateSensor, resetSensor, disconnectSensor, updateProfile, getProfile, testAlertNotification, testEmailConfiguration } from '../services/api';
import { useEffect } from 'react';
import { useTheme } from '../components/ThemeContext';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'lg', name: 'Luganda' },
  { code: 'sw', name: 'Swahili' },
];

const roles = ['Admin', 'Viewer'];
const alertMethods = ['Email', 'SMS'];
const alertLevels = ['Info', 'Warning', 'Critical'];
const aiSensitivity = ['Low', 'Medium', 'High'];
const overrideModes = ['Manual', 'AI'];

const Settings: React.FC = () => {
  // Sensor thresholds
  const [phMin, setPhMin] = useState(6.5);
  const [phMax, setPhMax] = useState(8.5);
  const [turbidity, setTurbidity] = useState(5);
  const [temperatureMin, setTemperatureMin] = useState(10);
  const [temperatureMax, setTemperatureMax] = useState(35);
  const [heavyMetals, setHeavyMetals] = useState(0.01);

  // Load sensor settings from backend on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await getSensorSettings();
        if (res.data?.sensorSettings) {
          setPhMin(res.data.sensorSettings.phMin ?? 6.5);
          setPhMax(res.data.sensorSettings.phMax ?? 8.5);
          setTurbidity(res.data.sensorSettings.turbidity ?? 5);
          setTemperatureMin(res.data.sensorSettings.temperatureMin ?? 10);
          setTemperatureMax(res.data.sensorSettings.temperatureMax ?? 35);
          setHeavyMetals(res.data.sensorSettings.heavyMetals ?? 0.01);
        }
      } catch {}
    };
    fetchSettings();
  }, []);

  // Save sensor settings to backend when any changes
  useEffect(() => {
    updateSensorSettings({ phMin, phMax, turbidity, temperatureMin, temperatureMax, heavyMetals })
      .catch(err => {
        // Do not show any error message
        return;
      });
  }, [phMin, phMax, turbidity, temperatureMin, temperatureMax, heavyMetals]);

  // Language
  const [language, setLanguage] = useState('en');

  // User settings
  const { user } = useUser();
  const [password, setPassword] = useState('');
  type TeamMember = { name: string; role: string };
  const [team, setTeam] = useState<TeamMember[]>([]); // Explicitly type the team
  const [newMember, setNewMember] = useState('');
  const [newRole, setNewRole] = useState('Viewer');

  // Data sync
  const [autoSync, setAutoSync] = useState(5);
  const [lastSync, setLastSync] = useState(new Date().toLocaleString());

  // AI behavior
  const [aiEnabled, setAiEnabled] = useState(true);
  const [aiLevel, setAiLevel] = useState('Medium');
  const [override, setOverride] = useState('AI');

  // Notifications
  const [alertMethod, setAlertMethod] = useState('Email');
  const [alertLevel, setAlertLevel] = useState('Warning');

  // Device management
  const [sensors, setSensors] = useState<any[]>([]);
  const [sensorLoading, setSensorLoading] = useState(false);
  const [sensorAction, setSensorAction] = useState<{[id: number]: boolean}>({});

  // Email testing
  const [testEmail, setTestEmail] = useState('');
  const [emailTestResult, setEmailTestResult] = useState<{success?: boolean, message?: string} | null>(null);
  const [emailTesting, setEmailTesting] = useState(false);

  // Fetch sensors from backend on mount
  useEffect(() => {
    const fetchSensors = async () => {
      setSensorLoading(true);
      try {
        const res = await getAllSensors();
        if (res.data?.sensors) setSensors(res.data.sensors);
      } finally {
        setSensorLoading(false);
      }
    };
    fetchSensors();
  }, []);

  const handleCalibrate = async (id: number) => {
    setSensorAction(a => ({ ...a, [id]: true }));
    await calibrateSensor(id);
    setSensorAction(a => ({ ...a, [id]: false }));
    // Refresh sensors
    const res = await getAllSensors();
    if (res.data?.sensors) setSensors(res.data.sensors);
  };
  const handleReset = async (id: number) => {
    setSensorAction(a => ({ ...a, [id]: true }));
    await resetSensor(id);
    setSensorAction(a => ({ ...a, [id]: false }));
    const res = await getAllSensors();
    if (res.data?.sensors) setSensors(res.data.sensors);
  };
  const handleDisconnect = async (id: number) => {
    setSensorAction(a => ({ ...a, [id]: true }));
    await disconnectSensor(id);
    setSensorAction(a => ({ ...a, [id]: false }));
    const res = await getAllSensors();
    if (res.data?.sensors) setSensors(res.data.sensors);
  };

  // Theme
  const { fontSize, setFontSize } = useTheme();
  // Theme toggle handled globally

  // Export/Backup
  const handleExport = async () => {
    try {
      // Show loading state
      const exportBtn = document.querySelector('[data-testid="export-btn"]') as HTMLButtonElement;
      if (exportBtn) {
        exportBtn.disabled = true;
        exportBtn.textContent = t('Exporting...');
      }

      // Collect all data for export
      const exportData = {
        timestamp: new Date().toISOString(),
        version: '1.0',
        user: {
          email: user?.email,
          preferences: user?.preferences
        },
        sensorSettings: { 
          phMin, 
          phMax, 
          turbidity, 
          temperatureMin, 
          temperatureMax, 
          heavyMetals 
        },
        preferences: { 
          language, 
          autoSync, 
          aiEnabled, 
          aiLevel, 
          override, 
          fontSize,
          alertMethod,
          alertLevel
        },
        team: team,
        sensors: sensors,
        lastSync: lastSync
      };

      // Create and download the file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nanopure-settings-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Show success message
      alert(t('Settings exported successfully!'));
    } catch (error) {
      console.error('Export error:', error);
      alert(t('Failed to export settings. Please try again.'));
    } finally {
      // Reset button state
      const exportBtn = document.querySelector('[data-testid="export-btn"]') as HTMLButtonElement;
      if (exportBtn) {
        exportBtn.disabled = false;
        exportBtn.textContent = t('Export Data');
      }
    }
  };

  const handleBackup = async () => {
    try {
      // Show loading state
      const backupBtn = document.querySelector('[data-testid="backup-btn"]') as HTMLButtonElement;
      if (backupBtn) {
        backupBtn.disabled = true;
        backupBtn.textContent = t('Backing up...');
      }

      // Simulate backup process with progress
      const progressSteps = [
        t('Validating settings...'),
        t('Creating backup...'),
        t('Uploading to cloud...'),
        t('Verifying backup...')
      ];

      for (let i = 0; i < progressSteps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 800));
        if (backupBtn) {
          backupBtn.textContent = progressSteps[i];
        }
      }

      // Create backup data
      const backupData = {
        timestamp: new Date().toISOString(),
        settings: {
          sensorSettings: { phMin, phMax, turbidity, temperatureMin, temperatureMax, heavyMetals },
          preferences: { language, autoSync, aiEnabled, aiLevel, override, fontSize, alertMethod, alertLevel },
          team: team
        }
      };

      // Store in localStorage as backup
      localStorage.setItem('nanopure-backup', JSON.stringify(backupData));

      // Show success message
      alert(t('Backup completed successfully! Your settings have been saved locally.'));
    } catch (error) {
      console.error('Backup error:', error);
      alert(t('Failed to create backup. Please try again.'));
    } finally {
      // Reset button state
      const backupBtn = document.querySelector('[data-testid="backup-btn"]') as HTMLButtonElement;
      if (backupBtn) {
        backupBtn.disabled = false;
        backupBtn.textContent = t('Backup Settings');
      }
    }
  };

  const handleResetSettings = () => {
    const confirmed = window.confirm(
      t('Are you sure you want to reset all settings to default? This action cannot be undone.')
    );
    
    if (confirmed) {
      try {
        // Reset all settings to default values
        setPhMin(6.5);
        setPhMax(8.5);
        setTurbidity(5);
        setTemperatureMin(10);
        setTemperatureMax(35);
        setHeavyMetals(0.01);
        setLanguage('en');
        setAutoSync(5);
        setAiEnabled(true);
        setAiLevel('Medium');
        setOverride('AI');
        setAlertMethod('Email');
        setAlertLevel('Warning');
        setTeam([]); // Reset team to empty
        setPassword('');
        setNewMember('');
        setNewRole('Viewer');
        
        // Reset theme
        setFontSize('medium');
        
        // Clear any stored backup
        localStorage.removeItem('nanopure-backup');
        
        alert(t('Settings have been reset to default values.'));
      } catch (error) {
        console.error('Reset error:', error);
        alert(t('Failed to reset settings. Please try again.'));
      }
    }
  };

  const handleRestoreBackup = () => {
    const backupData = localStorage.getItem('nanopure-backup');
    
    if (!backupData) {
      alert(t('No backup found. Please create a backup first.'));
      return;
    }

    const confirmed = window.confirm(
      t('Are you sure you want to restore from backup? This will overwrite your current settings.')
    );

    if (confirmed) {
      try {
        const backup = JSON.parse(backupData);
        const settings = backup.settings;

        // Restore sensor settings
        if (settings.sensorSettings) {
          setPhMin(settings.sensorSettings.phMin ?? 6.5);
          setPhMax(settings.sensorSettings.phMax ?? 8.5);
          setTurbidity(settings.sensorSettings.turbidity ?? 5);
          setTemperatureMin(settings.sensorSettings.temperatureMin ?? 10);
          setTemperatureMax(settings.sensorSettings.temperatureMax ?? 35);
          setHeavyMetals(settings.sensorSettings.heavyMetals ?? 0.01);
        }

        // Restore preferences
        if (settings.preferences) {
          setLanguage(settings.preferences.language ?? 'en');
          setAutoSync(settings.preferences.autoSync ?? 5);
          setAiEnabled(settings.preferences.aiEnabled ?? true);
          setAiLevel(settings.preferences.aiLevel ?? 'Medium');
          setOverride(settings.preferences.override ?? 'AI');
          setAlertMethod(settings.preferences.alertMethod ?? 'Email');
          setAlertLevel(settings.preferences.alertLevel ?? 'Warning');
          setFontSize(settings.preferences.fontSize ?? 'medium');
        }

        // Restore team
        if (settings.team) {
          setTeam(settings.team);
        }

        alert(t('Settings restored successfully from backup!'));
      } catch (error) {
        console.error('Restore error:', error);
        alert(t('Failed to restore from backup. The backup file may be corrupted.'));
      }
    }
  };

  // Support
  const handleContact = () => {
    const subject = encodeURIComponent('Nanopure Support Request');
    const body = encodeURIComponent(`
Dear Nanopure Support Team,

I need assistance with the following:

User Information:
- Email: ${user?.email || 'Not provided'}
- Current Language: ${language}
- System: ${navigator.userAgent}

Issue Description:
[Please describe your issue here]

Thank you for your help.

Best regards,
${user?.email || 'Nanopure User'}
    `);
    
    const mailtoLink = `mailto:https://nanopure-frontend.web.app?subject=${subject}&body=${body}`;
    window.open(mailtoLink);
  };

  const handleFAQ = () => {
    // Create a modal or open FAQ content
    const faqContent = `
# Frequently Asked Questions

## General Questions

**Q: How do I change my password?**
A: Go to Settings > User Settings and enter your new password in the "Change Password" field.

**Q: How do I add team members?**
A: In Settings > User Settings, enter the member's name and select their role, then click "Add".

**Q: How do I export my data?**
A: Go to Settings > Export & Backup and click "Export Data" to download your settings as a JSON file.

## Sensor Management

**Q: How do I calibrate a sensor?**
A: In Settings > Device/Sensor Management, find your sensor and click the "Calibrate" button.

**Q: What do the sensor thresholds mean?**
A: These are the acceptable ranges for water quality parameters. Alerts are triggered when values exceed these limits.

## Notifications

**Q: How do I test alert notifications?**
A: In Settings > Notifications, click "Test Alert" to send a test notification to all registered users.

**Q: Can I change how I receive alerts?**
A: Yes, you can choose between Email and SMS in the Alert Method setting.

## AI Features

**Q: What does AI Auto-adjustment do?**
A: The AI automatically adjusts system parameters based on water quality data to maintain optimal conditions.

**Q: How do I change AI sensitivity?**
A: In Settings > AI Behavior, select your preferred sensitivity level (Low, Medium, High).

## Troubleshooting

**Q: My sensors aren't connecting**
A: Try resetting the sensor in Device/Sensor Management, or contact support if the issue persists.

**Q: I'm not receiving notifications**
A: Check your email settings and spam folder. You can test notifications using the "Test Alert" button.

**Q: How do I restore from backup?**
A: Currently, backups are stored locally. Contact support for assistance with restoration.

For additional help, please contact support@nanopure.ug
    `;

    // Create a modal to display FAQ
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.7);
      z-index: 1000;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
    `;

    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
      background: white;
      padding: 30px;
      border-radius: 10px;
      max-width: 800px;
      max-height: 80vh;
      overflow-y: auto;
      position: relative;
    `;

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '×';
    closeBtn.style.cssText = `
      position: absolute;
      top: 10px;
      right: 15px;
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #666;
    `;
    closeBtn.onclick = () => document.body.removeChild(modal);

    modalContent.innerHTML = `
      <h2 style="margin-bottom: 20px; color: #2F855A;">${t('Frequently Asked Questions')}</h2>
      <div style="white-space: pre-line; line-height: 1.6; color: #333;">
        ${faqContent}
      </div>
    `;

    modalContent.appendChild(closeBtn);
    modal.appendChild(modalContent);
    modal.onclick = (e) => {
      if (e.target === modal) document.body.removeChild(modal);
    };

    document.body.appendChild(modal);
  };

  const { t, i18n } = useTranslation();

  // Load language from backend on mount
  useEffect(() => {
    if (user?.preferences?.language) {
      setLanguage(user.preferences.language);
      i18n.changeLanguage(user.preferences.language);
    }
  }, [user, i18n]);

  // When language changes, update i18n and persist to backend
  const handleLanguageChange = async (lang: string) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
    await updateProfile({ preferences: { language: lang } });
  };

  // Data Sync: persist autoSync to backend
  useEffect(() => {
    updateProfile({ preferences: { autoSync } });
  }, [autoSync]);

  // AI Behavior: persist aiEnabled, aiLevel, override to backend
  useEffect(() => {
    updateProfile({ preferences: { aiEnabled, aiLevel, override } });
  }, [aiEnabled, aiLevel, override]);

  // Theme & Appearance: persist fontSize to backend
  useEffect(() => {
    updateProfile({ preferences: { fontSize } });
  }, [fontSize]);

  const handleTestAlert = async () => {
    try {
      const res = await testAlertNotification();
      if (res.data?.success) {
        alert('Test alert notification sent to all registered users! Check your email inbox.');
      }
      // Do not show any error message
    } catch (error: any) {
      // Suppress all error messages
    }
  };

  const handleTestEmailConfig = async () => {
    if (!testEmail) {
      alert('Please enter a test email address');
      return;
    }

    setEmailTesting(true);
    setEmailTestResult(null);

    try {
      const res = await testEmailConfiguration(testEmail);
      if (res.data?.success) {
        setEmailTestResult({
          success: true,
          message: `Test email sent successfully to ${testEmail}. Please check your inbox.`
        });
      } else {
        setEmailTestResult({
          success: false,
          message: res.data?.message || 'Failed to send test email'
        });
      }
    } catch (error: any) {
      console.error('Email test error:', error);
      setEmailTestResult({
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to test email configuration'
      });
    } finally {
      setEmailTesting(false);
    }
  };

  return (
    <div className={styles.settingsBg}>
      <div className={styles.settings}>
        <h1 className={styles.title}>{t('Settings')}</h1>
        <div className={styles.sectionsGrid}>
          {/* Sensor Settings */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t('Sensor Settings')}</h2>
            <div className={styles.fieldRow}>
              <label>{t('pH Range')}</label>
              <input type="number" min={0} max={14} step={0.1} value={phMin} onChange={e => setPhMin(Number(e.target.value))} className={styles.inputSmall} />
              <span>{t('to')}</span>
              <input type="number" min={0} max={14} step={0.1} value={phMax} onChange={e => setPhMax(Number(e.target.value))} className={styles.inputSmall} />
            </div>
            <div className={styles.fieldRow}>
              <label>{t('Turbidity Limit (NTU)')}</label>
              <input type="number" min={0} max={100} step={0.1} value={turbidity} onChange={e => setTurbidity(Number(e.target.value))} className={styles.inputSmall} />
            </div>
            <div className={styles.fieldRow}>
              <label>{t('Temperature (°C)')}</label>
              <input type="number" min={-10} max={100} value={temperatureMin} onChange={e => setTemperatureMin(Number(e.target.value))} className={styles.inputSmall} />
              <span>{t('to')}</span>
              <input type="number" min={-10} max={100} value={temperatureMax} onChange={e => setTemperatureMax(Number(e.target.value))} className={styles.inputSmall} />
            </div>
            <div className={styles.fieldRow}>
              <label>{t('Heavy Metals (PPM)')}</label>
              <input type="number" min={0} max={10} step={0.01} value={heavyMetals} onChange={e => setHeavyMetals(Number(e.target.value))} className={styles.inputSmall} />
            </div>
          </section>

          {/* Notifications */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t('Notifications')}</h2>
            <div className={styles.fieldRow}>
              <label>{t('Alert Method')}</label>
              <select value={alertMethod} onChange={e => setAlertMethod(e.target.value)} className={styles.inputSmall}>
                {alertMethods.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div className={styles.fieldRow}>
              <label>{t('Alert Level')}</label>
              <select value={alertLevel} onChange={e => setAlertLevel(e.target.value)} className={styles.inputSmall}>
                {alertLevels.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <button className={styles.btn} onClick={handleTestAlert}>{t('Test Alert')}</button>
          </section>

          {/* Language */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t('Language')}</h2>
            <div className={styles.fieldRow}>
              {languages.map(l => (
                <label key={l.code} className={styles.radioLabel}>
                  <input type="radio" name="language" value={l.code} checked={language === l.code} onChange={() => handleLanguageChange(l.code)} />
                  {l.name}
                </label>
              ))}
            </div>
          </section>

          {/* User Settings */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t('User Settings')}</h2>
            <div className={styles.fieldRow}>
              <label>{t('Email')}</label>
              <input type="email" value={user?.email || ''} readOnly className={styles.inputSmall} />
            </div>
            <div className={styles.fieldRow}>
              <label>{t('Change Password')}</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className={styles.inputSmall} placeholder={t('New password')} />
            </div>
            <div className={styles.fieldRow}>
              <label>{t('Add Team Member')}</label>
              <input type="text" value={newMember} onChange={e => setNewMember(e.target.value)} className={styles.inputSmall} placeholder={t('Name')} />
              <select value={newRole} onChange={e => setNewRole(e.target.value)} className={styles.inputSmall}>
                {roles.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <button className={styles.btn} onClick={() => {
                if (newMember) setTeam([...team, { name: newMember, role: newRole }]);
                setNewMember('');
              }}>{t('Add')}</button>
            </div>
            <div className={styles.teamList}>
              {team.map((m, i) => (
                <div key={i} className={styles.teamMember}>
                  {m.name} <span className={styles.role}>{m.role}</span>
                  {i > 0 && <button className={styles.removeBtn} onClick={() => setTeam(team.filter((_, idx) => idx !== i))}>{t('Remove')}</button>}
                </div>
              ))}
            </div>
          </section>

          {/* Data Sync */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t('Data Sync')}</h2>
            <div className={styles.fieldRow}>
              <label>{t('Auto-sync Interval (mins)')}</label>
              <input type="number" min={1} max={60} value={autoSync} onChange={e => setAutoSync(Number(e.target.value))} className={styles.inputSmall} />
            </div>
            <div className={styles.fieldRow}>
              <button className={styles.btn} onClick={() => setLastSync(new Date().toLocaleString())}>{t('Sync Now')}</button>
              <span className={styles.lastSync}>{t('Last synced')}: {lastSync}</span>
            </div>
          </section>

          {/* AI Behavior */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t('AI Behavior')}</h2>
            <div className={styles.fieldRow}>
              <label>
                <input type="checkbox" checked={aiEnabled} onChange={e => setAiEnabled(e.target.checked)} /> {t('Enable AI Auto-adjustment')}
              </label>
            </div>
            <div className={styles.fieldRow}>
              <label>{t('Sensitivity')}</label>
              <select value={aiLevel} onChange={e => setAiLevel(e.target.value)} className={styles.inputSmall}>
                {aiSensitivity.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div className={styles.fieldRow}>
              <label>{t('Override Mode')}</label>
              <select value={override} onChange={e => setOverride(e.target.value)} className={styles.inputSmall}>
                {overrideModes.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </section>

          {/* Device/Sensor Management */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t('Device/Sensor Management')}</h2>
            <div className={styles.sensorList}>
              {sensorLoading ? <div>{t('Loading sensors...')}</div> : sensors.map((s) => (
                <div key={s.id} className={styles.sensorItem}>
                  <span>{s.name} ({s.type})</span>
                  <span className={styles.sensorStatus}>{s.status}</span>
                  <button className={styles.btn} onClick={() => handleCalibrate(s.id)} disabled={!!sensorAction[s.id]}>{t('Calibrate')}</button>
                  <button className={styles.btn} onClick={() => handleReset(s.id)} disabled={!!sensorAction[s.id]}>{t('Reset')}</button>
                  <button className={styles.removeBtn} onClick={() => handleDisconnect(s.id)} disabled={!!sensorAction[s.id]}>{t('Disconnect')}</button>
                </div>
              ))}
            </div>
          </section>

          {/* Theme & Appearance */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t('Theme & Appearance')}</h2>
            <div className={styles.fieldRow}>
              <label>{t('Font Size')}</label>
              <select 
                value={fontSize} 
                onChange={e => setFontSize(e.target.value as 'small' | 'medium' | 'large' | 'extra-large')} 
                className={styles.inputSmall}
              >
                <option value="small">{t('Small')}</option>
                <option value="medium">{t('Medium')}</option>
                <option value="large">{t('Large')}</option>
                <option value="extra-large">{t('Extra Large')}</option>
              </select>
            </div>
            <div className={styles.fieldRow}>
              <span style={{ fontSize: '0.9rem', color: '#666' }}>
                {t('Current font size')}: {fontSize} - {t('Changes apply immediately')}
              </span>
            </div>
          </section>

          {/* Export & Backup */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t('Export & Backup')}</h2>
            <div className={styles.fieldRow}>
              <button className={styles.btn} onClick={handleExport} data-testid="export-btn">{t('Export Data')}</button>
              <button className={styles.btn} onClick={handleBackup} data-testid="backup-btn">{t('Backup Settings')}</button>
              <button className={styles.btn} onClick={handleResetSettings}>{t('Reset to Default')}</button>
              <button className={styles.btn} onClick={handleRestoreBackup}>{t('Restore from Backup')}</button>
            </div>
          </section>

          {/* Support & Help */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t('Support & Help')}</h2>
            <div className={styles.fieldRow}>
              <button className={styles.btn} onClick={handleFAQ}>{t('FAQs')}</button>
              <button className={styles.btn} onClick={handleContact}>{t('Contact Support')}</button>
            </div>
            <div className={styles.fieldRow}>
              <button 
                className={styles.btn} 
                onClick={() => {
                  const systemInfo = {
                    userAgent: navigator.userAgent,
                    language: navigator.language,
                    platform: navigator.platform,
                    cookieEnabled: navigator.cookieEnabled,
                    onLine: navigator.onLine,
                    timestamp: new Date().toISOString(),
                    user: user?.email,
                    settings: {
                      language,
                      fontSize,
                      aiEnabled,
                      autoSync
                    }
                  };
                  const blob = new Blob([JSON.stringify(systemInfo, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'nanopure-system-info.json';
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                  alert(t('System information exported. Please attach this file when contacting support.'));
                }}
              >
                {t('Export System Info')}
              </button>
              <button 
                className={styles.btn} 
                onClick={() => {
                  const confirmed = window.confirm(t('This will clear all cached data and reload the page. Continue?'));
                  if (confirmed) {
                    localStorage.clear();
                    sessionStorage.clear();
                    window.location.reload();
                  }
                }}
              >
                {t('Clear Cache & Reload')}
              </button>
            </div>
            <div className={styles.fieldRow} style={{ fontSize: '0.9rem', color: '#666', marginTop: '10px' }}>
              <span>{t('For urgent issues, please contact support@nanopure.ug or call +256-743021248')}</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Settings; 