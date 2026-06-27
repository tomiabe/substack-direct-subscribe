"use client";

import React, { useEffect, useRef, useState } from "react";
import { SubstackForm } from "./SubstackForm";
import type { SubstackPopupProps } from "./types";

const SUBSCRIBED_KEY = "sds_subscribed";
const DISMISSED_KEY = "sds_dismissed";

export function SubstackPopup({
  substackUrl,
  publicationId,
  delayMinutes = 5,
  onSubscribe,
}: SubstackPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (localStorage.getItem(SUBSCRIBED_KEY) === "true") return;
    if (sessionStorage.getItem(DISMISSED_KEY) === "true") return;

    timerRef.current = setTimeout(() => {
      setIsOpen(true);
    }, Math.max(delayMinutes, 0) * 60 * 1000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [delayMinutes]);

  useEffect(() => {
    const handler = () => {
      setIsOpen(true);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
    window.addEventListener("open-newsletter-popup", handler);
    return () => window.removeEventListener("open-newsletter-popup", handler);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    const scrollY = window.scrollY;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };

    document.addEventListener("keydown", onKey);
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflow = "";
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  const handleSuccess = () => {
    localStorage.setItem(SUBSCRIBED_KEY, "true");
    onSubscribe?.();
  };

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem(DISMISSED_KEY, "true");
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === overlayRef.current) handleClose();
      }}
    >
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-8 md:p-10">
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Never miss an update!
          </h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            Subscribe to our newsletter for weekly stories and analysis.
          </p>
        </div>

        <SubstackForm
          substackUrl={substackUrl}
          publicationId={publicationId}
          layout="card"
          align="center"
          onSuccess={handleSuccess}
        />
      </div>
    </div>
  );
}
