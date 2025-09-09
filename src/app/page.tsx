'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface FormState {
  email: string;
  status: 'idle' | 'success' | 'duplicate' | 'error';
  message: string;
}

export default function Home() {
  const [formState, setFormState] = useState<FormState>({
    email: '',
    status: 'idle',
    message: ''
  });
  
  const [submittedEmails, setSubmittedEmails] = useState<Set<string>>(new Set());
  const spotlightRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number | undefined>(undefined);

  // Smooth cursor tracking with lerp
  useEffect(() => {
    const updateSpotlight = () => {
      if (!spotlightRef.current) return;
      
      const lerp = 0.1;
      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * lerp;
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * lerp;
      
      const radius = window.innerWidth < 768 ? 80 : 120;
      
      spotlightRef.current.style.setProperty('--mx', `${currentRef.current.x}px`);
      spotlightRef.current.style.setProperty('--my', `${currentRef.current.y}px`);
      spotlightRef.current.style.setProperty('--radius', `${radius}px`);
      
      animationRef.current = requestAnimationFrame(updateSpotlight);
    };
    
    updateSpotlight();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Mouse and touch event handlers
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent | TouchEvent) => {
      const rect = document.documentElement.getBoundingClientRect();
      let clientX: number, clientY: number;
      
      if ('touches' in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }
      
      targetRef.current.x = clientX - rect.left;
      targetRef.current.y = clientY - rect.top;
    };

    const handlePointerLeave = () => {
      targetRef.current.x = -1000;
      targetRef.current.y = -1000;
    };

    document.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('pointerleave', handlePointerLeave, { passive: true });
    document.addEventListener('touchmove', handlePointerMove, { passive: true });

    return () => {
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerleave', handlePointerLeave);
      document.removeEventListener('touchmove', handlePointerMove);
    };
  }, []);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(formState.email)) {
      setFormState(prev => ({
        ...prev,
        status: 'error',
        message: 'Please enter a valid email address'
      }));
      return;
    }

    if (submittedEmails.has(formState.email.toLowerCase())) {
      setFormState(prev => ({
        ...prev,
        status: 'duplicate',
        message: "You're already on the list."
      }));
      return;
    }

    // Log to console and localStorage for now
    console.log('Email submitted:', formState.email);
    
    // Store in localStorage for easy access
    const existingEmails = JSON.parse(localStorage.getItem('lowkey-emails') || '[]');
    const newEmail = {
      email: formState.email,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    };
    existingEmails.push(newEmail);
    localStorage.setItem('lowkey-emails', JSON.stringify(existingEmails));
    
    // Also log to console with timestamp
    console.log('📧 New email added to waitlist:', {
      email: formState.email,
      timestamp: new Date().toLocaleString(),
      totalEmails: existingEmails.length
    });
    
    setSubmittedEmails(prev => new Set([...prev, formState.email.toLowerCase()]));
    setFormState(prev => ({
      ...prev,
      status: 'success',
      message: "We'll email you first when the next drop is ready."
    }));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState(prev => ({
      ...prev,
      email: e.target.value,
      status: 'idle',
      message: ''
    }));
  };

  return (
    <main className="relative h-screen w-screen overflow-hidden">
      {/* Background Images - Desktop and Mobile */}
      <div className="absolute inset-0">
        {/* Desktop Background */}
        <Image
          src="/Background_desktop.png"
          alt="Background"
          fill
          className="object-cover hidden md:block"
          priority
        />
        {/* Mobile Background */}
        <Image
          src="/Background_mobile.png"
          alt="Background"
          fill
          className="object-cover block md:hidden"
          priority
        />
      </div>

      {/* Spotlight Overlay */}
      <div
        ref={spotlightRef}
        className="absolute inset-0 bg-black opacity-95"
        style={{
          maskImage: 'radial-gradient(circle at var(--mx, 50%) var(--my, 50%), transparent 0%, transparent calc(var(--radius, 120px) * 0.7), rgba(0,0,0,0.3) calc(var(--radius, 120px) * 0.8), rgba(0,0,0,0.6) calc(var(--radius, 120px) * 0.9), rgba(0,0,0,0.8) var(--radius, 120px), black calc(var(--radius, 120px) + 20px))',
          WebkitMaskImage: 'radial-gradient(circle at var(--mx, 50%) var(--my, 50%), transparent 0%, transparent calc(var(--radius, 120px) * 0.7), rgba(0,0,0,0.3) calc(var(--radius, 120px) * 0.8), rgba(0,0,0,0.6) calc(var(--radius, 120px) * 0.9), rgba(0,0,0,0.8) var(--radius, 120px), black calc(var(--radius, 120px) + 20px))',
          '--mx': '50%',
          '--my': '50%',
          '--radius': '120px'
        } as React.CSSProperties}
      />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Lowkey
          </h1>
          <div className="flex space-x-4">
            <a
              href="#"
              className="text-white/70 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent rounded"
              aria-label="Instagram"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a
              href="#"
              className="text-white/70 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent rounded"
              aria-label="TikTok"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
            </a>
          </div>
        </header>

        {/* Hero Section */}
        <div className="flex-1 flex items-center justify-center px-6 md:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-4 md:mb-6">
              Lowkey.
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-white/90 mb-8 md:mb-12 leading-relaxed">
              Drop-style releases. Limited.<br />
              <span className="text-white/70 text-base md:text-lg lg:text-xl">Sign up for early access to our first drop.</span>
            </p>

            {/* Email Form */}
            {formState.status === 'success' ? (
              <div className="text-center">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  You&apos;re in.
                </h3>
                <p className="text-white/90 text-lg">
                  {formState.message}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input
                    type="email"
                    value={formState.email}
                    onChange={handleEmailChange}
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                    aria-label="Email address"
                    required
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-white/90 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent"
                    aria-label="Join the waitlist"
                  >
                    Join the waitlist
                  </button>
                </div>
                
                {formState.status === 'duplicate' && (
                  <p className="text-white/90 text-sm">
                    {formState.message}
                  </p>
                )}
                
                {formState.status === 'error' && (
                  <p className="text-red-300 text-sm">
                    {formState.message}
                  </p>
                )}
                
                <p className="text-white/60 text-sm">
                  By joining, you agree to receive emails from Lowkey.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}