const fs = require('fs/promises');
const path = require('path');

// копирование стилей
async function write(folder, styleFylePath) {
  try {
    // fs.mkdir строка является мерой предосторожности,
    // позволяющей убедиться в существовании целевого каталога перед работой с файлами,
    // что способствует созданию более надежного и устойчивого к ошибкам сценария.
    // { recursive: true }опция гарантирует, что если родительские каталоги не существуют, они также будут созданы.
    await fs.mkdir(path.join(__dirname, 'project-dist'), { recursive: true });

    try {
      await fs.access(styleFylePath, fs.constants.F_OK); // метод проверки существования файла или каталога
      console.log(
        `${styleFylePath} файл существует, будет удален, и собран занаво.`,
      );
      await fs.unlink(styleFylePath); // удаление файла
    } catch (accessErr) {
      if (accessErr.code !== 'ENOENT') {
        // ENOENT ошибки (нет такого файла или каталога) при проверке файла или доступе к нему.
        throw accessErr;
      }
    }

    const styleFolder = await fs.readdir(folder);
    for (let item of styleFolder) {
      const styleFile = path.join(folder, item);
      const stats = await fs.stat(styleFile);

      if (stats.isFile() && path.extname(item) === '.css') {
        const fileData = await fs.readFile(styleFile, 'utf-8');
        await fs.appendFile(styleFylePath, fileData + '\n', 'utf-8'); // fs.promises.appendFile функция позволяет открыть файл для добавления и записать в него
      } else if (stats.isDirectory()) {
        await write(styleFile);
      }
    }
  } catch (err) {
    console.error(err.message);
  }
}

// копирование assets папки
async function copyFolder(src, folder) {
  try {
    // Создаем папку files-copy, если не существует
    await fs.mkdir(folder, { recursive: true });

    // Получаем список файлов
    const listFiles = await fs.readdir(src);

    // Копируем каждый файл
    await Promise.all(
      listFiles.map(async (file) => {
        const srcPath = path.join(src, file);
        const folderPath = path.join(folder, file);

        // информацию о файле
        const state = await fs.stat(srcPath);

        if (state.isDirectory()) {
          // Если это папка, вызываем саму ф-ю передав ему пут папки
          await copyFolder(srcPath, folderPath);
        } else {
          // Если это файл, копируем его
          await fs.copyFile(srcPath, folderPath);
        }
      }),
    );

    // Удаляем файлы из folder, которых уже нет в src
    const folderFile = await fs.readdir(folder);
    await Promise.all(
      folderFile.map(async (file) => {
        const srcPath = path.join(src, file);
        const folderPath = path.join(folder, file);

        // Если файл не существует в src, удаляет
        try {
          await fs.access(srcPath);
        } catch (err) {
          await fs.unlink(folderPath);
        }
      }),
    );

    console.log(`files-copy была обнавлена! ${folder}`);
  } catch (err) {
    console.log('Произошла ошибка:', err.message);
  }
}

// копирование html components
async function writeHtml(components, template, indexHtmlPath) {
  try {
    const listComponentsItem = await fs.readdir(components);
    let templateContent = await fs.readFile(templatePath, 'utf-8');

    await Promise.all(
      listComponentsItem.map(async (file) => {
        const filePath = path.join(components, file);

        if (path.extname(filePath) === '.html') {
          try {
            const fileData = await fs.readFile(filePath, 'utf-8');

            templateContent = templateContent.replace(
              `{{${path.parse(filePath).name}}}`,
              fileData,
            );
          } catch (readErr) {
            console.error(`Error reading file ${filePath}: ${readErr.message}`);
          }
        }
      }),
    );

    await fs.writeFile(indexHtmlPath, templateContent + '\n', 'utf-8');
    console.log('Запись файла прошел успешно:', indexHtmlPath);
  } catch (err) {
    console.error(err);
  }
}

// assets
const srcDir = path.join(__dirname, 'assets');
const destDir = path.join(__dirname, 'project-dist', 'assets');

// html
const folderComponents = path.join(__dirname, 'components');
const templatePath = path.join(__dirname, 'template.html');
const indexHtmlPath = path.join(__dirname, 'project-dist', 'index.html');

// style
const styleFylePath = path.join(__dirname, 'project-dist', 'style.css');
const folder = path.join(__dirname, 'styles');

// вызов функций
write(folder, styleFylePath);
copyFolder(srcDir, destDir);
writeHtml(folderComponents, templatePath, indexHtmlPath);
