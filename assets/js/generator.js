/* ReadmeForge: turns the form state into README markdown. Pure functions, no DOM. */
(function (RF) {
  'use strict';

  RF.STEPS = ['basic', 'links', 'social', 'skills', 'addons', 'finish'];

  RF.defaultState = function () {
    return {
      v: 1,
      ghUser: '',
      name: '', subtitle: '',
      workingOn: '', learning: '', collaborate: '', helpWith: '', askMe: '',
      reachMe: '', pronouns: '', funFact: '',
      portfolio: '', blog: '', resume: '', featured: '',
      social: {},
      badgeStyle: 'for-the-badge',
      skills: [],
      skillTheme: 'dark',
      perLine: 14,
      statsUser: '',
      statsTheme: 'default',
      addons: { visitors: true, typing: false, stats: true, topLangs: true, streak: true, trophies: false, activity: false },
      typingLines: '',
      readmeLang: 'en',
      align: 'center'
    };
  };

  /* Merge a possibly partial / older saved state onto the defaults */
  RF.normalizeState = function (raw) {
    var base = RF.defaultState();
    if (!raw || typeof raw !== 'object') return base;
    Object.keys(base).forEach(function (k) {
      if (!(k in raw)) return;
      if (k === 'addons') base.addons = Object.assign(base.addons, raw.addons || {});
      else if (k === 'social') base.social = Object.assign({}, raw.social || {});
      else if (k === 'skills') base.skills = Array.isArray(raw.skills) ? raw.skills.filter(function (x) { return typeof x === 'string'; }) : [];
      else if (typeof base[k] === typeof raw[k]) base[k] = raw[k];
    });
    base.perLine = Math.min(50, Math.max(1, parseInt(base.perLine, 10) || 14));
    if (RF.BADGE_STYLES.indexOf(base.badgeStyle) < 0) base.badgeStyle = 'for-the-badge';
    if (RF.STAT_THEMES.indexOf(base.statsTheme) < 0) base.statsTheme = 'default';
    if (base.readmeLang !== 'tr') base.readmeLang = 'en';
    if (base.align !== 'left') base.align = 'center';
    if (base.skillTheme !== 'light') base.skillTheme = 'dark';
    return base;
  };

  /* ---------- small helpers ---------- */
  function clean(s) { return (s == null ? '' : String(s)).trim(); }
  function oneLine(s) { return clean(s).replace(/\s*\n+\s*/g, ' '); }
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  /* for URLs placed inside HTML attributes */
  function attr(u) { return String(u).replace(/"/g, '%22').replace(/</g, '%3C').replace(/>/g, '%3E').replace(/\s/g, '%20'); }
  function enc(s) { return encodeURIComponent(s); }
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  RF.normUrl = function (u) {
    u = clean(u);
    if (!u) return '';
    if (/^(https?:|mailto:)/i.test(u)) return u;
    if (EMAIL.test(u)) return 'mailto:' + u;
    return 'https://' + u.replace(/^\/+/, '');
  };
  RF.prettyUrl = function (u) {
    return String(u).replace(/^mailto:/i, '').replace(/^https?:\/\//i, '').replace(/^www\./i, '').replace(/\/$/, '');
  };
  function looksLikeLink(s) {
    return /^(https?:\/\/|www\.)\S+$/i.test(s) || EMAIL.test(s) || /^[a-z0-9-]+(\.[a-z0-9-]+)+(\/\S*)?$/i.test(s);
  }
  function mdLink(u) { var url = RF.normUrl(u); return '[' + RF.prettyUrl(url) + '](' + url.replace(/\s/g, '%20').replace(/\)/g, '%29') + ')'; }

  /* GitHub usernames: letters, digits, single hyphens, max 39 chars */
  RF.cleanUser = function (v) {
    v = clean(v);
    if (!v) return '';
    var m = v.match(/github\.com\/([^/?#\s]+)/i);
    if (m) v = m[1];
    v = v.replace(/^@/, '');
    return /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i.test(v) ? v : '';
  };

  RF.resolveUser = function (s) {
    return RF.cleanUser(s.statsUser) || RF.cleanUser((s.social || {}).github) || RF.cleanUser(s.ghUser);
  };

  /* ---------- social badges ---------- */
  RF.socialUrl = function (p, value) {
    var v = clean(value);
    if (!v) return '';
    if (/^https?:\/\//i.test(v)) return v;
    if (p.id === 'email') { v = v.replace(/^mailto:/i, ''); return EMAIL.test(v) ? 'mailto:' + v : ''; }
    if (!p.prefix) return 'https://' + v.replace(/^\/+/, '');
    return p.prefix + v.replace(/^@/, '').replace(/^\/+/, '');
  };

  function shieldsText(s) { return enc(String(s).replace(/-/g, '--').replace(/_/g, '__')); }

  RF.badgeUrl = function (p, style) {
    return 'https://img.shields.io/badge/' + shieldsText(p.label) + '-' + p.color +
      '?style=' + (style || 'for-the-badge') + '&logo=' + p.logo + '&logoColor=' + (p.fg || 'white');
  };

  RF.activeSocials = function (s) {
    var social = s.social || {};
    return RF.SOCIALS.map(function (p) { return { p: p, url: RF.socialUrl(p, social[p.id]) }; })
      .filter(function (x) { return x.url; });
  };

  /* ---------- featured repos ---------- */
  RF.parseRepos = function (text, user) {
    var seen = {};
    return clean(text).split(/[\s,]+/).map(function (t) {
      t = t.replace(/^https?:\/\/github\.com\//i, '').replace(/\/$/, '');
      var parts = t.split('/');
      var owner = parts.length > 1 ? RF.cleanUser(parts[0]) : user;
      var repo = (parts.length > 1 ? parts[1] : parts[0]) || '';
      if (!owner || !/^[\w.-]+$/.test(repo)) return null;
      var key = (owner + '/' + repo).toLowerCase();
      if (seen[key]) return null;
      seen[key] = true;
      return { owner: owner, repo: repo };
    }).filter(Boolean).slice(0, 6);
  };

  RF.skillName = function (id) {
    for (var i = 0; i < RF.SKILL_CATEGORIES.length; i++) {
      var items = RF.SKILL_CATEGORIES[i].items;
      for (var j = 0; j < items.length; j++) if (items[j][0] === id) return items[j][1];
    }
    return id;
  };

  /* ---------- the README ---------- */
  RF.generateReadme = function (s) {
    s = RF.normalizeState(s);
    var L = RF.README_TEXT[s.readmeLang] || RF.README_TEXT.en;
    var user = RF.resolveUser(s);
    var align = s.align;
    var theme = s.statsTheme;
    var accent = RF.THEME_ACCENT[theme] || '30A14E';
    var add = s.addons;
    var out = [];

    var name = oneLine(s.name);
    if (name) out.push('<h1 align="' + align + '">' + esc(L.hi.replace('{name}', name)) + '</h1>');
    if (clean(s.subtitle)) out.push('<h3 align="' + align + '">' + esc(oneLine(s.subtitle)) + '</h3>');

    if (add.typing) {
      var lines = String(s.typingLines || '').split('\n')
        .map(function (l) { return l.trim().replace(/;/g, ','); }).filter(Boolean).slice(0, 8);
      if (!lines.length && clean(s.subtitle)) lines = [oneLine(s.subtitle).replace(/;/g, ',')];
      if (lines.length) {
        var q = lines.map(function (l) { return enc(l).replace(/%20/g, '+'); }).join(';');
        var typing = 'https://readme-typing-svg.demolab.com?font=Fira+Code&weight=500&size=22&pause=1000&color=' +
          accent + '&center=' + (align === 'center') + '&vCenter=true&width=600&lines=' + q;
        out.push('<p align="' + align + '">\n  <img src="' + attr(typing) + '" alt="' + esc(lines.join(' | ')) + '" />\n</p>');
      }
    }

    if (add.visitors && user) {
      out.push('<p align="' + align + '">\n  <img src="https://komarev.com/ghpvc/?username=' + enc(user) +
        '&label=' + enc(L.views) + '&color=' + accent.toLowerCase() + '&style=flat" alt="' + esc(user) + '" />\n</p>');
    }

    var items = [];
    [['workingOn'], ['learning'], ['collaborate'], ['helpWith'], ['askMe']].forEach(function (k) {
      var v = oneLine(s[k[0]]);
      if (v) items.push('- ' + L[k[0]] + ' **' + v + '**');
    });
    var reach = oneLine(s.reachMe);
    if (reach) items.push('- ' + L.reachMe + ' **' + (looksLikeLink(reach) ? mdLink(reach) : reach) + '**');
    if (clean(s.portfolio)) items.push('- ' + L.portfolio + ' ' + mdLink(s.portfolio));
    if (clean(s.blog)) items.push('- ' + L.blog + ' ' + mdLink(s.blog));
    if (clean(s.resume)) items.push('- ' + L.resume + ' [' + L.resumeLink + '](' + RF.normUrl(s.resume).replace(/\s/g, '%20') + ')');
    if (oneLine(s.pronouns)) items.push('- ' + L.pronouns + ' **' + oneLine(s.pronouns) + '**');
    if (oneLine(s.funFact)) items.push('- ' + L.funFact + ' **' + oneLine(s.funFact) + '**');
    if (items.length) out.push(items.join('\n'));

    var socials = RF.activeSocials(s);
    if (socials.length) {
      var badges = socials.map(function (x) {
        return '  <a href="' + attr(x.url) + '"><img src="' + attr(RF.badgeUrl(x.p, s.badgeStyle)) + '" alt="' + esc(x.p.label) + '" /></a>';
      }).join('\n');
      out.push('### 🌐 ' + L.connect + '\n\n<p align="left">\n' + badges + '\n</p>');
    }

    if (s.skills.length) {
      var icons = 'https://skillicons.dev/icons?i=' + s.skills.join(',') + '&perline=' + s.perLine +
        (s.skillTheme === 'light' ? '&theme=light' : '');
      out.push('### 🛠️ ' + L.skills + '\n\n<p align="left">\n  <a href="https://skillicons.dev"><img src="' + icons +
        '" alt="' + esc(s.skills.map(RF.skillName).join(', ')) + '" /></a>\n</p>');
    }

    var repos = RF.parseRepos(s.featured, user);
    if (repos.length) {
      var cards = repos.map(function (r) {
        return '  <a href="https://github.com/' + r.owner + '/' + r.repo + '"><img src="https://github-readme-stats.vercel.app/api/pin/?username=' +
          r.owner + '&repo=' + r.repo + '&theme=' + theme + '&hide_border=true" alt="' + esc(r.repo) + '" /></a>';
      }).join('\n');
      out.push('### 📌 ' + L.featured + '\n\n<p align="left">\n' + cards + '\n</p>');
    }

    if (user) {
      var u = enc(user);
      var loc = s.readmeLang === 'tr' ? '&locale=tr' : '';
      var blocks = [];
      var row = [];
      if (add.stats) row.push('  <img src="https://github-readme-stats.vercel.app/api?username=' + u + '&show_icons=true&theme=' + theme + '&hide_border=true' + loc + '" alt="' + esc(user) + ' GitHub stats" />');
      if (add.topLangs) row.push('  <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=' + u + '&layout=compact&theme=' + theme + '&hide_border=true' + loc + '" alt="Top languages" />');
      if (row.length) blocks.push('<p align="center">\n' + row.join('\n') + '\n</p>');
      if (add.streak) blocks.push('<p align="center">\n  <img src="https://streak-stats.demolab.com/?user=' + u + '&theme=' + theme + '&hide_border=true' + loc + '" alt="GitHub streak" />\n</p>');
      if (add.trophies) {
        var tt = RF.TROPHY_THEMES[theme];
        blocks.push('<p align="center">\n  <img src="https://github-profile-trophy.vercel.app/?username=' + u + (tt ? '&theme=' + tt : '') + '&no-frame=true&no-bg=true&margin-w=4&row=1&column=7" alt="Trophies" />\n</p>');
      }
      if (add.activity) blocks.push('<p align="center">\n  <img src="https://github-readme-activity-graph.vercel.app/graph?username=' + u + '&theme=' + (RF.ACTIVITY_THEMES[theme] || 'minimal') + '&hide_border=true" alt="Contribution graph" />\n</p>');
      if (blocks.length) out.push('### 📊 ' + L.stats + '\n\n' + blocks.join('\n\n'));
    }

    return out.length ? out.join('\n\n') + '\n' : '';
  };

  /* ---------- progress per step, 0..4 like GitHub's contribution levels ---------- */
  function level(filled, total) { return filled <= 0 ? 0 : Math.max(1, Math.min(4, Math.ceil(filled / total * 4))); }

  RF.stepLevels = function (s) {
    s = RF.normalizeState(s);
    var basicKeys = ['name', 'subtitle', 'workingOn', 'learning', 'collaborate', 'helpWith', 'askMe', 'reachMe', 'funFact'];
    var basic = basicKeys.filter(function (k) { return clean(s[k]); }).length;
    var links = ['portfolio', 'blog', 'resume', 'featured'].filter(function (k) { return clean(s[k]); }).length;
    var social = RF.activeSocials(s).length;
    var skills = s.skills.length;
    var user = RF.resolveUser(s);
    var addons = user ? Object.keys(s.addons).filter(function (k) { return s.addons[k]; }).length : 0;
    var levels = [
      level(basic, basicKeys.length),
      level(links, 4),
      Math.min(4, social),
      skills === 0 ? 0 : skills < 4 ? 1 : skills < 8 ? 2 : skills < 12 ? 3 : 4,
      level(addons, 4)
    ];
    var sum = levels.reduce(function (a, b) { return a + b; }, 0);
    levels.push(sum === 0 ? 0 : Math.max(1, Math.round(sum / 5)));
    return levels;
  };
})(window.RF);
