import fs from 'fs';
import sharp from 'sharp';

// 读取SVG文件
const svgContent = fs.readFileSync('jia_512.svg', 'utf8');

// 将SVG转换为PNG
sharp(Buffer.from(svgContent))
  .png()
  .toFile('jia_512.png')
  .then(() => {
    console.log('SVG转换为PNG成功！');
  })
  .catch(err => {
    console.error('转换失败:', err);
  });
