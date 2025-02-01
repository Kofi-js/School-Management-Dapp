// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SchoolSystem {
    address public admin;

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    struct Student {
        string name;
        uint256 id;
    }

    Student [] public students;

    mapping (uint256 id => string name) internal studentById;


    function registerStudent(string memory _name, uint256 _id) public onlyAdmin  {
        students.push(Student(_name, _id));
        studentById[_id] = _name;
        
    }

    function retrieve() public view returns(Student[] memory) {
        return students;
        
    }

    function getStudentName(uint256 _id) public view returns (string memory) {
        return studentById[_id];
    }

    function removeStudent(uint256 _id) external onlyAdmin {
        //first check if the student exist
        uint256 indexToRemove;
        for (uint256 i = 0; i < students.length; i++) {
            if (students[i].id == _id) {
                indexToRemove = i;
                break;
            }
        }
        // Move the last element to the position we want to remove
        students[indexToRemove] = students[students.length - 1];
        // Remove the last element
        students.pop();
        // Remove from mapping
        delete studentById[_id];
    }
}