import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import StudentCard from './components/StudentCard';
import './App.css';

function App() {
  // Load initial state from local storage or create 1~25
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('reading-timers');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) {
          return parsed.map(s => ({
            ...s,
            isRunning: false,
          }));
        }
      } catch (e) {
        // fallthrough to default
      }
    }
    
    // Default: 1번 to 25번
    return Array.from({ length: 25 }, (_, i) => ({
      id: crypto.randomUUID(),
      name: `${i + 1}번`,
      totalTime: 0,
      isRunning: false,
      lastStartTime: null,
    }));
  });

  const [newStudentName, setNewStudentName] = useState('');

  // Save to local storage whenever students change
  useEffect(() => {
    localStorage.setItem('reading-timers', JSON.stringify(students));
  }, [students]);

  const handleAddStudent = (e) => {
    e.preventDefault();
    const name = newStudentName.trim();
    if (!name) return;

    const newStudent = {
      id: crypto.randomUUID(),
      name: name.includes('번') ? name : `${name}번`,
      totalTime: 0,
      isRunning: false,
      lastStartTime: null,
    };

    setStudents(prev => [...prev, newStudent]);
    setNewStudentName('');
  };

  const handleDeleteStudent = (id) => {
    if (window.confirm('정말 이 번호의 기록을 삭제하시겠습니까?')) {
      setStudents(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleToggleTimer = (id) => {
    setStudents(prev => prev.map(student => {
      if (student.id !== id) return student;

      if (student.isRunning) {
        // Stop timer
        const sessionTime = Math.floor((Date.now() - student.lastStartTime) / 1000);
        return {
          ...student,
          isRunning: false,
          totalTime: student.totalTime + sessionTime,
        };
      } else {
        // Start timer
        return {
          ...student,
          isRunning: true,
          lastStartTime: Date.now(),
        };
      }
    }));
  };

  const handleResetAllTimers = () => {
    if (window.confirm('모든 번호의 오늘 독서 시간을 0초로 초기화하시겠습니까?')) {
      setStudents(prev => prev.map(student => ({
        ...student,
        totalTime: 0,
        isRunning: false,
        lastStartTime: null,
      })));
    }
  };

  const handleHardReset = () => {
    if (window.confirm('경고: 모든 기록과 번호가 완전히 삭제되고 1~25번으로 초기화됩니다. 내년에 새롭게 시작할 때만 누르세요! 진행하시겠습니까?')) {
      const resetStudents = Array.from({ length: 25 }, (_, i) => ({
        id: crypto.randomUUID(),
        name: `${i + 1}번`,
        totalTime: 0,
        isRunning: false,
        lastStartTime: null,
      }));
      setStudents(resetStudents);
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>우리 반 독서 타이머 📚</h1>
        <p>전자칠판에서 각자의 타이머를 눌러 독서를 시작해봐요!</p>
      </header>

      <div className="controls-wrapper">
        <form className="controls" onSubmit={handleAddStudent}>
          <input 
            type="text" 
            className="student-input"
            placeholder="추가 번호 입력 (예: 26)" 
            value={newStudentName}
            onChange={(e) => setNewStudentName(e.target.value)}
          />
          <button type="submit" className="add-btn" disabled={!newStudentName.trim()}>
            <Plus size={20} /> 번호 추가
          </button>
        </form>
        
        <div className="reset-buttons">
          {students.length > 0 && (
            <button onClick={handleResetAllTimers} className="reset-btn">
              🔄 오늘 독서시간 모두 0으로 리셋
            </button>
          )}
          <button onClick={handleHardReset} className="hard-reset-btn">
            ⚠️ 새 학년 완전 초기화 (1~25번 재생성)
          </button>
        </div>
      </div>

      <div className="grid-container">
        {students.length === 0 ? (
          <div className="empty-state">
            아직 등록된 학생이 없습니다. <br/>
            위에서 이름을 입력하고 추가해주세요!
          </div>
        ) : (
          students.map(student => (
            <StudentCard 
              key={student.id} 
              student={student} 
              onToggleTimer={handleToggleTimer}
              onDelete={handleDeleteStudent}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default App;
