const multiplier = .5;
const gridBoardSide = `${window.innerHeight * multiplier}`;
const gridGapVal = `${(gridBoardSide / 8) * .2}px`;
const winningCombos = [[1,2,3], [4,5,6], [7,8,9], [1,4,7], [2,5,8], [3,6,9], [1,5,9], [3,5,7]];
const rows = [[1,2,3],[4,5,6],[7,8,9]];

class Score {
    constructor(xScore, oScore, winner) {
        this.xScore = [].sort();
        this.oScore = [].sort();
        this.winner = winner || null;
    }
}

class ScoreDiff {
    constructor(possibleWin, xDiff, oDiff) {
        this.possibleWin = possibleWin || false;
        this.xDiff = [];
        this.oDiff = [];
    }
}

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

class NewGame {
    constructor(gridClone) {
        this.gridClone = gridClone;

    }
}

CallCounter.checkWinCounter = new CallCounter(0);
CallCounter.doSelectedCounter = new CallCounter(0);
Score.newScore = new Score();
ScoreDiff.newDiff = new ScoreDiff();

class Turn {
    constructor(counter, turnX, turnO, symbol, possibleWinner, currentSequence, possibleWinningPlayer, sequenceGroup, winningBoxes, gameover) {
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
        this.gameover = gameover || false;
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

$(document).ready(() => {
    doGrid();
});


let doGrid = () => {
$(document).ready(() => {
    for(let i = 1;i <= 9;i++) {        
        $('.grid').append(`<div>${i}</div>`);
    }
    $('.grid').css({
        //width:`${gridBoardSide}px`,   //gridBoardWidth is equal to the gridBoardHeight to maintain a proportional board
        //height:`${gridBoardSide}px`,
        gridRowGap:gridGapVal, 
        gridColumnGap:gridGapVal
    });
    let gridClone = $('.grid').clone(true);
    NewGame.newGame = new NewGame(gridClone);    
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
}

const doSelected = (idx) => {
    if(!Turn.checkTurn.gameover) {
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
}

const checkWin = () => {
    ScoreDiff.newDiff.xDiff = [];
    ScoreDiff.newDiff.oDiff = [];
    CallCounter.checkWinCounter.countNumber += 1;
    let xEndIdx = Score.newScore.xScore.length - 2;
    let oEndIdx = Score.newScore.oScore.length - 2;    
    
//----------------------------------------------------------------Turn X------------------------------------------------------------    
    if(Turn.checkTurn.turnX) {
        if(!Turn.checkTurn.gameover) {
            Score.newScore.xScore = Score.newScore.xScore.sort();

            for(let i = 0; i <= xEndIdx; i++) {
                let next = i + 1;
                let diff = Score.newScore.xScore[next] - Score.newScore.xScore[i];
                Turn.checkTurn.currentSequence = Score.newScore.xScore;
                if(Turn.checkTurn.currentSequence.length >= 3 && Turn.checkTurn.turnX) {                    
                    Turn.checkTurn.possibleWinner = true;                    
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
                        getCombos();
                        for(let eachSequence = 0; eachSequence < Turn.checkTurn.sequenceGroup.length;eachSequence++) {                        
                            if(String(Turn.checkTurn.sequenceGroup[eachSequence]) === String(winningCombos[winCombo])) {
                                Turn.checkTurn.possibleWinner = true;                            
                                Turn.checkTurn.possibleWinningPlayer = Turn.checkTurn.playerX;
                                Turn.checkTurn.winningBoxes = Turn.checkTurn.sequenceGroup[eachSequence];
                            }
                        }
                    }
                }
            }
        }
    }
//------------------------------------------------------------End-Turn-X------------------------------------------------------------
//----------------------------------------------------------------Turn O------------------------------------------------------------
    if(Turn.checkTurn.turnO) {
        if(!Turn.checkTurn.gameover) {
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
                        getCombos();
                        for(let eachSequence = 0; eachSequence < Turn.checkTurn.sequenceGroup.length;eachSequence++) {
                            //If this is true, someone will have already won
                            if(String(Turn.checkTurn.sequenceGroup[eachSequence]) === String(winningCombos[winCombo])) {
                                Turn.checkTurn.possibleWinner = true;
                                Turn.checkTurn.possibleWinningPlayer = Turn.checkTurn.playerO;
                                Turn.checkTurn.winningBoxes = Turn.checkTurn.sequenceGroup[eachSequence];
                            }
                        }
                    }
                }
            }
        }
    }
//------------------------------------------------------------End-Turn-O------------------------------------------------------------

    if(Turn.checkTurn.possibleWinner) {
        if (verifyWinner(Turn.checkTurn.currentSequence)) {
            Score.newScore.winner = Turn.checkTurn.symbol;
            doDisplayWinner();
        }
    }
}

const getCombos = () => {
    let fullSequence = Turn.checkTurn.currentSequence.sort();    
    let fullSequenceIdxLength = Turn.checkTurn.currentSequence.length;
    runSequence(1, 2, fullSequenceIdxLength, fullSequence);
}

const runSequence = (m, t, seqLen, seq) => {
    headIdx = 0;
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
    if(!Turn.checkTurn.gameover) {
        let winBoxes = [];
        let gridParent = document.getElementById('playboard');
        let wonBoxes = Turn.checkTurn.winningBoxes[0].split(',');
        for(let i = 0;i <= wonBoxes.length - 1;i++) {
            winBoxes.push(gridParent.children[Number(wonBoxes[i]) - 1]);            
        }
        for(let eachBox in winBoxes) {
            winBoxes[eachBox].style.backgroundColor = 'yellow';
        }
        $("body").append(`<p class="winner">Player ${Turn.checkTurn.symbol} Wins!</p>`);
        $('.winner').append(`<button id = 'btnRestart'>New Game?</button>`);
    }
    Turn.checkTurn.gameover = true;
    

    let playedTiles = document.querySelectorAll('.played');    
    let playedTileArr = [];
    for(let i = 0;i < playedTiles.length;i++) {
        playedTileArr.push(playedTiles[i])
    }
    $('#btnRestart').on('click', () => {    
        Turn.checkTurn.gameover = false;        
        $('.winner').remove();
        Turn.checkTurn.counter = 0;
        Turn.checkTurn.turnX = true;
        Turn.checkTurn.turnO = false;
        Turn.checkTurn.symbol = "X";
        Turn.checkTurn.possibleWinner = false;
        Turn.checkTurn.currentSequence = null;
        Turn.checkTurn.possibleWinningPlayer = null;
        Turn.checkTurn.sequenceGroup = [];
        Score.newScore.xScore = [];
        Score.newScore.oScore = [];
        Score.newScore.winner = null;
        Turn.checkTurn.winningBoxes = [];
        ScoreDiff.newDiff.xDiff = [];
        ScoreDiff.newDiff.oDiff = [];
        CallCounter.checkWinCounter.countNumber = 0;
        $('.grid').children().remove();
        doGrid();
    });
}

const clearBoard = (tiles) => {
    
    //$('#toeGameContainer').append(Board.initial.elem);
    

}

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