import { readFileSync, readdirSync, statSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';

const rootDir = process.cwd();
const packageJsonPath = join(rootDir, 'package.json');
const mainTsPath = join(rootDir, 'src/main.ts');
const appDir = join(rootDir, 'src/app');
const generatedPath = join(rootDir, 'src/app/core/_shared/build-info.generated.ts');

function readText(path) {
  return readFileSync(path, 'utf-8');
}

function listFilesRecursive(dir, fileFilter) {
  const result = [];
  const entries = readdirSync(dir);

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      result.push(...listFilesRecursive(fullPath, fileFilter));
    } else if (fileFilter(fullPath)) {
      result.push(fullPath);
    }
  }

  return result;
}

const pkg = JSON.parse(readText(packageJsonPath));
const mainTs = readText(mainTsPath);
const appTsFiles = listFilesRecursive(appDir, p => p.endsWith('.ts') && !p.endsWith('.spec.ts'));
const appHtmlFiles = listFilesRecursive(appDir, p => p.endsWith('.html'));

const allTsContent = appTsFiles.map(readText).join('\n');
const allHtmlContent = appHtmlFiles.map(readText).join('\n');

const capabilities = {
  standalone: mainTs.includes('bootstrapApplication('),
  zoneless: mainTs.includes('provideZonelessChangeDetection('),
  flowSyntax: allHtmlContent.includes('@if') || allHtmlContent.includes('@for') || allHtmlContent.includes('@switch'),
  signals: allTsContent.includes('signal('),
  formsTemplate: allTsContent.includes('FormsModule'),
  formsReactive: allTsContent.includes('ReactiveFormsModule'),
};

const buildInfo = {
  app: {
    name: pkg.name,
    version: pkg.version,
  },
  features: capabilities,
  buildTime: new Date().toISOString(),
  dependencies: {
    '@angular/build': pkg.devDependencies?.['@angular/build'] ?? 'n/a',
    '@angular/cli': pkg.devDependencies?.['@angular/cli'] ?? 'n/a',
    '@angular/compiler-cli': pkg.devDependencies?.['@angular/compiler-cli'] ?? 'n/a',
    'angular-eslint': pkg.devDependencies?.['angular-eslint'] ?? 'n/a',
    'vitest': pkg.devDependencies?.['vitest'] ?? 'n/a',
    'jsdom': pkg.devDependencies?.['jsdom'] ?? 'n/a',
    '@fortawesome/fontawesome-free': pkg.dependencies?.['@fortawesome/fontawesome-free'] ?? 'n/a',
    'bootstrap': pkg.dependencies?.['bootstrap'] ?? 'n/a',
    'rxjs': pkg.dependencies?.['rxjs'] ?? 'n/a',
    'tslib': pkg.dependencies?.['tslib'] ?? 'n/a',
  },
};

const generatedSource = `export interface BuildInfo {
  app: {
    name: string;
    version: string;
  };
  features: {
    standalone: boolean;
    zoneless: boolean;
    flowSyntax: boolean;
    signals: boolean;
    formsTemplate: boolean;
    formsReactive: boolean;
  };
  buildTime: string;
  dependencies: Record<string, string>;
}

export const BUILD_INFO: BuildInfo = ${JSON.stringify(buildInfo, null, 2)};
`;

mkdirSync(dirname(generatedPath), { recursive: true });
writeFileSync(generatedPath, generatedSource, 'utf-8');
console.log('Generated', generatedPath);

