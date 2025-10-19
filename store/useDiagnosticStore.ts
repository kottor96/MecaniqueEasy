import { create } from 'zustand';

type DiagnosticState = {
  diagnosticDone: boolean;
  setDiagnosticDone: (done: boolean) => void;
};

export const useDiagnosticStore = create<DiagnosticState>((set) => ({
  diagnosticDone: false,
  setDiagnosticDone: (done) => set({ diagnosticDone: done }),
}));
