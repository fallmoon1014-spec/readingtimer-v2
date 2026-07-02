import { useState, useEffect } from 'react';
import { Play, Pause, Trash2 } from 'lucide-react';
import { formatTime } from '../utils/timeFormat';
import './StudentCard.css';

const StudentCard = ({ student, onToggleTimer, onDelete }) => {
  const [displayTime, setDisplayTime] = useState(student.totalTime);

  // Update the display time every second if the timer is running
  useEffect(() => {
    let intervalId;
    if (student.isRunning) {
      intervalId = setInterval(() => {
        const sessionTime = Math.floor((Date.now() - student.lastStartTime) / 1000);
        setDisplayTime(student.totalTime + sessionTime);
      }, 1000);
    } else {
      setDisplayTime(student.totalTime);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [student.isRunning, student.totalTime, student.lastStartTime]);

  return (
    <div className={`student-card ${student.isRunning ? 'running' : ''}`}>
      <div className="card-header">
        <h3 className="student-name">{student.name}</h3>
        <button 
          className="delete-btn" 
          onClick={() => onDelete(student.id)}
          title="학생 삭제"
        >
          <Trash2 size={16} />
        </button>
      </div>
      
      <div className="time-display">
        {formatTime(displayTime)}
      </div>
      
      <button 
        className={`toggle-btn ${student.isRunning ? 'pause' : 'play'}`}
        onClick={() => onToggleTimer(student.id)}
      >
        {student.isRunning ? (
          <>
            <Pause size={24} /> 일시정지
          </>
        ) : (
          <>
            <Play size={24} /> 시작
          </>
        )}
      </button>
    </div>
  );
};

export default StudentCard;
