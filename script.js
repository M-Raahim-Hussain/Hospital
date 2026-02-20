document.addEventListener("DOMContentLoaded", function () {
    // 1. THEME INITIALIZATION (Apply saved theme immediately)
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-bs-theme', savedTheme);

    // 2. THEME TOGGLE LOGIC (If the switch exists on this page)
    const darkSwitch = document.getElementById('darkSwitch');
    if (darkSwitch) {
        darkSwitch.checked = savedTheme === 'dark';
        darkSwitch.addEventListener('change', function() {
            const newTheme = this.checked ? 'dark' : 'light';
            document.documentElement.setAttribute('data-bs-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }
    // ====== NAVIGATION ======
    const navLinks = document.querySelectorAll('.nav-link');
    const menuToggle = document.getElementById('navbarNav');

    if (menuToggle) {
        const bsCollapse = new bootstrap.Collapse(menuToggle, { toggle: false });
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                const toggler = document.querySelector('.navbar-toggler');
                if (toggler && window.getComputedStyle(toggler).display !== 'none') {
                    bsCollapse.hide();
                }
            });
        });
    }

    // ====== BOOKING/ROOM MODAL ======
    window.openBooking = function () {
        new bootstrap.Modal(document.getElementById("bookingModal")).show();
    };

    const roomType = document.getElementById("roomType");
    const roomNumber = document.getElementById("roomNumber");

    if(roomType) {
        roomType.addEventListener("change", function () {
            roomNumber.innerHTML = '<option value="">Select</option>';
            if (this.value === "private") {
                [101, 102, 103, 104].forEach(num => roomNumber.innerHTML += `<option value="${num}">Room ${num}</option>`);
            } else if (this.value === "semi") {
                ["B1", "B2", "B3", "B4"].forEach(num => roomNumber.innerHTML += `<option value="${num}">${num}</option>`);
            } else if (this.value === "general") {
                ["Bed-1", "Bed-2", "Bed-3", "Bed-4"].forEach(bed => roomNumber.innerHTML += `<option value="${bed}">${bed}</option>`);
            }
        });
    }
    document.getElementById('roomType').addEventListener('change', function() {
    const previewImg = document.getElementById('roomPreview');
    const selectedType = this.value;

    // Define your image URLs here
    const roomImages = {
        'private': 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=400', // Example Private Room
        'semi': 'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=400',    // Example Semi Private
        'general': 'https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=400'    // Example General Ward
    };

    if (selectedType && roomImages[selectedType]) {
        previewImg.src = roomImages[selectedType];
        previewImg.classList.remove('d-none'); // Show the image
    } else {
        previewImg.classList.add('d-none'); // Hide if no selection
    }
});


    // ====== VACANCIES accademic succes stories ======
     const academicSubmit = document.getElementById("academicSubmit");

  if (academicSubmit) {
    academicSubmit.addEventListener("click", function () {

      // Close Academics Modal
      const academicsModalEl = document.getElementById("academicsModal");
      const academicsModal = bootstrap.Modal.getInstance(academicsModalEl);
      academicsModal.hide();

      // Open Result Modal AFTER close animation
      setTimeout(() => {
        const resultModal = new bootstrap.Modal(
          document.getElementById("academicResultModal")
        );
        resultModal.show();
      }, 400);
    });
  }

  // ===== Vacancy Search Button =====
  const vacancySearch = document.getElementById("vacancySearch");

  if (vacancySearch) {
    vacancySearch.addEventListener("click", function () {
      // For now, simulate search action
      this.innerText = "Searching...";
      this.disabled = true;

      setTimeout(() => {
        this.innerText = "Search Vacancies";
        this.disabled = false;
        alert("Vacancies filtered successfully.");
      }, 1000);
        });
    }
});

