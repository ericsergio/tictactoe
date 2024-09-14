/*
I am working on improving and documenting my code, including the algorithm I created for the game's logic found in the runSequence method
on roughly line 212. The goal of this project is to build the game algorithmically, the constant "winningCombos" is only used to
verify the winning player's sequence, not determine it. The algorithm uses the differences of the 3 played tiles indexes which I found
contains a pattern of two consecutive like values from 1 to 4. For example, the sequence of 1,5,9 which is a winning sequence that starts
in the top-left corner and runs diagonally down and to the right contains two differences of 4 i.e. 1 (+4), 5 (+4), 9. This is true for
the sequences [1,4,7], [2,5,8] and [3,6,9] which represent a winning combination going straight down starting at any of the three 
top squares, all which contain the same consecutive difference of 3. 

**also, I found a bug in the game's logic that affects player O's sequence not being recognized in a small number of winning scenarios.
This will be fixed soon.
*/
const gridBoardHeight = `${window.innerHeight * .4}`;
const gridBoardWidth = gridBoardHeight;
const gridRowHeightStr = `${(gridBoardHeight) / 4}px ${(gridBoardHeight) / 4}px ${(gridBoardHeight) / 4}px`;
const gridColWidthStr = gridRowHeightStr;
const gridGapVal = `${(gridBoardHeight / 3) * .2}px`;
const gridDivDimensionStr = `${(gridBoardHeight) / 3}px`
const winningCombos = [[1,2,3], [4,5,6], [7,8,9], [1,4,7], [2,5,8], [3,6,9], [1,5,9], [3,5,7]];
const rows = [[1,2,3],[4,5,6],[7,8,9]];



class Score {
    constructor(xScore, oScore, winner) {
        this.xScore = [].sort();
        this.oScore = [].sort();
        this.winner = winner || null;
    }
}

/*
function ScoreDiff(xDiff, oDiff, possibleWin)  {
    this.possibleWin = possibleWin || false;
    this.xDiff = [];
    this.oDiff = [];
}*/

class ScoreDiff {
    constructor(possibleWin, xDiff, oDiff) {
        this.possibleWin = possibleWin || false;
        this.xDiff = [];
        this.oDiff = [];
    }
}


/*
function Board(elem) {
    this.elem = elem;
}
*/

class Board {
    constructor(elem) {
        this.elem = elem;
    }
}

class CallCounter {
    constructor(countNumber) {
        this.countNumber = countNumber;
    }
}

CallCounter.checkWinCounter = new CallCounter(0);
CallCounter.doSelectedCounter = new CallCounter(0);
Score.newScore = new Score();
ScoreDiff.newDiff = new ScoreDiff();



class Turn {
    constructor(counter, turnX, turnO, symbol, possibleWinner, currentSequence, possibleWinningPlayer, sequenceGroup, winningBoxes) {
        this.possibleWinner = possibleWinner || false;
        this.counter = counter || 0;
        this.turnX = turnX || false;
        this.turnO = turnO || false;
        this.symbol = symbol;
        this.playerX = "X";
        this.playerO = "O";
        this.currentSequence = currentSequence || null;
        this.sequenceGroup = [];
        this.winningBoxes = [];
        this.possibleWinningPlayer = possibleWinningPlayer || null;
    }

    static checkTurn = new Turn(0, true);

    newTurn() {
        Turn.checkTurn.counter++;
        if (Turn.checkTurn.counter >= 4) {
            $('.grid').children().attr('id', '').each(function () {
                $(this).on("click", function () {
                    checkWin($(this));
                });
            });
        }
        var indicator = (Turn.checkTurn.counter % 2);
        if (indicator < 1) {
            Turn.checkTurn.turnO = true;
            Turn.checkTurn.turnX = false;
            Turn.checkTurn.symbol = "O";
        } else if (indicator > 0) {
            Turn.checkTurn.symbol = "X";
            Turn.checkTurn.turnX = true;
            Turn.checkTurn.turnO = false;
        }
    }
}




//************************  below was my original code prior to refactoring and am temporarily keeping it for reference

