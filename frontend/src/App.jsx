import React, { useState, useEffect } from 'react';

function App() {
  const [hcpName, setHcpName] = useState('');
  const [topic, setTopic] = useState('');
  const [summary, setSummary] = useState('');
  const [followUp, setFollowUp] = useState('');
  
  const [logs, setLogs] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { role: 'agent', text: 'CRM Session Active. Enter interaction logs or drop clinical transcripts below. I will automatically parse details for the central registry.' }
  ]);
  const [loading, setLoading] = useState(false);

  const fetchLogs = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/interactions');
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch (err) {
      console.error("Failed to fetch logs:", err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!hcpName) return;
    
    // Aligned perfectly to match FastAPI Pydantic schema keys
    const payload = {
      hcp_name: hcpName,
      discussion_topic: topic || "General Consultation",
      summary: summary,
      next_steps: followUp
    };

    try {
      const res = await fetch('http://127.0.0.1:8000/api/interactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setHcpName(''); setTopic(''); setSummary(''); setFollowUp('');
        fetchLogs();
      }
    } catch (err) {
      console.error("Error saving log:", err);
    }
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setChatInput('');
    setLoading(true);

    try {
      const res = await fetch('http://127.0.0.1:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });
      
      if (res.ok) {
        const data = await res.json();
        setChatMessages(prev => [...prev, { role: 'agent', text: data.response || "Log entry committed successfully." }]);
        fetchLogs();
      } else {
        setChatMessages(prev => [...prev, { role: 'agent', text: "Error executing agent parsing workflow." }]);
      }
    } catch (err) {
      setChatMessages(prev => [...prev, { role: 'agent', text: "Local CRM server connection error. Verify local port status." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080d1a] text-slate-100 antialiased font-sans flex flex-col justify-between" style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#080d1a', color: '#f1f5f9', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* Dynamic Colored Header */}
      <header className="border-b-2 border-indigo-500/30 bg-[#0e1629] px-8 py-5 flex items-center justify-between" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 32px', backgroundColor: '#0e1629', borderBottom: '2px solid rgba(99, 102, 241, 0.3)' }}>
        <div>
          <h1 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 tracking-tight" style={{ fontSize: '20px', fontWeight: '800', color: '#38bdf8' }}>HCP CRM Intelligent Module</h1>
          <p className="text-xs text-indigo-400 font-mono tracking-wider mt-0.5">AGENT CO-PILOT WORKSPACE v2.0</p>
        </div>
        <div className="flex items-center space-x-2 bg-emerald-950/50 border border-emerald-500/40 px-3 py-1.5 rounded-full" style={{ display: 'flex', alignItems: 'center', backgroundColor: 'rgba(6, 78, 59, 0.5)', border: '1px solid #10b981', padding: '6px 12px', borderRadius: '9999px' }}>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" style={{ width: '10px', height: '10px', backgroundColor: '#34d399', borderRadius: '50%', display: 'inline-block' }}></span>
          <span className="text-xs font-mono font-bold text-emerald-400 tracking-widest ml-2" style={{ color: '#34d399', fontSize: '12px', fontFamily: 'monospace' }}>LIVE CONNECTION</span>
        </div>
      </header>

      {/* Main Workspace Split Grid Layout */}
      <main className="max-w-7xl w-full mx-auto p-6 lg:p-8 flex flex-col lg:flex-row gap-8 flex-1" style={{ display: 'flex', flexDirection: 'row', gap: '32px', padding: '32px', maxWidth: '1280px', width: '100%', margin: '0 auto', flex: 1 }}>
        
        {/* Left Data Column (Manual Form & Registry logs) */}
        <section className="w-full lg:w-[55%] space-y-6" style={{ width: '55%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* High Contrast Form Input Card */}
          <div className="bg-[#0f192e] border border-slate-800 rounded-xl p-6 shadow-2xl relative overflow-hidden" style={{ backgroundColor: '#0f192e', border: '1px solid #1e293b', padding: '24px', borderRadius: '12px' }}>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-indigo-500"></div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-cyan-400 mb-5 flex items-center" style={{ color: '#22d3ee', fontSize: '14px', letterSpacing: '0.1em', marginBottom: '20px' }}>
              <span className="w-2 h-4 bg-cyan-500 rounded-sm mr-2.5" style={{ width: '8px', height: '16px', backgroundColor: '#22d3ee', display: 'inline-block', marginRight: '10px' }}></span>
              Manual CRM Entry Node
            </h2>
            <form onSubmit={handleFormSubmit} className="space-y-4" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase tracking-wider" style={{ color: '#94a3b8', fontSize: '12px' }}>HCP Practitioner Name</label>
                  <input type="text" value={hcpName} onChange={(e) => setHcpName(e.target.value)} placeholder="Dr. Rajesh Nair" className="w-full px-4 py-2.5 bg-[#16223f] border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400" style={{ width: '100%', padding: '10px 16px', backgroundColor: '#16223f', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }} required />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase tracking-wider" style={{ color: '#94a3b8', fontSize: '12px' }}>Core Topic / Drug Portfolio</label>
                  <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Cardio-Metabolic (Teneligliptin)" className="w-full px-4 py-2.5 bg-[#16223f] border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400" style={{ width: '100%', padding: '10px 16px', backgroundColor: '#16223f', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase tracking-wider" style={{ color: '#94a3b8', fontSize: '12px' }}>Conversation Insights Summary</label>
                <textarea rows="3" value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Discussed efficacy profiles, patient tolerability shifts, and hospital formulary listings..." className="w-full px-4 py-2.5 bg-[#16223f] border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 resize-none" style={{ width: '100%', padding: '10px 16px', backgroundColor: '#16223f', border: '1px solid #334155', borderRadius: '8px', color: '#fff', resize: 'none' }}></textarea>
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase tracking-wider" style={{ color: '#94a3b8', fontSize: '12px' }}>Follow-Up Action Routing</label>
                <input type="text" value={followUp} onChange={(e) => setFollowUp(e.target.value)} placeholder="Deliver clinical data sheets to clinic by next Tuesday morning" className="w-full px-4 py-2.5 bg-[#16223f] border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400" style={{ width: '100%', padding: '10px 16px', backgroundColor: '#16223f', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }} />
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-600 hover:to-indigo-700 text-white font-semibold text-sm py-3 px-4 rounded-lg shadow-lg transition-all" style={{ width: '100%', padding: '12px', background: 'linear-gradient(to right, #06b6d4, #4f46e5)', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: '600', cursor: 'pointer' }}>
                Commit Record Entry
              </button>
            </form>
          </div>

          {/* Database Live Log Registry */}
          <div className="bg-[#0f192e] border border-slate-800 rounded-xl p-6 shadow-2xl flex-1 flex flex-col" style={{ backgroundColor: '#0f192e', border: '1px solid #1e293b', padding: '24px', borderRadius: '12px', display: 'flex', flexDirection: 'column', minHeight: '260px' }}>
            <h2 className="text-sm font-bold uppercase tracking-widest text-indigo-400 mb-4 flex items-center border-b border-slate-800/80 pb-3" style={{ color: '#818cf8', fontSize: '14px', borderBottom: '1px solid #1e293b', paddingBottom: '12px' }}>
              <span className="w-2 h-4 bg-indigo-500 rounded-sm mr-2.5" style={{ width: '8px', height: '16px', backgroundColor: '#818cf8', display: 'inline-block', marginRight: '10px' }}></span>
              Live CRM System Logs
            </h2>
            <div className="flex-1 overflow-y-auto space-y-3 max-h-64 pr-1" style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {logs.length === 0 ? (
                <p className="text-xs text-slate-500 font-mono italic text-center py-8" style={{ textAlign: 'center', color: '#64748b', fontStyle: 'italic', padding: '32px 0' }}>NO DATABASE ACTIVE RECORDS DETECTED</p>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="p-4 bg-[#16223f]/60 border border-slate-800 rounded-lg text-sm flex items-start justify-between hover:bg-[#16223f] transition-colors" style={{ padding: '16px', backgroundColor: 'rgba(22, 34, 63, 0.6)', border: '1px solid #1e293b', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div className="flex items-center space-x-2" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="font-bold text-white text-base" style={{ color: '#fff', fontWeight: '700' }}>{log.hcp_name}</span>
                        <span className="text-slate-600 font-mono text-xs">|</span>
                        {/* Aligned to display backend discussion_topic safely */}
                        <span className="text-cyan-400 font-semibold text-xs font-mono" style={{ color: '#22d3ee', fontSize: '12px' }}>{log.discussion_topic}</span>
                      </div>
                      {log.summary && <p className="text-xs text-slate-300 leading-relaxed mt-1" style={{ color: '#cbd5e1', fontSize: '13px', margin: '4px 0 0 0' }}>{log.summary}</p>}
                    </div>
                    {/* Aligned to evaluate backend next_steps cleanly */}
                    {log.next_steps && (
                      <span className="bg-amber-500/10 border border-amber-500/40 text-amber-400 font-mono text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.4)', color: '#fbbf24', fontSize: '10px', fontWeight: '700', padding: '4px 10px', borderRadius: '4px' }}>
                        Action Item
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Right Side Console Column (AI Interface) */}
        <section className="w-full lg:w-[45%] flex flex-col bg-[#0f192e] border border-slate-800 rounded-xl shadow-2xl overflow-hidden" style={{ width: '45%', display: 'flex', flexDirection: 'column', backgroundColor: '#0f192e', border: '1px solid #1e293b', borderRadius: '12px', minHeight: '560px' }}>
          <div className="bg-[#14203b] px-6 py-4 border-b border-slate-800 flex items-center justify-between" style={{ padding: '16px 24px', backgroundColor: '#14203b', borderBottom: '1px solid #1e293b' }}>
            <h2 className="text-xs font-bold font-mono tracking-widest text-slate-300 uppercase flex items-center" style={{ color: '#cbd5e1', fontSize: '12px', letterSpacing: '0.1em' }}>
              <span className="w-2 h-2 rounded-full bg-indigo-400 mr-2 animate-ping" style={{ width: '8px', height: '8px', backgroundColor: '#818cf8', borderRadius: '50%', marginRight: '8px', display: 'inline-block' }}></span>
              LangGraph Orchestration Terminal
            </h2>
          </div>

          {/* Interactive Chat Stream */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#0a1122]/40" style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: 'rgba(10, 17, 34, 0.4)' }}>
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-md ${
                  msg.role === 'user' 
                    ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-tr-none' 
                    : 'bg-[#16223f] border border-slate-800/80 text-slate-100 rounded-tl-none'
                }`} style={{
                  maxWidth: '85%',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  fontSize: '14px',
                  backgroundColor: msg.role === 'user' ? '#4f46e5' : '#16223f',
                  border: msg.role === 'user' ? 'none' : '1px solid #1e293b',
                  color: '#fff',
                  borderTopRightRadius: msg.role === 'user' ? '0px' : '12px',
                  borderTopLeftRadius: msg.role === 'user' ? '12px' : '0px'
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ backgroundColor: '#16223f', border: '1px solid #1e293b', padding: '12px', borderRadius: '12px', borderTopLeftRadius: '0px', color: '#64748b', fontSize: '12px', fontFamily: 'monospace' }}>
                  PARSING TRANSCRIPT INTERACTION GRAPH...
                </div>
              </div>
            )}
          </div>

          {/* Chat Execution Form */}
          <form onSubmit={handleChatSubmit} className="p-4 border-t border-slate-800 bg-[#0f192e] flex items-center gap-3" style={{ padding: '16px', borderTop: '1px solid #1e293b', display: 'flex', gap: '12px', backgroundColor: '#0f192e' }}>
            <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="e.g., Met Dr. Amit Patel at Max Hospital today, discussed..." className="flex-1 px-4 py-2.5 bg-[#16223f] border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500" style={{ flex: 1, padding: '10px 16px', backgroundColor: '#16223f', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }} />
            <button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-800 text-white px-4 py-2.5 rounded-lg font-semibold transition-all" style={{ backgroundColor: '#4f46e5', border: 'none', color: '#fff', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
              Send
            </button>
          </form>
        </section>

      </main>
    </div>
  );
}

export default App;