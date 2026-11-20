import React, { useEffect, useRef, useState } from 'react';

const ScrollReveal = ({ children, className = '', direction = 'up', delay = 0 }) => {
    const [isVisible, setIsVisible] = useState(false);
    const domRef = useRef();

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Slight delay to ensure smooth rendering if needed
                    setTimeout(() => setIsVisible(true), delay);
                    // Unobserve after showing to animate only once
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        const currentRef = domRef.current;
        if (currentRef) observer.observe(currentRef);

        return () => {
            if (currentRef) observer.unobserve(currentRef);
        };
    }, [delay]);

    const getDirectionClass = () => {
        switch(direction) {
            case 'up': return 'translate-y-12';
            case 'down': return '-translate-y-12';
            case 'left': return 'translate-x-12';
            case 'right': return '-translate-x-12';
            case 'none': return '';
            default: return 'translate-y-12';
        }
    };

    return (
        <div 
            ref={domRef}
            className={`transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0 translate-x-0' : `opacity-0 ${getDirectionClass()}`} ${className}`}
        >
            {children}
        </div>
    );
};

export default ScrollReveal;
