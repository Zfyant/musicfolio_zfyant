(function(){
  var tabs = document.querySelectorAll('.tab-btn');
  var sectionCards = document.querySelectorAll('.card[data-section]');
  var grid = document.querySelector('.main-grid');
  function showSection(sec){
    sectionCards.forEach(function(c){
      var s = c.getAttribute('data-section');
      c.style.display = (sec === 'all' || s === sec) ? 'block' : 'none';
    });
    if (grid) {
      if (sec === 'artists' || sec === 'stats') { grid.classList.add('full-artists'); } else { grid.classList.remove('full-artists'); }
    }
    if (sec === 'tracks') {
      document.querySelectorAll('.card[data-section="tracks"] details.toggle').forEach(function(d){ d.open = true; });
    }
  }

  function dedupeCovers(){
    document.querySelectorAll('.cover-grid').forEach(function(grid){
      var map = {};
      grid.querySelectorAll('.cover-card').forEach(function(card){
        var img = card.querySelector('img');
        var src = card.getAttribute('data-src') || (img ? img.getAttribute('src') : '');
        var capEl = card.querySelector('.cover-caption');
        var cap = capEl ? capEl.textContent.trim() : '';
        if (!src) return;
        var key = src + '|' + cap;
        if (map[key]) {
          map[key].count += 1;
          card.remove();
        } else {
          map[key] = { el: card, count: 1 };
        }
      });
      Object.keys(map).forEach(function(k){
        var item = map[k];
        if (item.count > 1) {
          var badge = document.createElement('div');
          badge.className = 'cover-count';
          badge.textContent = '×' + item.count;
          item.el.appendChild(badge);
        }
      });
    });
  }

  function coverFallback(){
    function slug(s){ return (s||'').toLowerCase().replace(/'/g,'').replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,''); }
    function tryFallback(img){
      if (img.dataset.fallbackTried === '1') return;
      img.dataset.fallbackTried = '1';
      var alt = img.getAttribute('alt') || '';
      var artist = alt.split('—')[0].trim() || alt.split('-')[0].trim();
      var coverPath = 'assets/covers/' + slug(artist) + '.jpg';
      img.src = coverPath;
    }
    document.querySelectorAll('img.cover-img').forEach(function(img){
      img.addEventListener('error', function(){ tryFallback(img); });
      if (img.complete && img.naturalWidth === 0) { tryFallback(img); }
    });
  }

  function randomizeChipHues(){
    document.querySelectorAll('.chip-list .chip').forEach(function(ch){
      var deg = (Math.random()*16 - 8).toFixed(1);
      ch.style.filter = 'hue-rotate(' + deg + 'deg)';
    });
  }
  function activate(btn){
    tabs.forEach(function(b){ b.classList.remove('active'); });
    btn.classList.add('active');
  }
  tabs.forEach(function(btn){
    btn.addEventListener('click', function(){
      var sec = btn.getAttribute('data-tab');
      activate(btn);
      showSection(sec);
    });
  });
  dedupeCovers();
  coverFallback();
  randomizeChipHues();
  var defaultBtn = document.querySelector('.tab-btn[data-tab="all"]');
  if (defaultBtn) { activate(defaultBtn); }
  showSection('all');
})();