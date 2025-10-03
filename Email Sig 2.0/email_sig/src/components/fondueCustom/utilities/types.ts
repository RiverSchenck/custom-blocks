export type Palette = {
    id: number | string;
    title: string;
    colors: RgbaColorWithName[];
};

export type RgbaColor = {
    red: number;
    green: number;
    blue: number;
    alpha?: number;
};

export type ParsedColor = {
    red: number;
    green: number;
    blue: number;
    alpha?: number;
};

export type RgbaColorWithName = RgbaColor & {
    name?: string;
};

type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
    ? Acc[number]
    : Enumerate<N, [...Acc, Acc['length']]>;

export type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>> | T;

