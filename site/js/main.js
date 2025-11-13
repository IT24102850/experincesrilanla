// main.js — small helper for nav toggles and simple carousel
document.addEventListener('DOMContentLoaded', function(){
  // Nav toggles — toggle the .active class on the target nav so CSS handles animation/visibility
  document.querySelectorAll('.nav-toggle').forEach(function(btn){
    btn.addEventListener('click', function(){
      var targetId = btn.getAttribute('aria-controls');
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      var nav = document.getElementById(targetId);
      if(nav){ nav.classList.toggle('active', !expanded); }
    });
  });

  // Simple carousel for reviews
  var carousels = document.querySelectorAll('[data-carousel]');
  carousels.forEach(function(car){
    var track = car.querySelector('.carousel-track');
    var items = car.querySelectorAll('.carousel-item');
    var prev = car.querySelector('.carousel-btn.prev');
    var next = car.querySelector('.carousel-btn.next');
    if(!track || items.length === 0) return;
    var index = 0;
    function show(i){
      index = (i + items.length) % items.length;
      var offset = -index * (items[0].offsetWidth + 12);
      track.style.transform = 'translateX(' + offset + 'px)';
    }
    next && next.addEventListener('click', function(){ show(index+1); });
    prev && prev.addEventListener('click', function(){ show(index-1); });
    // basic auto-advance
    setInterval(function(){ show(index+1); }, 6000);
    // ensure layout after images load
    window.addEventListener('resize', function(){ show(index); });
  });

  // Planner form: basic client-side save draft
  var saveBtn = document.getElementById('saveDraft');
  if(saveBtn){
    saveBtn.addEventListener('click', function(){
      var form = document.getElementById('plannerForm');
      if(!form) return;
      var data = {};
      new FormData(form).forEach(function(value,key){ data[key]=value; });
      localStorage.setItem('tripPlannerDraft', JSON.stringify(data));
      alert('Draft saved locally. We will pre-fill the form when you return.');
    });
    // Prefill from draft
    var draft = localStorage.getItem('tripPlannerDraft');
    if(draft){
      try{
        var values = JSON.parse(draft);
        Object.keys(values).forEach(function(k){
          var el = document.querySelector('[name="'+k+'"]');
          if(el) el.value = values[k];
        });
      }catch(e){/* ignore */}
    }
  }

  /* ===== Theme toggle & dynamic luxury stylesheet loader ===== */
  (function(){
    var THEME_KEY = 'siteTheme';
    var luxuryId = 'luxury-theme-css';

    function loadLuxuryStylesheet(){
      if(document.getElementById(luxuryId)) return;
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'css/theme-luxury.css';
      link.id = luxuryId;
      document.head.appendChild(link);
    }

    function unloadLuxuryStylesheet(){
      var el = document.getElementById(luxuryId);
      if(el) el.parentNode.removeChild(el);
    }

    function applyTheme(name){
      if(name === 'luxury'){
        loadLuxuryStylesheet();
        document.documentElement.classList.add('theme-luxury');
      } else {
        unloadLuxuryStylesheet();
        document.documentElement.classList.remove('theme-luxury');
      }
      try{ localStorage.setItem(THEME_KEY, name); } catch(e){}
      updateToggleUI(name);
    }

    function updateToggleUI(name){
      var btn = document.querySelector('.theme-toggle');
      if(!btn) return;
      btn.setAttribute('aria-pressed', name === 'luxury' ? 'true' : 'false');
      btn.title = name === 'luxury' ? 'Switch to comfort theme' : 'Switch to luxury theme';
      btn.innerHTML = name === 'luxury' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }

    // Inject a small toggle into the header if present
    var header = document.querySelector('.header-container');
    if(header){
      var toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'theme-toggle';
      toggle.setAttribute('aria-label', 'Toggle theme');
      toggle.setAttribute('aria-pressed', 'false');
      toggle.innerHTML = '<i class="fas fa-moon"></i>';
      toggle.addEventListener('click', function(){
        var current = null;
        try { current = localStorage.getItem(THEME_KEY); } catch(e){}
        var next = current === 'luxury' ? 'comfort' : 'luxury';
        applyTheme(next);
      });
      header.appendChild(toggle);
    }

    // Initialize based on stored preference (or default to comfort)
    try{
      var stored = localStorage.getItem(THEME_KEY) || 'comfort';
      applyTheme(stored);
    }catch(e){ applyTheme('comfort'); }
  })();
});
