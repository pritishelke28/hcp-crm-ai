import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInteractions, submitFormInteraction, addLog } from './store/store';
import { MessageSquare, FileText, Send, Activity } from 'lucide-react';

export default function App() {
  const dispatch = useDispatch();
  const logs = useSelector((state) => state.crm.logs);

  // Form State
  const [form, setForm] = useState({ hcp_name: '', discussion_topic: '', summary: '', next_steps: '' });
  
  // Chat State
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'ai', text: 'Hello Agent! Type out your visit details freely. I will parse inputs and handle tool executions automatically.' }
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchInteractions());
  }, [dispatch]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!form.hcp_name) return alert('HCP Name is mandatory');
    await dispatch(submitFormInteraction(form));
    setForm({ hcp_name: '', discussion_topic: '', summary: '', next_steps: '' });
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = chatInput;
    setChatMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setChatInput('');
    setChatLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await response.json();
      
      setChatMessages(prev => [...prev, { sender: 'ai', text: data.response }]);
      // Refresh database tables layout synchronously after a chat log run
      dispatch(fetchInteractions());
    } catch (err) {
      setChatMessages(prev => [...prev, { sender: 'ai', text: 'Error connecting to LangGraph server engine.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navbar Banner */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <Activity className="w-6 h-6 text-indigo-600" />
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Life Science CRM <span className="text-indigo-600 text-sm font-semibold border border-indigo-200 bg-indigo-50 px-2 py-0.5 rounded-full ml-2">HCP Module</span></h1>
        </div>
      </header>

      {/* Workspace Dashboard Grid splits screen layout */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 max-w-7xl mx-auto w-full">
        
        {/* Left Pane: Structured Data Submission Form Form */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
              <FileText className="w-5 h-5 text-indigo-500" />
              <h2 className="text-lg font-semibold text-slate-800">Structured Log Entry Form</h2>
            </div>
            
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">HCP Professional Name</label>
                <input type="text" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500" placeholder="e.g. Dr. Jane Smith" value={form.hcp_name} onChange={e => setForm({...form, hcp_name: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Core Topic of Conversation</label>
                <input type="text" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500" placeholder="e.g. Oncology Pipeline / Drug Trial Review" value={form.discussion_topic} onChange={e => setForm({...form, discussion_topic: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Interaction Summary</label>
                <textarea rows="3" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500" placeholder="Key details concerning product adoption curves..." value={form.summary} onChange={e => setForm({...form, summary: e.target.value})}></textarea>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Follow-Up Action Items</label>
                <input type="text" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500" placeholder="Provide trial packets next Tuesday" value={form.next_steps} onChange={e => setForm({...form, next_steps: e.target.value})} />
              </div>
              <button type="submit" className="w-full bg-slate-900 text-white font-medium py-2 rounded-lg text-sm hover:bg-slate-800 transition">Save Log Entry</button>
            </form>
          </div>

          {/* Mini History Dashboard */}
          <div className="mt-6 pt-4 border-t border-slate-100 max-h-48 overflow-y-auto">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Live CRM Database Registry Logs</h3>
            <div className="space-y-2">
              {logs.map((log) => (
                <div key={log.id} className="p-2 bg-slate-50 border border-slate-200 rounded text-xs">
                  <span className="font-semibold text-indigo-600">Dr. {log.hcp_name}</span> - {log.discussion_topic || "No Topic Specified"}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Right Pane: Conversational LangGraph AI Interface */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden h-[600px]">
          <div className="bg-slate-900 px-4 py-3 flex items-center gap-2 text-white">
            <MessageSquare className="w-5 h-5 text-indigo-400" />
            <h2 className="text-sm font-semibold">LangGraph Co-Pilot Agent Chat</h2>
          </div>

          {/* Scrolling Chat Field Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm shadow-sm ${msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white text-slate-800 rounded-bl-none border border-slate-200'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 text-slate-400 text-xs rounded-xl px-4 py-2 italic animate-pulse">
                  LangGraph agent executing tools pipeline...
                </div>
              </div>
            )}
          </div>

          {/* Text input footer field block submission layout */}
          <form onSubmit={handleChatSubmit} className="p-3 border-t border-slate-200 bg-white flex gap-2">
            <input type="text" className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500" placeholder="Tell the agent to log, fetch, or alter records..." value={chatInput} onChange={e => setChatInput(e.target.value)} />
            <button type="submit" className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-500 transition"><Send className="w-4 h-4" /></button>
          </form>
        </section>

      </main>
    </div>
  );
}