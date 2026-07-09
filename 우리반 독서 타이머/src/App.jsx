import { useState, useEffect, useRef } from 'react';
import { Plus, Music, Play, Square } from 'lucide-react';
import StudentCard from './components/StudentCard';
import './App.css';

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [targetTime, setTargetTime] = useState('08:57');
  const [isReadingMode, setIsReadingMode] = useState(false);
  const audioRef = useRef(null);
  const alertAudioRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      if (isReadingMode) {
        const currentHours = now.getHours().toString().padStart(2, '0');
        const currentMinutes = now.getMinutes().toString().padStart(2, '0');
        const currentSeconds = now.getSeconds();

        const [targetHours, targetMinutes] = targetTime.split(':');

        if (currentHours === targetHours && currentMinutes === targetMinutes && currentSeconds === 0) {
          setIsReadingMode(false);
          if (audioRef.current) {
            audioRef.current.pause();
          }

          if (alertAudioRef.current) {
            // Play alert, then speak when it finishes
            alertAudioRef.current.play()
              .then(() => {
                alertAudioRef.current.onended = () => {
                  const msg = new SpeechSynthesisUtterance("독서 시간이 종료되었습니다.");
                  msg.lang = 'ko-KR';
                  window.speechSynthesis.speak(msg);
                };
              })
              .catch(e => {
                console.error("Alert play failed:", e);
                // Fallback
                const msg = new SpeechSynthesisUtterance("독서 시간이 종료되었습니다.");
                msg.lang = 'ko-KR';
                window.speechSynthesis.speak(msg);
              });
          }
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isReadingMode, targetTime]);

  const handleToggleReadingMode = () => {
    if (!isReadingMode) {
      if (audioRef.current) {
        audioRef.current.play().catch(e => console.error("Audio play failed:", e));
      }
      setIsReadingMode(true);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsReadingMode(false);
    }
  };

  // Load initial state from local storage or create 1~25
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('reading-timers');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) {
          const hasRealNames = parsed.some(s => !/^\d+번$/.test(s.name));
          if (hasRealNames) {
            console.warn("Privacy check failed: found real names. Resetting to numbers.");
            // 강제로 1~25번 생성하여 반환 (에러를 던지지 않음)
            return Array.from({ length: 25 }, (_, i) => ({
              id: crypto.randomUUID(),
              name: `${i + 1}번`,
              totalTime: 0,
              isRunning: false,
              lastStartTime: null,
              logs: [],
            }));
          }

          return parsed.map(s => ({
            ...s,
            isRunning: false,
            logs: s.logs || [], // Ensure logs array exists
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
      logs: [],
    }));
  });

  const [newStudentName, setNewStudentName] = useState('');
  const [logModalStudentId, setLogModalStudentId] = useState(null);

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
      logs: [],
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
    if (window.confirm('모든 번호의 오늘 독서 시간을 기록장에 저장하고 0초로 초기화하시겠습니까?')) {
      const today = new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' });
      let savedCount = 0;
      
      setStudents(prev => prev.map(student => {
        // Only save log if they read something today
        const updatedLogs = [...(student.logs || [])];
        if (student.totalTime > 0 || student.isRunning) {
          const sessionTime = student.isRunning ? Math.floor((Date.now() - student.lastStartTime) / 1000) : 0;
          const finalTime = student.totalTime + sessionTime;
          
          if (finalTime > 0) {
            updatedLogs.push({ date: today, time: finalTime });
            savedCount++;
          }
        }
        
        return {
          ...student,
          totalTime: 0,
          isRunning: false,
          lastStartTime: null,
          logs: updatedLogs,
        };
      }));

      // Give visual feedback after a short delay so state updates
      setTimeout(() => {
        if (savedCount > 0) {
          alert(`총 ${savedCount}명의 독서 기록이 성공적으로 기록장에 저장되고 리셋되었습니다!`);
        } else {
          alert('저장할 독서 기록(1초 이상)이 없어서 타이머만 0으로 초기화되었습니다.');
        }
      }, 100);
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
        logs: [],
      }));
      setStudents(resetStudents);
    }
  };

  const selectedStudentForLog = students.find(s => s.id === logModalStudentId);

  return (
    <div className="app-container">
      <header className="header">
        <h1>우리 반 독서 타이머 📚</h1>
        <p>오늘의 독서 목표를 달성해봐요!</p>
      </header>

      {/* Corner Timer */}
      <div className={`corner-timer ${isReadingMode ? 'active' : ''}`}>
        <div className="corner-clock">
          {currentTime.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
        </div>
        <div className="corner-controls">
          <div className="corner-target-group">
            <span className="corner-target-label">종료 시각</span>
            <input 
              type="time" 
              className="corner-time-input"
              value={targetTime} 
              onChange={(e) => setTargetTime(e.target.value)} 
              disabled={isReadingMode}
            />
          </div>
          <button 
            type="button"
            className={`corner-toggle-btn ${isReadingMode ? 'stop' : 'start'}`}
            onClick={handleToggleReadingMode}
            title={isReadingMode ? "독서 종료" : "독서 시작"}
          >
            {isReadingMode ? <Square size={16} /> : <Play size={16} />}
          </button>
        </div>
        <audio ref={audioRef} loop>
          <source src={`${import.meta.env.BASE_URL}bgm.mp3`} type="audio/mpeg" />
        </audio>

        <audio ref={alertAudioRef} preload="auto">
          <source src={`${import.meta.env.BASE_URL}sound.mp3`} type="audio/mpeg" />
        </audio>
        
        {isReadingMode && (
          <div className="corner-music-indicator">
            <Music size={12} className="music-icon" /> 재생 중
          </div>
        )}
      </div>

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
              🔄 기록장에 저장 & 0초로 리셋
            </button>
          )}
          <button onClick={handleHardReset} className="hard-reset-btn">
            ⚠️ 1~25번 완전 재생성
          </button>
        </div>
      </div>

      <div className="grid-container">
        {students.length === 0 ? (
          <div className="empty-state">
            아직 등록된 학생이 없습니다. <br/>
            위에서 번호를 추가해주세요!
          </div>
        ) : (
          students.map(student => (
            <StudentCard 
              key={student.id} 
              student={student} 
              onToggleTimer={handleToggleTimer}
              onDelete={handleDeleteStudent}
              onViewLog={setLogModalStudentId}
            />
          ))
        )}
      </div>

      <footer className="app-footer">
        <p>Music: "Gymnopedie No 1" by Kevin MacLeod (incompetech.com) / Licensed under CC BY 4.0</p>
      </footer>

      {logModalStudentId && selectedStudentForLog && (
        <div className="modal-overlay" onClick={() => setLogModalStudentId(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedStudentForLog.name} 독서 기록장 📖</h2>
              <button className="close-btn" onClick={() => setLogModalStudentId(null)}>×</button>
            </div>
            
            <div className="log-list">
              {(!selectedStudentForLog.logs || selectedStudentForLog.logs.length === 0) ? (
                <div className="empty-log">아직 저장된 독서 기록이 없습니다.<br/>오늘 독서를 마치고 리셋 버튼을 누르면 저장됩니다!</div>
              ) : (
                selectedStudentForLog.logs.map((log, index) => {
                  const hours = Math.floor(log.time / 3600);
                  const minutes = Math.floor((log.time % 3600) / 60);
                  const seconds = log.time % 60;
                  let timeString = '';
                  if (hours > 0) timeString += `${hours}시간 `;
                  if (minutes > 0) timeString += `${minutes}분 `;
                  timeString += `${seconds}초`;

                  return (
                    <div key={index} className="log-item">
                      <span className="log-date">{log.date}</span>
                      <span className="log-time">{timeString}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
