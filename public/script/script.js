// fixing the bar nav 
const navBar = document.getElementById('bar');
const nav = document.querySelector('.nav_header');

navBar.addEventListener('click', () => {
    nav.classList.toggle('show');
    navBar.classList.toggle('active');
});

let page = 2; // Start from page 2 since page 1 is already loaded

document.getElementById("load-more").addEventListener("click", async function() {
    try {
        const response = await fetch(`/articles?page=${page}`, { headers: { "X-Requested-With": "XMLHttpRequest" } });
        const articles = await response.json();

        if (articles.length === 0) {
            document.getElementById("load-more").style.display = "none"; // Hide button when no more articles
            return;
        }

        const postList = document.getElementById("post-list");

        articles.forEach(article => {
            // Extract first image
            const imgMatch = article.body.match(/<img.*?src=["'](.*?)["']/);
            const firstImage = imgMatch ? imgMatch[1] : null;

            // Strip HTML tags and limit text preview
            const textOnly = article.body.replace(/<[^>]*>/g, "").substring(0, 100);

            let li = document.createElement("li");
            li.innerHTML = `
                ${firstImage ? `<img src="${firstImage}" alt="Article Image" class="article-preview-img">` : ""}
                <p>${textOnly}...</p>
                <span>${new Date(article.date).toDateString()}</span>
                <br>
                <a href="/article/${article._id}" class="read-more">Read More</a>
            `;
            postList.appendChild(li);
        });

        page++; // Move to the next page

    } catch (error) {
        console.error("Error loading articles:", error);
    }
});
//setting up carlosel for the index page
document.addEventListener("DOMContentLoaded", function () {
const items = document.querySelectorAll("ul#trending-list li");
let currentIndex = 0;

function showSlide(index) {
    items.forEach((item, i) => {
        item.classList.remove("active");
        if (i === index) {
            item.classList.add("active");
        }
    });
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % items.length; // Loop back to the first item
    showSlide(currentIndex);
}

// Show first slide initially
showSlide(currentIndex);

// Auto-slide every 3 seconds
setInterval(nextSlide, 5000);
});

