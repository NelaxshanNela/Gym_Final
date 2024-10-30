document.addEventListener('DOMContentLoaded', function () {
    const tableBody = document.querySelector('#entrollTable tbody');
    // const searchBox = document.getElementById('searchBox');
    const searchButton = document.getElementById('searchButton');
    const addNewMemberButton = document.getElementById('addNewMember');
    const goHomeButton = document.getElementById('goHome');

    const allUsersData_apiUrl = 'http://localhost:5297/api/Member/Get-All-Members';

    async function fetchUserData() {
        try {
            const response = await fetch(allUsersData_apiUrl);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            renderTable(data);
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            return [];
        }
    }

    fetchUserData()

    function renderTable(data) {

        if (data.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="10">No data found</td></tr>';
            return;
        }

        data.forEach(async user => {
            tableBody.innerHTML = '';
            const res = await fetch(`http://localhost:5297/api/Entrollment/Get-Entrolled-Programs-By-MemberId/${user.id}`);
            const Entrolls = await res.json();
            Entrolls.forEach(program => {

                const row = document.createElement('tr');

                row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.firstName + user.lastName}</td>
                <td>${program.id}</td>
                <td>${program.programName}</td>
                <td>${user.creationDate}</td>
            `;

                tableBody.appendChild(row);
            })
        });
    }


    if (goHomeButton) {
        goHomeButton.addEventListener('click', function () {
            window.location.href = 'Adminhome.html';
        });
    }
});
function searchMembers() {
    const searchTerm = document.getElementById('searchBar').value.toLowerCase();
    const rows = document.querySelectorAll('#entrollTable tbody tr');

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