/**
 * Represents a 2D coordinate in the SVG coordinate space.
 */
export interface Coordinate {
    x: number;
    y: number;
}

/**
 * Represents a geographic location on the map.
 */
export interface MapLocation {
    /** Unique name of the location */
    name: string;
    /** State where the location is situated */
    state: string;
    /** X, Y coordinates in the SVG space */
    coords: Coordinate;
    /** Detailed description for the info card */
    description: string;
}

/**
 * Represents a group of locations (e.g., "Dams", "Airports").
 */
export interface MapCategory {
    /** Display title of the category */
    title: string;
    /** FontAwesome icon class */
    icon: string;
    /** List of locations in this category */
    locations: MapLocation[];
    /** Syllabus / Theme group */
    theme?: 'energy' | 'industry' | 'water' | 'history' | 'general';
}

/**
 * Represents a downloadable resource.
 */
export interface DownloadItem {
    id?: string;
    title: string;
    description: string;
    downloadUrl: string;
    type: string;
    icon: string;
    size: string;
    category?: 'syllabus' | 'outlines' | 'physical' | 'history';
    tags?: string[];
    isAvailable?: boolean;
    format?: string;
    resolution?: string;
}

/**
 * Represents an achievement badge.
 */
export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    unlockedAt?: number;
}
