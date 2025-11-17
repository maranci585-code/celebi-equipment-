```tsx
import { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { EquipmentHandover } from './components/EquipmentHandover';
import { EquipmentManagement } from './components/EquipmentManagement';
import { FaultRegistry } from './components/FaultRegistry';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Button } from './components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './components/ui/dialog';
import { Plane, LayoutDashboard, RefreshCcw, Settings, AlertTriangle, QrCode, Database, Loader2 } from 'lucide-react';
import { toast, Toaster } from 'sonner@2.0.3';
import { initializeDatabase } from './lib/api';
import { mockEquipment, mockFaults, mockHandovers, NORMALIZATION_CONFIG } from './lib/equipmentData';
import { AppProvider } from './lib/AppContext';
import celebiLogo from 'figma:asset/10ce27e9e8733231ab0b829ed5fbda34b89cbdec.png';

export default function App() {
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const currentURL = window.location.href;

  // Initialize database on first load
  useEffect(() => {
    const init = async () => {
      const initialized = localStorage.getItem('celebi-db-initialized');
      const dbVersion = localStorage.getItem('celebi-db-version');
      const currentVersion = '1.1'; // Mobilite türleri güncellemesi
      
      // Eğer veritabanı güncel değilse yeniden başlat
      if (initialized === 'true' && dbVersion === currentVersion) {
        setIsInitialized(true);
        return;
      }

      setIsInitializing(true);
      try {
        await initializeDatabase({
          equipment: mockEquipment,
          faults: mockFaults,
          handovers: mockHandovers,
          normalizationConfig: NORMALIZATION_CONFIG,
        });
        
        localStorage.setItem('celebi-db-initialized', 'true');
        localStorage.setItem('celebi-db-version', currentVersion);
        setIsInitialized(true);
        toast.success('Veritabanı başarıyla güncellendi!');
      } catch (error) {
        console.error('Database initialization error:', error);
        toast.error('Veritabanı başlatılamadı. Lütfen sayfayı yenileyin.');
      } finally {
        setIsInitializing(false);
      }
    };

    init();
  }, []);

  // Show loading screen while initializing
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white p-8 rounded-2xl shadow-2xl shadow-cyan-500/50 mb-6 inline-block">
            <img 
              src={celebiLogo}
              alt="Çelebi Logo"
              className="h-24 md:h-32 w-auto object-contain animate-pulse"
            />
          </div>
          <h2 className="text-2xl text-white mb-2 flex items-center justify-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin" />
            Veritabanı Başlatılıyor...
          </h2>
          <p className="text-cyan-400">Ekipmanlar ve veriler yükleniyor</p>
        </div>
      </div>
    );
  }

  return (
    <AppProvider>
      <div className="min-h-screen bg-slate-900">
        <Toaster position="top-right" theme="dark" richColors />
        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        {/* Header */}
        <header className="relative bg-slate-800/80 border-b border-cyan-500/30 shadow-lg backdrop-blur-sm">
          <div className="container mx-auto px-3 md:px-4 py-3 md:py-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 md:gap-4 min-w-0 flex-1">
                <div className="bg-white p-2 md:p-2.5 rounded-lg shadow-lg shadow-cyan-500/30 flex-shrink-0">
                  <img 
                    src={celebiLogo}
                    alt="Çelebi Logo"
                    className="h-8 md:h-10 w-auto object-contain"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-lg md:text-2xl text-white truncate">
                    Çelebi Hava Servisi
                  </h1>
                  <p className="text-cyan-400 text-xs md:text-sm truncate">Ekipman Yönetim Sistemi</p>
                </div>
              </div>
              <Button 
                onClick={() => setShowQRDialog(true)}
                className="bg-cyan-600 hover:bg-cyan-700 text-white flex-shrink-0 px-3 md:px-4"
                size="sm"
              >
                <QrCode className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline">QR Kod</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="relative container mx-auto px-3 md:px-4 py-4 md:py-6">
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid w-full grid-cols-4 gap-1.5 sm:gap-2 mb-4 md:mb-6 bg-slate-800/80 border border-cyan-500/30 backdrop-blur-sm p-1.5 sm:p-2">
              <TabsTrigger 
                value="dashboard" 
                className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-cyan-500/50 transition-all text-white px-1.5 sm:px-3 md:px-4 py-2 sm:py-2.5 flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2"
              >
                <LayoutDashboard className="w-5 h-5 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="text-[10px] sm:text-xs md:text-sm truncate">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger 
                value="handover"
                className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-cyan-500/50 transition-all text-white px-1.5 sm:px-3 md:px-4 py-2 sm:py-2.5 flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2"
              >
                <RefreshCcw className="w-5 h-5 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="text-[10px] sm:text-xs md:text-sm truncate">Teslim</span>
              </TabsTrigger>
              <TabsTrigger 
                value="management"
                className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-cyan-500/50 transition-all text-white px-1.5 sm:px-3 md:px-4 py-2 sm:py-2.5 flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2"
              >
                <Settings className="w-5 h-5 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="text-[10px] sm:text-xs md:text-sm truncate">Yönetim</span>
              </TabsTrigger>
              <TabsTrigger 
                value="faults"
                className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-cyan-500/50 transition-all text-white px-1.5 sm:px-3 md:px-4 py-2 sm:py-2.5 flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2"
              >
                <AlertTriangle className="w-5 h-5 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="text-[10px] sm:text-xs md:text-sm truncate">Arızalar</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <Dashboard />
            </TabsContent>

            <TabsContent value="handover">
              <EquipmentHandover />
            </TabsContent>

            <TabsContent value="management">
              <EquipmentManagement />
            </TabsContent>

            <TabsContent value="faults">
              <FaultRegistry />
            </TabsContent>
          </Tabs>
        </main>

      {/* QR Code Dialog */}
      <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
        <DialogContent className="bg-slate-800 border-cyan-500/30 max-w-[95vw] md:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="bg-white p-3 rounded-lg">
                <img 
                  src={celebiLogo}
                  alt="Çelebi Logo"
                  className="h-12 w-auto object-contain"
                />
              </div>
            </div>
            <DialogTitle className="text-white text-base md:text-lg text-center">Çelebi Ekipman Yönetim Sistemi</DialogTitle>
            <DialogDescription className="text-slate-300 text-sm text-center">
              Bu uygulamaya erişmek için QR kodu tarayın
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center py-4 md:py-6 space-y-4">
            <div className="bg-white p-4 md:p-6 rounded-xl">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(currentURL)}`}
                alt="QR Kod" 
                className="w-48 h-48 md:w-64 md:h-64"
              />
            </div>
            <div className="text-center w-full px-2">
              <p className="text-xs md:text-sm text-slate-400 mb-2">veya linki kopyalayın:</p>
              <div className="flex items-center gap-2 bg-slate-700/50 px-3 md:px-4 py-2 rounded-lg max-w-full overflow-hidden">
                <code className="text-cyan-400 text-xs md:text-sm break-all line-clamp-2">{currentURL}</code>
              </div>
            </div>
            <Button 
              onClick={() => {
                // Fallback method for copying text
                const textArea = document.createElement('textarea');
                textArea.value = currentURL;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                
                try {
                  document.execCommand('copy');
                  textArea.remove();
                  toast.success('Link panoya kopyalandı!');
                } catch (err) {
                  textArea.remove();
                  toast.error('Link kopyalanamadı. Lütfen manuel olarak kopyalayın.');
                }
              }}
              className="bg-cyan-600 hover:bg-cyan-700 text-white w-full md:w-auto"
            >
              Linki Kopyala
            </Button>
            <div className="text-center mt-2">
              <p className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded-lg px-3 py-2">
                ℹ️ Not: QR kod sadece aynı ağdaki cihazlardan çalışır. 
                Uygulamayı internette paylaşmak için bir hosting servisi kullanın.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      </div>
    </AppProvider>
  );
}
```
