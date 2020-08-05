let lista_blocos
let alala
let mc

function carregaHammer(){

    lista_blocos = document.getElementById("lista-blocos");
    console.log(lista_blocos)
    alala = document.getElementById("painel2")

//     mc = new Hammer(bloco_retangulo);

//    // add a "PAN" recognizer to it (all directions)
//     mc.add(new Hammer.Pan({ direction: Hammer.DIRECTION_ALL, threshold: 0 }) );

//     // tie in the handler that will be called
//     mc.on("pan", handleDrag);

    const draggable = new Draggable.Draggable(lista_blocos, {
        draggable: '.draggable-source'
      });
      
      draggable.on('drag:start', () => console.log('drag:start'));
      draggable.on('drag:move', () => console.log('drag:move'));
      draggable.on('drag:stop', () => console.log('drag:stop'));


}

var lastPosX = 0;
var lastPosY = 0;
var isDragging = false;

function handleDrag(ev) {
    
    // for convience, let's get a reference to our object
    var elem = ev.target;
    
    // DRAG STARTED
    // here, let's snag the current position
    // and keep track of the fact that we're dragging
    if ( ! isDragging ) {
        isDragging = true;
        lastPosX = elem.offsetLeft;
        lastPosY = elem.offsetTop;
        console.log("andando")
    }
    
    // we simply need to determine where the x,y of this
    // object is relative to where it's "last" known position is
    // NOTE: 
    //    deltaX and deltaY are cumulative
    // Thus we need to always calculate 'real x and y' relative
    // to the "lastPosX/Y"
    var posX = ev.deltaX + lastPosX;
    var posY = ev.deltaY + lastPosY;
    
    // move our element to that position
    elem.style.left = posX + "px";
    elem.style.top = posY + "px";
    
    // DRAG ENDED
    // this is where we simply forget we are dragging
    if (ev.isFinal) {
        isDragging = false;
        
    }
    }

    