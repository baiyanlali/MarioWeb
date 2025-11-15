
export function New2DArray(j, k, fill){
    return Array(j)
        .fill(fill)
        .map(() => Array(k).fill(fill));
}

// From https://stackoverflow.com/questions/3129099/how-to-flip-images-horizontally-with-html5
export function drawImage(context ,img, x, y, width, height, deg, flip, flop, center) {

    context.save();
    
    if(typeof width === "undefined") width = img.width;
    if(typeof height === "undefined") height = img.height;
    if(typeof center === "undefined") center = false;
    
    // Set rotation point to center of image, instead of top/left
    if(center) {
        x -= width/2;
        y -= height/2;
    }
    
    // Set the origin to the center of the image
    context.translate(x + width/2, y + height/2);
    
    // Rotate the canvas around the origin
    var rad = 2 * Math.PI - deg * Math.PI / 180;    
    context.rotate(rad);
    let flipScale = 1;
    let flopScale = 1;
    // Flip/flop the canvas
    if(flip) flipScale = -1; else flipScale = 1;
    if(flop) flopScale = -1; else flopScale = 1;
    context.scale(flipScale, flopScale);
    
    // Draw the image    
    context.drawImage(img, -width/2, -height/2, width, height);
    
    context.restore();
    }