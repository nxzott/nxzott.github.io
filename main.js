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

window.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        document.getElementById('loader').style.opacity = '0';
        setTimeout(function() {
            document.getElementById('loader').style.display = 'none';
            document.querySelector('.container').style.opacity = 1;
        }, 350);
    }, 800);
});