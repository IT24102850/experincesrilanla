// main.js — small helper for nav toggles and simple carousel
document.addEventListener('DOMContentLoaded', function(){
  // Nav toggles
  document.querySelectorAll('.nav-toggle').forEach(function(btn){
    btn.addEventListener('click', function(){
      var targetId = btn.getAttribute('aria-controls');
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      var nav = document.getElementById(targetId);
      if(nav){ nav.style.display = expanded ? '' : 'block'; }
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
});
