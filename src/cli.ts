import {readFileSync} from 'node:fs';
import chalk from 'chalk';
import {createContainer} from './container.js';
import {OfferImporter} from './offers/import-offers.js';
import {Component} from './types/component.enum.js';
import {generateOffers} from './offers/generate-offers.js';

function showHelp(): void {
  console.log(chalk.cyan('Программа для подготовки данных сервиса «Шесть городов»'));
  console.log(`${chalk.yellow('--help')}              Показать справку`);
  console.log(`${chalk.yellow('--version')}           Показать версию приложения`);
  console.log(`${chalk.yellow('--import <filepath> <mongodb-uri>')} Импортировать предложения из TSV в MongoDB`);
  console.log(`${chalk.yellow('--generate <n> <filepath> <url>')} Сгенерировать предложения в TSV`);
}

function showVersion(): void {
  const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')) as {version: string};
  console.log(chalk.green(packageJson.version));
}

export async function runCLI(args: string[]): Promise<void> {
  const [command, ...parameters] = args;

  switch (command) {
    case '--version':
      showVersion();
      break;
    case '--import': {
      const [filepath, uri] = parameters;
      if (!filepath || !uri || !/^mongodb(\+srv)?:\/\//.test(uri)) {
        console.error(chalk.red('Укажите TSV-файл и MongoDB URI: --import <filepath> <mongodb-uri>'));
        process.exitCode = 1;
        return;
      }
      await createContainer().get<OfferImporter>(Component.OfferImporter).import(filepath, uri);
      break;
    }
    case '--generate': {
      const [amount, outputPath, url] = parameters;
      const count = Number(amount);
      if (!Number.isSafeInteger(count) || count < 1 || !outputPath || !url) {
        console.error(chalk.red('Укажите количество, путь и URL: --generate <n> <filepath> <url>'));
        process.exitCode = 1;
        return;
      }
      generateOffers(count, outputPath, url);
      break;
    }
    case '--help':
    default:
      showHelp();
  }
}