// ====== CENTRE MODAL WITH DYNAMIC DOCTORS ======
function openCentreModal(title, description, doctors) {
    // 1. Set Content
    document.getElementById('centreTitle').innerText = title;
    document.getElementById('centreDescription').innerText = description;

    // 2. Update Doctor List (Visual)
    const doctorList = document.getElementById('doctorList');
    doctorList.innerHTML = '';
    
    // 3. Update Dropdown (Selection)
    const doctorSelect = document.getElementById('doctorSelect');
    doctorSelect.innerHTML = '<option value="" selected disabled>Select Doctor</option>';

    doctors.forEach(doc => {
        // List update
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.innerText = doc;
        doctorList.appendChild(li);

        // Select update
        const option = document.createElement('option');
        option.value = doc;
        option.innerText = doc;
        doctorSelect.appendChild(option);
    });

    const modalEl = document.getElementById('centreModal');
    const modal = new bootstrap.Modal(modalEl);
    modal.show();

    // 4. Confirm Button Logic
    const confirmBtn = modalEl.querySelector(".confirm-btn");
    const appointmentForm = document.getElementById("appointmentForm");

    // Clone button to remove previous event listeners
    const newConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);

    newConfirmBtn.addEventListener("click", function () {
        if (!appointmentForm.checkValidity()) {
            appointmentForm.reportValidity();
            return;
        }

        // Hide current modal
        modal.hide();

        // Show Success Modal
        const successNotify = new bootstrap.Modal(document.getElementById('successNotifyModal'));
        document.querySelector('#successNotifyModal p').innerText = `Your appointment with ${doctorSelect.value} at ${title} has been confirmed. Our team will call you soon.`;
        
        successNotify.show();
        appointmentForm.reset();
    });
}

// Global modal triggers
function openMedicalModal() { new bootstrap.Modal(document.getElementById("medicalModal")).show(); }
function openOtherModal() { new bootstrap.Modal(document.getElementById("otherModal")).show(); }
function openICUModal() { new bootstrap.Modal(document.getElementById('icuModal')).show(); }


// help desk
document.addEventListener("DOMContentLoaded", function () {
    const cards = document.querySelectorAll("#departments .card");

    cards.forEach(card => {
        const title = card.querySelector("h5");
        if (title && title.innerText.trim() === "Helpdesk") {
            card.style.cursor = "pointer";

            card.addEventListener("click", function () {
                const modal = new bootstrap.Modal(
                    document.getElementById("helpdeskModal")
                );
                modal.show();
            });
        }
    });
});

// doctor schedule
 // 1. DATA: 20 Doctors ka yahan data store kiya gaya hai
        // Har doctor ke liye ID, Name, Spec, Desc aur Image URL hai.
      // 1. Move data to global scope so all functions can see it
// Data stays at the top level
// Premium Doctor Database
const doctors = [
    { id: 1, name: "Dr. Sarah Johnson", spec: "Cardiologist", bio: "Heart surgery & cardiovascular health specialist with 15yrs experience.", img: "https://i.pravatar.cc/150?u=sarah" },
    { id: 2, name: "Dr. James Smith", spec: "Neurologist", bio: "Specializes in brain disorders, stroke recovery, and nervous system.", img: "https://i.pravatar.cc/150?u=james" },
    { id: 3, name: "Dr. Emily Davis", spec: "Pediatrician", bio: "Caring expert for infants and children's vaccinations & wellness.", img: "https://i.pravatar.cc/150?u=emily" }
    // ... add others back here
];

document.addEventListener("DOMContentLoaded", () => {
    const selector = document.getElementById('mainDocSelect');
    const bookingForm = document.getElementById('premiumBookingForm');
    
    // 1. Populate Dropdown
    if(selector) {
        const options = doctors.map(d => `<option value="${d.id}">${d.name} (${d.spec})</option>`).join('');
        selector.innerHTML = `<option value="" disabled selected>Choose your doctor...</option>` + options;
        
        // Add change listener
        selector.addEventListener('change', syncDoctorUI);
    }
});

