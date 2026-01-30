export type AnnotationArea = {
    x: number;
    y: number;
    width: number;
    height: number;
};

export type Annotation = {
    id: string;
    text: string;
    /** Legacy: single area (treated as area on first image when present). */
    area?: AnnotationArea;
    /** Areas per image; key = String(asset.id). */
    areasByImageId?: Record<string, AnnotationArea>;
};
