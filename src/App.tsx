import React, { useEffect } from 'react';
import { useSupervisoryStore } from './store/useSupervisoryStore';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { SynopticCanvas } from './components/scada/SynopticCanvas';
import { OverviewDashboard } from './components/views/OverviewDashboard';
import { HierarchyManager } from './components/views/HierarchyManager';
import { DeviceManager } from './components/views/DeviceManager';
import { TagManager } from './components/views/TagManager';
import { AlarmCenter } from './components/views/AlarmCenter';
import { AiReportStudio } from './components/views/AiReportStudio';
import { SettingsView } from './components/views/SettingsView';

export function App() {
  const { activeView, updateTelemetryTick, isSimulatingTelemetry } = useSupervisoryStore();

  // Telemetry Polling Loop (Simulates 10Hz Modbus/MQTT Data Stream)
  useEffect(() => {
    if (!isSimulatingTelemetry) return;
    const interval = setInterval(() => {
      updateTelemetryTick();
    }, 2000);

    return () => clearInterval(interval);
  }, [isSimulatingTelemetry, updateTelemetryTick]);

  return (
    <div className="min-h-screen bg-isa-bg text-isa-text flex flex-col font-sans">
      <Header />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 overflow-y-auto">
          {activeView === 'synoptic' && <SynopticCanvas />}
          {activeView === 'overview' && <OverviewDashboard />}
          {activeView === 'hierarchy' && <HierarchyManager />}
          {activeView === 'devices' && <DeviceManager />}
          {activeView === 'tags' && <TagManager />}
          {activeView === 'alarms' && <AlarmCenter />}
          {activeView === 'ai-reports' && <AiReportStudio />}
          {activeView === 'settings' && <SettingsView />}
        </main>
      </div>
    </div>
  );
}

export default App;