function syncDoctorUI() {
    const selector = document.getElementById('mainDocSelect');
    const submitBtn = document.getElementById('submitBtn');
    const doc = doctors.find(d => d.id == selector.value);
    const preview = document.getElementById('docPreview');

    if (doc) {
        // Smoothly reveal preview
        preview.classList.remove('d-none');
        document.getElementById('prevImg').src = doc.img;
        document.getElementById('prevName').innerText = doc.name;
        document.getElementById('prevSpec').innerText = doc.spec;
        document.getElementById('prevBio').innerText = doc.bio;
        
        // Enable button
        submitBtn.disabled = false;
    }
}

function processBooking(e) {
    e.preventDefault();
    
    // Select Elements
    const btn = document.getElementById('submitBtn');
    const bookModalEl = document.getElementById('doctorModal');
    const bookModal = bootstrap.Modal.getInstance(bookModalEl);
    const successModal = new bootstrap.Modal(document.getElementById('successModal'));

    // Loading State
    btn.innerHTML = `<span class="spinner-border spinner-border-sm"></span> Processing...`;
    btn.disabled = true;

    // Simulate API Call
    setTimeout(() => {
        bookModal.hide();
        
        // Show success
        successModal.show();

        // Reset Form
        setTimeout(() => {
            e.target.reset();
            document.getElementById('docPreview').classList.add('d-none');
            btn.innerHTML = 'Complete Reservation';
            btn.disabled = true;
        }, 500);
    }, 1200);
}
        // ================= PATIENT REGISTRATION SYSTEM =================
let patientCount = 1001;

document.getElementById("registrationForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const patientId = "CH-" + patientCount++;

    // Gathering Form Data
    const name = document.getElementById("regName").value;
    const gender = document.getElementById("regGender").value;
    const age = document.getElementById("regAge").value;
    const phone = document.getElementById("regPhone").value;
    const department = document.getElementById("regDepartment").value;
    // Getting value from checked radio button
    const visit = document.querySelector('input[name="visitType"]:checked').value;

    const tableBody = document.getElementById("patientTableBody");

    // Clean placeholder if exists
    if (tableBody.children[0]?.children.length === 1) {
        tableBody.innerHTML = "";
    }

    // Creating Table Row
    const row = document.createElement("tr");
    row.innerHTML = `
        <td class="fw-bold text-primary">${patientId}</td>
        <td>${name}</td>
        <td>${gender}</td>
        <td>${age}</td>
        <td><span class="badge bg-light text-dark border">${department}</span></td>
        <td>${phone}</td>
        <td><span class="badge ${visit === 'Emergency' ? 'bg-danger' : 'bg-info'}">${visit}</span></td>
    `;

    tableBody.appendChild(row);

    // Show Patient ID in success modal
    document.getElementById("generatedPatientId").innerText = patientId;

    // 1. Close registration modal automatically
    const regModalEl = document.getElementById("registrationModal");
    const regModal = bootstrap.Modal.getInstance(regModalEl);
    if (regModal) regModal.hide();

    // 2. Reset form
    this.reset();

    // 3. Show success modal
    const successModal = new bootstrap.Modal(document.getElementById("registrationSuccessModal"));
    successModal.show();
});
// billing
document.addEventListener('DOMContentLoaded', () => {
    const billingForm = document.getElementById('billingForm');
    const paymentMethod = document.getElementById('paymentMethod');
    const insuranceDetails = document.getElementById('insuranceDetails');
    const billingModalObj = new bootstrap.Modal(document.getElementById('billingModal'));
    const confirmationModalObj = new bootstrap.Modal(document.getElementById('confirmationModal'));

    // Toggle Insurance field visibility
    paymentMethod.addEventListener('change', (e) => {
        if (e.target.value === 'Insurance') {
            insuranceDetails.classList.remove('d-none');
        } else {
            insuranceDetails.classList.add('d-none');
        }
    });

    // Handle Form Submit
    billingForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('patientName').value;
        const amount = parseFloat(document.getElementById('billingAmount').value);
        const method = paymentMethod.value;
        const service = document.getElementById('serviceType').value;

        // Prevent negative numbers (Secondary Check)
        if (amount < 0) return;

        // Close entry modal and show success
        billingModalObj.hide();
        
        document.getElementById('receiptSummary').innerHTML = `
            ${service}<br>
            <strong>${name}</strong><br>
            <span class="fs-5 fw-bold text-dark">$${amount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span><br>
            <small class="text-uppercase">${method} Payment</small>
        `;
        
        confirmationModalObj.show();
        billingForm.reset();
        insuranceDetails.classList.add('d-none');
    });
});
// querry and feedback
document.addEventListener('DOMContentLoaded', () => {
    const queryForm = document.getElementById('queryForm');
    const feedbackForm = document.getElementById('feedbackForm');
    const successModal = new bootstrap.Modal(document.getElementById('formSuccessModal'));
    const successText = document.getElementById('successMessage');

    // Handle Query Submission
    queryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('queryName').value;
        
        // Custom message
        successText.innerText = `Hi ${name}, your query has been received. Our team will contact you shortly.`;
        
        // Reset and Show
        queryForm.reset();
        successModal.show();
    });

    // Handle Feedback Submission
    feedbackForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const pName = document.getElementById('feedbackPatientName').value;
        
        // Custom message
        successText.innerText = `Feedback for ${pName} has been submitted. We appreciate your valuable input!`;
        
        // Reset and Show
        feedbackForm.reset();
        successModal.show();
    });
});
// icu
function openICUModal() {
    document.getElementById("icuModal").style.display = "block";
    document.body.style.overflow = "hidden"; // Prevent scrolling behind modal
}

