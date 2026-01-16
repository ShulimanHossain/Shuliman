// Scroll reveal animation
const sections = document.querySelectorAll('.section');

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
}, { threshold: 0.2 });

sections.forEach(section => observer.observe(section));

// View all projects button
document.getElementById('viewAllBtn').addEventListener('click', () => {
    document.querySelectorAll('.hidden').forEach(card => {
        card.style.display = 'block';
    });
    document.getElementById('viewAllBtn').style.display = 'none';
});
