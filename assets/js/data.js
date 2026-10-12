/* ReadmeForge: static data (config, skills, social platforms, themes) */
window.RF = window.RF || {};

/* Change these to your own values before publishing. */
RF.CONFIG = {
  appName: 'ReadmeForge',
  repo: 'benmustafademirci/readme-forge', // owner/repo, used for the star count and footer links
  author: { name: 'Mustafa Demirci', url: 'https://mustafademirci.dev' },
  storageKey: 'readmeforge:v1',
  prefsKey: 'readmeforge:prefs'
};

/* Skill icon IDs come from https://skillicons.dev (tandpfun/skill-icons). */
RF.SKILL_CATEGORIES = [
  {
    id: 'lang', label: { en: 'Languages', tr: 'Diller' },
    items: [
      ['js', 'JavaScript'], ['ts', 'TypeScript'], ['py', 'Python'], ['php', 'PHP'],
      ['java', 'Java'], ['kotlin', 'Kotlin'], ['cs', 'C#'], ['cpp', 'C++'], ['c', 'C'],
      ['go', 'Go'], ['rust', 'Rust'], ['swift', 'Swift'], ['dart', 'Dart'], ['ruby', 'Ruby'],
      ['scala', 'Scala'], ['elixir', 'Elixir'], ['haskell', 'Haskell'], ['clojure', 'Clojure'],
      ['ocaml', 'OCaml'], ['lua', 'Lua'], ['r', 'R'], ['perl', 'Perl'], ['solidity', 'Solidity'],
      ['zig', 'Zig'], ['nim', 'Nim'], ['bash', 'Bash'], ['powershell', 'PowerShell'],
      ['crystal', 'Crystal'], ['v', 'V'], ['vala', 'Vala'], ['haxe', 'Haxe'], ['fortran', 'Fortran'],
      ['coffeescript', 'CoffeeScript'], ['processing', 'Processing'], ['html', 'HTML'], ['css', 'CSS'],
      ['md', 'Markdown'], ['latex', 'LaTeX'], ['matlab', 'MATLAB'], ['octave', 'Octave']
    ]
  },
  {
    id: 'frontend', label: { en: 'Frontend', tr: 'Ön yüz' },
    items: [
      ['react', 'React'], ['nextjs', 'Next.js'], ['vue', 'Vue'], ['nuxtjs', 'Nuxt'],
      ['angular', 'Angular'], ['svelte', 'Svelte'], ['astro', 'Astro'], ['remix', 'Remix'],
      ['solidjs', 'SolidJS'], ['gatsby', 'Gatsby'], ['alpinejs', 'Alpine.js'], ['htmx', 'htmx'],
      ['jquery', 'jQuery'], ['tailwind', 'Tailwind CSS'], ['bootstrap', 'Bootstrap'],
      ['sass', 'Sass'], ['less', 'Less'], ['materialui', 'Material UI'], ['vuetify', 'Vuetify'],
      ['styledcomponents', 'styled-components'], ['redux', 'Redux'], ['threejs', 'Three.js'],
      ['d3', 'D3.js'], ['p5js', 'p5.js'], ['lit', 'Lit'], ['ember', 'Ember'], ['pinia', 'Pinia'],
      ['emotion', 'Emotion'], ['windicss', 'Windi CSS'], ['pug', 'Pug'], ['reactivex', 'ReactiveX'], ['svg', 'SVG'],
      ['vite', 'Vite'], ['webpack', 'Webpack'], ['rollupjs', 'Rollup'], ['gulp', 'Gulp'], ['babel', 'Babel'], ['wasm', 'WebAssembly']
    ]
  },
  {
    id: 'backend', label: { en: 'Backend', tr: 'Arka uç' },
    items: [
      ['nodejs', 'Node.js'], ['express', 'Express'], ['nestjs', 'NestJS'], ['deno', 'Deno'],
      ['bun', 'Bun'], ['laravel', 'Laravel'], ['symfony', 'Symfony'], ['django', 'Django'],
      ['flask', 'Flask'], ['fastapi', 'FastAPI'], ['spring', 'Spring'], ['dotnet', '.NET'],
      ['rails', 'Rails'], ['graphql', 'GraphQL'], ['apollo', 'Apollo'], ['kafka', 'Kafka'],
      ['rabbitmq', 'RabbitMQ'], ['nginx', 'Nginx'], ['appwrite', 'Appwrite'], ['adonis', 'AdonisJS'],
      ['elysia', 'Elysia'], ['ktor', 'Ktor'], ['hibernate', 'Hibernate'], ['actix', 'Actix'], ['rocket', 'Rocket'],
      ['discordjs', 'discord.js']
    ]
  },
  {
    id: 'mobile', label: { en: 'Mobile & desktop', tr: 'Mobil ve masaüstü' },
    items: [
      ['flutter', 'Flutter'], ['androidstudio', 'Android Studio'], ['apple', 'Apple'],
      ['electron', 'Electron'], ['tauri', 'Tauri'], ['qt', 'Qt'], ['gtk', 'GTK']
    ]
  },
  {
    id: 'data', label: { en: 'Databases', tr: 'Veritabanları' },
    items: [
      ['mysql', 'MySQL'], ['postgres', 'PostgreSQL'], ['mongodb', 'MongoDB'], ['redis', 'Redis'],
      ['sqlite', 'SQLite'], ['firebase', 'Firebase'], ['supabase', 'Supabase'], ['prisma', 'Prisma'],
      ['sequelize', 'Sequelize'], ['elasticsearch', 'Elasticsearch'], ['cassandra', 'Cassandra'],
      ['dynamodb', 'DynamoDB'], ['planetscale', 'PlanetScale']
    ]
  },
  {
    id: 'cloud', label: { en: 'Cloud & DevOps', tr: 'Bulut ve DevOps' },
    items: [
      ['docker', 'Docker'], ['kubernetes', 'Kubernetes'], ['aws', 'AWS'], ['gcp', 'Google Cloud'],
      ['azure', 'Azure'], ['vercel', 'Vercel'], ['netlify', 'Netlify'], ['cloudflare', 'Cloudflare'],
      ['workers', 'CF Workers'], ['heroku', 'Heroku'], ['githubactions', 'GitHub Actions'],
      ['jenkins', 'Jenkins'], ['terraform', 'Terraform'], ['ansible', 'Ansible'],
      ['grafana', 'Grafana'], ['prometheus', 'Prometheus'], ['sentry', 'Sentry'],
      ['linux', 'Linux'], ['ubuntu', 'Ubuntu'], ['debian', 'Debian'], ['arch', 'Arch'],
      ['redhat', 'Red Hat'], ['kali', 'Kali Linux'], ['bsd', 'BSD'], ['nix', 'Nix'], ['windows', 'Windows'],
      ['openshift', 'OpenShift'], ['openstack', 'OpenStack'], ['gradle', 'Gradle'], ['maven', 'Maven'],
      ['cmake', 'CMake'], ['ipfs', 'IPFS'], ['replit', 'Replit'], ['raspberrypi', 'Raspberry Pi'], ['arduino', 'Arduino']
    ]
  },
  {
    id: 'ai', label: { en: 'AI & data science', tr: 'Yapay zekâ ve veri bilimi' },
    items: [
      ['tensorflow', 'TensorFlow'], ['pytorch', 'PyTorch'], ['sklearn', 'scikit-learn'],
      ['opencv', 'OpenCV'], ['anaconda', 'Anaconda'], ['ros', 'ROS']
    ]
  },
  {
    id: 'tools', label: { en: 'Tools & design', tr: 'Araçlar ve tasarım' },
    items: [
      ['git', 'Git'], ['github', 'GitHub'], ['gitlab', 'GitLab'], ['bitbucket', 'Bitbucket'],
      ['vscode', 'VS Code'], ['visualstudio', 'Visual Studio'], ['idea', 'IntelliJ IDEA'],
      ['phpstorm', 'PhpStorm'], ['pycharm', 'PyCharm'], ['webstorm', 'WebStorm'], ['clion', 'CLion'],
      ['rider', 'Rider'], ['eclipse', 'Eclipse'], ['sublime', 'Sublime Text'], ['vscodium', 'VSCodium'], ['atom', 'Atom'], ['emacs', 'Emacs'],
      ['neovim', 'Neovim'], ['vim', 'Vim'], ['postman', 'Postman'], ['npm', 'npm'],
      ['pnpm', 'pnpm'], ['yarn', 'Yarn'], ['jest', 'Jest'], ['vitest', 'Vitest'],
      ['cypress', 'Cypress'], ['selenium', 'Selenium'], ['figma', 'Figma'], ['ps', 'Photoshop'],
      ['ai', 'Illustrator'], ['xd', 'Adobe XD'], ['ae', 'After Effects'], ['pr', 'Premiere Pro'],
      ['au', 'Audition'], ['blender', 'Blender'], ['sketchup', 'SketchUp'], ['autocad', 'AutoCAD'], ['ableton', 'Ableton'], ['notion', 'Notion'],
      ['obsidian', 'Obsidian'], ['wordpress', 'WordPress'], ['webflow', 'Webflow']
    ]
  },
  {
    id: 'game', label: { en: 'Game dev', tr: 'Oyun geliştirme' },
    items: [['unity', 'Unity'], ['unreal', 'Unreal Engine'], ['godot', 'Godot'], ['bevy', 'Bevy'], ['gamemakerstudio', 'GameMaker'], ['robloxstudio', 'Roblox Studio']]
  }
];

