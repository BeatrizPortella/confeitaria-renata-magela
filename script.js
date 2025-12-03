document.addEventListener('DOMContentLoaded', () => {
    const totalSteps = 6;
    let currentStep = 1;

    const formData = {
        size: '',
        price: '',
        dough: '',
        filling1: '',
        filling2: '',
        coverage: '',
        decoration: '',
        decorationExtras: [],
        name: '',
        observations: ''
    };

    // DOM Elements
    const steps = document.querySelectorAll('.wizard-step');
    const dots = document.querySelectorAll('.step-dot');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const form = document.getElementById('cakeForm');

    // Initialize
    updateUI();

    // --- Event Listeners ---

    // Navigation Buttons
    nextBtn.addEventListener('click', () => {
        if (validateStep(currentStep)) {
            if (currentStep < totalSteps) {
                currentStep++;
                updateUI();
            } else {
                sendToWhatsApp();
            }
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            updateUI();
        }
    });

    // Option Cards Selection (Dough, Fillings, Coverage, Decoration)
    document.querySelectorAll('.option-card').forEach(card => {
        card.addEventListener('click', function () {
            const type = this.dataset.type;
            const value = this.dataset.value;

            // Handle selection styling
            const siblings = this.parentElement.querySelectorAll('.option-card');
            siblings.forEach(sib => sib.classList.remove('selected'));
            this.classList.add('selected');

            // Save data
            if (type === 'dough') formData.dough = value;
            if (type === 'filling1') formData.filling1 = value;
            if (type === 'filling2') formData.filling2 = value;
            if (type === 'coverage') formData.coverage = value;
            if (type === 'decoration') formData.decoration = value;
        });
    });

    // Size Selection Logic
    document.querySelectorAll('.size-option').forEach(row => {
        row.addEventListener('click', function () {
            document.querySelectorAll('.size-option').forEach(r => r.classList.remove('selected'));
            this.classList.add('selected');
            formData.size = this.dataset.value;
            if (this.dataset.price) {
                formData.price = this.dataset.price;
            } else {
                formData.price = 'Sob consulta';
            }
        });
    });

    // Extra Decoration Checkboxes
    document.querySelectorAll('input[name="extra_decoration"]').forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            if (this.checked) {
                formData.decorationExtras.push(this.value);
            } else {
                formData.decorationExtras = formData.decorationExtras.filter(item => item !== this.value);
            }
        });
    });

    // --- Helper Functions ---

    function updateUI() {
        // Show/Hide Steps
        steps.forEach(step => step.classList.remove('active'));
        document.getElementById(`step${currentStep}`).classList.add('active');

        // Update Dots
        dots.forEach(dot => {
            dot.classList.remove('active');
            if (parseInt(dot.dataset.step) <= currentStep) {
                dot.classList.add('active');
            }
        });

        // Button States
        if (currentStep === 1) {
            prevBtn.style.visibility = 'hidden';
        } else {
            prevBtn.style.visibility = 'visible';
        }

        if (currentStep === totalSteps) {
            nextBtn.textContent = 'Enviar Pedido via WhatsApp';
            nextBtn.classList.add('btn-whatsapp');
            updateSummary();
        } else {
            nextBtn.textContent = 'Próximo';
            nextBtn.classList.remove('btn-whatsapp');
        }

        // Scroll to top of container
        const container = document.querySelector('.wizard-container');
        if (container) {
            container.scrollIntoView({ behavior: 'smooth' });
        }
    }

    function validateStep(step) {
        if (step === 1) {
            if (!formData.size) {
                alert('Por favor, escolha um tamanho.');
                return false;
            }
        }
        if (step === 2) {
            if (!formData.dough) {
                alert('Por favor, escolha a massa.');
                return false;
            }
        }
        if (step === 3) {
            if (!formData.filling1 || !formData.filling2) {
                alert('Por favor, escolha os dois recheios.');
                return false;
            }
        }
        if (step === 4) {
            if (!formData.coverage) {
                alert('Por favor, escolha a cobertura.');
                return false;
            }
        }
        if (step === 5) {
            if (!formData.decoration) {
                alert('Por favor, escolha uma opção de decoração.');
                return false;
            }
        }
        if (step === 6) {
            const name = document.getElementById('customerName').value;
            if (!name) {
                alert('Por favor, digite seu nome.');
                return false;
            }
            formData.name = name;
            formData.observations = document.getElementById('observations').value;
        }
        return true;
    }

    function updateSummary() {
        document.getElementById('summarySize').textContent = formData.size;
        document.getElementById('summaryDough').textContent = formData.dough;
        document.getElementById('summaryFilling1').textContent = formData.filling1;
        document.getElementById('summaryFilling2').textContent = formData.filling2;
        document.getElementById('summaryCoverage').textContent = formData.coverage;
        document.getElementById('summaryDecoration').textContent = formData.decoration;

        const extrasContainer = document.getElementById('summaryExtrasContainer');
        const extrasSpan = document.getElementById('summaryExtras');
        if (formData.decorationExtras.length > 0) {
            extrasContainer.style.display = 'block';
            extrasSpan.textContent = formData.decorationExtras.join(', ');
        } else {
            extrasContainer.style.display = 'none';
        }
    }

    function sendToWhatsApp() {
        const phoneNumber = "5511991311621"; // Replace with real number

        let message = `*Novo Pedido - Confeitaria Renata Magela* 🎂\n\n`;
        message += `*Cliente:* ${formData.name}\n`;
        message += `----------------------------------\n`;
        message += `*Tamanho:* ${formData.size}\n`;
        message += `*Massa:* ${formData.dough}\n`;
        message += `*Recheio 1:* ${formData.filling1}\n`;
        message += `*Recheio 2:* ${formData.filling2}\n`;
        message += `*Cobertura:* ${formData.coverage}\n`;
        message += `*Decoração:* ${formData.decoration}\n`;
        if (formData.decorationExtras.length > 0) {
            message += `*Extras:* ${formData.decorationExtras.join(', ')}\n`;
        }
        message += `----------------------------------\n`;
        if (formData.observations) {
            message += `*Observações:* ${formData.observations}\n`;
        }
        message += `\nAguardo confirmação!`;

        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
    }
});
