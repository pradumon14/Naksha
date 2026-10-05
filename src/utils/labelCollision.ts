import { MapLocation } from '../types/index';

export type PlacementDirection = 
    | 'top' 
    | 'bottom' 
    | 'right' 
    | 'left' 
    | 'top-right' 
    | 'top-left' 
    | 'bottom-right' 
    | 'bottom-left';

export interface BoundingBox {
    left: number;
    right: number;
    top: number;
    bottom: number;
}

export interface PlacedLabel {
    location: MapLocation;
    index: number;
    dir: PlacementDirection;
    tier: number; // 1 = standard offset, 2 = extended offset with leader line
    screenOffset: { x: number; y: number }; // Offset in screen px relative to marker point (0, 0)
    foreignObjectBox: { x: number; y: number; width: number; height: number };
    hasLeaderLine: boolean;
    leaderLine: { x1: number; y1: number; x2: number; y2: number };
    visible: boolean;
    screenBox: BoundingBox;
}

/**
 * Checks if two bounding boxes in screen space overlap, with optional padding.
 */
export function doBoxesOverlap(b1: BoundingBox, b2: BoundingBox, pad = 6): boolean {
    return (
        b1.left < b2.right + pad &&
        b1.right > b2.left - pad &&
        b1.top < b2.bottom + pad &&
        b1.bottom > b2.top - pad
    );
}

/**
 * Checks if a candidate bounding box covers a marker point (which would obscure the point).
 */
export function doesBoxCoverPoint(box: BoundingBox, pt: { x: number; y: number }, pad = 8): boolean {
    return (
        pt.x >= box.left - pad &&
        pt.x <= box.right + pad &&
        pt.y >= box.top - pad &&
        pt.y <= box.bottom + pad
    );
}

/**
 * Calculates candidate bounding box and placement parameters for a given direction and offset tier.
 */
