/* ReadmeForge: user interface */
(function (RF) {
  'use strict';

  var CFG = RF.CONFIG;
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  /* ---------- storage (wrapped: private mode or blocked storage must not break the app) ---------- */
  function readJSON(key) { try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch (e) { return null; } }
  function writeJSON(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* ignore */ } }

  var state = RF.normalizeState(readJSON(CFG.storageKey));
  var prefs = Object.assign({ lang: null, theme: null, step: 0 }, readJSON(CFG.prefsKey) || {});
  if (prefs.lang !== 'tr' && prefs.lang !== 'en') {
    prefs.lang = /^tr\b/i.test(navigator.language || '') ? 'tr' : 'en';
    if (!readJSON(CFG.storageKey)) state.readmeLang = prefs.lang;
  }
  var step = Math.min(RF.STEPS.length - 1, Math.max(0, prefs.step | 0));
  var skillQuery = '';
  var activeTab = 'rendered';

  function save() { writeJSON(CFG.storageKey, state); }
  function savePrefs() { prefs.step = step; writeJSON(CFG.prefsKey, prefs); }

  /* ---------- i18n ---------- */
  function t(key, vars) {
    var dict = RF.I18N[prefs.lang] || RF.I18N.en;
    var s = key in dict ? dict[key] : (key in RF.I18N.en ? RF.I18N.en[key] : key);
    if (vars) Object.keys(vars).forEach(function (k) { s = s.split('{' + k + '}').join(vars[k]); });
    return s;
  }
  function escHtml(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

  function applyI18n() {
    document.documentElement.lang = prefs.lang;
    $$('[data-i18n]').forEach(function (el) { el.textContent = t(el.getAttribute('data-i18n')); });
    $$('[data-i18n-ph]').forEach(function (el) { el.placeholder = t(el.getAttribute('data-i18n-ph')); });
    $$('[data-i18n-title]').forEach(function (el) {
      var v = t(el.getAttribute('data-i18n-title'));
      el.title = v; el.setAttribute('aria-label', v);
    });
    renderStepper();
    renderSkills();
    renderHowTo();
    updatePreviewToggleLabel();
    renderPreview();
  }

  /* ---------- toast ---------- */
  var toastTimer;
  function toast(msg) {
    var el = $('#toast');
    el.textContent = msg;
    el.hidden = false;
    el.style.animation = 'none'; void el.offsetWidth; el.style.animation = '';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.hidden = true; }, 3200);
  }

  /* ---------- binding form fields to state ---------- */
  function getPath(obj, path) {
    return path.split('.').reduce(function (o, k) { return o == null ? undefined : o[k]; }, obj);
  }
  function setPath(obj, path, val) {
    var keys = path.split('.');
    var last = keys.pop();
    var target = keys.reduce(function (o, k) { if (o[k] == null || typeof o[k] !== 'object') o[k] = {}; return o[k]; }, obj);
    target[last] = val;
  }

  function syncForm() {
    $$('[data-bind]').forEach(function (el) {
      var v = getPath(state, el.getAttribute('data-bind'));
      if (el.type === 'checkbox') el.checked = !!v;
      else if (el.type === 'radio') el.checked = el.value === v;
      else el.value = v == null ? '' : v;
    });
    $('#typing-extra').hidden = !state.addons.typing;
  }

  function onFieldChange(e) {
    var el = e.target;
    var path = el.getAttribute && el.getAttribute('data-bind');
    if (!path) return;
    var val;
    if (el.type === 'checkbox') val = el.checked;
    else if (el.type === 'radio') { if (!el.checked) return; val = el.value; }
    else if (el.type === 'number') val = Math.min(50, Math.max(1, parseInt(el.value, 10) || 14));
    else val = el.value;
    setPath(state, path, val);
    if (path === 'addons.typing') $('#typing-extra').hidden = !val;
    save();
    changed();
  }

  /* ---------- progress squares ---------- */
  function renderStepper() {
    var levels = RF.stepLevels(state);
    var ol = $('#stepper');
    if (!ol.children.length) {
      ol.innerHTML = RF.STEPS.map(function (id, i) {
        return '<li><button type="button" data-goto="' + i + '"><span class="sq"></span><span class="lbl"></span></button></li>';
      }).join('');
    }
    $$('button', ol).forEach(function (b, i) {
      b.setAttribute('data-level', levels[i]);
      $('.lbl', b).textContent = t('steps.' + RF.STEPS[i]);
      if (i === step) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
    });
    $('#progress-step').textContent = t('steps.progress', { n: step + 1, total: RF.STEPS.length });
  }

  function goTo(i, focus) {
    step = Math.min(RF.STEPS.length - 1, Math.max(0, i));
    $$('.step-pane').forEach(function (p) { p.hidden = +p.getAttribute('data-pane') !== step; });
    $('#workspace').setAttribute('data-step', step);
    $('#btn-back').disabled = step === 0;
    $('#btn-next').hidden = step === RF.STEPS.length - 1;
    $('#btn-preview-toggle').hidden = step === RF.STEPS.length - 1;
    renderStepper();
    savePrefs();
    if (focus) {
      var panel = $('#form-panel');
      if (panel.getBoundingClientRect().top < 0) panel.scrollIntoView({ block: 'start' });
      panel.focus({ preventScroll: true });
    }
  }

  /* ---------- social ---------- */
  function renderSocials() {
    $('#social-grid').innerHTML = RF.SOCIALS.map(function (p) {
      var prefix = p.prefix ? p.prefix.replace(/^https?:\/\/(www\.)?/, '').replace(/^mailto:/, '') : '';
      var ph = p.placeholder ? ' placeholder="' + escHtml(p.placeholder) + '"' : ' data-i18n-ph="social.ph"';
      return '<label class="social-field"><span class="social-name"><i style="--c:#' + p.color + '"></i>' + escHtml(p.label) + '</span>' +
        '<span class="input-group">' + (prefix ? '<span class="prefix" title="' + escHtml(prefix) + '">' + escHtml(prefix) + '</span>' : '') +
        '<input data-bind="social.' + p.id + '"' + ph + ' autocomplete="off" autocapitalize="off" spellcheck="false"' +
        (p.id === 'email' ? ' type="email"' : '') + ' /></span></label>';
    }).join('');
    $('#f-badge-style').innerHTML = RF.BADGE_STYLES.map(function (s) { return '<option value="' + s + '">' + s + '</option>'; }).join('');
  }
  function renderBadgePreview() {
    var html = RF.activeSocials(state).map(function (x) {
      return '<img src="' + escHtml(RF.badgeUrl(x.p, state.badgeStyle)) + '" alt="' + escHtml(x.p.label) + '" />';
    }).join('');
    var box = $('#badge-preview');
    if (box.innerHTML !== html) box.innerHTML = html;
  }

  /* ---------- skills ---------- */
  function skillIcon(id) { return 'https://skillicons.dev/icons?i=' + id + (state.skillTheme === 'light' ? '&theme=light' : ''); }

  function renderSkills() {
    var q = skillQuery.toLowerCase().trim();
    var html = RF.SKILL_CATEGORIES.map(function (cat) {
      var items = cat.items.filter(function (it) { return !q || it[1].toLowerCase().indexOf(q) >= 0 || it[0].indexOf(q) >= 0; });
      if (!items.length) return '';
      return '<section class="skill-cat"><h3>' + escHtml(cat.label[prefs.lang] || cat.label.en) + '</h3><div class="skill-grid">' +
        items.map(function (it) {
          var on = state.skills.indexOf(it[0]) >= 0;
          return '<button type="button" class="skill" data-skill="' + it[0] + '" aria-pressed="' + on + '">' +
            '<img src="' + skillIcon(it[0]) + '" alt="" width="36" height="36" loading="lazy" decoding="async" /><span>' + escHtml(it[1]) + '</span></button>';
        }).join('') + '</div></section>';
    }).join('');
    $('#skill-groups').innerHTML = html || '<p class="empty">' + escHtml(t('skills.none', { q: skillQuery })) + '</p>';
    renderChips();
  }

  function renderChips() {
    $('#selected-count').textContent = t('skills.selected', { n: state.skills.length });
    $('#skills-clear').hidden = !state.skills.length;
    $('#skill-chips').innerHTML = state.skills.map(function (id) {
      var name = RF.skillName(id);
      return '<button type="button" class="chip" data-remove="' + id + '" title="' + escHtml(name) + '">' +
        '<img src="' + skillIcon(id) + '" alt="" width="22" height="22" /><span>' + escHtml(name) + '</span><span aria-hidden="true">×</span></button>';
    }).join('');
  }

  function toggleSkill(id) {
    var i = state.skills.indexOf(id);
    if (i >= 0) state.skills.splice(i, 1); else state.skills.push(id);
    var btn = $('.skill[data-skill="' + id + '"]');
    if (btn) btn.setAttribute('aria-pressed', i < 0);
    renderChips();
    save();
    changed();
  }

  /* ---------- add-ons ---------- */
  var THEME_NAMES = { default: 'Default', dark: 'Dark', radical: 'Radical', tokyonight: 'Tokyo Night', dracula: 'Dracula', gruvbox: 'Gruvbox', onedark: 'One Dark', nord: 'Nord' };
  function renderThemeOptions() {
    $('#f-stats-theme').innerHTML = RF.STAT_THEMES.map(function (th) { return '<option value="' + th + '">' + THEME_NAMES[th] + '</option>'; }).join('');
  }

  /* ---------- how-to ---------- */
  function renderHowTo() {
    var user = RF.resolveUser(state) || t('howto.userFallback');
    var safe = escHtml(user);
    $('#howto-list').innerHTML = [1, 2, 3, 4].map(function (n) { return '<li><span>' + t('howto.' + n, { user: safe }) + '</span></li>'; }).join('');
  }

  /* ---------- preview ---------- */
  function highlight(md) {
    return md.split('\n').map(function (line) {
      var e = escHtml(line);
      if (/^#{1,6}\s/.test(line)) return '<span class="h">' + e + '</span>';
      return e
        .replace(/(&quot;|")([^"&]*?(?:&(?!quot;)[^"&]*?)*)(&quot;|")/g, '<span class="s">$1$2$3</span>')
        .replace(/(&lt;\/?[a-zA-Z][a-zA-Z0-9]*)/g, '<span class="t">$1</span>')
        .replace(/(\/?&gt;)/g, '<span class="t">$1</span>');
    }).join('\n');
  }

  var lastMd = null;
  function renderPreview() {
    var md = RF.generateReadme(state);
    var rendered = $('#preview-rendered');
    $('#md-code').innerHTML = md ? highlight(md) : escHtml(t('preview.empty'));
    if (md === lastMd && rendered.childNodes.length && rendered.getAttribute('data-lang') === prefs.lang) return;
    lastMd = md;
    rendered.setAttribute('data-lang', prefs.lang);
    if (!md) {
      var cells = '';
      for (var i = 0; i < 21; i++) cells += '<span></span>';
      rendered.innerHTML = '<div class="preview-empty"><div class="mini-grid" aria-hidden="true">' + cells + '</div><p>' + escHtml(t('preview.empty')) + '</p></div>';
      return;
    }
    if (window.marked && window.DOMPurify) {
      var html = window.marked.parse(md, { gfm: true, breaks: false });
      rendered.innerHTML = window.DOMPurify.sanitize(html);
      $$('a', rendered).forEach(function (a) { a.target = '_blank'; a.rel = 'noopener noreferrer'; });
      $$('img', rendered).forEach(function (img) { img.loading = 'lazy'; img.decoding = 'async'; });
    } else {
      rendered.innerHTML = '<pre class="md-source">' + escHtml(md) + '</pre>';
    }
  }

  var previewTimer;
  function changed() {
    renderStepper();
    $('#addons-need-user').hidden = !!RF.resolveUser(state);
    clearTimeout(previewTimer);
    previewTimer = setTimeout(function () {
      renderPreview();
      renderBadgePreview();
      renderHowTo();
    }, 350);
  }

  function setTab(name) {
    activeTab = name;
    $('#tab-rendered').setAttribute('aria-selected', name === 'rendered');
    $('#tab-markdown').setAttribute('aria-selected', name === 'markdown');
    $('#preview-rendered').hidden = name !== 'rendered';
    $('#preview-markdown').hidden = name !== 'markdown';
  }

  function updatePreviewToggleLabel() {
    var open = $('#workspace').classList.contains('preview-open');
    var b = $('#btn-preview-toggle');
    b.setAttribute('aria-expanded', open);
    $('span', b).textContent = t(open ? 'btn.hidePreview' : 'btn.showPreview');
  }

  /* ---------- copy / download ---------- */
  function copyMarkdown(btn) {
    var md = RF.generateReadme(state);
    var done = function () {
      toast(t('toast.copied'));
      var label = btn && $('span[data-i18n="btn.copy"]', btn);
      if (label) { label.textContent = t('btn.copied'); setTimeout(function () { label.textContent = t('btn.copy'); }, 1600); }
    };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(md).then(done, function () { legacyCopy(md) ? done() : toast(t('toast.copyFail')); });
    } else {
      legacyCopy(md) ? done() : toast(t('toast.copyFail'));
    }
  }
  function legacyCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    return ok;
  }
  function downloadFile(name, text, type) {
    var blob = new Blob([text], { type: type || 'text/markdown;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  /* ---------- GitHub auto-fill ---------- */
  function fetchJSON(url) {
    return fetch(url, { headers: { Accept: 'application/vnd.github+json' } }).then(function (r) {
      if (r.ok) return r.json();
      var err = new Error('http ' + r.status); err.status = r.status; throw err;
    });
  }

  function autofill(raw) {
    var user = RF.cleanUser(raw);
    if (!user) { $('#gh-user').focus(); return; }
    var btn = $('#autofill-btn');
    btn.disabled = true; btn.textContent = t('quick.loading');
    var filled = 0, suggested = 0;
    function fill(key, val) {
      val = (val || '').toString().trim();
      if (val && !String(getPath(state, key) || '').trim()) { setPath(state, key, val); filled++; }
    }

    fetchJSON('https://api.github.com/users/' + encodeURIComponent(user)).then(function (d) {
      state.ghUser = d.login;
      fill('name', d.name || d.login);
      fill('subtitle', d.bio);
      var blog = d.blog ? RF.normUrl(d.blog) : '';
      fill('portfolio', blog);
      fill('reachMe', d.email);
      if (!state.social.github) { state.social.github = d.login; filled++; }
      fill('social.x', d.twitter_username);
      if (!state.statsUser) state.statsUser = d.login;
      return fetchJSON('https://api.github.com/users/' + encodeURIComponent(d.login) + '/repos?per_page=100&sort=pushed')
        .catch(function () { return []; });
    }).then(function (repos) {
      if (!repos) return;
      var counts = {};
      repos.forEach(function (r) {
        if (r.fork) return;
        var id = RF.LANG_TO_SKILL[r.language];
        if (id) counts[id] = (counts[id] || 0) + 1;
      });
      Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a]; }).forEach(function (id) {
        if (state.skills.indexOf(id) < 0) { state.skills.push(id); suggested++; }
      });
      if (!state.featured.trim()) {
        var top = repos.filter(function (r) { return !r.fork && r.name.toLowerCase() !== state.ghUser.toLowerCase(); })
          .sort(function (a, b) { return (b.stargazers_count - a.stargazers_count) || (new Date(b.pushed_at) - new Date(a.pushed_at)); })
          .slice(0, 4).map(function (r) { return r.name; });
        if (top.length) { state.featured = top.join(', '); filled++; }
      }
      save();
      syncForm();
      renderSkills();
      changed();
      toast(t('toast.filled', { f: filled, s: suggested }));
    }).catch(function (err) {
      if (err.status === 404) toast(t('toast.notFound', { u: user }));
      else if (err.status === 403 || err.status === 429) toast(t('toast.rate'));
      else toast(t('toast.network'));
    }).then(function () {
      btn.disabled = false; btn.textContent = t('quick.button');
    });
  }

  /* ---------- import / export / clear ---------- */
  function exportSettings() {
    downloadFile('readmeforge-settings.json', JSON.stringify({ app: 'readmeforge', v: 1, state: state }, null, 2), 'application/json');
    toast(t('toast.exported'));
  }
  function importSettings(file) {
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var data = JSON.parse(reader.result);
        var raw = data && data.app === 'readmeforge' ? data.state : data;
        if (!raw || typeof raw !== 'object' || !('name' in raw || 'skills' in raw)) throw new Error('bad');
        state = RF.normalizeState(raw);
        save(); syncForm(); renderSkills(); changed();
        toast(t('toast.imported'));
      } catch (e) { toast(t('toast.importFail')); }
    };
    reader.readAsText(file);
  }
  function clearAll() {
    if (!window.confirm(t('confirm.clear'))) return;
    var lang = state.readmeLang;
    state = RF.defaultState();
    state.readmeLang = lang;
    save(); syncForm(); renderSkills(); changed();
    goTo(0, true);
    toast(t('toast.cleared'));
  }

  /* ---------- theme ---------- */
  function effectiveDark() {
    var forced = document.documentElement.getAttribute('data-theme');
    if (forced) return forced === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  function toggleTheme() {
    prefs.theme = effectiveDark() ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', prefs.theme);
    savePrefs();
  }

  /* ---------- repo links + star count ---------- */
  function setupRepoLinks() {
    var base = 'https://github.com/' + CFG.repo;
    $('#star-link').href = base;
    $('#lnk-source').href = base;
    $('#lnk-issues').href = base + '/issues';
    $('#lnk-license').href = base + '/blob/main/LICENSE';
    var author = $('#lnk-author');
    author.href = CFG.author.url; author.textContent = CFG.author.name;
    fetchJSON('https://api.github.com/repos/' + CFG.repo).then(function (d) {
      if (typeof d.stargazers_count === 'number') {
        var c = $('#star-count');
        c.textContent = d.stargazers_count.toLocaleString(prefs.lang === 'tr' ? 'tr-TR' : 'en-US');
        c.hidden = false;
      }
    }).catch(function () { /* repo not public yet; keep the plain button */ });
  }

  /* ---------- events ---------- */
  function bindEvents() {
    document.addEventListener('input', onFieldChange);
    document.addEventListener('change', function (e) {
      var el = e.target;
      if (el.type === 'checkbox' || el.type === 'radio' || el.tagName === 'SELECT') onFieldChange(e);
      if (el.getAttribute('data-bind') === 'skillTheme') renderSkills();
    });

    $('#stepper').addEventListener('click', function (e) {
      var b = e.target.closest('[data-goto]');
      if (b) goTo(+b.getAttribute('data-goto'), true);
    });
    $('#btn-back').addEventListener('click', function () { goTo(step - 1, true); });
    $('#btn-next').addEventListener('click', function () { goTo(step + 1, true); });
    $('#btn-preview-toggle').addEventListener('click', function () {
      var ws = $('#workspace');
      ws.classList.toggle('preview-open');
      updatePreviewToggleLabel();
      if (ws.classList.contains('preview-open')) $('#preview-panel').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    $('#autofill-form').addEventListener('submit', function (e) { e.preventDefault(); autofill($('#gh-user').value); });

    $('#skill-search').addEventListener('input', function (e) { skillQuery = e.target.value; renderSkills(); });
    $('#skill-groups').addEventListener('click', function (e) {
      var b = e.target.closest('[data-skill]');
      if (b) toggleSkill(b.getAttribute('data-skill'));
    });
    $('#skill-chips').addEventListener('click', function (e) {
      var b = e.target.closest('[data-remove]');
      if (b) toggleSkill(b.getAttribute('data-remove'));
    });
    $('#skills-clear').addEventListener('click', function () {
      state.skills = [];
      $$('.skill[aria-pressed="true"]').forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
      renderChips(); save(); changed();
    });

    $('#tab-rendered').addEventListener('click', function () { setTab('rendered'); });
    $('#tab-markdown').addEventListener('click', function () { setTab('markdown'); });
    $('.tabs').addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        var next = activeTab === 'rendered' ? 'markdown' : 'rendered';
        setTab(next); $('#tab-' + next).focus();
      }
    });
    $$('.js-copy').forEach(function (b) { b.addEventListener('click', function () { copyMarkdown(b); }); });
    $$('.js-download').forEach(function (b) {
      b.addEventListener('click', function () { downloadFile('README.md', RF.generateReadme(state)); toast(t('toast.downloaded')); });
    });

    $('#btn-export').addEventListener('click', exportSettings);
    $('#btn-import').addEventListener('click', function () { $('#import-file').click(); });
    $('#import-file').addEventListener('change', function (e) {
      if (e.target.files[0]) importSettings(e.target.files[0]);
      e.target.value = '';
    });
    $('#btn-clear').addEventListener('click', clearAll);

    $('#lang-toggle').addEventListener('click', function () {
      prefs.lang = prefs.lang === 'tr' ? 'en' : 'tr';
      savePrefs();
      applyI18n();
    });
    $('#theme-toggle').addEventListener('click', toggleTheme);

    $('a[href="#how-to"]').addEventListener('click', function (e) {
      e.preventDefault();
      goTo(RF.STEPS.length - 1);
      $('#how-to').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    /* marked/DOMPurify load from a CDN; re-render once they arrive */
    window.addEventListener('load', function () { lastMd = null; renderPreview(); });
  }

  /* ---------- start ---------- */
  function init() {
    renderSocials();
    renderThemeOptions();
    syncForm();
    bindEvents();
    applyI18n();
    renderBadgePreview();
    $('#addons-need-user').hidden = !!RF.resolveUser(state);
    setTab('rendered');
    goTo(step, false);
    setupRepoLinks();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})(window.RF);
