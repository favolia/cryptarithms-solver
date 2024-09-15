import { create } from "zustand";
import { MAX_COLUMNS } from "@/config/constants";

type AnswerStore = {
    rowAnswerLength: number;
    addColumnAnswer: () => void;
    removeColumnAnswer: () => void;
};

export const useAnswerStore = create<AnswerStore>((set, get) => ({
    rowAnswerLength: 3,
    addColumnAnswer: () => {
        const { rowAnswerLength } = get();
        if (rowAnswerLength < MAX_COLUMNS) {
            set((state) => ({
                rowAnswerLength: state.rowAnswerLength + 1,
            }));
        }
    },
    removeColumnAnswer: () => {
        const { rowAnswerLength } = get();
        if (rowAnswerLength > 1) {
            set((state) => ({
                rowAnswerLength: state.rowAnswerLength - 1,
            }));
        }
    },
}));
