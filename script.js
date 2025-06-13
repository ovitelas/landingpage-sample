document.addEventListener('DOMContentLoaded', function () {
    // Debounce para eventos de scroll/resize
    function debounce(func, wait = 100) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // Navbar Shrink on Scroll
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.onscroll = debounce(function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Menu Mobile (Burger)
    const burger = document.querySelector('.burger');
    const navMenu = document.querySelector('.nav-menu');

    if (burger && navMenu) {
        burger.addEventListener('click', () => {
            const isActive = !burger.classList.contains('active');
            burger.classList.toggle('active');
            navMenu.classList.toggle('active');
            burger.setAttribute('aria-expanded', isActive);
            document.body.style.overflow = isActive ? 'hidden' : '';
        });

        // Fechar menu ao clicar em um link
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                if (navMenu.classList.contains('active')) {
                    burger.classList.remove('active');
                    navMenu.classList.remove('active');
                    burger.setAttribute('aria-expanded', false);
                    document.body.style.overflow = '';
                }
                
                // Scroll suave
                const targetId = link.getAttribute('href');
                if (targetId.startsWith('#')) {
                    e.preventDefault();
                    const targetSection = document.querySelector(targetId);
                    if (targetSection) {
                        window.scrollTo({
                            top: targetSection.offsetTop - 80,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }

    // Animação Números Binários (Hero)
    const floatingNumbersContainer = document.querySelector('.floating-numbers');
    if (floatingNumbersContainer) {
        const numberOfDigits = 50;
        let animationActive = true;

        function createBinaryDigit() {
            const digit = document.createElement('span');
            digit.classList.add('binary-digit');
            digit.textContent = Math.random() > 0.5 ? '1' : '0';
            digit.style.left = `${Math.random() * 100}%`;
            
            const duration = Math.random() * 10 + 10;
            const delay = Math.random() * 5;
            digit.style.animationDuration = `${duration}s`;
            digit.style.animationDelay = `-${delay}s`;
            
            floatingNumbersContainer.appendChild(digit);
            
            setTimeout(() => {
                if (digit.parentNode) {
                    digit.remove();
                }
            }, (duration + delay + 1) * 1000);
        }

        // Inicializar dígitos
        for (let i = 0; i < numberOfDigits; i++) {
            createBinaryDigit();
        }
        
        // Otimizar performance
        document.addEventListener('visibilitychange', () => {
            animationActive = !document.hidden;
        });
    }

    // Filtro de Projetos
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterButtons.length > 0 && projectCards.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                const filter = button.getAttribute('data-filter');
                
                projectCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    if (filter === 'all' || filter === category) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // Atualizar ano no Copyright
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Destaque de link ativo
    const sections = document.querySelectorAll('section[id]');
    const navLi = document.querySelectorAll('nav .nav-menu li a');

    if (sections.length > 0 && navLi.length > 0) {
        window.addEventListener('scroll', debounce(() => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (window.scrollY >= (sectionTop - sectionHeight / 3)) {
                    current = section.getAttribute('id');
                }
            });
            
            navLi.forEach(a => {
                a.classList.remove('active-link');
                if (a.getAttribute('href').includes(current)) {
                    a.classList.add('active-link');
                }
            });
            
            if (window.scrollY < sections[0].offsetTop - sections[0].clientHeight / 3) {
                navLi.forEach(a => a.classList.remove('active-link'));
                const homeLink = document.querySelector('nav .nav-menu a[href="#home"]');
                if (homeLink) homeLink.classList.add('active-link');
            }
        }));
        
        const homeLink = document.querySelector('nav .nav-menu a[href="#home"]');
        if (homeLink) homeLink.classList.add('active-link');
    }

    // EmailJS com validação
    const contactForm = document.getElementById("contact-form");
    
    // Sanitização de inputs
    function sanitizeInput(input) {
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    }

    if (contactForm) {
        contactForm.addEventListener("submit", function (e) {
            e.preventDefault();
            
            // Validação de email
            const email = document.getElementById('email').value;
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                alert("Por favor, insira um email válido.");
                return;
            }
            
            // Sanitizar inputs
            const name = sanitizeInput(document.getElementById('name').value);
            const message = sanitizeInput(document.getElementById('message').value);
            const subject = sanitizeInput(document.getElementById('subject').value);
            
            // Feedback visual
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = "Enviando...";
            submitButton.disabled = true;
            
            // Enviar formulário
            emailjs.sendForm("SERVICE_id", "ID_TEMPLATE", this)
                .then(() => {
                    alert("Mensagem enviada com sucesso!");
                    contactForm.reset();
                }, (error) => {
                    alert("Erro ao enviar: " + error.text);
                })
                .finally(() => {
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                });
        });
    }
    
    // Prefetch de imagens
    if (window.innerWidth > 768) {
        const links = ['#about', '#projects', '#contact'];
        links.forEach(link => {
            const section = document.querySelector(link);
            if (section) {
                const img = section.querySelector('img');
                if (img) {
                    const link = document.createElement('link');
                    link.rel = 'prefetch';
                    link.href = img.src;
                    document.head.appendChild(link);
                }
            }
        });
    }
    
    // Remover skeleton após carregamento
    window.addEventListener('load', () => {
        document.querySelectorAll('.project-image').forEach(img => {
            img.classList.remove('loading');
        });
    });
});