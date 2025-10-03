// داده‌های موقت
let guards = [
    { 
        id: 1, 
        firstName: "ذبیح الله", 
        lastName: "احمدزی",
        fatherName: "عبدالله",
        phone: "0780060833", 
        hireDate: "2021-01-10", 
        position: "Officer",
        profilePhoto: null
    },
    { 
        id: 2, 
        firstName: "زوال", 
        lastName: "حمیدی",
        fatherName: "محمد",
        phone: "0702326519", 
        hireDate: "2025-06-20", 
        position: "Guard",
        profilePhoto: null
    }
];

let shifts = [];
let incidents = [];
let leaves = [];
let currentEditId = null;

// وقتی صفحه لود شد
document.addEventListener('DOMContentLoaded', function() {
    loadGuards();
    setupNavigation();
    setupForms();
    setupLanguageSelector();
    showSection('guards');
});

// تنظیم انتخاب زبان
function setupLanguageSelector() {
    const languageSelect = document.getElementById('languageSelect');
    languageSelect.addEventListener('change', function() {
        changeLanguage(this.value);
    });
}

// تغییر زبان (ساده)
function changeLanguage(lang) {
    const translations = {
        'fa': {
            'title': 'سیستم مدیریت شرکت محافظ',
            'addGuard': 'ثبت محافظ جدید',
            'guardList': 'لیست محافظان'
        },
        'en': {
            'title': 'Security Company Management System',
            'addGuard': 'Add New Guard',
            'guardList': 'Guards List'
        },
        'ps': {
            'title': 'د امنیتي شرکت مدیریت سیستم',
            'addGuard': 'نوی محافظ ثبتول',
            'guardList': 'د محافظانو لیسټ'
        }
    };

    const trans = translations[lang];
    document.querySelector('.navbar-brand').innerHTML = `<i class="fas fa-shield-alt"></i> ${trans.title}`;
    document.querySelector('#guards h4').innerHTML = `<i class="fas fa-user-plus"></i> ${trans.addGuard}`;
    document.querySelector('#guards h5').innerHTML = `<i class="fas fa-list"></i> ${trans.guardList}`;
}

// تنظیم نویگیشن
function setupNavigation() {
    const navLinks = document.querySelectorAll('.list-group-item');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href').substring(1);
            showSection(target);
            
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// نمایش بخش مورد نظر
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
    
    if (sectionId === 'guards') loadGuardsList();
}

// فرم ثبت محافظ
function setupForms() {
    document.getElementById('guardForm').addEventListener('submit', function(e) {
        e.preventDefault();
        if (currentEditId) {
            updateGuard();
        } else {
            addGuard();
        }
    });

    document.getElementById('cancelEdit').addEventListener('click', function() {
        cancelEdit();
    });
}

// اضافه کردن محافظ جدید
function addGuard() {
    const form = document.getElementById('guardForm');
    const photoFile = document.getElementById('profilePhoto').files[0];
    
    let profilePhotoBase64 = null;
    if (photoFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            profilePhotoBase64 = e.target.result;
            saveGuard(profilePhotoBase64);
        };
        reader.readAsDataURL(photoFile);
    } else {
        saveGuard(null);
    }
}

function saveGuard(photo) {
    const newGuard = {
        id: guards.length + 1,
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        fatherName: document.getElementById('fatherName').value,
        phone: document.getElementById('phoneNumber').value,
        hireDate: document.getElementById('hireDate').value,
        position: document.getElementById('position').value,
        profilePhoto: photo
    };

    guards.push(newGuard);
    document.getElementById('guardForm').reset();
    loadGuardsList();
    alert('✅ محافظ جدید با موفقیت ثبت شد!');
}

// ویرایش محافظ
function editGuard(id) {
    const guard = guards.find(g => g.id === id);
    if (!guard) return;

    // پر کردن فرم با اطلاعات محافظ
    document.getElementById('firstName').value = guard.firstName;
    document.getElementById('lastName').value = guard.lastName;
    document.getElementById('fatherName').value = guard.fatherName;
    document.getElementById('phoneNumber').value = guard.phone;
    document.getElementById('hireDate').value = guard.hireDate;
    document.getElementById('position').value = guard.position;

    // تغییر دکمه به حالت ویرایش
    document.querySelector('#guardForm button[type="submit"]').innerHTML = '<i class="fas fa-edit"></i> بروزرسانی محافظ';
    document.getElementById('cancelEdit').style.display = 'inline-block';
    
    currentEditId = id;
}

function updateGuard() {
    const guardIndex = guards.findIndex(g => g.id === currentEditId);
    if (guardIndex === -1) return;

    const photoFile = document.getElementById('profilePhoto').files[0];
    
    if (photoFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            guards[guardIndex].profilePhoto = e.target.result;
            finishUpdate();
        };
        reader.readAsDataURL(photoFile);
    } else {
        finishUpdate();
    }

    function finishUpdate() {
        guards[guardIndex].firstName = document.getElementById('firstName').value;
        guards[guardIndex].lastName = document.getElementById('lastName').value;
        guards[guardIndex].fatherName = document.getElementById('fatherName').value;
        guards[guardIndex].phone = document.getElementById('phoneNumber').value;
        guards[guardIndex].hireDate = document.getElementById('hireDate').value;
        guards[guardIndex].position = document.getElementById('position').value;

        cancelEdit();
        loadGuardsList();
        alert('✅ اطلاعات محافظ با موفقیت بروزرسانی شد!');
    }
}

