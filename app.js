

document.addEventListener("click", e => {
    const btn = e.target.closest(".unlike-btn");
    if (!btn) return;

    btn.classList.toggle("liked");
    const icon = btn.querySelector("i");
    const text = document.querySelector(".liked-text");

    if (btn.classList.contains("liked")) {
      // Swap to filled star + show text
      icon.className = "ri-thumb-down-fill ri-l";
      text.textContent = "Liked";
      text.classList.add("show");

      // Hide the word after 2s
      setTimeout(() => {
        text.classList.remove("show");
      }, 2000);
    } else {
      // Swap back to outline star
      icon.className = "ri-thumb-down-line ri-l";
      text.textContent = "";
      text.classList.remove("show");
    }
  });
  
// Mobile nav toggle
const mobileNavLinks = document.querySelectorAll(".bottom-nav a");
mobileNavLinks.forEach(link => {
  link.addEventListener("click", e => {
    mobileNavLinks.forEach(l => l.classList.remove("active"));
    e.currentTarget.classList.add("active");
  });
});


// JS helper: auto-create seamless clone
document.querySelectorAll('.marquee').forEach(el => {
  const text = el.textContent.trim();
  el.textContent = '';
  const span1 = document.createElement('span');
  const span2 = document.createElement('span');
  span1.textContent = text;
  span2.textContent = text;
  el.appendChild(span1);
  el.appendChild(span2);
});


document.addEventListener('DOMContentLoaded', () => {
  const ellipsisElements = document.querySelectorAll('.ellipsis-text');

  function applyTruncation() {
    ellipsisElements.forEach(el => {
      const fullText = el.getAttribute('data-fulltext') || el.textContent.trim();

      // Store original full text only once
      el.setAttribute('data-fulltext', fullText);

      // Split into words
      const words = fullText.split(/\s+/);

      // If more than 10 words → truncate + add ellipsis
      if (words.length > 10) {
        el.textContent = words.slice(0, 10).join(' ') + '...';
        el.classList.add('truncated');
        el.style.cursor = "pointer";
      } else {
        // If 10 words or fewer → show full text
        el.textContent = fullText;
        el.classList.remove('truncated');
        el.style.cursor = "default";
      }

      // Remove old event listener before adding a new one
      el.removeEventListener('click', handleEllipsisClick);

      // Attach tooltip event only if truncated
      if (words.length > 10) {
        el.addEventListener('click', handleEllipsisClick);
      }
    });
  }

  function handleEllipsisClick(e) {
    const fullText = e.target.getAttribute('data-fulltext');
    if (!fullText) return;

    // Remove any existing tooltip
    const existingTooltip = document.querySelector('.custom-tooltip');
    if (existingTooltip) existingTooltip.remove();

    // Create tooltip element
    const tooltip = document.createElement('div');
    tooltip.className = 'custom-tooltip';
    tooltip.textContent = fullText;
    document.body.appendChild(tooltip);

    // Position tooltip below clicked element
    const rect = e.target.getBoundingClientRect();
    let left = rect.left;
    let top = rect.bottom + window.scrollY + 8;

    // Prevent tooltip from going off-screen
    const tooltipWidth = tooltip.offsetWidth;
    const screenWidth = window.innerWidth;
    if (left + tooltipWidth > screenWidth - 10) {
      left = screenWidth - tooltipWidth - 10;
    }

    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';

    // Show tooltip with animation
    setTimeout(() => tooltip.classList.add('show'), 10);

    // Hide tooltip after 3s
    setTimeout(() => {
      tooltip.classList.remove('show');
      setTimeout(() => tooltip.remove(), 200);
    }, 3000);

    // Close tooltip if clicked outside
    document.addEventListener('click', function removeTooltip(ev) {
      if (!tooltip.contains(ev.target) && ev.target !== e.target) {
        tooltip.remove();
        document.removeEventListener('click', removeTooltip);
      }
    });
  }

  // Apply truncation initially + on window resize
  applyTruncation();
  window.addEventListener('resize', applyTruncation);
});

    // Utilities
    function qs(sel, ctx) { return (ctx || document).querySelector(sel); }
    function qsa(sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); }

    // Safe helpers for dataset read with fallbacks
    function getMeta(el, key) { return el && (el.dataset && el.dataset[key]) ? el.dataset[key] : el.getAttribute('data-' + key) || '' }


document.addEventListener("click", e => {
  const slides = document.querySelectorAll(".slide");

  // Open specific slide
  if (e.target.closest(".open-top")) toggleSlide("top");
  if (e.target.closest(".open-left")) toggleSlide("left");
  if (e.target.closest(".open-right")) toggleSlide("right");
  if (e.target.closest(".open-bottom")) toggleSlide("bottom");

  // Toast logic
  if (e.target.closest(".show-toast-top")) showToast(".toast-top");
  if (e.target.closest(".show-toast-bottom")) showToast(".toast-bottom");

  // Modale logic
  if (e.target.closest(".show-modale")) {
    document.querySelector(".modale-bg").classList.add("show");
  }
  if (e.target.closest(".no")) {
    document.querySelector(".modale-bg").classList.remove("show");
  }
  if (e.target.closest(".yes")) {
    alert("Confirmed!");
    document.querySelector(".modale-bg").classList.remove("show");
  }

  // Close buttons for slides
  if (e.target.closest(".close-btn")) {
    e.target.closest(".slide").classList.remove("active-top","active-left","active-right","active-bottom");
  }

  // Auto-close slides if clicking outside them and controls
  if (!e.target.closest(".slide") && !e.target.closest(".controls")) {
    slides.forEach(s => s.classList.remove("active-top","active-left","active-right","active-bottom"));
  }
});

// Helper functions
function toggleSlide(direction) {
  const slide = document.querySelector(".slide-" + direction);
  const className = "active-" + direction;
  const active = slide.classList.contains(className);
  document.querySelectorAll(".slide").forEach(s => s.classList.remove("active-top","active-left","active-right","active-bottom"));
  if (!active) slide.classList.add(className);
}

function showToast(selector) {
  const t = document.querySelector(selector);
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2500);
}
