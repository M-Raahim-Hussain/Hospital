// 1. IMMEDIATE THEME INITIALIZATION (Executes before body parses to prevent flash)
(function() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-bs-theme', savedTheme);
})();

document.addEventListener("DOMContentLoaded", function () {
    
    // ====== 2. DARK THEME TOGGLE LOGIC ======
    const darkSwitch = document.getElementById('darkSwitch');
    if (darkSwitch) {
        const currentTheme = localStorage.getItem('theme') || 'light';
        darkSwitch.checked = currentTheme === 'dark';

        darkSwitch.addEventListener('change', function() {
            const newTheme = this.checked ? 'dark' : 'light';
            document.documentElement.setAttribute('data-bs-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // ====== 3. FAB (FLOATING ACTION BUTTON) LOGIC ======
    const fabBtn = document.getElementById('fabBtn');
    const fabMenu = document.getElementById('fabMenu');
    const fabWrapper = document.getElementById('whatsappFabWrapper');

    if (fabBtn && fabMenu) {
        fabBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            fabMenu.classList.toggle('show');
        });

        // Close FAB when clicking anywhere outside the wrapper
        document.addEventListener('click', function (e) {
            if (fabWrapper && !fabWrapper.contains(e.target)) {
                fabMenu.classList.remove('show');
            }
        });
    }

    // ====== 4. NAVIGATION AUTO-CLOSE (For Mobile) ======
    const navLinks = document.querySelectorAll('.nav-link');
    const menuToggle = document.getElementById('navbarNav');
    
    // Only initialize if Bootstrap JS is available and the element exists
    if (menuToggle && typeof bootstrap !== 'undefined') {
        const bsCollapse = new bootstrap.Collapse(menuToggle, { toggle: false });
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                const toggler = document.querySelector('.navbar-toggler');
                // Only hide if the hamburger menu is actually visible (mobile view)
                if (toggler && window.getComputedStyle(toggler).display !== 'none') {
                    bsCollapse.hide();
                }
            });
        });
    }

    // ====== 5. ROOM BOOKING DYNAMIC DROPDOWN & PREVIEW ======
    const roomType = document.getElementById("roomType");
    const roomPreview = document.getElementById('roomPreview');
    
    if (roomType) {
        roomType.addEventListener("change", function () {
            const roomNumber = document.getElementById("roomNumber");
            if (!roomNumber) return;

            // Reset and add default option
            roomNumber.innerHTML = '<option value="">Select</option>';
            
            // Populate based on selection
            if (this.value === "private") {
                [101, 102, 103, 104].forEach(num => roomNumber.innerHTML += `<option value="${num}">Room ${num}</option>`);
            } else if (this.value === "semi") {
                ["B1", "B2", "B3", "B4"].forEach(num => roomNumber.innerHTML += `<option value="${num}">Bed ${num}</option>`);
            } else if (this.value === "general") {
                ["Ward-A", "Ward-B", "Ward-C"].forEach(num => roomNumber.innerHTML += `<option value="${num}">${num}</option>`);
            }
            
            // Image Preview Mapping
            const roomImages = {
                'private': 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=400',
                'semi': 'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=400',
                'general': 'https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=400'
            };

            if (roomPreview) {
                if (this.value && roomImages[this.value]) {
                    roomPreview.src = roomImages[this.value];
                    roomPreview.classList.remove('d-none');
                } else {
                    roomPreview.classList.add('d-none');
                }
            }
        });
    }

    // ====== 6. REFINED LOGOUT LOGIC ======
    // Recommendation: Add a class 'logout-link' to your logout anchor tags
    const logoutLinks = document.querySelectorAll('.logout-link, a[href="index.html"]');
    logoutLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Check if it's actually a logout attempt (to avoid interrupting "Home" clicks)
            if (this.innerText.toLowerCase().includes('logout') || this.classList.contains('logout-link')) {
                if (confirm("Are you sure you want to log out?")) {
                    const theme = localStorage.getItem('theme');
                    localStorage.clear();
                    if (theme) localStorage.setItem('theme', theme); // Preserve theme preference
                } else {
                    e.preventDefault();
                }
            }
        });
    });
});

// Global Trigger for Booking Modal
function openBooking() { 
    const modalEl = document.getElementById("bookingModal");
    if(modalEl && typeof bootstrap !== 'undefined') {
        const modal = new bootstrap.Modal(modalEl);
        modal.show();
    }
}

// ====== 7. PROFILE PERSISTENCE LOGIC (Only runs on profile page) ======
document.addEventListener("DOMContentLoaded", function () {
    const profileForm = document.getElementById('profileForm');
    if (!profileForm) return; // Exit if not on profile page

    // Load saved data from LocalStorage
    const savedData = JSON.parse(localStorage.getItem('userProfile'));
    if (savedData) {
        document.getElementById('fullName').value = savedData.name || '';
        document.getElementById('emailAddr').value = savedData.email || '';
        document.getElementById('phoneNum').value = savedData.phone || '';
        document.getElementById('dob').value = savedData.dob || '';
        document.getElementById('bloodGroup').value = savedData.blood || 'A+';
        document.getElementById('emergencyContact').value = savedData.emergency || '';
        if(document.getElementById('displayUserName')) {
            document.getElementById('displayUserName').innerText = savedData.name;
        }
    }

    // Save Data on Submit
    profileForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const saveBtn = document.getElementById('saveBtn');
        const btnText = document.getElementById('btnText');

        // UI Feedback
        btnText.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Saving...';
        saveBtn.disabled = true;

        const userData = {
            name: document.getElementById('fullName').value,
            email: document.getElementById('emailAddr').value,
            phone: document.getElementById('phoneNum').value,
            dob: document.getElementById('dob').value,
            blood: document.getElementById('bloodGroup').value,
            emergency: document.getElementById('emergencyContact').value
        };

        // Simulate a tiny delay for "Hardcore" feel
        setTimeout(() => {
            localStorage.setItem('userProfile', JSON.stringify(userData));
            btnText.innerText = "Changes Saved!";
            saveBtn.classList.replace('btn-primary', 'btn-success');
            
            setTimeout(() => {
                saveBtn.disabled = false;
                btnText.innerText = "Save Changes";
                saveBtn.classList.replace('btn-success', 'btn-primary');
            }, 2000);
        }, 800);
    });
});

window.addEventListener('scroll', function() {
    const nav = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled', 'shadow-sm');
    } else {
        nav.classList.remove('scrolled', 'shadow-sm');
    }
});