/* GitHub repo language name -> skill icon ID (used by auto-fill) */
RF.LANG_TO_SKILL = {
  JavaScript: 'js', TypeScript: 'ts', Python: 'py', PHP: 'php', Java: 'java', Kotlin: 'kotlin',
  'C#': 'cs', 'C++': 'cpp', C: 'c', Go: 'go', Rust: 'rust', Swift: 'swift', Dart: 'dart',
  Ruby: 'ruby', Scala: 'scala', Elixir: 'elixir', Haskell: 'haskell', Clojure: 'clojure',
  OCaml: 'ocaml', Lua: 'lua', R: 'r', Perl: 'perl', Solidity: 'solidity', Zig: 'zig', Nim: 'nim',
  Shell: 'bash', PowerShell: 'powershell', HTML: 'html', CSS: 'css', SCSS: 'sass', Sass: 'sass',
  Less: 'less', Vue: 'vue', Svelte: 'svelte', Astro: 'astro', Blade: 'laravel',
  'Jupyter Notebook': 'py', Dockerfile: 'docker', HCL: 'terraform', TeX: 'latex', MATLAB: 'matlab',
  MDX: 'md', Markdown: 'md'
};

/*
 * Social platforms. `prefix` is prepended to what the user types unless they paste a full URL.
 * `logo` is a Simple Icons slug used by shields.io; `fg` is the logo/text colour on the badge.
 */
