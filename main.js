
$(document).ready(function () {
    $(".loading").fadeOut(1050);

    const $video = $("#homevideo");
    if ($(window).width() <= 768) {
        $video.attr("src", "./img/homebg_phone.webm")[0].load();
    }

    $(window).on("resize", function () {
        const $video = $("#homevideo");
        const isMobile = $(window).width() <= 768;
        const currentSrc = $video.attr("src");
    
        if (isMobile && !currentSrc.includes("homebg_phone.webm")) {
            $video.attr("src", "./img/homebg_phone.webm")[0].load();
        } else if (!isMobile && !currentSrc.includes("homebg.webm")) {
            $video.attr("src", "./img/homebg.webm")[0].load();
        }
    });

});

document.addEventListener("DOMContentLoaded", function () {
    const video = document.getElementById("homevideo");

    video.addEventListener('loadeddata', function () {
        video.currentTime = 0;
        video.play();
    });
});


function createCardCircle(sketch, setFolder, imageCount) {
    let images = [];
    let rotationY = 0;
    let rotationSpeed = 0;
    let cardBack;

    sketch.preload = () => {
        for (let i = 1; i <= imageCount; i++) {
            let img = sketch.loadImage(`${setFolder}/card${i}.png`, (loadedImg) => {
                images[i - 1] = makeRoundedCardImage(sketch, loadedImg, 80, 120, 5);
            });
            
            images.push(img); // 提前佔位
        }
        cardBack = sketch.loadImage("img/cardback.png", (loadedImg) => {
            cardBack = makeRoundedCardImage(sketch, loadedImg, 80, 120, 5);
        });
    };
    

    sketch.setup = () => {
        sketch.createCanvas(350, 250, sketch.WEBGL);
        sketch.angleMode(sketch.DEGREES);
        sketch.noStroke();
        sketch.textureMode(sketch.NORMAL);
    };

    sketch.draw = () => {
        sketch.clear();
        rotationSpeed *= 0.95;
        rotationY += rotationSpeed;
        sketch.rotateY(rotationY);
      
        let radius = 150;
        let cardW = 80;
        let cardH = 120;
      
        for (let i = 0; i < imageCount; i++) {
          sketch.push();
      
          // 计算每张卡在圆上的位置
          let baseTheta = (360 / imageCount) * i;
          let x = radius * sketch.sin(baseTheta);
          let z = radius * sketch.cos(baseTheta);
      
          // 位移和朝内转向
          sketch.translate(x, 0, z);
          sketch.rotateY(sketch.atan2(x, z));
      
          // 计算当前朝向摄像机的角度，用于判断正反面
          let currAngle = (baseTheta + rotationY) % 360;
          if (currAngle < 0) currAngle += 360;
      
          // 根据角度选择贴图
          let tex = (currAngle > 90 && currAngle < 270) ? cardBack : images[i];
          sketch.texture(tex);
          sketch.plane(cardW, cardH);
      
          sketch.pop();
        }
      };
      
    

    sketch.touchMoved = () => {
        // 檢查觸控事件是否在 canvas 區域內
        if (sketch.mouseX >= 0 && sketch.mouseX <= sketch.width && sketch.mouseY >= 0 && sketch.mouseY <= sketch.height) {
          if (sketch.pmouseX !== undefined) {
            let deltaX = sketch.mouseX - sketch.pmouseX;
            rotationSpeed = deltaX * 0.5; // 調整靈敏度
          }
        }
        return false; // 防止頁面滾動
      };      

    // 觸控控制（手機／平板）
    sketch.touchMoved = () => {
        // 檢查觸控事件是否在 canvas 區域內
        if (sketch.mouseX >= 0 && sketch.mouseX <= sketch.width && sketch.mouseY >= 0 && sketch.mouseY <= sketch.height) {
            if (sketch.pmouseX !== undefined) {
                let deltaX = sketch.mouseX - sketch.pmouseX;
                rotationSpeed = deltaX * 0.5; // 調整靈敏度
            }
        }
        return true; // 防止頁面滾動
    };

}

function makeRoundedCardImage(sketch, img, w, h, r) {
    let g = sketch.createGraphics(w, h);
    g.noStroke();
    g.image(img, 0, 0, w, h);
    return g;
}


new p5((s) => createCardCircle(s, "img/set1", 6), "sketch1");
new p5((s) => createCardCircle(s, "img/set2", 9), "sketch2");
new p5((s) => createCardCircle(s, "img/set3", 4), "sketch3");
new p5((s) => createCardCircle(s, "img/set4", 5), "sketch4");
new p5((s) => createCardCircle(s, "img/set5", 6), "sketch5");