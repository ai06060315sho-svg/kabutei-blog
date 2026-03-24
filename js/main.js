document.addEventListener('DOMContentLoaded', function() {
  var toggle = document.getElementById('menuToggle');
  var nav = document.getElementById('globalNav');

  if (toggle && nav) {
    toggle.addEventListener('click', function() {
      nav.classList.toggle('open');
      toggle.textContent = nav.classList.contains('open') ? 'Close' : 'Menu';
    });
  }
});
