import jsPDF from 'jspdf';
import 'jspdf-autotable';
import type { Question, StudentInfo } from '../types/Question';

interface GeneratePdfOptions {
  student: StudentInfo;
  questions: Question[];
  answers: Record<number, string | number>;
}

export function generateExamPdf({ student, questions, answers }: GeneratePdfOptions) {
  const doc = new jsPDF();
  let yPosition = 20;

  // Header
  doc.setFontSize(18);
  doc.text('Examen de Programación', 105, yPosition, { align: 'center' });
  yPosition += 10;

  doc.setFontSize(12);
  doc.text(`Estudiante: ${student.nombre}`, 20, yPosition);
  yPosition += 7;
  doc.text(`Carnet: ${student.carnet}`, 20, yPosition);
  yPosition += 7;
  doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 20, yPosition);
  yPosition += 15;

  // Questions
  questions.forEach((question, index) => {
    // Check if we need a new page
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }

    const questionNumber = index + 1;
    const answer = answers[question.id];

    // Question header
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Pregunta ${questionNumber} (${question.puntos} pts)`, 20, yPosition);
    yPosition += 8;

    // Question statement
    doc.setFont('helvetica', 'normal');
    const enunciadoLines = doc.splitTextToSize(question.enunciado, 170);
    doc.text(enunciadoLines, 20, yPosition);
    yPosition += enunciadoLines.length * 7 + 5;

    // Answer
    doc.setFont('helvetica', 'bold');
    doc.text('Respuesta:', 20, yPosition);
    yPosition += 7;

    doc.setFont('helvetica', 'normal');

    let answerText = '';

    if (question.type === 'multiple_choice' && question.opciones) {
      if (typeof answer === 'number' && question.opciones[answer]) {
        answerText = question.opciones[answer];
      } else {
        answerText = '(Sin respuesta)';
      }
    } 
    else if (question.type === 'short_answer') {
      answerText = (answer as string) || '(Sin respuesta)';
    } 
    else if (question.type === 'coding') {
      answerText = (answer as string) || '(Sin respuesta)';
    }

    const answerLines = doc.splitTextToSize(answerText, 170);
    doc.text(answerLines, 25, yPosition);
    yPosition += answerLines.length * 7 + 12;
  });

  // Save the PDF
  const fileName = `Examen_${student.carnet}_${student.nombre.replace(/\s+/g, '_')}.pdf`;
  doc.save(fileName);
}
