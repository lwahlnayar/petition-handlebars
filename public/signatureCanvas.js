const canvas = document.getElementById("canvas");
const resetButton = document.getElementById("resetButton");

var c = canvas.getContext("2d");

canvas.ondragstart = function() {
    return false;
};

c.strokeStyle = "#383428";
var x;
var y;
var move;
var sig = document.getElementById("sig_input");

canvas.addEventListener("mousedown", function(e) {
    e.stopPropagation();
    x = e.offsetX;
    y = e.offsetY;
    canvas.addEventListener(
        "mousemove",
        (move = function(e) {
            c.moveTo(x, y);
            x = e.offsetX;
            y = e.offsetY;
            c.lineTo(x, y);
            c.stroke();
        })
    );
    canvas.addEventListener("mouseleave", function() {
        canvas.removeEventListener("mousemove", move);
        sig.value = canvas.toDataURL();
    });
});

canvas.addEventListener("mouseup", function() {
    canvas.removeEventListener("mousemove", move);
    sig.value = canvas.toDataURL();
});

/////////////////////////////////////ON TOUCH BELOW//////////////////////////////////////////////////////////

//////////////////////////////////RESET BUTTON (BONUS FEATURE)///////////////////////////////////////////////////
resetButton.addEventListener("click", function() {
    var context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.beginPath();
    sig.value = "";
    console.log(sig.value);
});
