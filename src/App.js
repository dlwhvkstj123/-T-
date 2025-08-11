import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, BookOpen, CheckCircle, XCircle, RotateCcw, Plus, Edit3, School, Calendar, Users, Settings, Home, LogOut, Trash2 } from 'lucide-react';

const EnglishLearningPlatform = () => {
  // 학교 및 시험 데이터 구조
  const [schoolData, setSchoolData] = useState({
    "서울중학교": {
      "2024년 2학기 중간고사": [
        {
          id: 1,
          type: "multiple_choice",
          question: "I _____ to school every day.",
          options: ["go", "goes", "going", "went"],
          correctAnswer: 0,
          explanation: "매일 반복되는 일상적인 행동이므로 현재시제를 사용합니다. 주어가 'I'이므로 동사 원형을 사용합니다."
        },
        {
          id: 2,
          type: "multiple_choice",
          question: "She _____ a book right now.",
          options: ["read", "reads", "is reading", "was reading"],
          correctAnswer: 2,
          explanation: "'right now'는 현재진행시제를 나타내는 표현입니다. 주어가 'She'이므로 'is reading'이 정답입니다."
        },
        {
          id: 5,
          type: "short_answer",
          question: "다음 문장을 영어로 번역하세요: '나는 매일 아침 7시에 일어난다.'",
          correctAnswer: ["I wake up at 7 AM every morning.", "I get up at 7 AM every morning.", "I wake up at 7 o'clock every morning."],
          explanation: "현재시제와 시간 표현을 정확히 사용해야 합니다. 'wake up'이나 'get up' 모두 '일어나다'라는 뜻입니다."
        }
      ],
      "2024년 2학기 기말고사": [
        {
          id: 3,
          type: "multiple_choice",
          question: "Choose the correct past tense of 'buy':",
          options: ["buyed", "bought", "buying", "buys"],
          correctAnswer: 1,
          explanation: "'buy'의 과거형은 불규칙변화로 'bought'입니다."
        },
        {
          id: 6,
          type: "short_answer",
          question: "'beautiful'의 반대말을 영어로 쓰세요.",
          correctAnswer: ["ugly", "unattractive"],
          explanation: "'beautiful'(아름다운)의 반대말은 'ugly'(못생긴, 추한)나 'unattractive'(매력없는) 등이 있습니다."
        }
      ]
    },
    "부산고등학교": {
      "영어I - 1단원": [
        {
          id: 4,
          type: "multiple_choice",
          question: "What is the meaning of 'ambitious'?",
          options: ["lazy", "determined to succeed", "confused", "angry"],
          correctAnswer: 1,
          explanation: "'ambitious'는 '야심있는, 성공하려고 결심한'이라는 뜻입니다."
        }
      ]
    }
  });

  // 사용자 상태
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedExam, setSelectedExam] = useState('');
  
  // 학생 데이터 (학습 기록 추적)
  const [studentsData, setStudentsData] = useState({
    "김철수": {
      school: "서울중학교",
      joinDate: "2024-03-01",
      lastActive: "2024-08-09",
      progress: {
        "2024년 2학기 중간고사": {
          completed: true,
          score: 66,
          completedAt: "2024-08-09 14:30",
          answers: {1: 0, 2: 2, 5: "I wake up at 7 AM every morning."},
          timeSpent: 180
        }
      }
    },
    "박영희": {
      school: "서울중학교", 
      joinDate: "2024-03-01",
      lastActive: "2024-08-08",
      progress: {
        "2024년 2학기 중간고사": {
          completed: false,
          currentQuestion: 1,
          answers: {1: 0},
          timeSpent: 45
        }
      }
    },
    "이민수": {
      school: "부산고등학교",
      joinDate: "2024-03-15", 
      lastActive: "2024-08-07",
      progress: {}
    }
  });
  
  // 앱 상태
  const [currentMode, setCurrentMode] = useState('login');
  const [isAdmin, setIsAdmin] = useState(false);
  
  // 퀴즈 상태
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [wrongQuestions, setWrongQuestions] = useState([]);
  const [shortAnswerText, setShortAnswerText] = useState('');
  
  // 관리자 모드 상태
  const [adminMode, setAdminMode] = useState('overview');
  const [newSchool, setNewSchool] = useState('');
  const [newExam, setNewExam] = useState('');
  const [selectedAdminSchool, setSelectedAdminSchool] = useState('');
  const [selectedAdminExam, setSelectedAdminExam] = useState('');
  const [questionType, setQuestionType] = useState('multiple_choice');
  const [newQuestion, setNewQuestion] = useState({
    type: 'multiple_choice',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: ''
  });
  
  // 학생 관리 상태
  const [selectedStudentSchool, setSelectedStudentSchool] = useState('');
  const [editingStudent, setEditingStudent] = useState(null);
  const [editingQuestion, setEditingQuestion] = useState(null);

  // 로그인 처리
  const handleLogin = (username, password) => {
    if (username === 'admin' && password === 'admin123') {
      setCurrentUser('관리자');
      setIsAdmin(true);
      setCurrentMode('admin');
    } else {
      if (!studentsData[username]) {
        const defaultSchool = Object.keys(schoolData)[0] || "서울중학교";
        setStudentsData(prev => ({
          ...prev,
          [username]: {
            school: defaultSchool,
            joinDate: new Date().toISOString().split('T')[0],
            lastActive: new Date().toISOString().split('T')[0],
            progress: {}
          }
        }));
      } else {
        setStudentsData(prev => ({
          ...prev,
          [username]: {
            ...prev[username],
            lastActive: new Date().toISOString().split('T')[0]
          }
        }));
      }
      setCurrentUser(username);
      setIsAdmin(false);
      setCurrentMode('select');
    }
  };

  // 로그아웃
  const handleLogout = () => {
    setCurrentUser(null);
    setIsAdmin(false);
    setCurrentMode('login');
    setSelectedSchool('');
    setSelectedExam('');
    setUserAnswers({});
    setShowResult(false);
    setQuizCompleted(false);
    setCurrentQuestionIndex(0);
    setShortAnswerText('');
  };

  // 학교/시험 선택 후 퀴즈 시작
  const startSelectedQuiz = () => {
    if (selectedSchool && selectedExam) {
      setCurrentMode('quiz');
      setCurrentQuestionIndex(0);
      setUserAnswers({});
      setShowResult(false);
      setQuizCompleted(false);
      setWrongQuestions([]);
      setShortAnswerText('');
    }
  };

  // 오답 문제 다시 풀기
  const retryWrongQuestions = () => {
    if (wrongQuestions.length > 0) {
      setCurrentMode('wrong');
      setCurrentQuestionIndex(0);
      setUserAnswers({});
      setShowResult(false);
      setQuizCompleted(false);
      setShortAnswerText('');
    }
  };

  // 새 학교 추가
  const addNewSchool = () => {
    if (newSchool.trim() && !schoolData[newSchool.trim()]) {
      setSchoolData(prev => ({
        ...prev,
        [newSchool.trim()]: {}
      }));
      setNewSchool('');
      alert(`${newSchool.trim()}이(가) 추가되었습니다.`);
    } else if (schoolData[newSchool.trim()]) {
      alert('이미 존재하는 학교입니다.');
    }
  };

  // 새 시험 추가
  const addNewExam = () => {
    if (selectedAdminSchool && newExam.trim() && !schoolData[selectedAdminSchool][newExam.trim()]) {
      setSchoolData(prev => ({
        ...prev,
        [selectedAdminSchool]: {
          ...prev[selectedAdminSchool],
          [newExam.trim()]: []
        }
      }));
      setNewExam('');
      alert(`${newExam.trim()}이(가) 추가되었습니다.`);
    } else if (schoolData[selectedAdminSchool]?.[newExam.trim()]) {
      alert('이미 존재하는 시험입니다.');
    }
  };

  // 새 문제 추가
  const addNewQuestion = () => {
    if (!selectedAdminSchool || !selectedAdminExam) {
      alert('학교와 시험을 선택해주세요.');
      return;
    }
    
    if (!newQuestion.question.trim()) {
      alert('문제를 입력해주세요.');
      return;
    }

    if (questionType === 'multiple_choice' && newQuestion.options.some(opt => !opt.trim())) {
      alert('모든 선택지를 입력해주세요.');
      return;
    }

    if (questionType === 'short_answer') {
      const correctAnswer = newQuestion.correctAnswer;
      const hasAnswer = Array.isArray(correctAnswer) 
        ? correctAnswer.length > 0 && correctAnswer.some(ans => ans.trim())
        : correctAnswer && correctAnswer.trim();
      
      if (!hasAnswer) {
        alert('정답을 입력해주세요.');
        return;
      }
    }

    const existingQuestions = schoolData[selectedAdminSchool][selectedAdminExam] || [];
    const maxId = existingQuestions.length > 0 ? Math.max(...existingQuestions.map(q => q.id)) : 0;
    
    let questionToAdd;
    if (questionType === 'multiple_choice') {
      questionToAdd = {
        ...newQuestion,
        id: maxId + 1,
        type: 'multiple_choice'
      };
    } else {
      questionToAdd = {
        id: maxId + 1,
        type: 'short_answer',
        question: newQuestion.question,
        correctAnswer: newQuestion.correctAnswer,
        explanation: newQuestion.explanation
      };
    }

    setSchoolData(prev => ({
      ...prev,
      [selectedAdminSchool]: {
        ...prev[selectedAdminSchool],
        [selectedAdminExam]: [...(prev[selectedAdminSchool][selectedAdminExam] || []), questionToAdd]
      }
    }));

    setNewQuestion({
      type: questionType,
      question: '',
      options: questionType === 'multiple_choice' ? ['', '', '', ''] : [],
      correctAnswer: questionType === 'multiple_choice' ? 0 : '',
      explanation: ''
    });
    alert('문제가 추가되었습니다!');
  };

  // 문제 삭제
  const deleteQuestion = (school, exam, questionId) => {
    if (window.confirm('정말 이 문제를 삭제하시겠습니까?')) {
      setSchoolData(prev => ({
        ...prev,
        [school]: {
          ...prev[school],
          [exam]: prev[school][exam].filter(q => q.id !== questionId)
        }
      }));
      alert('문제가 삭제되었습니다.');
    }
  };

  // 문제 수정
  const updateQuestion = (school, exam, questionId, updatedQuestion) => {
    setSchoolData(prev => ({
      ...prev,
      [school]: {
        ...prev[school],
        [exam]: prev[school][exam].map(q => 
          q.id === questionId ? { ...q, ...updatedQuestion } : q
        )
      }
    }));
    setEditingQuestion(null);
    alert('문제가 수정되었습니다.');
  };

  // 문제 편집 시작
  const startEditingQuestion = (question) => {
    setEditingQuestion({
      ...question,
      options: question.options || ['', '', '', '']
    });
  };

  // 문제 편집 취소
  const cancelEditing = () => {
    setEditingQuestion(null);
  };

  // 현재 퀴즈 데이터
  const getCurrentQuizData = () => {
    if (currentMode === 'wrong') return wrongQuestions;
    if (selectedSchool && selectedExam) {
      return schoolData[selectedSchool]?.[selectedExam] || [];
    }
    return [];
  };

  // 답 선택 처리 (객관식)
  const handleAnswerSelect = (answerIndex) => {
    const currentQuestions = getCurrentQuizData();
    const questionId = currentQuestions[currentQuestionIndex].id;
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
    setShowResult(true);
  };

  // 서답형 답 제출
  const handleShortAnswerSubmit = () => {
    const currentQuestions = getCurrentQuizData();
    const questionId = currentQuestions[currentQuestionIndex].id;
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: shortAnswerText.trim()
    }));
    setShowResult(true);
  };

  // 서답형 정답 체크
  const checkShortAnswer = (userAnswer, correctAnswers) => {
    const userAnswerLower = userAnswer.toLowerCase().trim();
    
    if (Array.isArray(correctAnswers)) {
      return correctAnswers.some(answer => 
        answer.toLowerCase().trim() === userAnswerLower
      );
    }
    
    return correctAnswers.toLowerCase().trim() === userAnswerLower;
  };

  // 다음 문제로
  const nextQuestion = () => {
    const currentQuestions = getCurrentQuizData();
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowResult(false);
      setShortAnswerText('');
    } else {
      setQuizCompleted(true);
      if (currentMode === 'quiz') {
        const wrong = currentQuestions.filter(q => {
          if (q.type === 'multiple_choice') {
            return userAnswers[q.id] !== q.correctAnswer;
          } else {
            return !checkShortAnswer(userAnswers[q.id] || '', q.correctAnswer);
          }
        });
        setWrongQuestions(wrong);
      }
      setCurrentMode('results');
    }
  };

  // 이전 문제로
  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setShowResult(true);
      const currentQuestions = getCurrentQuizData();
      const currentQuestion = currentQuestions[currentQuestionIndex - 1];
      if (currentQuestion.type === 'short_answer') {
        setShortAnswerText(userAnswers[currentQuestion.id] || '');
      }
    }
  };

  // 결과 계산
  const calculateResults = () => {
    const currentQuestions = getCurrentQuizData();
    const correct = currentQuestions.filter(q => {
      if (q.type === 'multiple_choice') {
        return userAnswers[q.id] === q.correctAnswer;
      } else {
        return checkShortAnswer(userAnswers[q.id] || '', q.correctAnswer);
      }
    }).length;
    const total = currentQuestions.length;
    return { correct, total, percentage: Math.round((correct / total) * 100) };
  };

  // 로그인 화면
  if (currentMode === 'login') {
    return (
      <div className="max-w-md mx-auto bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full mx-4">
          <div className="text-center mb-8">
            <BookOpen className="w-16 h-16 mx-auto text-blue-600 mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">영어 학습 플랫폼</h1>
            <p className="text-gray-600">시험 대비 맞춤 학습</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">이름</label>
              <input
                type="text"
                id="username"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="이름을 입력하세요"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">비밀번호</label>
              <input
                type="password"
                id="password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="비밀번호를 입력하세요"
              />
            </div>
            <button
              onClick={() => {
                const username = document.getElementById('username').value;
                const password = document.getElementById('password').value;
                if (username && password) {
                  handleLogin(username, password);
                } else {
                  alert('이름과 비밀번호를 입력해주세요.');
                }
              }}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 font-medium"
            >
              로그인
            </button>
          </div>
          
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>관리자: admin / admin123</p>
            <p>학생: 이름 / 아무 비밀번호</p>
          </div>
        </div>
      </div>
    );
  }

  // 학교/시험 선택 화면
  if (currentMode === 'select') {
    return (
      <div className="max-w-md mx-auto bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
        <div className="bg-white shadow-lg">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <div className="flex items-center">
              <School className="w-6 h-6 mr-2" />
              <div>
                <h1 className="text-lg font-bold">시험 선택</h1>
                <p className="text-sm text-blue-100">{currentUser}님</p>
              </div>
            </div>
            <button onClick={handleLogout} className="p-2 rounded-full hover:bg-white/20">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div className="bg-white rounded-lg p-4 shadow-md">
            <h3 className="text-lg font-semibold mb-3 text-gray-800 flex items-center">
              <School className="w-5 h-5 mr-2" />
              학교 선택
            </h3>
            <div className="space-y-2">
              {Object.keys(schoolData).map(school => (
                <button
                  key={school}
                  onClick={() => {
                    setSelectedSchool(school);
                    setSelectedExam('');
                  }}
                  className={`w-full p-3 text-left rounded-lg border-2 transition-all ${
                    selectedSchool === school
                      ? 'border-blue-500 bg-blue-50 text-blue-800'
                      : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-blue-300'
                  }`}
                >
                  {school}
                </button>
              ))}
            </div>
          </div>

          {selectedSchool && (
            <div className="bg-white rounded-lg p-4 shadow-md">
              <h3 className="text-lg font-semibold mb-3 text-gray-800 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                시험 선택
              </h3>
              <div className="space-y-2">
                {Object.keys(schoolData[selectedSchool]).map(exam => (
                  <button
                    key={exam}
                    onClick={() => setSelectedExam(exam)}
                    className={`w-full p-3 text-left rounded-lg border-2 transition-all ${
                      selectedExam === exam
                        ? 'border-green-500 bg-green-50 text-green-800'
                        : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-green-300'
                    }`}
                  >
                    <div className="font-medium">{exam}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      {schoolData[selectedSchool][exam]?.length || 0}개 문제
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedSchool && selectedExam && (
            <button
              onClick={startSelectedQuiz}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-4 rounded-lg hover:from-green-700 hover:to-emerald-700 font-bold text-lg"
            >
              퀴즈 시작하기 🚀
            </button>
          )}
        </div>
      </div>
    );
  }

  // 퀴즈 화면
  if (currentMode === 'quiz' || currentMode === 'wrong') {
    const currentQuestions = getCurrentQuizData();
    const currentQuestion = currentQuestions[currentQuestionIndex];
    
    if (!currentQuestion) {
      return (
        <div className="max-w-md mx-auto bg-red-50 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-bold text-red-800 mb-4">문제를 불러올 수 없습니다</h2>
            <button 
              onClick={() => setCurrentMode('select')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              돌아가기
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-md mx-auto bg-gradient-to-br from-green-50 to-emerald-100 min-h-screen">
        <div className="bg-white shadow-lg">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
            <div className="flex items-center">
              <BookOpen className="w-6 h-6 mr-2" />
              <div>
                <h1 className="text-lg font-bold">
                  {currentMode === 'wrong' ? '오답 노트' : '퀴즈'}
                </h1>
                <p className="text-sm text-green-100">
                  {currentQuestionIndex + 1} / {currentQuestions.length}
                </p>
              </div>
            </div>
            <button 
              onClick={() => setCurrentMode('select')} 
              className="p-2 rounded-full hover:bg-white/20"
            >
              <Home className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4">
          <div className="bg-white rounded-lg p-6 shadow-md mb-4">
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm text-gray-500">
                문제 {currentQuestionIndex + 1}
              </div>
              <div className="text-sm text-blue-600 font-medium">
                {currentQuestion.type === 'multiple_choice' ? '객관식' : '주관식'}
              </div>
            </div>
            
            <h2 className="text-lg font-semibold text-gray-800 mb-4 leading-relaxed">
              {currentQuestion.question}
            </h2>

            {currentQuestion.type === 'multiple_choice' ? (
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showResult}
                    className={`w-full p-3 text-left rounded-lg border-2 transition-all ${
                      showResult 
                        ? index === currentQuestion.correctAnswer
                          ? 'border-green-500 bg-green-50 text-green-800'
                          : userAnswers[currentQuestion.id] === index
                            ? 'border-red-500 bg-red-50 text-red-800'
                            : 'border-gray-200 bg-gray-50 text-gray-500'
                        : userAnswers[currentQuestion.id] === index
                          ? 'border-blue-500 bg-blue-50 text-blue-800'
                          : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-blue-300'
                    }`}
                  >
                    <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                    {option}
                    {showResult && index === currentQuestion.correctAnswer && (
                      <CheckCircle className="w-5 h-5 inline-block ml-2 text-green-600" />
                    )}
                    {showResult && userAnswers[currentQuestion.id] === index && index !== currentQuestion.correctAnswer && (
                      <XCircle className="w-5 h-5 inline-block ml-2 text-red-600" />
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    답안을 입력하세요:
                  </label>
                  <textarea
                    value={shortAnswerText}
                    onChange={(e) => setShortAnswerText(e.target.value)}
                    disabled={showResult}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                    rows="3"
                    placeholder="답안을 입력하세요..."
                  />
                </div>
                {!showResult && (
                  <button
                    onClick={handleShortAnswerSubmit}
                    disabled={!shortAnswerText.trim()}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-300 font-medium"
                  >
                    답안 제출
                  </button>
                )}
                {showResult && (
                  <div className="p-4 rounded-lg border-2 bg-gray-50">
                    <div className="flex items-center mb-2">
                      {checkShortAnswer(userAnswers[currentQuestion.id] || '', currentQuestion.correctAnswer) ? (
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 mr-2" />
                      )}
                      <span className="font-medium">
                        {checkShortAnswer(userAnswers[currentQuestion.id] || '', currentQuestion.correctAnswer) ? '정답!' : '오답'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p className="mb-1"><strong>입력한 답:</strong> {userAnswers[currentQuestion.id] || '(입력하지 않음)'}</p>
                      <p><strong>정답:</strong> {Array.isArray(currentQuestion.correctAnswer) 
                        ? currentQuestion.correctAnswer.join(', ') 
                        : currentQuestion.correctAnswer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {showResult && currentQuestion.explanation && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-800 mb-2">💡 해설</h4>
                <p className="text-blue-700 text-sm">{currentQuestion.explanation}</p>
              </div>
            )}
          </div>

          <div className="flex justify-between">
            <button
              onClick={prevQuestion}
              disabled={currentQuestionIndex === 0}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-300"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              이전
            </button>
            
            <button
              onClick={nextQuestion}
              disabled={!showResult}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300"
            >
              {currentQuestionIndex === currentQuestions.length - 1 ? '완료' : '다음'}
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 결과 화면
  if (currentMode === 'results') {
    const results = calculateResults();
    
    return (
      <div className="max-w-md mx-auto bg-gradient-to-br from-purple-50 to-pink-100 min-h-screen">
        <div className="bg-white shadow-lg">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            <div className="flex items-center">
              <CheckCircle className="w-6 h-6 mr-2" />
              <div>
                <h1 className="text-lg font-bold">퀴즈 완료!</h1>
                <p className="text-sm text-purple-100">결과 확인</p>
              </div>
            </div>
            <button onClick={() => setCurrentMode('select')} className="p-2 rounded-full hover:bg-white/20">
              <Home className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div className="bg-white rounded-lg p-6 shadow-md text-center">
            <div className="text-6xl font-bold mb-4" style={{ color: results.percentage >= 80 ? '#10B981' : results.percentage >= 60 ? '#F59E0B' : '#EF4444' }}>
              {results.percentage}%
            </div>
            <div className="text-lg font-semibold text-gray-800 mb-2">
              {results.correct} / {results.total} 정답
            </div>
            <div className="text-gray-600">
              {results.percentage >= 80 ? '🎉 훌륭해요!' : results.percentage >= 60 ? '👍 잘했어요!' : '💪 더 화이팅!'}
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => {
                setCurrentMode('select');
                setSelectedSchool('');
                setSelectedExam('');
                setUserAnswers({});
                setShowResult(false);
                setQuizCompleted(false);
                setCurrentQuestionIndex(0);
              }}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 font-medium"
            >
              다른 시험 보기
            </button>
            
            <button
              onClick={() => {
                setCurrentQuestionIndex(0);
                setUserAnswers({});
                setShowResult(false);
                setQuizCompleted(false);
                setCurrentMode('quiz');
              }}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 font-medium"
            >
              다시 풀기
            </button>
            
            {wrongQuestions.length > 0 && (
              <button
                onClick={retryWrongQuestions}
                className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 font-medium flex items-center justify-center"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                오답만 다시 풀기 ({wrongQuestions.length}문제)
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 관리자 모드
  if (currentMode === 'admin') {
    return (
      <div className="max-w-md mx-auto bg-gradient-to-br from-purple-50 to-pink-100 min-h-screen">
        <div className="bg-white shadow-lg">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            <div className="flex items-center">
              <Settings className="w-6 h-6 mr-2" />
              <div>
                <h1 className="text-lg font-bold">관리자 패널</h1>
                <p className="text-sm text-purple-100">{currentUser}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="p-2 rounded-full hover:bg-white/20">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* 관리자 메뉴 */}
          <div className="bg-white rounded-lg p-4 shadow-md">
            <div className="grid grid-cols-2 gap-2 mb-2">
              <button
                onClick={() => setAdminMode('overview')}
                className={`p-3 rounded-lg text-sm font-medium ${
                  adminMode === 'overview'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                전체 현황
              </button>
              <button
                onClick={() => setAdminMode('student_management')}
                className={`p-3 rounded-lg text-sm font-medium ${
                  adminMode === 'student_management'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                학생 관리
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setAdminMode('manage_schools')}
                className={`p-3 rounded-lg text-sm font-medium ${
                  adminMode === 'manage_schools'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                학교 관리
              </button>
              <button
                onClick={() => setAdminMode('add_question')}
                className={`p-3 rounded-lg text-sm font-medium ${
                  adminMode === 'add_question'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                문제 추가
              </button>
              <button
                onClick={() => setAdminMode('edit_questions')}
                className={`p-3 rounded-lg text-sm font-medium ${
                  adminMode === 'edit_questions'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                문제 수정
              </button>
            </div>
          </div>

          {/* 전체 현황 */}
          {adminMode === 'overview' && (
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 shadow-md">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">📊 전체 현황</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>총 학교 수:</span>
                    <span className="font-bold">{Object.keys(schoolData).length}개</span>
                  </div>
                  <div className="flex justify-between">
                    <span>총 학생 수:</span>
                    <span className="font-bold">{Object.keys(studentsData).length}명</span>
                  </div>
                  <div className="flex justify-between">
                    <span>총 시험 수:</span>
                    <span className="font-bold">
                      {Object.values(schoolData).reduce((acc, school) => acc + Object.keys(school).length, 0)}개
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>총 문제 수:</span>
                    <span className="font-bold">
                      {Object.values(schoolData).reduce((acc, school) => 
                        acc + Object.values(school).reduce((acc2, questions) => acc2 + questions.length, 0), 0
                      )}개
                    </span>
                  </div>
                </div>
              </div>

              {Object.keys(schoolData).map(school => (
                <div key={school} className="bg-white rounded-lg p-4 shadow-md">
                  <h4 className="font-semibold text-gray-800 mb-2">{school}</h4>
                  <div className="space-y-1">
                    {Object.keys(schoolData[school]).map(exam => (
                      <div key={exam} className="flex justify-between text-sm">
                        <span className="text-gray-600">{exam}</span>
                        <span className="text-blue-600 font-medium">
                          {schoolData[school][exam].length}문제
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 학생 관리 */}
          {adminMode === 'student_management' && (
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 shadow-md">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">👥 학생 관리</h3>
                
                <div className="space-y-3">
                  {Object.entries(studentsData).map(([studentName, studentInfo]) => (
                    <div key={studentName} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-800">{studentName}</h4>
                          <p className="text-sm text-gray-600">학교: {studentInfo.school}</p>
                          <p className="text-sm text-gray-500">
                            마지막 활동: {studentInfo.lastActive}
                          </p>
                          <p className="text-sm text-gray-500">
                            완료한 시험: {Object.keys(studentInfo.progress || {}).length}개
                          </p>
                        </div>
                      </div>
                      
                      {studentInfo.progress && Object.keys(studentInfo.progress).length > 0 && (
                        <div className="mt-2 pt-2 border-t border-gray-100">
                          <h5 className="text-sm font-medium text-gray-700 mb-1">학습 기록:</h5>
                          {Object.entries(studentInfo.progress).map(([examName, progress]) => (
                            <div key={examName} className="text-sm text-gray-600">
                              <span className="font-medium">{examName}:</span> {
                                progress.completed 
                                  ? `${progress.score}점 (${progress.completedAt})`
                                  : '진행중'
                              }
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 학교 관리 */}
          {adminMode === 'manage_schools' && (
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 shadow-md">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">🏫 학교 관리</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">새 학교 추가</label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newSchool}
                        onChange={(e) => setNewSchool(e.target.value)}
                        placeholder="학교명을 입력하세요"
                        className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      />
                      <button
                        onClick={addNewSchool}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                      >
                        추가
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">학교 선택 (시험 추가용)</label>
                    <select
                      value={selectedAdminSchool}
                      onChange={(e) => {
                        setSelectedAdminSchool(e.target.value);
                        setSelectedAdminExam('');
                        setEditingQuestion(null);
                      }}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="">학교를 선택하세요</option>
                      {Object.keys(schoolData).map(school => (
                        <option key={school} value={school}>{school}</option>
                      ))}
                    </select>
                  </div>

                  {selectedAdminSchool && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">새 시험 추가</label>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={newExam}
                          onChange={(e) => setNewExam(e.target.value)}
                          placeholder="시험명을 입력하세요"
                          className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                        <button
                          onClick={addNewExam}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                        >
                          추가
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 문제 추가 */}
          {adminMode === 'add_question' && (
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 shadow-md">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">📝 문제 추가</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">학교 선택</label>
                    <select
                      value={selectedAdminSchool}
                      onChange={(e) => setSelectedAdminSchool(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="">학교를 선택하세요</option>
                      {Object.keys(schoolData).map(school => (
                        <option key={school} value={school}>{school}</option>
                      ))}
                    </select>
                  </div>

                  {selectedAdminSchool && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">시험 선택</label>
                      <select
                        value={selectedAdminExam}
                        onChange={(e) => setSelectedAdminExam(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      >
                        <option value="">시험을 선택하세요</option>
                        {Object.keys(schoolData[selectedAdminSchool]).map(exam => (
                          <option key={exam} value={exam}>{exam}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {selectedAdminSchool && selectedAdminExam && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">문제 유형</label>
                        <div className="flex space-x-4">
                          <button
                            onClick={() => {
                              setQuestionType('multiple_choice');
                              setNewQuestion({
                                type: 'multiple_choice',
                                question: '',
                                options: ['', '', '', ''],
                                correctAnswer: 0,
                                explanation: ''
                              });
                            }}
                            className={`px-4 py-2 rounded-lg ${
                              questionType === 'multiple_choice'
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            객관식
                          </button>
                          <button
                            onClick={() => {
                              setQuestionType('short_answer');
                              setNewQuestion({
                                type: 'short_answer',
                                question: '',
                                correctAnswer: '',
                                explanation: ''
                              });
                            }}
                            className={`px-4 py-2 rounded-lg ${
                              questionType === 'short_answer'
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            주관식
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">문제</label>
                        <textarea
                          value={newQuestion.question}
                          onChange={(e) => setNewQuestion({...newQuestion, question: e.target.value})}
                          placeholder="문제를 입력하세요"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          rows="3"
                        />
                      </div>

                      {questionType === 'multiple_choice' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">선택지</label>
                          <div className="space-y-2">
                            {newQuestion.options.map((option, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  name="correctAnswer"
                                  checked={newQuestion.correctAnswer === index}
                                  onChange={() => setNewQuestion({...newQuestion, correctAnswer: index})}
                                  className="text-purple-600"
                                />
                                <input
                                  type="text"
                                  value={option}
                                  onChange={(e) => {
                                    const newOptions = [...newQuestion.options];
                                    newOptions[index] = e.target.value;
                                    setNewQuestion({...newQuestion, options: newOptions});
                                  }}
                                  placeholder={`선택지 ${index + 1}`}
                                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {questionType === 'short_answer' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            정답 (여러 정답이 있을 경우 쉼표로 구분)
                          </label>
                          <input
                            type="text"
                            value={Array.isArray(newQuestion.correctAnswer) 
                              ? newQuestion.correctAnswer.join(', ')
                              : newQuestion.correctAnswer}
                            onChange={(e) => {
                              const answers = e.target.value.split(',').map(ans => ans.trim()).filter(ans => ans);
                              setNewQuestion({
                                ...newQuestion, 
                                correctAnswer: answers.length <= 1 ? (answers[0] || '') : answers
                              });
                            }}
                            placeholder="정답을 입력하세요"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">해설</label>
                        <textarea
                          value={newQuestion.explanation}
                          onChange={(e) => setNewQuestion({...newQuestion, explanation: e.target.value})}
                          placeholder="해설을 입력하세요"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          rows="3"
                        />
                      </div>

                      <button
                        onClick={addNewQuestion}
                        className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 font-medium"
                      >
                        문제 추가
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 문제 수정 */}
          {adminMode === 'edit_questions' && (
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 shadow-md">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">✏️ 문제 수정</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">학교 선택</label>
                    <select
                      value={selectedAdminSchool}
                      onChange={(e) => {
                        setSelectedAdminSchool(e.target.value);
                        setSelectedAdminExam('');
                        setEditingQuestion(null);
                      }}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="">학교를 선택하세요</option>
                      {Object.keys(schoolData).map(school => (
                        <option key={school} value={school}>{school}</option>
                      ))}
                    </select>
                  </div>

                  {selectedAdminSchool && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">시험 선택</label>
                      <select
                        value={selectedAdminExam}
                        onChange={(e) => {
                          setSelectedAdminExam(e.target.value);
                          setEditingQuestion(null);
                        }}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      >
                        <option value="">시험을 선택하세요</option>
                        {Object.keys(schoolData[selectedAdminSchool]).map(exam => (
                          <option key={exam} value={exam}>{exam}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {selectedAdminSchool && selectedAdminExam && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-800">문제 목록</h4>
                      
                      {/* 수정 중인 문제가 있을 때 */}
                      {editingQuestion && (
                        <div className="border-2 border-purple-300 rounded-lg p-4 bg-purple-50">
                          <div className="flex justify-between items-center mb-4">
                            <h5 className="font-semibold text-purple-800">문제 수정 중</h5>
                            <button
                              onClick={cancelEditing}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                          </div>
                          
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">문제</label>
                              <textarea
                                value={editingQuestion.question}
                                onChange={(e) => setEditingQuestion({...editingQuestion, question: e.target.value})}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                rows="3"
                              />
                            </div>

                            {editingQuestion.type === 'multiple_choice' && (
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">선택지</label>
                                <div className="space-y-2">
                                  {editingQuestion.options.map((option, index) => (
                                    <div key={index} className="flex items-center space-x-2">
                                      <input
                                        type="radio"
                                        name="editCorrectAnswer"
                                        checked={editingQuestion.correctAnswer === index}
                                        onChange={() => setEditingQuestion({...editingQuestion, correctAnswer: index})}
                                        className="text-purple-600"
                                      />
                                      <input
                                        type="text"
                                        value={option}
                                        onChange={(e) => {
                                          const newOptions = [...editingQuestion.options];
                                          newOptions[index] = e.target.value;
                                          setEditingQuestion({...editingQuestion, options: newOptions});
                                        }}
                                        placeholder={`선택지 ${index + 1}`}
                                        className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {editingQuestion.type === 'short_answer' && (
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  정답 (여러 정답이 있을 경우 쉼표로 구분)
                                </label>
                                <input
                                  type="text"
                                  value={Array.isArray(editingQuestion.correctAnswer) 
                                    ? editingQuestion.correctAnswer.join(', ')
                                    : editingQuestion.correctAnswer}
                                  onChange={(e) => {
                                    const answers = e.target.value.split(',').map(ans => ans.trim()).filter(ans => ans);
                                    setEditingQuestion({
                                      ...editingQuestion, 
                                      correctAnswer: answers.length <= 1 ? (answers[0] || '') : answers
                                    });
                                  }}
                                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                />
                              </div>
                            )}

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">해설</label>
                              <textarea
                                value={editingQuestion.explanation}
                                onChange={(e) => setEditingQuestion({...editingQuestion, explanation: e.target.value})}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                rows="3"
                              />
                            </div>

                            <div className="flex space-x-2">
                              <button
                                onClick={() => updateQuestion(selectedAdminSchool, selectedAdminExam, editingQuestion.id, editingQuestion)}
                                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 font-medium"
                              >
                                수정 완료
                              </button>
                              <button
                                onClick={cancelEditing}
                                className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 font-medium"
                              >
                                취소
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* 문제 목록 */}
                      {schoolData[selectedAdminSchool][selectedAdminExam].map((question, index) => (
                        <div key={question.id} className={`border rounded-lg p-3 ${
                          editingQuestion?.id === question.id ? 'border-purple-300 bg-purple-50' : 'border-gray-200'
                        }`}>
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="text-sm text-gray-500 mb-1">
                                문제 {index + 1} ({question.type === 'multiple_choice' ? '객관식' : '주관식'})
                              </div>
                              <div className="font-medium text-gray-800 mb-2">
                                {question.question}
                              </div>
                              {question.type === 'multiple_choice' && (
                                <div className="text-sm text-gray-600 mb-1">
                                  선택지: {question.options.join(', ')}
                                </div>
                              )}
                              <div className="text-sm text-gray-600 mb-1">
                                정답: {question.type === 'multiple_choice' 
                                  ? question.options[question.correctAnswer]
                                  : Array.isArray(question.correctAnswer) 
                                    ? question.correctAnswer.join(', ')
                                    : question.correctAnswer}
                              </div>
                              {question.explanation && (
                                <div className="text-sm text-gray-500">
                                  해설: {question.explanation}
                                </div>
                              )}
                            </div>
                            <div className="flex space-x-1 ml-2">
                              <button
                                onClick={() => startEditingQuestion(question)}
                                disabled={editingQuestion !== null}
                                className="p-1 text-blue-600 hover:bg-blue-50 rounded disabled:text-gray-400"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteQuestion(selectedAdminSchool, selectedAdminExam, question.id)}
                                disabled={editingQuestion !== null}
                                className="p-1 text-red-600 hover:bg-red-50 rounded disabled:text-gray-400"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {schoolData[selectedAdminSchool][selectedAdminExam].length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          아직 문제가 없습니다. 문제 추가 메뉴에서 문제를 추가해주세요.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default EnglishLearningPlatform;
