import { useState } from "react";

interface Question {
  id: number;
  question: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  options?: string[];
  correctAnswer?: string;
}

export default function App() {
  const [topic, setTopic] = useState("");
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 1,
      question: "What does MIPS stand for?",
      difficulty: "easy",
      category: "General Knowledge",
      options: [
        "Microprocessor without Interlocked Pipeline Stages",
        "Machine Instruction Pipeline Systems",
        "Multiple Instruction Processing System",
      ],
      correctAnswer: "Microprocessor without Interlocked Pipeline Stages",
    },
    {
      id: 2,
      question:
        "Which of the following is a common register in MIPS architecture?",
      difficulty: "easy",
      category: "Architecture",
      options: ["R1", "$t0", "$r1", "$a0"],
      correctAnswer: "$t0",
    },
    {
      id: 3,
      question: "What is the primary instruction format used in MIPS?",
      difficulty: "medium",
      category: "Programming Concepts",
      options: ["R-type", "I-type", "J-type", "All of the above"],
      correctAnswer: "All of the above",
    },
    {
      id: 4,
      question: "In MIPS assembly, what does the 'add' instruction do?",
      difficulty: "medium",
      category: "Instructions",
      options: [
        "Subtracts two registers",
        "Adds two registers and stores the result in a third",
        "Multiplies two registers",
        "Divides two registers",
      ],
      correctAnswer: "Adds two registers and stores the result in a third",
    },
    {
      id: 5,
      question: "What is the purpose of the 'lw' instruction in MIPS?",
      difficulty: "medium",
      category: "Memories and I/O",
      options: ["Load word", "Store word", "Load byte", "Store byte"],
      correctAnswer: "Load word",
    },
    {
      id: 6,
      question: "How is a branch condition typically checked in MIPS assembly?",
      difficulty: "medium",
      category: "Control Flow",
      options: [
        "Using a jump instruction",
        "Using a test and set instruction",
        "Using a conditional branch instruction",
        "Using a move instruction",
      ],
      correctAnswer: "Using a conditional branch instruction",
    },
    {
      id: 7,
      question:
        "What is the result of executing the following MIPS code: 'add $t0, $t1, $t2' if $t1 = 5 and $t2 = 10?",
      difficulty: "hard",
      category: "Calculations",
      options: ["5", "10", "15", "20"],
      correctAnswer: "15",
    },
    {
      id: 8,
      question:
        "Describe the significance of the syscall instruction in MIPS programming.",
      difficulty: "hard",
      category: "System Calls",
      options: [
        "To enter a loop",
        "To handle system calls",
        "To perform arithmetic operations",
        "To compare values",
      ],
      correctAnswer: "To handle system calls",
    },
    {
      id: 9,
      question: "In MIPS, what is the purpose of using the stack?",
      difficulty: "hard",
      category: "Memory Management",
      options: [
        "To execute programs directly",
        "To store temporary variables and return addresses",
        "To maintain constant values",
        "To hold user input",
      ],
      correctAnswer: "To store temporary variables and return addresses",
    },
    {
      id: 10,
      question:
        "What does it mean when a MIPS program is described as 'pipelined'?",
      difficulty: "hard",
      category: "Performance",
      options: [
        "It executes instructions in parallel stages",
        "It runs instructions in a sequential manner",
        "It loads instructions from memory faster",
        "It reduces memory size",
      ],
      correctAnswer: "It executes instructions in parallel stages",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const generateQuestions = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5001/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate questions");
      }
      const data = await response.json();
      console.log(data);
      setQuestions(data);
    } catch (err) {
      console.log("Error Happened");
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <header className="text-center mb-8">
        <h1 className="text-2xl">Question Generator</h1>
      </header>

      <main>
        <form onSubmit={generateQuestions} className="flex gap-2 mb-6">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter a topic (e.g., JavaScript fundamentals)"
            className="flex-1 p-2 border rounded"
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            {isLoading ? "Generating..." : "Generate Questions"}
          </button>
        </form>

        {error && (
          <div className="p-3 mb-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {questions && (
          <div className="space-y-4">
            {questions.map((q) => (
              <div key={q.id} className="p-4 border rounded">
                <div className="flex gap-2 items-center mb-2">
                  <span>Question {q.id}</span>
                  <span
                    className={`px-2 py-1 rounded text-sm text-white
                    ${
                      q.difficulty === "easy"
                        ? "bg-green-500"
                        : q.difficulty === "medium"
                        ? "bg-orange-500"
                        : "bg-red-500"
                    }`}
                  >
                    {q.difficulty}
                  </span>
                  <span className="px-2 py-1 bg-gray-200 rounded text-sm">
                    {q.category}
                  </span>
                </div>
                <p className="mb-3">{q.question}</p>
                {q.options && (
                  <div className="space-y-2">
                    {q.options.map((option, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`question-${q.id}`}
                          id={`q${q.id}-option${index}`}
                        />
                        <label htmlFor={`q${q.id}-option${index}`}>
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
                {q.correctAnswer && (
                  <div className="mt-3 p-2 bg-gray-100 rounded">
                    <strong>Answer:</strong> {q.correctAnswer}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
