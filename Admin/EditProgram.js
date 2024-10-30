const GetAllProgramsURL = "http://localhost:3000/allProgramsData";

const AddNewProgramURL = "http://localhost:3000/allProgramsData";
const UpdateProgramURL = "http://localhost:3000/allProgramsData";
const DeleteProgramURL = "http://localhost:3000/allProgramsData";


document.addEventListener('DOMContentLoaded', function() {
    const programId = GetAllProgramsURL.getItem('editProgramId');
    console.log(programId);
    if (!programId) {
        alert('No program ID found for editing.');
        window.location.href = 'Programmanagement.html';
        return;
    }

    const allProgramsData = JSON.parse(localStorage.getItem('allProgramsData')) || [];
    const program = allProgramsData.find(p => p.programId == programId);

    // if (!program) {
    //     alert('Program not found.');
    //     window.location.href = 'Programmanagement.html';
    //     return;
    // }

    document.getElementById('name').value = program.name;
    document.getElementById('fees').value = program.fee;
    document.getElementById('type').value = program.type;

    document.getElementById('editProgramForm').addEventListener('submit', function(event) {
        event.preventDefault();

        program.name = document.getElementById('name').value;
        program.fee = document.getElementById('fees').value;
        program.type = document.getElementById('type').value;

        const updatedProgramsData = allProgramsData.map(p => p.programId == programId ? program : p);
        localStorage.setItem('allProgramsData', JSON.stringify(updatedProgramsData));

        alert('Program updated successfully!');
        window.location.href = 'Programmanagement.html';
    });

    document.getElementById('goHome').addEventListener('click', function() {
        window.location.href = 'Adminhome.html';
    });
});


