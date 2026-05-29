import Editor from '@monaco-editor/react';
import type { CodingQuestion as CodingQuestionType } from '../types/Question';

interface Props {
  question: CodingQuestionType;
  value: string | undefined;
  onChange: (value: string) => void;
  onRunCode?: () => void;
  isRunning?: boolean;
  output?: string;
}

export function CodingQuestionComponent({ 
  question, 
  value, 
  onChange, 
  onRunCode, 
  isRunning, 
  output 
}: Props) {
  const code = value ?? question.starterCode ?? '';

  const handleEditorChange = (newValue: string | undefined) => {
    onChange(newValue || '');
  };

  return (
    <div>
      <div style={{ 
        border: '1px solid #ccc', 
        borderRadius: '6px', 
        overflow: 'hidden',
        marginBottom: '10px'
      }}>
        <Editor
          height="320px"
          defaultLanguage="python"
          value={code}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            insertSpaces: true,
            // Desactivar completamente autocompletado y sugerencias
            quickSuggestions: false,
            suggestOnTriggerCharacters: false,
            parameterHints: { enabled: false },
            acceptSuggestionOnEnter: "off",
            snippetSuggestions: "none",
            wordBasedSuggestions: "off",
            suggest: {
              showMethods: false,
              showFunctions: false,
              showConstructors: false,
              showFields: false,
              showVariables: false,
              showClasses: false,
              showStructs: false,
              showInterfaces: false,
              showModules: false,
              showProperties: false,
              showEvents: false,
              showOperators: false,
              showUnits: false,
              showValues: false,
              showConstants: false,
              showEnums: false,
              showEnumMembers: false,
              showKeywords: false,
              showWords: false,
              showColors: false,
              showFiles: false,
              showReferences: false,
              showFolders: false,
              showTypeParameters: false,
              showSnippets: false,
              showUsers: false,
              showIssues: false,
            },
          }}
        />
      </div>

      <div style={{ marginTop: '10px' }}>
        <button 
          onClick={onRunCode}
          disabled={isRunning}
          style={{
            padding: '8px 16px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isRunning ? 'not-allowed' : 'pointer'
          }}
        >
          {isRunning ? 'Ejecutando...' : 'Ejecutar Código'}
        </button>
      </div>

      {output && (
        <div style={{ marginTop: '12px' }}>
          <strong>Salida:</strong>
          <pre style={{
            backgroundColor: '#f1f3f5',
            padding: '12px',
            borderRadius: '6px',
            marginTop: '6px',
            whiteSpace: 'pre-wrap',
            fontSize: '13px',
            minHeight: '60px',
            border: '1px solid #ddd'
          }}>
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}
