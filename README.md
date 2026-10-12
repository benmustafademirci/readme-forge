<h1 align="center">ReadmeForge</h1>

<p align="center">
  Create a GitHub profile README in a few minutes. Free, open source, and it runs entirely in your browser.<br/>
  <strong><a href="https://benmustafademirci.github.io/readme-forge/">Open the generator</a></strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/license-MIT-30a14e?style=flat-square" alt="MIT license" />
  <img src="https://img.shields.io/badge/no%20build%20step-plain%20HTML%2FCSS%2FJS-216e39?style=flat-square" alt="No build step" />
  <img src="https://img.shields.io/badge/languages-English%20%7C%20T%C3%BCrk%C3%A7e-40c463?style=flat-square" alt="English and Turkish" />
</p>

---

## Features

- **Six short steps**: about you, links, social, skills, add-ons, finish. The progress squares fill in like a contribution graph as you complete each step.
- **Live preview** next to the form, with a rendered view and the raw markdown.
- **Auto-fill from GitHub**: enter a username and it fills empty fields from the public profile, suggests skills from your repository languages, and picks your most-starred repositories as featured projects.
- **200+ skill icons** from [skillicons.dev](https://skillicons.dev), searchable, in the order you click them.
- **26 social platforms** as [shields.io](https://shields.io) badges, in five badge styles.
- **Add-ons**: profile views counter, animated typing headline, GitHub stats, most used languages, contribution streak, trophies and contribution graph, with eight shared themes.
- **README in English or Turkish**, and an interface in both languages.
- **Light and dark mode**, mobile friendly, keyboard accessible.
- **Your work is saved** in the browser automatically. You can also save settings to a file and load them later.
- **Copy or download** `README.md` in one click.

## Use it

1. Open the generator and fill in what you want.
2. Copy the markdown or download `README.md`.
3. On GitHub, create a **public** repository with exactly the same name as your username (for example `octocat/octocat`).
4. Put the markdown in that repository's `README.md`. It now shows at the top of your profile.

## Host your own copy on GitHub Pages

The site is plain HTML, CSS and JavaScript, so there is nothing to build.

1. Create a new repository (for example `readme-forge`) and upload every file in this folder, keeping the `assets/` folder structure.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to *Deploy from a branch*, pick `main` and `/ (root)`, then **Save**.
4. After a minute the site is live at `https://<your-username>.github.io/<repo-name>/`.

Then open `assets/js/data.js` and change `RF.CONFIG` at the top:

```js
RF.CONFIG = {
  appName: 'ReadmeForge',
  repo: 'your-username/readme-forge',       // used for the star count and footer links
  author: { name: 'Your Name', url: 'https://your-site.dev' },
  ...
};
```

Update the "Open the generator" link at the top of this README too.

To use a custom domain, add it under **Settings → Pages → Custom domain** and point a `CNAME` DNS record to `<your-username>.github.io`.

## Run it locally

Double-click `index.html`, or serve the folder:

```bash
npx serve .
# or
python3 -m http.server 8080
```

## Project structure

```
index.html              page markup
assets/css/style.css    all styles (light + dark theme tokens at the top)
assets/js/data.js       config, skills, social platforms, themes
assets/js/i18n.js       interface text and README text (en, tr)
assets/js/generator.js  turns the form state into markdown (no DOM, easy to test)
assets/js/app.js        the interface: steps, binding, preview, auto-fill
```

### Add a skill

Find its ID in the [skill-icons list](https://github.com/tandpfun/skill-icons#icons-list) and add `['id', 'Display name']` to a category in `RF.SKILL_CATEGORIES` in `data.js`.

### Add a social platform

Add an entry to `RF.SOCIALS` in `data.js`. `logo` is a [Simple Icons](https://simpleicons.org) slug, `color` is the badge background.

### Add a language

Copy the `en` block in `i18n.js` (both `RF.I18N` and `RF.README_TEXT`), translate it, and add a toggle option in `app.js`.

## Services the generated README uses

The README only contains image links. These free services draw the images when someone opens your profile:

| What | Service |
| --- | --- |
| Skill icons | [skillicons.dev](https://github.com/tandpfun/skill-icons) |
| Social badges | [shields.io](https://shields.io) |
| Stats, top languages, pinned repo cards | [github-readme-stats](https://github.com/anuraghazra/github-readme-stats) |
| Contribution streak | [github-readme-streak-stats](https://github.com/DenverCoder1/github-readme-streak-stats) |
| Trophies | [github-profile-trophy](https://github.com/ryo-ma/github-profile-trophy) |
| Contribution graph | [github-readme-activity-graph](https://github.com/Ashutosh00710/github-readme-activity-graph) |
| Typing headline | [readme-typing-svg](https://github.com/DenverCoder1/readme-typing-svg) |
| Profile views | [komarev/github-profile-views-counter](https://github.com/antonkomarev/github-profile-views-counter) |

The public stats instances are shared by many people and can hit GitHub's rate limits. If a card stops loading, each project explains how to deploy your own instance; then replace the domain in your README.

## Privacy

Everything happens in your browser. The only network calls the generator makes are to the public GitHub API when you use auto-fill (and to show this repository's star count). Your form is stored in your browser's local storage and never leaves your device.

## Contributing

Issues and pull requests are welcome. Please keep it dependency-free: no build step, no framework.

## Acknowledgements

Inspired by [rahuldkjain/github-profile-readme-generator](https://github.com/rahuldkjain/github-profile-readme-generator). ReadmeForge is a separate implementation.

## License

[MIT](LICENSE)

---

## Türkçe

**ReadmeForge**, GitHub profil README'si oluşturmak için ücretsiz ve açık kaynak bir araçtır. Tamamen tarayıcıda çalışır; hiçbir veri sunucuya gönderilmez.

**Kullanım:** Formu doldur, markdown'ı kopyala ya da `README.md` olarak indir. GitHub'da kullanıcı adınla birebir aynı isimde herkese açık bir depo oluştur ve markdown'ı o deponun `README.md` dosyasına yapıştır.

**Kendi kopyanı GitHub Pages'te yayınla:**

1. Yeni bir depo oluştur (ör. `readme-forge`) ve bu klasördeki tüm dosyaları `assets/` yapısını bozmadan yükle.
2. **Settings → Pages** bölümüne git.
3. **Source** olarak *Deploy from a branch* seç, `main` ve `/ (root)` seçip **Save**'e bas.
4. Bir dakika içinde site `https://<kullanici-adin>.github.io/<depo-adi>/` adresinde yayında olur.
5. `assets/js/data.js` dosyasının başındaki `RF.CONFIG` içinde depo adını ve kendi bilgilerini güncelle.
