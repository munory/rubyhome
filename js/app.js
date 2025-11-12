// Main application entry point

const handleScroll = () => {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.header__nav-link');

  const scrollPosition = window.scrollY + 150;

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');

    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      navLinks.forEach((link) => {
        link.classList.remove('header__nav-link--active');
      });

      const activeLink = document.querySelector(`[data-section="${sectionId}"]`);
      if (activeLink) {
        activeLink.classList.add('header__nav-link--active');
      }
    }
  });
};

const handleNavLinkClick = (event) => {
  const link = event.currentTarget;
  const sectionId = link.getAttribute('data-section');
  const section = document.getElementById(sectionId);

  if (section) {
    event.preventDefault();
    section.scrollIntoView({ behavior: 'smooth' });
  }
};

const initNavigation = () => {
  const navLinks = document.querySelectorAll('.header__nav-link');
  navLinks.forEach((link) => {
    link.addEventListener('click', handleNavLinkClick);
  });
};

window.addEventListener('scroll', handleScroll);
document.addEventListener('DOMContentLoaded', initNavigation);

const initReviewsSlider = () => {
  const sliderEl = document.querySelector('.reviews__slider');
  if (!sliderEl || typeof Swiper === 'undefined') return;
  // eslint-disable-next-line no-new
  const swiper = new Swiper(sliderEl, {
    slidesPerView: 2,
    slidesPerGroup: 2,
    spaceBetween: 30,
    grabCursor: true,
    simulateTouch: true,
    breakpoints: {
      0: { slidesPerView: 1, slidesPerGroup: 1, spaceBetween: 16 },
      768: { slidesPerView: 1, slidesPerGroup: 1, spaceBetween: 30 },
      1100: { slidesPerView: 2, slidesPerGroup: 2, spaceBetween: 30 },
    },
    a11y: {
      enabled: true,
    },
  });

  // Custom dots logic
  const dotsContainer = document.querySelector('.reviews__dots');
  if (dotsContainer) {
    const dots = Array.from(dotsContainer.querySelectorAll('.reviews__dot'));
    const setActiveDot = (pageIndex) => {
      dots.forEach((d, i) => d.classList.toggle('reviews__dot--active', i === pageIndex));
    };

    swiper.on('slideChange', () => {
      const group = swiper.params.slidesPerGroup || 1;
      const pageIndex = Math.floor(swiper.activeIndex / group);
      setActiveDot(pageIndex);
    });

    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const page = Number(dot.getAttribute('data-page') || '0');
        const group = swiper.params.slidesPerGroup || 1;
        swiper.slideTo(page * group);
        setActiveDot(page);
      });
    });
  }
};

document.addEventListener('DOMContentLoaded', initReviewsSlider);

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const handleSubscribeSubmit = (event) => {
  event.preventDefault();
  
  const form = event.currentTarget;
  const emailInput = form.querySelector('.subscribe__input');
  const errorElement = form.querySelector('.subscribe__error');
  const button = form.querySelector('.subscribe__button');
  
  const email = emailInput.value.trim();
  
  errorElement.textContent = '';
  emailInput.classList.remove('subscribe__input--error');
  
  if (!email) {
    errorElement.textContent = 'Please enter your email address';
    emailInput.classList.add('subscribe__input--error');
    emailInput.focus();
    return;
  }
  
  if (!validateEmail(email)) {
    errorElement.textContent = 'Please enter a valid email address';
    emailInput.classList.add('subscribe__input--error');
    emailInput.focus();
    return;
  }
  
  // Блокировка кнопки во время отправки
  button.disabled = true;
  button.textContent = 'Sending...';
  
  // Имитация отправки email (задержка 1.5 секунды)
  setTimeout(() => {
    button.disabled = false;
    button.textContent = 'Subscribe';
    emailInput.value = '';
    errorElement.textContent = '';
    emailInput.classList.remove('subscribe__input--error');
    
    showToast('Your email has been sent');
  }, 1500);
};

const initSubscribeForm = () => {
  const subscribeForm = document.querySelector('.subscribe__form');
  if (subscribeForm) {
    subscribeForm.addEventListener('submit', handleSubscribeSubmit);
    
    // Валидация в реальном времени
    const emailInput = subscribeForm.querySelector('.subscribe__input');
    if (emailInput) {
      emailInput.addEventListener('input', () => {
        const errorElement = subscribeForm.querySelector('.subscribe__error');
        const email = emailInput.value.trim();
        
        if (!email) {
          if (errorElement) {
            errorElement.textContent = '';
          }
          emailInput.classList.remove('subscribe__input--error');
        } else if (!validateEmail(email)) {
          if (errorElement) {
            errorElement.textContent = 'Please enter a valid email address';
          }
          emailInput.classList.add('subscribe__input--error');
        } else {
          if (errorElement) {
            errorElement.textContent = '';
          }
          emailInput.classList.remove('subscribe__input--error');
        }
      });
      
      // Валидация при потере фокуса
      emailInput.addEventListener('blur', () => {
        const email = emailInput.value.trim();
        const errorElement = subscribeForm.querySelector('.subscribe__error');
        
        if (email && !validateEmail(email)) {
          if (errorElement) {
            errorElement.textContent = 'Please enter a valid email address';
          }
          emailInput.classList.add('subscribe__input--error');
        }
      });
    }
  }
};

