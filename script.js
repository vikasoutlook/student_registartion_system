document.addEventListener("DOMContentLoaded", loadStudents);

const form = document.getElementById("student-form");
const studentTable = document.querySelector("#student-table tbody");

form.addEventListener("submit", function (event) {
    event.preventDefault();
    const studentName = document.getElementById("student-name").value;
    const studentId = document.getElementById("student-id").value;
    const email = document.getElementById("email").value;
    const contactNo = document.getElementById("contact-no").value;

    if (!validateForm(studentName, studentId, email, contactNo)) {
        alert("Please fill in all fields correctly.");
        return;
    }

    if (!isUniqueId(studentId)) {
        alert("The Student ID must be unique. This ID already exists.");
        return;
    }

    const student = {
        studentName,
        studentId,
        email,
        contactNo,
    };

    addStudentToLocalStorage(student);
    loadStudents();
    form.reset();
});

function isUniqueId(studentId) {
    const students = getStudentsFromLocalStorage();
    return !students.some((student) => student.studentId === studentId);
}

function loadStudents() {
    const students = getStudentsFromLocalStorage();
    studentTable.innerHTML = "";
    if (!students.length) {
        studentTable.innerHTML =
            "<tr><td colspan='5'>No record found.</td></tr>";
    } else {
        students.forEach(addStudentToTable);
    }
}

function addStudentToTable(student) {
    const row = document.createElement("tr");
    row.id = `row-${student.studentId}`;
    row.innerHTML = `
        <td>${student.studentName}</td>
        <td>${student.studentId}</td>
        <td>${student.email}</td>
        <td>${student.contactNo}</td>
        <td>
            <button onclick="editStudent('${student.studentId}')">Edit</button>
            <button onclick="deleteStudent('${student.studentId}')">Delete</button>
        </td>
    `;
    studentTable.appendChild(row);
}

function addStudentToLocalStorage(student) {
    const students = getStudentsFromLocalStorage();
    students.push(student);
    localStorage.setItem("students", JSON.stringify(students));
}

function getStudentsFromLocalStorage() {
    return JSON.parse(localStorage.getItem("students")) || [];
}

function deleteStudent(studentId) {
    let students = getStudentsFromLocalStorage();
    students = students.filter((student) => student.studentId !== studentId);
    localStorage.setItem("students", JSON.stringify(students));
    const row = document.getElementById(`row-${studentId}`);
    row.remove();
}

function editStudent(studentId) {
    const students = getStudentsFromLocalStorage();
    const student = students.find((s) => s.studentId === studentId);
    if (student) {
        document.getElementById("student-name").value = student.studentName;
        document.getElementById("student-id").value = student.studentId;
        document.getElementById("email").value = student.email;
        document.getElementById("contact-no").value = student.contactNo;
        deleteStudent(studentId);
    }
}

function validateForm(name, id, email, contactNo) {
    const namePattern = /^[A-Za-z\s]+$/;
    const idPattern = /^\d+$/;
    const contactPattern = /^[0-9]{10}$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return (
        namePattern.test(name) &&
        idPattern.test(id) &&
        contactPattern.test(contactNo) &&
        emailPattern.test(email)
    );
}
