/* Performity marketing site - interactions */
(function(){
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  /* nav glass state + scroll progress */
  var nav = document.querySelector('.nav');
  var bar = document.querySelector('.progress');
  function onScroll(){
    if(nav) nav.classList.toggle('scrolled', window.scrollY > 12);
    if(bar){
      var h = document.documentElement;
      var p = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
      bar.style.width = (p*100) + '%';
    }
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  /* mobile menu */
  var burger = document.querySelector('.burger');
  var menu = document.querySelector('.mobile-menu');
  if(burger && menu){
    burger.addEventListener('click', function(){ burger.classList.toggle('open'); menu.classList.toggle('show'); });
    menu.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', function(){ burger.classList.remove('open'); menu.classList.remove('show'); }); });
  }

  /* 3D tilt (pointer parallax) */
  if(!reduce){
    document.querySelectorAll('.tilt').forEach(function(el){
      var stage = el.closest('.hero-stage') || el;
      stage.addEventListener('mousemove', function(e){
        var r = stage.getBoundingClientRect();
        var x = (e.clientX - r.left)/r.width - .5;
        var y = (e.clientY - r.top)/r.height - .5;
        el.style.transform = 'rotateX(' + (-y*6 + 4) + 'deg) rotateY(' + (x*8) + 'deg)';
      });
      stage.addEventListener('mouseleave', function(){ el.style.transform = 'rotateX(4deg) rotateY(0deg)'; });
      el.style.transform = 'rotateX(4deg)';
    });
  }

  /* tabs */
  document.querySelectorAll('[data-tabs]').forEach(function(group){
    var btns = group.querySelectorAll('.tabs button');
    var root = document.querySelector(group.getAttribute('data-tabs'));
    var panels = root ? root.querySelectorAll('.tab-panel') : [];
    btns.forEach(function(btn){
      btn.addEventListener('click', function(){
        var id = btn.getAttribute('data-tab');
        btns.forEach(function(b){ b.classList.toggle('active', b === btn); });
        panels.forEach(function(p){ p.classList.toggle('active', p.getAttribute('data-tab') === id); });
      });
    });
  });

  /* pricing toggle */
  var bM = document.getElementById('bMonthly'), bA = document.getElementById('bAnnual');
  if(bM && bA){
    var setB = function(an){
      bM.classList.toggle('on', !an); bA.classList.toggle('on', an);
      document.querySelectorAll('.amt-mo').forEach(function(e){ e.style.display = an?'none':'inline'; });
      document.querySelectorAll('.amt-an').forEach(function(e){ e.style.display = an?'inline':'none'; });
      document.querySelectorAll('.bill-word').forEach(function(e){ e.textContent = an?'billed annually':'billed monthly'; });
    };
    bM.addEventListener('click', function(){ setB(false); });
    bA.addEventListener('click', function(){ setB(true); });
    setB(false);
  }

  /* faq */
  document.querySelectorAll('.faq .faq-i').forEach(function(item){
    var q = item.querySelector('.faq-q'), a = item.querySelector('.faq-a');
    q.addEventListener('click', function(){
      var open = item.classList.contains('open');
      item.parentElement.querySelectorAll('.faq-i').forEach(function(i){ i.classList.remove('open'); i.querySelector('.faq-a').style.maxHeight = null; });
      if(!open){ item.classList.add('open'); a.style.maxHeight = a.scrollHeight + 'px'; }
    });
  });

  /* demo modal (plays the product video) */
  var modal = document.getElementById('demoModal');
  if(modal){
    var vid = modal.querySelector('.demo-video');
    var open = function(e){
      if(e) e.preventDefault();
      modal.classList.add('show'); document.body.style.overflow='hidden';
      if(vid){ try{ vid.currentTime = 0; var p = vid.play(); if(p && p.catch) p.catch(function(){}); }catch(_){} }
    };
    var close = function(){
      modal.classList.remove('show'); document.body.style.overflow='';
      if(vid){ try{ vid.pause(); }catch(_){} }
    };
    document.querySelectorAll('[data-demo]').forEach(function(b){ b.addEventListener('click', open); });
    modal.querySelector('.ov').addEventListener('click', close);
    modal.querySelector('.x').addEventListener('click', close);
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape' && modal.classList.contains('show')) close(); });
  }

  /* reveal with stagger */
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){
        if(e.isIntersecting){
          var sibs = Array.prototype.slice.call(e.target.parentElement ? e.target.parentElement.querySelectorAll(':scope > .reveal') : []);
          var i = sibs.indexOf(e.target);
          e.target.style.transitionDelay = (Math.max(0,i)*60) + 'ms';
          e.target.classList.add('in'); io.unobserve(e.target);
        }
      });
    }, {threshold:.12, rootMargin:'0px 0px -6% 0px'});
    document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('in'); });
  }

  /* count-up */
  function animate(el){
    var t = parseFloat(el.getAttribute('data-count'));
    var dec = parseInt(el.getAttribute('data-dec')||'0',10);
    var pre = el.getAttribute('data-prefix')||'', suf = el.getAttribute('data-suffix')||'';
    var dur = 1300, start = null;
    function step(ts){ if(!start) start = ts; var p = Math.min((ts-start)/dur,1); var e = 1-Math.pow(1-p,3);
      var v = t*e; el.textContent = pre + (dec?v.toFixed(dec):Math.round(v).toLocaleString('en-US')) + suf;
      if(p<1) requestAnimationFrame(step); }
    requestAnimationFrame(step);
  }
  if('IntersectionObserver' in window){
    var cio = new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ animate(e.target); cio.unobserve(e.target); } }); }, {threshold:.6});
    document.querySelectorAll('[data-count]').forEach(function(el){ cio.observe(el); });
  }
})();