function closeICUModal() {
    document.getElementById("icuModal").style.display = "none";
    document.body.style.overflow = "auto"; // Re-enable scrolling
}

// Close modal if user clicks anywhere outside of the box
window.onclick = function(event) {
    let modal = document.getElementById("icuModal");
    if (event.target == modal) {
        closeICUModal();
    }
}
function triggerEmergency() {
    const confirmCall = confirm("Would you like to dial the Cambridge Hospital ICU emergency line?");
    if (confirmCall) {
        window.location.href = "tel:+1234567890";
    }
}
// contact us
(function() {
        // Using very specific constant names to avoid any global overlap
        const cambridgeForm = document.getElementById('CH-Unique-Form');
        const cambridgeModal = document.getElementById('CH-Success-Modal');

        if (cambridgeForm && cambridgeModal) {
            cambridgeForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Trigger modal only if form is valid
                if (this.checkValidity()) {
                    const hospitalPopup = new bootstrap.Modal(cambridgeModal);
                    hospitalPopup.show();
                    this.reset();
                }
            });
        }
    })();
    // Pharmacy and bloodbank
// Function called by your card onclick
function openMedicalModal() {
    goBackToSelection(); // Ensure it starts at selection screen
    const myModal = new bootstrap.Modal(document.getElementById('medicalModal'));
    myModal.show();
}