RF.SOCIALS = [
  { id: 'github', label: 'GitHub', prefix: 'https://github.com/', color: '181717', logo: 'github' },
  { id: 'linkedin', label: 'LinkedIn', prefix: 'https://linkedin.com/in/', color: '0A66C2', logo: 'linkedin' },
  { id: 'x', label: 'X', prefix: 'https://x.com/', color: '000000', logo: 'x' },
  { id: 'instagram', label: 'Instagram', prefix: 'https://instagram.com/', color: 'E4405F', logo: 'instagram' },
  { id: 'youtube', label: 'YouTube', prefix: 'https://youtube.com/@', color: 'FF0000', logo: 'youtube' },
  { id: 'medium', label: 'Medium', prefix: 'https://medium.com/@', color: '000000', logo: 'medium' },
  { id: 'devto', label: 'DEV', prefix: 'https://dev.to/', color: '0A0A0A', logo: 'devdotto' },
  { id: 'hashnode', label: 'Hashnode', prefix: 'https://hashnode.com/@', color: '2962FF', logo: 'hashnode' },
  { id: 'stackoverflow', label: 'Stack Overflow', prefix: 'https://stackoverflow.com/users/', color: 'F58025', logo: 'stackoverflow' },
  { id: 'leetcode', label: 'LeetCode', prefix: 'https://leetcode.com/u/', color: 'FFA116', logo: 'leetcode', fg: '000000' },
  { id: 'hackerrank', label: 'HackerRank', prefix: 'https://www.hackerrank.com/profile/', color: '2EC866', logo: 'hackerrank' },
  { id: 'kaggle', label: 'Kaggle', prefix: 'https://kaggle.com/', color: '20BEFF', logo: 'kaggle' },
  { id: 'codepen', label: 'CodePen', prefix: 'https://codepen.io/', color: '000000', logo: 'codepen' },
  { id: 'dribbble', label: 'Dribbble', prefix: 'https://dribbble.com/', color: 'EA4C89', logo: 'dribbble' },
  { id: 'behance', label: 'Behance', prefix: 'https://behance.net/', color: '1769FF', logo: 'behance' },
  { id: 'discord', label: 'Discord', prefix: 'https://discord.gg/', color: '5865F2', logo: 'discord' },
  { id: 'telegram', label: 'Telegram', prefix: 'https://t.me/', color: '26A5E4', logo: 'telegram' },
  { id: 'twitch', label: 'Twitch', prefix: 'https://twitch.tv/', color: '9146FF', logo: 'twitch' },
  { id: 'tiktok', label: 'TikTok', prefix: 'https://tiktok.com/@', color: '000000', logo: 'tiktok' },
  { id: 'facebook', label: 'Facebook', prefix: 'https://facebook.com/', color: '0866FF', logo: 'facebook' },
  { id: 'bluesky', label: 'Bluesky', prefix: 'https://bsky.app/profile/', color: '0285FF', logo: 'bluesky' },
  { id: 'mastodon', label: 'Mastodon', prefix: '', placeholder: 'https://mastodon.social/@you', color: '6364FF', logo: 'mastodon' },
  { id: 'website', label: 'Website', prefix: '', placeholder: 'https://example.com', color: '30A14E', logo: 'googlechrome' },
  { id: 'email', label: 'Email', prefix: 'mailto:', placeholder: 'you@example.com', color: 'EA4335', logo: 'gmail' },
  { id: 'buymeacoffee', label: 'Buy Me a Coffee', prefix: 'https://buymeacoffee.com/', color: 'FFDD00', logo: 'buymeacoffee', fg: '000000' },
  { id: 'kofi', label: 'Ko-fi', prefix: 'https://ko-fi.com/', color: 'FF5E5B', logo: 'kofi' }
];

RF.BADGE_STYLES = ['for-the-badge', 'flat', 'flat-square', 'plastic', 'social'];

/* Themes shared by github-readme-stats and streak stats */
RF.STAT_THEMES = ['default', 'dark', 'radical', 'tokyonight', 'dracula', 'gruvbox', 'onedark', 'nord'];
/* Same names for github-profile-trophy where they exist */
RF.TROPHY_THEMES = { radical: 'radical', tokyonight: 'tokyonight', dracula: 'dracula', gruvbox: 'gruvbox', onedark: 'onedark', nord: 'nord', dark: 'darkhub' };
/* github-readme-activity-graph theme names */
RF.ACTIVITY_THEMES = { default: 'minimal', dark: 'github-compact', tokyonight: 'tokyo-night', dracula: 'dracula', gruvbox: 'gruvbox', nord: 'nord', radical: 'react-dark', onedark: 'github-compact' };
/* accent colour per theme for the typing header + visitor badge */
RF.THEME_ACCENT = { default: '30A14E', dark: '58A6FF', radical: 'FE428E', tokyonight: '70A5FD', dracula: 'FF79C6', gruvbox: 'FABD2F', onedark: 'E4BF7A', nord: '88C0D0' };