function getPlacementCandidate(
    point: { x: number; y: number },
    w: number,
    h: number,
    dir: PlacementDirection,
    tier = 1
): {
    screenBox: BoundingBox;
    screenOffset: { x: number; y: number };
    foreignObjectBox: { x: number; y: number; width: number; height: number };
    hasLeaderLine: boolean;
    leaderLine: { x1: number; y1: number; x2: number; y2: number };
} {
    // Offset distances from marker center
    const off = tier === 1 ? 18 : 34;
    const diagOffX = tier === 1 ? 16 : 30;
    const diagOffY = tier === 1 ? 16 : 30;

    // Dimensions for the foreignObject container (with buffer for shadow and caret)
    const foW = Math.max(260, w + 60);
    const foH = 64;

    let box: BoundingBox;
    let foBox: { x: number; y: number; width: number; height: number };
    let hasLeaderLine = tier > 1 || dir.includes('-');
    let leaderLine = { x1: 0, y1: 0, x2: 0, y2: 0 };
    let screenOffset = { x: 0, y: 0 };

    switch (dir) {
        case 'top':
            box = {
                left: point.x - w / 2,
                right: point.x + w / 2,
                top: point.y - off - h,
                bottom: point.y - off
            };
            foBox = { x: -foW / 2, y: -off - foH, width: foW, height: foH };
            screenOffset = { x: 0, y: -off - h / 2 };
            leaderLine = { x1: 0, y1: 0, x2: 0, y2: -off };
            break;

        case 'bottom':
            box = {
                left: point.x - w / 2,
                right: point.x + w / 2,
                top: point.y + off,
                bottom: point.y + off + h
            };
            foBox = { x: -foW / 2, y: off, width: foW, height: foH };
            screenOffset = { x: 0, y: off + h / 2 };
            leaderLine = { x1: 0, y1: 0, x2: 0, y2: off };
            break;

        case 'right':
            box = {
                left: point.x + off,
                right: point.x + off + w,
                top: point.y - h / 2,
                bottom: point.y + h / 2
            };
            foBox = { x: off, y: -foH / 2, width: foW, height: foH };
            screenOffset = { x: off + w / 2, y: 0 };
            leaderLine = { x1: 0, y1: 0, x2: off, y2: 0 };
            break;

        case 'left':
            box = {
                left: point.x - off - w,
                right: point.x - off,
                top: point.y - h / 2,
                bottom: point.y + h / 2
            };
            foBox = { x: -off - foW, y: -foH / 2, width: foW, height: foH };
            screenOffset = { x: -off - w / 2, y: 0 };
            leaderLine = { x1: 0, y1: 0, x2: -off, y2: 0 };
            break;

        case 'top-right':
            box = {
                left: point.x + diagOffX,
                right: point.x + diagOffX + w,
                top: point.y - diagOffY - h,
                bottom: point.y - diagOffY
            };
            foBox = { x: diagOffX, y: -diagOffY - foH, width: foW, height: foH };
            screenOffset = { x: diagOffX + w / 2, y: -diagOffY - h / 2 };
            leaderLine = { x1: 4, y1: -4, x2: diagOffX, y2: -diagOffY };
            hasLeaderLine = true;
            break;

        case 'top-left':
            box = {
                left: point.x - diagOffX - w,
                right: point.x - diagOffX,
                top: point.y - diagOffY - h,
                bottom: point.y - diagOffY
            };
            foBox = { x: -diagOffX - foW, y: -diagOffY - foH, width: foW, height: foH };
            screenOffset = { x: -diagOffX - w / 2, y: -diagOffY - h / 2 };
            leaderLine = { x1: -4, y1: -4, x2: -diagOffX, y2: -diagOffY };
            hasLeaderLine = true;
            break;

        case 'bottom-right':
            box = {
                left: point.x + diagOffX,
                right: point.x + diagOffX + w,
                top: point.y + diagOffY,
                bottom: point.y + diagOffY + h
            };
            foBox = { x: diagOffX, y: diagOffY, width: foW, height: foH };
            screenOffset = { x: diagOffX + w / 2, y: diagOffY + h / 2 };
            leaderLine = { x1: 4, y1: 4, x2: diagOffX, y2: diagOffY };
            hasLeaderLine = true;
            break;

        case 'bottom-left':
            box = {
                left: point.x - diagOffX - w,
                right: point.x - diagOffX,
                top: point.y + diagOffY,
                bottom: point.y + diagOffY + h
            };
            foBox = { x: -diagOffX - foW, y: diagOffY, width: foW, height: foH };
            screenOffset = { x: -diagOffX - w / 2, y: diagOffY + h / 2 };
            leaderLine = { x1: -4, y1: 4, x2: -diagOffX, y2: diagOffY };
            hasLeaderLine = true;
            break;
    }

    return {
        screenBox: box,
        screenOffset,
        foreignObjectBox: foBox,
        hasLeaderLine,
        leaderLine
    };
}

const ALL_DIRECTIONS: PlacementDirection[] = [
    'top',
    'bottom',
    'right',
    'left',
    'top-right',
    'top-left',
    'bottom-right',
    'bottom-left'
];

/**
 * Computes non-overlapping positions for map labels.
 * 
 * Takes all candidate locations, computes their screen positions, ranks candidate
 * placement directions based on neighbor proximity, and assigns collision-free
 * bounding boxes with leader lines and carets.
 */