/*
function Turn(counter, turnX, turnO, symbol, possibleWinner, currentSequence, possibleWinningPlayer, sequenceGroup, winningBoxes) {
    this.possibleWinner = possibleWinner || false;
    this.counter = counter || 0;
    this.turnX = turnX || false;
    this.turnO = turnO || false;
    this.symbol = symbol;
    this.playerX = "X";
    this.playerO = "O";
    this.currentSequence = currentSequence || null;
    this.sequenceGroup = [];
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
*/

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
    let gridClone = $('.grid').clone(true);
    Board.initial = new Board(gridClone);
    
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
    CallCounter.doSelectedCounter.countNumber += 1;    
    if($('div.selected').siblings().hasClass('selected') && $('div.selected').attr('id') == String(idx)) {
        $('div.selected').siblings().removeClass('selected')
    }
    $('div.selected').attr('id', `box${idx}`);
    $('div.selected').replaceWith(`<div class = 'selected'><h1 class = 'played'>${Turn.checkTurn.symbol}</h1></div>`);
    if(window.outerHeight > window.outerWidth) {
        $(`div.selected`).css('color', 'none');
    };
    if (Turn.checkTurn.symbol === "X") {
        $('div.selected').addClass('x');
    } else {
        $('div.selected').addClass('o');
    }
    
}


//Bug: Turn.checkTurn.possibleWinner is not being set to true in the checkWin function

const checkWin = (/*lastPlayed*/) => {
    ScoreDiff.newDiff.xDiff = [];
    ScoreDiff.newDiff.oDiff = [];
    CallCounter.checkWinCounter.countNumber += 1;
    let xEndIdx = Score.newScore.xScore.length - 2;
    let oEndIdx = Score.newScore.oScore.length - 2;
    //console.log(`+++++++++++++++++++++++++${Turn.checkTurn.currentSequence.length}`)
    
//----------------------------------------------------------------Turn X------------------------------------------------------------    
    if(Turn.checkTurn.turnX) {
        Score.newScore.xScore = Score.newScore.xScore.sort();

        for(let i = 0; i <= xEndIdx; i++) {
            let next = i + 1;
            let diff = Score.newScore.xScore[next] - Score.newScore.xScore[i];
            Turn.checkTurn.currentSequence = Score.newScore.xScore;
            //console.log(`+++++++++++++++++++++++++${Turn.checkTurn.currentSequence.length}`)
            if(Turn.checkTurn.currentSequence.length >= 3 && Turn.checkTurn.turnX) {
                console.log('This might be somewhat useless anyways but why the fuck isnt it working');
                Turn.checkTurn.possibleWinner = true;
                console.log(`Turn.checkTurn.possibleWinner: ${Turn.checkTurn.possibleWinner}`)
            } else {
                console.log(`ok so Turn.checkTurn.currentSequence.length is: ${Turn.checkTurn.currentSequence.length} and Turn.checkTurn.turnX is: ${Turn.checkTurn.turnX}`)
            }
            if(diff > 0) {
                ScoreDiff.newDiff.xDiff.push(diff);
            }
        }
        
        let xDiffArr = ScoreDiff.newDiff.xDiff;               
        for(let xDiffIdx = 0;xDiffIdx <= xDiffArr.length;xDiffIdx++) {
            //if the current indexed difference is equal to the next indexed difference
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
                //Turn.checkTurn.possibleWinner = false;
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
            if(Turn.checkTurn.currentSequence.length >= 3 && Turn.checkTurn.turnO) {
                Turn.checkTurn.possibleWinner = true;
            }
            if(diff > 0) {
                ScoreDiff.newDiff.oDiff.push(diff);
            }
        }
        
        let oDiffArr = ScoreDiff.newDiff.oDiff;
        for(let oDiffIdx = 0;oDiffIdx <= oDiffArr.length;oDiffIdx++) {            
            if(oDiffArr[oDiffIdx] === oDiffArr[oDiffIdx + 1]) {
                for(let winCombo in winningCombos) {
                    getCombos(Turn.checkTurn.currentSequence);
                    for(let eachSequence = 0; eachSequence < Turn.checkTurn.sequenceGroup.length;eachSequence++) {
                        //If this is true, someone will have already won
                        if(String(Turn.checkTurn.sequenceGroup[eachSequence]) === String(winningCombos[winCombo])) {
                            Turn.checkTurn.possibleWinner = true;
                            Turn.checkTurn.possibleWinningPlayer = Turn.checkTurn.playerO;
                            Turn.checkTurn.winningBoxes = Turn.checkTurn.sequenceGroup[eachSequence];
                        }
                    }
                }
            } else {
                //Turn.checkTurn.possibleWinner = false;
            }
        }        
    }
//------------------------------------------------------------End-Turn-O------------------------------------------------------------


//Turn.checkTurn.possibleWinner is set to false by default and is not being set to true in the checkWin function so this is broken until that gets fixed
    if(Turn.checkTurn.possibleWinner) {
        if (verifyWinner(Turn.checkTurn.currentSequence)) {
            Score.newScore.winner = Turn.checkTurn.symbol;
            doDisplayWinner();
        }
    }
}

