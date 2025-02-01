import { ethers } from 'ethers'
import abi from './abi.json'
import { useState } from 'react'


function App() {

  const contractAddress = '0xf5c199A8a6f4F3de325bc1b019AD6F347551CE50'
  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState('');
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentId, setNewStudentId] = useState('');
  const [studentNameById, setStudentNameById] = useState('');


     // Request wallet connection
     async function requestAccounts() {
      try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
      } catch (err) {
          console.log("Failed to connect wallet", err);
      }
  }

  // To Register Student
  async function registerStudent() {
      if (typeof window.ethereum !== 'undefined') {
          await requestAccounts(); // Ensure wallet is connected
  
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const contract = new ethers.Contract(contractAddress, abi, signer);
  
          try {
              const tx = await contract.registerStudent(newStudentName, newStudentId);
              await tx.wait();
              alert("Student Registered");
              setNewStudentName('');
              setNewStudentId('');
            } catch (err) {
              console.error("Error registering student:", err);
              alert("Error registering student");
            }
          } else {
            console.log("MetaMask is not installed.");
          }
  }
  
  // To Remove Student
  async function removeStudent() {
      if (typeof window.ethereum !== 'undefined') {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const contract = new ethers.Contract(contractAddress, abi, provider);
          
          try {
              const tx = await contract.removeStudent(studentId);
              await tx.wait();
              alert("Student Removed");
              setStudentId('');
            } catch (err) {
              console.error("Error removing student:", err);
              alert("Error removing student");
            }
          } else {
            console.log("MetaMask is not installed.");
          }
  }

  // Retrieve student name by ID
  const getStudentNameById = async () => {
      if (typeof window.ethereum !== 'undefined') {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const contract = new ethers.Contract(contractAddress, abi, provider);
      try {
        const name = await contract.getStudentName(studentId);
        setStudentNameById(name);
      } catch (err) {
        console.error("Error retrieving student name:", err);
        alert("Error retrieving student name");
      }
  };
}

  // Retrieve all students
  const retrieve = async () => {
      if (typeof window.ethereum !== 'undefined') {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const contract = new ethers.Contract(contractAddress, abi, provider);
      try {
        const studentsList = await contract.retrieve();
        setStudents(studentsList);
      } catch (err) {
        console.error("Error retrieving students:", err);
        alert("Error retrieving students");
      }
  };
}

  return (
    <div>
    <h1>School System</h1>

    <div>
      <h2>Register a Student</h2>
      <input
        type="text"
        placeholder="Student Name"
        value={newStudentName}
        onChange={(e) => setNewStudentName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Student ID"
        value={newStudentId}
        onChange={(e) => setNewStudentId(e.target.value)}
      />
      <button onClick={registerStudent}>Register</button>
    </div>

    <div>
      <h2>Get Student Name</h2>
      <input
        type="number"
        placeholder="Enter student ID"
        value={studentId}
        onChange={(e) => setStudentId(e.target.value)}
      />
      <button onClick={getStudentNameById}>Get Name</button>
      <p>{studentNameById ? `Student Name: ${studentNameById}` : null}</p>
    </div>

    <div>
      <h2>Retrieve All Students</h2>
      <button onClick={retrieve}>Retrieve Students</button>
      <ul>
        {students.map((student, index) => (
          <li key={index}>{student.name} (ID: {student.id})</li>
        ))}
      </ul>
    </div>

    <div>
      <h2>Remove a Student</h2>
      <input
        type="number"
        placeholder="Enter student ID to remove"
        value={studentId}
        onChange={(e) => setStudentId(e.target.value)}
      />
      <button onClick={removeStudent}>Remove Student</button>
    </div>
  </div>
  )
}

export default App
