export interface ElectronAPI {
  runPython: (code: string) => Promise<{
    success: boolean;
    output: string;
    error: string;
  }>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
