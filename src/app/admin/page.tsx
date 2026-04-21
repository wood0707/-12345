"use client";

import { useState } from "react";

type Lead = {
  id: number;
  name: string;
  phone: string;
  email: string;
  createdAt: string;
};

type Memo = {
  id: number;
  leadId: number;
  content: string;
  createdAt: string;
};

function MemoPanel({ lead, password }: { lead: Lead; password: string }) {
  const [memos, setMemos] = useState<Memo[] | null>(null);
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadMemos() {
    const res = await fetch(`/api/leads/${lead.id}/memos?password=${encodeURIComponent(password)}`);
    if (res.ok) setMemos(await res.json());
  }

  async function toggle() {
    if (!open && memos === null) await loadMemos();
    setOpen((v) => !v);
  }

  async function addMemo(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    const res = await fetch(`/api/leads/${lead.id}/memos?password=${encodeURIComponent(password)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: text }),
    });
    if (res.ok) {
      const memo = await res.json();
      setMemos((prev) => [memo, ...(prev ?? [])]);
      setText("");
    }
    setLoading(false);
  }

  async function deleteMemo(memoId: number) {
    await fetch(`/api/leads/${lead.id}/memos?password=${encodeURIComponent(password)}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ memoId }),
    });
    setMemos((prev) => prev?.filter((m) => m.id !== memoId) ?? []);
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleString("ko-KR", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const memoCount = memos?.length ?? 0;

  return (
    <div>
      <button
        onClick={toggle}
        className="flex items-center gap-1.5 text-xs text-[#4f46e5] font-medium hover:underline"
      >
        <span>{open ? "▲" : "▼"}</span>
        <span>메모 {memos !== null ? `(${memoCount})` : ""}</span>
      </button>

      {open && (
        <div className="mt-3 border border-[#e2e8f0] rounded-xl p-4 bg-[#fafbff]">
          <form onSubmit={addMemo} className="flex gap-2 mb-3">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="메모 입력..."
              className="flex-1 px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm outline-none focus:border-[#4f46e5] focus:shadow-[0_0_0_2px_rgba(79,70,229,0.1)]"
            />
            <button
              type="submit"
              disabled={loading || !text.trim()}
              className="px-4 py-2 bg-[#4f46e5] text-white text-sm font-medium rounded-lg hover:bg-[#4338ca] disabled:opacity-40 transition"
            >
              추가
            </button>
          </form>

          {memos === null ? (
            <p className="text-xs text-[#a0aec0]">불러오는 중...</p>
          ) : memos.length === 0 ? (
            <p className="text-xs text-[#a0aec0]">메모가 없습니다.</p>
          ) : (
            <ul className="space-y-2">
              {memos.map((memo) => (
                <li key={memo.id} className="flex items-start justify-between gap-2 text-sm">
                  <div>
                    <p className="text-[#2d3748] leading-snug">{memo.content}</p>
                    <p className="text-xs text-[#a0aec0] mt-0.5">{formatDate(memo.createdAt)}</p>
                  </div>
                  <button
                    onClick={() => deleteMemo(memo.id)}
                    className="text-xs text-[#e53e3e] hover:underline shrink-0 mt-0.5"
                  >
                    삭제
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/leads?password=${encodeURIComponent(password)}`);
      if (res.status === 401) {
        setError("비밀번호가 올바르지 않습니다.");
        setLeads(null);
      } else if (!res.ok) {
        setError("오류가 발생했습니다.");
      } else {
        setLeads(await res.json());
      }
    } catch {
      setError("서버에 연결할 수 없습니다.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRefresh() {
    setLoading(true);
    try {
      const res = await fetch(`/api/leads?password=${encodeURIComponent(password)}`);
      if (res.ok) setLeads(await res.json());
    } finally {
      setLoading(false);
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

  if (leads === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0f4f8] p-6">
        <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] p-10 w-full max-w-sm">
          <h1 className="text-xl font-semibold text-[#1a202c] mb-6">관리자 로그인</h1>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-3 border-[1.5px] border-[#e2e8f0] rounded-lg text-base text-[#1a202c] placeholder-[#a0aec0] outline-none transition focus:border-[#4f46e5] focus:shadow-[0_0_0_3px_rgba(79,70,229,0.12)] mb-3"
              autoFocus
            />
            {error && <p className="text-sm text-red-500 mb-3">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#4f46e5] text-white text-base font-semibold rounded-lg cursor-pointer transition hover:bg-[#4338ca] disabled:opacity-50"
            >
              {loading ? "확인 중..." : "로그인"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f4f8] p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-[#1a202c]">리드 관리</h1>
            <p className="text-sm text-[#718096] mt-1">총 {leads.length}건</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="px-4 py-2 bg-white border border-[#e2e8f0] text-sm font-medium text-[#4a5568] rounded-lg hover:bg-[#f7fafc] transition disabled:opacity-50"
            >
              새로고침
            </button>
            <button
              onClick={() => setLeads(null)}
              className="px-4 py-2 bg-white border border-[#e2e8f0] text-sm font-medium text-[#4a5568] rounded-lg hover:bg-[#f7fafc] transition"
            >
              로그아웃
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] overflow-hidden">
          {leads.length === 0 ? (
            <div className="text-center py-16 text-[#a0aec0]">아직 문의 내역이 없습니다.</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#e2e8f0] bg-[#f7fafc]">
                  <th className="text-left px-6 py-3.5 font-semibold text-[#4a5568]">번호</th>
                  <th className="text-left px-6 py-3.5 font-semibold text-[#4a5568]">이름</th>
                  <th className="text-left px-6 py-3.5 font-semibold text-[#4a5568]">전화번호</th>
                  <th className="text-left px-6 py-3.5 font-semibold text-[#4a5568]">이메일</th>
                  <th className="text-left px-6 py-3.5 font-semibold text-[#4a5568]">접수일시</th>
                  <th className="text-left px-6 py-3.5 font-semibold text-[#4a5568]">메모</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead, i) => (
                  <tr
                    key={lead.id}
                    className={`border-b border-[#f0f4f8] align-top ${i % 2 === 0 ? "" : "bg-[#fafbfc]"}`}
                  >
                    <td className="px-6 py-4 text-[#a0aec0]">{lead.id}</td>
                    <td className="px-6 py-4 font-medium text-[#1a202c]">{lead.name}</td>
                    <td className="px-6 py-4 text-[#4a5568]">{lead.phone}</td>
                    <td className="px-6 py-4 text-[#4a5568]">{lead.email}</td>
                    <td className="px-6 py-4 text-[#718096] whitespace-nowrap">{formatDate(lead.createdAt)}</td>
                    <td className="px-6 py-4 min-w-[280px]">
                      <MemoPanel lead={lead} password={password} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
