"use client"; // הוספת ההגדרה לצורך עבודה בצד הלקוח

import React, { useState } from "react";
import anime from "animejs"; // נדרשת התקנה של anime.js (npm install animejs)

const LotteryPage = () => {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [numWinners, setNumWinners] = useState(1); // מספר הזוכים
  const [crystalActive, setCrystalActive] = useState(false); // מצב כדור הבדולח

  const handleLotteryClick = async () => {
    setLoading(true);
    setResult(""); // איפוס התוצאה הקודמת
    setCrystalActive(true); // הפעלת האנימציה של כדור הבדולח

    try {

      const response = await fetch("https://bs-fse-2025-team9.onrender.com/documents");

      if (!response.ok) {
        throw new Error("Error fetching documents");
      }

      const documents = await response.json();
      console.log("Fetched documents:", documents); // בדיקת הנתונים שמתקבלים

      if (documents.length === 0) {
        setResult("No documents found.");
        setLoading(false);
        return;
      }

      if (numWinners > documents.length) {
        setResult("Number of winners exceeds the total number of documents.");
        setLoading(false);
        return;
      }

      let winners = [];
      let selectedIndexes = new Set();

      while (winners.length < numWinners) {
        const randomIndex = Math.floor(Math.random() * documents.length);
        if (!selectedIndexes.has(randomIndex)) {
          selectedIndexes.add(randomIndex);
          winners.push(documents[randomIndex]);
        }
      }

      const winnerDetails = winners
        .map(
          (winner) =>
            `Name: ${winner.first_name} ${winner.last_name}, ID: ${winner.student_id}`
        )
        .join(", ");

      // השהייה של 3 שניות לפני הצגת הזוכים
      setTimeout(() => {
        setResult(`The winners are: ${winnerDetails}`);
        setCrystalActive(false); // כיבוי האנימציה של כדור הבדולח
        setLoading(false);
      }, 3000);
    } catch (error) {
      setResult("An error occurred. Please try again.");
      console.error("Error fetching documents:", error.message);
      setCrystalActive(false);
      setLoading(false);
    }
  };

  // אפקט כדור הבדולח
  React.useEffect(() => {
    if (crystalActive) {
      anime({
        targets: ".crystal-ball",
        scale: [1, 1.2, 1],
        opacity: [0.5, 1],
        duration: 1000,
        easing: "easeInOutSine",
        loop: true,
      });
    } else {
      anime.remove(".crystal-ball");
    }
  }, [crystalActive]);

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
      <button onClick={handleLotteryClick} disabled={loading} style={styles.button}>
        {loading ? "Drawing..." : "Start Lottery"}
      </button>
      <div style={styles.crystalBallContainer}>
        {crystalActive && <div className="crystal-ball" style={styles.crystalBall}></div>}
      </div>
      {result && <div style={styles.result}>{result}</div>}
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
    marginTop: "50px",
  },
  header: {
    fontSize: "2rem",
    marginBottom: "20px",
  },
  inputContainer: {
    marginBottom: "20px",
  },
  inputLabel: {
    fontSize: "1rem",
    marginBottom: "5px",
    display: "block",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    width: "100px",
    textAlign: "center",
    marginBottom: "10px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    transition: "background-color 0.3s",
  },
  crystalBallContainer: {
    margin: "30px auto",
    width: "150px",
    height: "150px",
    position: "relative",
  },
  crystalBall: {
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%)",
    boxShadow: "0 0 30px rgba(63,94,251,0.6)",
    animation: "pulse 1s infinite",
  },
  result: {
    marginTop: "20px",
    fontSize: "1.2rem",
    color: "#333",
    fontWeight: "bold",
  },
};

export default LotteryPage;
