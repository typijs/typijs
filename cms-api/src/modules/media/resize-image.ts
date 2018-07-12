import * as path from "path";
import * as sharp from "sharp";
import * as fs from "fs";

const defaultOptions = {
    width: 100,
    height: 100
};

export function resizeImage(imagePath, destPath, options = defaultOptions) {
    const { width, height } = options;

    return sharp(imagePath)
        .resize(width, height)
        //.max()
        .toFormat('jpeg')
        .webp()
        .toFile(destPath);
}