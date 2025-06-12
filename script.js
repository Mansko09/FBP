const businessHours = {
  0: null,                     // Dimanche : fermé
  1: { open: "10:30", close: "20:00" }, // Lundi
  2: { open: "09:30", close: "20:00" }, // Mardi
  3: { open: "09:30", close: "20:00" }, // Mercredi
  4: { open: "09:30", close: "20:00" }, // Jeudi
  5: { open: "09:30", close: "20:00" }, // Vendredi
  6: { open: "08:30", close: "20:00" }  // Samedi
};


// Mobile Navigation
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }

    // Initialize page-specific functionality
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    switch(currentPage) {
        case 'gallery.html':
            initializeGallery();
            break;
        case 'booking.html':
            initializeBooking();
            break;
        case 'contact.html':
            initializeContact();
            break;
    }
});

// Gallery Functionality
function initializeGallery() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter gallery items
            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    item.classList.add('fade-in');
                } else {
                    item.style.display = 'none';
                    item.classList.remove('fade-in');
                }
            });
        });
    });
}

// Lightbox Functionality
function openLightbox(button) {
    const galleryItem = button.closest('.gallery-item');
    const img = galleryItem.querySelector('img');
    const title = galleryItem.querySelector('.gallery-info h3').textContent;
    const description = galleryItem.querySelector('.gallery-info p').textContent;
    
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDescription = document.getElementById('lightbox-description');
    
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxTitle.textContent = title;
    lightboxDescription.textContent = description;
    
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close lightbox when clicking on background
document.addEventListener('click', function(e) {
    const lightbox = document.getElementById('lightbox');
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// Booking Functionality
let currentStep = 1;
let bookingData = {
    service: null,
    date: null,
    time: null,
    duration: null,
    price: null,
    customer: {}
};

function initializeBooking() {
    initializeCalendar();
    setupServiceSelection();
    setupFormValidation();
}

function setupServiceSelection() {
    const serviceOptions = document.querySelectorAll('input[name="service"]');
    serviceOptions.forEach(option => {
        option.addEventListener('change', function() {
            if (this.checked) {
                bookingData.service = this.value;
                bookingData.duration = parseInt(this.getAttribute('data-duration'));
                bookingData.price = parseInt(this.getAttribute('data-price'));
                
                // Enable next button
                const nextBtn = document.querySelector('#step-1 .next-step');
                nextBtn.disabled = false;
            }
        });
    });
}

function nextStep(step) {
    // Validate current step
    if (!validateCurrentStep()) {
        return;
    }
    
    // Hide current step
    document.querySelector('.booking-step.active').classList.remove('active');
    
    // Show next step
    document.getElementById(`step-${step}`).classList.add('active');
    currentStep = step;
    
    // Initialize step-specific functionality
    if (step === 3) {
        generateTimeSlots();
    } else if (step === 5) {
        updateBookingSummary();
    }
}

function previousStep(step) {
    document.querySelector('.booking-step.active').classList.remove('active');
    document.getElementById(`step-${step}`).classList.add('active');
    currentStep = step;
}

function validateCurrentStep() {
    switch(currentStep) {
        case 1:
            return bookingData.service !== null;
        case 2:
            return bookingData.date !== null;
        case 3:
            return bookingData.time !== null;
        case 4:
            const form = document.getElementById('booking-form');
            const firstName = form.firstName.value.trim();
            const lastName = form.lastName.value.trim();
            const phone = form.phone.value.trim();
            const email = form.email.value.trim();
            
            if (!firstName || !lastName || !phone || !email) {
                alert('Veuillez remplir tous les champs obligatoires.');
                return false;
            }
            
            bookingData.customer = {
                firstName,
                lastName,
                phone,
                email,
                notes: form.notes.value.trim()
            };
            return true;
        default:
            return true;
    }
}

// Calendar Functionality
let currentDate = new Date();
let selectedDate = null;

function initializeCalendar() {
    const prevBtn = document.getElementById('prev-month');
    const nextBtn = document.getElementById('next-month');
    
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            generateCalendar();
        });
        
        nextBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            generateCalendar();
        });
        
        generateCalendar();
    }
}

