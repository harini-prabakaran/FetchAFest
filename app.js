// ==================== STATE MANAGEMENT ====================
const state = {
    user: null,
    currentScreen: 'onboarding',
    events: [],
    registrations: [],
    darkMode: false,
    onboardingStep: 1,
    selectedCollege: null,
    selectedInterests: [],
    selectedEventId: null,
    editingProfile: false
};

// ==================== DATA ====================
const COLLEGES = [
    { id: '1', name: 'IIT Delhi', city: 'Delhi', state: 'Delhi' },
    { id: '2', name: 'IIT Bombay', city: 'Mumbai', state: 'Maharashtra' },
    { id: '3', name: 'BITS Pilani', city: 'Pilani', state: 'Rajasthan' },
    { id: '4', name: 'NIT Trichy', city: 'Tiruchirappalli', state: 'Tamil Nadu' },
    { id: '5', name: 'IIIT Hyderabad', city: 'Hyderabad', state: 'Telangana' },
    { id: '6', name: 'IIT Madras', city: 'Chennai', state: 'Tamil Nadu' },
    { id: '7', name: 'BITS Goa', city: 'Goa', state: 'Goa' },
    { id: '8', name: 'NIT Karnataka', city: 'Surathkal', state: 'Karnataka' }
];

const INTERESTS = [
    { value: 'Tech', label: 'Tech', icon: 'fa-code' },
    { value: 'Cultural', label: 'Cultural', icon: 'fa-music' },
    { value: 'Sports', label: 'Sports', icon: 'fa-trophy' },
    { value: 'Workshops', label: 'Workshops', icon: 'fa-lightbulb' }
];

const MOCK_EVENTS = [
    {
        id: '1',
        title: 'TechFest 2026',
        college: 'IIT Delhi',
        category: 'Tech',
        date: '2026-02-15',
        time: '10:00 AM',
        venue: 'Main Auditorium',
        organizer: 'Tech Club IIT Delhi',
        seatsLeft: 250,
        totalSeats: 500,
        poster: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
        description: 'Join us for the biggest tech festival of the year! Experience cutting-edge technology, attend workshops, and network with industry leaders.',
        price: 0,
        ticketTypes: [{ type: 'Free', price: 0, available: 250 }]
    },
    {
        id: '2',
        title: 'Cultural Night',
        college: 'BITS Pilani',
        category: 'Cultural',
        date: '2026-02-20',
        time: '6:00 PM',
        venue: 'Open Air Theatre',
        organizer: 'Cultural Committee',
        seatsLeft: 100,
        totalSeats: 300,
        poster: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',
        description: 'An evening of music, dance and entertainment. Featuring performances by renowned artists and student groups.',
        price: 199,
        ticketTypes: [
            { type: 'Basic', price: 199, available: 100 },
            { type: 'Premium', price: 399, available: 50 }
        ]
    },
    {
        id: '3',
        title: 'Inter-College Cricket',
        college: 'NIT Trichy',
        category: 'Sports',
        date: '2026-02-25',
        time: '9:00 AM',
        venue: 'Sports Complex',
        organizer: 'Sports Committee',
        seatsLeft: 500,
        totalSeats: 1000,
        poster: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800',
        description: 'Watch the best college cricket teams compete for the championship trophy.',
        price: 0,
        ticketTypes: [{ type: 'Free', price: 0, available: 500 }]
    },
    {
        id: '4',
        title: 'AI & ML Workshop',
        college: 'IIT Bombay',
        category: 'Workshops',
        date: '2026-03-01',
        time: '2:00 PM',
        venue: 'CS Department',
        organizer: 'AI Research Lab',
        seatsLeft: 30,
        totalSeats: 50,
        poster: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800',
        description: 'Hands-on workshop on the latest AI and Machine Learning technologies. Learn from industry experts.',
        price: 499,
        ticketTypes: [{ type: 'Basic', price: 499, available: 30 }]
    }
];

// Initialize events
state.events = [...MOCK_EVENTS];

// ==================== UTILITY FUNCTIONS ====================
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.getElementById('toast-container').appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
        day: 'numeric', 
        month: 'short',
        year: 'numeric'
    });
}

