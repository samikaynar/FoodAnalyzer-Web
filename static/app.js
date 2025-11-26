const productInput = document.getElementById("product-name");
const resultsSection = document.getElementById("results-section");
const resultsContainer = document.getElementById("results-container");
const searchBtn = document.getElementById("search-btn");

searchBtn.addEventListener("click", analyzeProduct);

productInput.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        analyzeProduct();
    }
});

async function analyzeProduct() {
    const productName = productInput.value.trim();
    
    if (productName.length < 2) {
        alert("Please enter at least 2 characters");
        return;
    }

    showLoading();
    
    try {
        const response = await fetch('/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                productName: productName
            })
        });

        const data = await response.json();
        
        if (response.ok) {
            showResult(productName, data.analysis);
        } else {
            showError(data.error || "Analysis failed");
        }
        
    } catch (err) {
        showError("Cannot connect to server. Please try again.");
    }
}

function showLoading() {
    resultsSection.style.display = "block";
    resultsContainer.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>Analyzing with AI...</p>
        </div>
    `;
}

function showResult(productName, aiResult) {
    const lines = aiResult.split('\n');
    let htmlContent = '';

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.length > 0) {
            if (line.match(/^\d+\)/)) {
                htmlContent += `<div class="ai-heading">${line}</div>`;
            } else if (line.toLowerCase().includes('score')) {
                htmlContent += `<div class="health-score">${line}</div>`;
            } else if (line.includes(':')) {
                htmlContent += `<div class="ai-heading">${line}</div>`;
            } else {
                htmlContent += `<p class="ai-text">${line}</p>`;
            }
        }
    }

    resultsContainer.innerHTML = `
        <div class="result-box">
            <h3 class="analysis-title">Health Analysis: ${productName}</h3>
            <div class="ai-response">
                ${htmlContent}
            </div>
        </div>
    `;
}

function showError(message) {
    resultsContainer.innerHTML = `
        <div class="error">
            <p>${message}</p>
        </div>
    `;
}