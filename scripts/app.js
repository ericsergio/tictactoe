const localRowHeight = `${(window.outerHeight * .90) / 4}px ${(window.outerHeight * .90) / 4}px ${(window.outerHeight * .90) / 4}px`;
const localGapVal = `${screen.height * .05}px`;
const winningCombos = [[1,2,3], [4,5,6], [7,8,9], [1,4,7], [2,5,8], [3,6,9], [1,5,9], [3,5,7]];
//const columns = [[1,4,7], [2,5,8], [3,6,9]];
const rows = [[1,2,3],[4,5,6],[7,8,9]];


function Score(xScore, oScore, winner) {
    this.xScore = [].sort();
    this.oScore = [].sort();
    this.winner = winner || null;
}

function ScoreDiff(xDiff, oDiff, possibleWin) {
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

function Turn(counter, turnX, turnO, symbol, possibleWinner, currentSequence, possibleWinningPlayer) {
    this.possibleWinner = possibleWinner || false;
    this.counter = counter || 0;
    this.turnX = turnX || false;
    this.turnO = turnO || false;
    this.symbol = symbol;
    this.playerX = "X";
    this.playerO = "O";
    this.currentSequence = currentSequence || null;
    this.possibleWinningPlayer = possibleWinningPlayer || null;
}

Turn.checkTurn = new Turn(0, true);

Turn.prototype.newTurn = function() {
    Turn.checkTurn.counter++;
    if(Turn.checkTurn.counter >= 4) {
        $('.grid').children().attr('id', '').each(function() {
            $(this).on("click", function() {
                //this will pass the currently played box to checkWin as a jquery object in case that is useful
                /*console.log($(this)[0]);*/
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
    //console.log(`(${Turn.checkTurn.symbol}) Turn counter : ${Turn.checkTurn.counter}:\n\n\n____________________`);
}

$(document).ready(function () {    
    var scGapStr = localGapVal;
    var scHeightStr = localRowHeight;
    $('.grid').css({gridTemplateRows:scHeightStr,gridRowGap:scGapStr, gridColumnGap:scGapStr});
    $('div').children().on("click", function(){
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


function doSelected(idx) {
    var currentIdx = idx;
    CallCounter.doSelectedCounter.countNumber += 1;
    //console.log(`CallCounter.doSelectedCounter.countNumber: ${CallCounter.doSelectedCounter.countNumber}`);
    if($('div.selected').siblings().hasClass('selected') && $('div.selected').attr('id') == String(idx)) {
        $('div.selected').siblings().removeClass('selected')
    }
    $('div.selected').attr('id', 'box' + idx);
    $('div.selected').append("<h1 class = 'played'>" + Turn.checkTurn.symbol + "</h1>");
    
    if (Turn.checkTurn.symbol === "X") {
        $('div.selected').addClass('x');
    } else {
        $('div.selected').addClass('o');
    }
}

//the last played square is set up and is being passed as a jquery object but isn't currently being used because I am using a different way to keep track of the 
//sequence but this is just reminding you that it is available via the new turn prototype... Also it does have the non-zero based index in the id.
function checkWin(/*lastPlayed*/) {
    ScoreDiff.newDiff.xDiff = [];                       //resets x's difference array each turn
    ScoreDiff.newDiff.oDiff = [];                       //resets o's difference array each turn
    CallCounter.checkWinCounter.countNumber += 1;       //will probably remove this, used for debugging.
    let xEndIdx = Score.newScore.xScore.length - 2;     //used to iterate through difference array for player x - diff array is shorter than played square array by 1
    let oEndIdx = Score.newScore.oScore.length - 2;     //used to iterate through difference array for player o - diff array is shorter than played square array by 1
    console.log(`Score.newScore.xScore: ${Score.newScore.xScore}\nScore.newScore.xScore.length - 2: ${Score.newScore.xScore.length - 2}`)


//----------------------------------------------------------------Turn X------------------------------------------------------------    
    if(Turn.checkTurn.turnX) {
        Score.newScore.xScore = Score.newScore.xScore.sort();           //sorts x's played square array to get accurate differences between sequential played squares
        for(let i = 0; i <= xEndIdx; i++) {
            let next = i + 1;                                           //checking for the winner works by checking for correct differences between played squares. 
                                                                        //i.e. if a player plays the top three squares then they played squares 1,2, and 3 which will 
                                                                        //result in the values of 1,1 as an array inside the two dimensional difference array(the diff 
                                                                        //between 1 and 2 = 1, as well as the diff between 2 and 3 = 1)
            let diff = Score.newScore.xScore[next] - Score.newScore.xScore[i];
            Turn.checkTurn.currentSequence = Score.newScore.xScore;     //the current sequence property toggles between player x and o's current array of played squares
            if(diff > 0) {
                ScoreDiff.newDiff.xDiff.push(diff);
            }
        }
        let xDiffArr = ScoreDiff.newDiff.xDiff;               
        for(let xDiffIdx = 0;xDiffIdx <= xDiffArr.length;xDiffIdx++) {  //iterate through the diff array for player x            
            if(xDiffArr[xDiffIdx] === xDiffArr[xDiffIdx + 1]) {         //check whether there is a group of 2 consecutive differences that are equal
                for(let winCombo in winningCombos) {                    /*there are some combinations in which 2 consecutive differences are equal yet is not a  
                                                                        winning pattern so check against the constant array of winning squares to eliminate these*/
                    if(String(Turn.checkTurn.currentSequence) === String(winningCombos[winCombo])) {
                        Turn.checkTurn.possibleWinner = true;                               //I will be able to remove this **********
                        Turn.checkTurn.possibleWinningPlayer = Turn.checkTurn.playerX;      //I will be able to remove this **********
                    }
                }
            } else {
                Turn.checkTurn.possibleWinner = false;                  //If there are not 2 matching differences then the game should not end
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
                Turn.checkTurn.possibleWinner = true;
                Turn.checkTurn.possibleWinningPlayer = Turn.checkTurn.playerO;
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







function verifyWinner(sequenceToVerify) {
    let match = false;
    for(let arr of winningCombos) {
        if(arr.toString() === sequenceToVerify.toString())  {
            match = true;
        }
    }
    return true;
}

function doDisplayWinner() {
    $.each(Turn.checkTurn.currentSequence, function(){
        $('.grid').children(`div:eq(${this - 1})`).css('backgroundColor', 'yellow');
    })
}