function cancelEdit() {
    document.getElementById('guardForm').reset();
    document.querySelector('#guardForm button[type="submit"]').innerHTML = '<i class="fas fa-save"></i> ثبت محافظ';
    document.getElementById('cancelEdit').style.display = 'none';
    currentEditId = null;
}

// نمایش جزئیات محافظ
function showGuardDetails(id) {
    const guard = guards.find(g => g.id === id);
    if (!guard) return;

    const positionText = getPositionText(guard.position);
    
    let photoHTML = '';
    if (guard.profilePhoto) {
        photoHTML = `<img src="${guard.profilePhoto}" class="profile-photo mb-3" alt="عکس پروفایل">`;
    }

    const modalContent = `
        <div class="text-center">
            ${photoHTML}
            <h4>${guard.firstName} ${guard.lastName}</h4>
            <p class="text-muted">پسر ${guard.fatherName}</p>
        </div>
        <div class="row mt-4">
            <div class="col-md-6">
                <p><strong>شماره تماس:</strong> ${guard.phone}</p>
                <p><strong>تاریخ استخدام:</strong> ${guard.hireDate}</p>
            </div>
            <div class="col-md-6">
                <p><strong>رتبه:</strong> ${positionText}</p>
                <p><strong>مدت خدمت:</strong> ${calculateServiceYears(guard.hireDate)} سال</p>
            </div>
        </div>
        <div class="mt-4">
            <h5>تاریخچه فعالیت‌ها</h5>
            <p>شیفت‌های انجام شده: ${shifts.filter(s => s.guardId === id).length}</p>
            <p>حوادث گزارش شده: ${incidents.filter(i => i.guardId === id).length}</p>
            <p>مرخصی‌های گرفته: ${leaves.filter(l => l.guardId === id).length}</p>
        </div>
    `;

    document.getElementById('guardDetailContent').innerHTML = modalContent;
    const modal = new bootstrap.Modal(document.getElementById('guardDetailModal'));
    modal.show();
}

// چاپ جزئیات محافظ
function printGuardDetails() {
    const printContent = document.getElementById('guardDetailContent').innerHTML;
    const originalContent = document.body.innerHTML;
    
    document.body.innerHTML = `
        <div class="container mt-4">
            <h2 class="text-center">جزئیات محافظ</h2>
            ${printContent}
            <div class="mt-4 text-muted text-center">
                <small>چاپ شده در: ${new Date().toLocaleString('fa-IR')}</small>
            </div>
        </div>
    `;
    
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
}

// لود لیست محافظان
function loadGuardsList() {
    const container = document.getElementById('guardsList');
    container.innerHTML = '';

    if (guards.length === 0) {
        container.innerHTML = '<div class="alert alert-info">📭 هیچ محافظی ثبت نشده است.</div>';
        return;
    }

    guards.forEach(guard => {
        const positionText = getPositionText(guard.position);
        let photoHTML = '<div class="guard-photo bg-light d-flex align-items-center justify-content-center"><i class="fas fa-user text-muted"></i></div>';
        
        if (guard.profilePhoto) {
            photoHTML = `<img src="${guard.profilePhoto}" class="guard-photo" alt="عکس پروفایل">`;
        }

        const guardItem = document.createElement('div');
        guardItem.className = 'guard-item';
        guardItem.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center">
                    ${photoHTML}
                    <div class="ms-3">
                        <h6 class="mb-1">${guard.firstName} ${guard.lastName}</h6>
                        <small class="text-muted">📞 ${guard.phone} | 📅 ${guard.hireDate}</small>
                        <br>
                        <span class="badge bg-primary">${positionText}</span>
                        <span class="badge bg-secondary">${calculateServiceYears(guard.hireDate)} سال خدمت</span>
                    </div>
                </div>
                <div>
                    <button class="btn btn-sm btn-outline-primary" onclick="editGuard(${guard.id})">
                        <i class="fas fa-edit"></i> ویرایش
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteGuard(${guard.id})">
                        <i class="fas fa-trash"></i> حذف
                    </button>
                </div>
            </div>
        `;
        
        // کلیک روی آیتم برای نمایش جزئیات
        guardItem.addEventListener('click', function(e) {
            if (!e.target.closest('button')) {
                showGuardDetails(guard.id);
            }
        });
        
        container.appendChild(guardItem);
    });
}

// توابع کمکی
function getPositionText(position) {
    const positions = {
        'Officer': 'افسر',
        'Second_Lieutenant': 'ساتنمن',
        'First_Lieutenant': 'لومړی ساتنمن', 
        'Second_Lieutenant_Junior': 'دویم ساتنمن',
        'Guard': 'ګارد'
    };
    return positions[position] || position;
}

function calculateServiceYears(hireDate) {
    const hire = new Date(hireDate);
    const now = new Date();
    const years = now.getFullYear() - hire.getFullYear();
    return years > 0 ? years : 1;
}

function deleteGuard(id) {
    if (confirm('⚠️ آیا از حذف این محافظ مطمئن هستید؟')) {
        guards = guards.filter(guard => guard.id !== id);
        loadGuardsList();
        alert('🗑️ محافظ با موفقیت حذف شد!');
    }
}

// توابع برای سایر بخش‌ها (می‌توانید کامل کنید)
function loadShiftsSection() {
    // کد بخش شیفت‌ها
}

function loadIncidentsSection() {
    // کد بخش حوادث
}

function loadLeavesSection() {
    // کد بخش مرخصی
}

function loadReportsSection() {
    // کد بخش گزارشات
}