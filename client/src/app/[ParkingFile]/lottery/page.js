"use client";  // הוספת ההגדרה לצורך עבודה בצד הלקוח

import React, { useState } from "react";

const LotteryPage = () => {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [numWinners, setNumWinners] = useState(1); // מספר הזוכים
  const [selectedUsers, setSelectedUsers] = useState([]); // למעקב אחרי המשתמשים שנבחרו

  // פונקציה שמבצעת את ההגרלה
  const handleLotteryClick = async () => {
    setLoading(true);
    setResult('Loading...'); // הודעה של טעינה עד שההגרלה תתבצע

    try {
      // ביצוע בקשה ל-API לקבלת המשתמשים
      const response = await fetch('https://bs-fse-2025-team9.onrender.com/students');
      if (!response.ok) {
        throw new Error('Error fetching students');
      }

      const users = await response.json();
      console.log('Users data:', users);  // הדפסת הנתונים המתקבלים מה-API

      // אם אין משתמשים, הצג הודעת שגיאה
      if (users.length === 0) {
        setResult('No users found.');
        setLoading(false);
        return;
      }

      // אם כמות הזוכים גדולה ממספר המשתמשים, הצג הודעת שגיאה
      if (numWinners > users.length) {
        setResult('Number of winners exceeds the total number of users.');
        setLoading(false);
        return;
      }

      // רשימה חדשה של זוכים
      let winners = [];
      let selectedIndexes = new Set(); // אוסף כדי לוודא שאין אינדקסים כפולים

      // ביצוע הגרלה עד שנבחרו כמות הזוכים
      while (winners.length < numWinners) {
        const randomIndex = Math.floor(Math.random() * users.length);

        // אם האינדקס לא נבחר קודם, הוסף אותו לרשימת הזוכים
        if (!selectedIndexes.has(randomIndex)) {
          selectedIndexes.add(randomIndex);
          winners.push(users[randomIndex]);
        }
      }

      // הצגת הנתונים של המשתמשים הזוכים
      const winnerDetails = winners.map((winner) => {
        return `${winner.first_name} ${winner.last_name}, ID: ${winner.student_id}`;
      }).join(", ");

      setResult(`The winners are: ${winnerDetails}`);
    } catch (error) {
      setResult('An error occurred. Please try again.');
      console.error('Error fetching users:', error.message);  // הדפסת השגיאה המפורטת
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Lottery</h1>
      <div style={styles.inputContainer}>
        <label style={styles.inputLabel}>Enter the number of winners:</label>
        <input
          type="number"
          min="1"
          value={numWinners}
          onChange={(e) => setNumWinners(Number(e.target.value))}
          style={styles.input}
        />
      </div>
      <button 
        onClick={handleLotteryClick} 
        disabled={loading} 
        style={styles.button}
      >
        {loading ? 'Drawing...' : 'Start Lottery'}
      </button>
      {result && <div style={styles.result}>{result}</div>}
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
    marginTop: '50px',
  },
  header: {
    fontSize: '2rem',
    marginBottom: '20px',
  },
  inputContainer: {
    marginBottom: '20px',
  },
  inputLabel: {
    fontSize: '1rem',
    marginBottom: '5px',
    display: 'block',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    width: '100px',
    textAlign: 'center',
    marginBottom: '10px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    transition: 'background-color 0.3s',
  },
  result: {
    marginTop: '20px',
    fontSize: '1.2rem',
    color: '#333',
    fontWeight: 'bold',
  },
};

export default LotteryPage;
