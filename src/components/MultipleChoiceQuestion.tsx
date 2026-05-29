import type { MultipleChoiceQuestion as MCQuestion } from '../types/Question';

interface Props {
  question: MCQuestion;
  questionNumber: number;
  value: number | undefined;
  onChange: (value: number) => void;
}

export function MultipleChoiceQuestion({ question, questionNumber, value, onChange }: Props) {
  return (
    <div style={{ marginBottom: '8px' }}>
      {question.opciones.map((opcion, index) => (
        <label 
          key={index} 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px', 
            padding: '8px 0',
            cursor: 'pointer'
          }}
        >
          <input
            type="radio"
            name={`q-${question.id}`}
            value={index}
            checked={value === index}
            onChange={() => onChange(index)}
          />
          <span>{opcion}</span>
        </label>
      ))}
    </div>
  );
}