//played sequence is the current player's sequence (Turn.checkTurn.currentSequence)
//why am i using this param when i can access it using Turn.checkTurn.currentSequence?
const getCombos = (playedSequence) => {
    //let fullSequence = playedSequence.sort();/*Score.newScore.xScore.sort()*/
    let fullSequence = Turn.checkTurn.currentSequence.sort();
    //let fullSequenceIdxLength = playedSequence.length;/*Score.newScore.xScore.length*/
    let fullSequenceIdxLength = Turn.checkTurn.currentSequence.length;
    //what is this  
    //let shiftNum = fullSequenceIdxLength - 3;
    runSequence(1, 2, fullSequenceIdxLength, fullSequence);
}

// why am i passing m and t when they are static values?
//This is where player o is not getting the sequence group array values, only player x is
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


//TO DO: refactor and use a promise to display winning sequence and restart game without reloading page
const doDisplayWinner = () => {
    $.each(Turn.checkTurn.winningBoxes, function(){        
        //$('.grid').children(`div:eq(${this - 1})`).css('backgroundColor', 'yellow');
        //console.log(`<><><><><>${$('.grid').children(`div:eq(${Number(this) - 1})`)}`)
        //console.log()
    });

    let winBoxes = [];
    let gridParent = document.getElementById('playboard');
    let wonBoxes = Turn.checkTurn.winningBoxes[0].split(',');
    for(let i = 0;i <= wonBoxes.length - 1;i++) {
        winBoxes.push(gridParent.children[Number(wonBoxes[i]) - 1]);
        //console.log(`${Number((Turn.checkTurn.winningBoxes[0].split(',')[i]) - 1)}`)
        console.log(winBoxes[i]);
    }
    for(let eachBox in winBoxes) {
        winBoxes[eachBox].style.backgroundColor = 'yellow';
    }
    //$("body").append(`<p class="winner">Player ${Turn.checkTurn.symbol} Wins!</p>`);
    let playedTiles = document.querySelectorAll('.played');    
    let playedTileArr = [];
    for(let i = 0;i < playedTiles.length;i++) {
        playedTileArr.push(playedTiles[i])
    }
    //clearBoard(playedTileArr);
}

const clearBoard = (tiles) => {
    $('.grid').remove();
    $('#toeGameContainer').append(Board.initial.elem);
    $('.winner').append(`<button id = 'btnRestart'>New Game</button>`);
    $('#btnRestart').on('click', () => {
        location.reload();
    });
}

//Should probably just put this in the html file
$(document).ready(function() {
    let contactItems = ['mailIcon', 'githubIcon', 'linkedInIcon'];
    let contactHrefs = ['mailto:ericdsergio87@icloud.com','https://github.com/ericsergio','https://linkedin.com/in/ericsergio']
    for(let i in contactItems) {
        $('.contactGrid').append(`
        <li id = ${contactItems[i]}>
            <a href = '${contactHrefs[i]}' target="_blank">
                <img src = '../../assets/icons/${contactItems[i]}.png' alt = '${contactItems[i]} icon png'>
            </a>
        </li>`);
    }
    $('.contactGrid').prepend(`<p>&copy; 2023 Eric Sergio's Portfolio</p>`);
});