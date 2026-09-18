(function(){
  var lb = document.getElementById('lightbox');
  var lbImg = document.getElementById('lightbox-img');
  var filmstrip = document.getElementById('filmstrip');
  var closeBtn = lb.querySelector('.lightbox-close');

  var groups = [];
  document.querySelectorAll('.project .stream').forEach(function(streamEl){
    var cells = Array.prototype.slice.call(streamEl.querySelectorAll('.thumb-cell.zoomable'));
    var imgs = cells.map(function(c){ return c.querySelector('img'); });
    groups.push(imgs);
  });

  var curGroup = null;
  var curIndex = -1;

  function renderMain(){
    var imgEl = curGroup[curIndex];
    lbImg.src = imgEl.src;
    lbImg.alt = imgEl.alt || '';
  }

  function renderFilmstrip(){
    filmstrip.innerHTML = '';
    var offsets = [-1, 0, 1];
    offsets.forEach(function(off){
      var idx = curIndex + off;
      if(idx < 0 || idx >= curGroup.length){
        var ph = document.createElement('div');
        ph.className = 'fs-thumb placeholder';
        filmstrip.appendChild(ph);
        return;
      }
      var srcImg = curGroup[idx];
      var t = document.createElement('img');
      t.src = srcImg.src;
      t.alt = srcImg.alt || '';
      t.className = 'fs-thumb' + (off === 0 ? ' current' : '');
      if(off !== 0){
        t.addEventListener('click', function(){
          curIndex = idx;
          renderMain();
          renderFilmstrip();
        });
      }
      filmstrip.appendChild(t);
    });
  }

  function openLightboxAt(group, index){
    curGroup = group;
    curIndex = index;
    renderMain();
    renderFilmstrip();
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox(){
    lb.classList.remove('open');
    lbImg.src = '';
    filmstrip.innerHTML = '';
    curGroup = null; curIndex = -1;
    document.body.style.overflow = '';
  }

  function step(delta){
    if(!curGroup) return;
    var next = curIndex + delta;
    if(next < 0 || next >= curGroup.length) return;
    curIndex = next;
    renderMain();
    renderFilmstrip();
  }

  groups.forEach(function(group){
    group.forEach(function(imgEl, idx){
      var cell = imgEl.closest('.thumb-cell');
      cell.addEventListener('click', function(){
        openLightboxAt(group, idx);
      });
    });
  });

  lb.addEventListener('click', function(e){
    if(e.target === lb || e.target.classList.contains('lightbox-main')){
      closeLightbox();
    }
  });
  lbImg.addEventListener('click', closeLightbox);
  closeBtn.addEventListener('click', function(e){ e.stopPropagation(); closeLightbox(); });
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape') closeLightbox();
    else if(e.key === 'ArrowLeft') step(-1);
    else if(e.key === 'ArrowRight') step(1);
  });
})();
