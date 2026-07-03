document.addEventListener("DOMContentLoaded", () => {
    const loader = document.getElementById("loader");
    const progressBar = document.getElementById("scroll-progress");
    const header = document.getElementById("header");
    const menuToggle = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");
    const scrollTop = document.querySelector(".scroll-top");

    const closeMenu = () => navLinks?.classList.remove("active");

    const updateScrollState = () => {
        const scroll = window.scrollY;
        const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
        if (progressBar) progressBar.style.width = `${(scroll / max) * 100}%`;
        header?.classList.toggle("scrolled", scroll > 24);
        scrollTop?.classList.toggle("visible", scroll > 520);
    };

    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });

    menuToggle?.addEventListener("click", () => navLinks?.classList.toggle("active"));

    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-links a").forEach((link) => {
        if (link.getAttribute("href") === currentPage) link.classList.add("active");
        link.addEventListener("click", closeMenu);
    });

    const revealTargets = document.querySelectorAll(".reveal, .fade-in, .slide-up, .slide-left, .slide-right");
    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("active");
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.14, rootMargin: "0px 0px -52px 0px" });
        revealTargets.forEach((target) => revealObserver.observe(target));
    } else {
        revealTargets.forEach((target) => target.classList.add("active"));
    }

    document.querySelectorAll(".counter").forEach((counter) => {
        const target = Number.parseInt(counter.dataset.target || "0", 10);
        const suffix = counter.dataset.suffix || (target >= 100 ? "+" : "");
        const duration = 1200;
        let started = false;

        const animate = () => {
            const start = performance.now();
            const tick = (time) => {
                const progress = Math.min((time - start) / duration, 1);
                const value = Math.round(target * progress);
                counter.textContent = `${value}${progress === 1 ? suffix : ""}`;
                if (progress < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
        };

        const observer = new IntersectionObserver((entries) => {
            if (started || !entries[0].isIntersecting) return;
            started = true;
            animate();
            observer.disconnect();
        }, { threshold: 0.5 });
        observer.observe(counter);
    });

    const slider = document.querySelector(".testimonial-slider");
    const prevBtn = document.querySelector(".slider-prev");
    const nextBtn = document.querySelector(".slider-next");
    if (slider && prevBtn && nextBtn) {
        let position = 0;
        const cards = Array.from(slider.children);
        const updateSlider = () => {
            slider.style.transform = `translateX(${-position * 100}%)`;
        };
        nextBtn.addEventListener("click", () => {
            position = position >= cards.length - 1 ? 0 : position + 1;
            updateSlider();
        });
        prevBtn.addEventListener("click", () => {
            position = position <= 0 ? cards.length - 1 : position - 1;
            updateSlider();
        });
    }

    const filterButtons = document.querySelectorAll(".project-filter button");
    const projectItems = document.querySelectorAll(".project-card[data-category]");
    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            filterButtons.forEach((item) => item.classList.remove("active"));
            button.classList.add("active");
            const filter = button.dataset.filter;
            projectItems.forEach((item) => {
                item.hidden = !(filter === "all" || item.dataset.category === filter);
            });
        });
    });

    document.querySelectorAll(".faq-question").forEach((button) => {
        button.addEventListener("click", () => {
            const item = button.closest(".faq-item");
            item?.classList.toggle("active");
            const marker = button.querySelector("span");
            if (marker && item) marker.textContent = item.classList.contains("active") ? "-" : "+";
        });
    });

    const form = document.getElementById("contactForm");
    form?.addEventListener("submit", (event) => {
        event.preventDefault();
        document.querySelector(".popup-msg")?.classList.add("show");
        form.reset();
        setTimeout(() => document.querySelector(".popup-msg")?.classList.remove("show"), 3200);
    });

    const ensureChatbot = () => {
        if (document.querySelector(".chatbot-panel")) return;
        const chatbot = document.createElement("div");
        chatbot.innerHTML = `
            <button class="chatbot-toggle" type="button" aria-label="Open InfranovAI assistant">
                <i class="fas fa-robot" aria-hidden="true"></i><span>Ask InfranovAI</span>
            </button>
            <section class="chatbot-panel" aria-label="InfranovAI assistant" aria-live="polite">
                <div class="chatbot-header">
                    <div>
                        <h4>InfranovAI Assistant</h4>
                        <p>Ask about services, pricing, AI, legal support, startup consulting, NGO services, process or contact.</p>
                    </div>
                    <button type="button" class="chatbot-close" aria-label="Close chat">x</button>
                </div>
                <div class="chatbot-messages"></div>
                <form class="chatbot-form">
                    <input type="text" placeholder="Ask a question..." aria-label="Ask a question" required>
                    <button type="submit" class="btn btn-primary">Send</button>
                </form>
            </section>`;
        document.body.append(...chatbot.children);
    };

    ensureChatbot();

    const chatbotToggle = document.querySelector(".chatbot-toggle");
    const chatbotPanel = document.querySelector(".chatbot-panel");
    const chatbotClose = document.querySelector(".chatbot-close");
    const chatbotForm = document.querySelector(".chatbot-form");
    const chatbotMessages = document.querySelector(".chatbot-messages");

    const knowledgeBase = [
        {
            keywords: ["company", "about", "infranovtech", "who are you"],
            answer: "INFRANOVTECH PRIVATE LIMITED is a digital transformation company delivering software engineering, AI automation, digital marketing, legal and business services, startup consulting, and NGO/CSR support."
        },
        {
            keywords: ["services", "offer", "offering", "capabilities"],
            answer: "Our services cover IT services, AI and automation, digital marketing, legal and business services, startup consulting, and NGO/CSR support."
        },
        {
            keywords: ["website", "web application", "custom software", "enterprise", "mobile", "ecommerce", "e-commerce", "erp", "crm", "cloud", "api", "devops", "cyber", "maintenance"],
            answer: "IT services include website development, web applications, custom software, enterprise software, mobile apps, e-commerce, ERP, CRM, cloud solutions, API development, DevOps, cybersecurity, and maintenance."
        },
        {
            keywords: ["ai", "automation", "chatbot", "voice", "assistant", "workflow", "process", "document", "analytics", "business intelligence", "generative"],
            answer: "AI and automation services include AI chatbots, voice assistants, business assistants, workflow and process automation, document automation, AI analytics, BI dashboards, custom AI, generative AI, and AI integrations."
        },
        {
            keywords: ["marketing", "seo", "local seo", "google ads", "meta ads", "social", "branding", "content", "email", "lead", "reputation"],
            answer: "Digital marketing includes SEO, Local SEO, Google Ads, Meta Ads, social media marketing, branding, content marketing, email marketing, lead generation, and reputation management."
        },
        {
            keywords: ["legal", "registration", "gst", "msme", "trademark", "iso", "iec", "fssai", "compliance"],
            answer: "Legal and business services include company registration, startup registration, GST, MSME, trademark, ISO, IEC, FSSAI, and legal compliance support."
        },
        {
            keywords: ["startup", "pitch", "investor", "funding", "incubation", "mentorship", "startup india", "startup odisha", "growth strategy"],
            answer: "Startup consulting includes business planning, Startup India, Startup Odisha, pitch decks, investor connect, funding support, incubation, mentorship, and growth strategy."
        },
        {
            keywords: ["ngo", "csr", "trust", "society", "section 8", "12a", "80g", "documentation"],
            answer: "NGO and CSR services include NGO registration, trust registration, society registration, Section 8, CSR registration, 12A, 80G, compliance, and documentation."
        },
        {
            keywords: ["pricing", "price", "cost", "package", "quote", "estimate"],
            answer: "Pricing depends on scope, timeline, integrations, and support needs. We provide clear proposals after a discovery call. Starter website, growth automation, and enterprise transformation packages are available."
        },
        {
            keywords: ["hours", "business hours", "working hours", "timing"],
            answer: "Business hours are Monday to Friday, 9:30 AM to 6:30 PM IST. Project support and launch coordination can be planned around critical milestones."
        },
        {
            keywords: ["technology", "stack", "react", "next", "node", "python", "aws", "azure", "openai"],
            answer: "We work with modern frontend, backend, cloud, API, DevOps and AI stacks including React, Next.js, Node.js, Python, AWS, Azure, Docker, CI/CD, OpenAI integrations, and analytics systems."
        },
        {
            keywords: ["process", "how do you work", "delivery", "timeline"],
            answer: "Our delivery process is discovery, strategy, experience design, engineering, QA, deployment, automation, optimization, and ongoing support."
        },
        {
            keywords: ["contact", "phone", "email", "whatsapp", "address"],
            answer: "You can email hello@infranovtech.com, call +91 91700 55886, or use the contact form. The company serves clients from India with remote-first delivery."
        }
    ];

    const addChatMessage = (text, role) => {
        if (!chatbotMessages) return;
        const message = document.createElement("div");
        message.className = `chatbot-message ${role}`;
        message.textContent = text;
        chatbotMessages.appendChild(message);
        chatbotMessages.scrollTo({ top: chatbotMessages.scrollHeight, behavior: "smooth" });
    };

    const localReply = (question) => {
        const normalized = question.toLowerCase();
        const match = knowledgeBase.find((item) => item.keywords.some((keyword) => normalized.includes(keyword)));
        return match?.answer || "I can help with INFRANOVTECH services, pricing, AI automation, startup consulting, legal services, NGO/CSR support, technologies, business hours, process, and contact details. Please ask a more specific question.";
    };

    const getChatbotReply = async (question) => {
        const endpoint = window.INFRANOV_AI_ENDPOINT;
        if (!endpoint) return localReply(question);
        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question })
            });
            if (!response.ok) throw new Error("AI endpoint unavailable");
            const data = await response.json();
            return data.answer || data.message || localReply(question);
        } catch {
            return localReply(question);
        }
    };

    if (chatbotToggle && chatbotPanel && chatbotClose && chatbotForm && chatbotMessages) {
        chatbotToggle.addEventListener("click", () => {
            chatbotPanel.classList.toggle("open");
            if (chatbotPanel.classList.contains("open") && chatbotMessages.children.length === 0) {
                addChatMessage("Hello. I am InfranovAI. Ask me about our services, AI automation, startup consulting, legal support, NGO services, pricing, process or contact details.", "bot");
            }
        });

        chatbotClose.addEventListener("click", () => chatbotPanel.classList.remove("open"));

        chatbotForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            const input = chatbotForm.querySelector("input");
            const question = input?.value.trim();
            if (!question) return;
            addChatMessage(question, "user");
            input.value = "";
            addChatMessage(await getChatbotReply(question), "bot");
        });
    }

    document.querySelectorAll("[data-speed]").forEach((layer) => {
        window.addEventListener("scroll", () => {
            const speed = Number.parseFloat(layer.dataset.speed || "0");
            layer.style.translate = `0 ${window.scrollY * speed}px`;
        }, { passive: true });
    });

    scrollTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

    window.addEventListener("load", () => {
        if (!loader) return;
        loader.style.opacity = "0";
        setTimeout(() => loader.remove(), 500);
    });
});
