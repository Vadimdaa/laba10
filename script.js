let black = '#000000';
let white = '#ffffff';
let w = 350;    
let h = w; 
let gap = 4;

let gameActive = true;
let mc = 0;   
let p1_score = 0;
let p2_score = 0;
let ap = ['Ходит первый игрок -  [X]', 'Ходит второй игрок [O]'];

let tiles = {
    1: [],
    2: [],
    3: []
};

let field = [
    [undefined, undefined, undefined],
    [undefined, undefined, undefined],
    [undefined, undefined, undefined]
];

let axes = {
   '11-13': [undefined, 0],
   '21-23': [undefined, 0],
   '31-33': [undefined, 0],

   '11-31': [undefined, 0],
   '12-32': [undefined, 0],
   '13-33': [undefined, 0],

   '11-33': [undefined, 0],
   '13-31': [undefined, 0],
};

let nround = document.getElementById('new');
let reset  = document.getElementById('reset');

const init = (reset = false) => {
   tiles = {
       1: [],
       2: [],
       3: []
   };

   field = [
       [undefined, undefined, undefined],
       [undefined, undefined, undefined],
       [undefined, undefined, undefined]
   ];

   axes = {
       '11-13': [undefined, 0],
       '21-23': [undefined, 0],
       '31-33': [undefined, 0],

       '11-31': [undefined, 0],
       '12-32': [undefined, 0],
       '13-33': [undefined, 0],

       '11-33': [undefined, 0],
       '13-31': [undefined, 0],
   };

   gameActive = true;
   mc = 0;
   p1_score = reset ? 0 : p1_score;
   p2_score = reset ? 0 : p2_score;

   document.querySelector('#player1').textContent = p1_score;
   document.querySelector('#player2').textContent = p2_score;
};

const drawField = (color = black, gap = 10) => {
    let size = (canv.width - gap * 2) / 3;
 
    ctx.fillStyle = black;
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = color;
    for(let i = 0; i < 3; i++) {
        for(let j = 0; j < 3; j++) {
            ctx.fillRect(j * (size + gap), i * (size + gap), size, size);
            tiles[j + 1][0] = j * (size + gap);
            tiles[j + 1][1] = j * (size + gap) + size;
        }
    }
};

const drawX = (tx, ty, size, pad = 30) => {
    ctx.beginPath();
    ctx.moveTo(tx + pad, ty + pad);
    ctx.lineTo(tx + size - pad, ty + size - pad);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(tx + size - pad, ty + pad);
    ctx.lineTo(tx + pad, ty + size - pad);
    ctx.stroke();
};

const drawO = (tx, ty, size, pad = 30) => {
    pad += 10;
    ctx.beginPath();
    ctx.arc(tx + size / 2, ty + size / 2, (size - pad) / 2, 0, Math.PI * 2);
    ctx.stroke();
};

const checkMoves = (tx, ty) => {
    if(field[ty - 1][tx - 1] !== undefined) return false;
    else return true;
};

const markAxe = (move, ...tile) => {
    const getState = axe => {
        if(axes[axe][0] === undefined || axes[axe][0] === move) {
           return move;
        } else return null;
    };
    const getPoints = axe => {
        if(axes[axe][0] !== null) {
           return ++axes[axe][1];
        } else return 0;
    };
    const mark = _axes => {
        for(let _axe of _axes) {
            axes[_axe] = [getState(_axe), getPoints(_axe)];
        }
    };

    let _axes = [];
    switch(tile[1]) {
        case 1:
            switch(tile[0]) {
                case 1:
                    _axes = ['11-13', '11-31', '11-33'];
                    mark(_axes);
                    break;
                case 2:
                    _axes = ['11-13', '12-32'];
                    mark(_axes);
                    break;
                case 3:
                    _axes = ['11-13', '13-33', '13-31'];
                    mark(_axes);
                    break;
            }
            break;
        case 2:
            switch(tile[0]) {
                case 1: 
                    _axes = ['11-31', '21-23'];
                    mark(_axes);
                    break;
                case 2:
                    _axes = ['11-33', '13-31', '12-32', '21-23'];
                    mark(_axes);
                    break;
                case 3:
                    _axes = ['21-23', '13-33']; 
                    mark(_axes);
                    break;
            }
            break;
        case 3:
            switch(tile[0]) {
                case 1:
                    _axes = ['11-31', '13-31', '31-33']; 
                    mark(_axes);
                    break;
                case 2:
                    _axes = ['12-32', '31-33']; 
                    mark(_axes);
                    break;
                case 3:
                    _axes = ['13-33', '31-33', '11-33'];
                    mark(_axes);
                    break;
            }
            break;
    }
};

