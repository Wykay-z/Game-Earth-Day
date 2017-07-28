
    // 音乐
    var bgMusic = document.getElementById("bg_music");
    var hitMusic = document.getElementById("hit_music");
    var isHitMusic = true;

    function ctrMusic(){
        $(".music-icon").show();
//        var audio = document.getElementById("bg_music");
        bgMusic.volume = 0.6;
        bgMusic.play();
        bgMusic.playbackRate=1;
        bgMusic.loop = true;

        $(".music-icon").on("touchstart",function(){
            if(bgMusic.paused){
                bgMusic.play();
                isHitMusic = true;
                $(this).removeClass('music-icon-stop').addClass("music-act")
            }else{
                bgMusic.pause();
                isHitMusic = false;
                $(this).addClass('music-icon-stop').removeClass("music-act")
            }
        })
    }


    // 获取网页地址,判断是否replay
    var hrefStr = location.href;
    var isReplay;
    if(hrefStr.indexOf("replay=1") == -1){
        isReplay = false;
        firstGameStart();
    } else {
        isReplay = true;
        $("#start").hide();
        $("#trash_list").show();
        var showPlayBtn = setTimeout(function () {
            $("#play_btn").show();
        }, 500);
//        }, 500);
        setInterval(function () {
            tipScene();
        }, 4000);

    }
    console.log(isReplay);




    var height = $(document).height();
    var width = $(document).width();
    var ratioH = height/width * 10;
    var hitStartRatio = ratioH-4.5;
    var hitEndRatio = ratioH-1.1;
    var hitStartHeight = hitStartRatio/10*width;
    var hitEndHeight = hitEndRatio/10*width;



    function firstGameStart()
    {
        // 主要文字介绍动画
        var introPIndex = 0;
        var introShow = setInterval(function () {

            $("#intro_text p").eq(introPIndex).animate({
                top: "0"
            }, 400, "easeOutQuint")
            if (introPIndex == 2) {
                clearInterval(introShow);
                $("#game_start_btn").delay(2500).fadeIn(500);
//            $("#game_start_btn").delay(100).fadeIn(500);
            } else {
                $("#intro_text p").eq(introPIndex).delay(600).animate({
                    top: "1rem",
                    opacity: 0
                }, 300, "easeOutQuint")
                introPIndex += 1;
            }
        }, 2200)
//    }, 200)



    }





    //    游戏引导界面
    $("#game_start_btn").on("click", function (e) {
        e.stopPropagation();
        e.preventDefault();

        $("#start").hide();
        $("#trash_list").show();
        tipScene();
        var showPlayBtn = setTimeout(function () {
            $("#play_btn").show();
        }, 4000);
//        }, 500);
        setInterval(function () {
            tipScene();
        }, (ratioH - 1.1) / 0.003);
    })

    function tipScene() {
        $("#trash_list").append('<div class="trash_el"><img src="img/trash1.png"></div>');

        var movingEl = $("#trash_list .trash_el").eq(-1);
        $("#tip_text").html("");
        var movingAni = setInterval(function () {

            if (movingEl.offset().top < hitStartHeight) {
                movingEl.css({top: "+=.03rem"});
            } else if (movingEl.offset().top >= hitStartHeight && movingEl.offset().top < hitStartHeight + .02 * width) {
                $("#tip_text").html("点击按钮区域可消除垃圾");
                setTimeout(function () {
                    movingEl.css({top: "+=.01rem"});
                }, 600)
            } else if (movingEl.offset().top >= hitStartHeight + .02 * width && movingEl.offset().top < hitEndHeight) {
                $("#tip_text").html("点击按钮区域可消除垃圾");
                movingEl.css({top: "+=.015rem"});
                $("#tip_text").show();
                $("#tip_hand").show();
            } else if (movingEl.offset().top >= hitEndHeight) {
                $("#tip_text").html("一旦错失点击时机, 游戏将直接结束");
                $("#tip_hand").hide();
                clearInterval(movingAni);
                setTimeout(function () {
                    movingEl.remove();
                }, 900)
            }
        }, 10);


        $("#touch_btn").on("click", function (e) {
            e.stopPropagation();
            e.preventDefault();
            var clientX;
            var clientY;
            clientX = e.pageX;
            clientY = e.pageY;
            if (clientX > width / 3 && clientX < width / 3 * 2) {
                if (movingEl.offset().top >= hitStartHeight + .02 * width &&
                        movingEl.offset().top < hitEndHeight) {
                    $("#tip_text").html("点击时机正确, 消除一个垃圾, 游戏继续");
                    movingEl.remove();
                    $("#tip_hand").hide();
                    clearInterval(movingAni);
                }
            }
        })
    }






    // 主要程序

    var stage = $("#gameUI");
    var frame;
    var runningTime = 0;
    var score = 0;
    var mainInterval;
    var trashes = [];
    var trashes1 = [];
    var trashes2 = [];
    var trashes3 = [];
    var runningSpeed;

    // 背景点点运动
    var bgDeco = $(".bg_deco").eq(0);
    var bgDeco2 = $(".bg_deco").eq(1);
    bgDeco.css({top: -height});
    bgDeco2.css({top: 0});
    var bgSpeed=1;



    $("#play_btn").on("touchstart click", function(){
        $("#game_tip").hide();
        ctrMusic();
        bgMusic.play();
        gameInit();
    })

    $("#replay_btn").on("touchstart click", function(){
        window.open("index.html?replay=1", "_self");
        endPageInit();
        $("#mls_info").hide();
        $("#dev_info").hide();
        $("#mls_info p").css({"margin-left": "6rem"});
        gameInit();
    })

    function endPageInit(){
//        bgM.play();
        $("#end").hide();
        $("#touch_btn").show();
        $("#stage_init .line2").show();
        $("#ending_word").show();
//        $("#end").css({"background-color" : "rgba(0,0,0,.3)"});
        $(".end_btn").css({"right": "0.8rem"})
        $("#mls_info").hide();
        $("#dev_info").hide();
        $("#end .start_logo").hide();
        $("#mls_info p").css({"margin-left": "6rem"});
    }

    function gameInit(){
        myShareTitle = "财新 | 对方在跑马拉松并向你扔了个垃圾";

        $("#gameUI").html("");

        $("#gameUI").append('<div id="score_area"><span id="running_time">0</span> km</div>');
        $("#touch_btn").unbind();


        frame = 0;
        runningTime = 0;
        runningSpeed = 1;
        score = 0;
        mainInterval;
//        trashes = [];
        trashes1 = [];
        trashes2 = [];
        trashes3 = [];
        bgSpeed = 1;
        bgMusic.playbackRate=1;


        // 3 2 1 Go! 动画结束后恢复初始位置
        var numIndex = 0;
        $("#count_down p").eq(numIndex).animate({
            top: "5rem"
        }, 300, "easeOutQuint");
        $("#count_down p").eq(numIndex).delay(400).animate({
            top: "7rem",
            opacity: 0
        }, 150, "easeOutQuint", function(){
            $(this).css({top: "-2rem", opacity: "1"});
        });
        var countDown = setInterval(function(){
            numIndex += 1;
            $("#count_down p").eq(numIndex).animate({
                top: "5rem"
            }, 300, "easeOutQuint")
            $("#count_down p").eq(numIndex).delay(400).animate({
                top: "7rem",
                opacity: 0
            }, 150, "easeOutQuint", function(){
                $(this).css({top: "-2rem", opacity: "1"});
            })
            if(numIndex >= 3) {
                clearInterval(countDown);
            }
        }, 850)
//        }, 250)

//        setTimeout(gameStart, 3400);
        setTimeout(function(){

            mainInterval = setInterval(gameStart, 10);
        }, 2600);

        $("#touch_btn").on("touchstart", clientAction);

    }


    function gameStart(){

        if(bgDeco.offset().top>=0 || bgDeco2.offset().top >=height){
            bgDeco.css({top: -height});
            bgDeco2.css({top: 0});
        }

        bgDeco.css({top: "+=" + bgSpeed + "px" });
        bgDeco2.css({top: "+=" + bgSpeed + "px" });

        frame ++;
        if(frame%40 == 0){
            runningTime += runningSpeed;
            score = parseFloat(runningTime*0.1).toFixed(1);
            $("#running_time").html(score);
        }
        $("#gameUI").show();
        if(frame%20 == 0 ){
            if(frame<1500 && frame%80 == 0){
                addingTrash();
                bgMusic.playbackRate=1;
                runningSpeed = 1;
                bgSpeed = 1;
            }else if(frame<2800&& frame>=1500 && frame%40==0){
                addingTrash();
                bgMusic.playbackRate=1.1;
                runningSpeed = 1.5;
                bgSpeed = 2;
            }else if(frame<4000&& frame>=2800 && frame%40==0){
                addingTrash();
                bgMusic.playbackRate=1.3;
                runningSpeed = 2;
                bgSpeed = 2.5;
            }else if( frame<5400 && frame>=4000 && frame%20==0){
                addingTrash();
                bgMusic.playbackRate=1.5;
                runningSpeed = 2.5;
                bgSpeed = 3;
            }else if(frame>=5400 && frame%20==0){
                addingTrash();
                bgMusic.playbackRate=1.7;
                runningSpeed = 3;
                bgSpeed = 3.5;
            }
        }

        // 两个同时落下
        if(frame%1500 == 0) {
            addingTrash();
        }



        hitEnd(trashes1);
        hitEnd(trashes2);
        hitEnd(trashes3);

    }


    function addingTrash(){
        // 速度控制
        var speed;
        if(frame<=700){
            speed = getRandomSpeed(2.5,2.7);
        }else if(frame>700&& frame<=1300){
            speed = getRandomSpeed(2.7,2.9);
        }else if(frame>1300&& frame<=1800){
            speed = getRandomSpeed(2.8,3);
        }else if(frame>1800&& frame<=2200){
            speed = getRandomSpeed(2.9,3.1);
        }else if(frame>2200 && frame<= 2800){
            speed = getRandomSpeed(3.1,3.3);
        }else if(frame>2800 && frame<= 3200){
            speed = getRandomSpeed(3.3,3.5);
        }else if(frame>3200 && frame<= 3800){
            speed = getRandomSpeed(3.5,3.7);
        }else if(frame>3800 && frame<= 4600){
            speed = getRandomSpeed(3.7,3.8);
        }else if(frame>4600 && frame<= 5600){
            speed = getRandomSpeed(3.8,3.9);
        }else if(frame>5600 && frame<= 6400){
            speed = getRandomSpeed(3.9,4);
        }else if(frame>6400 && frame<= 7200){
            speed = getRandomSpeed(4,4.2);
        }else if(frame>7200 && frame<= 9000){
            speed = getRandomSpeed(4.2,4.3);
        }else{
            speed = getRandomSpeed(4.3,4.6);
        }

        // 随机出现的列数及图片
        var colIndex = parseInt(Math.random()*3)+1;
        var imgIndex = parseInt(Math.random()*10)+1;

        trash = new Trash(colIndex, speed, imgIndex);
        addTrash(trash);
        if(colIndex == 1){
            trashes1.push(trash);
            console.log("trashes1: "+trashes1.length);
        } else if (colIndex == 2){
            trashes2.push(trash);
            console.log("trashes2: "+trashes2.length);
        } else if (colIndex == 3){
            trashes3.push(trash);
            console.log("trashes3: "+trashes3.length);
        }
    }



    // 玩家没有点击,图片到底了,游戏结束
    function hitEnd(array){
        for (var i = 0; i < array.length; i++) {
            var targetTop = array[i].imgNode.offset().top;
            array[i].imgNode.css({top: targetTop+array[i].speed+"px"});
            if (targetTop > hitEndHeight) {
                clearInterval(mainInterval);
                gameOver();
            }
        }
    }

    // 速度,范围内随机产生
    function getRandomSpeed(min, max) {
        return [Math.floor(Math.random() * (max*10 - min*10 + 1)) + min*10]/10;
    }




    function gameOver(){
        bgMusic.playbackRate=1;
        $("#score_area").remove();
        $("#end").show();

//        排名及分享内容
        db_Score = score;
        showRanking();
        myShareTitle = "财新 | 快点！我跑了"+ db_Score +"km，并且稳稳接住了所有垃圾！";
        weixinShare(myShareTitle, myShareText, myShareImg);

        console.log(db_Score);
//        $("#final_ranking").html(score);
        $("#final_score").html(score);
        // 重要的事,最后介绍页
        $("#info_btn").show();
        $("#report_btn").hide();
        $("#info_btn").on("click", function(e){
            e.stopPropagation();
            e.preventDefault();
            $("#gameUI").hide();
            $("#ending_word").hide();
            $("#touch_btn").hide();
            $("#stage_init .line2").hide();
            $("#mls_info").show();
            $("#end .start_logo").show();
//            $("#end").css({"background-color" : "rgba(0,0,0,0)"});
            $(".end_btn").animate({right: "7.6rem"}, function(){
                $("#info_btn").hide();
                $("#report_btn").show();
            })
//            $("#mls_info").animate({left: "4rem"});
            $.each($("#mls_info p"), function(i){
                $(this).delay(i*400).animate({marginLeft: "0rem"});
            })
            $("#dev_info").delay(2800).show();

        })
        $("#report_btn").on("click", function(e){
            e.stopPropagation();
            e.preventDefault();
            // 跳转到相关报道
            window.location.href = "http://datanews.caixin.com/2017-05-02/101085110.html";
        })
    }


    // 玩家点击行为
    function clientAction(e){
        e.stopPropagation();
        e.preventDefault();
        var clientX;
        var clientY;
        var clientCol;
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;

        // 判断用户点击的区块,1,2,3
        if(clientX <= width/3) {
            $("#touch_btn .btn_circle").removeClass("btn_circle_active");
            $("#touch_btn .btn_circle").eq(0).addClass("btn_circle_active");
            clientCol = 1;
            // 遍历trashes
            var targetTop = trashes1[0].imgNode.offset().top;
            if(targetTop >= hitStartHeight-10 && targetTop <= hitEndHeight){
                trashes1[0].imgNode.remove();
                trashes1.shift();
                if(isHitMusic){
                    hitMusic.play();
                }
            }else {
//                clearInterval(mainInterval);
//                gameOver();
            }
        } else if (clientX > width/3 && clientX < width/3*2) {
            $("#touch_btn .btn_circle").removeClass("btn_circle_active");
            $("#touch_btn .btn_circle").eq(1).addClass("btn_circle_active");
            clientCol = 2;
            var targetTop = trashes2[0].imgNode.offset().top;
            if(targetTop >= hitStartHeight-10 && targetTop <= hitEndHeight){
                trashes2[0].imgNode.remove();
                trashes2.shift();
                if(isHitMusic){
                    hitMusic.play();
                }
            }else {
//                clearInterval(mainInterval);
//                gameOver();
            }
        } else if (clientX >= width/3*2) {
            $("#touch_btn .btn_circle").removeClass("btn_circle_active");
            $("#touch_btn .btn_circle").eq(2).addClass("btn_circle_active");
            clientCol = 3;
            var targetTop = trashes3[0].imgNode.offset().top;
            if(targetTop >= hitStartHeight-10 && targetTop <= hitEndHeight){
                trashes3[0].imgNode.remove();
                trashes3.shift();
                if(isHitMusic){
                    hitMusic.play();
                }
            }else {
//                clearInterval(mainInterval);
//                gameOver();
            }
        }

    }


    // 类,垃圾
    function Trash(col, speed, imgUrlIndex){
        this.imgNode = null; //把HTML节点封装进来
        this.col = col;
        this.speed = speed;
        if(this.col == 1){
            this.xPos = 0.33;
        }else if(this.col == 2) {
            this.xPos = 3.75;
        }else if(this.col == 3){
            this.xPos = 7.5 - 0.37;
        }
        this.imgUrl = "img/trash" + imgUrlIndex + ".png";

    }
    // 添加垃圾元素
    function addTrash(obj){
        var el = $("<img>");
        el.attr("src", obj.imgUrl);
        el.addClass("trash trashCol"+obj.col);
        el.css({
            position: "absolute",
            width: "2.5rem",
            height: "2.5rem",
            left: obj.xPos + "rem",
            top: "-2.5rem"
        })
        el.appendTo(stage);
        obj.imgNode = el;
    }




    // 游戏分数,后台排名
    var db_Score = score;
//    console.log(db_Score);
    function showRanking(){
        var api_url='http://datav.caixin.com/api/index.php?c=earthday';
        var api_link = api_url+'&m=get_numbers&Score='+db_Score+'&format=jsonp&callback=?';

        $.getJSON(api_link, function(result){
            var rank = result.data.rank;
            $("#final_ranking").html(rank);
        });
    }