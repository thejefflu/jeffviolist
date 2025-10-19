// -----------------
// ON-SCROLL EFFECTS
// -----------------

window.addEventListener('scroll', reveal);

function reveal(){
  var reveals = document.querySelectorAll('.reveal');

  for (var i = 0; i < reveals.length; i++) {
    var windowHeight = window.innerHeight;
    var revealTop = reveals[i].getBoundingClientRect().top;
    var revealPoint = 50;

    if (revealTop < windowHeight - revealPoint) {
      reveals[i].classList.add('shown');
    } else {
      reveals[i].classList.remove('shown');
    }
  }
}

(function () {
  // threshold in em
  const thresholdEm = 999;
  const pxPerEm = parseFloat(getComputedStyle(document.documentElement).fontSize);
  const thresholdPx = thresholdEm * pxPerEm;

  if (window.innerWidth < thresholdPx) {
    const viewportHeight = window.innerHeight;

    document.querySelectorAll('.reveal').forEach(el => {
      const rect = el.getBoundingClientRect();
      const isVisible =
        rect.top < viewportHeight && rect.bottom > 0; // element intersects viewport

      if (isVisible) {
        el.classList.remove('reveal');
      }
    });
  }
})();

// window.addEventListener('DOMContentLoaded', alwaysshown);

// function alwaysshown(){
//   var reveals = document.querySelectorAll('.hover-container');

//   for (var i = 0; i < reveals.length; i++) {
//     var windowHeight = window.innerHeight;
//     var revealTop = reveals[i].getBoundingClientRect().top;
//     var revealPoint = 0;

//     if (revealTop < windowHeight - revealPoint) {
//       reveals[i].classList.add('always-shown');
//     }
//   }
// }


// -----------------
// SCROLL PREVENTION
// -----------------

function preventDefaultForScrollKeys(e) {
  if (keys[e.keyCode]) {
    preventDefault(e);
    return false;
  }
}

// left: 37, up: 38, right: 39, down: 40,
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
var keys = {37: 1, 38: 1, 39: 1, 40: 1};

function preventDefault(e) {
  e.preventDefault();
}

function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}

// modern Chrome requires { passive: false } when adding event
var supportsPassive = false;
try {
  window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
    get: function () { supportsPassive = true; } 
  }));
} catch(e) {}

var wheelOpt = supportsPassive ? { passive: false } : false;
var wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';


var scrollEnabled = true;

function toggleScroll() {
  if (scrollEnabled) {
    window.addEventListener('DOMMouseScroll', preventDefault, false); // older FF
    window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
    window.addEventListener('touchmove', preventDefault, wheelOpt); // mobile
    window.addEventListener('keydown', preventDefaultForScrollKeys, false);
    scrollEnabled = false;
  } else {
    window.removeEventListener('DOMMouseScroll', preventDefault, false);
    window.removeEventListener(wheelEvent, preventDefault, wheelOpt); 
    window.removeEventListener('touchmove', preventDefault, wheelOpt);
    window.removeEventListener('keydown', preventDefaultForScrollKeys, false);
    scrollEnabled = true;
  }
}

function enableScroll() {
  window.removeEventListener('DOMMouseScroll', preventDefault, false);
  window.removeEventListener(wheelEvent, preventDefault, wheelOpt); 
  window.removeEventListener('touchmove', preventDefault, wheelOpt);
  window.removeEventListener('keydown', preventDefaultForScrollKeys, false);
  scrollEnabled = true;
}


// -----------------
// ACCORDIONS
// -----------------

