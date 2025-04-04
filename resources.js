document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const searchInput = document.getElementById('searchInput');
    const typeFilter = document.getElementById('typeFilter');
    const categoryFilter = document.getElementById('categoryFilter');
    const resourceCards = document.querySelectorAll('.resource-card');
    const contributeBtn = document.getElementById('contributeBtn');
    const submitModal = document.getElementById('submitModal');
    const successModal = document.getElementById('successModal');
    const resourceForm = document.getElementById('resourceForm');
    const closeButtons = document.querySelectorAll('.close-modal');
    const cancelSubmit = document.getElementById('cancelSubmit');
    const closeSuccess = document.getElementById('closeSuccess');

    // Search and filter functionality
    function filterResources() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedType = typeFilter.value;
        const selectedCategory = categoryFilter.value;

        resourceCards.forEach(card => {
            const cardTitle = card.querySelector('h3').textContent.toLowerCase();
            const cardDescription = card.querySelector('p').textContent.toLowerCase();
            const cardType = card.dataset.type;
            const cardCategory = card.closest('.category').dataset.category;

            const matchesSearch = cardTitle.includes(searchTerm) || cardDescription.includes(searchTerm);
            const matchesType = selectedType === 'all' || cardType === selectedType;
            const matchesCategory = selectedCategory === 'all' || cardCategory === selectedCategory;

            if (matchesSearch && matchesType && matchesCategory) {
                card.style.display = 'block';
                // Add fade in animation
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 50);
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Modal Functions
    function openModal(modal) {
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    }

    function closeModal(modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }

    function closeAllModals() {
        [submitModal, successModal].forEach(modal => {
            closeModal(modal);
        });
    }

    // Form Submission Handler
    function handleFormSubmit(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(resourceForm);
        const resourceData = Object.fromEntries(formData.entries());

        // Here you would typically send the data to your backend
        console.log('Resource Submitted:', resourceData);

        // Close submit modal and show success modal
        closeModal(submitModal);
        setTimeout(() => {
            openModal(successModal);
        }, 300);

        // Reset form
        resourceForm.reset();
    }

    // Event listeners
    searchInput.addEventListener('input', filterResources);
    typeFilter.addEventListener('change', filterResources);
    categoryFilter.addEventListener('change', filterResources);

    contributeBtn.addEventListener('click', () => {
        openModal(submitModal);
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            closeAllModals();
        });
    });

    cancelSubmit.addEventListener('click', () => {
        closeModal(submitModal);
    });

    closeSuccess.addEventListener('click', () => {
        closeModal(successModal);
    });

    resourceForm.addEventListener('submit', handleFormSubmit);

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === submitModal || e.target === successModal) {
            closeAllModals();
        }
    });

    // Escape key closes modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });

    // Form validation feedback
    const formInputs = resourceForm.querySelectorAll('input, textarea, select');
    formInputs.forEach(input => {
        input.addEventListener('blur', () => {
            if (input.value.trim() === '') {
                input.classList.add('invalid');
            } else {
                input.classList.remove('invalid');
            }
        });
    });

    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    // Observe all resource cards for scroll animations
    document.querySelectorAll('.category').forEach(category => {
        category.style.opacity = '0';
        category.style.transform = 'translateY(20px)';
        category.style.transition = 'all 0.6s ease-out';
        observer.observe(category);
    });

    // Add hover effect for resource cards
    resourceCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        });
    });

    // Dynamic "New" tag removal after 7 days
    document.querySelectorAll('.new-tag').forEach(tag => {
        // Simulate checking if the resource is newer than 7 days
        const isNew = Math.random() > 0.5; // This is just for demonstration
        if (!isNew) {
            tag.style.display = 'none';
        }
    });
}); 
