import React from 'react';

const STEPS = ['Cart', 'Checkout', 'Payment', 'Confirmation'];

export default function StepIndicator({ activeStep = 1 }) {
    return (
        <div className="flex items-center justify-center mb-8 select-none">
            {STEPS.map((label, idx) => {
                const done = idx < activeStep;
                const active = idx === activeStep;
                return (
                    <React.Fragment key={label}>
                        <div className="flex flex-col items-center gap-1.5">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all
                                ${done ? 'bg-red-600 border-red-600 text-white' :
                                  active ? 'bg-red-600 border-red-600 text-white ring-4 ring-red-100' :
                                  'bg-white border-gray-300 text-gray-400'}`}>
                                {done ? (
                                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    <span>{idx + 1}</span>
                                )}
                            </div>
                            <span className={`text-xs font-medium hidden sm:block ${active ? 'text-red-600' : done ? 'text-gray-700' : 'text-gray-400'}`}>
                                {label}
                            </span>
                        </div>
                        {idx < STEPS.length - 1 && (
                            <div className={`flex-1 h-0.5 mx-2 mb-5 sm:mb-0 rounded transition-all ${done ? 'bg-red-600' : 'bg-gray-200'}`} />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
}