document.querySelectorAll('.accordion').forEach(acc => {
  const content = acc.querySelector('.content');

  // Remove inline height so we can reapply cleanly
  function clearTransitionEnd() {
    content.removeEventListener('transitionend', onOpenEnd);
    content.removeEventListener('transitionend', onCloseEnd);
  }

  function onOpenEnd(e) {
    if (e.propertyName !== 'height') return; // Only react to height changes
    content.style.height = 'auto';
    clearTransitionEnd();
  }

  function onCloseEnd(e) {
    if (e.propertyName !== 'height') return;
    reveal(); // run fade-in logic
    clearTransitionEnd();
  }

  acc.addEventListener('click', () => {
    clearTransitionEnd(); // kill old listeners

    if (acc.classList.contains('active')) {
      // Closing
      content.style.height = content.scrollHeight + 'px';
      requestAnimationFrame(() => {
        content.style.height = '0px';
      });
      content.addEventListener('transitionend', onCloseEnd);
      acc.classList.remove('active');

    } else {
      // Opening
      content.style.height = content.scrollHeight + 'px';
      content.addEventListener('transitionend', onOpenEnd);
      acc.classList.add('active');
    }
  });
});


// -----------------
// DYNAMIC HEADER
// -----------------
var navMenu = document.getElementById("nav-menu");

window.addEventListener("scroll", function() {
  var wordmark = document.querySelector('.wordmark');
  wordmark.classList.toggle("active", window.scrollY > 600);
})


// -----------------
// NAV BAR SMOOTH SCROLLING
// -----------------

function smoothScroll(target, duration) {
  navMenu.checked = false;
  target = document.querySelector(target);
  let targetPosition = target.getBoundingClientRect().top;
  let startPosition = window.scrollY;
  let startTime = null;

  function animation(currentTime) {
      if(startTime === null) startTime = currentTime;
      let timeElapsed = currentTime - startTime;

      let run = ease(timeElapsed, startPosition, targetPosition, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
  }

  function ease(t, b, c, d) {
      t /= d/2;
      if (t < 1) return c/2*t*t*t*t + b;
      t -= 2;
      return -c/2 * (t*t*t*t - 2) + b;
  };
          
  requestAnimationFrame(animation);
}

function smoothScrollWithAdjustment(target, duration) {
  navMenu.checked = false;
  target = document.querySelector(target);

  // Convert 5em to pixels based on current font size
  let offset = parseFloat(getComputedStyle(document.documentElement).fontSize) * 5;

  let targetPosition = target.getBoundingClientRect().top - offset;
  let startPosition = window.scrollY;
  let startTime = null;

  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    let timeElapsed = currentTime - startTime;

    let run = ease(timeElapsed, startPosition, targetPosition, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) requestAnimationFrame(animation);
  }

  function ease(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t * t * t + b;
    t -= 2;
    return -c / 2 * (t * t * t * t - 2) + b;
  }

  requestAnimationFrame(animation);
}

function menuOff() {
  navMenu.checked = false;
}

var nav0 = document.querySelector('.nav-top');
nav0.addEventListener('click', function() {
  smoothScroll('.scroll-helper-top', 1500);
});

var nav1 = document.querySelector('.nav-bio');
nav1.addEventListener('click', function() {
  smoothScroll('.scroll-helper-bio', 1500);
});

var nav2 = document.querySelector('.nav-services');
nav2.addEventListener('click', function() {
  smoothScroll('.scroll-helper-services', 1500);
});

var nav3 = document.querySelector('.nav-music');
nav3.addEventListener('click', function() {
  smoothScroll('.scroll-helper-music', 1500);
});

var nav4 = document.querySelector('.nav-faq');
nav4.addEventListener('click', function() {
  smoothScroll('.scroll-helper-faq', 1500);
});

var nav5 = document.querySelector('.nav-contact');
nav5.addEventListener('click', function() {
  smoothScroll('.scroll-helper-bottom', 1500);
});


// -----------------
// PARALLAX
// -----------------

(function() {
  const hero = document.querySelector('.hero');
  const speed = 0.4; // smaller = slower movement

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    hero.style.transform = `translateY(${scrollY * speed}px)`;
  });
})();


// -----------------
// SMOOTH SCROLLING
// -----------------

const lenis = new Lenis({
    duration: 1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
});

function raf(time) {
    lenis.raf(time);
    ScrollTrigger.update();
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);



// -----------------
// CARDS
// -----------------

const cards = document.querySelectorAll(".card");

cards.forEach(card => {
  card.addEventListener("click", () => {
    const currentActive = document.querySelector(".card.active");
    if (currentActive) {
      currentActive.classList.remove("active");
    }

    card.classList.add("active");
  });
});