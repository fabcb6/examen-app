import { useState } from 'react'
import type { StudentInfo, Question } from './types/Question'
import questionsData from '../resources/questions.json'
import { MultipleChoiceQuestion } from './components/MultipleChoiceQuestion'
import { ShortAnswerQuestion } from './components/ShortAnswerQuestion'
import { CodingQuestionComponent as CodingQuestion } from './components/CodingQuestion'
import { generateExamPdf } from './utils/generatePdf'

type Answers = Record<number, string | number>

function App() {
  const [student, setStudent] = useState<StudentInfo | null>(null)
  const [nombre, setNombre] = useState('')
  const [carnet, setCarnet] = useState('')

  const [answers, setAnswers] = useState<Answers>({})
  const [outputs, setOutputs] = useState<Record<number, string>>({})
  const [runningQuestion, setRunningQuestion] = useState<number | null>(null)

  const questions: Question[] = questionsData as Question[]

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (nombre.trim() && carnet.trim()) {
      setStudent({ nombre: nombre.trim(), carnet: carnet.trim() })
    }
  }

  const handleAnswerChange = (questionId: number, value: string | number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }))
  }

  const handleRunCode = async (questionId: number) => {
    const code = (answers[questionId] as string) || ''
    if (!code.trim()) {
      alert('Por favor escribe algo de código primero.')
      return
    }

    setRunningQuestion(questionId)

    try {
      // Llamamos al proceso principal de Electron para ejecutar Python
      // @ts-ignore - electronAPI se inyecta en preload
      const result = await window.electronAPI.runPython(code)

      let finalOutput = ''

      if (result.success) {
        finalOutput = result.output 
          ? `✅ Código ejecutado correctamente.\n\n--- Salida ---\n${result.output}`
          : `✅ Código ejecutado correctamente (sin salida).`
      } else {
        // Solo indicamos que falló, sin mostrar el error real al estudiante
        console.error('Error real de ejecución:', result.error || result.output);
        finalOutput = `❌ El código falló.`;
      }

      setOutputs(prev => ({
        ...prev,
        [questionId]: finalOutput
      }))
    } catch (error: any) {
      console.error('Error inesperado al ejecutar código:', error);
      setOutputs(prev => ({
        ...prev,
        [questionId]: `❌ Error inesperado al ejecutar el código.`
      }))
    } finally {
      setRunningQuestion(null)
    }
  }

  // Login Screen
  if (!student) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f9fa'
      }}>
        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          width: '100%',
          maxWidth: '420px'
        }}>
          <h1 style={{ textAlign: 'center', marginBottom: '8px' }}>Examen de Programación</h1>
          <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>
            Ingresa tus datos para comenzar
          </p>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>
                Nombre completo
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  fontSize: '16px',
                  border: '1px solid #ccc',
                  borderRadius: '6px'
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>
                Carnet
              </label>
              <input
                type="text"
                value={carnet}
                onChange={(e) => setCarnet(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  fontSize: '16px',
                  border: '1px solid #ccc',
                  borderRadius: '6px'
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '16px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Ingresar al examen
            </button>
          </form>
        </div>
      </div>
    )
  }

  // Exam Screen
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <header style={{ marginBottom: '30px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
        <h1>Examen de Programación</h1>
        <p style={{ margin: 0, color: '#555' }}>
          <strong>Estudiante:</strong> {student.nombre} &nbsp;&nbsp;|&nbsp;&nbsp; <strong>Carnet:</strong> {student.carnet}
        </p>
      </header>

      <div>
        {questions.map((question, index) => (
          <div key={question.id} style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '25px',
            backgroundColor: '#fff'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <strong>Pregunta {index + 1}</strong>
              <span style={{ 
                backgroundColor: '#e7f3ff', 
                padding: '4px 12px', 
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: 600
              }}>
                {question.puntos} pts
              </span>
            </div>

            <p style={{ marginBottom: '16px', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
              {question.enunciado}
            </p>

            {/* Multiple Choice */}
            {question.type === 'multiple_choice' && question.opciones && (
              <MultipleChoiceQuestion
                question={question}
                questionNumber={index + 1}
                value={answers[question.id] as number | undefined}
                onChange={(val) => handleAnswerChange(question.id, val)}
              />
            )}

            {/* Short Answer */}
            {question.type === 'short_answer' && (
              <ShortAnswerQuestion
                question={question}
                value={answers[question.id] as string | undefined}
                onChange={(val) => handleAnswerChange(question.id, val)}
              />
            )}

            {/* Coding Question */}
            {question.type === 'coding' && (
              <CodingQuestion
                question={question}
                value={answers[question.id] as string | undefined}
                onChange={(val) => handleAnswerChange(question.id, val)}
                onRunCode={() => handleRunCode(question.id)}
                isRunning={runningQuestion === question.id}
                output={outputs[question.id]}
              />
            )}
          </div>
        ))}
      </div>

      <div style={{ marginTop: '40px', textAlign: 'center' }}>
        <button 
          style={{ 
            padding: '14px 32px', 
            fontSize: '16px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
          onClick={() => {
            if (student) {
              generateExamPdf({
                student,
                questions,
                answers,
              });
            }
          }}
        >
          Exportar examen a PDF
        </button>
      </div>
    </div>
  )
}

export default App
