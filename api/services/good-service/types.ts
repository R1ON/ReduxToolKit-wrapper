export type DataFromBackend = {
    id: number;
    name: string;
};

export type TransformedData = {
    id: number;
    userName: string;
};

export type TransformedError = {
    something?: string;
};
