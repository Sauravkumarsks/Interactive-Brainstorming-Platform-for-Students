// Store ideas and app state in localStorage
let ideas = JSON.parse(localStorage.getItem('ideas')) || [];
let currentFilter = 'all';
let currentView = 'cards';
let isDarkMode = localStorage.getItem('darkMode') === 'true';
let isPanelVisible = true; // Track panel visibility

// DOM Elements
const ideaInput = document.getElementById('ideaInput');
const categorySelect = document.getElementById('categorySelect');
const tagInput = document.getElementById('tagInput');
const tagsContainer = document.getElementById('tagsContainer');
const addIdeaBtn = document.getElementById('addIdeaBtn');
const ideasContainer = document.getElementById('ideasContainer');
const mindmapContainer = document.getElementById('mindmapContainer');
const filterBtns = document.querySelectorAll('.filter-btn');
const viewBtns = document.querySelectorAll('.view-btn');
const sortSelect = document.getElementById('sortSelect');
const themeToggle = document.querySelector('.theme-toggle');
const emojiPicker = document.getElementById('emojiPicker');
const chatInput = document.getElementById('chatInput');
const chatMessages = document.getElementById('chatMessages');
const sendChatBtn = document.getElementById('sendChat');
const activityList = document.getElementById('activityList');
const onlineCount = document.getElementById('onlineCount');
const collaboratorsList = document.getElementById('collaboratorsList');
const collaborationPanel = document.querySelector('.collaboration-panel');

// Initialize theme
if (isDarkMode) {
    document.body.classList.add('dark-theme');
}

// Mock collaborators data (in a real app, this would come from a backend)
const mockCollaborators = [
    { name: 'John D.', status: 'active', avatar: 'J' },
    { name: 'Sarah M.', status: 'active', avatar: 'S' },
    { name: 'Mike R.', status: 'idle', avatar: 'M' }
];

// Inspirational quotes
const quotes = [
    "Innovation is seeing what everybody has seen and thinking what nobody has thought.",
    "Creativity is intelligence having fun.",
    "The best way to predict the future is to create it.",
    "Every great idea starts with a simple thought."
];

// Update quote periodically
function updateQuote() {
    const quoteElement = document.getElementById('quote');
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    quoteElement.textContent = `"${randomQuote}"`;
}
setInterval(updateQuote, 10000);

// Tags management
let currentTags = [];

function addTag(tag) {
    if (tag && !currentTags.includes(tag)) {
        currentTags.push(tag);
        renderTags();
    }
    tagInput.value = '';
}

function removeTag(tag) {
    currentTags = currentTags.filter(t => t !== tag);
    renderTags();
}

function renderTags() {
    tagsContainer.innerHTML = currentTags.map(tag => `
        <span class="tag">
            #${tag}
            <i class="fas fa-times" onclick="removeTag('${tag}')"></i>
        </span>
    `).join('');
}

// Add new idea
function addIdea() {
    const text = ideaInput.value.trim();
    const category = categorySelect.value;
    
    if (text) {
        const idea = {
            id: Date.now(),
            text,
            category,
            tags: [...currentTags],
            likes: 0,
            comments: [],
            timestamp: new Date().toISOString()
        };
        
        ideas.unshift(idea);
        saveIdeas();
        ideaInput.value = '';
        currentTags = [];
        renderTags();
        renderIdeas();
        addActivity(`New idea added in ${category}`);
    }
}

// Save ideas to localStorage
function saveIdeas() {
    localStorage.setItem('ideas', JSON.stringify(ideas));
}

// Sort ideas
function sortIdeas(ideasToSort) {
    const sortType = sortSelect.value;
    
    switch (sortType) {
        case 'popular':
            return ideasToSort.sort((a, b) => b.likes - a.likes);
        case 'trending':
            return ideasToSort.sort((a, b) => (b.likes + b.comments.length) - (a.likes + a.comments.length));
        default: // newest
            return ideasToSort.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }
}

// Render ideas based on current filter and view
function renderIdeas() {
    const filteredIdeas = currentFilter === 'all' 
        ? ideas 
        : ideas.filter(idea => idea.category === currentFilter);
    
    const sortedIdeas = sortIdeas(filteredIdeas);
    
    if (currentView === 'cards') {
        renderCardsView(sortedIdeas);
    } else {
        renderMindmapView(sortedIdeas);
    }
}

