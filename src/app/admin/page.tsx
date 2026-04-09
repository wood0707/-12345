"use client";

import { useEffect, useState } from "react";

interface Lead {
  id: number;
  name: string;
  phone: string;
  email: string;
  createdAt: string;
}

interface EditState {
  id: number;
  name: string;
  phone: string;
  email: string;
}

export default function AdminPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editState, setEditState] = useState<EditState | null>(null);
  const [saving, setSaving] = useState(false);

  async function fetchLeads() {
    try {
      const res = await fetch("/api/leads");
      if (!res.ok) throw new Error("데이터를 불러오지 못했습니다.");
      const data = await res.json();
      setLeads(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLeads();
  }, []);

  function startEdit(lead: Lead) {
    setEditState({ id: lead.id, name: lead.name, phone: lead.phone, email: lead.email });
  }

  function cancelEdit() {
    setEditState(null);
  }

  async function saveEdit() {
    if (!editState) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/leads/${editState.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editState.name, phone: editState.phone, email: editState.email }),
      });
      if (!res.ok) throw new Error("저장에 실패했습니다.");
      setLeads((prev) =>
        prev.map((l) => (l.id === editState.id ? { ...l, ...editState } : l))
      );
      setEditState(null);
    } catch (e) {
      alert(e instanceof Error ? e.message : "오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteLead(id: number) {
    if (!window.confirm("이 리드를 삭제하시겠습니까?")) return;
    try {
      const res = await fetch(`/api/leads/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("삭제에 실패했습니다.");
      setLeads((prev) => prev.filter((l) => l.id !== id));
    } catch (e) {
      alert(e instanceof Error ? e.message : "오류가 발생했습니다.");
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">리드 관리</h1>
          <button
            onClick={async () => {
              await fetch("/api/admin/logout", { method: "POST" });
              window.location.href = "/admin/login";
            }}
            className="px-3 py-1.5 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            로그아웃
          </button>
        </div>

        {loading && (
          <div className="text-center py-16 text-gray-500">불러오는 중...</div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            <p className="text-sm text-gray-500 mb-4">총 {leads.length}건</p>
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3 text-left w-10">#</th>
                    <th className="px-4 py-3 text-left">이름</th>
                    <th className="px-4 py-3 text-left">전화번호</th>
                    <th className="px-4 py-3 text-left">이메일</th>
                    <th className="px-4 py-3 text-left">등록일시</th>
                    <th className="px-4 py-3 text-left w-32">작업</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {leads.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                        등록된 리드가 없습니다.
                      </td>
                    </tr>
                  )}
                  {leads.map((lead) => {
                    const isEditing = editState?.id === lead.id;
                    return (
                      <tr key={lead.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-400">{lead.id}</td>

                        <td className="px-4 py-3">
                          {isEditing ? (
                            <input
                              className="border border-gray-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                              value={editState.name}
                              onChange={(e) => setEditState({ ...editState, name: e.target.value })}
                            />
                          ) : (
                            lead.name
                          )}
                        </td>

                        <td className="px-4 py-3">
                          {isEditing ? (
                            <input
                              className="border border-gray-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                              value={editState.phone}
                              onChange={(e) => setEditState({ ...editState, phone: e.target.value })}
                            />
                          ) : (
                            lead.phone
                          )}
                        </td>

                        <td className="px-4 py-3">
                          {isEditing ? (
                            <input
                              className="border border-gray-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                              value={editState.email}
                              onChange={(e) => setEditState({ ...editState, email: e.target.value })}
                            />
                          ) : (
                            lead.email
                          )}
                        </td>

                        <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                          {formatDate(lead.createdAt)}
                        </td>

                        <td className="px-4 py-3">
                          {isEditing ? (
                            <div className="flex gap-1">
                              <button
                                onClick={saveEdit}
                                disabled={saving}
                                className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 disabled:opacity-50"
                              >
                                {saving ? "저장 중" : "저장"}
                              </button>
                              <button
                                onClick={cancelEdit}
                                disabled={saving}
                                className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs hover:bg-gray-300 disabled:opacity-50"
                              >
                                취소
                              </button>
                            </div>
                          ) : (
                            <div className="flex gap-1">
                              <button
                                onClick={() => startEdit(lead)}
                                className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200"
                              >
                                수정
                              </button>
                              <button
                                onClick={() => deleteLead(lead.id)}
                                className="px-2 py-1 bg-red-50 text-red-600 rounded text-xs hover:bg-red-100"
                              >
                                삭제
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
