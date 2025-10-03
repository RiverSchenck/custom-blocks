export type ProgressItem = {
    id: number;
    name: string;
    completed: boolean;
    link: string;
};

export type BlockSettings = {
    progressData?: ProgressItem;
    ['progress-name']?: string;
    blockId: number;
};
