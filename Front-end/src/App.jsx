import { ethers } from 'ethers'
import abi from './abi.json'
import { useState } from 'react'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


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
          toast.error("Failed to connect wallet");
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
              toast.error("Error registering student");
            }
          } else {
            console.log("MetaMask is not installed.");
            toast.error("MetaMask is not installed.");
          }
  }
  
  // To Remove Student
  async function removeStudent() {
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);
          
          try {
              const tx = await contract.removeStudent(studentId);
              await tx.wait();
              alert("Student Removed");
              setStudentId('');
            } catch (err) {
              console.error("Error removing student:", err);
              toast.error("Error removing student");
            }
          } else {
            console.log("MetaMask is not installed.");
            toast.error("MetaMask is not installed.");
          }
  }

  // Retrieve student name by ID
  async function getStudentNameById () {
      if (typeof window.ethereum !== 'undefined') {
        await requestAccounts(); // Ensure wallet is connected
          const provider = new ethers.BrowserProvider(window.ethereum);
          const contract = new ethers.Contract(contractAddress, abi, provider);
      try {
        const name = await contract.getStudentName(studentId);
        setStudentNameById(name);
      } catch (err) {
        console.error("Error retrieving student name:", err);
        toast.error("Error retrieving student name");
      }
  };
}

  // Retrieve all students
  async function retrieve () {
      if (typeof window.ethereum !== 'undefined') {
        await requestAccounts(); // Ensure wallet is connected
          const provider = new ethers.BrowserProvider(window.ethereum);
          const contract = new ethers.Contract(contractAddress, abi, provider);
      try {
        const students = await contract.retrieve();
        const parsedStudents = students.map(student => ({
          name: student.name,
          id: student.id.toString()
        }));
        setStudents(parsedStudents);
      } catch (err) {
        console.error("Error retrieving students:", err);
        toast.error("Error retrieving students");
      }
  };
}

  return (
    <div className="bg-gray-100 min-h-screen p-8">
    <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">School System</h1>
  
    <div className="mb-6 bg-white p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Register a Student</h2>
      <div className="flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Student Name"
          value={newStudentName}
          onChange={(e) => setNewStudentName(e.target.value)}
          className="border border-gray-300 rounded p-2 w-full md:w-1/2"
        />
        <input
          type="number"
          placeholder="Student ID"
          value={newStudentId}
          onChange={(e) => setNewStudentId(e.target.value)}
          className="border border-gray-300 rounded p-2 w-full md:w-1/2"
        />
        <button 
          onClick={registerStudent}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full md:w-auto"
        >
          Register
        </button>
      </div>
    </div>
  
    <div className="mb-6 bg-white p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Get Student Name</h2>
      <div className="flex flex-wrap gap-4">
        <input
          type="number"
          placeholder="Enter student ID"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          className="border border-gray-300 rounded p-2 w-full md:w-1/2"
        />
        <button 
          onClick={getStudentNameById}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full md:w-auto"
        >
          Get Name
        </button>
      </div>
      <p className="mt-4 text-gray-700">{studentNameById ? `Student Name: ${studentNameById}` : null}</p>
    </div>
  
    <div className="mb-6 bg-white p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Retrieve All Students</h2>
      <button 
        onClick={retrieve}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        Retrieve Students
      </button>
      <ul className="list-disc pl-5">
        {students.map((student, index) => (
          <li key={index} className="text-gray-700 mb-1">{student.name} (ID: {student.id})</li>
        ))}
      </ul>
    </div>
  
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Remove a Student</h2>
      <div className="flex flex-wrap gap-4">
        <input
          type="number"
          placeholder="Enter student ID to remove"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          className="border border-gray-300 rounded p-2 w-full md:w-1/2"
        />
        <button 
          onClick={removeStudent}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full md:w-auto"
        >
          Remove Student
        </button>
      </div>
    </div>
    <ToastContainer />
  </div>
  )
}

export default App
