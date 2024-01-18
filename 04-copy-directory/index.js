const fs = require('fs/promises');
const path = require('path');

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

const srcDir = path.join(__dirname, 'files');
const destDir = path.join(__dirname, 'files-copy');

copyFolder(srcDir, destDir);