document.addEventListener('DOMContentLoaded', initSubscribeForm);

// ========================================================================
// TOAST / УВЕДОМЛЕНИЕ
// ========================================================================

const showToast = (message) => {
  const toast = document.getElementById('toast');
  if (!toast) return;
  
  const messageEl = toast.querySelector('.toast__message');
  if (messageEl) {
    messageEl.textContent = message;
  }
  
  toast.classList.add('toast--show');
  
  // Автоматическое скрытие через 4 секунды
  setTimeout(() => {
    hideToast();
  }, 4000);
};

const hideToast = () => {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.classList.remove('toast--show');
};

const initToast = () => {
  const toast = document.getElementById('toast');
  if (!toast) return;
  
  // Кнопки закрытия (крестик и overlay)
  const closeButtons = toast.querySelectorAll('[data-toast-close]');
  closeButtons.forEach((btn) => {
    btn.addEventListener('click', hideToast);
  });
};

document.addEventListener('DOMContentLoaded', initToast);

// ========================================================================
// MODAL / МОДАЛЬНОЕ ОКНО
// ========================================================================

const openModal = () => {
  const modal = document.getElementById('modal');
  if (!modal) {
    return;
  }
  
  modal.classList.add('modal--open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  
  // Фокус на первый инпут
  const firstInput = modal.querySelector('.modal__input');
  if (firstInput) {
    setTimeout(() => firstInput.focus(), 100);
  }
};

const closeModal = () => {
  const modal = document.getElementById('modal');
  if (!modal) return;
  
  modal.classList.remove('modal--open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  
  // Сброс формы
  const form = modal.querySelector('.modal__form');
  if (form) {
    form.reset();
    clearErrors();
  }
};

// Валидация имени: кириллица/латиница, не более 1 спецсимвола
const validateName = (name) => {
  const trimmed = name.trim();
  if (!trimmed) {
    return { valid: false, message: 'Name is required' };
  }
  
  // Кириллица и латиница разрешены, цифры разрешены
  const allowedChars = /^[а-яёА-ЯЁa-zA-Z0-9\s\-'\.]{1,}$/;
  if (!allowedChars.test(trimmed)) {
    return { valid: false, message: 'Name can only contain letters, numbers, spaces and one special character' };
  }
  
  // Проверка на количество спецсимволов (дефис, апостроф, точка считаются спецсимволами)
  const specialChars = trimmed.match(/[\-'\\.]/g);
  if (specialChars && specialChars.length > 1) {
    return { valid: false, message: 'Name can contain maximum one special character' };
  }
  
  return { valid: true };
};

// Маска для телефона +7(999) 000-00-00
const formatPhone = (value) => {
  // Убираем все кроме цифр
  const numbers = value.replace(/\D/g, '');
  
  if (!numbers) return '+7';
  if (numbers.startsWith('7')) {
    const rest = numbers.slice(1);
    if (rest.length <= 3) return `+7(${rest}`;
    if (rest.length <= 6) return `+7(${rest.slice(0, 3)}) ${rest.slice(3)}`;
    if (rest.length <= 8) return `+7(${rest.slice(0, 3)}) ${rest.slice(3, 6)}-${rest.slice(6)}`;
    return `+7(${rest.slice(0, 3)}) ${rest.slice(3, 6)}-${rest.slice(6, 8)}-${rest.slice(8, 10)}`;
  }
  if (numbers.startsWith('8')) {
    const rest = numbers.slice(1);
    if (rest.length <= 3) return `+7(${rest}`;
    if (rest.length <= 6) return `+7(${rest.slice(0, 3)}) ${rest.slice(3)}`;
    if (rest.length <= 8) return `+7(${rest.slice(0, 3)}) ${rest.slice(3, 6)}-${rest.slice(6)}`;
    return `+7(${rest.slice(0, 3)}) ${rest.slice(3, 6)}-${rest.slice(6, 8)}-${rest.slice(8, 10)}`;
  }
  
  const rest = numbers.length > 10 ? numbers.slice(0, 10) : numbers;
  if (rest.length <= 3) return `+7(${rest}`;
  if (rest.length <= 6) return `+7(${rest.slice(0, 3)}) ${rest.slice(3)}`;
  if (rest.length <= 8) return `+7(${rest.slice(0, 3)}) ${rest.slice(3, 6)}-${rest.slice(6)}`;
  return `+7(${rest.slice(0, 3)}) ${rest.slice(3, 6)}-${rest.slice(6, 8)}-${rest.slice(8, 10)}`;
};

const validatePhone = (phone) => {
  const numbers = phone.replace(/\D/g, '');
  // Проверяем, что это 11 цифр (7 + 10) или 10 цифр (без 7/8)
  if (numbers.length === 11 && (numbers.startsWith('7') || numbers.startsWith('8'))) {
    return { valid: true };
  }
  if (numbers.length === 10) {
    return { valid: true };
  }
  return { valid: false, message: 'Please enter a valid phone number' };
};

const validateModalEmail = (email) => {
  if (!email.trim()) {
    return { valid: true }; // Email не обязателен
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, message: 'Please enter a valid email address' };
  }
  return { valid: true };
};

const showError = (input, message) => {
  input.classList.add('modal__input--error');
  const errorEl = input.parentElement.querySelector('.modal__error');
  if (errorEl) {
    errorEl.textContent = message;
  }
};

const clearError = (input) => {
  input.classList.remove('modal__input--error');
  const errorEl = input.parentElement.querySelector('.modal__error');
  if (errorEl) {
    errorEl.textContent = '';
  }
};

const clearErrors = () => {
  const inputs = document.querySelectorAll('.modal__input');
  inputs.forEach(clearError);
  const checkboxes = document.querySelectorAll('.modal__checkbox');
  checkboxes.forEach((cb) => {
    const errorEl = cb.closest('.modal__field')?.querySelector('.modal__error');
    if (errorEl) errorEl.textContent = '';
  });
};

const initModal = () => {
  const modal = document.getElementById('modal');
  if (!modal) {
    return;
  }
  
  // Обработчик клика для всех кнопок открытия (делегирование событий)
  document.addEventListener('click', (e) => {
    const target = e.target.closest('[data-modal-open]');
    if (target) {
      e.preventDefault();
      e.stopPropagation();
      openModal();
    }
  });
  
  // Кнопки закрытия
  document.addEventListener('click', (e) => {
    const target = e.target.closest('[data-modal-close]');
    if (target) {
      e.preventDefault();
      closeModal();
    }
  });
  
  // Закрытие по Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('modal--open')) {
      closeModal();
    }
  });
  
  // Переключатели Buy/Rent/Sell
  const choiceButtons = modal.querySelectorAll('.modal__choice-btn');
  choiceButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      choiceButtons.forEach((b) => {
        b.classList.remove('modal__choice-btn--active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('modal__choice-btn--active');
      btn.setAttribute('aria-pressed', 'true');
    });
  });
  
  // Валидация имени
  const nameInput = document.getElementById('modal-name');
  if (nameInput) {
    nameInput.addEventListener('input', () => {
      clearError(nameInput);
    });
    nameInput.addEventListener('blur', () => {
      const result = validateName(nameInput.value);
      if (!result.valid) {
        showError(nameInput, result.message);
      }
    });
  }
  
  // Маска телефона
  const phoneInput = document.getElementById('modal-phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      e.target.value = formatPhone(e.target.value);
      clearError(phoneInput);
    });
    phoneInput.addEventListener('blur', () => {
      const result = validatePhone(phoneInput.value);
      if (!result.valid) {
        showError(phoneInput, result.message);
      }
    });
    // Начальное значение
    phoneInput.value = '+7';
  }
  
  // Валидация email
  const emailInput = document.getElementById('modal-email');
  if (emailInput) {
    emailInput.addEventListener('input', () => {
      clearError(emailInput);
    });
    emailInput.addEventListener('blur', () => {
      const result = validateModalEmail(emailInput.value);
      if (!result.valid) {
        showError(emailInput, result.message);
      }
    });
  }
  
  // Валидация чекбокса
  const privacyCheckbox = document.getElementById('modal-privacy');
  if (privacyCheckbox) {
    privacyCheckbox.addEventListener('change', () => {
      const errorEl = privacyCheckbox.closest('.modal__field')?.querySelector('.modal__error');
      if (errorEl) errorEl.textContent = '';
    });
  }
  
  // Отправка формы
  const form = document.getElementById('modal-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isValid = true;
      
      // Валидация имени
      const nameResult = validateName(nameInput.value);
      if (!nameResult.valid) {
        showError(nameInput, nameResult.message);
        isValid = false;
      }
      
      // Валидация телефона
      const phoneResult = validatePhone(phoneInput.value);
      if (!phoneResult.valid) {
        showError(phoneInput, phoneResult.message);
        isValid = false;
      }
      
      // Валидация email (не обязателен)
      const emailResult = validateModalEmail(emailInput.value);
      if (!emailResult.valid) {
        showError(emailInput, emailResult.message);
        isValid = false;
      }
      
      // Валидация чекбокса
      if (!privacyCheckbox.checked) {
        const errorEl = privacyCheckbox.closest('.modal__field')?.querySelector('.modal__error');
        if (errorEl) {
          errorEl.textContent = 'You must agree to the Privacy Policy';
        }
        isValid = false;
      }
      
      if (!isValid) {
        // Фокус на первое поле с ошибкой
        const firstError = form.querySelector('.modal__input--error');
        if (firstError) {
          firstError.focus();
        } else if (!privacyCheckbox.checked) {
          privacyCheckbox.focus();
        }
        return;
      }
      
      // Имитация отправки
      const submitBtn = form.querySelector('.modal__submit');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
      
      setTimeout(() => {
        showToast('Your request has been sent');
        closeModal();
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit';
      }, 1500);
    });
  }
};

// Инициализация при загрузке
window.addEventListener('DOMContentLoaded', () => {
  initModal();
});