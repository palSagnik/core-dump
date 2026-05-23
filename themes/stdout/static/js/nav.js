(function() {
  var NAV_KEYS = {
    '1': '/',
    '2': '/posts/',
    '3': '/tags/',
    '4': '/about/',
  };

  var base = (function() {
    var b = document.querySelector('meta[name="base-url"]');
    if (b) return b.getAttribute('content').replace(/\/+$/, '');
    return '';
  })();

  function getRows() {
    return Array.from(document.querySelectorAll('#post-list .post-row, #post-list .recent-item'));
  }

  function selectedRow() {
    return document.querySelector('#post-list .post-row.selected, #post-list .recent-item.selected');
  }

  function selectRow(el) {
    var prev = selectedRow();
    if (prev) prev.classList.remove('selected');
    if (el) {
      el.classList.add('selected');
      el.scrollIntoView({ block: 'nearest' });
    }
  }

  function openSelected() {
    var el = selectedRow();
    if (!el) return;
    var href = el.getAttribute('data-href') || el.getAttribute('href');
    if (href) window.location.href = href;
  }

  function initSelection() {
    var rows = getRows();
    if (rows.length && !selectedRow()) selectRow(rows[0]);
  }

  document.addEventListener('keydown', function(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      if (e.key === 'Escape') e.target.blur();
      return;
    }

    if (NAV_KEYS[e.key]) {
      e.preventDefault();
      window.location.href = base + NAV_KEYS[e.key];
      return;
    }

    var rows = getRows();

    if (e.key === 'ArrowDown' || e.key === 'j') {
      e.preventDefault();
      if (!rows.length) return;
      var cur = selectedRow();
      var idx = cur ? rows.indexOf(cur) : -1;
      selectRow(rows[Math.min(idx + 1, rows.length - 1)]);
      return;
    }

    if (e.key === 'ArrowUp' || e.key === 'k') {
      e.preventDefault();
      if (!rows.length) return;
      var cur = selectedRow();
      var idx = cur ? rows.indexOf(cur) : rows.length;
      selectRow(rows[Math.max(idx - 1, 0)]);
      return;
    }

    if (e.key === 'Enter') {
      openSelected();
      return;
    }
  });

  document.addEventListener('DOMContentLoaded', initSelection);
})();
