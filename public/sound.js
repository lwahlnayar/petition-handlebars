(function() {
    var hoverButton = $("#hoverButton")[0];
    var clickButton = $("#clickButton")[0];
    var drawingSound = $("#drawingSound")[0];
    var resetButtonEffect = $("#resetButtonEffect")[0];

    //DOM objects below
    var button = $(".soundEffect");
    var resetButtonSelector = $(".resetSelector");
    var canvas = $("#canvas");

    //Event listeners below

    button.on("mouseenter", function(e) {
        hoverButton.play();
    });
    button.on("mousedown", function(e) {
        clickButton.play();
    });
    resetButtonSelector.on("mouseenter", function(e) {
        hoverButton.play();
    });
    resetButtonSelector.on("mousedown", function(e) {
        resetButtonEffect.play();
    });
    canvas.on("mousedown", function(e) {
        drawingSound.play();
    });
    canvas.on("mouseup", function(e) {
        drawingSound.pause();
    });
    canvas.on("mouseleave", function(e) {
        drawingSound.pause();
    });
})();