export function calculateLabelPlacements(
    locations: MapLocation[],
    visibleIndices: number[],
    activeName: string | null,
    targetName: string | null,
    labelScale: number
): Map<number, PlacedLabel> {
    const results = new Map<number, PlacedLabel>();
    if (visibleIndices.length === 0 || labelScale <= 0) return results;

    // Convert locations to screen points and estimate label dimensions
    const points = visibleIndices.map(idx => {
        const loc = locations[idx];
        const isPriority = loc.name === activeName || loc.name === targetName;
        // Accurate character width estimation for 13.5px font + padding + prefix
        const estWidth = Math.max(76, Math.min(230, loc.name.length * 8 + 28));
        const estHeight = 32;

        return {
            locIndex: idx,
            loc,
            isPriority,
            x: loc.coords.x / labelScale,
            y: loc.coords.y / labelScale,
            w: estWidth,
            h: estHeight
        };
    });

    // Sort processing order: high priority locations (active, target) are placed first
    const sortedPoints = [...points].sort((a, b) => {
        if (a.isPriority && !b.isPriority) return -1;
        if (!a.isPriority && b.isPriority) return 1;
        return a.locIndex - b.locIndex;
    });

    const placedBoxes: BoundingBox[] = [];

    for (const p of sortedPoints) {
        // Find nearest neighboring point among all locations in category
        let nearestNeighbor: { x: number; y: number } | null = null;
        let minDistance = Infinity;

        for (const other of points) {
            if (other.locIndex === p.locIndex) continue;
            const dist = Math.hypot(p.x - other.x, p.y - other.y);
            if (dist < minDistance) {
                minDistance = dist;
                nearestNeighbor = { x: other.x, y: other.y };
            }
        }

        // Dynamically rank candidate directions: prefer placing away from nearest neighbor
        const sortedDirs = [...ALL_DIRECTIONS];
        if (nearestNeighbor && minDistance < 180) {
            const dx = nearestNeighbor.x - p.x;
            const dy = nearestNeighbor.y - p.y;

            sortedDirs.sort((d1, d2) => {
                const scoreDir = (d: PlacementDirection) => {
                    let score = 0;
                    // If neighbor is below (dy > 0), strongly prefer 'top'
                    if (d.includes('top') && dy > 0) score -= 3;
                    // If neighbor is above (dy < 0), strongly prefer 'bottom'
                    if (d.includes('bottom') && dy < 0) score -= 3;
                    // If neighbor is to right (dx > 0), strongly prefer 'left'
                    if (d.includes('left') && dx > 0) score -= 3;
                    // If neighbor is to left (dx < 0), strongly prefer 'right'
                    if (d.includes('right') && dx < 0) score -= 3;

                    // Penalty for placing toward neighbor
                    if (d.includes('top') && dy < 0) score += 4;
                    if (d.includes('bottom') && dy > 0) score += 4;
                    if (d.includes('left') && dx < 0) score += 4;
                    if (d.includes('right') && dx > 0) score += 4;

                    return score;
                };

                return scoreDir(d1) - scoreDir(d2);
            });
        }

        // Try candidate directions across Tier 1 (standard) and Tier 2 (extended)
        let chosenCandidate: ReturnType<typeof getPlacementCandidate> | null = null;
        let chosenDir: PlacementDirection = 'top';
        let chosenTier = 1;

        for (const tier of [1, 2]) {
            for (const dir of sortedDirs) {
                const candidate = getPlacementCandidate({ x: p.x, y: p.y }, p.w, p.h, dir, tier);
                let collides = false;

                // Check collision against already placed labels
                for (const existingBox of placedBoxes) {
                    if (doBoxesOverlap(candidate.screenBox, existingBox, 5)) {
                        collides = true;
                        break;
                    }
                }

                // Check collision against marker points (to never cover marker dots)
                if (!collides) {
                    for (const pt of points) {
                        if (pt.locIndex === p.locIndex) continue;
                        if (doesBoxCoverPoint(candidate.screenBox, { x: pt.x, y: pt.y }, 6)) {
                            collides = true;
                            break;
                        }
                    }
                }

                if (!collides) {
                    chosenCandidate = candidate;
                    chosenDir = dir;
                    chosenTier = tier;
                    break;
                }
            }

            if (chosenCandidate) break;
        }

        // Fallback: If space is extraordinarily tight (e.g. 5+ points clustered),
        // pick the best available candidate
        if (!chosenCandidate) {
            chosenDir = sortedDirs[0] || 'top';
            chosenTier = 2;
            chosenCandidate = getPlacementCandidate({ x: p.x, y: p.y }, p.w, p.h, chosenDir, chosenTier);
        }

        placedBoxes.push(chosenCandidate.screenBox);

        results.set(p.locIndex, {
            location: p.loc,
            index: p.locIndex,
            dir: chosenDir,
            tier: chosenTier,
            screenOffset: chosenCandidate.screenOffset,
            foreignObjectBox: chosenCandidate.foreignObjectBox,
            hasLeaderLine: chosenCandidate.hasLeaderLine,
            leaderLine: chosenCandidate.leaderLine,
            visible: true,
            screenBox: chosenCandidate.screenBox
        });
    }

    return results;
}
