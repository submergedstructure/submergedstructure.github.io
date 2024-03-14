
document.addEventListener('DOMContentLoaded', function() {

    // Select all button elements with the 'click_to_disable_grammar' class
    const buttons = document.querySelectorAll('.click_to_disable_grammar');
    
    // Function to toggle class based on 'data-what' attribute
    const toggleGrammarHighlighting = function() {
        // Get the value of the 'data-what' attribute and prefix with 'disable_'
        const disableClass = 'disable_' + this.getAttribute('data-what');
        
        // Search for the closest parent with the 'lesson' class
        const lesson = this.closest('.lesson');
        
        // Toggle the constructed class on the found parent
        if (lesson) {
            lesson.classList.toggle(disableClass);
            // Immediately reflect the change on the button's 'disabled' class state
            checkAndToggleDisabled(this, disableClass);
        }
    };
    
    // Function to check and toggle the 'disabled' class
    const checkAndToggleDisabled = function(button, disableClass) {
        // Check if the closest parent '.lesson' has the constructed 'disable_' class
        const lessonHasDisabled = button.closest('.lesson').classList.contains(disableClass);
        // Set the 'disabled' class on the button based on the condition
        button.classList.toggle('disabled', lessonHasDisabled);
    };
    
    // Add click event listeners to all found buttons and set initial state
    buttons.forEach(button => {
        // Construct the class name based on the button's 'data-what' attribute
        const disableClass = 'disable_' + button.getAttribute('data-what');
        
        // Initial check and set the 'disabled' state based on the class on the parent '.lesson'
        checkAndToggleDisabled(button, disableClass);
        
        // Add the click event listener
        button.addEventListener('click', toggleGrammarHighlighting);
    });


    
    // Function to create the popup
    function createPopup(text, target) {
        const popup = document.createElement('div');
        popup.classList.add('popup');
        popup.innerHTML = text;
        document.body.appendChild(popup);

        // Position the popup above the target element
        const rect = target.getBoundingClientRect();

        // Adjust the position to account for scrolling
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        popup.style.left = `${rect.left}px`;
        popup.style.top = `${rect.bottom + scrollTop - popup.offsetHeight + 5}px`;
        popup.style.display = 'block';
    }

    // Function to remove the popup
    function removePopup() {
        const popup = document.querySelector('.popup');
        if (popup) {
            popup.remove();
        }
    }

    // Attach event listeners to elements with data-tooltip
    const tt_elements = document.querySelectorAll('[data-tooltip]');
    tt_elements.forEach(el => {
        el.addEventListener('mouseenter', function() {
            const tooltipText = this.getAttribute('data-tooltip');
            createPopup(tooltipText, this);
        });

        el.addEventListener('mouseleave', function() {
            removePopup();
        });
    });
    // Attach event listeners to elements with data-is-key
    const key_elements = document.querySelectorAll('[data-is-key]');
    key_elements.forEach(el => {
        el.addEventListener('mouseenter', function() {
            const tooltipText = "{{key_html}}";
            createPopup(tooltipText, this);
        });

        el.addEventListener('mouseleave', function() {
            removePopup();
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.tgl-btn').forEach(button => {
        button.addEventListener('click', function() {
            var content = this.parentElement.nextElementSibling;
            var wrapper = content.querySelector('.trans');

            if (content.style.height && content.style.height !== '0px') {
                content.style.height = '0';
            } else {
                // Reset to recalculate scrollHeight accurately
                content.style.height = '0px';
                content.offsetHeight; // Cause a reflow to ensure the reset took effect
                content.style.height = `${wrapper.scrollHeight}px`;
            }
        });
    });
});
