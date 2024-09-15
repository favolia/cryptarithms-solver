import { create } from "zustand";
import { MAX_ROWS, MAX_COLUMNS } from "@/config/constants";

type WordSlot = { length: number };

type WordStore = {
    rowWords: WordSlot[];
    addRow: () => void;
    removeRow: () => void;
    addColumn: (rowIndex: number) => void;
    removeColumn: (rowIndex: number) => void;
};

export const useWordStore = create<WordStore>((set, get) => ({
    rowWords: [
        { length: 3 },
        { length: 3 },
    ],
    addRow: () => {
        const { rowWords } = get();
        const rowWordsLength = rowWords.length
        if (rowWordsLength < MAX_ROWS) {
            set((state) => ({
                rowWords: [...state.rowWords, { length: 1 }],
            }));
        }
    },
    removeRow: () => {
        const { rowWords } = get();
        const rowWordsLength = rowWords.length
        if (rowWordsLength > 2) {
            set((state) => ({
                rowWords: state.rowWords.slice(0, -1),
            }));
        }
    },
    addColumn: (rowIndex: number) => {
        const { rowWords } = get();
        const currentRowWordsLength = rowWords[rowIndex].length
        if (currentRowWordsLength < MAX_COLUMNS) {
            set((state) => ({
                rowWords: state.rowWords.map((row, index) =>
                    index === rowIndex ? { ...row, length: row.length + 1 } : row
                ),
            }));
        }
    },
    removeColumn: (rowIndex: number) => {
        set((state) => ({
            rowWords: state.rowWords.map((row, index) =>
                index === rowIndex && row.length > 1 ? { ...row, length: row.length - 1 } : row
            ),
        }));
    },
}));
