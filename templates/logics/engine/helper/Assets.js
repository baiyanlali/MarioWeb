import MarioPNG from "../../assets/mariosheet.png";
import SmallMarioPNG from "../../assets/smallmariosheet.png";
import FireMarioPNG from "../../assets/firemariosheet.png";
import EnemiesPNG from "../../assets/enemysheet.png";
import ItemsPNG from "../../assets/itemsheet.png";
import LevelPNG from "../../assets/mapsheet.png";
import ParticlesPNG from "../../assets/particlesheet.png";
import FontPNG from "../../assets/font.gif";

const ImageAssets = {
    "mariosheet.png":MarioPNG,
    "smallmariosheet.png":SmallMarioPNG,
    "firemariosheet.png":FireMarioPNG,
    "enemysheet.png":EnemiesPNG,
    "itemsheet.png":ItemsPNG,
    "mapsheet.png":LevelPNG,
    "particlesheet.png":ParticlesPNG,
    "font.gif":FontPNG,
}

export default class Assets {
    static mario = [];
    static smallMario = [];
    static fireMario = [];
    static enemies = [];
    static items = [];
    static level = [];
    static particles = [];
    static font = [];
    static map = [];
    
    
    static imgPath = './assets/';

    static async init() {
        try {
            Assets.mario = await Assets.cutImage('mariosheet.png', 32, 32);
            Assets.smallMario = await Assets.cutImage('smallmariosheet.png', 16, 16);
            Assets.fireMario = await Assets.cutImage('firemariosheet.png', 32, 32);
            Assets.enemies = await Assets.cutImage('enemysheet.png', 16, 32);
            Assets.items = await Assets.cutImage('itemsheet.png', 16, 16);
            Assets.level = await Assets.cutImage('mapsheet.png', 16, 16);
            Assets.particles = await Assets.cutImage('particlesheet.png', 16, 16);
            Assets.font = await Assets.cutImage('font.gif', 8, 8);
        } catch (error) {
            console.error(error);
        }
    }

    static async loadImage(imageName) {
        // 从静态资源对象中获取预导入的 URL
        const url = ImageAssets[imageName];
        if (!url) {
          return Promise.reject(new Error(`Image "${imageName}" not found.`));
        }
    
        // 创建并加载 Image 对象
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = url;
          img.onload = () => resolve(img);
          img.onerror = reject;
        });
      }

    // static async loadImage(imageName) {
    //     return new Promise((resolve, reject) => {
    //         const img = new Image();
    //         img.src = Assets.imgPath + imageName;
    //         img.onload = () => resolve(img);
    //         img.onerror = reject;
    //     });
    // }

    static async cutImage(imageName, xSize, ySize) {
        const source = await Assets.loadImage(imageName);
        const images = [];

        const cols = source.width / xSize;
        const rows = source.height / ySize;

        for (let x = 0; x < cols; x++) {
            images[x] = [];
            for (let y = 0; y < rows; y++) {
                // const canvas = document.createElement('canvas');
                // canvas.width = xSize;
                // canvas.height = ySize;
                // const ctx = canvas.getContext('2d');

                // ctx.drawImage(source, -x * xSize, -y * ySize);

                // images[x][y] = canvas;
                images[x][y] = await createImageBitmap(source, x * xSize, y * ySize, xSize, ySize)

            }
        }

        return images;
    }
}

