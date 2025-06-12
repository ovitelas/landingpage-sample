document.addEventListener('DOMContentLoaded', function () {

    // Script Navbar Shrink on Scroll
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.onscroll = function () {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        };
    }

    // Script Menu Mobile (Burger)
    const burger = document.querySelector('.burger');
    const navMenu = document.querySelector('.nav-menu');

    if (burger && navMenu) {
        burger.addEventListener('click', () => {
            burger.classList.toggle('active');
            navMenu.classList.toggle('active');
            // Travar/Destravar scroll do body quando menu está ativo
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Fechar menu ao clicar em um link
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    burger.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.style.overflow = ''; // Restaurar scroll
                }
            });
        });
    }

    // Script Animação Números Binários (Hero)
    const floatingNumbersContainer = document.querySelector('.floating-numbers');
    if (floatingNumbersContainer) {
        const numberOfDigits = 50; // Ajuste a quantidade

        function createBinaryDigit() {
            if (!floatingNumbersContainer) return; // Checagem extra
            const digit = document.createElement('span');
            digit.classList.add('binary-digit');
            digit.textContent = Math.random() > 0.5 ? '1' : '0';
            digit.style.left = `${Math.random() * 100}%`;

            const duration = Math.random() * 10 + 10; // entre 10s e 20s
            const delay = Math.random() * 5;
            digit.style.animationDuration = `${duration}s`;
            digit.style.animationDelay = `-${delay}s`;

            floatingNumbersContainer.appendChild(digit);

            setTimeout(() => {
                digit.remove();
            }, (duration + delay + 1) * 1000); // Adiciona 1s de margem
        }

        for (let i = 0; i < numberOfDigits; i++) {
            createBinaryDigit();
        }
        // Opcional: Criar novos dígitos continuamente (cuidado com performance)
        // setInterval(createBinaryDigit, 1500); // Cria um novo a cada 1.5s
    }

    // Script Filtro de Projetos
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
                        card.style.display = 'flex'; // Usar flex para manter alinhamento interno
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // Script para atualizar ano no Copyright
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Active link highlighting for navbar (opcional, mas bom para UX)
    const sections = document.querySelectorAll('section[id]');
    const navLi = document.querySelectorAll('nav .nav-menu li a');

    if (sections.length > 0 && navLi.length > 0) {
        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                // Ajustar o offset para ativar o link um pouco antes de chegar no topo da seção
                if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                    current = section.getAttribute('id');
                }
            });

            navLi.forEach(a => {
                a.classList.remove('active-link');
                if (a.getAttribute('href').includes(current)) {
                    a.classList.add('active-link');
                }
            });
            // Caso especial para o topo da página (home)
            if (pageYOffset < sections[0].offsetTop - sections[0].clientHeight / 3) {
                navLi.forEach(a => a.classList.remove('active-link'));
                const homeLink = document.querySelector('nav .nav-menu a[href="#home"]');
                if (homeLink) homeLink.classList.add('active-link');
            }
        });
        // Definir o link Home como ativo inicialmente
        const homeLink = document.querySelector('nav .nav-menu a[href="#home"]');
        if (homeLink) homeLink.classList.add('active-link');
    }

    // Configuração do EmailJS
    const contactForm = document.getElementById("contact-form");

    if (contactForm) {
        contactForm.addEventListener("submit", function (e) {
            e.preventDefault(); // Evita o recarregamento da página

            // Envia o formulário usando EmailJS
            emailjs.sendForm("SERVICE_id", "ID_TEMPLATE", this)
                .then(() => {
                    alert("Mensagem enviada com sucesso!"); // Feedback ao usuário
                    contactForm.reset(); // Limpa o formulário
                }, (error) => {
                    alert("Erro ao enviar: " + error.text); // Mensagem de erro
                });
        });
    }

});