import React, { useState, useRef, useCallback, useEffect } from 'react';

export interface ViewState {
    k: number;
    x: number;
    y: number;
}

/**
 * Custom hook to manage the zooming, panning, and interaction state of the interactive map.
 * Provides handlers for mouse, wheel, and touch interactions, as well as imperative
 * methods for zooming to specific locations or resetting the view.
 *
 * @param {React.RefObject<HTMLDivElement>} mapRef - Reference to the map container element
 * @returns Map zoom state and interaction handlers
 */
export const useMapZoom = (mapRef: React.RefObject<HTMLDivElement>) => {
    const [viewState, setViewState] = useState<ViewState>({ k: 1, x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);

    // Keep state ref to avoid stale closures in window event listeners
    const viewStateRef = useRef(viewState);
    viewStateRef.current = viewState;

    const dragStartRef = useRef({ x: 0, y: 0 });
    const isDraggingRef = useRef(false);
    const rAFRef = useRef<number | null>(null);

    const gestureRef = useRef({
        startDist: 0,
        startK: 1,
        startX: 0,
        startY: 0,
        centerX: 0,
        centerY: 0,
        isPinching: false
    });

    const zoomToLocation = useCallback((x: number, y: number) => {
        if (!mapRef.current) return;
        const container = mapRef.current.getBoundingClientRect();
        const svgW = 21000, svgH = 29700;
        const scaleX = container.width / svgW;
        const scaleY = container.height / svgH;
        const baseScale = Math.min(scaleX, scaleY);
        
        const targetK = 3; 
        const renderedW = svgW * baseScale;
        const renderedH = svgH * baseScale;
        const offsetX = (container.width - renderedW) / 2;
        const offsetY = (container.height - renderedH) / 2;
        
        const targetPx = (x * baseScale) + offsetX;
        const targetPy = (y * baseScale) + offsetY;
        
        const newX = (container.width / 2) - (targetPx * targetK);
        const newY = (container.height / 2) - (targetPy * targetK);
        
        setViewState({ k: targetK, x: newX, y: newY });
    }, [mapRef]);

    const zoomAtCenter = useCallback((factor: number) => {
        if (!mapRef.current) return;
        const rect = mapRef.current.getBoundingClientRect();
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        
        setViewState(prev => {
            const newK = Math.min(Math.max(1, prev.k * factor), 8);
            const newX = cx - (cx - prev.x) * (newK / prev.k);
            const newY = cy - (cy - prev.y) * (newK / prev.k);
            return { k: newK, x: newX, y: newY };
        });
    }, [mapRef]);

    const resetView = useCallback(() => {
        setViewState({ k: 1, x: 0, y: 0 });
    }, []);

    // Native non-passive wheel event listener on container to prevent passive violation errors
    useEffect(() => {
        const el = mapRef.current;
        if (!el) return;

        const onWheel = (e: WheelEvent) => {
            e.preventDefault();
            e.stopPropagation();

            const scaleFactor = 0.0015;
            const scaleDelta = -e.deltaY * scaleFactor;
            const current = viewStateRef.current;
            const newK = Math.min(Math.max(1, current.k + scaleDelta), 8);
            const rect = el.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            const newX = mouseX - (mouseX - current.x) * (newK / current.k);
            const newY = mouseY - (mouseY - current.y) * (newK / current.k);

            setViewState({ k: newK, x: newX, y: newY });
        };

        el.addEventListener('wheel', onWheel, { passive: false });
        return () => {
            el.removeEventListener('wheel', onWheel);
        };
    }, [mapRef]);

    // Window mouse move & up listeners to allow dragging outside container boundaries smoothly
    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => {
            if (!isDraggingRef.current) return;
            e.preventDefault();

            if (rAFRef.current !== null) cancelAnimationFrame(rAFRef.current);
            rAFRef.current = requestAnimationFrame(() => {
                const newX = e.clientX - dragStartRef.current.x;
                const newY = e.clientY - dragStartRef.current.y;
                setViewState(prev => ({ ...prev, x: newX, y: newY }));
            });
        };

        const onMouseUp = () => {
            if (isDraggingRef.current) {
                isDraggingRef.current = false;
                setIsDragging(false);
            }
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
            if (rAFRef.current !== null) cancelAnimationFrame(rAFRef.current);
        };
    }, []);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        // Only trigger on primary button
        if (e.button !== 0) return;
        isDraggingRef.current = true;
        setIsDragging(true);
        dragStartRef.current = {
            x: e.clientX - viewStateRef.current.x,
            y: e.clientY - viewStateRef.current.y
        };
    }, []);

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        if (e.touches.length === 1) {
            isDraggingRef.current = true;
            setIsDragging(true);
            const t = e.touches[0];
            dragStartRef.current = {
                x: t.clientX - viewStateRef.current.x,
                y: t.clientY - viewStateRef.current.y
            };
        } else if (e.touches.length === 2) {
            isDraggingRef.current = false;
            setIsDragging(false);
            const t1 = e.touches[0];
            const t2 = e.touches[1];
            const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
            
            if (!mapRef.current) return;
            const rect = mapRef.current.getBoundingClientRect();
            const cx = (t1.clientX + t2.clientX) / 2 - rect.left;
            const cy = (t1.clientY + t2.clientY) / 2 - rect.top;

            gestureRef.current = {
                startDist: dist,
                startK: viewStateRef.current.k,
                startX: viewStateRef.current.x,
                startY: viewStateRef.current.y,
                centerX: cx,
                centerY: cy,
                isPinching: true
            };
        }
    }, [mapRef]);

    const handleTouchMove = useCallback((e: React.TouchEvent) => {
        if (e.touches.length === 1 && isDraggingRef.current) {
            const t = e.touches[0];
            setViewState(prev => ({
                ...prev,
                x: t.clientX - dragStartRef.current.x,
                y: t.clientY - dragStartRef.current.y
            }));
        } else if (e.touches.length === 2 && gestureRef.current.isPinching) {
            const t1 = e.touches[0];
            const t2 = e.touches[1];
            const currDist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
            
            if (currDist < 10) return;

            const { startDist, startK, startX, startY, centerX, centerY } = gestureRef.current;
            const scale = currDist / startDist;
            const newK = Math.min(Math.max(1, startK * scale), 8);
            
            const newX = centerX - (centerX - startX) * (newK / startK);
            const newY = centerY - (centerY - startY) * (newK / startK);
            
            setViewState({ k: newK, x: newX, y: newY });
        }
    }, []);

    const handleTouchEnd = useCallback((e: React.TouchEvent) => {
        if (e.touches.length === 0) {
            isDraggingRef.current = false;
            setIsDragging(false);
            gestureRef.current.isPinching = false;
        } else if (e.touches.length === 1) {
            // Smoothly transition from pinch to 1-finger drag
            gestureRef.current.isPinching = false;
            isDraggingRef.current = true;
            setIsDragging(true);
            const t = e.touches[0];
            dragStartRef.current = {
                x: t.clientX - viewStateRef.current.x,
                y: t.clientY - viewStateRef.current.y
            };
        }
    }, []);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        const step = 50; 
        if (e.key === 'ArrowUp') setViewState(v => ({ ...v, y: v.y + step }));
        if (e.key === 'ArrowDown') setViewState(v => ({ ...v, y: v.y - step }));
        if (e.key === 'ArrowLeft') setViewState(v => ({ ...v, x: v.x + step }));
        if (e.key === 'ArrowRight') setViewState(v => ({ ...v, x: v.x - step }));
        if (e.key === '=' || e.key === '+') zoomAtCenter(1.2);
        if (e.key === '-' || e.key === '_') zoomAtCenter(1 / 1.2);
    }, [zoomAtCenter]);

    return {
        viewState,
        setViewState,
        isDragging,
        zoomToLocation,
        zoomAtCenter,
        resetView,
        handleMouseDown,
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd,
        handleKeyDown,
        isPinching: gestureRef.current.isPinching
    };
};
