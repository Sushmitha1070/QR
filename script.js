document.getElementById('qrForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const url = document.getElementById('urlInput').value.trim();
    if (url !== '') {
        try {
            const response = await fetch(`/generate-qr?url=${encodeURIComponent(url)}`);
            if (!response.ok) {
                throw new Error('Failed to generate QR code');
            }
            const qrCodeBase64 = await response.text();
            displayQRCode(qrCodeBase64);
            fetchAndDisplayUrls();
        } catch (error) {
            console.error('Error generating QR code:', error);
        }
    }
});

async function fetchAndDisplayUrls() {
    try {
        const response = await fetch('/urls');
        if (!response.ok) {
            throw new Error('Failed to fetch URLs');
        }
        const data = await response.json();
        displayUrls(data.urls);
    } catch (error) {
        console.error('Error fetching URLs:', error);
    }
}

function displayQRCode(base64String) {
    const qrCodeImg = document.createElement('img');
    qrCodeImg.src = `data:image/png;base64,${base64String}`;
    qrCodeImg.alt = 'QR Code';
    document.getElementById('qrCodeContainer').innerHTML = '';
    document.getElementById('qrCodeContainer').appendChild(qrCodeImg);
}

function displayUrls(urls) {
    const urlsList = document.getElementById('urlsList');
    urlsList.innerHTML = '';
    urls.forEach(url => {
        const li = document.createElement('li');
        li.textContent = url;
        urlsList.appendChild(li);
    });
}

// Initial fetch and display of URLs
fetchAndDisplayUrls();
