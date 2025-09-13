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
  var idx = 0;
  function switchBio() {
    bioElem.classList.remove('bio-show');
    bioElem.classList.add('bio-fade');
    setTimeout(function() {
      idx = 1 - idx;
      bioElem.textContent = texts[idx];
      bioElem.classList.remove('bio-fade');
      bioElem.classList.add('bio-show');
    }, 400);
  }
  bioElem.classList.add('bio-show');
  setInterval(switchBio, 2000);
});
