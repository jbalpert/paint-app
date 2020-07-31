window.addEventListener('load', ()=>{
    const canvas = document.querySelector('#draw');
    const ctx = canvas.getContext('2d');

    const main = document.getElementsByTagName("main");
    const clearButton = document.querySelector('.clear');
    const fillBackground = document.querySelector('.paintBucket');
    const color = document.querySelector('.color');
    const brushSize = document.querySelector('.size');
    const colorPallete = document.querySelector('.r-color');
    let colorList = document.querySelectorAll('.recent-color');
    colorsUsed = ["rgb(255, 0, 0)","rgb(255, 165, 0)","rgb(255, 255, 0)"
        ,"rgb(0, 128, 0)","rgb(0, 0, 255)","rgb(75, 0, 130)"];

    // Resize canvas when browser size gets smaller or larger
    resize();
    let painting = false;

    canvas.addEventListener('mousedown', startPosition);
    canvas.addEventListener('mouseup', finishedPosition);
    canvas.addEventListener('mousemove', draw);

    clearButton.addEventListener('click', clearCanvas);
    fillBackground.addEventListener('click', fillCanvas);
    color.addEventListener('change', addRecentColor);

    window.addEventListener('resize', resize(canvas));

    window.setInterval(function(){
        displayColors();
        colorList.forEach(element => {
            element.addEventListener('click', ()=>{
                console.log(element.style.backgroundColor);
                color.value = toHex(element.style.backgroundColor);
            });
        });
      }, 100);

    function resize(){
        canvas.height = window.innerHeight * .9;
        canvas.width = window.innerWidth * .9;
    }
    
    function startPosition(e){
        painting = true;
        draw(e);
    }
    
    function finishedPosition(){
        painting = false;
        ctx.beginPath();
    }
    
    function draw(e){
        if(!painting){
            return;
        }

        let pos = getMousePos(canvas, e);

        ctx.lineWidth = brushSize.value;
        ctx.lineCap = "round";
        ctx.strokeStyle = color.value;
        
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(pos.x,pos.y);
    }

    function clearCanvas(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function fillCanvas(){
        ctx.beginPath();
        ctx.fillStyle = color.value;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.stroke();
    }

    function addRecentColor(){
        colorsUsed.push(color.value);
        addColor();
    }

    function addColor(){
        colorList = document.querySelectorAll('.recent-color');
        if(colorList.length > 5){
            colorList[5].remove();
        }
        if(colorsUsed.length > 6){
            colorsUsed.shift();
        }
        let newColor = document.createElement("div");
        newColor.classList.add('recent-color');
        colorPallete.appendChild(newColor);
        displayColors();
    }

    function displayColors(){
        colorList = document.querySelectorAll('.recent-color');
        colorList.forEach(function(element, index){
                element.style.backgroundColor = colorsUsed[index];
            });
        }
    
    function toHex(rgb){
        console.log(rgb);
        let a = rgb.split("(")[1].split(")")[0];
        a = a.split(",");
        let b = a.map(function(x){             //For each array element
            x = parseInt(x).toString(16);      //Convert to a base16 string
            return (x.length==1) ? "0"+x : x;  //Add zero if we get only one character
        })
        b = "#"+b.join("");
        return b;
    }
          
    function getMousePos(canvas, event) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: (event.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
            y: (event.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
        };
    }

});