function generateQRCode(text) {
    // Simple QR code placeholder - in production, use a QR library
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`;
}

function saveToLocalStorage() {
    localStorage.setItem('appState', JSON.stringify({
        user: state.user,
        registrations: state.registrations,
        darkMode: state.darkMode,
        events: state.events
    }));
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem('appState');
    if (saved) {
        const data = JSON.parse(saved);
        state.user = data.user;
        state.registrations = data.registrations || [];
        state.darkMode = data.darkMode || false;
        if (data.events && data.events.length > 0) {
            state.events = data.events;
        }
        
        if (state.darkMode) {
            document.body.classList.add('dark-mode');
        }
    }
}

// ==================== NAVIGATION ====================
function navigate(screen) {
    state.currentScreen = screen;
    render();
    
    // Update bottom nav
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.screen === screen);
    });
    
    // Show/hide bottom nav
    const hideNavScreens = ['onboarding', 'event-detail', 'registration'];
    document.getElementById('bottom-nav').classList.toggle('hidden', hideNavScreens.includes(screen));
}

// ==================== RENDER FUNCTIONS ====================
function render() {
    const app = document.getElementById('app');
    
    switch(state.currentScreen) {
        case 'onboarding':
            app.innerHTML = renderOnboarding();
            break;
        case 'home':
            app.innerHTML = renderHome();
            break;
        case 'event-detail':
            app.innerHTML = renderEventDetail();
            break;
        case 'registration':
            app.innerHTML = renderRegistration();
            break;
        case 'tickets':
            app.innerHTML = renderMyEvents();
            break;
        case 'organizer':
            app.innerHTML = renderOrganizerDashboard();
            break;
        case 'profile':
            app.innerHTML = renderProfile();
            break;
        case 'edit-profile':
            app.innerHTML = renderEditProfile();
            break;
        case 'app-settings':
            app.innerHTML = renderAppSettings();
            break;
        case 'privacy-policy':
            app.innerHTML = renderPrivacyPolicy();
            break;
        case 'terms':
            app.innerHTML = renderTerms();
            break;
        case 'help':
            app.innerHTML = renderHelp();
            break;
    }
    
    // Show organizer nav if user is organizer
    if (state.user && state.user.isOrganizer) {
        document.getElementById('organizer-nav').style.display = 'flex';
    }
}

// ==================== ONBOARDING SCREENS ====================
function renderOnboarding() {
    const step = state.onboardingStep;
    
    return `
        <div class="onboarding">
            <div class="onboarding-card">
                <div class="progress-steps">
                    <div class="progress-step ${step >= 1 ? 'active' : ''}"></div>
                    <div class="progress-step ${step >= 2 ? 'active' : ''}"></div>
                    <div class="progress-step ${step >= 3 ? 'active' : ''}"></div>
                </div>
                
                ${step === 1 ? renderOnboardingStep1() : ''}
                ${step === 2 ? renderOnboardingStep2() : ''}
                ${step === 3 ? renderOnboardingStep3() : ''}
            </div>
        </div>
    `;
}

function renderOnboardingStep1() {
    return `
        <div class="text-center mb-4">
            <h1>FetchAFest</h1>
            <p class="text-muted">One platform for all your events</p>
        </div>
        
        <div class="input-group">
            <label for="name">Your Name</label>
            <input type="text" id="name" placeholder="Enter your name">
        </div>
        
        <div class="input-group">
            <label for="email">Email</label>
            <input type="email" id="email" placeholder="Enter your college email">
        </div>
        
        <button class="btn btn-primary btn-lg w-full" onclick="onboardingNext1()">
            Continue <i class="fas fa-arrow-right"></i>
        </button>
    `;
}

function renderOnboardingStep2() {
    return `
        <div class="text-center mb-3">
            <h2>Select Your College</h2>
            <p class="text-muted">Find events happening around you</p>
        </div>
        
        <div class="search-wrapper">
            <i class="fas fa-search"></i>
            <input type="text" class="search-input" id="college-search" placeholder="Search college..." oninput="filterColleges()">
        </div>
        
        <div class="college-list" id="college-list">
            ${COLLEGES.map(college => `
                <button class="college-item ${state.selectedCollege?.id === college.id ? 'selected' : ''}" 
                        onclick="selectCollege('${college.id}')">
                    <div style="font-weight: 600;">${college.name}</div>
                    <div style="font-size: 0.9rem; color: var(--muted);">${college.city}, ${college.state}</div>
                </button>
            `).join('')}
        </div>
        
        <div class="flex gap-2 mt-3">
            <button class="btn btn-outline" style="flex: 1;" onclick="onboardingBack()">Back</button>
            <button class="btn btn-primary" style="flex: 1;" onclick="onboardingNext2()" ${!state.selectedCollege ? 'disabled' : ''}>
                Continue <i class="fas fa-arrow-right"></i>
            </button>
        </div>
    `;
}

function renderOnboardingStep3() {
    return `
        <div class="text-center mb-3">
            <h2>Choose Your Interests</h2>
            <p class="text-muted">Select at least one category</p>
        </div>
        
        <div class="interest-grid">
            ${INTERESTS.map(interest => `
                <button class="interest-item ${state.selectedInterests.includes(interest.value) ? 'selected' : ''}" 
                        onclick="toggleInterest('${interest.value}')">
                    <i class="fas ${interest.icon}"></i>
                    <span>${interest.label}</span>
                </button>
            `).join('')}
        </div>
        
        <div class="flex gap-2 mt-3">
            <button class="btn btn-outline" style="flex: 1;" onclick="onboardingBack()">Back</button>
            <button class="btn btn-primary" style="flex: 1;" onclick="completeOnboarding()" ${state.selectedInterests.length === 0 ? 'disabled' : ''}>
                Get Started 
            </button>
        </div>
    `;
}

// ==================== HOME SCREEN ====================
function renderHome() {
    const searchQuery = '';
    const selectedCategory = 'All';
    
    return `
        <div class="header">
            <div class="header-flex">
                <div>
                    <h1>Discover Events</h1>
                    <p class="text-muted" style="font-size: 0.9rem;">${state.user?.college?.name || 'All Colleges'}</p>
                </div>
                <button class="back-btn" onclick="toggleFilters()">
                    <i class="fas fa-sliders-h"></i>
                </button>
            </div>
            
            <div class="search-wrapper mt-2">
                <i class="fas fa-search"></i>
                <input type="text" class="search-input" id="event-search" placeholder="Search events..." oninput="searchEvents()">
            </div>
            
            <div class="filter-chips mt-2" id="category-filters">
                <button class="filter-chip active" onclick="filterByCategory('All')">All</button>
                <button class="filter-chip" onclick="filterByCategory('Tech')">Tech</button>
                <button class="filter-chip" onclick="filterByCategory('Cultural')">Cultural</button>
                <button class="filter-chip" onclick="filterByCategory('Sports')">Sports</button>
                <button class="filter-chip" onclick="filterByCategory('Workshops')">Workshops</button>
            </div>
        </div>
        
        <div class="container">
            <div class="grid" id="events-grid">
                ${state.events.map(event => renderEventCard(event)).join('')}
            </div>
        </div>
    `;
}

function renderEventCard(event) {
    const seatsPercentage = (event.seatsLeft / event.totalSeats) * 100;
    const progressClass = seatsPercentage > 50 ? '' : seatsPercentage > 20 ? 'warning' : 'danger';
    
    return `
        <div class="event-card" onclick="viewEvent('${event.id}')">
            <div class="event-card-image">
                <img src="${event.poster}" alt="${event.title}">
                <div style="position: absolute; top: 8px; right: 8px;">
                    <span class="event-category">${event.category}</span>
                </div>
                ${event.price === 0 ? '<div style="position: absolute; top: 8px; left: 8px;"><span style="background: var(--success); color: white; padding: 4px 12px; border-radius: 20px; font-size: 0.85rem; font-weight: 600;">Free</span></div>' : ''}
            </div>
            
            <div class="event-card-content">
                <h3 class="event-title">${event.title}</h3>
                <p class="event-college">${event.college}</p>
                
                <div class="event-info">
                    <div class="event-info-item">
                        <i class="fas fa-calendar"></i>
                        <span>${formatDate(event.date)} • ${event.time}</span>
                    </div>
                    <div class="event-info-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${event.venue}</span>
                    </div>
                    <div class="event-info-item">
                        <i class="fas fa-users"></i>
                        <span>${event.seatsLeft} seats left</span>
                        ${event.price > 0 ? `<span style="margin-left: auto; font-weight: 600; color: var(--primary);">₹${event.price}</span>` : ''}
                    </div>
                </div>
                
                <div class="progress-bar">
                    <div class="progress-fill ${progressClass}" style="width: ${seatsPercentage}%"></div>
                </div>
            </div>
        </div>
    `;
}

// ==================== EVENT DETAIL SCREEN ====================
function renderEventDetail() {
    const event = state.events.find(e => e.id === state.selectedEventId);
    if (!event) return '<div>Event not found</div>';
    
    const seatsPercentage = (event.seatsLeft / event.totalSeats) * 100;
    const progressClass = seatsPercentage > 50 ? '' : seatsPercentage > 20 ? 'warning' : 'danger';
    
    return `
        <div style="min-height: 100vh; padding-bottom: 100px;">
            <div style="position: relative; height: 300px;">
                <img src="${event.poster}" alt="${event.title}" style="width: 100%; height: 100%; object-fit: cover;">
                <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.2));"></div>
                
                <button class="back-btn" style="position: absolute; top: 16px; left: 16px; background: rgba(0,0,0,0.5); color: white;" onclick="navigate('home')">
                    <i class="fas fa-arrow-left"></i>
                </button>
                
                <div style="position: absolute; bottom: 16px; left: 16px; right: 16px; color: white;">
                    <span class="event-category" style="background: var(--primary); margin-bottom: 8px; display: inline-block;">${event.category}</span>
                    <h1 style="color: white; margin-bottom: 4px;">${event.title}</h1>
                    <p style="opacity: 0.9;">${event.college}</p>
                </div>
            </div>
            
            <div class="container">
                <div class="grid grid-2 mt-3">
                    <div class="card">
                        <div class="card-body">
                            <div style="display: flex; align-items: center; gap: 8px; color: var(--primary); margin-bottom: 8px;">
                                <i class="fas fa-calendar"></i>
                                <span style="font-weight: 600;">Date</span>
                            </div>
                            <p style="font-weight: 600;">${formatDate(event.date)}</p>
                        </div>
                    </div>
                    
                    <div class="card">
                        <div class="card-body">
                            <div style="display: flex; align-items: center; gap: 8px; color: var(--primary); margin-bottom: 8px;">
                                <i class="fas fa-clock"></i>
                                <span style="font-weight: 600;">Time</span>
                            </div>
                            <p style="font-weight: 600;">${event.time}</p>
                        </div>
                    </div>
                    
                    <div class="card" style="grid-column: span 2;">
                        <div class="card-body">
                            <div style="display: flex; align-items: center; gap: 8px; color: var(--primary); margin-bottom: 8px;">
                                <i class="fas fa-map-marker-alt"></i>
                                <span style="font-weight: 600;">Venue</span>
                            </div>
                            <p style="font-weight: 600;">${event.venue}</p>
                        </div>
                    </div>
                </div>
                
                <div class="card mt-3">
                    <div class="card-body">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <i class="fas fa-users" style="color: var(--primary);"></i>
                                <span style="font-weight: 600;">Availability</span>
                            </div>
                            <span style="font-size: 0.9rem;">
                                <span style="font-weight: 600; color: var(--primary);">${event.seatsLeft}</span> / ${event.totalSeats} seats
                            </span>
                        </div>
                        <div class="progress-bar" style="height: 12px;">
                            <div class="progress-fill ${progressClass}" style="width: ${seatsPercentage}%"></div>
                        </div>
                        <p class="text-center text-muted" style="font-size: 0.8rem; margin-top: 8px;">
                            ${seatsPercentage > 50 ? 'Good availability' : seatsPercentage > 20 ? 'Filling fast!' : 'Almost full!'}
                        </p>
                    </div>
                </div>
                
                <div class="mt-3">
                    <h2 class="mb-2">About Event</h2>
                    <p class="text-muted" style="line-height: 1.8;">${event.description}</p>
                </div>
                
                <div class="card mt-3">
                    <div class="card-body">
                        <h3 style="margin-bottom: 8px;">Organized by</h3>
                        <p class="text-muted">${event.organizer}</p>
                    </div>
                </div>
                
                ${event.ticketTypes.length > 0 ? `
                    <div class="mt-3">
                        <h2 class="mb-2">Ticket Types</h2>
                        <div class="grid gap-2">
                            ${event.ticketTypes.map(ticket => `
                                <div class="card">
                                    <div class="card-body" style="display: flex; justify-content: space-between; align-items: center;">
                                        <div>
                                            <p style="font-weight: 600;">${ticket.type}</p>
                                            <p class="text-muted" style="font-size: 0.9rem;">${ticket.available} available</p>
                                        </div>
                                        <p style="font-size: 1.5rem; font-weight: 700; color: var(--primary);">
                                            ${ticket.price === 0 ? 'Free' : `₹${ticket.price}`}
                                        </p>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
            
            <div style="position: fixed; bottom: 0; left: 0; right: 0; background: var(--card); border-top: 1px solid var(--border); padding: 16px; z-index: 100;">
                <div class="container" style="display: flex; align-items: center; gap: 16px;">
                    ${event.price > 0 ? `
                        <div>
                            <p class="text-muted" style="font-size: 0.85rem;">Starting from</p>
                            <p style="font-size: 1.8rem; font-weight: 700; color: var(--primary);">₹${event.price}</p>
                        </div>
                    ` : ''}
                    <button class="btn btn-primary btn-lg" style="flex: 1;" onclick="startRegistration('${event.id}')" ${event.seatsLeft === 0 ? 'disabled' : ''}>
                        ${event.seatsLeft === 0 ? 'Sold Out' : event.price === 0 ? 'Register Now' : 'Book Ticket'}
                    </button>
                </div>
            </div>
        </div>
    `;
}

// ==================== REGISTRATION SCREEN ====================
function renderRegistration() {
    const event = state.events.find(e => e.id === state.selectedEventId);
    if (!event) return '<div>Event not found</div>';
    
    return `
        <div class="header">
            <div class="header-flex">
                <button class="back-btn" onclick="navigate('event-detail')">
                    <i class="fas fa-arrow-left"></i>
                </button>
                <div style="flex: 1;">
                    <h3>Registration</h3>
                    <p class="text-muted" style="font-size: 0.9rem;">${event.title}</p>
                </div>
            </div>
        </div>
        
        <div class="container">
            <div id="registration-content">
                <h2 class="mb-3">Choose Your Ticket</h2>
                <div class="grid gap-2">
                    ${event.ticketTypes.map(ticket => `
                        <button class="card" style="border: 2px solid var(--border); cursor: pointer; transition: all 0.2s;" 
                                onclick="selectTicket('${ticket.type}')"
                                ${ticket.available === 0 ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>
                            <div class="card-body" style="display: flex; justify-content: space-between; align-items: center;">
                                <div>
                                    <h3>${ticket.type}</h3>
                                    <p class="text-muted">${ticket.available} available</p>
                                </div>
                                <p style="font-size: 1.8rem; font-weight: 700; color: var(--primary);">
                                    ${ticket.price === 0 ? 'Free' : `₹${ticket.price}`}
                                </p>
                            </div>
                        </button>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

// ==================== MY EVENTS SCREEN ====================
function renderMyEvents() {
    const upcomingRegistrations = state.registrations.filter(reg => {
        const event = state.events.find(e => e.id === reg.eventId);
        return event && new Date(event.date) >= new Date();
    });
    
    const pastRegistrations = state.registrations.filter(reg => {
        const event = state.events.find(e => e.id === reg.eventId);
        return event && new Date(event.date) < new Date();
    });
    
    return `
        <div class="header">
            <h1>My Events</h1>
            <p class="text-muted">${state.registrations.length} ${state.registrations.length === 1 ? 'ticket' : 'tickets'}</p>
        </div>
        
        <div class="container">
            ${state.registrations.length === 0 ? `
                <div class="empty-state">
                    <i class="fas fa-ticket-alt"></i>
                    <h3>No tickets yet</h3>
                    <p>Start exploring events and book your first ticket!</p>
                    <button class="btn btn-primary" onclick="navigate('home')">Discover Events</button>
                </div>
            ` : `
                <div class="tabs">
                    <div class="tab-list">
                        <button class="tab-button active" onclick="switchTab(0)">Upcoming (${upcomingRegistrations.length})</button>
                        <button class="tab-button" onclick="switchTab(1)">Past (${pastRegistrations.length})</button>
                    </div>
                    
                    <div class="tab-panel active" id="tab-0">
                        ${upcomingRegistrations.length === 0 ? 
                            '<p class="text-center text-muted mt-3">No upcoming events</p>' :
                            `<div class="grid gap-2 mt-3">${upcomingRegistrations.map(reg => renderTicketCard(reg)).join('')}</div>`
                        }
                    </div>
                    
                    <div class="tab-panel" id="tab-1">
                        ${pastRegistrations.length === 0 ? 
                            '<p class="text-center text-muted mt-3">No past events</p>' :
                            `<div class="grid gap-2 mt-3">${pastRegistrations.map(reg => renderTicketCard(reg, true)).join('')}</div>`
                        }
                    </div>
                </div>
            `}
        </div>
    `;
}

function renderTicketCard(registration, isPast = false) {
    const event = state.events.find(e => e.id === registration.eventId);
    if (!event) return '';
    
    return `
        <div class="card" style="${isPast ? 'opacity: 0.6;' : ''}">
            <div style="position: relative; height: 100px; overflow: hidden;">
                <img src="${event.poster}" alt="${event.title}" style="width: 100%; height: 100%; object-fit: cover; ${isPast ? 'filter: grayscale(100%);' : ''}">
                <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);"></div>
                <div style="position: absolute; bottom: 8px; left: 16px; color: white;">
                    <h4 style="color: white;">${event.title}</h4>
                    <p style="font-size: 0.9rem; opacity: 0.9;">${event.college}</p>
                </div>
            </div>
            
            <div class="card-body">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <div style="display: flex; align-items: center; gap: 8px; font-size: 0.9rem;">
                        <i class="fas fa-calendar" style="color: var(--primary);"></i>
                        <span>${formatDate(event.date)} • ${event.time}</span>
                    </div>
                    <span class="badge">${registration.ticketType}</span>
                </div>
                
                ${!isPast ? `
                    <div style="display: flex; gap: 8px;">
                        <button class="btn btn-primary" style="flex: 1;" onclick="viewTicket('${registration.id}')">
                            <i class="fas fa-ticket-alt"></i> View Ticket
                        </button>
                        <button class="btn btn-outline" onclick="addToCalendar('${event.id}')">
                            <i class="fas fa-calendar-plus"></i>
                        </button>
                    </div>
                ` : `
                    <p class="text-muted text-center" style="font-size: 0.85rem;">Attended</p>
                `}
            </div>
        </div>
    `;
}

// ==================== ORGANIZER DASHBOARD ====================
function renderOrganizerDashboard() {
    // Get organizer's events
    const organizerEvents = state.events.filter(e => e.organizer.includes(state.user?.college?.name || ''));
    const totalRegistrations = organizerEvents.reduce((sum, event) => sum + (event.totalSeats - event.seatsLeft), 0);
    
    return `
        <div class="header">
            <div class="header-flex">
                <div>
                    <h1>Organizer Dashboard</h1>
                    <p class="text-muted">Manage your events</p>
                </div>
                <button class="btn btn-primary" onclick="console.log('New Event button clicked'); showCreateEventForm();">
                    <i class="fas fa-plus"></i> New Event
                </button>
            </div>
        </div>
        
        <div class="container">
            <div class="stats-grid">
                <div class="card stat-card">
                    <i class="fas fa-chart-bar"></i>
                    <div class="stat-value">${organizerEvents.length}</div>
                    <div class="stat-label">Total Events</div>
                </div>
                <div class="card stat-card">
                    <i class="fas fa-users"></i>
                    <div class="stat-value">${totalRegistrations}</div>
                    <div class="stat-label">Registrations</div>
                </div>
                <div class="card stat-card">
                    <i class="fas fa-calendar-check"></i>
                    <div class="stat-value">${organizerEvents.filter(e => new Date(e.date) >= new Date()).length}</div>
                    <div class="stat-label">Upcoming</div>
                </div>
            </div>
            
            <h2 class="mb-2">Your Events</h2>
            ${organizerEvents.length === 0 ? `
                <div class="empty-state">
                    <i class="fas fa-calendar-plus"></i>
                    <h3>No events yet</h3>
                    <p>Create your first event to get started!</p>
                    <button class="btn btn-primary" onclick="console.log('Create Event button clicked'); showCreateEventForm();">Create Event</button>
                </div>
            ` : `
                <div class="grid gap-2">
                    ${organizerEvents.map(event => renderOrganizerEventCard(event)).join('')}
                </div>
            `}
        </div>
    `;
}

function renderOrganizerEventCard(event) {
    const registrations = event.totalSeats - event.seatsLeft;
    const isUpcoming = new Date(event.date) >= new Date();
    
    return `
        <div class="card">
            <div class="card-body">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
                    <div>
                        <h3>${event.title}</h3>
                        <p class="text-muted">${registrations} registrations</p>
                    </div>
                    <span class="badge" style="background: ${isUpcoming ? 'rgba(16, 185, 129, 0.1)' : 'rgba(100, 116, 139, 0.1)'}; color: ${isUpcoming ? 'var(--success)' : 'var(--muted)'};">
                        ${isUpcoming ? 'Upcoming' : 'Completed'}
                    </span>
                </div>
                
                <div style="display: flex; gap: 8px;">
                    <button class="btn btn-outline" style="flex: 1;" onclick="viewEvent('${event.id}')">
                        View Details
                    </button>
                    <button class="btn btn-outline" onclick="showToast('QR Scanner would open here', 'success')">
                        <i class="fas fa-qrcode"></i>
                    </button>
                    <button class="btn btn-danger" onclick="deleteEvent('${event.id}', '${event.title}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// ==================== PROFILE SCREEN ====================
function renderProfile() {
    const initials = state.user.name.split(' ').map(n => n[0]).join('').toUpperCase();
    const upcomingEvents = state.registrations.filter(reg => {
        const event = state.events.find(e => e.id === reg.eventId);
        return event && new Date(event.date) >= new Date();
    }).length;
    
    return `
        <div class="header">
            <h1>Profile</h1>
        </div>
        
        <div class="container">
            <div class="card">
                <div class="profile-header">
                    <div class="avatar">${initials}</div>
                    <h2>${state.user.name}</h2>
                    <p class="text-muted"><i class="fas fa-envelope"></i> ${state.user.email}</p>
                    
                    <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid var(--border);">
                        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                            <i class="fas fa-graduation-cap" style="color: var(--primary); font-size: 1.25rem;"></i>
                            <div>
                                <p class="text-muted" style="font-size: 0.85rem;">College</p>
                                <p style="font-weight: 600;">${state.user.college.name}</p>
                            </div>
                        </div>
                        
                        <div style="display: flex; align-items: start; gap: 12px;">
                            <i class="fas fa-heart" style="color: var(--primary); font-size: 1.25rem;"></i>
                            <div>
                                <p class="text-muted" style="font-size: 0.85rem;">Interests</p>
                                <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-top: 4px;">
                                    ${state.user.interests.map(interest => `<span class="badge">${interest}</span>`).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <button class="btn btn-outline w-full mt-3" onclick="navigate('edit-profile')">
                        <i class="fas fa-edit"></i> Edit Profile
                    </button>
                </div>
            </div>
            
            <div class="stats-grid mt-3">
                <div class="card stat-card">
                    <div class="stat-value">${state.registrations.length}</div>
                    <div class="stat-label">Events</div>
                </div>
                <div class="card stat-card">
                    <div class="stat-value">${upcomingEvents}</div>
                    <div class="stat-label">Upcoming</div>
                </div>
                <div class="card stat-card">
                    <div class="stat-value">${state.user.interests.length}</div>
                    <div class="stat-label">Interests</div>
                </div>
            </div>
            
            <div class="settings-section mt-4">
                <h3 class="settings-title">Settings</h3>
                <div class="card">
                    <button class="settings-item" onclick="showToast('Notifications settings', 'success')">
                        <div class="settings-item-content">
                            <i class="fas fa-bell"></i>
                            <span>Notifications</span>
                        </div>
                        <i class="fas fa-chevron-right" style="color: var(--muted);"></i>
                    </button>
                    
                    <button class="settings-item" onclick="toggleDarkMode()">
                        <div class="settings-item-content">
                            <i class="fas fa-moon"></i>
                            <span>Dark Mode</span>
                        </div>
                        <div class="toggle ${state.darkMode ? 'active' : ''}" id="dark-mode-toggle">
                            <div class="toggle-slider"></div>
                        </div>
                    </button>
                    
                    <button class="settings-item" onclick="navigate('app-settings')">
                        <div class="settings-item-content">
                            <i class="fas fa-cog"></i>
                            <span>App Settings</span>
                        </div>
                        <i class="fas fa-chevron-right" style="color: var(--muted);"></i>
                    </button>
                </div>
            </div>
            
            <div class="settings-section">
                <h3 class="settings-title">About</h3>
                <div class="card">
                    <button class="settings-item" onclick="navigate('privacy-policy')">
                        <span>Privacy Policy</span>
                        <i class="fas fa-chevron-right" style="color: var(--muted);"></i>
                    </button>
                    <button class="settings-item" onclick="navigate('terms')">
                        <span>Terms of Service</span>
                        <i class="fas fa-chevron-right" style="color: var(--muted);"></i>
                    </button>
                    <button class="settings-item" onclick="navigate('help')">
                        <span>Help & Support</span>
                        <i class="fas fa-chevron-right" style="color: var(--muted);"></i>
                    </button>
                </div>
            </div>
            
            <button class="btn btn-danger w-full mt-3 mb-4" onclick="logout()">
                <i class="fas fa-sign-out-alt"></i> Logout
            </button>
            
            <p class="text-center text-muted" style="font-size: 0.8rem; margin-bottom: 32px;">Version 1.0.0</p>
        </div>
    `;
}

// ==================== EDIT PROFILE SCREEN ====================
function renderEditProfile() {
    return `
        <div class="header">
            <div class="header-flex">
                <button class="back-btn" onclick="navigate('profile')">
                    <i class="fas fa-arrow-left"></i>
                </button>
                <h2>Edit Profile</h2>
            </div>
        </div>
        
        <div class="container">
            <div class="card">
                <div class="card-body">
                    <div class="input-group">
                        <label for="edit-name">Name</label>
                        <input type="text" id="edit-name" value="${state.user.name}">
                    </div>
                    
                    <div class="input-group">
                        <label for="edit-email">Email</label>
                        <input type="email" id="edit-email" value="${state.user.email}">
                    </div>
                    
                    <div class="input-group">
                        <label>College</label>
                        <select id="edit-college">
                            ${COLLEGES.map(college => `
                                <option value="${college.id}" ${state.user.college.id === college.id ? 'selected' : ''}>
                                    ${college.name}
                                </option>
                            `).join('')}
                        </select>
                    </div>
                    
                    <div class="input-group">
                        <label>Interests</label>
                        <div class="interest-grid">
                            ${INTERESTS.map(interest => `
                                <button class="interest-item ${state.user.interests.includes(interest.value) ? 'selected' : ''}" 
                                        onclick="toggleEditInterest('${interest.value}')">
                                    <i class="fas ${interest.icon}"></i>
                                    <span>${interest.label}</span>
                                </button>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="input-group">
                    <label class="checkbox-row">
                    <input type="checkbox" id="edit-organizer" ${state.user.isOrganizer ? 'checked' : ''}>
                    <span>I am an Organizer</span>                        
                    </label>
                    </div>
                    
                    <button class="btn btn-primary w-full" onclick="saveProfile()">
                        <i class="fas fa-save"></i> Save Changes
                    </button>
                </div>
            </div>
        </div>
    `;
}

// ==================== APP SETTINGS SCREEN ====================
function renderAppSettings() {
    return `
        <div class="header">
            <div class="header-flex">
                <button class="back-btn" onclick="navigate('profile')">
                    <i class="fas fa-arrow-left"></i>
                </button>
                <h2>App Settings</h2>
            </div>
        </div>
        
        <div class="container">
            <div class="card">
                <div class="card-body">
                    <h3 class="mb-3">Display</h3>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                        <span>Dark Mode</span>
                        <div class="toggle ${state.darkMode ? 'active' : ''}" onclick="toggleDarkMode()">
                            <div class="toggle-slider"></div>
                        </div>
                    </div>
                    
                    <h3 class="mb-3 mt-4">Notifications</h3>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                        <span>Event Reminders</span>
                        <div class="toggle active" onclick="this.classList.toggle('active')">
                            <div class="toggle-slider"></div>
                        </div>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                        <span>New Events</span>
                        <div class="toggle active" onclick="this.classList.toggle('active')">
                            <div class="toggle-slider"></div>
                        </div>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span>Marketing Updates</span>
                        <div class="toggle" onclick="this.classList.toggle('active')">
                            <div class="toggle-slider"></div>
                        </div>
                    </div>
                    
                    <h3 class="mb-3 mt-4">Data</h3>
                    <button class="btn btn-outline w-full mb-2" onclick="clearCache()">
                        <i class="fas fa-trash"></i> Clear Cache
                    </button>
                    <button class="btn btn-outline w-full" onclick="exportData()">
                        <i class="fas fa-download"></i> Export My Data
                    </button>
                </div>
            </div>
        </div>
    `;
}

// ==================== PRIVACY POLICY SCREEN ====================
function renderPrivacyPolicy() {
    return `
        <div class="header">
            <div class="header-flex">
                <button class="back-btn" onclick="navigate('profile')">
                    <i class="fas fa-arrow-left"></i>
                </button>
                <h2>Privacy Policy</h2>
            </div>
        </div>
        
        <div class="container">
            <div class="card">
                <div class="card-body">
                    <p class="text-muted" style="margin-bottom: 16px;">Last updated: January 9, 2026</p>
                    
                    <h3 class="mb-2">1. Information We Collect</h3>
                    <p style="margin-bottom: 16px; line-height: 1.8;">
                        We collect information you provide directly to us, including your name, email address, college information, 
                        and event preferences. We also collect information about your use of our services.
                    </p>
                    
                    <h3 class="mb-2">2. How We Use Your Information</h3>
                    <p style="margin-bottom: 16px; line-height: 1.8;">
                        We use the information we collect to provide, maintain, and improve our services, to process your registrations, 
                        to send you technical notices and support messages, and to communicate with you about events, offers, and news.
                    </p>
                    
                    <h3 class="mb-2">3. Information Sharing</h3>
                    <p style="margin-bottom: 16px; line-height: 1.8;">
                        We do not share your personal information with third parties except as described in this policy. 
                        We may share information with event organizers when you register for their events.
                    </p>
                    
                    <h3 class="mb-2">4. Data Security</h3>
                    <p style="margin-bottom: 16px; line-height: 1.8;">
                        We take reasonable measures to help protect your personal information from loss, theft, misuse, 
                        unauthorized access, disclosure, alteration, and destruction.
                    </p>
                    
                    <h3 class="mb-2">5. Your Rights</h3>
                    <p style="margin-bottom: 16px; line-height: 1.8;">
                        You have the right to access, update, or delete your personal information at any time. 
                        You can do this by accessing your profile settings or contacting us directly.
                    </p>
                    
                    <h3 class="mb-2">6. Contact Us</h3>
                    <p style="line-height: 1.8;">
                        If you have any questions about this Privacy Policy, please contact us at privacy@eventhub.com
                    </p>
                </div>
            </div>
        </div>
    `;
}

// ==================== TERMS OF SERVICE SCREEN ====================
function renderTerms() {
    return `
        <div class="header">
            <div class="header-flex">
                <button class="back-btn" onclick="navigate('profile')">
                    <i class="fas fa-arrow-left"></i>
                </button>
                <h2>Terms of Service</h2>
            </div>
        </div>
        
        <div class="container">
            <div class="card">
                <div class="card-body">
                    <p class="text-muted" style="margin-bottom: 16px;">Last updated: January 9, 2026</p>
                    
                    <h3 class="mb-2">1. Acceptance of Terms</h3>
                    <p style="margin-bottom: 16px; line-height: 1.8;">
                        By accessing and using EventHub, you accept and agree to be bound by the terms and provision of this agreement.
                    </p>
                    
                    <h3 class="mb-2">2. Use of Service</h3>
                    <p style="margin-bottom: 16px; line-height: 1.8;">
                        EventHub provides a platform for discovering and registering for college events. You agree to use the service 
                        only for lawful purposes and in accordance with these Terms.
                    </p>
                    
                    <h3 class="mb-2">3. User Accounts</h3>
                    <p style="margin-bottom: 16px; line-height: 1.8;">
                        You are responsible for maintaining the confidentiality of your account and password. You agree to accept 
                        responsibility for all activities that occur under your account.
                    </p>
                    
                    <h3 class="mb-2">4. Event Registration</h3>
                    <p style="margin-bottom: 16px; line-height: 1.8;">
                        When you register for an event, you agree to attend or notify the organizer if you cannot attend. 
                        Refund policies are set by individual event organizers.
                    </p>
                    
                    <h3 class="mb-2">5. Prohibited Activities</h3>
                    <p style="margin-bottom: 16px; line-height: 1.8;">
                        You may not use EventHub to engage in any illegal activity, to violate the rights of others, 
                        or to distribute spam or malicious content.
                    </p>
                    
                    <h3 class="mb-2">6. Limitation of Liability</h3>
                    <p style="margin-bottom: 16px; line-height: 1.8;">
                        EventHub shall not be liable for any indirect, incidental, special, consequential or punitive damages 
                        resulting from your use of or inability to use the service.
                    </p>
                    
                    <h3 class="mb-2">7. Changes to Terms</h3>
                    <p style="line-height: 1.8;">
                        We reserve the right to modify these terms at any time. We will notify users of any material changes 
                        via email or through the service.
                    </p>
                </div>
            </div>
        </div>
    `;
}

// ==================== HELP & SUPPORT SCREEN ====================
function renderHelp() {
    return `
        <div class="header">
            <div class="header-flex">
                <button class="back-btn" onclick="navigate('profile')">
                    <i class="fas fa-arrow-left"></i>
                </button>
                <h2>Help & Support</h2>
            </div>
        </div>
        
        <div class="container">
            <div class="card mb-3">
                <div class="card-body">
                    <h3 class="mb-3">Frequently Asked Questions</h3>
                    
                    <details style="margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid var(--border);">
                        <summary style="font-weight: 600; cursor: pointer; margin-bottom: 8px;">
                            How do I register for an event?
                        </summary>
                        <p class="text-muted" style="line-height: 1.8; padding-left: 16px;">
                            Browse events on the home screen, click on an event to view details, then click "Register Now" or "Book Ticket" 
                            to complete your registration.
                        </p>
                    </details>
                    
                    <details style="margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid var(--border);">
                        <summary style="font-weight: 600; cursor: pointer; margin-bottom: 8px;">
                            How do I view my tickets?
                        </summary>
                        <p class="text-muted" style="line-height: 1.8; padding-left: 16px;">
                            Go to the "My Events" tab from the bottom navigation. Click on any event to view your QR ticket.
                        </p>
                    </details>
                    
                    <details style="margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid var(--border);">
                        <summary style="font-weight: 600; cursor: pointer; margin-bottom: 8px;">
                            Can I get a refund for my ticket?
                        </summary>
                        <p class="text-muted" style="line-height: 1.8; padding-left: 16px;">
                            Refund policies vary by event. Please check with the event organizer directly or contact support.
                        </p>
                    </details>
                    
                    <details style="margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid var(--border);">
                        <summary style="font-weight: 600; cursor: pointer; margin-bottom: 8px;">
                            How do I become an event organizer?
                        </summary>
                        <p class="text-muted" style="line-height: 1.8; padding-left: 16px;">
                            Enable the "I am an event organizer" option in your profile settings. Once enabled, you'll see the 
                            Create tab in the bottom navigation.
                        </p>
                    </details>
                    
                    <details style="margin-bottom: 16px;">
                        <summary style="font-weight: 600; cursor: pointer; margin-bottom: 8px;">
                            How do I change my college or interests?
                        </summary>
                        <p class="text-muted" style="line-height: 1.8; padding-left: 16px;">
                            Go to Profile > Edit Profile to update your college and interests.
                        </p>
                    </details>
                </div>
            </div>
            
            <div class="card">
                <div class="card-body">
                    <h3 class="mb-3">Contact Support</h3>
                    <p class="text-muted mb-3">Can't find what you're looking for? Get in touch with us.</p>
                    
                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                        <i class="fas fa-envelope" style="color: var(--primary); font-size: 1.25rem;"></i>
                        <div>
                            <p style="font-weight: 600;">Email</p>
                            <a href="mailto:support@eventhub.com" style="color: var(--primary); text-decoration: none;">
                                support@eventhub.com
                            </a>
                        </div>
                    </div>
                    
                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                        <i class="fas fa-phone" style="color: var(--primary); font-size: 1.25rem;"></i>
                        <div>
                            <p style="font-weight: 600;">Phone</p>
                            <a href="tel:+911234567890" style="color: var(--primary); text-decoration: none;">
                                +91 123-456-7890
                            </a>
                        </div>
                    </div>
                    
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <i class="fas fa-clock" style="color: var(--primary); font-size: 1.25rem;"></i>
                        <div>
                            <p style="font-weight: 600;">Support Hours</p>
                            <p class="text-muted">Mon-Fri, 9:00 AM - 6:00 PM IST</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ==================== EVENT HANDLERS ====================
function onboardingNext1() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    
    if (!name || !email) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    if (!email.includes('@')) {
        showToast('Please enter a valid email', 'error');
        return;
    }
    
    state.user = { name, email };
    state.onboardingStep = 2;
    render();
}

function onboardingNext2() {
    if (!state.selectedCollege) {
        showToast('Please select a college', 'error');
        return;
    }
    state.onboardingStep = 3;
    render();
}

function onboardingBack() {
    state.onboardingStep--;
    render();
}

function selectCollege(id) {
    state.selectedCollege = COLLEGES.find(c => c.id === id);
    render();
}

function filterColleges() {
    const query = document.getElementById('college-search').value.toLowerCase();
    const list = document.getElementById('college-list');
    const filtered = COLLEGES.filter(college => 
        college.name.toLowerCase().includes(query) || 
        college.city.toLowerCase().includes(query)
    );
    
    list.innerHTML = filtered.map(college => `
        <button class="college-item ${state.selectedCollege?.id === college.id ? 'selected' : ''}" 
                onclick="selectCollege('${college.id}')">
            <div style="font-weight: 600;">${college.name}</div>
            <div style="font-size: 0.9rem; color: var(--muted);">${college.city}, ${college.state}</div>
        </button>
    `).join('');
}

function toggleInterest(interest) {
    if (state.selectedInterests.includes(interest)) {
        state.selectedInterests = state.selectedInterests.filter(i => i !== interest);
    } else {
        state.selectedInterests.push(interest);
    }
    render();
}

function toggleEditInterest(interest) {
    if (state.user.interests.includes(interest)) {
        state.user.interests = state.user.interests.filter(i => i !== interest);
    } else {
        state.user.interests.push(interest);
    }
    render();
}

function completeOnboarding() {
    state.user.college = state.selectedCollege;
    state.user.interests = [...state.selectedInterests];
    state.user.id = Date.now().toString();
    state.user.isOrganizer = false;
    
    saveToLocalStorage();
    navigate('home');
    showToast('Welcome to FetchAFest 🪩', 'success');
}

function searchEvents() {
    const query = document.getElementById('event-search').value.toLowerCase();
    const filtered = state.events.filter(event => 
        event.title.toLowerCase().includes(query) || 
        event.college.toLowerCase().includes(query) ||
        event.category.toLowerCase().includes(query)
    );
    
    document.getElementById('events-grid').innerHTML = filtered.map(event => renderEventCard(event)).join('');
}

function filterByCategory(category) {
    // Update active state
    document.querySelectorAll('.filter-chip').forEach(chip => {
        chip.classList.toggle('active', chip.textContent === category);
    });
    
    const filtered = category === 'All' ? state.events : state.events.filter(e => e.category === category);
    document.getElementById('events-grid').innerHTML = filtered.map(event => renderEventCard(event)).join('');
}

function viewEvent(id) {
    state.selectedEventId = id;
    navigate('event-detail');
}

function startRegistration(id) {
    state.selectedEventId = id;
    navigate('registration');
}

function selectTicket(ticketType) {
    const event = state.events.find(e => e.id === state.selectedEventId);
    const ticket = event.ticketTypes.find(t => t.type === ticketType);
    
    if (ticket.price === 0) {
        // Free ticket - register immediately
        completeRegistration(ticketType, 0);
    } else {
        // Show payment form
        showPaymentForm(ticketType, ticket.price);
    }
}

function showPaymentForm(ticketType, amount) {
    const event = state.events.find(e => e.id === state.selectedEventId);
    
    document.getElementById('registration-content').innerHTML = `
        <h2 class="mb-3">Payment</h2>
        
        <div class="card mb-3">
            <div class="card-body">
                <h3 class="mb-2">Price Breakdown</h3>
                <div style="display: flex; justify-between; margin-bottom: 8px;">
                    <span>${ticketType} Ticket</span>
                    <span>₹${amount}</span>
                </div>
                <div style="display: flex; justify-between; margin-bottom: 8px;">
                    <span>Platform Fee</span>
                    <span>₹0</span>
                </div>
                <div style="border-top: 2px solid var(--border); padding-top: 8px; display: flex; justify-between; font-weight: 700;">
                    <span>Total</span>
                    <span style="color: var(--primary); font-size: 1.25rem;">₹${amount}</span>
                </div>
            </div>
        </div>
        
        <h3 class="mb-2">Payment Method</h3>
        <div class="grid gap-2 mb-3">
            <button class="card payment-method active" onclick="selectPaymentMethod('UPI')" style="border: 2px solid var(--primary);">
                <div class="card-body" style="display: flex; align-items: center; gap: 12px;">
                    <i class="fas fa-mobile-alt" style="font-size: 1.5rem; color: var(--primary);"></i>
                    <div>
                        <p style="font-weight: 600;">UPI</p>
                        <p class="text-muted" style="font-size: 0.9rem;">Google Pay, PhonePe, Paytm</p>
                    </div>
                </div>
            </button>
            
            <button class="card payment-method" onclick="selectPaymentMethod('Card')" style="border: 2px solid var(--border);">
                <div class="card-body" style="display: flex; align-items: center; gap: 12px;">
                    <i class="fas fa-credit-card" style="font-size: 1.5rem; color: var(--muted);"></i>
                    <div>
                        <p style="font-weight: 600;">Card</p>
                        <p class="text-muted" style="font-size: 0.9rem;">Credit / Debit Card</p>
                    </div>
                </div>
            </button>
        </div>
        
        <div id="payment-details">
            <div class="input-group">
                <label for="upi-id">UPI ID</label>
                <input type="text" id="upi-id" placeholder="yourname@upi">
            </div>
        </div>
        
        <button class="btn btn-primary btn-lg w-full" onclick="processPayment('${ticketType}', ${amount})">
            Pay ₹${amount}
        </button>
    `;
}

function selectPaymentMethod(method) {
    document.querySelectorAll('.payment-method').forEach(btn => {
        btn.style.borderColor = 'var(--border)';
        btn.querySelector('i').style.color = 'var(--muted)';
        btn.classList.remove('active');
    });
    
    event.currentTarget.style.borderColor = 'var(--primary)';
    event.currentTarget.querySelector('i').style.color = 'var(--primary)';
    event.currentTarget.classList.add('active');
    
    const detailsDiv = document.getElementById('payment-details');
    if (method === 'UPI') {
        detailsDiv.innerHTML = `
            <div class="input-group">
                <label for="upi-id">UPI ID</label>
                <input type="text" id="upi-id" placeholder="yourname@upi">
            </div>
        `;
    } else {
        detailsDiv.innerHTML = `
            <div class="input-group">
                <label for="card-number">Card Number</label>
                <input type="text" id="card-number" placeholder="1234 5678 9012 3456" maxlength="19">
            </div>
            <div class="grid grid-2">
                <div class="input-group">
                    <label for="expiry">Expiry</label>
                    <input type="text" id="expiry" placeholder="MM/YY">
                </div>
                <div class="input-group">
                    <label for="cvv">CVV</label>
                    <input type="password" id="cvv" placeholder="123" maxlength="3">
                </div>
            </div>
        `;
    }
}

function processPayment(ticketType, amount) {
    // Simulate payment processing
    const btn = event.currentTarget;
    btn.disabled = true;
    btn.innerHTML = '<div class="loading"></div> Processing...';
    
    setTimeout(() => {
        completeRegistration(ticketType, amount);
    }, 2000);
}

function completeRegistration(ticketType, amount) {
    const registration = {
        id: `REG-${Date.now()}`,
        eventId: state.selectedEventId,
        userId: state.user.id,
        ticketType: ticketType,
        qrCode: `EVENT-${state.selectedEventId}-USER-${state.user.id}-${Date.now()}`,
        registeredAt: new Date().toISOString(),
        amount: amount
    };
    
    state.registrations.push(registration);
    
    // Update event seats
    const event = state.events.find(e => e.id === state.selectedEventId);
    event.seatsLeft--;
    const ticketIndex = event.ticketTypes.findIndex(t => t.type === ticketType);
    event.ticketTypes[ticketIndex].available--;
    
    saveToLocalStorage();
    
    // Show success message
    showSuccessModal(event, ticketType, amount);
}

function showSuccessModal(event, ticketType, amount) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-body text-center" style="padding: 40px 20px;">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                
                <h2 style="margin-bottom: 8px;">Registration Successful! 🎉</h2>
                <p class="text-muted mb-3">Your ticket has been confirmed</p>
                
                <div class="card mb-3">
                    <div class="card-body" style="text-align: left;">
                        <div style="display: flex; justify-between; margin-bottom: 12px;">
                            <span class="text-muted">Event</span>
                            <span style="font-weight: 600;">${event.title}</span>
                        </div>
                        <div style="display: flex; justify-between; margin-bottom: 12px;">
                            <span class="text-muted">Ticket Type</span>
                            <span style="font-weight: 600;">${ticketType}</span>
                        </div>
                        <div style="display: flex; justify-between;">
                            <span class="text-muted">Amount Paid</span>
                            <span style="font-weight: 600; color: var(--primary);">₹${amount}</span>
                        </div>
                    </div>
                </div>
                
                <button class="btn btn-primary w-full mb-2" onclick="closeModal(); navigate('tickets');">
                    View My Tickets
                </button>
                <button class="btn btn-outline w-full" onclick="closeModal(); navigate('home');">
                    Back to Home
                </button>
            </div>
        </div>
    `;
    
    document.getElementById('modals').appendChild(modal);
}

function viewTicket(registrationId) {
    const registration = state.registrations.find(r => r.id === registrationId);
    const event = state.events.find(e => e.id === registration.eventId);
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>My Ticket</h3>
                <button class="modal-close" onclick="closeModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="qr-ticket">
                    <div style="position: relative; height: 120px; overflow: hidden; border-radius: var(--radius); margin-bottom: 16px;">
                        <img src="${event.poster}" alt="${event.title}" style="width: 100%; height: 100%; object-fit: cover;">
                        <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);"></div>
                        <div style="position: absolute; bottom: 12px; left: 16px; color: white;">
                            <h3 style="color: white;">${event.title}</h3>
                            <p style="opacity: 0.9;">${event.college}</p>
                        </div>
                    </div>
                    
                    <div class="grid grid-2 gap-2 mb-3">
                        <div>
                            <p class="text-muted" style="font-size: 0.85rem; margin-bottom: 4px;">Date</p>
                            <p style="font-weight: 600;">${formatDate(event.date)}</p>
                        </div>
                        <div>
                            <p class="text-muted" style="font-size: 0.85rem; margin-bottom: 4px;">Time</p>
                            <p style="font-weight: 600;">${event.time}</p>
                        </div>
                        <div style="grid-column: span 2;">
                            <p class="text-muted" style="font-size: 0.85rem; margin-bottom: 4px;">Venue</p>
                            <p style="font-weight: 600;">${event.venue}</p>
                        </div>
                    </div>
                    
                    <div class="qr-code">
                        <img src="${generateQRCode(registration.qrCode)}" alt="QR Code" style="width: 200px; height: 200px;">
                    </div>
                    
                    <p class="text-muted" style="font-size: 0.85rem; margin-top: 8px;">Ticket ID</p>
                    <p class="text-muted" style="font-size: 0.75rem; font-family: monospace;">${registration.id}</p>
                    
                    <div class="badge" style="margin-top: 16px; padding: 8px 16px;">${registration.ticketType} Ticket</div>
                    
                    <button class="btn btn-outline w-full mt-3" onclick="downloadTicket('${registration.id}')">
                        <i class="fas fa-download"></i> Download Ticket
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('modals').appendChild(modal);
}

function closeModal() {
    document.getElementById('modals').innerHTML = '';
}

function switchTab(index) {
    document.querySelectorAll('.tab-button').forEach((btn, i) => {
        btn.classList.toggle('active', i === index);
    });
    
    document.querySelectorAll('.tab-panel').forEach((panel, i) => {
        panel.classList.toggle('active', i === index);
    });
}

function addToCalendar(eventId) {
    const event = state.events.find(e => e.id === eventId);
    showToast(`Calendar sync: ${event.title} on ${formatDate(event.date)} at ${event.time}`, 'success');
}

function downloadTicket(registrationId) {
    showToast('Ticket download started', 'success');
}

function showCreateEventForm() {
    console.log('showCreateEventForm called');
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        padding: 20px;
    `;
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Create New Event</h3>
                <button class="modal-close" onclick="closeModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="input-group">
                    <label for="event-title">Event Title</label>
                    <input type="text" id="event-title" placeholder="Enter event title">
                </div>
                
                <div class="input-group">
                    <label for="event-category">Category</label>
                    <select id="event-category">
                        <option value="Tech">Tech</option>
                        <option value="Cultural">Cultural</option>
                        <option value="Sports">Sports</option>
                        <option value="Workshops">Workshops</option>
                    </select>
                </div>
                
                <div class="input-group">
                    <label for="event-description">Description</label>
                    <textarea id="event-description" placeholder="Describe your event..." rows="4"></textarea>
                </div>
                
                <div class="grid grid-2">
                    <div class="input-group">
                        <label for="event-date">Date</label>
                        <input type="date" id="event-date">
                    </div>
                    <div class="input-group">
                        <label for="event-time">Time</label>
                        <input type="time" id="event-time">
                    </div>
                </div>
                
                <div class="input-group">
                    <label for="event-venue">Venue</label>
                    <input type="text" id="event-venue" placeholder="Event location">
                </div>
                
                <div class="input-group">
                    <label for="event-seats">Total Seats</label>
                    <input type="number" id="event-seats" placeholder="Number of seats" min="1">
                </div>
                
                <div class="input-group">
                    <label for="event-price">Ticket Price (₹)</label>
                    <input type="number" id="event-price" placeholder="0 for free events" min="0">
                </div>
                
                <div class="flex gap-2">
                    <button class="btn btn-outline" style="flex: 1;" onclick="closeModal()">Cancel</button>
                    <button class="btn btn-primary" style="flex: 1;" onclick="createNewEvent()">Create Event</button>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('modals').appendChild(modal);
    
    // Ensure modal is visible
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
}

function createNewEvent() {
    const title = document.getElementById('event-title').value.trim();
    const category = document.getElementById('event-category').value;
    const description = document.getElementById('event-description').value.trim();
    const date = document.getElementById('event-date').value;
    const time = document.getElementById('event-time').value;
    const venue = document.getElementById('event-venue').value.trim();
    const seats = parseInt(document.getElementById('event-seats').value);
    const price = parseInt(document.getElementById('event-price').value) || 0;
    
    if (!title || !description || !date || !time || !venue || !seats) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    // Generate image URL based on event category
    function generateEventImageUrl(title, category) {
        // Pre-defined category-specific images that always work
        const categoryImages = {
            'Tech': [
                'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
                'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800',
                'https://images.unsplash.com/photo-1517077304055-6e2abbf6c5c5?w=800'
            ],
            'Cultural': [
                'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',
                'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800',
                'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800'
            ],
            'Sports': [
                'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
                'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800',
                'https://images.unsplash.com/photo-1552667466-07770ae110d0?w=800'
            ],
            'Workshops': [
                'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800',
                'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800',
                'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800'
            ]
        };
        
        // Get images for category or use default
        const images = categoryImages[category] || [
            'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'
        ];
        
        // Select random image from category
        return images[Math.floor(Math.random() * images.length)];
    }
    
    const newEvent = {
        id: Date.now().toString(),
        title,
        college: state.user.college.name,
        category,
        date,
        time,
        venue,
        organizer: `${state.user.name} - ${state.user.college.name}`,
        seatsLeft: seats,
        totalSeats: seats,
        poster: generateEventImageUrl(title, category),
        description,
        price,
        ticketTypes: [{
            type: price === 0 ? 'Free' : 'Basic',
            price: price,
            available: seats
        }]
    };
    
    state.events.unshift(newEvent);
    saveToLocalStorage();
    closeModal();
    showToast('Event created successfully! 🎉', 'success');
    render();
}

function deleteEvent(eventId, eventTitle) {
    if (confirm(`Are you sure you want to delete "${eventTitle}"? This action cannot be undone.`)) {
        // Remove event from state
        state.events = state.events.filter(event => event.id !== eventId);
        
        // Remove any registrations for this event
        state.registrations = state.registrations.filter(reg => reg.eventId !== eventId);
        
        // Save to localStorage
        saveToLocalStorage();
        
        // Show success message
        showToast(`"${eventTitle}" has been deleted`, 'success');
        
        // Re-render the organizer dashboard
        render();
    }
}

function saveProfile() {
    const name = document.getElementById('edit-name').value.trim();
    const email = document.getElementById('edit-email').value.trim();
    const collegeId = document.getElementById('edit-college').value;
    const isOrganizer = document.getElementById('edit-organizer').checked;
    
    if (!name || !email) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    state.user.name = name;
    state.user.email = email;
    state.user.college = COLLEGES.find(c => c.id === collegeId);
    state.user.isOrganizer = isOrganizer;
    
    saveToLocalStorage();
    navigate('profile');
    showToast('Profile updated successfully!', 'success');
}

function toggleDarkMode() {
    state.darkMode = !state.darkMode;
    document.body.classList.toggle('dark-mode');
    saveToLocalStorage();
    
    const toggle = document.getElementById('dark-mode-toggle');
    if (toggle) {
        toggle.classList.toggle('active');
    }
}

function clearCache() {
    if (confirm('Are you sure you want to clear the cache? This will remove all locally stored data except your profile.')) {
        showToast('Cache cleared successfully', 'success');
    }
}

function exportData() {
    const data = {
        user: state.user,
        registrations: state.registrations
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'eventhub-data.json';
    a.click();
    URL.revokeObjectURL(url);
    
    showToast('Data exported successfully', 'success');
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('appState');
        state.user = null;
        state.registrations = [];
        state.onboardingStep = 1;
        state.selectedCollege = null;
        state.selectedInterests = [];
        navigate('onboarding');
        showToast('Logged out successfully', 'success');
    }
}

function toggleFilters() {
    showToast('Filters', 'success');
}

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    
    if (state.user) {
        navigate('home');
    } else {
        navigate('onboarding');
    }
    
    // Setup bottom navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            navigate(item.dataset.screen);
        });
    });
});
