import React, { useState, useRef, useCallback } from 'react';

/**
 * Custom hook to manage the zooming, panning, and interaction state of the interactive map.
 * Provides handlers for mouse, wheel, and touch interactions, as well as imperative
 * methods for zooming to specific locations or resetting the view.
 *
 * @param {React.RefObject<HTMLDivElement>} mapRef - Reference to the map container element
 * @returns {object} Map zoom state and interaction handlers
 */
export const useMapZoom = (mapRef: React.RefObject<HTMLDivElement>) => {
    const [viewState, setViewState] = useState({ k: 1, x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    
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

    const handleWheel = useCallback((e: React.WheelEvent) => {
        e.preventDefault(); e.stopPropagation();
        if (!mapRef.current) return;
        const scaleFactor = 0.0015;
        const scaleDelta = -e.deltaY * scaleFactor;
        const newK = Math.min(Math.max(1, viewState.k + scaleDelta), 8);
        const rect = mapRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const newX = mouseX - (mouseX - viewState.x) * (newK / viewState.k);
        const newY = mouseY - (mouseY - viewState.y) * (newK / viewState.k);
        setViewState({ k: newK, x: newX, y: newY });
    }, [mapRef, viewState]);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        setIsDragging(true);
        setDragStart({ x: e.clientX - viewState.x, y: e.clientY - viewState.y });
    }, [viewState]);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!isDragging) return;
        e.preventDefault();
        setViewState(prev => ({ ...prev, x: e.clientX - dragStart.x, y: e.clientY - dragStart.y }));
    }, [isDragging, dragStart]);

    const handleMouseUp = useCallback(() => setIsDragging(false), []);
    
    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        if (e.touches.length === 1) {
            setIsDragging(true);
            const t = e.touches[0];
            setDragStart({ x: t.clientX - viewState.x, y: t.clientY - viewState.y });
        } else if (e.touches.length === 2) {
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
                startK: viewState.k,
                startX: viewState.x,
                startY: viewState.y,
                centerX: cx,
                centerY: cy,
                isPinching: true
            };
        }
    }, [mapRef, viewState]);

    const handleTouchMove = useCallback((e: React.TouchEvent) => {
        if (e.touches.length === 1 && isDragging) {
            const t = e.touches[0];
            setViewState(prev => ({ ...prev, x: t.clientX - dragStart.x, y: t.clientY - dragStart.y }));
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
    }, [isDragging, dragStart]);

    const handleTouchEnd = useCallback(() => {
        setIsDragging(false);
        gestureRef.current.isPinching = false;
    }, []);

    return {
        viewState, setViewState,
        isDragging,
        zoomToLocation, zoomAtCenter, resetView,
        handleWheel, handleMouseDown, handleMouseMove, handleMouseUp,
        handleTouchStart, handleTouchMove, handleTouchEnd
    };
};
