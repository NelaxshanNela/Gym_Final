document.addEventListener('DOMContentLoaded', function () {
    const tableBody = document.querySelector('#membersTable tbody');
    // const searchBox = document.getElementById('searchBox');
    const searchButton = document.getElementById('searchButton');
    const addNewMemberButton = document.getElementById('addNewMember');
    const goHomeButton = document.getElementById('goHome');

    const allUsersData_apiUrl = 'http://localhost:5297/api/Member/Get-All-Members';
    const updateUser_URl = 'http://localhost:5297/api/Member/Update-Member/1';
    const getUser_By_Id = 'http://localhost:5297/api/Member/Get-Member-By-ID/1';
    const deleteMemberById_url = 'http://localhost:5297/api/Member/Delete-Member';
    const putMembers = "http://localhost:5297/api/Member/Update-Member";


    let Members = [];

    // Attach event listeners for edit and delete buttons
    document.querySelectorAll('.edit-button').forEach(button => {
        button.addEventListener('click', handleEdit);
    });
    document.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', handleDelete);
    });



    // Fetch Programs Data from Database and Render Them
    async function GetAllMembers() {
        try {
            const response = await fetch(allUsersData_apiUrl);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            Members = await response.json();

            console.log(Members.result);

            // Render programs in the table
            if (!tableBody) {
                console.error('Table body not found!');
                return;
            }

            tableBody.innerHTML = '';
            MembersArray = Members;
            MembersArray.forEach(member => {
                const row = document.createElement('tr');
                row.setAttribute('id', member.id); // Use program.id directly

                row.innerHTML = `
                    <td>${member.id}</td>
                    <td>${member.firstName}</td>
                    <td>${member.lastName}</td>
                    <td>${member.nic}</td>
                    <td>${member.age}</td>
                    <td>${member.height}</td>
                    <td>${member.weight}</td>
                    <td>${member.contactNumber}</td>
                    <td>${member.address}</td>
                    <td>${member.gender}</td>
                    <td>${member.membershiptype}</td>
                   
                    <td>
                        <button class="edit-button" id="openModal" style="background-color: #c9bfaf;" onClick="handleEdit(${member.id})" data-id="${member.id}">Edit</button>
                        <button  class="delete-button" style="background-color: #ed7272;" data-id="${member.id}">Delete</button>
                    </td>
                `;

                tableBody.appendChild(row);
            });
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    }
    GetAllMembers();

    tableBody.addEventListener('click', function (event) {
        if (event.target.classList.contains('edit-button')) {

            const modal = document.getElementById("programModal");
            modal.style.display = "block";

            const closeModalBtn = document.getElementsByClassName("close")[0];

            closeModalBtn.onclick = function () {
                modal.style.display = "none";
            };

            window.onclick = function (event) {
                if (event.target === modal) {
                    modal.style.display = "none";
                }
            };

            const programId = parseInt(event.target.dataset.id);
            const program = Members.find(p => p.id === programId);
            console.log(program);

            if (program) {
                document.getElementById('fname').value = program.firstName;
                document.getElementById('lname').value = program.lastName;
                document.getElementById('age').value = program.age;
                document.getElementById('phone').value = program.contactNumber;
                document.getElementById('email').value = program.email;
                document.getElementById('address').value = program.address;
                document.getElementById('height').value = program.height;
                document.getElementById('weight').value = program.weight;
                document.getElementById('dob').value = program.dob.split("T")[0];
                document.getElementById('fees').value = program.fee;
                document.getElementById('gender').value = program.gender;

                if (program.membershiptype == "Annual") {
                    document.getElementById("subscription").checked = true;
                } else {
                    document.getElementById("subscription").checked = false;
                }

                console.log(document.getElementById('fname').value);

            }

            let updateBtn = document.getElementById('updateBtn');
            updateBtn.replaceWith(updateBtn.cloneNode(true));

            updateBtn = document.getElementById('updateBtn');
            updateBtn.addEventListener('click', (event) => UpdateProgramFee(event, programId));
        }
    });

    async function UpdateProgramFee(event, programId) {
        event.preventDefault();
        console.log(programId);

        const fname = document.getElementById('fname').value;
        const lname = document.getElementById('lname').value;
        const age = Number(document.getElementById('age').value);
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;
        const address = document.getElementById('address').value;
        const height = Number(document.getElementById('height').value);
        const weight = Number(document.getElementById('weight').value);
        const subscription = document.getElementById('subscription').checked;
        const dob = document.getElementById('dob').value;
        const fee = Number(document.getElementById('fees').value);
        const gender = document.getElementById('gender').value;
        // console.log(subscription);
        let subVlue = '';
        if (subscription == true) {
            subVlue = "Annual"
        } else {
            subVlue = "Monthly"
        }

        const updatedProgramData = {
            firstName: fname,
            lastName: lname,
            age: age,
            contactNumber: phone,
            email: email,
            address: address,
            height: height,
            weight: weight,
            membershiptype: subVlue,
            dob: dob,
            fee: fee,
            gender: gender
        };

        const updateProgramById_url = "http://localhost:5297/api/Member/Update-Member";

        await fetch(`${updateProgramById_url}/${programId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedProgramData)
        })
            .then(data => {
                console.log('Success:', data);
                document.getElementById("programModal").style.display = "none";
            })
            .catch((error) => {
                console.error('Error:', error);
            });
            window.location.reload();
    }

    async function deleteMemberById(id) {
        console.log(id)
        const deleteMemberById_url = "http://localhost:5297/api/Member/Delete-Member";

        const response = await fetch(`${deleteMemberById_url}/${id}`, { method: 'DELETE' });
        if (response.ok) {
            console.log(response)
        }
    }

    // Delete button click event
    tableBody.addEventListener('click', function (event) {
        if (event.target.classList.contains('delete-button')) {
            const memberId = parseInt(event.target.dataset.id);
            console.log(event.target)
            const confirmed = confirm('Are you sure you want to delete this program?');

            if (confirmed) {

                try {

                    deleteMemberById(memberId)
                    let removerow = document.getElementById(memberId);
                    alert('Member deleted successfully!');
                    window.location.reload();

                } catch (error) {
                    alert('Member not found!');
                }
            }
        }
        if (event.target.classList.contains('edit-button')) {
            const memberId = parseInt(event.target.dataset.id);
            handleEdit(memberId)
        }
    });

    function handleEdit(id) {
        const gymId = id.target.dataset.id;
        fetchData().then(allUsersData => {
            const user = allUsersData.find(u => u.gymId == gymId);
            if (user) {
                window.location.href = 'Updatemember.html';
            }
        });
    }

    function handleAddNewMember() {
        window.location.href = 'Addnewmember.html';
    }

    if (searchButton) {
        searchButton.addEventListener('click', handleSearch);
    }

    if (addNewMemberButton) {
        addNewMemberButton.addEventListener('click', handleAddNewMember);
    }

    if (goHomeButton) {
        goHomeButton.addEventListener('click', function () {
            window.location.href = 'Adminhome.html';
        });
    }

    // renderTable(); // Call to render the table with fetched data
});
function searchMembers() {
    const searchTerm = document.getElementById('searchBar').value.toLowerCase();
    const rows = document.querySelectorAll('#membersTable tbody tr');

    rows.forEach(row => {
        const memberName = row.querySelector('td:nth-child(2)').innerText.toLowerCase();
        const memberId = row.querySelector('td:nth-child(1)').innerText.toLowerCase();
        if (memberName.includes(searchTerm) || memberId.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}