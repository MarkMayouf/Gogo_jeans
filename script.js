// Mobile Menu Toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        const icon = mobileMenuButton.querySelector('i');
        if (mobileMenu.classList.contains('hidden')) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        } else {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        }
    });

    // Close mobile menu when clicking on a link
    const mobileMenuLinks = mobileMenu.querySelectorAll('a');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            const icon = mobileMenuButton.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Enhanced Navbar scroll effect
const navbar = document.getElementById('navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Form submission
const contactForm = document.querySelector('form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for your message! We will get back to you soon.');
        contactForm.reset();
    });
}

// Fade in on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all fade-in elements
document.querySelectorAll('.fade-in').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Chatbot Functionality
class Chatbot {
    constructor() {
        this.button = document.getElementById('chatbot-button');
        this.window = document.getElementById('chatbot-window');
        this.closeBtn = document.getElementById('chatbot-close');
        this.minimizeBtn = document.getElementById('chatbot-minimize');
        this.messagesContainer = document.getElementById('chatbot-messages');
        this.input = document.getElementById('chatbot-input');
        this.sendBtn = document.getElementById('chatbot-send');
        this.charCount = document.getElementById('char-count');
        this.isOpen = false;
        this.isMinimized = false;
        this.userInfo = {
            name: null,
            email: null,
            phone: null
        };
        
        this.init();
    }

