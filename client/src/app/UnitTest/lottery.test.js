import { expect } from "chai";
import sinon from 'sinon'; // Import sinon
import { JSDOM } from "jsdom";

// Mocked state variables and setState functions
let setLoading, setResult, setCrystalActive, setWinners;
let result, loading, crystalActive, winners;

const handleLotteryClick = async (numWinners) => {
  setLoading(true);
  setResult([]);  // Reset result
  setCrystalActive(true);

  try {
    const response = await fetch("https://bs-fse-2025-team9.onrender.com/documents");

    if (!response.ok) {
      throw new Error("Error fetching documents");
    }

    const documents = await response.json();

    if (documents.length === 0) {
      setResult([{ message: "No documents found." }]);
      setLoading(false);
      return;
    }

    if (numWinners > documents.length) {
      setResult([{ message: "Number of winners exceeds the total number of documents." }]);
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

    // Save winners as an array of objects
    setWinners(winners);

    // Display winner details
    const winnerDetails = winners.map((winner) => ({
      student_id: winner.student_id,
      first_name: winner.first_name,
      last_name: winner.last_name,
    }));

    setTimeout(() => {
      setResult(winnerDetails);
      setCrystalActive(false);
      setLoading(false);
    }, 3000);
  } catch (error) {
    setResult([{ message: "An error occurred. Please try again." }]);
    setCrystalActive(false);
    setLoading(false);
  }
};

const handleSendResults = async () => {
  // Map over the winners array and get their student IDs
  const winnerIds = winners.map((winner) => winner.student_id);

  try {
    const response = await fetch("https://bs-fse-2025-team9.onrender.com/documents/update-winners", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ winners: winnerIds }), // Send an array of student_ids
    });

    if (response.ok) {
      const data = await response.json();
      alert(`Winners updated successfully! ${data.updatedCount} documents updated.`);
    } else {
      const errorData = await response.json();
      alert(`Error: ${errorData.message}`);
    }
  } catch (error) {
    alert("An unexpected error occurred. Please try again later.");
  }
};

describe("handleLotteryClick", () => {
  beforeEach(() => {
    // Mocking the state setter functions
    setLoading = (value) => { loading = value; };
    setResult = (value) => { result = value; };
    setCrystalActive = (value) => { crystalActive = value; };
    setWinners = (value) => { winners = value; };

    // Mocking the global fetch function
    global.fetch = async () => ({
      ok: true,
      json: () => [
        { student_id: 1, first_name: "Alice", last_name: "Smith" },
        { student_id: 2, first_name: "Bob", last_name: "Johnson" },
      ],  // Simulate two documents
    });
  });

  it("should return an error if numWinners exceeds the number of documents", async () => {
    const numWinners = 3;
    await handleLotteryClick(numWinners);
    expect(result).to.deep.equal([{ message: "Number of winners exceeds the total number of documents." }]);
  });

  it("should proceed if numWinners is less than or equal to documents length", async () => {
    const numWinners = 1;
    await handleLotteryClick(numWinners);
    expect(result).to.not.deep.equal([{ message: "Number of winners exceeds the total number of documents." }]);
  });

  it("should return an error if the fetch request fails", async () => {
    global.fetch = async () => ({
      ok: false,
      json: () => ({ message: "Error fetching documents" }),
    });

    const numWinners = 1;
    await handleLotteryClick(numWinners);
    expect(result).to.deep.equal([{ message: "An error occurred. Please try again." }]);
  });

  it("should return 'No documents found' if no documents are retrieved", async () => {
    global.fetch = async () => ({
      ok: true,
      json: () => [],
    });

    const numWinners = 1;
    await handleLotteryClick(numWinners);
    expect(result).to.deep.equal([{ message: "No documents found." }]);
  });

  it("should correctly select winners when numWinners is valid", async () => {
    const numWinners = 1;
    await handleLotteryClick(numWinners);
  
    setTimeout(() => {
      expect(result).to.have.lengthOf(1);
      expect(result[0]).to.have.property("student_id");
      expect(result[0]).to.have.property("first_name");
      expect(result[0]).to.have.property("last_name");
    }, 3500);
  });
});

describe("handleSendResults", () => {
  beforeEach(() => {
    global.fetch = async () => ({
      ok: true,
      json: () => ({ updatedCount: 1 }),
    });
    winners = [
      { student_id: 1, first_name: "Alice", last_name: "Smith" },
      { student_id: 2, first_name: "Bob", last_name: "Johnson" },
    ];
    // Ensure alert is available in the global object
    global.alert = sinon.spy();
  });

  it("should send results to the server", async () => {
    await handleSendResults();
    expect(global.alert.calledWithMatch("Winners updated successfully!")).to.be.true;
  });

  it("should handle errors if the update fails", async () => {
    global.fetch = async () => ({
      ok: false,
      json: () => ({ message: "Error updating winners" }),
    });

    await handleSendResults();
    expect(global.alert.calledWithMatch("Error: Error updating winners")).to.be.true;
  });

  it("should successfully update winners and show success message", async () => {
    global.fetch = async () => ({
      ok: true,
      json: () => ({ updatedCount: 2 }), // Successful update, 2 documents updated
    });
  
    await handleSendResults();
    expect(global.alert.calledWithMatch("Winners updated successfully! 2 documents updated.")).to.be.true;
  });

  it("should handle network error when sending results", async () => {
    global.fetch = async () => {
     
    };
  
    await handleSendResults();
    expect(global.alert.calledWithMatch("An unexpected error occurred. Please try again later.")).to.be.true;
  });
  
  

  
  
  

 
});
