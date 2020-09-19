const prompt = require('prompt-sync')({ sigint: true });

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';
const playerCharacter = '&';

// définition des commandes
const left = 'Q';
const right = 'D';
const up = 'Z';
const down = 'S';

class Field {
    constructor(gameField) {
        this._gameField = gameField;
        this._playerPosition = { x: 0, y: 0 };
    }

    get gameField() {
        return this._gameField;
    }

    static generateField(width = 5, height = 5, difficulty = 30) {
        const newField  = [];

        for (let rowIndex = 0; rowIndex < height; rowIndex++) {
            const row = [];

            for (let tileIndex = 0; tileIndex < width; tileIndex++) {
                let newTile;
                const randomGen = Math.floor(Math.random() * 100);

                if ( randomGen < difficulty ) {
                    newTile = hole;
                } else {
                    newTile = fieldCharacter;
                }

                row.push(newTile);
            }

            newField.push(row);
        }
        const hatRow = Math.floor(Math.random() * (height - 1) + 1);
        const hatCol = Math.floor(Math.random() * (width - 1) + 1);

        newField[hatRow][hatCol] = hat;
        newField[0][0] = playerCharacter;

        return newField;
    }


    renderField() {

        let fieldString = '';
        for (let row of this.gameField) {
            fieldString += row.join('');
            fieldString += '\n';
        }
        console.log(fieldString);
    }

    getDirection() {
        let correctInput = false;

        do {
            const userInput = prompt('Which way ?').toUpperCase();
            if (userInput === left || userInput === right || userInput === up || userInput === down) {
                correctInput = true;
                return userInput;
            } else {
                console.log(`Enter a valid direction !\nUp = ${up} | Down = ${down} | Left = ${left} | Right = ${right}\n`);
            }

        } while (!correctInput);


    }

    move(direction) {
        this.gameField[this._playerPosition.y][this._playerPosition.x] = pathCharacter;
        switch (direction) {
            case left:
                this._playerPosition.x--;
                break;
            case right:
                this._playerPosition.x++;
                break;
            case up:
                this._playerPosition.y--;
                break;
            case down:
                this._playerPosition.y++;
                break;
        }
    }

    isInbound() {
        if (this._playerPosition.x < 0 || this._playerPosition.x >= this.gameField[0].length || this._playerPosition.y < 0 || this._playerPosition.y >= this.gameField.length ) {
            console.log('You got out! You lose...');
            return false;
        }

        return true;
    }

    isOnField() {
        const playerTile = this.gameField[this._playerPosition.y][this._playerPosition.x];
        
        if (playerTile === hole) {
            console.log( 'You fell in a hole ! You lose...' );
            return false;
        }

        return true;
    }

    isOnHat() {
        const playerTile = this.gameField[this._playerPosition.y][this._playerPosition.x];
        
        if (playerTile === hat) {
            console.log('You got your hat ! you win !!!');
            return true;
        }

        return false;
    }

    playGame() {
        let win = false;
        let lose = false;

        while( !win && !lose) {
            console.clear();
            this.renderField();
            const userDirection = this.getDirection();
            this.move(userDirection);

            if (this.isInbound() && this.isOnField()) {
                if (this.isOnHat()) {
                    win = true;
                } else {
                    this.gameField[this._playerPosition.y][this._playerPosition.x] = playerCharacter;
                }
            } else {
                lose = true;
            }

        }
    }

    /*testMovement() {
        console.log(this._playerPosition);

        for (let i = 0; i < 5; i++) {
            // console.clear();
            this.renderField();
            this.move(this.getDirection());
            this.isOnField();
            console.log(this._playerPosition);
        }
    }*/
}
const testField = Field.generateField(7, 7, 35);

const testGame = new Field(testField);

testGame.playGame();