// Render cards view
function renderCardsView(ideasToRender) {
    ideasContainer.innerHTML = '';
    
    ideasToRender.forEach(idea => {
        const ideaCard = document.createElement('div');
        ideaCard.className = 'idea-card';
        
        const formattedDate = new Date(idea.timestamp).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
        
        ideaCard.innerHTML = `
            <span class="idea-category">${idea.category}</span>
            <h3>${idea.text}</h3>
            <div class="tags-list">
                ${idea.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
            </div>
            <p class="idea-date">${formattedDate}</p>
            <div class="idea-actions">
                <button class="action-btn like-btn ${idea.liked ? 'active' : ''}" data-id="${idea.id}">
                    <i class="fas fa-heart"></i> ${idea.likes}
                </button>
                <button class="action-btn comment-btn" data-id="${idea.id}">
                    <i class="fas fa-comment"></i> ${idea.comments.length}
                </button>
                <button class="action-btn delete-btn" data-id="${idea.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        ideasContainer.appendChild(ideaCard);
    });
}

// Render mindmap view
function renderMindmapView(ideasToRender) {
    const canvas = document.getElementById('mindmapCanvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = mindmapContainer.offsetWidth;
    canvas.height = mindmapContainer.offsetHeight;
    
    // Implementation of mindmap visualization would go here
    // This would involve drawing nodes and connections between related ideas
}

// Handle idea actions (like, comment, delete)
function handleIdeaAction(e) {
    if (!e.target.closest('.action-btn')) return;
    
    const btn = e.target.closest('.action-btn');
    const ideaId = parseInt(btn.dataset.id);
    const idea = ideas.find(idea => idea.id === ideaId);
    
    if (btn.classList.contains('like-btn')) {
        idea.likes++;
        idea.liked = true;
        btn.classList.add('active');
        addActivity(`Idea liked: ${idea.text.substring(0, 30)}...`);
    } else if (btn.classList.contains('comment-btn')) {
        const comment = prompt('Add a comment:');
        if (comment) {
            idea.comments.push({
                text: comment,
                timestamp: new Date().toISOString(),
                user: 'You'
            });
            addActivity(`New comment on: ${idea.text.substring(0, 30)}...`);
        }
    } else if (btn.classList.contains('delete-btn')) {
        if (confirm('Are you sure you want to delete this idea?')) {
            ideas = ideas.filter(i => i.id !== ideaId);
            addActivity(`Idea deleted`);
        }
    }
    
    saveIdeas();
    renderIdeas();
}

// Activity Feed
function addActivity(text) {
    const activityItem = document.createElement('div');
    activityItem.className = 'activity-item';
    activityItem.innerHTML = `
        <i class="fas fa-circle"></i>
        <span>${text}</span>
        <small>${new Date().toLocaleTimeString()}</small>
    `;
    activityList.insertBefore(activityItem, activityList.firstChild);
}

// Chat functionality
function sendChat() {
    const message = chatInput.value.trim();
    if (message) {
        const chatMessage = document.createElement('div');
        chatMessage.className = 'chat-message';
        chatMessage.innerHTML = `
            <strong>You:</strong> ${message}
            <small>${new Date().toLocaleTimeString()}</small>
        `;
        chatMessages.appendChild(chatMessage);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        chatInput.value = '';
    }
}

// Event Listeners
addIdeaBtn.addEventListener('click', addIdea);
ideaInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addIdea();
});

tagInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTag(e.target.value.trim());
    }
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.category;
        renderIdeas();
    });
});

viewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        viewBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentView = btn.dataset.view;
        
        if (currentView === 'cards') {
            ideasContainer.classList.add('active');
            mindmapContainer.classList.remove('active');
        } else {
            ideasContainer.classList.remove('active');
            mindmapContainer.classList.add('active');
        }
        
        renderIdeas();
    });
});

sortSelect.addEventListener('change', renderIdeas);

themeToggle.addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('darkMode', isDarkMode);
});

ideasContainer.addEventListener('click', handleIdeaAction);
sendChatBtn.addEventListener('click', sendChat);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendChat();
});

// Initialize
renderIdeas();
renderCollaborators();
updateQuote();

// Update online count periodically (mock)
setInterval(() => {
    onlineCount.textContent = Math.floor(Math.random() * 3) + mockCollaborators.length;
}, 5000);

// Function to toggle panel visibility
function togglePanel(show) {
    isPanelVisible = show;
    collaborationPanel.style.transform = show ? 'translateX(0)' : 'translateX(100%)';
}

// Handle clicks outside the panel
document.addEventListener('click', (e) => {
    const isClickInsidePanel = collaborationPanel.contains(e.target);
    if (!isClickInsidePanel && isPanelVisible) {
        togglePanel(false);
    }
});

// Prevent panel from closing when clicking inside it
collaborationPanel.addEventListener('click', (e) => {
    e.stopPropagation();
});

// Add hover functionality to show panel
document.addEventListener('mousemove', (e) => {
    const viewportWidth = window.innerWidth;
    const threshold = viewportWidth - 50; // 50px from the right edge

    if (e.clientX >= threshold && !isPanelVisible) {
        togglePanel(true);
    }
}); 
