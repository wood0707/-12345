"use client";

import { useState } from "react";

export default function Home() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "" });

  function handlePhone(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value.replace(/\D/g, "");
    let formatted = val;
    if (val.length > 3 && val.length <= 7) {
      formatted = val.slice(0, 3) + "-" + val.slice(3);
    } else if (val.length > 7) {
      formatted = val.slice(0, 3) + "-" + val.slice(3, 7) + "-" + val.slice(7, 11);
    }
    setForm((prev) => ({ ...prev, phone: formatted }));
  }

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    if (!form.name || !form.phone || !form.email) {
      alert("모든 항목을 입력해 주세요.");
      return;
    }
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      alert("오류가 발생했습니다. 다시 시도해 주세요.");
      return;
    }

    setSubmitted(true);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f4f8] p-6 font-sans">
      <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] p-12 w-full max-w-[480px]">
        {!submitted ? (
          <>
            <h1 className="text-[1.75rem] font-semibold text-[#1a202c] mb-2">문의하기</h1>
            <p className="text-[0.95rem] text-[#718096] mb-8 leading-relaxed">
              아래 정보를 입력해 주시면 빠르게 연락드리겠습니다.
            </p>

            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-5">
                <label className="block text-sm font-semibold text-[#2d3748] mb-1.5" htmlFor="name">
                  이름
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="홍길동"
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3.5 py-3 border-[1.5px] border-[#e2e8f0] rounded-lg text-base text-[#1a202c] placeholder-[#a0aec0] outline-none transition focus:border-[#4f46e5] focus:shadow-[0_0_0_3px_rgba(79,70,229,0.12)]"
                />
              </div>

              <div className="mb-5">
                <label className="block text-sm font-semibold text-[#2d3748] mb-1.5" htmlFor="phone">
                  전화번호
                </label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="010-0000-0000"
                  value={form.phone}
                  onChange={handlePhone}
                  className="w-full px-3.5 py-3 border-[1.5px] border-[#e2e8f0] rounded-lg text-base text-[#1a202c] placeholder-[#a0aec0] outline-none transition focus:border-[#4f46e5] focus:shadow-[0_0_0_3px_rgba(79,70,229,0.12)]"
                />
              </div>

              <div className="mb-5">
                <label className="block text-sm font-semibold text-[#2d3748] mb-1.5" htmlFor="email">
                  이메일
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={form.email}
                  onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3.5 py-3 border-[1.5px] border-[#e2e8f0] rounded-lg text-base text-[#1a202c] placeholder-[#a0aec0] outline-none transition focus:border-[#4f46e5] focus:shadow-[0_0_0_3px_rgba(79,70,229,0.12)]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#4f46e5] text-white text-base font-semibold rounded-lg mt-2 cursor-pointer transition hover:bg-[#4338ca]"
              >
                제출하기
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="text-5xl mb-3">✅</div>
            <h2 className="text-xl font-semibold text-[#1a202c] mb-2">접수가 완료되었습니다!</h2>
            <p className="text-sm text-[#718096]">입력하신 정보로 빠르게 연락드리겠습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
