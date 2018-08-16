(function() {
    var jackie = document.getElementById("jackie");
    var jackie2 = document.getElementById("jackie2");

    var moveJackie = function() {
        jackie.classList.remove("jackieHidden");
        jackie.classList.add("moveFirst");
    };

    var moveJackie2 = function() {
        jackie2.classList.remove("jackieHidden2");
        jackie2.classList.add("moveSecond");
    };

    setTimeout(moveJackie, 2000);
    setTimeout(moveJackie2, 2000);
})();