function generateCalendar() {
    const monthNames = [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    
    const monthYear = document.getElementById('calendar-month-year');
    const calendarGrid = document.getElementById('calendar-grid');
    
    if (!monthYear || !calendarGrid) return;
    
    monthYear.textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    
    // Clear previous calendar
    calendarGrid.innerHTML = '';
    
    // Add day headers
    const dayHeaders = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    dayHeaders.forEach(day => {
        const headerEl = document.createElement('div');
        headerEl.textContent = day;
        headerEl.style.fontWeight = 'bold';
        headerEl.style.textAlign = 'center';
        headerEl.style.padding = '8px';
        headerEl.style.color = '#6B7280';
        calendarGrid.appendChild(headerEl);
    });
    
    // Get first day of month and number of days
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    // Generate calendar days
    const today = new Date();
    today.setHours(0, 0, 0, 0);


    for (let i = 0; i < 42; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);

    const dayEl = document.createElement('button');
    dayEl.type = 'button';
    dayEl.className = 'calendar-day';
    dayEl.textContent = date.getDate();

    // jours hors mois
    if (date.getMonth() !== currentDate.getMonth()) {
      dayEl.classList.add('other-month');
    }

    // avant aujourd'hui ou fermé
    const weekday = date.getDay();
    if (date < today || businessHours[weekday] === null) {
      dayEl.classList.add('disabled');
    } else {
      dayEl.addEventListener('click', () => selectDate(date, dayEl));
    }

    calendarGrid.appendChild(dayEl);
  }
}

function selectDate(date, element) {
    // Remove previous selection
    document.querySelectorAll('.calendar-day.selected').forEach(el => {
        el.classList.remove('selected');
    });
    
    // Add selection to clicked element
    element.classList.add('selected');
    
    // Store selected date
    selectedDate = new Date(date);
    bookingData.date = selectedDate;
    generateTimeSlots();
    // Enable next button
    const nextBtn = document.querySelector('#step-2 .next-step');
    nextBtn.disabled = false;
}


function generateTimeSlots() {
  const timeSlotsContainer = document.getElementById('time-slots');
  if (!timeSlotsContainer) return;
  timeSlotsContainer.innerHTML = '';

  if (!selectedDate) return;

  const weekday = selectedDate.getDay();
  const hours = businessHours[weekday];
  if (!hours) {
    timeSlotsContainer.innerHTML = '<p>Le salon est fermé ce jour-là.</p>';
    return;
  }

  // Convertir "HH:MM" en minutes depuis minuit
  const [openH, openM] = hours.open.split(':').map(Number);
  const [closeH, closeM] = hours.close.split(':').map(Number);
  const startMinutes = openH * 60 + openM;
  const endMinutes = closeH * 60 + closeM;

  const slotDuration = 30; // en minutes
  console.log(
    '[generateTimeSlots]',
    'date=', bookingData.date,
    'jour=', bookingData.date.getDay(),
    'durée=', bookingData.duration,
    'ouverture=', hours.open,
    'fermeture=', hours.close
    );

  for (let mins = startMinutes; mins + slotDuration <= endMinutes; mins += slotDuration) {
    const hour = Math.floor(mins / 60);
    const minute = mins % 60;
    const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

    const slotEl = document.createElement('button');
    slotEl.type = 'button';
    slotEl.className = 'time-slot';
    slotEl.textContent = timeString;

    // // Ici, vous pouvez remplacer la logique "aléatoire" par un appel réel de disponibilité
    // if (Math.random() < 0.3) {
    //   slotEl.classList.add('disabled');
    // } else {
    //   slotEl.addEventListener('click', () => selectTimeSlot(timeString, slotEl));
    // }
    // À la place de votre bloc random
    slotEl.addEventListener('click', () => selectTimeSlot(timeString, slotEl));

    timeSlotsContainer.appendChild(slotEl);
  }
}


function selectTimeSlot(time, element) {
    // Remove previous selection
    document.querySelectorAll('.time-slot.selected').forEach(el => {
        el.classList.remove('selected');
    });
    
    // Add selection to clicked element
    element.classList.add('selected');
    
    // Store selected time
    bookingData.time = time;
    
    // Enable next button
    const nextBtn = document.querySelector('#step-3 .next-step');
    nextBtn.disabled = false;
}

