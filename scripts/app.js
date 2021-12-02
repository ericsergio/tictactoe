const localRowHeight = `${(window.outerHeight * .90) / 4}px ${(window.outerHeight * .90) / 4}px ${(window.outerHeight * .90) / 4}px`;
//const localRowHeight = `${(screen.height * .90) / 4}px ${(screen.height * .90) / 4}px ${(screen.height * .90) / 4}px`;
const localGapVal = `${screen.height * .05}px`;
//for the box positioning, to make it proportional for the screen size




function Turn(counter, turnX, turnO, symbol, winScore){
    this.counter = counter || 0;
    this.turnX = turnX || false;
    this.turnO = turnO || false;
    this.symbol = symbol;
    this.winScore = winScore || 0;
}
//counter increments each time a player has a turn
//counter is used to alternate players using modulus
//turnX and turnO is what alternates at booleans
//currScore was how I first planned to establish a winner but 
//later had to re-think that... Not even sure if it is needed 
//but it might be incorporated in some of the other functionality 
//so until I want to look through it, I'm going to leave it
//symbol is for the actual X and O's -- this is another thing
//that I probably could modify since the counter is what 
//actually alternates the turns.

function Score(xScore, oScore) {
    this.xScore = [];
    this.oScore = [];
}
//These arrays keep track of what squares are already played
//which is the same as the below arrays. I'm sure this should 
//be changed which I'll do later

var xBoxes = [];
var oBoxes = [];

Score.newScore = new Score();
Turn.checkTurn = new Turn(0, true);
//Object instantiation

/*Score.prototype.changeScore = function() {
    for(var i = 0;i < xBoxes.length;i++) {
        if(Turn.checkTurn.turnX){
        }
    }  
}*/

Turn.prototype.newTurn = function() {
    Turn.checkTurn.counter++;
    if(Turn.checkTurn.counter >= 4) {
        $('.grid').children().attr('id', '').each(function() {
            $(this).on("click", function() {
                checkWin();
                //checkWin does just that, it checks if a player has won
                //after the 4th play when it becomes possible
            });
        });
    }
    var indicator = (Turn.checkTurn.counter % 2);
    //this alternates players' turns
    if (indicator < 1) {
        Turn.checkTurn.turnO = true;
        Turn.checkTurn.turnX = false;
        Turn.checkTurn.symbol = "O";
    } else if(indicator > 0){
        Turn.checkTurn.symbol = "X";
        Turn.checkTurn.turnX = true;
        Turn.checkTurn.turnO = false;
    }
}

$(document).ready(function () {
    //console.log(`Turn.checkTurn.currScore at start of jq : ${Turn.checkTurn.currScore}`);
    var scGapStr = localGapVal;
    var scHeightStr = localRowHeight;
    $('.grid').css({gridTemplateRows:scHeightStr,gridRowGap:scGapStr, gridColumnGap:scGapStr});
    $('div').children().on("click", function(){
        Turn.prototype.newTurn();
        //runs the above function
        if($('.selected')) {
            $('.selected').removeClass('selected');
        }
        //remove previously selected squares when a new one has been selected
        $(this).addClass("selected");
        //after removing any divs with the selected class, remove any that previously
        //were selected
        var idx = Number($('.selected').html());
        //use the existing text in the divs as the index
        //Turn.checkTurn.currScore = idx;
        
        if(Turn.checkTurn.turnX) {
            Score.newScore.xScore.push(idx);
        };
        
        if(Turn.checkTurn.turnO){
            Score.newScore.oScore.push(idx);
        };
        doSelected(idx);
        //Score.prototype.changeScore();
    });
});

function doSelected(idx) {
    var currentIdx = idx;
    if($('div.selected').siblings().hasClass('selected') && $('div.selected').attr('id') == String(idx)) {
        $('div.selected').siblings().removeClass('selected')
    }
    $('div.selected').attr('id', 'box' + idx);
    $('div.selected').append("<h1 class = 'played'>" + Turn.checkTurn.symbol + "</h1>");
    
    if (Turn.checkTurn.symbol === "X") {
        $('div.selected').addClass('x');
        xBoxes.push(idx);
    } else {
        oBoxes.push(idx);
        $('div.selected').addClass('o');
    }  
}

