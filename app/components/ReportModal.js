'use client';

import React, { useState, useRef } from 'react';
import { X, Plus, Minus, Send, Loader2 } from 'lucide-react';
import { Turnstile } from '@marsidev/react-turnstile';
import { submitReportAction } from '../actions';

export default function ReportModal({ isOpen, onClose }) {
  const [operator, setOperator] = useState('Ampsa');
  const [delay, setDelay] = useState(10);
  const [comment, setComment] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const turnstileRef = useRef(null);

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Reiniciem els estats quan s'obre el modal
      setTurnstileToken('');
      setSubmitError(null);
      setSubmitSuccess(false);
      setIsSubmitting(false);
      turnstileRef.current?.reset();
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleIncrement = () => {
    setDelay(prev => prev + 1);
  };

  const handleDecrement = () => {
    setDelay(prev => Math.max(0, prev - 1));
  };

  const handleDelayChange = (e) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) {
      setDelay(Math.max(0, val));
    } else {
      setDelay(0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(false);

    if (!turnstileToken) {
      setSubmitError("Si us plau, completa la verificació de seguretat.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitReportAction(
        { operator, delay, comment },
        turnstileToken
      );

      if (result.success) {
        setSubmitSuccess(true);
        // Reset form
        setOperator('Ampsa');
        setDelay(10);
        setComment('');
        setTurnstileToken('');
        // Tanquem el modal al cap d'un breu retard perquè l'usuari vegi el feedback d'èxit
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setSubmitError(result.error || "La verificació de seguretat ha fallat.");
        turnstileRef.current?.reset();
        setTurnstileToken('');
      }
    } catch (err) {
      console.error(err);
      setSubmitError("Error de connexió en enviar les dades.");
      turnstileRef.current?.reset();
      setTurnstileToken('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="bg-card w-full max-w-md rounded-3xl border border-neutral-200 shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh] transition-all transform duration-300 ease-out animate-[scaleIn_0.2s_ease-out]">

        {/* Header */}
        <div className="p-6 pb-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50">
          <div>
            <h3 className="text-xl font-black text-foreground italic">REPORTAR INCIDÈNCIA</h3>
            <p className="text-xs text-neutral-500 font-bold tracking-wide uppercase">Ajuda&apos;ns a registrar el retard</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-200 text-neutral-500 hover:text-foreground transition-colors cursor-pointer"
            aria-label="Tancar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5 overflow-y-auto">
          {/* Operadora Select */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="operator" className="text-xs font-black text-neutral-600 uppercase tracking-wider">
              Operadora de Bus
            </label>
            <div className="relative">
              <select
                id="operator"
                value={operator}
                disabled={isSubmitting || submitSuccess}
                onChange={(e) => setOperator(e.target.value)}
                className="w-full p-4 pr-10 rounded-2xl border border-neutral-200 bg-white text-foreground font-medium text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all appearance-none cursor-pointer disabled:opacity-50"
              >
                <option value="Ampsa">Ampsa</option>
                <option value="TEISA">TEISA</option>
                <option value="Moventis">Moventis</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-neutral-500">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Retard Numeric Input */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="delay" className="text-xs font-black text-neutral-600 uppercase tracking-wider">
              Minuts de Retard
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleDecrement}
                disabled={isSubmitting || submitSuccess}
                className="w-12 h-12 flex items-center justify-center bg-neutral-100 hover:bg-neutral-200 active:scale-95 text-neutral-700 font-bold rounded-xl border border-neutral-200 transition-all text-xl cursor-pointer select-none disabled:opacity-50"
                aria-label="Disminuir retard"
              >
                <Minus size={18} strokeWidth={3} />
              </button>

              <input
                id="delay"
                type="number"
                min="0"
                value={delay}
                disabled={isSubmitting || submitSuccess}
                onChange={handleDelayChange}
                className="flex-1 h-12 text-center border border-neutral-200 rounded-xl font-black text-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none bg-white disabled:opacity-50"
              />

              <button
                type="button"
                onClick={handleIncrement}
                disabled={isSubmitting || submitSuccess}
                className="w-12 h-12 flex items-center justify-center bg-neutral-100 hover:bg-neutral-200 active:scale-95 text-neutral-700 font-bold rounded-xl border border-neutral-200 transition-all text-xl cursor-pointer select-none disabled:opacity-50"
                aria-label="Incrementar retard"
              >
                <Plus size={18} strokeWidth={3} />
              </button>
            </div>
          </div>

          {/* Comentari Textarea */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label htmlFor="comment" className="text-xs font-black text-neutral-600 uppercase tracking-wider">
                Comentari
              </label>
              <span className={`text-[10px] font-bold ${comment.length >= 200 ? 'text-accent' : 'text-neutral-400'}`}>
                {comment.length} / 200
              </span>
            </div>
            <textarea
              id="comment"
              maxLength={200}
              value={comment}
              disabled={isSubmitting || submitSuccess}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Explica què ha passat (opcional)..."
              rows={3}
              className="w-full p-4 rounded-2xl border border-neutral-200 bg-white text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all resize-none disabled:opacity-50"
            />
          </div>

          {/* Cloudflare Turnstile Verification Widget */}
          <div className="flex justify-center my-1">
            <Turnstile
              ref={turnstileRef}
              siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
              onSuccess={(token) => {
                setTurnstileToken(token);
                setSubmitError(null);
              }}
              onError={() => {
                setSubmitError("La verificació de seguretat ha fallat.");
                setTurnstileToken('');
              }}
              onExpire={() => setTurnstileToken('')}
              options={{
                theme: 'light',
                size: 'normal',
              }}
            />
          </div>

          {/* Feedback Messages */}
          {submitError && (
            <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 rounded-2xl text-xs font-bold leading-normal">
              {submitError}
            </div>
          )}

          {submitSuccess && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400 rounded-2xl text-xs font-bold leading-normal">
              Report enviat correctament. Gràcies per col·laborar!
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 mt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting || submitSuccess}
              className="flex-1 py-4 px-6 border border-neutral-200 hover:bg-neutral-100 active:scale-95 text-neutral-700 rounded-2xl font-bold text-sm transition-all cursor-pointer disabled:opacity-50 disabled:active:scale-100"
            >
              CANCEL·LAR
            </button>
            <button
              type="submit"
              disabled={isSubmitting || submitSuccess || !turnstileToken}
              className="flex-1 py-4 px-6 bg-accent hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:active:scale-100 text-white rounded-2xl font-black text-sm uppercase tracking-wider shadow-lg shadow-accent/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  ENVIANT...
                </>
              ) : (
                <>
                  <Send size={16} />
                  ENVIAR REPORT
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
