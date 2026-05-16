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
}

/**
 * Represents a downloadable resource.
 */
export interface DownloadItem {
    title: string;
    description: string;
    downloadUrl: string;
    type: string;
    icon: string;
    size: string;
}


