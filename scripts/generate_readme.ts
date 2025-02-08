import fs from 'fs';
import path from 'path';
import projects_json from '../public/projects.json';
import languages_json from './languages.json';
import links_json from './links.json';

const CATPPUCCIN: {
  [color: string]: [/** Latte */ string, /** Mocha */ string];
} = {
  pink: ['#ea76cb', '#f5c2e7'],
  mauve: ['#8839ef', '#cba6f7'],
  red: ['#d20f39', '#f38ba8'],
  peach: ['#fe640b', '#fab387'],
  yellow: ['#df8e1d', '#f9e2af'],
  sky: ['#04a5e5', '#89dceb'],
  sapphire: ['#209fb5', '#74c7ec'],
  blue: ['#1e66f5', '#89b4fa'],
  text: ['#4c4f69', '#cdd6f4'],
  subtext0: ['#6c6f85', '#a6adc8'],
};

const ICON_COLORS: { [icon: string]: [string, string] } = {
  twitch: CATPPUCCIN.mauve,
  youtube: CATPPUCCIN.red,
  typescript: CATPPUCCIN.blue,
  vite: CATPPUCCIN.mauve,
  less: CATPPUCCIN.sapphire,
  react: CATPPUCCIN.sapphire,
  webpack: CATPPUCCIN.text,
  rust: CATPPUCCIN.peach,
  javascript: CATPPUCCIN.yellow,
  html: CATPPUCCIN.peach,
  css: CATPPUCCIN.mauve,
  sass: CATPPUCCIN.pink,
  wakatime: CATPPUCCIN.subtext0,
  github: CATPPUCCIN.text,
};

const TEMPLATE_PATH = path.join('./scripts/readme_template.md');
if (!fs.existsSync(TEMPLATE_PATH)) {
  console.error(`Failed to generate README: readme_template.md missing.`);
  process.exit(1);
}

let content = fs.readFileSync(TEMPLATE_PATH).toString();

function getIcon(icon: string, size: number, color?: string) {
  const colors = color || ICON_COLORS[icon] || '#cdd6f4';
  return `<img height="${size}" width="${size + size * 0.25}" src="https://cdn.simpleicons.org/${icon}/${colors[0].substring(1)}/${colors[1].substring(1)}" />`;
}

let projects =
  '<!-- AUTOGENERATED: To add, edit or remove projects, edit the "public/projects.json" file. -->\n';
for (const project of projects_json) {
  projects += `- [\`${project.author === 'mxgic1337' ? '' : `${project.author}/`}${project.name}\`](https://github.com/${project.author}/${project.name}) `;
  projects += `- ${project.description} - `;
  projects += project.languages
    .map((language) => {
      return `${getIcon(language, 14)}`;
    })
    .join(' ');
  projects += `\n`;
}

content = content.replaceAll('{{ projects }}', projects);

let languages: string[] = [];
let languagesLearning: string[] = [];
for (const language of languages_json) {
  const list = language.learning ? languagesLearning : languages;
  list.push(
    `<span title="${language.name}">${getIcon(language.icon || language.name.toLowerCase(), 32)}</span>`
  );
  language.tools?.forEach((tool) => {
    list.push(
      `<span title="${language.name}: ${tool}">${getIcon(tool.toLowerCase(), 32)}</span>`
    );
  });
}

content = content.replaceAll(
  '{{ languages }}',
  '<!-- AUTOGENERATED: To add, edit or remove languages, edit the "scripts/languages.json" file. -->\n' +
    languages.join(' ')
);
content = content.replaceAll(
  '{{ languages_learning }}',
  '<!-- AUTOGENERATED: To add, edit or remove languages, edit the "scripts/languages.json" file. -->\n' +
    languagesLearning.join(' ')
);

let links: string[] = [];
for (const link of links_json) {
  links.push(
    `<a href="${link.url}" title="${link.name}">${getIcon(link.name.toLowerCase(), 26)}</a>`
  );
}

content = content.replaceAll(
  '{{ links }}',
  '<!-- AUTOGENERATED: To add, edit or remove links, edit the "scripts/links.json" file. -->\n' +
    links.join(' ')
);

content =
  `<!-- AUTOGENERATED: Do not edit manually. Instead, edit the "scripts/readme_template.md" file. -->\n` +
  content;

fs.writeFile(path.join('./README.md'), content, (err) => {
  if (err) {
    console.error(`Failed to generate README: ${err}`);
    process.exit(1);
  }
  console.log('README generated successfully.');
});
