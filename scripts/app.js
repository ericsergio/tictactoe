
const gridBoardHeight = `${window.outerHeight * .4}`;
const gridBoardWidth = gridBoardHeight;
const gridRowHeightStr = `${(gridBoardHeight) / 4}px ${(gridBoardHeight) / 4}px ${(gridBoardHeight) / 4}px`;
const gridColWidthStr = gridRowHeightStr;
const gridGapVal = `${(gridBoardHeight / 3) * .2}px`;
const gridDivDimensionStr = `${(gridBoardHeight) / 3}px`
const winningCombos = [[1,2,3], [4,5,6], [7,8,9], [1,4,7], [2,5,8], [3,6,9], [1,5,9], [3,5,7]];
const rows = [[1,2,3],[4,5,6],[7,8,9]];



function Score(xScore, oScore, winner) {
    this.xScore = [].sort();
    this.oScore = [].sort();
    this.winner = winner || null;
}

function ScoreDiff(xDiff, oDiff, possibleWin)  {
    this.possibleWin = possibleWin || false;
    this.xDiff = [];
    this.oDiff = [];
}

function CallCounter(countNumber) {
    this.countNumber = countNumber;    
}

CallCounter.checkWinCounter = new CallCounter(0);
CallCounter.doSelectedCounter = new CallCounter(0);
Score.newScore = new Score();
ScoreDiff.newDiff = new ScoreDiff();

function Turn(counter, turnX, turnO, symbol, possibleWinner, currentSequence, possibleWinningPlayer, sequenceGroup, winningBoxes) {
    this.possibleWinner = possibleWinner || false;
    this.counter = counter || 0;
    this.turnX = turnX || false;
    this.turnO = turnO || false;
    this.symbol = symbol;
    this.playerX = "X";
    this.playerO = "O";
    this.currentSequence = currentSequence || null;
    this.sequenceGroup = []/*sequenceGroup || null*/;
    this.winningBoxes = [];
    this.possibleWinningPlayer = possibleWinningPlayer || null;
}

Turn.checkTurn = new Turn(0, true);