function showFacility(type) {
    const selection = document.getElementById('selectionScreen');
    const content = document.getElementById('contentScreen');
    const details = document.getElementById('facilityDetails');
    
    selection.classList.add('d-none');
    content.classList.remove('d-none');

    if (type === 'pharmacy') {
        document.getElementById('medicalModalLabel').innerText = "Pharmacy Inventory";
        details.innerHTML = `
            <table class="table table-hover">
                <thead class="table-light">
                    <tr><th>Medicine</th><th>Category</th><th>Price</th></tr>
                </thead>
                <tbody>
                    <tr><td>Panadol (500mg)</td><td>Painkiller</td><td>Rs. 20</td></tr>
                    <tr><td>Amoxicillin</td><td>Antibiotic</td><td>Rs. 150</td></tr>
                    <tr><td> inj Insulin</td><td>Diabetes</td><td>Rs. 1200</td></tr>
                     <tr><td>Tab Extor 5/80</td><td>Diabetes</td><td>Rs. 350</td></tr>
                        <tr><td>Tab Nims</td><td>Headache</td><td>Rs. 130</td></tr>
                           <tr><td>Tab Synflex 550mg</td><td>Toothache</td><td>Rs. 300</td></tr>
                              <tr><td>Cap Daflon 500mg</td><td>Hemorrhoids</td><td>Rs.600</td></tr>
                                 <tr><td>Tab Lexeborn</td><td>Constipation</td><td>Rs. 70</td></tr>
                </tbody>
            </table>`;
    } else {
        document.getElementById('medicalModalLabel').innerText = "Blood Bank Status";
        details.innerHTML = `
            <div class="row text-center">
                <div class="col-4 mb-3"><div class="p-3 border rounded bg-danger text-white"><h5>A+</h5><small>12 Units</small></div></div>
                <div class="col-4 mb-3"><div class="p-3 border rounded bg-danger text-white"><h5>B+</h5><small>5 Units</small></div></div>
                <div class="col-4 mb-3"><div class="p-3 border rounded bg-secondary text-white"><h5>O-</h5><small>Out of Stock</small></div></div>
                <div class="col-4 mb-3"><div class="p-3 border rounded bg-danger text-white"><h5>AB+</h5><small>2 Units</small></div></div>
            </div>`;
    }
}

function goBackToSelection() {
    document.getElementById('selectionScreen').classList.remove('d-none');
    document.getElementById('contentScreen').classList.add('d-none');
    document.getElementById('medicalModalLabel').innerText = "Medical Facilities";
}


document.addEventListener('DOMContentLoaded', function() {
    const bookingForm = document.getElementById('bookingForm');

    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent page refresh

            // 1. Hide the current Booking Modal
            const bookingModalEl = document.getElementById('bookingModal');
            const bookingModal = bootstrap.Modal.getInstance(bookingModalEl);
            if (bookingModal) {
                bookingModal.hide();
            }

            // 2. Reset the form for next time
            bookingForm.reset();
            // Optional: Hide the room image preview again
            document.getElementById('roomPreview')?.classList.add('d-none');

            // 3. Show the Success Modal
            const successModal = new bootstrap.Modal(document.getElementById('bookingSuccessModal'));
            successModal.show();
        });
    }
});

// Step 1: Open the form from the info modal
function triggerSvcAppoint(serviceName) {
    const infoModalEl = document.querySelector('.modal.show');
    if (infoModalEl) {
        const infoInstance = bootstrap.Modal.getInstance(infoModalEl);
        infoInstance.hide(); //

        infoModalEl.addEventListener('hidden.bs.modal', function () {
            document.getElementById('svcInputDept').value = serviceName;
            document.getElementById('svcFinalTitle').innerText = serviceName + " Booking";
            
            const bookingModal = new bootstrap.Modal(document.getElementById('svcFinalBookingModal'));
            bookingModal.show(); //
        }, { once: true });
    }
}

// Step 2: Handle the form submission to show success
document.addEventListener('DOMContentLoaded', function() {
    const finalForm = document.getElementById('svcFinalBookingForm');
    if (finalForm) {
        finalForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const serviceName = document.getElementById('svcInputDept').value;
            const formModalEl = document.getElementById('svcFinalBookingModal');
            const formInstance = bootstrap.Modal.getInstance(formModalEl);
            
            formInstance.hide(); //

            formModalEl.addEventListener('hidden.bs.modal', function () {
                document.getElementById('confSvcName').innerText = serviceName;
                document.getElementById('confIdNumber').innerText = "#CH-" + Math.floor(100000 + Math.random() * 900000);
                
                const successModal = new bootstrap.Modal(document.getElementById('svcSuccessModal'));
                successModal.show(); //
            }, { once: true });
        });
    }
});