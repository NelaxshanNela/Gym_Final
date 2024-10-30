document.addEventListener('DOMContentLoaded', function () {
    const tableBody = document.querySelector('#feesTable tbody');
    const goHomeButton = document.getElementById('goHome');
    const closeModalButton = document.getElementById('closeModal');
    const confirmPaymentButton = document.getElementById('confirmPayment');
    const paymentModal = document.getElementById('paymentModal');
    const modalBackground = document.getElementById('modalBackground');
    const API_URL = 'http://localhost:5297/api/Member/Get-All-Members';

    goHomeButton.addEventListener('click', function () {
        window.location.href = 'Adminhome.html';
    });

    async function fetchUserData() {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            renderTable(data);
            return data;
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            return [];
        }
    }
    fetchUserData();

    function calculateValidTill(paidDate, paymentType) {
        const paidDateObj = new Date(paidDate);
        let validTillDateObj;

        if (paymentType === 'Annual') {
            validTillDateObj = new Date(paidDateObj.setFullYear(paidDateObj.getFullYear() + 1));
        } else if (paymentType === 'Monthly') {
            validTillDateObj = new Date(paidDateObj.setMonth(paidDateObj.getMonth() + 1));
        } else {
            return 'N/A';
        }

        return validTillDateObj.toISOString().split('T')[0];
    }

    function isExpired(validTill) {
        const today = new Date();
        const validTillDate = new Date(validTill);
        return today > validTillDate;
    }

    function renderTable(data) {
        tableBody.innerHTML = '';
        if (data.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="10">No data found</td></tr>';
            return;
        }

        data.forEach(async user => {
            const res = await fetch(`http://localhost:5297/api/Payment/Get-Payment-By-ID/${user.id}`);
            const paymentHistory = await res.json();
            const validTill = calculateValidTill(paymentHistory.paidDate, user.membershiptype);

            const row = document.createElement('tr');
            const isPayButtonRed = validTill !== 'N/A' && isExpired(validTill);
            const notifyButtonDisplay = isPayButtonRed ? 'inline-block' : 'none';

            row.innerHTML = `
                <td>${paymentHistory.id}</td>
                <td>${user.id}</td>
                <td>${user.firstName + " " + user.lastName}</td>
                <td>${user.membershiptype}</td>
                <td>${user.fee}</td>
                <td>${paymentHistory.paidDate}</td>
                <td>${validTill}</td>
                <td>
                    <button class="pays" data-id="${user.gymId}" style="background-color: ${isPayButtonRed ? 'red' : '#00FF00'};">Pay</button>
                    <button class="notify" data-id="${user.gymId}" style="display: ${notifyButtonDisplay};">Notify</button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        attachEventListeners();
    }

    function attachEventListeners() {
        document.querySelectorAll('.pays').forEach(button => {
            button.addEventListener('click', handlePay);
        });
        document.querySelectorAll('.notify').forEach(button => {
            button.addEventListener('click', handleNotify);
        });
    }

    async function handlePay(event) {
        const gymId = event.target.dataset.id;
        const allUsersData = await fetchUserData();
        const user = allUsersData.find(u => u.gymId == gymId);

        if (user) {
            document.getElementById('memberId').innerText = user.gymId;
            document.getElementById('memberName').innerText = `${user.firstName} ${user.lastName}`;
            document.getElementById('memberTraining').innerText = user.training.join(', ');
            document.getElementById('totalPayment').innerText = user.monthlyFees || user.annualFees;

            paymentModal.style.display = 'block'; // Open the modal
            modalBackground.style.display = 'block'; // Dim background
        }
    }

    closeModalButton.addEventListener('click', function () {
        paymentModal.style.display = 'none';
        modalBackground.style.display = 'none'; // Reset background
    });

    confirmPaymentButton.addEventListener('click', async function () {
        const gymId = document.getElementById('memberId').innerText;
        const allUsersData = await fetchUserData();
        const user = allUsersData.find(u => u.gymId == gymId);

        if (user) {
            user.date = new Date().toISOString();

            await fetch(`${API_URL}/${gymId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            });

            const payButton = document.querySelector(`.pays[data-id="${gymId}"]`);
            payButton.style.backgroundColor = '#00FF00';

            alert('Payment confirmed for ' + document.getElementById('memberName').innerText);
            paymentModal.style.display = 'none';
            modalBackground.style.display = 'none'; // Reset background

            renderTable(await fetchUserData());
        }
    });

    async function handleNotify(event) {
        const gymId = event.target.dataset.id;
        const allUsersData = await fetchUserData();
        const user = allUsersData.find(u => u.gymId == gymId);

        if (user) {
            const notificationMessage = `Reminder!!! ${user.gymId}: please pay`;
            console.log(notificationMessage);
            alert(`Notification sent to ${user.name} (Gym ID: ${user.gymId})`);
        }
    }
});

// Search function
function searchMembers() {
    const searchTerm = document.getElementById('searchBar').value.toLowerCase();
    const rows = document.querySelectorAll('#feesTable tbody tr');

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