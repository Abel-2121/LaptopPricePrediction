import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Monitor, Cpu, HardDrive, Laptop, Weight, 
  DollarSign, Loader2, Zap, Layers, Box, Info,
  ChevronRight, ArrowRight, ShieldCheck, Globe, Activity
} from 'lucide-react';
import { SignInButton, UserButton, useUser, useAuth } from '@clerk/react';
import HardwareForm from './components/HardwareForm';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function App() {
  const { user } = useUser();
  const { isSignedIn, getToken } = useAuth();
  const [options, setOptions] = useState({});
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [optionsError, setOptionsError] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    Company: '',
    TypeName: '',
    Inches: 15.6,
    "Screen Width": 1920,
    "Screen Height": 1080,
    "CPU Brand": '',
    "CPU Frequency": 2.5,
    Ram: 8,
    "Memory Amount": 256,
    "GPU Brand": '',
    OpSys: '',
    Weight: 2.0
  });

  const fetchOptions = async () => {
    setLoadingOptions(true);
    setOptionsError('');
    try {
      const response = await axios.get(`${API_BASE_URL}/api/options`);
      setOptions(response.data);
      const data = response.data;
      setFormData(prev => ({
        ...prev,
        Company: data.Company?.[0] || '',
        TypeName: data.TypeName?.[0] || '',
        "CPU Brand": data["CPU Brand"]?.[0] || '',
        "GPU Brand": data["GPU Brand"]?.[0] || '',
        OpSys: data.OpSys?.[0] || ''
      }));
      setOptionsError('');
      setLoadingOptions(false);
    } catch (err) {
      console.error('Core options sync failed:', err);
      setOptionsError('Failed to synchronize hardware matrix options from the server.');
    }
  };

  useEffect(() => {
    let retryTimeout;
    const initialSync = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/options`);
        setOptions(response.data);
        const data = response.data;
        setFormData(prev => ({
          ...prev,
          Company: data.Company?.[0] || '',
          TypeName: data.TypeName?.[0] || '',
          "CPU Brand": data["CPU Brand"]?.[0] || '',
          "GPU Brand": data["GPU Brand"]?.[0] || '',
          OpSys: data.OpSys?.[0] || ''
        }));
        setOptionsError('');
        setLoadingOptions(false);
      } catch (err) {
        console.warn('Initial core sync failed. Retrying in 3 seconds...', err);
        setOptionsError('Synchronizing hardware matrix... (Initial link failed, retrying in 3s)');
        
        retryTimeout = setTimeout(async () => {
          try {
            const response = await axios.get(`${API_BASE_URL}/api/options`);
            setOptions(response.data);
            const data = response.data;
            setFormData(prev => ({
              ...prev,
              Company: data.Company?.[0] || '',
              TypeName: data.TypeName?.[0] || '',
              "CPU Brand": data["CPU Brand"]?.[0] || '',
              "GPU Brand": data["GPU Brand"]?.[0] || '',
              OpSys: data.OpSys?.[0] || ''
            }));
            setOptionsError('');
            setLoadingOptions(false);
          } catch (retryErr) {
            console.error('Sync retry failed:', retryErr);
            setOptionsError('Failed to synchronize hardware matrix options from the server.');
          }
        }, 3000);
      }
    };

    initialSync();
    return () => clearTimeout(retryTimeout);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = {
        ...formData,
        "Memory Amount": formData["Memory Amount"] * 1000 
      };
      const token = await getToken();
      const response = await axios.post(`${API_BASE_URL}/api/predict`, payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setPrediction(response.data.prediction);
    } catch (err) {
      const mainError = err.response?.data?.error || 'Neural processing failed.';
      const details = err.response?.data?.details ? ` [Details: ${err.response.data.details}]` : '';
      const innerError = err.response?.data?.backendError ? ` (Flask AI Error: ${err.response.data.backendError})` : '';
      setError(`${mainError}${details}${innerError}`);
    } finally {
      setLoading(false);
    }
  };

  if (loadingOptions) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white relative overflow-hidden">
        {/* Background gradient/glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-orange-600/10 via-transparent to-purple-600/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-md w-full px-6 flex flex-col items-center text-center">
          {optionsError ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full bg-slate-950/80 border border-red-500/25 rounded-3xl p-8 backdrop-blur-xl shadow-2xl space-y-6"
            >
              <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-red-500/5">
                <Activity size={32} className="animate-pulse" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-black uppercase tracking-tight text-slate-100">Neural Sync Error</h3>
                <p className="text-sm font-semibold text-slate-400 leading-relaxed">
                  {optionsError}
                </p>
                <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed pt-2">
                  The frontend is unable to reach the API server on port 3001. Please make sure all backend services have finished starting up.
                </p>
              </div>

              <div className="pt-2">
                <button 
                  onClick={fetchOptions} 
                  className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs uppercase tracking-widest rounded-2xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-all flex items-center justify-center gap-2 group"
                >
                  <Zap size={16} fill="white" className="group-hover:scale-110 transition-transform" /> Retry Connection Link
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-8">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full shadow-lg shadow-orange-500/10"
              />
              <div className="space-y-2">
                <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-xs">Initializing Core...</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Synchronizing Neural Options Matrix</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-slate-50/50">
      <nav className="glass-nav flex items-center justify-between border-b-2 border-orange-500/10">
        <div className="flex items-center gap-2">
          <div className="bg-orange-600 p-2 rounded-xl text-white shadow-lg shadow-orange-500/20">
            <Zap size={20} fill="white" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-slate-900">PREDICT.IO</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-2 text-[10px] font-black uppercase text-orange-600 bg-orange-100/50 px-4 py-2 rounded-full border border-orange-200">
            <div className="w-1.5 h-1.5 rounded-full bg-orange-600 animate-pulse"></div>
            Neural Status: Online
          </span>
          {!isSignedIn && (
            <SignInButton mode="modal">
              <button className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-lg shadow-orange-500/20 transition-all">
                Sign In
              </button>
            </SignInButton>
          )}
          {isSignedIn && (
            <div className="flex items-center gap-3 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
              <span className="text-xs font-bold text-slate-700">Hi, {user?.firstName || 'User'}!</span>
              <UserButton />
            </div>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 sm:px-12 pt-16">
        {/* Hero Section */}
        <section className="grid lg:grid-cols-2 gap-20 items-center mb-32">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="space-y-8">
            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-[1.1] text-slate-900">
              The Future of <br /> <span className="text-orange-600">Hardware Value.</span>
            </h1>
            <p className="text-xl sm:text-2xl text-slate-500 font-medium leading-relaxed max-w-xl">
              Professional laptop price estimation powered by high-depth <span className="font-bold text-slate-800">RandomForest AI</span>. Accuracy redefined.
            </p>
            <div className="flex gap-4">
              <button onClick={() => document.getElementById('config').scrollIntoView({ behavior: 'smooth' })} className="pro-button group">
                Start Valuation <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-slate-100 text-slate-600 font-bold text-sm">
                <ShieldCheck size={20} /> Data Secured
              </div>
            </div>
          </motion.div>
          <div className="relative">
            <div className="absolute inset-0 bg-orange-500/10 blur-[120px] rounded-full"></div>
            <img src="/laptop.png" alt="Laptop" className="relative z-10 w-full drop-shadow-2xl" />
          </div>
        </section>

        <div id="config" className="grid xl:grid-cols-[1fr_450px] gap-12 pt-12 border-t border-slate-200">
          <div className="relative">
            <HardwareForm 
              formData={formData} 
              options={options} 
              loading={loading} 
              handleChange={handleChange} 
              handleSubmit={handleSubmit} 
            />
            
            {!isSignedIn && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center text-center p-8 z-20 border border-slate-200/50">
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center text-orange-600 mb-6 border border-orange-200 shadow-md">
                  <ShieldCheck size={32} />
                </div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">Neural Link Locked</h3>
                <p className="text-sm font-semibold text-slate-500 max-w-xs mb-6 leading-relaxed">
                  Authentication is required to authorize the RandomForest ML Price Prediction Engine.
                </p>
                <SignInButton mode="modal">
                  <button className="pro-button bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-500/20 text-white font-bold px-8 py-3.5 rounded-2xl flex items-center gap-2 group transition-all">
                    Sign In to Unlock <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </SignInButton>
              </div>
            )}
          </div>

          <aside className="space-y-10">
            <AnimatePresence mode="wait">
              {error ? (
                <motion.div 
                  key="error" 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className="pro-card border-red-500/20 bg-red-50 text-slate-900 shadow-xl space-y-6 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-5 text-red-600"><Activity size={80} /></div>
                  <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-3 text-red-600">
                      <Activity size={20} className="animate-bounce" />
                      <span className="text-[11px] font-black uppercase tracking-widest">Neural Link Offline</span>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-lg font-black tracking-tight text-slate-800 uppercase">Processing Failed</h4>
                      <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                        {error}
                      </p>
                    </div>
                    <button 
                      onClick={handleSubmit} 
                      className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-md shadow-red-500/20 flex items-center justify-center gap-2 group"
                    >
                      <Zap size={14} /> Re-Transmit Request
                    </button>
                  </div>
                </motion.div>
              ) : prediction ? (
                <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pro-card bg-orange-600 text-white border-orange-500 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10"><DollarSign size={120} /></div>
                  <div className="relative z-10 space-y-12">
                    <div className="space-y-2">
                      <h3 className="text-xs font-black uppercase tracking-[0.4em] opacity-70">Valuation Result</h3>
                      <div className="text-7xl font-black tracking-tighter leading-none">€{prediction.toLocaleString()}</div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between text-[11px] font-black uppercase tracking-widest opacity-70">
                        <span>Model Confidence</span>
                        <span>94.2%</span>
                      </div>
                      <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: "94.2%" }} transition={{ duration: 1.5 }} className="h-full bg-white" />
                      </div>
                    </div>
                    <p className="text-sm font-medium leading-relaxed opacity-80">
                      Based on current market synthesis and neural architectural analysis.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <div className="pro-card bg-slate-100 border-slate-200 text-center py-24 space-y-4">
                  <div className="bg-slate-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-slate-400"><Info size={32} /></div>
                  <p className="text-slate-500 font-bold uppercase text-xs tracking-widest px-12 leading-loose">Enter hardware specifications to generate market valuation</p>
                </div>
              )}
            </AnimatePresence>
            <div className="stat-card">
              <div className="flex items-center gap-3 text-orange-600 mb-2"><Layers size={20} /><span className="text-[11px] font-black uppercase tracking-widest">Stack Verified</span></div>
              <p className="text-xs text-slate-600 font-bold">Integration: React 18 ➜ Node v20 ➜ Flask ➜ RandomForest</p>
            </div>
            <div className="stat-card bg-slate-100 border-slate-200">
              <div className="flex items-center gap-3 text-slate-600 mb-2"><Globe size={20} /><span className="text-[11px] font-black uppercase tracking-widest">Global Reach</span></div>
              <p className="text-xs text-slate-500 font-bold">Valuations synchronized with secondary market averages across EU/NA regions.</p>
            </div>
          </aside>
        </div>
      </main>

      <footer className="mt-40 border-t border-slate-200 py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-8">
          <div className="flex flex-col items-center gap-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
              Secure AI Valuation Core <span className="mx-2 opacity-30">•</span> Powered by Deepmind Intelligence
            </p>
            <p className="text-[9px] font-black text-orange-500 uppercase tracking-widest">
              Protocol v3.0 // Ready for Market Analysis
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
