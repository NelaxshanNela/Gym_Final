const addProgram_url = "http://localhost:5297/api/Program/Add-program";

document.getElementById('programregistrationForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const name = document.getElementById('pname').value;
    const fee = document.getElementById('fees').value;
    const type = document.querySelector('input[name="type"]:checked').value;

    const programData = {

        programName: name,
        type: type,
        totalFee: fee
    };

    try {
        const response = await fetch(addProgram_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(programData)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        var id;
        const result = await response.json().then((data) => {
            console.log(data)
            id = data.id
        });
        console.log(result)
        alert(+programData.programName + "Created" + "It ID :" + id);

    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }

    document.getElementById('programregistrationForm').reset();

    // window.location.href = 'Programmanagement.html';
});

document.getElementById('goHome').addEventListener('click', function () {
    window.location.href = 'Adminhome.html';
});


