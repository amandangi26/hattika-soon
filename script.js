/* ============================================================
   Hattika — script.js
   Handles: countdown timer, email notification form submit,
   and a lightweight IntersectionObserver for scroll reveals.
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     1. Countdown timer
     Target date: 90 days from the day the page first loads.
     If you want a fixed date change LAUNCH_DATE below.
  ---------------------------------------------------------- */
  var LAUNCH_DATE_KEY = 'hattika_launch_date';

  function getLaunchDate() {
    var stored = localStorage.getItem(LAUNCH_DATE_KEY);
    if (stored) {
      return new Date(stored);
    }
    var target = new Date();
    target.setDate(target.getDate() + 90);
    target.setHours(0, 0, 0, 0);
    localStorage.setItem(LAUNCH_DATE_KEY, target.toISOString());
    return target;
  }

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function updateCountdown() {
    var now = Date.now();
    var target = getLaunchDate().getTime();
    var diff = Math.max(target - now, 0);

    var days    = Math.floor(diff / 86400000);
    var hours   = Math.floor((diff % 86400000) / 3600000);
    var minutes = Math.floor((diff % 3600000) / 60000);
    var seconds = Math.floor((diff % 60000) / 1000);

    var elDays    = document.getElementById('cd-days');
    var elHours   = document.getElementById('cd-hours');
    var elMinutes = document.getElementById('cd-minutes');
    var elSeconds = document.getElementById('cd-seconds');

    if (elDays)    elDays.textContent    = pad(days);
    if (elHours)   elHours.textContent   = pad(hours);
    if (elMinutes) elMinutes.textContent = pad(minutes);
    if (elSeconds) elSeconds.textContent = pad(seconds);
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ----------------------------------------------------------
     2. Notify Me — email form
  ---------------------------------------------------------- */
  var form  = document.getElementById('notify-form');
  var input = document.getElementById('notify-email');
  var toast = document.getElementById('notify-toast');

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = input ? input.value.trim() : '';

      if (!isValidEmail(email)) {
        showToast('Please enter a valid email address.', true);
        return;
      }

      /* In a real deployment you'd POST to your backend / mailing list here. */
      showToast('You\'re on the list! We\'ll notify you at launch. ✦', false);
      if (input) input.value = '';
    });
  }

  function showToast(message, isError) {
    if (!toast) return;
    toast.textContent = message;
    toast.style.color = isError ? '#c0392b' : 'var(--accent)';
    toast.style.opacity = '1';
    setTimeout(function () {
      toast.style.opacity = '0';
    }, 4000);
  }

  /* ----------------------------------------------------------
     3. Subtle scroll-reveal via IntersectionObserver
     (All main elements are already animated on load via CSS;
      this is an extra layer for any below-the-fold content.)
  ---------------------------------------------------------- */
  if ('IntersectionObserver' in window) {
    var revealEls = document.querySelectorAll('[data-reveal]');
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  }
  /* ----------------------------------------------------------
     4. Footer year
  ---------------------------------------------------------- */
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}());