const checkWin = () => {
    for(let axe in axes) {
        if(axes[axe][0] !== null && axes[axe][1] == 3) {
            let marg = 30;
            let winner = axes[axe][0] ? 'Крестик' : 'Нолик';

            gameActive = false;

            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, 0, w, h);
            ctx.fillStyle = 'rgb(247, 248, 241)';
            ctx.textAlign = 'center';
            ctx.font = '30px Montserrat';
            ctx.fillText(`${winner} побеждает`, w / 2, h / 2);
            if(winner === 'Крестик') {
                p1_score++;
                document.querySelector('#player1').textContent = p1_score;
            } else {
                p2_score++;
                document.querySelector('#player2').textContent = p2_score;
            }
            return;
        }
    }
    if(mc == 9) {
        let marg = 30;
        
        gameActive = false;
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = 'rgb(207, 208, 211)';
        ctx.font = 'bold 30px Montserrat';
        ctx.textAlign = 'center';
        ctx.fillText('Ничья', w / 2, h / 2 - marg);
    }
};
let canv = document.querySelector('#tic');
let ctx  = canv.getContext('2d');

canv.width  = w;
canv.height = h; 
drawField(white, gap);

let _tileX, _tileY;
document.body.addEventListener('mousemove', e => {
    if(gameActive) {
  
        let canvXY = canv.getBoundingClientRect();

        let x = e.clientX - canvXY.left;
        let y = e.clientY - canvXY.top;
        let tileX, tileY;
        let size = (canv.width - gap * 2) / 3;
        
        if( (_tileX && _tileY) !== undefined ) {
            ctx.fillStyle = white;
            if(checkMoves(_tileX, _tileY)) {
                ctx.fillRect(tiles[_tileX][0], tiles[_tileY][0], size, size);
            }
        }

        for(let t in tiles) {
            if(x >= tiles[t][0] && x <= tiles[t][1]) {
                tileX = t;
                _tileX = tileX;
            }
            if(y >= tiles[t][0] && y <= tiles[t][1]) {
                tileY = t;
                _tileY = tileY;
            }
        }
    
        if( (tileX && tileY) !== undefined ) {
            ctx.fillStyle = white;
            if(checkMoves(tileX, tileY)) {
                ctx.fillRect(tiles[tileX][0], tiles[tileY][0], size, size);
            }
        } 
  
    } 
});

let active_player = true; 
canv.addEventListener('click', e => {
    if(gameActive) {
        let canvXY = canv.getBoundingClientRect();
        let x = e.clientX - canvXY.left;
        let y = e.clientY - canvXY.top;
        let tileX, tileY;
        let size = (canv.width - gap * 2) / 3;
        for(let t in tiles) {
            if(x >= tiles[t][0] && x <= tiles[t][1]) {
                tileX = parseInt(t);
            }
            if(y >= tiles[t][0] && y <= tiles[t][1]) {
                tileY = parseInt(t);
            }
        }
        ctx.strokeStyle = black;
        ctx.lineWidth = 5;
    
        if( (tileX && tileY) !== undefined && checkMoves(_tileX, _tileY)) {
            let t = document.getElementById('turn');

            mc++;
            active_player ? drawX(tiles[tileX][0], tiles[tileY][0], size) : drawO(tiles[tileX][0], tiles[tileY][0], size);
            field[tileY - 1][tileX - 1] = active_player;
            
            markAxe(active_player, tileX, tileY);

            active_player = !active_player;
            active_player ? t.textContent = ap[0] : t.textContent = ap[1];
        }
        checkWin();
    }
});

nround.addEventListener('click', () => {
    init();
    drawField(white, gap);
});
reset.addEventListener('click', () => {
    init(true);
    drawField(white, gap);
});