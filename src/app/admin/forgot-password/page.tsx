"use client";

import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/admin/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setSent(true);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow p-8 w-full max-w-sm">
        {sent ? (
          <>
            <h1 className="text-xl font-bold text-gray-800 mb-2">
              이메일을 확인하세요
            </h1>
            <p className="text-sm text-gray-500 mb-6">
              등록된 이메일로 로그인 링크를 보냈습니다.
              <br />
              링크는 15분 동안 유효합니다.
            </p>
            <a
              href="/admin/login"
              className="text-sm text-blue-600 hover:underline"
            >
              ← 로그인 페이지로 돌아가기
            </a>
          </>
        ) : (
          <>
            <h1 className="text-xl font-bold text-gray-800 mb-2">
              비밀번호 찾기
            </h1>
            <p className="text-sm text-gray-500 mb-6">
              등록된 이메일을 입력하면 로그인 링크를 보내드립니다.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  이메일
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="admin@example.com"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                disabled={loading || !email}
                className="w-full bg-blue-600 text-white rounded-lg py-2 font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "전송 중..." : "링크 전송"}
              </button>
              <a
                href="/admin/login"
                className="block text-center text-sm text-gray-500 hover:underline"
              >
                ← 로그인으로 돌아가기
              </a>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
