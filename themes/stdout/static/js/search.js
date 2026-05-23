(function() {
  var input   = document.getElementById('search-input');
  var results = document.getElementById('search-results');
  if (!input || !results) return;

  var base = (function() {
    var b = document.querySelector('meta[name="base-url"]');
    if (b) return b.getAttribute('content').replace(/\/+$/, '');
    return '';
  })();

  var fuse, posts;

  fetch(base + '/index.json')
    .then(function(r) { return r.json(); })
    .then(function(data) {
      posts = data;
      fuse = new Fuse(posts, {
        includeScore: true,
        includeMatches: true,
        threshold: 0.35,
        minMatchCharLength: 2,
        keys: [
          { name: 'title',   weight: 3 },
          { name: 'tags',    weight: 2 },
          { name: 'summary', weight: 1.5 },
          { name: 'body',    weight: 1 },
        ],
      });
    });

  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function highlight(text, query) {
    if (!query) return esc(text);
    var re = new RegExp('(' + query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
    return esc(text).replace(re, '<mark>$1</mark>');
  }

  function truncate(text, query, maxLen) {
    maxLen = maxLen || 120;
    var idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1 || text.length <= maxLen) return text;
    var start = Math.max(0, idx - 30);
    var end   = Math.min(text.length, start + maxLen);
    return (start > 0 ? '…' : '') + text.slice(start, end) + (end < text.length ? '…' : '');
  }

  function render(query) {
    var q = query.trim();
    if (!fuse || !q) { results.innerHTML = ''; return; }

    var hits = fuse.search(query, { limit: 12 });

    if (!hits.length) {
      results.innerHTML =
        '<div class="empty-state">'
        + '<div class="empty-state-line1">&#9658; NO MATCHES</div>'
        + '<div class="empty-state-line2">no occurrences of &ldquo;' + esc(q) + '&rdquo;</div>'
        + '</div>';
      return;
    }

    var totalHits = 0;
    var groups = hits.map(function(hit) {
      var p = hit.item;
      var matchLines = [];

      if (p.title.toLowerCase().indexOf(q.toLowerCase()) !== -1) {
        matchLines.push({ loc: 'title:', text: p.title, kind: 'title' });
      }
      if (p.summary && p.summary.toLowerCase().indexOf(q.toLowerCase()) !== -1) {
        matchLines.push({ loc: 'sum:', text: truncate(p.summary, q), kind: 'body' });
      }
      var bodyLines = p.body ? p.body.split('\n') : [];
      var shown = 0;
      for (var i = 0; i < bodyLines.length && shown < 3; i++) {
        if (bodyLines[i].trim() && bodyLines[i].toLowerCase().indexOf(q.toLowerCase()) !== -1) {
          matchLines.push({ loc: 'L' + String(i + 1).padStart(3, ' ') + ':', text: truncate(bodyLines[i], q), kind: 'body' });
          shown++;
        }
      }
      if (!matchLines.length) {
        matchLines.push({ loc: 'title:', text: p.title, kind: 'title' });
      }

      totalHits += matchLines.length;
      return { p: p, matches: matchLines };
    });

    var html = '<div class="search-results-meta phos-dim">&#9658; grep &ldquo;' + esc(q)
      + '&rdquo; &mdash; ' + totalHits + ' hits in ' + groups.length + ' files</div>';

    groups.forEach(function(g) {
      var p = g.p;
      var slug = 'posts/' + (p.slug || p.title.toLowerCase().replace(/\s+/g, '-')) + '.md';
      var tag  = (p.tags && p.tags[0]) ? p.tags[0].toUpperCase() : '';
      html += '<div class="vimgrep-group">'
        + '<a class="vimgrep-file-row" href="' + esc(p.url) + '">'
        + '<span class="vimgrep-filename">' + esc(slug) + '</span>'
        + '<span class="vimgrep-filemeta">' + g.matches.length + ' hit' + (g.matches.length === 1 ? '' : 's')
        + (tag ? ' &middot; ' + esc(tag) : '') + ' &middot; ' + esc(p.date) + '</span>'
        + '</a>';

      g.matches.forEach(function(m) {
        html += '<div class="vimgrep-match-row" data-href="' + esc(p.url) + '">'
          + '<span class="vimgrep-line-num phos-dim">' + esc(m.loc) + '</span>'
          + '<span class="vimgrep-line-text' + (m.kind === 'title' ? ' title' : '') + '">'
          + highlight(m.text, q)
          + '</span></div>';
      });

      html += '</div>';
    });

    results.innerHTML = html;

    results.querySelectorAll('.vimgrep-match-row, .vimgrep-file-row').forEach(function(row) {
      if (row.tagName !== 'A') {
        row.addEventListener('click', function() {
          var href = row.getAttribute('data-href');
          if (href) window.location.href = href;
        });
      }
    });
  }

  var timer;
  input.addEventListener('input', function() {
    clearTimeout(timer);
    timer = setTimeout(function() { render(input.value); }, 120);
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === '/' && document.activeElement !== input) {
      e.preventDefault();
      input.focus();
      input.select();
    }
    if (e.key === 'Escape' && document.activeElement === input) {
      if (input.value) {
        input.value = '';
        results.innerHTML = '';
      } else {
        input.blur();
      }
    }
  });
})();
