import type { Question, StudentInfo } from '../types/Question';

interface GenerateTxtOptions {
  student: StudentInfo;
  questions: Question[];
  answers: Record<number, string | number>;
  outputs?: Record<number, string>;
}

export function generateExamTxt({ student, questions, answers, outputs = {} }: GenerateTxtOptions) {
  const lines: string[] = [];

  // Header
  lines.push('EXAMEN DE PROGRAMACIÓN');
  lines.push('========================');
  lines.push('');
  lines.push(`Estudiante: ${student.nombre}`);
  lines.push(`Carnet:     ${student.carnet}`);
  lines.push(`Fecha:      ${new Date().toLocaleString()}`);
  lines.push('');
  lines.push('============================================================');
  lines.push('                    RESPUESTAS DEL ESTUDIANTE');
  lines.push('============================================================');
  lines.push('');

  questions.forEach((question, index) => {
    const qNum = index + 1;
    const answer = answers[question.id];

    const typeLabel =
      question.type === 'coding'
        ? ' [PREGUNTA DE CÓDIGO]'
        : question.type === 'short_answer'
        ? ' [RESPUESTA BREVE]'
        : '';

    lines.push(`PREGUNTA ${qNum}  (${question.puntos} pts)${typeLabel}`);
    lines.push('-'.repeat(60));
    lines.push('');

    // Enunciado
    lines.push('ENUNCIADO:');
    lines.push(question.enunciado.trim());
    lines.push('');

    // Respuesta
    lines.push('RESPUESTA:');

    let answerText = '';

    if (question.type === 'multiple_choice' && question.opciones) {
      if (typeof answer === 'number' && question.opciones[answer] !== undefined) {
        answerText = `${answer + 1}. ${question.opciones[answer]}`;
      } else {
        answerText = '(Sin respuesta)';
      }
      lines.push(answerText);
    } else if (question.type === 'short_answer') {
      answerText = (answer as string) || '(Sin respuesta)';
      lines.push(answerText);
    } else if (question.type === 'coding') {
      answerText = (answer as string) || '(Sin respuesta)';

      if (answerText === '(Sin respuesta)') {
        lines.push(answerText);
      } else {
        // For coding questions, put the full code in a clear block
        lines.push('```python');
        lines.push(answerText);
        lines.push('```');

        // Include execution output if the student ran the code
        const output = outputs[question.id];
        if (output && output.trim()) {
          lines.push('');
          lines.push('--- Salida de ejecución ---');
          lines.push(output.trim());
          lines.push('---------------------------');
        }
      }
    }

    lines.push('');
    lines.push(''); // blank lines between questions
  });

  lines.push('============================================================');
  lines.push('                        FIN DEL EXAMEN');
  lines.push('============================================================');

  const content = lines.join('\n');

  // Generate filename
  const safeName = student.nombre.replace(/\s+/g, '_');
  const fileName = `Examen_${student.carnet}_${safeName}.txt`;

  // Trigger browser download
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
