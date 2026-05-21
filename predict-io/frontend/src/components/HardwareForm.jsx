import { motion } from 'framer-motion';
import { Box, Cpu as CpuIcon, Monitor, Activity, Loader2 } from 'lucide-react';

function HardwareForm({ formData, options, loading, handleChange, handleSubmit }) {
  return (
    <form onSubmit={handleSubmit} className="pro-card space-y-16">
      {/* Section: DNA */}
      <section className="space-y-10">
        <h2 className="section-title">
          <div className="bg-orange-100 p-2 rounded-xl text-orange-600"><Box size={22} /></div>
          Hardware DNA
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-2.5">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Manufacturer</label>
            <select name="Company" value={formData.Company} onChange={handleChange} className="pro-input">
              {options.Company?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
          <div className="space-y-2.5">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Form Factor</label>
            <select name="TypeName" value={formData.TypeName} onChange={handleChange} className="pro-input">
              {options.TypeName?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
        </div>
      </section>

      {/* Section: Core */}
      <section className="space-y-10">
        <h2 className="section-title">
          <div className="bg-orange-100 p-2 rounded-xl text-orange-600"><CpuIcon size={22} /></div>
          Computational Core
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="space-y-2.5">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">CPU Brand</label>
            <select name="CPU Brand" value={formData["CPU Brand"]} onChange={handleChange} className="pro-input">
              {options["CPU Brand"]?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
          <div className="space-y-2.5">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Freq (GHz)</label>
            <input type="number" step="0.1" name="CPU Frequency" value={formData["CPU Frequency"]} onChange={handleChange} className="pro-input" />
          </div>
          <div className="space-y-2.5">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">RAM (GB)</label>
            <input type="number" name="Ram" value={formData.Ram} onChange={handleChange} className="pro-input" />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-2.5">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">GPU Identity</label>
            <select name="GPU Brand" value={formData["GPU Brand"]} onChange={handleChange} className="pro-input">
              {options["GPU Brand"]?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
          <div className="space-y-2.5">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Operating System</label>
            <select name="OpSys" value={formData.OpSys} onChange={handleChange} className="pro-input">
              {options.OpSys?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
        </div>
      </section>

      {/* Section: Display & Dimensions */}
      <section className="space-y-10">
        <h2 className="section-title">
          <div className="bg-orange-100 p-2 rounded-xl text-orange-600"><Monitor size={22} /></div>
          Display & Dimensions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="space-y-2.5">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Size (")</label>
            <input type="number" step="0.1" name="Inches" value={formData.Inches} onChange={handleChange} className="pro-input" />
          </div>
          <div className="space-y-2.5">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Res W</label>
            <input type="number" name="Screen Width" value={formData["Screen Width"]} onChange={handleChange} className="pro-input" />
          </div>
          <div className="space-y-2.5">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Res H</label>
            <input type="number" name="Screen Height" value={formData["Screen Height"]} onChange={handleChange} className="pro-input" />
          </div>
          <div className="space-y-2.5">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Mass (kg)</label>
            <input type="number" step="0.01" name="Weight" value={formData.Weight} onChange={handleChange} className="pro-input" />
          </div>
        </div>
        <div className="space-y-6 pt-6 border-t border-slate-100">
          <div className="flex justify-between items-end">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Storage Matrix (GB)</label>
            <span className="text-2xl font-black text-orange-600 tracking-tighter">{formData["Memory Amount"]} GB</span>
          </div>
          <input type="range" name="Memory Amount" min="32" max="2048" step="32" value={formData["Memory Amount"]} onChange={handleChange} className="w-full" />
        </div>
      </section>

      <button type="submit" disabled={loading} className="pro-button w-full">
        {loading ? <><Loader2 className="animate-spin" /> Analyzing Neural Paths...</> : <><Activity size={24} /> Generate Valuation</>}
      </button>
    </form>
  );
}

export default HardwareForm;
