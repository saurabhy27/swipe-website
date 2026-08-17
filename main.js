/**
 * Swipe — Interactive Landing Page JS (CRED & Cheq inspired)
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Sticky Navigation Bar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. 3D Card Parallax Tilt Effect on Mouse Move
    const cardsContainer = document.getElementById('cardsContainer');
    const tiltCards = document.querySelectorAll('.tilt-card');

    if (cardsContainer && tiltCards.length > 0) {
        cardsContainer.addEventListener('mousemove', (e) => {
            const rect = cardsContainer.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            tiltCards.forEach((card, index) => {
                const multiplier = (index + 1) * 0.04;
                const rotateX = -y * multiplier;
                const rotateY = x * multiplier;
                const baseRotate = index === 0 ? -12 : 8;

                card.style.transform = `rotate(${baseRotate}deg) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${30 * (index + 1)}px)`;
            });
        });

        cardsContainer.addEventListener('mouseleave', () => {
            tiltCards.forEach((card, index) => {
                const baseRotate = index === 0 ? -12 : 8;
                card.style.transform = `rotate(${baseRotate}deg) translateZ(${30 * (index + 1)}px)`;
            });
        });
    }

    // 3. Interactive Spend & Rewards Calculator Simulator
    const spendRange = document.getElementById('spendRange');
    const spendVal = document.getElementById('spendVal');
    const rewardVal = document.getElementById('rewardVal');
    const catOpt = document.getElementById('catOpt');
    const chargeDef = document.getElementById('chargeDef');
    const milestoneTrack = document.getElementById('milestoneTrack');
    const chips = document.querySelectorAll('.chips-group .chip');

    let currentMultiplier = 0.06; // Default rewards rate

    function formatINR(val) {
        return '₹' + Math.round(val).toLocaleString('en-IN');
    }

    function calculateRewards() {
        if (!spendRange) return;
        const spend = parseFloat(spendRange.value);
        
        // Update range display
        spendVal.textContent = formatINR(spend);

        // Calculate totals
        const annualSpend = spend * 12;
        const totalRewards = annualSpend * currentMultiplier;
        
        const catOptVal = totalRewards * 0.5;
        const chargeDefVal = totalRewards * 0.1;
        const milestoneVal = totalRewards * 0.4;

        rewardVal.textContent = formatINR(totalRewards);
        if (catOpt) catOpt.textContent = formatINR(catOptVal);
        if (chargeDef) chargeDef.textContent = formatINR(chargeDefVal);
        if (milestoneTrack) milestoneTrack.textContent = formatINR(milestoneVal);
    }

    if (spendRange) {
        spendRange.addEventListener('input', calculateRewards);
    }

    chips.forEach((chip) => {
        chip.addEventListener('click', () => {
            chips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            
            // Randomize slight rate change for dynamic feel
            currentMultiplier = 0.05 + Math.random() * 0.03;
            calculateRewards();
        });
    });

    // Initial calculation
    calculateRewards();

    // 4. Scroll Reveal Animations (IntersectionObserver)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealElements = document.querySelectorAll('.feature-card, .bank-badge, .stat-item, .sec-item, .glass-card');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        revealObserver.observe(el);
    });
});