function checkWin() {
    var win = false;
    let squares = [];
    let x = Score.newScore.xScore;
    let x3 = [x[x.length - 1], x[x.length - 2], x[x.length - 3]];
    let x3Check = x3.sort();
    let winGroups = [1,5,9];
        let group1 = [[1,2,3],[1,4,7]]; //contains 1, no 5
        let group5 = [[2,5,8], [4,5,6], [1,5,9], [3,5,7]]; //contains 5
        let group9 = [[3,6,9], [7,8,9]]; //contains 9, no 5
    console.log(`this is x3Check that is being tested - > ${x3Check}`);
    if($.inArray(5, x3Check) > -1) {
        for(var p in group5) {
            if(x3Check[0] === group5[p][0]) {
                win = true;
                console.log(` the match should be --> ${group5[p]}`);
                squares = group5[p];
                if(Turn.checkTurn.turnX) {
                    Score.newScore.xScore = squares;
                } else {
                    Score.newScore.oScore = squares;
                }
            }
        }
    } else if ($.inArray(1, x3Check) > -1) {
        for(var p in group1) {
            if(x3Check[0] === group1[p][0]) {
                win = true;
                console.log(` the match should be --> ${group1[p]}`);
                squares = group1[p];
                if(Turn.checkTurn.turnX) {
                    Score.newScore.xScore = squares;
                } else {
                    Score.newScore.oScore = squares;
                }
            }
        }
        
    } else if ($.inArray(9, x3Check) > -1) {
        for(var p in group9) {
            if(x3Check[0] === group9[p][0]) {
                win = true;
                console.log(` the match should be --> ${group9[p]}`);
                squares = group9[p];
                if(Turn.checkTurn.turnX) {
                    Score.newScore.xScore = squares;
                } else {
                    Score.newScore.oScore = squares;
                }
            }
        }
    }
    if(win) {
        var widthStr = $('.grid').css('width');
        var maybeColPxVal = (Number(widthStr.replace('px', '')) * .07);
        var boxWidthStr = $('.grid').children(0).eq(0).css('width');
        var canvasWidth = (Number(boxWidthStr.replace('px', '')) * 3) + (maybeColPxVal * 2);
        console.log(`
            widthStr --> $('.grid').css('width') <-- : ${widthStr}
            maybeColPxVal --> (Number(widthStr.replace('px', '')) * .05) <-- : ${maybeColPxVal}
            boxWidthStr --> $('.grid').children(0).eq(0).css('width') <-- : ${boxWidthStr}
            canvasWidth --> (Number(boxWidthStr.replace('px', '')) * 3) + (maybeColPxVal * 2) <-- : ${canvasWidth}
        `);
        $('body').before('<canvas id = "winCanvas"></canvas>');
        $('#winCanvas').css({
            'position': 'absolute',
            'height' : `${$('.grid').css('height')}`,
            'width' : `${canvasWidth}`,
            'top' : '3%', 
            'left' : '18%'
        });
        drawWinLine();
    }
    for(var p in squares) {
        $('.grid').children().eq(squares[p] - 1).css('backgroundColor', 'yellow');
    }
    function drawWinLine(x, y) {
        //if($.inArray(5, x3Check) > -1) {
        console.log(`
            group1[1] is : ${group1[1]}
        `);
        //x = Score.newScore.winScore;
        console.log(squares[0]);
        x = squares[0];
        y = squares[2];
        console.log(group9);
        //let allGroups = group9.join((group1.join(group5)));
        let allGroups = [[1,2,3],[1,4,7],[3,6,9], [7,8,9], [3,5,7], [1,5,9], [4,5,6], [2,5,8]]; //contains 1, no 5
        console.log(allGroups);
        //let allGroups = group9.push(group5);
        //allGroups = allGroups.push(group1);

        for(var p in allGroups) {
            if((x === allGroups[p][0]) && y ===allGroups[p][2]) {
            //if($.inArray(x, allGroups[p]) && $.inArray(y, allGroups[p])) {
                x = /*((x + 3) * 10)*/ x;
                y = /*((y + 3) * 10)*/ y;
                console.log(`
                    x was found to be in group : ${allGroups[p]} and has a value of ${x}
                    y was found to be in group : ${allGroups[p]} and has a value of ${y}
                    `//${allGroups[p][0]}, ${allGroups[p][1]}, ${allGroups[p][2]}
                );
            };
        }

        if($('#winCanvas')) {
            let c = $('#winCanvas')[0];
            let ctx = c.getContext('2d');
            ctx.beginPath();
            ctx.moveTo(x, y);
            x = Math.pow(x, 2.5);
            y = Math.pow(y, 2.5);
            console.log(`
                The value of x is : ${x}
                The value of y is : ${y}
            `);
            ctx.lineTo((x), (y));
            ctx.strokeStyle = "darkBlue";
            ctx.lineWidth = "4";
            ctx.stroke();
        };
    }
}

