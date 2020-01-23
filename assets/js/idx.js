$(document).ready(function () {
    /* var $srcicon = $('#cnt2 > img');
    
    $srcicon.on('scroll', function () {
        
    }); */

    var $introImg = $('#cnt1 .overlay img');
    var imgPos = new Array(4);
    for (var i = 0; i < imgPos.length; i++) {
        imgPos[i] = [$introImg.eq(i).offset().top, $introImg.eq(i).offset().left];
    }
    console.log(imgPos);

    $('#cnt1').on('mousemove', function (e) {
        var mouseX = e.clientX;
        var mouseY = e.clientY;

        for (var i = 0; i < $introImg.length; i++) {
            $introImg.eq(i).stop().animate({left: imgPos[i][0] + mouseX * 0.025 * i, top: imgPos[i][0] + mouseY * 0.064 * i})
        }
    });
});