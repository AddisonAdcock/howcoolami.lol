async function checkCoolness() {
    const bio = document.getElementById('bioInput').value;
    const resultDiv = document.getElementById('result');
    resultDiv.style.display = 'block'; // Show the result div
    resultDiv.innerHTML = 'Checking...';

    if (!bio) {
        resultDiv.innerHTML = 'Please enter a bio.';
        return;
    }

    try {
        const response = await fetch('/coolness', {
            method: 'POST', // Ensure the correct HTTP method is POST
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ bio }),
        });
        const data = await response.json();

        if (data.error) {
            resultDiv.innerHTML = 'Error: ' + data.error;
        } else {
            resultDiv.innerHTML = `Your coolness score is <strong>${data.coolness}%</strong>`;
        }
    } catch (error) {
        resultDiv.innerHTML = 'There was an error contacting the server.';
    }
}
