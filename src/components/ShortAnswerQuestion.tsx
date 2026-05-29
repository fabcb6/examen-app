import type { ShortAnswerQuestion as SAQuestion } from '../types/Question';

interface Props {
  question: SAQuestion;
  value: string | undefined;
  onChange: (value: string) => void;
}

export function ShortAnswerQuestion({ question, value, onChange }: Props) {
  return (
    <textarea
      placeholder="Escribe tu respuesta aquí..."
      rows={5}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: '100%',
        padding: '12px',
        fontSize: '15px',
        border: '1px solid #ccc',
        borderRadius: '6px',
        resize: 'vertical',
        boxSizing: 'border-box'
      }}
    />
  );
}
