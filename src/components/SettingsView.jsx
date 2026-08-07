import React from 'react';
import { useApp } from '../context/AppContext';
import { Settings, ShieldCheck, Check, Layers, Sliders, AlertCircle } from 'lucide-react';

export default function SettingsView() {
  const { roles, useExpandedWorkflow, setUseExpandedWorkflow, isAdmin } = useApp();

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          System & Workflow Settings
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Configure default role permissions, status stages, and system parameters.
        </p>
      </div>

      {/* Workflow Mode Toggle */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Sliders className="w-4 h-4 text-red-600" />
              <span>Content Workflow Mode</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Switch between the Simple MVP 3-stage workflow or the Expanded 8-stage production pipeline.
            </p>
          </div>

          <button
            onClick={() => setUseExpandedWorkflow(!useExpandedWorkflow)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
              useExpandedWorkflow
                ? 'bg-red-600 text-white'
                : 'bg-slate-800 text-white'
            }`}
          >
            {useExpandedWorkflow ? 'Expanded 8-Stage Active' : 'Simple 3-Stage MVP Active'}
          </button>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
          <div className="font-bold text-slate-800 mb-2">Current Active Pipeline Stages:</div>
          {!useExpandedWorkflow ? (
            <div className="flex items-center gap-2 text-slate-700 font-semibold flex-wrap">
              <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full">1. Pending</span>
              <span>→</span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">2. In Progress</span>
              <span>→</span>
              <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">3. Completed</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-slate-700 font-semibold flex-wrap text-[11px]">
              <span className="bg-slate-200 px-2 py-0.5 rounded-full">Pending</span> →
              <span className="bg-slate-200 px-2 py-0.5 rounded-full">Research</span> →
              <span className="bg-slate-200 px-2 py-0.5 rounded-full">Script</span> →
              <span className="bg-slate-200 px-2 py-0.5 rounded-full">Editing</span> →
              <span className="bg-slate-200 px-2 py-0.5 rounded-full">Thumbnail</span> →
              <span className="bg-slate-200 px-2 py-0.5 rounded-full">Ready to Upload</span> →
              <span className="bg-slate-200 px-2 py-0.5 rounded-full">Published</span> →
              <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">Completed</span>
            </div>
          )}
        </div>
      </div>

      {/* System Roles Grid */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-purple-600" />
          <span>System Roles & Authorization Matrix</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roles.map((r) => (
            <div
              key={r.name}
              className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-sm">{r.name}</h4>
                <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">
                  System Role
                </span>
              </div>
              <p className="text-xs text-slate-600">{r.description}</p>
              <div className="pt-2 border-t border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                  Permissions
                </span>
                <div className="flex items-center flex-wrap gap-1">
                  {r.permissions.map((p) => (
                    <span
                      key={p}
                      className="bg-white text-slate-800 border border-slate-200 text-[10px] px-2 py-0.5 rounded font-medium"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
