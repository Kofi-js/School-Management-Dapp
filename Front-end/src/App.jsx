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
    <div className="min-h-screen bg-gray-50 p-8">
  <div className="max-w-4xl mx-auto space-y-8">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-blue-600 mb-2">School System</h1>
      <p className="text-gray-500">Manage your students efficiently</p>
    </div>

    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">Register a Student</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Student Name"
          value={newStudentName}
          onChange={(e) => setNewStudentName(e.target.value)}
          className="border border-gray-300 p-2 rounded-md"
        />
        <input
          type="number"
          placeholder="Student ID"
          value={newStudentId}
          onChange={(e) => setNewStudentId(e.target.value)}
          className="border border-gray-300 p-2 rounded-md"
        />
        <div className="md:col-span-2">
          <button onClick={registerStudent} className="bg-blue-600 text-white p-2 rounded-md w-full hover:bg-blue-700">
            Register Student
          </button>
        </div>
      </div>
    </div>

    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">Get Student Name</h2>
      <div className="space-y-4">
        <div className="flex gap-4">
          <input
            type="number"
            placeholder="Enter student ID"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="border border-gray-300 p-2 rounded-md flex-1"
          />
          <button onClick={getStudentNameById} className="bg-blue-600 text-white p-2 rounded-md whitespace-nowrap hover:bg-blue-700">
            Get Name
          </button>
        </div>
        {studentNameById && (
          <p className="text-gray-700 bg-blue-100 p-4 rounded-lg">
            Student Name: {studentNameById}
          </p>
        )}
      </div>
    </div>

    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">All Students</h2>
      <button onClick={retrieve} className="bg-blue-600 text-white p-2 rounded-md w-full mb-6 hover:bg-blue-700">
        Retrieve Students
      </button>
      {students.length > 0 && (
        <div className="bg-blue-100 rounded-lg p-4">
          <ul className="divide-y divide-gray-200">
            {students.map((student, index) => (
              <li key={index} className="py-3 flex justify-between items-center">
                <span className="text-gray-700">{student.name}</span>
                <span className="text-gray-500 text-sm">ID: {student.id}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>

    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">Remove Student</h2>
      <div className="flex gap-4">
        <input
          type="number"
          placeholder="Enter student ID to remove"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          className="border border-gray-300 p-2 rounded-md flex-1"
        />
        <button onClick={removeStudent} className="bg-red-600 text-white p-2 rounded-md whitespace-nowrap hover:bg-red-700">
          Remove Student
        </button>
      </div>
    </div>
    <ToastContainer position="bottom-right" theme="colored"/>
  </div>
</div>

  )
}

export default App
