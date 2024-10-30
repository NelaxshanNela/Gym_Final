document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.querySelector('.searchbar input');
    const searchButton = document.querySelector('.searchbtn img');
    const formContainer = document.getElementById('form-container');

    const getMemberById_url = "http://localhost:5297/api/Member/Get-Member-By-ID";

    const getAllMembers_url = "http://localhost:5297/api/Member/Get-All-Members";
    const getAllPrograms_url = "http://localhost:5297/api/Program/Get-All-Programs";
    const getPayments = "http://localhost:5297/api/Payment/Get-All-Payment";

    let allMembers = [];
    let Programs = [];
    let Payments = [];

    // Function to fetch all user data from an API
    async function fetchAllUsersData() {
        try {
            const response = await fetch(getAllMembers_url);
            if (!response.ok) {
                throw new Error('Failed to fetch member data');
            }
            allMembers = await response.json();
            getcount(allMembers)
            displayIncomeReportDetails(allMembers)
            // console.log(allMembers);
            return allMembers;
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            return [];
        }
    }

    // Function to fetch all program data from an API
    async function fetchAllProgramsData() {
        try {
            const response = await fetch(getAllPrograms_url);
            if (!response.ok) {
                throw new Error('Failed to fetch program data');
            }
            Programs = await response.json();
            return Programs;
        } catch (error) {
            console.error(error.message);
            return [];
        }
    }


    async function fetchAllEnrollmentData() {
        try {
            const response = await fetch(`http://localhost:5297/api/Entrollment/Get-All-Enrollment`);
            if (!response.ok) {
                throw new Error('Failed to fetch program data');
            }
            Enrollments = await response.json();
            // console.log(Enrollments);
            allPrograms(Enrollments)
            return Enrollments;
        } catch (error) {
            console.error(error.message);
            return [];
        }
    }


    async function fetchAllPayments() {
        try {
            const response = await fetch(getPayments);
            if (!response.ok) {
                throw new Error('Failed to fetch program data');
            }
            Payments = await response.json();
            return Payments;
        } catch (error) {
            console.error(error.message);
            return [];
        }
    }
    // Main function to load data and update HTML
    async function loadDataAndUpdateUI() {
        // Fetch the data
        await fetchAllUsersData();
        await fetchAllProgramsData();
        await fetchAllPayments();
        await fetchAllEnrollmentData();

        // Update the card numbers dynamically
        const dataCounts = {
            allUsersDataCount: allMembers.length,
            allProgramsDataCount: Programs.length,
            allPaymentsDataCount: Payments.length

        };

        // Update the HTML elements with counts
        document.querySelectorAll('.cardBox .card').forEach((card, index) => {
            const keys = ["allUsersDataCount", "allProgramsDataCount", "allPaymentsDataCount"];
            card.querySelector('.numbers').textContent = dataCounts[keys[index]];
        });
    }



    // Call the main function to load data and update the UI
    loadDataAndUpdateUI();

    function allPrograms(allProgramsData) {
        const programCounts = {};
        const programMapping = {
            1: 'Program One',
            2: 'Weight Lifitng',
            3: 'Gymnastic',
            4: 'Dumbell'
        };

        allProgramsData.forEach(enrollment => {
            const programName = programMapping[enrollment.programId];
            if (programName) {
                if (!programCounts[programName]) {
                    programCounts[programName] = 0;
                }
                programCounts[programName]++;
            }
        });

        const ctxPie = document.getElementById('programPieChart');
        if (ctxPie) {
            new Chart(ctxPie.getContext('2d'), {
                type: 'pie',
                data: {
                    labels: Object.keys(programCounts),
                    datasets: [{
                        label: 'Program Distribution',
                        data: Object.values(programCounts),
                        backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0'],
                    }]
                },
                options: {
                    responsive: true
                }
            });
        } else {
            console.error('Element with id "programPieChart" not found.');
        }
    }


    function getcount(allUsersData) {
        const genderCounts = {
            Male: allUsersData.filter(member => member.gender === 'male').length,
            Female: allUsersData.filter(member => member.gender === 'female').length
        };


        const ctxBar = document.getElementById('genderBarChart').getContext('2d');
        new Chart(ctxBar, {
            type: 'bar',
            data: {
                labels: ['Male', 'Female'],
                datasets: [{
                    label: 'Number of Members',
                    data: [genderCounts.Male, genderCounts.Female],
                    backgroundColor: ['#36A2EB', '#FF6384']
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }



    // Function to format date to YYYY-MM-DD
    function formatDate(date) {
        const dateObj = new Date(date);
        return dateObj.toISOString().split('T')[0];
    }

    // Function to calculate the "Valid Till" date
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

        return validTillDateObj.toISOString().split('T')[0]; // Return date in YYYY-MM-DD format
    }

    // Function to display member details in forms
    function displayMemberDetails(member) {
        // Fill personal details form
        document.getElementById('name').value = member.firstName + " " + member.lastName || '';
        document.getElementById('nic').value = member.nic || '';
        document.getElementById('address').value = member.address || '';
        document.getElementById('phone').value = member.contactNumber || '';
        document.getElementById('gender').value = member.gender || '';

        // Fill course details form
        // document.getElementById('programid').value = member.gymId || '';
        // document.getElementById('programs').value = member.training.join(', ') || '';

        // // Fill payment details form
        // const paymentType = member.annualFees ? 'Annual' : 'Monthly';
        // document.getElementById('paytype').value = paymentType;

        // const fee = member.annualFees || member.monthlyFees;
        // document.getElementById('fee').value = fee ? fee + ' rupees' : 'Not applicable';

        // // Convert timestamp to date format
        // const paidDate = formatDate(member.date);
        // document.getElementById('joindate').value = paidDate;

        // // Calculate and set Paid Date and Valid Till
        // document.getElementById('lastpaid').value = paidDate;
        // document.getElementById('validtill').value = calculateValidTill(member.date, paymentType);
    }

    function displayIncomeReportDetails(members) {
        let totalFees = 0;
        let annualtrainee=0;
        let monthlypaytrainee=0;
        members.forEach(member => {
            totalFees += member.fee;

        });

        members.forEach(member=>{
            if(member.membershiptype=="Annual")
            {
                annualtrainee+=member.fee;
            }else if(member.membershiptype=="Monthly")
            {
                    monthlypaytrainee+=member.fee;
            }

        });
        console.log(members);
        
       
        
        
        document.getElementById("totalincome").value=`Rs . ${totalFees}`;
        document.getElementById("annualpaytrainee").value=`Rs . ${annualtrainee}`;
        document.getElementById("monthlypaytrainee").value=`Rs . ${monthlypaytrainee}`;


    }



    // Function to search member by ID
    async function searchMemberById(id) {
        try {
            // Fetch data from the API
            const response = await fetch(getAllMembers_url);
            if (!response.ok) {
                throw new Error(`Failed to fetch member data: ${response.status} ${response.statusText}`);
            }

            // Parse the JSON data
            const allUsersData = await response.json();
            console.log("Fetched data:", allUsersData);

            // Verify if allUsersData is an array
            if (!Array.isArray(allUsersData)) {
                throw new Error("Fetched data is not an array");
            }

            // Find the member by gymId
            const member = allUsersData.find(user => user.id === parseInt(id));
            console.log("Member found:", member);

            // Display the member's details or show a "not found" message
            if (member) {
                const response1 = await fetch(`http://localhost:5297/api/Entrollment/Get-Entrolled-Programs-By-MemberId/${id}`);


                displayMemberDetails(member);
            } else {
                formContainer.innerHTML = `<p>No member found with Gym ID: ${id}</p>`;
            }
        } catch (error) {
            console.error("Error retrieving data:", error);
            formContainer.innerHTML = `<p>Error retrieving member data.</p>`;
        }
    }



    // Event listener for the search button
    searchButton.addEventListener('click', function () {
        const searchId = searchInput.value.trim();
        if (searchId) {
            searchMemberById(searchId);
        } else {
            formContainer.innerHTML = '<p>Please enter a Gym ID to search.</p>';
        }
    });

    // Optionally, add an event listener for pressing Enter in the search input
    searchInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            searchButton.click();
        }
    });
});