    init() {
        if (!this.button || !this.window) return;

        // Toggle chatbot window
        this.button.addEventListener('click', () => this.toggle());
        this.closeBtn.addEventListener('click', () => this.close());
        if (this.minimizeBtn) {
            this.minimizeBtn.addEventListener('click', () => this.minimize());
        }

        // Send message on button click
        this.sendBtn.addEventListener('click', () => this.sendMessage());

        // Send message on Enter key (but not Shift+Enter)
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Prevent zoom on input focus for mobile devices
        this.input.addEventListener('focus', () => {
            if (window.innerWidth <= 768) {
                const viewport = document.querySelector('meta[name="viewport"]');
                if (viewport) {
                    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
                }
            }
        });

        this.input.addEventListener('blur', () => {
            if (window.innerWidth <= 768) {
                const viewport = document.querySelector('meta[name="viewport"]');
                if (viewport) {
                    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
                }
            }
        });

        // Character counter
        this.input.addEventListener('input', () => this.updateCharCount());

        // Quick reply buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.quick-reply')) {
                const button = e.target.closest('.quick-reply');
                const reply = button.getAttribute('data-reply');
                this.handleQuickReply(reply);
            }
        });

        // Auto-focus input when window opens
        this.updateCharCount();
        
        // Add welcome message
        this.addWelcomeMessage();
    }

    addWelcomeMessage() {
        // Clear any existing messages first
        this.messagesContainer.innerHTML = '';
        this.addMessage("Hi! 👋 Welcome to GOGO JEANS!\n\nI can help you with:\n• Our brands\n• Partnerships\n• Pricing\n• Contact info\n\nWhat would you like to know?");
        this.addQuickReplies(['brands', 'partnership', 'pricing', 'contact']);
    }

    toggle() {
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            this.window.classList.add('active');
            this.window.classList.remove('minimized');
            this.isMinimized = false;
            // Prevent body scroll on mobile when chatbot is open
            if (window.innerWidth <= 768) {
                document.body.style.overflow = 'hidden';
            }
            setTimeout(() => {
                this.input.focus();
                // Prevent zoom on iOS when focusing input
                if (window.innerWidth <= 768) {
                    const viewport = document.querySelector('meta[name="viewport"]');
                    if (viewport) {
                        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
                    }
                }
            }, 300);
        } else {
            this.window.classList.remove('active');
            // Restore body scroll
            document.body.style.overflow = '';
            // Restore viewport zoom
            if (window.innerWidth <= 768) {
                const viewport = document.querySelector('meta[name="viewport"]');
                if (viewport) {
                    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
                }
            }
        }
    }

    close() {
        this.isOpen = false;
        this.isMinimized = false;
        this.window.classList.remove('active');
        this.window.classList.remove('minimized');
        // Restore body scroll
        document.body.style.overflow = '';
        // Restore viewport zoom
        if (window.innerWidth <= 768) {
            const viewport = document.querySelector('meta[name="viewport"]');
            if (viewport) {
                viewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
            }
        }
    }

    minimize() {
        this.isMinimized = !this.isMinimized;
        if (this.isMinimized) {
            this.window.classList.add('minimized');
        } else {
            this.window.classList.remove('minimized');
            setTimeout(() => this.input.focus(), 100);
        }
    }

    formatTime() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12;
        const formattedMinutes = minutes.toString().padStart(2, '0');
        return `${formattedHours}:${formattedMinutes} ${ampm}`;
    }

    formatMessage(text) {
        // Convert newlines to <br>
        text = text.replace(/\n/g, '<br>');
        
        // Auto-detect and format links
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        text = text.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
        
        // Format email addresses
        const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/g;
        text = text.replace(emailRegex, '<a href="mailto:$1">$1</a>');
        
        // Format phone numbers
        const phoneRegex = /(\+?1?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/g;
        text = text.replace(phoneRegex, '<a href="tel:$1">$1</a>');
        
        return text;
    }

    addMessage(text, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chatbot-message ${isUser ? 'user' : 'bot'}`;

        if (!isUser) {
            const avatar = document.createElement('div');
            avatar.className = 'chatbot-avatar';
            avatar.innerHTML = '<i class="fas fa-robot"></i>';
            messageDiv.appendChild(avatar);
        }

        const messageWrapper = document.createElement('div');
        messageWrapper.className = 'message-wrapper';

        const content = document.createElement('div');
        content.className = 'message-content';
        content.innerHTML = `<p>${this.formatMessage(text)}</p>`;
        messageWrapper.appendChild(content);

        const timeDiv = document.createElement('div');
        timeDiv.className = 'message-time';
        timeDiv.textContent = this.formatTime();
        messageWrapper.appendChild(timeDiv);

        messageDiv.appendChild(messageWrapper);

        this.messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }

    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chatbot-message bot';
        typingDiv.id = 'typing-indicator';

        const avatar = document.createElement('div');
        avatar.className = 'chatbot-avatar';
        avatar.innerHTML = '<i class="fas fa-robot"></i>';
        typingDiv.appendChild(avatar);

        const typingContent = document.createElement('div');
        typingContent.className = 'typing-indicator';
        typingContent.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        typingDiv.appendChild(typingContent);

        this.messagesContainer.appendChild(typingDiv);
        this.scrollToBottom();
    }

    removeTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    scrollToBottom() {
        setTimeout(() => {
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        }, 100);
    }

    updateCharCount() {
        if (!this.charCount) return;
        const count = this.input.value.length;
        const maxLength = this.input.getAttribute('maxlength') || 500;
        this.charCount.textContent = `${count}/${maxLength}`;
        if (count > maxLength * 0.9) {
            this.charCount.style.color = '#ef4444';
        } else {
            this.charCount.style.color = '#9ca3af';
        }
    }

    sendMessage() {
        const message = this.input.value.trim();
        if (!message) return;

        // Add user message
        this.addMessage(message, true);
        this.input.value = '';
        this.updateCharCount();

        // Disable send button temporarily
        this.sendBtn.disabled = true;

        // Show typing indicator
        this.showTypingIndicator();

        // Simulate bot response delay
        setTimeout(() => {
            this.removeTypingIndicator();
            this.handleUserMessage(message);
            this.sendBtn.disabled = false;
        }, 1000 + Math.random() * 500); // Random delay between 1-1.5s for realism
    }

    handleQuickReply(reply) {
        const replies = {
            brands: "Our 7 Brands:\n\n• Gogo Jeans - Premium denim\n• Gogo Star - Trendsetting fashion\n• Flying Angel Jeans - Comfortable styles\n• Supra Denim - High-quality denim\n• NewMax - Contemporary fashion\n• Forever Young Jeans - Timeless styles\n• Jumping Joy - Fun & vibrant\n\nWhich interests you?",
            partnership: "Partnership Benefits:\n\n✅ Low minimum orders\n✅ Quick turnaround\n✅ Private labeling\n✅ Retail & business partnerships\n✅ Flexible terms\n\nReady to partner?",
            pricing: "Pricing:\n\n💰 Competitive rates\n📦 Low minimum orders\n🎯 Custom quotes\n⚡ Volume discounts\n\nNeed a quote?",
            contact: "Contact Us:\n\n📧 info@gogojeans.com\n📞 +1 (555) 123-4567\n🌐 Contact form on website\n\nWe're here to help!",
            order: "Ordering:\n\n📦 Low minimums\n⚡ Quick lead times\n🚚 Reliable shipping\n🏷️ Private labeling\n🌍 Global delivery\n\nReady to order?",
            services: "What We Offer:\n\n🏷️ Private labeling\n👕 7 fashion brands\n⚡ Fast production\n📦 Low minimums\n🌍 Global shipping\n🎯 Quality guarantee\n\nWhat interests you?"
        };

        this.showTypingIndicator();
        setTimeout(() => {
            this.removeTypingIndicator();
            this.addMessage(replies[reply] || "How can I help you today?");
            
            // Context-aware quick replies
            const contextReplies = {
                brands: ['partnership', 'pricing', 'contact'],
                partnership: ['pricing', 'order', 'contact'],
                pricing: ['order', 'partnership', 'contact'],
                contact: ['brands', 'partnership', 'pricing'],
                order: ['pricing', 'partnership', 'contact'],
                services: ['partnership', 'pricing', 'contact']
            };
            this.addQuickReplies(contextReplies[reply] || ['brands', 'partnership', 'contact']);
        }, 600);
    }

    handleUserMessage(message) {
        const lowerMessage = message.toLowerCase().trim();

        // Check for greetings
        if (lowerMessage.match(/\b(hi|hello|hey|good morning|good afternoon|good evening|greetings)\b/)) {
            this.addMessage("Hello! 👋 How can I help you today?");
            this.addQuickReplies(['brands', 'partnership', 'pricing', 'contact']);
            return;
        }

        // Check for thanks/gratitude
        if (lowerMessage.match(/\b(thanks|thank you|thank|appreciate|grateful)\b/)) {
            this.addMessage("You're welcome! 😊\n\nIs there anything else I can help you with?");
            this.addQuickReplies(['brands', 'partnership', 'contact']);
            return;
        }

        // Check for goodbye
        if (lowerMessage.match(/\b(bye|goodbye|see you|later|farewell|exit|quit)\b/)) {
            this.addMessage("Thanks for visiting GOGO JEANS! 👋\n\nFeel free to come back anytime if you have questions.");
            return;
        }

        // Check for brand/product inquiries
        if (lowerMessage.match(/\b(brand|brands|product|products|jeans|denim|clothing|apparel|collection|line|what brands|which brand)\b/)) {
            this.addMessage("Our 7 Brands:\n\n• Gogo Jeans - Premium denim\n• Gogo Star - Trendsetting fashion\n• Flying Angel Jeans - Comfortable styles\n• Supra Denim - High-quality denim\n• NewMax - Contemporary fashion\n• Forever Young Jeans - Timeless styles\n• Jumping Joy - Fun & vibrant\n\nWhich interests you?");
            this.addQuickReplies(['partnership', 'pricing', 'contact']);
            return;
        }

        // Check for partnership inquiries
        if (lowerMessage.match(/\b(partner|partnership|collaborate|business|retail|supplier|distributor|reseller)\b/)) {
            this.addMessage("Partnership Benefits:\n\n✅ Low minimum orders\n✅ Quick turnaround (lightning fast!)\n✅ Private labeling available\n✅ Retail & business partnerships\n✅ Flexible terms\n\nInterested in partnering?");
            this.addQuickReplies(['pricing', 'order', 'contact']);
            return;
        }

        // Check for pricing inquiries
        if (lowerMessage.match(/\b(price|pricing|cost|costs|expensive|cheap|affordable|quote|quotation|how much|prices)\b/)) {
            this.addMessage("Pricing:\n\n💰 Competitive rates\n📦 Low minimum orders\n🎯 Custom quotes\n⚡ Volume discounts\n\nNeed a quote? Contact us!");
            this.addQuickReplies(['order', 'partnership', 'contact']);
            return;
        }

        // Check for order/minimum inquiries
        if (lowerMessage.match(/\b(order|orders|buy|purchase|minimum|min|moq|lead time|delivery|shipping|turnaround|timeline|how to order|place order)\b/)) {
            this.addMessage("Ordering:\n\n📦 Low minimums\n⚡ Quick lead times\n🚚 Reliable shipping\n🏷️ Private labeling\n🌍 Global delivery\n\nReady to order?");
            this.addQuickReplies(['pricing', 'partnership', 'contact']);
            return;
        }

        // Check for contact information
        if (lowerMessage.match(/\b(contact|email|phone|address|reach|call|get in touch|support|where are you|location)\b/)) {
            this.addMessage("Contact Us:\n\n📧 info@gogojeans.com\n📞 +1 (555) 123-4567\n🌐 Contact form on website\n\nWe're here to help!");
            this.addQuickReplies(['brands', 'partnership', 'pricing']);
            return;
        }

        // Check for private labeling
        if (lowerMessage.match(/\b(private label|private labeling|custom|customize|customization|white label|own brand|branding)\b/)) {
            this.addMessage("Private Labeling:\n\n🏷️ Custom branding\n🎨 Design flexibility\n📦 Low minimums\n⚡ Fast turnaround\n🌍 Global reach\n\nPerfect for your brand!");
            this.addQuickReplies(['pricing', 'order', 'contact']);
            return;
        }

        // Check for services
        if (lowerMessage.match(/\b(service|services|what do you do|capabilities|offer|offerings|what you offer)\b/)) {
            this.addMessage("What We Offer:\n\n🏷️ Private labeling\n👕 7 fashion brands\n⚡ Fast production\n📦 Low minimums\n🌍 Global shipping\n🎯 Quality guarantee\n\nWhat interests you?");
            this.addQuickReplies(['brands', 'partnership', 'pricing']);
            return;
        }

        // Check for help
        if (lowerMessage.match(/\b(help|need help|stuck|confused|don't know|what can you|what do you|how can you help)\b/)) {
            this.addMessage("I can help with:\n\n📦 Brands & products\n🤝 Partnerships\n💰 Pricing\n📞 Contact info\n🏷️ Private labeling\n📦 Ordering\n\nWhat do you need?");
            this.addQuickReplies(['brands', 'partnership', 'pricing', 'contact']);
            return;
        }

        // Check for specific brand mentions
        const brandMentions = {
            'gogo jeans': "Gogo Jeans:\n\nPremium denim brand\nHigh-quality materials\nStylish designs for all occasions\n\nInterested?",
            'gogo star': "Gogo Star:\n\nTrendsetting fashion\nModern designs\nContemporary styles\n\nInterested?",
            'flying angel': "Flying Angel Jeans:\n\nComfortable fits\nStylish denim wear\nQuality materials\n\nInterested?",
            'supra denim': "Supra Denim:\n\nHigh-quality denim\nPremium products\nDurable designs\n\nInterested?",
            'newmax': "NewMax:\n\nContemporary fashion\nModern solutions\nTrendy styles\n\nInterested?",
            'forever young': "Forever Young Jeans:\n\nTimeless styles\nAll ages\nClassic designs\n\nInterested?",
            'jumping joy': "Jumping Joy:\n\nFun & vibrant\nEnergetic styles\nPlayful designs\n\nInterested?"
        };

        for (const [brand, response] of Object.entries(brandMentions)) {
            if (lowerMessage.includes(brand)) {
                this.addMessage(response);
                this.addQuickReplies(['partnership', 'pricing', 'contact']);
                return;
            }
        }

        // Default response - more helpful and concise
        this.addMessage("I can help with:\n\n📦 Brands & products\n🤝 Partnerships\n💰 Pricing\n📞 Contact info\n🏷️ Private labeling\n\nWhat would you like to know?");
        this.addQuickReplies(['brands', 'partnership', 'pricing', 'contact']);
    }

    addQuickReplies(replies) {
        const quickRepliesDiv = document.createElement('div');
        quickRepliesDiv.className = 'quick-replies';
        
        const replyConfigs = {
            brands: { text: 'Our Brands', icon: 'fa-tshirt' },
            products: { text: 'Our Products', icon: 'fa-tshirt' },
            partnership: { text: 'Partnership', icon: 'fa-handshake' },
            pricing: { text: 'Pricing', icon: 'fa-dollar-sign' },
            contact: { text: 'Contact', icon: 'fa-phone' },
            order: { text: 'Order Info', icon: 'fa-shopping-cart' },
            services: { text: 'Services', icon: 'fa-cog' }
        };

        replies.forEach(reply => {
            const config = replyConfigs[reply] || { text: reply.charAt(0).toUpperCase() + reply.slice(1), icon: 'fa-question' };
            const button = document.createElement('button');
            button.className = 'quick-reply';
            button.setAttribute('data-reply', reply);
            button.innerHTML = `<i class="fas ${config.icon}"></i> ${config.text}`;
            quickRepliesDiv.appendChild(button);
        });

        // Add to the last bot message
        const lastMessage = this.messagesContainer.lastElementChild;
        if (lastMessage && lastMessage.classList.contains('bot')) {
            const messageWrapper = lastMessage.querySelector('.message-wrapper');
            if (messageWrapper) {
                messageWrapper.appendChild(quickRepliesDiv);
                this.scrollToBottom();
            }
        }
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Chatbot();
});

