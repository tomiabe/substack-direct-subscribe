"use client";

import React, { useState } from "react";
import type { SubstackFormProps } from "./types";

export function SubstackForm({
  substackUrl,
  publicationId,
  layout = "card",
  fullWidth = false,
  align = "center",
  onSuccess,
}: SubstackFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status === "submitting") return;
    setStatus("submitting");

    try {
      await fetch(`${substackUrl.replace(/\/+$/, "")}/api/v1/free`, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          email,
          first_url: window.location.href,
          current_url: window.location.href,
          landingPublicationId: publicationId,
        }).toString(),
      });

      setStatus("success");
      setEmail("");
      onSuccess?.();
    } catch {
      setStatus("error");
    }
  };

  const isBanner = layout === "banner";

  if (status === "success") {
    return (
      <div
        className={`rounded-lg border p-6 ${
          isBanner
            ? "bg-white/10 text-white border-white/20"
            : "bg-green-50 text-green-900 border-green-200"
        }`}
      >
        <p className="text-center font-semibold">You&rsquo;re in!</p>
        <p className="text-center text-sm mt-1 opacity-80">
          Check your inbox for a confirmation email.
        </p>
        <div className="flex justify-center mt-3">
          <button
            onClick={() => setStatus("idle")}
            className="text-xs underline decoration-dotted underline-offset-4 opacity-60 hover:opacity-100"
          >
            Subscribe another email
          </button>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-900">
        <p className="text-center font-semibold">Connection issue</p>
        <div className="text-center text-sm mt-1">
          <span className="opacity-80">Please check your connection, or </span>
          <a
            href={`${substackUrl.replace(/\/+$/, "")}/subscribe`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-semibold"
          >
            subscribe directly on Substack
          </a>
          .
        </div>
        <div className="flex justify-center mt-3">
          <button
            onClick={() => setStatus("idle")}
            className="text-xs underline decoration-dotted underline-offset-4 opacity-60 hover:opacity-100"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${fullWidth ? "w-full" : "max-w-lg mx-auto"}`}>
      <form
        onSubmit={handleSubmit}
        className={`flex flex-col sm:flex-row gap-3 ${
          align === "left"
            ? "justify-start"
            : align === "right"
              ? "justify-end"
              : "justify-center"
        }`}
      >
        <div className={fullWidth ? "flex-1" : "flex-1 max-w-md"}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "submitting"}
            placeholder="Enter your email address"
            required
            className={`w-full h-14 px-6 rounded-md border-2 text-base transition-all ${
              isBanner
                ? "border-transparent bg-white text-gray-900 placeholder:text-gray-400 focus:border-white/50"
                : "border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-emerald-600"
            }`}
          />
        </div>
        <button
          type="submit"
          disabled={status === "submitting"}
          className={`h-14 px-8 rounded-md font-bold text-base whitespace-nowrap transition-all ${
            isBanner
              ? "bg-white text-emerald-900 hover:bg-emerald-50"
              : "bg-emerald-600 text-white hover:bg-emerald-700"
          }`}
        >
          {status === "submitting" ? "Subscribing…" : "Subscribe"}
        </button>
      </form>
    </div>
  );
}