Turn.prototype.newTurn = () => {
    Turn.checkTurn.counter++;
    if(Turn.checkTurn.counter >= 4) {
        $('.grid').children().attr('id', '').each(function() {
            $(this).on("click", function() {
                checkWin($(this));
            });
        });
    }
    var indicator = (Turn.checkTurn.counter % 2);
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


$(document).ready(() => {    
    for(let i = 1;i <= 9;i++) {
        $('.grid').append(`<div>${i}</div>`);
    }
    $('.grid').css({
        width:`${gridBoardWidth}px`,   //gridBoardWidth is equal to the gridBoardHeight to maintain a proportional board
        height:`${gridBoardHeight}px`, //40%
        gridRowGap:gridGapVal, 
        gridColumnGap:gridGapVal
    });
    $('.grid').children().on("click", function(){
        Turn.prototype.newTurn();
        if($('.selected')) {
            $('.selected').removeClass('selected');
        }
        $(this).addClass("selected");
        var idx = Number($('.selected').html());
        
        if(Turn.checkTurn.turnX) {
            Score.newScore.xScore.push(idx);
        };
        
        if(Turn.checkTurn.turnO){
            Score.newScore.oScore.push(idx);
        };
        doSelected(idx);
    });
});


const doSelected = (idx) => {
    var currentIdx = idx;
    CallCounter.doSelectedCounter.countNumber += 1;    
    if($('div.selected').siblings().hasClass('selected') && $('div.selected').attr('id') == String(idx)) {
        $('div.selected').siblings().removeClass('selected')
    }
    $('div.selected').attr('id', 'box' + idx);
    $('div.selected').prepend("<h1 class = 'played'>" + Turn.checkTurn.symbol + "</h1>");
    if(window.outerHeight > window.outerWidth) {
        $(`div.selected`).css('color', 'cyan');
    };
    if (Turn.checkTurn.symbol === "X") {
        $('div.selected').addClass('x');
    } else {
        $('div.selected').addClass('o');
    }
}

const checkWin = (/*lastPlayed*/) => {
    ScoreDiff.newDiff.xDiff = [];
    ScoreDiff.newDiff.oDiff = [];
    CallCounter.checkWinCounter.countNumber += 1;
    let xEndIdx = Score.newScore.xScore.length - 2;
    let oEndIdx = Score.newScore.oScore.length - 2;
    
//----------------------------------------------------------------Turn X------------------------------------------------------------    
    if(Turn.checkTurn.turnX) {
        Score.newScore.xScore = Score.newScore.xScore.sort();
        for(let i = 0; i <= xEndIdx; i++) {
            let next = i + 1;
            let diff = Score.newScore.xScore[next] - Score.newScore.xScore[i];
            Turn.checkTurn.currentSequence = Score.newScore.xScore;
            if(diff > 0) {
                ScoreDiff.newDiff.xDiff.push(diff);
            }
        }
        
        let xDiffArr = ScoreDiff.newDiff.xDiff;               
        for(let xDiffIdx = 0;xDiffIdx <= xDiffArr.length;xDiffIdx++) {
            if(xDiffArr[xDiffIdx] === xDiffArr[xDiffIdx + 1]) {                
                for(let winCombo in winningCombos) {
                    getCombos(Turn.checkTurn.currentSequence);
                    for(let eachSequence = 0; eachSequence < Turn.checkTurn.sequenceGroup.length;eachSequence++) {                        
                        if(String(Turn.checkTurn.sequenceGroup[eachSequence]) === String(winningCombos[winCombo])) {
                            Turn.checkTurn.possibleWinner = true;
                            Turn.checkTurn.possibleWinningPlayer = Turn.checkTurn.playerX;
                            Turn.checkTurn.winningBoxes = Turn.checkTurn.sequenceGroup[eachSequence];
                        }
                    }
                }
            } else {
                Turn.checkTurn.possibleWinner = false;
            }
        }
    }
//------------------------------------------------------------End-Turn-X------------------------------------------------------------
//----------------------------------------------------------------Turn O------------------------------------------------------------
    if(Turn.checkTurn.turnO) {
        Score.newScore.oScore = Score.newScore.oScore.sort();
        for(let i = 0; i <= oEndIdx; i++) {
            let next = i + 1;
            let diff = Score.newScore.oScore[next] - Score.newScore.oScore[i];
            Turn.checkTurn.currentSequence = Score.newScore.oScore;
            if(diff > 0) {
                ScoreDiff.newDiff.oDiff.push(diff);
            }
        }
        
        let oDiffArr = ScoreDiff.newDiff.oDiff;
        for(let oDiffIdx = 0;oDiffIdx <= oDiffArr.length - 2;oDiffIdx++) {
            if(oDiffArr[oDiffIdx] === oDiffArr[oDiffIdx + 1]) {
                for(let winCombo in winningCombos) {
                    getCombos(Turn.checkTurn.currentSequence);
                    for(let eachSequence = 0; eachSequence < Turn.checkTurn.sequenceGroup.length;eachSequence++) {                        
                        if(String(Turn.checkTurn.sequenceGroup[eachSequence]) === String(winningCombos[winCombo])) {
                            Turn.checkTurn.possibleWinner = true;
                            Turn.checkTurn.possibleWinningPlayer = Turn.checkTurn.playerO;
                            Turn.checkTurn.winningBoxes = Turn.checkTurn.sequenceGroup[eachSequence];
                        }
                    }
                }
            } else {
                Turn.checkTurn.possibleWinner = false;
            }
        }        
    }
//------------------------------------------------------------End-Turn-O------------------------------------------------------------
    if(Turn.checkTurn.possibleWinner) {
        if (verifyWinner(Turn.checkTurn.currentSequence)){
            Score.newScore.winner = Turn.checkTurn.possibleWinningPlayer;
            doDisplayWinner();
        }
    }
}

const getCombos = (playedSequence) => {
    let fullSequence = playedSequence.sort();/*Score.newScore.xScore.sort()*/
    let fullSequenceIdxLength = playedSequence.length;/*Score.newScore.xScore.length*/
    let shiftNum = fullSequenceIdxLength - 3;
    runSequence(1, 2, fullSequenceIdxLength, fullSequence);
}

const runSequence = (m, t, seqLen, seq) => {    
    console.log(`m: ${m}, t: ${t}, seqLen: ${seqLen}, seq: ${seq}`);
    headIdx = 0;
    let head = seq[headIdx];
    let sequenceMember = [];    
    for(h = 0;h <= seqLen - 3; h++) {
        for(n = m;n <= seqLen - 2;n++) {
            let midElem = seq[n];
            for(i = t;i <= seqLen - 1;i++) {
                let tailElem = seq[i];
                if(tailElem !== midElem) {
                    sequenceMember = String([seq[h], seq[n], seq[i]]);
                    let indicatorBool = false;
                    for(let i = 0;i < Turn.checkTurn.sequenceGroup.length;i++) {
                        if(sequenceMember === String(Turn.checkTurn.sequenceGroup[i])) {
                            indicatorBool = true;
                        }
                    }
                    if(indicatorBool) {
                    } else {
                        Turn.checkTurn.sequenceGroup.push(Array(sequenceMember));
                    }
                }
            }
        }
    }
}

const verifyWinner = (sequenceToVerify) => {
    let match = false;
    for(let arr of winningCombos) {
        if(arr.toString() === sequenceToVerify.toString())  {
            match = true;
        }
    }
    return true;
}

const doDisplayWinner = () => {
    $.each(Turn.checkTurn.winningBoxes, function(){
        $('.grid').children(`div:eq(${this - 1})`).css('backgroundColor', 'yellow');
    });    
    $("body").append(`<p class="winner">Player ${Turn.checkTurn.symbol} Wins!</p>`)
}
