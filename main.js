let canvas = document.getElementById("preview");
let file = document.getElementById('file');
let asciiImage = document.getElementById('asciiImage');

let context = canvas.getContext("2d");

const rampForGray = " .'`^\",:;Il!i><~+_-?][}{1)(|\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";
// const rampForGray = "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\|()1{}[]?-_+~<>i!lI;:,\"^`'. ";
// const rampForGray = " .:-=+*#%@";
const rampLength = rampForGray.length;

// Formula para deixar imagem colorida em cinza
const convertToGray = function(r, g, b) {
    return (r + g + b) / 3;
};

function mapRange(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

// Code meat
const convertImageToAscii = function(width, height) {
    let imageData = context.getImageData(0, 0, width, height);

    var asciiCharacters = "";
  
    let spaceBetween = 4;
    let onePixelSpace = 4;
    for (let i = 0; i < imageData.data.length; i += (onePixelSpace * spaceBetween)) {
        // Obtem o RGB do pixel atual
        let r = imageData.data[i];
        let g = imageData.data[i + 1];
        let b = imageData.data[i + 2];
    
        // Transforma a cor do pixel em cinza
        let gray = convertToGray(r, g, b);

        const charIndex = mapRange(gray, 0, 255, 0, rampLength);
        const charIndexfloor = Math.floor(charIndex);
        const character = rampForGray.charAt(charIndexfloor);
        asciiCharacters += character;

        // Linha nova
        if (i % (imageData.width * onePixelSpace) == 0 && i != 0) {
            console.log("new line at: " + i)
            asciiCharacters += "\n";
        }
    }

    asciiImage.textContent = asciiCharacters;
    context.putImageData(imageData, 0, 0);
}

file.onchange = function(e) {
    let file = e.target.files[0];
    let reader = new FileReader();

    reader.onload = function(event) {
        let image = new Image();
        image.onload = function() {
            // Muda o tamanho do canvas para o mesmo tamanho que a imagem
            canvas.width = image.width;
            canvas.height = image.height;

            // Imagem está em base64 quando carregada
            // drawImage desenha a imagem na tela
            context.drawImage(image, 0, 0);
            convertImageToAscii(canvas.width, canvas.height)
        };

        image.src = event.target.result;
    };

    reader.readAsDataURL(file);
};
