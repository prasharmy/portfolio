const API_URL = 'http://localhost:5000/api';

// Load comments on page load
document.addEventListener('DOMContentLoaded', () => {
    loadComments();
    setupStarRating();
    setupCommentForm();
});

// Setup star rating interaction
function setupStarRating() {
    const stars = document.querySelectorAll('.star');
    const ratingInput = document.getElementById('comment-rating');

    stars.forEach(star => {
        star.addEventListener('click', () => {
            const value = star.getAttribute('data-value');
            ratingInput.value = value;
            updateStarDisplay(value);
        });

        star.addEventListener('mouseover', () => {
            const value = star.getAttribute('data-value');
            updateStarDisplay(value);
        });
    });

    // Reset on mouse leave
    document.querySelector('.star-rating').addEventListener('mouseleave', () => {
        updateStarDisplay(ratingInput.value);
    });
}

function updateStarDisplay(rating) {
    const stars = document.querySelectorAll('.star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

// Setup comment form submission
function setupCommentForm() {
    const form = document.getElementById('comment-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('comment-name').value;
        const email = document.getElementById('comment-email').value;
        const message = document.getElementById('comment-message').value;
        const rating = parseInt(document.getElementById('comment-rating').value);

        if (!rating || rating < 1) {
            alert('Please select a rating');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    message,
                    rating,
                }),
            });

            if (response.ok) {
                form.reset();
                document.getElementById('comment-rating').value = '0';
                updateStarDisplay(0);
                await loadComments();
                alert('Comment submitted successfully!');
            } else {
                alert('Error submitting comment');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error submitting comment. Make sure the server is running on http://localhost:5000');
        }
    });
}

// Load and display comments
async function loadComments() {
    const commentsList = document.getElementById('comments-list');

    try {
        // Fetch comments
        const commentsResponse = await fetch(`${API_URL}/comments`);
        const comments = await commentsResponse.json();

        // Fetch stats
        const statsResponse = await fetch(`${API_URL}/comments/count`);
        const stats = await statsResponse.json();

        // Update stats
        document.getElementById('total-comments').textContent = stats.count;
        document.getElementById('avg-rating').textContent = stats.avgRating;

        // Display comments
        if (comments.length === 0) {
            commentsList.innerHTML = '<p class="no-comments">No comments yet. Be the first to comment!</p>';
            return;
        }

        commentsList.innerHTML = comments
            .map(
                (comment) => `
            <div class="comment-card">
                <div class="comment-header">
                    <h4>${escapeHtml(comment.name)}</h4>
                    <div class="comment-rating">
                        ${getStarDisplay(comment.rating)}
                    </div>
                </div>
                <p class="comment-email">${escapeHtml(comment.email)}</p>
                <p class="comment-message">${escapeHtml(comment.message)}</p>
                <p class="comment-date">${formatDate(new Date(comment.createdAt))}</p>
            </div>
        `
            )
            .join('');
    } catch (error) {
        console.error('Error loading comments:', error);
        commentsList.innerHTML =
            '<p class="error">Error loading comments. Make sure the server is running on http://localhost:5000</p>';
    }
}

// Helper function to display stars
function getStarDisplay(rating) {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
}

// Helper function to format date
function formatDate(date) {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleDateString('en-US', options);
}

// Helper function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
