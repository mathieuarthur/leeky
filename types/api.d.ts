// API response types for LeekWars API

export type AIResponse = {
    ai?: {
        id: number;
        code: string;
    };
};

export type LeekFile = {
    path: string;
    name: string;
};

export type FolderMapping = Record<string, number>;

export type DirectoryStructure = {
    folders: string[];
    files: LeekFile[];
};
