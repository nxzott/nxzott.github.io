document.querySelectorAll('.links-section .link-btn').forEach(function(link) {
    link.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    });
    link.addEventListener('copy', function(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    });
    link.addEventListener('cut', function(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    });
    link.addEventListener('mousedown', function(e) {
        if (e.button === 2) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    });
    link.addEventListener('selectstart', function(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    });
    link.addEventListener('dragstart', function(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    });
    link.addEventListener('touchstart', function(e) {
        link.longPressTimer = setTimeout(function() {
            e.preventDefault();
            e.stopPropagation();
        }, 350);
    });
    link.addEventListener('touchend', function(e) {
        clearTimeout(link.longPressTimer);
    });
    link.tabIndex = -1;
    link.setAttribute('unselectable', 'on');
    link.style.userSelect = 'none';
    link.style.webkitUserSelect = 'none';
    link.style.MozUserSelect = 'none';
    link.style.msUserSelect = 'none';
    link.style.webkitTapHighlightColor = 'transparent';
    link.style.outline = 'none';
});

document.addEventListener("DOMContentLoaded", function() {
  var bioElem = document.getElementById('profile-bio');
  var texts = [
    "Hi there im making addons",
    "Download all my addons on discord"
  ];

  bioElem.innerHTML = '<span class="typing-text"></span><span class="typing-cursor" aria-hidden="true"></span>';
  var textSpan = bioElem.querySelector('.typing-text');
  var typingSpeed = 60;
  var deletingSpeed = 30;
  var pauseAfterTyping = 1400;
  var pauseAfterDeleting = 300;

  var textIndex = 0;
  var charIndex = 0;
  var isDeleting = false;

  function loop() {
    var currentText = texts[textIndex];
    if (!isDeleting) {
      charIndex++;
      textSpan.textContent = currentText.slice(0, charIndex);
      if (charIndex === currentText.length) {
        isDeleting = true;
        setTimeout(loop, pauseAfterTyping);
      } else {
        setTimeout(loop, typingSpeed);
      }
    } else {
      charIndex--;
      textSpan.textContent = currentText.slice(0, charIndex);
      if (charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        setTimeout(loop, pauseAfterDeleting);
      } else {
        setTimeout(loop, deletingSpeed);
      }
    }
  }

  setTimeout(loop, 300);
});
