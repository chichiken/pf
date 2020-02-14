$(document).ready(function () {
    //onePageScrolling
    var $win = $(window);
    var $menu = $('#indicator ul li');
    var $cnt = $('#container section');
    var tgIdx = 0;  //로딩시 보여지는 섹션의 인덱스 번호, 인디케이터의 활성화 번호
    var cntPosY;    //섹션의 offset().top 값을 배열에 저장
    var total = $cnt.length;    //섹션의 전체 개수
    var timerResize = 0;      //resize이벤트의 실행문 누적을 방지 하기위해 clearTimeout()에서 호출
    var timerScroll = 0;      //scroll 이벤트의 실행문 누적을 방지
    var timerWheel = 0;      //mousewheel 이벤트의 실행문 누적을 방지
    //console.log(total); //6

    //1) 인디케이터 첫번째 li.on  클래스 추가하여 활성화
    $menu.eq(0).addClass('on');

    //2) resize이벤트 cntPosY배열에 섹션의 offset().top 저장 + 하단푸터인식
    $win.on('resize', function () {
        clearTimeout(timerResize);

        timerResize = setTimeout(function () {
            cntPosY = new Array(total);
            /* cntPosY[0] = $cnt.eq(0).offset().top;
            cntPosY[1] = $cnt.eq(1).offset().top;
            cntPosY[2] = $cnt.eq(2).offset().top; */

            for (var i = 0;i < total;i++) {
                cntPosY[i] = $cnt.eq(i).offset().top;
            }

            //push() : 배열의 가장 마지막에  새로운 데이터를 추가할 경우
            //배열명.push(데이터);
            //하단푸터제어 : 스크롤바를 가장 마지막까지 내린 경우 => 문서의 높이 - 윈도창의 높이
            cntPosY.push( $(document).height() - $win.height() );
            //console.log(cntPosY);

            //창사이즈에 변화가 생길때 현재 활성화된 섹션이 잘 보여지도록 애니메이트 추가 처리
            $('html, body').stop().animate({scrollTop: cntPosY[tgIdx]}, 1000,'easeOutBack');
        }, 50);
    });
    $win.trigger('resize');

    //3) scroll 이벤트
    $win.on('scroll', menuActive);

    function menuActive() {
        clearTimeout(timerScroll);

        timerScroll = setTimeout(function () {
            $menu.each(function (idx) {
                var scrollY = $(this).scrollTop();
                //스크롤바의 위치와 배열에 저장된 위치를 비교
                if (scrollY >= cntPosY[idx]) {
                    $(this).addClass('on').siblings().removeClass('on');
                    tgIdx = idx;
                }
            });
        }, 100);
    }    

    //4) 인디케이터 click 이벤트
    $menu.children().on('click', function (e) {
        e.preventDefault();

        //현재 애니메이트 중이면 함수 강제 종료
        if ($('html, body').is(':animated')) return false;
        
        //4-1) 인디케이터 활성화
        $(this).parent().addClass('on').siblings().removeClass('on');
        
        //4-2) 스크롤 애니메이션
        tgIdx = $(this).parent().index();
        $('html, body').stop().animate({scrollTop: cntPosY[tgIdx]}, 1000,'easeOutBack');
    });

    //5) mousewheel 이벤트
    /*  mousewheel, DOMMouseScroll(파이어폭스)
        delta(값) : 음수(-) -  마우스 휠을 아래로 내리는 경우
        delta(값) : 양수(+) -  마우스 휠을 위로 올리는 경우   
        파이어폭스 delta => e.originalEvent.detail => 다른 브라우저와 부호 반대
        */
    $cnt.on('mousewheel DOMMouseScroll', function (e) {
        clearTimeout(timerWheel);

        timerWheel = setTimeout(function () {
            //5-1) 현재 애니메이트 중이면 함수 강제 종료
            if ( $('html, body').is(':animated') ) return false;

            //5-2) delta값 구하기
            var delta = e.originalEvent.wheelDelta || e.originalEvent.detail*-1;

            //5-3) 조건문으로 마우스휠을 내리기(if)와 올리기(else if) 처리 => tgIdx
            if (delta < 0 && tgIdx < total) {
                tgIdx++;
                //console.log(delta, tgIdx, '내리기');
            } else if (delta > 0 && tgIdx > 0) {
                tgIdx--;
                //console.log(delta, tgIdx, '올리기');
            }

            //5-4) 애니메이트 처리
            $('html, body').stop().animate({scrollTop: cntPosY[tgIdx]}, 1000,'easeOutBack');
        }, 150);
    });

    //6) keydown 이벤트 : 상단(38)과 하단(40)방향키
    $(document).on('keydown', function (e) {
        //6-1) 현재 애니메이트 중이면 함수 강제 종료
        if ( $('html, body').is(':animated') ) return false;

        //6-2) keyCode 구하기
        var key = e.keyCode;
        //console.log(key);   

        //6-3) 하단방향키 , 상단방향키 제어시 tgIdx를 구하기
        if (key == 40 && tgIdx < total) tgIdx++;
        else if (key == 38 && tgIdx > 0) tgIdx--;

        //6-4) 애니메이션
        $('html, body').stop().animate({scrollTop: cntPosY[tgIdx]}, 1000,'easeOutBack');
    });

    //cnt1
    var $introImg = $('#cnt1 .overlay img');
    var imgPos = new Array(5);
    for (var i = 0; i < imgPos.length; i++) {
        imgPos[i] = [$introImg.eq(i).offset().top, $introImg.eq(i).offset().left];
    }
    //console.log(imgPos);

    $('#cnt1').on('mousemove', function (e) {
        var mouseX = e.clientX;
        var mouseY = e.clientY;
        //console.log(mouseX, imgPos[1][0] + mouseY * 0.025 * 1,  mouseY, imgPos[1][1] + mouseX * 0.044 * 1);

        for (var i = 0; i < $introImg.length; i++) {
            $introImg.eq(i).stop().animate({top: imgPos[i][0] + mouseY * 0.025 * (i + 1), left: imgPos[i][1] + mouseX * 0.044 * (i + 1)}, 'slow', 'easeOutBack');
        }
    });

    $(document).ready(function() {
        setInterval(function () {
            $('.svgbox .hiddenbox').css({width: '100%', height: '100%'}).stop().animate({width: 0, height: 0}, 1500);
        }, 3000);
    });

    //cnt2
    $('.skill_round').each(function () {
        var $tg = $(this); //svg
        var roundPercent = $tg.data('percent'); //지정하려는 %
        var roundRadius = $tg.find('circle').attr('r'); //반지름
        var roundCircum = 2 * roundRadius * Math.PI; //원의 둘레 = 지름 * 3.14(원주율)
        var roundDraw = roundPercent * roundCircum / 100; //그려질 원의 둘레 = 원둘레 / 100 * 퍼센트

        var skill_once = true; //한 번만 실행되도록
        //console.log(roundPercent); //95?
        $tg.nextAll().find('.skill_num').text(0); //처음엔 숫자 0으로 표시

        //스크롤이 일어나면 순차적으로 증가
        $win.on('scroll', function () {
            var skill_scrollY = $(this).scrollTop();
            if (skill_scrollY > $('#cnt2').offset().top && skill_once) {
                //circle 애니메이션
                $tg.css('stroke-dasharray', roundDraw);

                //숫자 제어
                $({percent: 0}).animate({percent: roundPercent}, {
                    duration: 1000,
                    progress: function () {
                        $tg.nextAll().find('.skill_num').text(Math.floor(this.perent));
                        //자바스크립트 선언, $(this) 불가능
                    }
                });
                skill_once = false;
            }
        });
    });

    //스크롤에 따라 변하는 색상
    /* var $logo = $('#logo a img');
    var logoTop = $logo.offset().top;
    
    $win.on('scroll', function () {
        if ( logoTop.scrollTop() >= 200 ) {
            $logo.attr('src', 'assets/image/common/logo_blue.png');
        } else {
            $logo.attr('src', 'assets/image/common/logo_white.png');
        };
    }); */
});