// Booking Summary
function updateBookingSummary() {
    const serviceNames = {
        'cornrows': 'Cornrows',
        'box-braids': 'Box-braids',
        'twist-vanilles': 'Twist-vanilles',
        'knotless-braids': 'knotless-braids',
        'crochet-braids': 'crochet-braids',
        'piques-laches': 'piques-laches',
        'bantu-knots': 'bantu-knots',
        'passion-twists': 'passion-twists',
        'fulani-tribal': 'fulani-tribal',
        'goddess-boho-braids': 'goddess-boho-braids',
        'goddess-boho-knotless':'goddess-boho-knotless',
        'curly-knotless':'curly-knotless',
        'curly-braids':'curly-braids',
        'soft-locks':'soft-locks',
        'faux-locks': 'faux-locks',
        'boholocks':'boholocks',
        'ponytail':'ponytail',
        'tissage-lace': 'tissage-lace',
        'shampooing-soins':'shampooing-soins',
        'retrait-tresses':'retrait-tresses',
    };
    
    const formatDate = (date) => {
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        return date.toLocaleDateString('fr-FR', options);
    };
    
    // const formatDuration = (minutes) => {
    //     const hours = Math.floor(minutes / 60);
    //     const mins = minutes % 60;
    //     if (hours > 0 && mins > 0) {
    //         return `${hours}h${mins.toString().padStart(2, '0')}`;
    //     } else if (hours > 0) {
    //         return `${hours}h`;
    //     } else {
    //         return `${mins}min`;
    //     }
    // };
    
    document.getElementById('summary-service').textContent = serviceNames[bookingData.service];
    document.getElementById('summary-date').textContent = formatDate(bookingData.date);
    document.getElementById('summary-time').textContent = bookingData.time;
    // document.getElementById('summary-duration').textContent = formatDuration(bookingData.duration);
    document.getElementById('summary-price').textContent = `À partir de ${bookingData.price}€`;
    document.getElementById('summary-client').textContent = `${bookingData.customer.firstName} ${bookingData.customer.lastName}`;
    document.getElementById('summary-phone').textContent = bookingData.customer.phone;
}

// Form Submission
function setupFormValidation() {
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show confirmation modal
            const modal = document.getElementById('confirmation-modal');
            modal.style.display = 'flex';
            
            // Reset booking data for next booking
            setTimeout(() => {
                resetBooking();
            }, 3000);
        });
    }
}

function closeModal() {
    const modal = document.getElementById('confirmation-modal');
    modal.style.display = 'none';
    
    // Redirect to home page
    window.location.href = 'index.html';
}

function resetBooking() {
    currentStep = 1;
    bookingData = {
        service: null,
        date: null,
        time: null,
        duration: null,
        price: null,
        customer: {}
    };
    
    // Reset form
    const form = document.getElementById('booking-form');
    form.reset();
    
    // Show first step
    document.querySelectorAll('.booking-step').forEach(step => {
        step.classList.remove('active');
    });
    document.getElementById('step-1').classList.add('active');
}

// Contact Form
function initializeContact() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Simulate form submission
            alert('Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.');
            
            // Reset form
            this.reset();
        });
    }
}

// Smooth scrolling for anchor links
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Add scroll effect to navbar
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 25px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        }
    }
});

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.feature-card, .service-card, .gallery-item, .contact-card');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
});

// Keyboard navigation for accessibility
document.addEventListener('keydown', function(e) {
    // Close lightbox with Escape key
    if (e.key === 'Escape') {
        const lightbox = document.getElementById('lightbox');
        if (lightbox && lightbox.style.display === 'flex') {
            closeLightbox();
        }
        
        const modal = document.getElementById('confirmation-modal');
        if (modal && modal.style.display === 'flex') {
            closeModal();
        }
    }
});

// Preload images for better performance
function preloadImages() {
    const imageUrls = [
        'https://images.pexels.com/photos/3065209/pexels-photo-3065209.jpeg',
        'https://images.pexels.com/photos/3065171/pexels-photo-3065171.jpeg',
        'https://images.pexels.com/photos/3065204/pexels-photo-3065204.jpeg',
        'https://images.pexels.com/photos/3228213/pexels-photo-3228213.jpeg'
    ];
    
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

// Initialize preloading when page loads
document.addEventListener('DOMContentLoaded', preloadImages);

// Add loading states for better UX
function showLoading(element) {
    element.style.opacity = '0.6';
    element.style.pointerEvents = 'none';
}

function hideLoading(element) {
    element.style.opacity = '1';
    element.style.pointerEvents = 'auto';
}

// Form validation helpers
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\d\s\-\+\(\)]{10,}$/;
    return re.test(phone);
}

// Add real-time form validation
document.addEventListener('input', function(e) {
    if (e.target.type === 'email') {
        const isValid = validateEmail(e.target.value);
        e.target.style.borderColor = isValid ? '#10B981' : '#EF4444';
    }
    
    if (e.target.type === 'tel') {
        const isValid = validatePhone(e.target.value);
        e.target.style.borderColor = isValid ? '#10B981' : '#EF4444';
    }
});