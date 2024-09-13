async function checkCoolness() {
    const bio = document.getElementById('bioInput').value;
    const resultDiv = document.getElementById('result');
    resultDiv.style.display = 'block'; 
    resultDiv.innerHTML = 'Checking...';

    if (!bio) {
        resultDiv.innerHTML = 'Please enter a bio.';
        return;
    }

    try {
        const response = await fetch('https://howcoolami-lol.onrender.com/coolness', {
            method: 'POST', 
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
