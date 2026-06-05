import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { spawn } from 'child_process';
import fs from 'fs';
import os from 'os';

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (!app.isPackaged) {
    win.loadURL('http://localhost:5173');
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// Mejor handler para ejecutar código Python
ipcMain.handle('run-python', async (event, code: string) => {
  return new Promise((resolve) => {
    // Creamos un archivo temporal
    const tempDir = os.tmpdir();
    const tempFile = path.join(tempDir, `examen_temp_${Date.now()}.py`);

    try {
      // Escribimos el código al archivo temporal
      fs.writeFileSync(tempFile, code, 'utf8');

      // Intentamos usar 'python' primero (Windows), luego 'python3' (Mac/Linux)
      const pythonCmd = process.platform === 'win32' ? 'py' : 'python3';
      const pythonArgs = process.platform === 'win32' ? ['-3', tempFile] : [tempFile];

      const pythonProcess = spawn(pythonCmd, pythonArgs, {
        cwd: tempDir,
        env: process.env,
      });

      let stdout = '';
      let stderr = '';

      pythonProcess.stdout.on('data', (data) => {
        stdout += data.toString('utf8');
      });

      pythonProcess.stderr.on('data', (data) => {
        stderr += data.toString('utf8');
      });

      pythonProcess.on('close', (code) => {
        // Limpiamos el archivo temporal
        try {
          fs.unlinkSync(tempFile);
        } catch (e) {
          // Ignoramos error al borrar archivo temporal
        }

        resolve({
          success: code === 0,
          output: stdout,
          error: stderr,
        });
      });

      pythonProcess.on('error', (err) => {
        try {
          fs.unlinkSync(tempFile);
        } catch (e) {}

        resolve({
          success: false,
          output: '',
          error: `Error al ejecutar Python: ${err.message}\n\nAsegúrate de tener Python instalado y en el PATH.`,
        });
      });
    } catch (err: any) {
      resolve({
        success: false,
        output: '',
        error: `Error al preparar la ejecución: ${err.message}`,
      });
    }
  });
});
