'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Users,
  Search,
  Download,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  Eye,
  X,
  FileSpreadsheet,
} from 'lucide-react';

export default function HostAttendeesPage() {
  const params = useParams();
  const eventId = params?.id as string;

  const [attendees, setAttendees] = useState<any[]>([
    {
      id: 'reg_1',
      ticketNumber: 'TKT-829104',
      name: 'Alex Rivera',
      email: 'alex@sushanti.dev',
      college: 'IIT Delhi',
      tier: 'Standard Pass',
      team: 'NeuralCraft Syndicate',
      status: 'CONFIRMED',
      isCheckedIn: false,
      date: '2026-10-22',
      responses: {
        Track: 'Autonomous Agents',
        GitHub: 'https://github.com/alexrivera-dev',
        TShirt: 'L',
      },
    },
    {
      id: 'reg_2',
      ticketNumber: 'TKT-829105',
      name: 'Rohit Verma',
      email: 'rohit@sushanti.dev',
      college: 'NID / DTU',
      tier: 'Standard Pass',
      team: 'NeuralCraft Syndicate',
      status: 'CONFIRMED',
      isCheckedIn: true,
      date: '2026-10-22',
      responses: {
        Track: 'Autonomous Agents',
        GitHub: 'https://github.com/rohitverma-ui',
        TShirt: 'M',
      },
    },
    {
      id: 'reg_3',
      ticketNumber: 'TKT-829106',
      name: 'Sneha Patel',
      email: 'sneha@example.com',
      college: 'IIIT Hyderabad',
      tier: 'VIP Swag Pass',
      team: 'BioHealth Labs',
      status: 'CONFIRMED',
      isCheckedIn: false,
      date: '2026-10-23',
      responses: {
        Track: 'Healthcare AI',
        GitHub: 'https://github.com/snehapatel-ai',
        TShirt: 'S',
      },
    },
  ]);

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [selectedResponse, setSelectedResponse] = useState<any>(null);

  const filteredAttendees = attendees.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase()) ||
      a.ticketNumber.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      filterStatus === 'ALL'
        ? true
        : filterStatus === 'CHECKED_IN'
        ? a.isCheckedIn
        : a.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const exportCSV = () => {
    const headers = ['Ticket Number', 'Name', 'Email', 'College', 'Tier', 'Team', 'Checked In'];
    const rows = filteredAttendees.map((a) => [
      a.ticketNumber,
      a.name,
      a.email,
      a.college,
      a.tier,
      a.team || 'Solo',
      a.isCheckedIn ? 'YES' : 'NO',
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `attendees_${eventId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href={`/host/events/${eventId}/overview`}
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            ← Back to Command Center
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 font-display">
            Attendee Roster & Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Total {attendees.length} registered participants. Review answers and export CSV.
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-all"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Export Attendee CSV</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search attendee, email, ticket..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="CHECKED_IN">Checked In Only</option>
            <option value="CONFIRMED">Confirmed Only</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Ticket</th>
                <th className="p-4">Attendee</th>
                <th className="p-4">College</th>
                <th className="p-4">Tier</th>
                <th className="p-4">Squad</th>
                <th className="p-4">Check-In</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredAttendees.map((att) => (
                <tr key={att.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 font-mono font-bold text-amber-400">{att.ticketNumber}</td>
                  <td className="p-4">
                    <p className="font-bold text-white">{att.name}</p>
                    <p className="text-[11px] text-slate-400">{att.email}</p>
                  </td>
                  <td className="p-4 text-slate-400">{att.college}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/10 text-indigo-400">
                      {att.tier}
                    </span>
                  </td>
                  <td className="p-4 font-semibold text-white">{att.team || 'Solo'}</td>
                  <td className="p-4">
                    {att.isCheckedIn ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Checked In
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-500">Not Scanned</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setSelectedResponse(att)}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                    >
                      <Eye className="w-3.5 h-3.5" /> Answers
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Answers Popup Modal */}
      {selectedResponse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl relative">
            <button
              onClick={() => setSelectedResponse(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-base font-bold text-white">
              Form Answers: {selectedResponse.name}
            </h3>

            <div className="space-y-2 text-xs">
              {Object.entries(selectedResponse.responses).map(([k, v]) => (
                <div key={k} className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 font-semibold block">{k}:</span>
                  <span className="text-white font-medium break-all">{String(v)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
