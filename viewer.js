function ready() {
    document.getElementById("loader").style.display = "none";
    document.getElementById("container").style.display = "block";
}

function loading() {
    document.getElementById("loader").style.display = "block";
    document.getElementById("container").style.display = "none";
}

window.onload = function() {
    const giveGPS = document.getElementById("give-gps");
    const choice = document.getElementById("choose-planet");
    for (const [name, planet] of Object.entries(Planets)) {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        choice.add(option);
    }
    choice.onchange = async function(evt) {
        const name = evt.target.value;
        if (!(name in Planets)) return;
        loading();
        const planet = Planets[name];
        await planet.load();
        
        const newcanvas = document.createElement("canvas");
        const oldcanvas = document.getElementById("canvas");
        newcanvas.id = oldcanvas.id;
        newcanvas.width = oldcanvas.width;
        newcanvas.height = oldcanvas.height;
        const parent = oldcanvas.parentElement;
        oldcanvas.remove();
        parent.appendChild(newcanvas);
        
        giveGPS.onchange = giveGPS.onkeyup = function(evt) {
            const p = evt.target.value.split(":");
            const result = document.getElementById("give-coords");
            const coords = planet.world_to_point(p[2], p[3], p[4]);
            if (!coords) {
                result.value = "";
                return;
            }
            result.value = "["+coords.x+", "+coords.y+"]";
        }

        interactiveMap(planet);
        ready();
    }

    const getGPS = document.getElementById("get-gps");
    const clipboard = document.getElementById("copy-to-clipboard");
    const copied = document.getElementById("copied");
    clipboard.onclick = function(evt) {
        navigator.clipboard.writeText(getGPS.value);
        copied.style.display = "inline";
        setTimeout(() => {
            copied.style.display = "none";
        }, 1000);
    }

    ready();
};

var CLICK_COUNT = 1;

// thx http://phrogz.net/tmp/canvas_zoom_to_cursor.html
function interactiveMap(planet) {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    trackTransforms(ctx);
    function redraw(){
        ctx.save();
        ctx.setTransform(1,0,0,1,0,0);
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.restore();
        ctx.drawImage(planet.map.img, 0, 0);
    }
    
    let lastX=canvas.width/2, lastY=canvas.height/2;
    let dragStart,dragged;
    canvas.addEventListener("mousedown",function(evt){
        document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = "none";
        lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
        lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
        dragStart = ctx.transformedPoint(lastX,lastY);
        dragged = false;
    },false);
    canvas.addEventListener("mousemove",function(evt){
        lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
        lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
        dragged = true;
        if (dragStart){
            let pt = ctx.transformedPoint(lastX,lastY);
            ctx.translate(pt.x-dragStart.x,pt.y-dragStart.y);
            redraw();
        }
        const coords = document.getElementById("click-coords");
        const p = ctx.transformedPoint(lastX, lastY);
        coords.value = "["+Math.floor(p.x)+", "+Math.floor(p.y)+"]";
    },false);
    canvas.addEventListener("mouseup",function(evt){
        dragStart = null;
        const coords = document.getElementById("click-coords");
        const gps = document.getElementById("get-gps");
        const ore = document.getElementById("get-ore")
        const p = ctx.transformedPoint(lastX, lastY);
        const w = planet.point_to_world(p.x, p.y);
        if (!w) {
            coords.value = "";
            gps.value = "GPS:";
            ore.value = "";
            return;
        }
        coords.value = "["+Math.floor(p.x)+", "+Math.floor(p.y)+"]";
        gps.value = "GPS:Click #"+CLICK_COUNT+":"+w.x+":"+w.y+":"+w.z+":#FFFFFFFF:";
        CLICK_COUNT++;
        const pixel = ctx.getImageData(lastX, lastY, 1, 1);
        ore.value = planet.ore(pixel.data) || "none";
    },false);

    let scaleFactor = 1.1;
    let level = 0;
    let zoom = function(clicks){
        let pt = ctx.transformedPoint(lastX,lastY);
        ctx.translate(pt.x,pt.y);
        level += clicks;
        ctx.imageSmoothingEnabled = level < 20;
        let factor = Math.pow(scaleFactor,clicks);
        ctx.scale(factor,factor);
        ctx.translate(-pt.x,-pt.y);
        redraw();
    }

    let handleScroll = function(evt){
        let delta = evt.wheelDelta ? evt.wheelDelta/40 : evt.detail ? -evt.detail : 0;
        if (delta) zoom(delta);
        return evt.preventDefault() && false;
    };
    canvas.addEventListener("DOMMouseScroll",handleScroll,false);
    canvas.addEventListener("mousewheel",handleScroll,false);

    factor = canvas.width / planet.map.img.naturalWidth;
    ctx.scale(factor, factor);
    redraw();
};

function trackTransforms(ctx){
    let svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
    let xform = svg.createSVGMatrix();
    ctx.getTransform = function(){ return xform; };
    
    let savedTransforms = [];
    let save = ctx.save;
    ctx.save = function(){
        savedTransforms.push(xform.translate(0,0));
        return save.call(ctx);
    };
    let restore = ctx.restore;
    ctx.restore = function(){
        xform = savedTransforms.pop();
        return restore.call(ctx);
    };

    let scale = ctx.scale;
    ctx.scale = function(sx,sy){
        xform = xform.scaleNonUniform(sx,sy);
        return scale.call(ctx,sx,sy);
    };
    let rotate = ctx.rotate;
    ctx.rotate = function(radians){
        xform = xform.rotate(radians*180/Math.PI);
        return rotate.call(ctx,radians);
    };
    let translate = ctx.translate;
    ctx.translate = function(dx,dy){
        xform = xform.translate(dx,dy);
        return translate.call(ctx,dx,dy);
    };
    let transform = ctx.transform;
    ctx.transform = function(a,b,c,d,e,f){
        let m2 = svg.createSVGMatrix();
        m2.a=a; m2.b=b; m2.c=c; m2.d=d; m2.e=e; m2.f=f;
        xform = xform.multiply(m2);
        return transform.call(ctx,a,b,c,d,e,f);
    };
    let setTransform = ctx.setTransform;
    ctx.setTransform = function(a,b,c,d,e,f){
        xform.a = a;
        xform.b = b;
        xform.c = c;
        xform.d = d;
        xform.e = e;
        xform.f = f;
        return setTransform.call(ctx,a,b,c,d,e,f);
    };
    let pt  = svg.createSVGPoint();
    ctx.transformedPoint = function(x,y){
        pt.x=x; pt.y=y;
        return pt.matrixTransform(xform.inverse());
    }
}
