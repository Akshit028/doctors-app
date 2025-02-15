//register page

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');

    const validators = {
        mobile: (value) => {
            if (!value) return 'Mobile number is required';
            if (!/^[0-9]{10}$/.test(value)) return 'Please enter a valid 10-digit mobile number';
            return '';
        },
        email: (value) => {
            if (!value) return 'Email is required';
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
            return '';
        },
        fullName: (value) => {
            if (!value) return 'Full name is required';
            if (value.length < 3) return 'Name must be at least 3 characters long';
            return '';
        },
        password: (value) => {
            if (!value) return 'Password is required';
            if (value.length < 8) return 'Password must be at least 8 characters long';

            const hasDigit = /\d/;
            const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;

            if (!hasDigit.test(value)) return 'Password must contain at least 1 digit';
            if (!hasSpecialChar.test(value)) return 'Password must contain at least 1 special character';

            return '';
        },
        confirmPassword: (value, password) => {
            if (!value) return 'Please confirm your password';
            if (value !== password) return 'Passwords do not match';
            return '';
        },
        graduation: (value) => {
            if (!value) return 'Graduation date is required';
            return '';
        },
        degree1: (value) => {
            if (!value) return 'Degree 1 is required';
            return '';
        },
        onlineFee: (value) => {
            if (!value) return 'Online consultation fee is required';
            if (value < 0) return 'Fee cannot be negative';
            return '';
        },
        inPersonFee: (value) => {
            if (!value) return 'In-person consultation fee is required';
            if (value < 0) return 'Fee cannot be negative';
            return '';
        }
    };

    const showError = (fieldId, message) => {
        const errorElement = document.getElementById(`${fieldId}Error`);
        errorElement.textContent = message;
        document.getElementById(fieldId).classList.add('error-input');
    };

    const clearError = (fieldId) => {
        const errorElement = document.getElementById(`${fieldId}Error`);
        errorElement.textContent = '';
        document.getElementById(fieldId).classList.remove('error-input');
    };

    const validateForm = () => {
        const fields = ['mobile', 'email', 'fullName', 'password', 'confirmPassword',
            'graduation', 'degree1', 'onlineFee', 'inPersonFee'];
        let isValid = true;

        fields.forEach(field => {
            const input = document.getElementById(field);
            let error = '';

            if (field === 'confirmPassword') {
                error = validators[field](input.value, document.getElementById('password').value);
            } else if (validators[field]) {
                error = validators[field](input.value);
            }

            if (error) {
                showError(field, error);
                isValid = false;
            } else {
                clearError(field);
            }
        });

        return isValid;
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (validateForm()) {
            const formData = {
                mobile: document.getElementById('mobile').value,
                email: document.getElementById('email').value,
                fullName: document.getElementById('fullName').value,
                password: document.getElementById('password').value,
                graduation: document.getElementById('graduation').value,
                degree1: document.getElementById('degree1').value,
                degree2: document.getElementById('degree2').value || '',
                onlineFee: document.getElementById('onlineFee').value,
                inPersonFee: document.getElementById('inPersonFee').value
            };

            const doctors = JSON.parse(localStorage.getItem('doctors') || '[]');
            doctors.push(formData);
            localStorage.setItem('doctors', JSON.stringify(doctors));

            window.location.href = 'registration_success.html';
        }
    });

    form.querySelectorAll('input').forEach(input => {
        input.addEventListener('blur', () => {
            if (input.id === 'confirmPassword') {
                const error = validators[input.id](input.value, document.getElementById('password').value);
                if (error) showError(input.id, error);
                else clearError(input.id);
            } else if (validators[input.id]) {
                const error = validators[input.id](input.value);
                if (error) showError(input.id, error);
                else clearError(input.id);
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const doctorsList = document.getElementById('doctorsList');
    const doctors = JSON.parse(localStorage.getItem('doctors') || '[]');

    if (doctors.length === 0) {
        ddoctorsList.style.display = 'none';
        return;
    }

    doctors.forEach(doctor => {
        const cardTemplate = document.querySelector('.card').cloneNode(true);

        cardTemplate.querySelector('h1').textContent = `Dr. ${doctor.fullName}`;
        cardTemplate.querySelector('.doctor-info p').textContent = `${doctor.degree1}${doctor.degree2 ? ', ' + doctor.degree2 : ''}`;

        const graduationDate = new Date(doctor.graduation);
        const experience = new Date().getFullYear() - graduationDate.getFullYear();
        cardTemplate.querySelector('.years').textContent = `${experience} Years`;

        cardTemplate.querySelectorAll('.fee-row .rupee')[0].textContent = doctor.onlineFee;
        cardTemplate.querySelectorAll('.fee-row .rupee')[1].textContent = doctor.inPersonFee;

        doctorsList.appendChild(cardTemplate);
    });

});


document.addEventListener('DOMContentLoaded', () => {
    const doctorsList = document.getElementById('doctorsList');
    const loadMoreBtn = document.querySelector('.load-more');
    let currentStartIndex = 0;
    const doctorsPerPage = 10;
    let doctors = [];

    fetch('doctors.json')
        .then(response => response.json())
        .then(jsonDoctors => {
            doctors = jsonDoctors;

            if (doctors.length === 0) {
                doctorsList.innerHTML = '<p style="text-align: center;">No doctors registered yet.</p>';
                loadMoreBtn.style.display = 'none';
                return;
            }

            loadDoctors();

            loadMoreBtn.addEventListener('click', loadDoctors);
        })
        .catch(error => {
            console.error('Error fetching doctor data:', error);
            doctorsList.innerHTML = '<p style="text-align: center;">Error loading doctors.</p>';
            loadMoreBtn.style.display = 'none';
        });

    function loadDoctors() {
        const endIndex = currentStartIndex + doctorsPerPage;
        const doctorsToDisplay = doctors.slice(currentStartIndex, endIndex);

        doctorsToDisplay.forEach(doctor => {
            const cardTemplate = document.querySelector('.card').cloneNode(true);

            cardTemplate.querySelector('h1').textContent = `Dr. ${doctor.fullName}`;
            cardTemplate.querySelector('.doctor-info p').textContent = `${doctor.degree1}${doctor.degree2 ? ', ' + doctor.degree2 : ''}`;

            const graduationDate = new Date(doctor.graduation);
            const experience = new Date().getFullYear() - graduationDate.getFullYear();
            cardTemplate.querySelector('.years').textContent = `${experience} Years`;

            cardTemplate.querySelectorAll('.fee-row .rupee')[0].textContent = doctor.onlineFee;
            cardTemplate.querySelectorAll('.fee-row .rupee')[1].textContent = doctor.inPersonFee;

            doctorsList.appendChild(cardTemplate);
        });

        currentStartIndex += doctorsPerPage;

        if (currentStartIndex >= doctors.length) {
            loadMoreBtn.style.display = 'none';
        }

    }
});

