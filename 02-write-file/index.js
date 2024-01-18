const fs = require('fs');
const path = require('path');
const bytext = 'Прощайте! Запись завершен.';

const filePath = path.join('02-write-file', 'text.txt');
const writeStream = fs.createWriteStream(filePath);

const promptText = 'Введите текст (для завершения введите "exit"): ';

// process.stdout представляет собой поток вывода в консоль.
// write(promptText) используется для записи текста в этот поток вывода.
process.stdout.write(promptText);

process.stdin.setEncoding('utf8');
process.stdin.on('data', (input) => {
  // удаляем пробелы с обоих концов
  input = input.trim();

  if (input.toLowerCase() === 'exit') {
    console.log(bytext);
    process.exit();
  }

  writeStream.write(input + '\n');
  process.stdout.write(promptText);
});

process.on('SIGINT', () => {
  console.log(`\n${bytext}`);
  process.exit();
});
