//board
let board;
let boardWidth =360;
let boardHeight =640;
let context;

//queijo
let pWidth = 34;  //larura/altura ratio = 408/228 = 17/12
let pHeight =24;
let pX = boardWidth/8;
let pY = boardHeight/2;
let playerImg;

//objeto do queijo
let player = {
    x : pX,
    y : pY,
    width: pWidth,
    height: pHeight,
}

//"canos" = maozonas
let pipeArray = [];
let pipeWidth = 64; //larura/altura ratio = 384/30 =  1/8
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;


//fisisicas
let velocityX = -2; // velocidade de moviemento dos obstaculos para a esquerda
let velocityY = 0; //velocidade do pulo
let gravity = 0.22;

let gameOver = false;
let placar=  0;

let gameOverImg = new Image();
gameOverImg.src ="./gameover.png";




window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d") // serve para desenhar no 'board'

    //DESENHANDO O PLayer
    //context.fillStyle = "yellow";
    //context.fillRect(player.x, player.y, player.width,player.height);

    //carregar imagems
    playerImg = new Image();
    playerImg.src = "./player.png";
    playerImg.onload= function(){
        context.drawImage(playerImg,player.x, player.y, player.width,player.height);
    }
    //carregar obstaculos
    topPipeImg = new Image();
    topPipeImg.src = "./obstaculo.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./obstaculoCima.png";

    requestAnimationFrame(update);
    setInterval(placePipes, 1500); //todo 1.5 segundos
    document.addEventListener("keydown", movePlayer);
    document.addEventListener("mousedown", movePlayer);

    
}



//atualizar(step)
function update(){
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }

    //quando desenhar no canvas limpar o frame antigo
    context.clearRect(0,0, boardWidth,boardHeight)

    //player
    velocityY += gravity;
    //player.y += velocityY;4
    player.y = Math.max(player.y + velocityY,0) //aplicar gravidade para o y do player atual, limitar o pulo para o topo do canvas
    context.drawImage(playerImg,player.x, player.y, player.width,player.height);

    if (player.y > board.height){
        gameOver=true;
    }

    //obstaculo
    for(let i = 0; i < pipeArray.length; i ++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y,pipe.width,pipe.height)

        if (!pipe.passed && player.x > pipe.x + pipe.width) {
            placar += 0.5;
            pipe.passed = true;
        }

        if (detectCollision(player, pipe)){
            gameOver = true;
        }

    }

    // limpar mao fora da tla
    while(pipeArray.length > 0 && pipeArray[0].x < -pipeWidth ) {
        pipeArray.shift(); //remoce o primeiro elemento do array
    }

    //placar
    context.fillStyle = "#ffb93c";
    context.font="35px Comic Sans MS";
    context.fillText(placar, 156, 50);

    //mostrar gameOVer (mudar para imagem dps)
    if (gameOver){

            //desenha a imagem primeiro fazendo ela fica no fundo
            context.drawImage(gameOverImg, 0,0, board.width, board.height)
            

    }
}

//colocar obstaculo

function placePipes( ) {

    if (gameOver) {
        //para de criar mais obstaculos
        return;
    }
    //(0-1) * pipeHeight/2.
    // se random devolver 0 > -128 (pipeHeight/4)
    // 1 > -128 - 256 (pipeHeight/4 - pipeHeight/2) = -3/4 pipeHeight
    let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2);
    let openingSpace = board.height/4;

    let topPipe = {
        img: topPipeImg,
        x : pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height : pipeHeight,
        passed: false
    }
    // a cada 1.5 segundos chamar essa funcao e adicionar mais um obst no array
    pipeArray.push(topPipe);

    let bottomPipe = {
        img : bottomPipeImg,
        x : pipeX,
        y : randomPipeY + pipeHeight + openingSpace,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }

    pipeArray.push(bottomPipe);


}

function movePlayer (e) {
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyW" || e.button == 0) {
        //pula o qujo
        velocityY = -6;
        
        if (gameOver) {
            player.y = pY;
            pipeArray = [];
            placar = 0;
            gameOver = false;
        }
    }
}

//checar as colisoes 
function detectCollision(a, b) {
    return  a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y;

}


