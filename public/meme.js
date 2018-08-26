(function() {
    var jackie = $(".jackie");
    var jackie2 = $(".jackie2");

    var moveJackie = function() {
        jackie.addClass("moveFirst");
    };

    var moveJackie2 = function() {
        jackie2.addClass("moveSecond");
    };

    setTimeout(moveJackie, 300);
    setTimeout(moveJackie2, 300);
})();
