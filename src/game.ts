import {checkArrayIsNotEmpty, checkArraySizeIsMax, checkIsAssigned, checkIsPositive, PositiveNumber} from './shared';

const numberOfColumns = 10;
const numberOfRows = 10;
const maxFoodItems = 10;
const maxObstacles = 10;

export class Game {
    private grid: Grid;
    public constructor(private readonly gameSettings: GameSettings) {
        this.grid = new Grid(
            new Character(newCell(5, 5)),
            [],
            []);
        
        checkIsAssigned(gameSettings);
    }

    public takeInput(input: Input) : Output {
        checkIsAssigned(this.grid);
        return this.grid.takeInput(input);
    }

    public loadSnapshot(snapshot: GameSnapshot) {
        const character = new Character(new Cell(snapshot.characterCell.coordinates));
        const foodItems = snapshot.foodItemsCells.map(cell => new Food(cell));
        const obstacles = snapshot.obstaclesCells.map(cell => new Obstacle(cell));
        this.grid = new Grid(character, foodItems, obstacles);
    }

    public getSnapshot(): GameSnapshot {
        const characterCell = new Cell(this.grid.character.cell.coordinates);
        const foodItemsCells = this.grid.foodItems.map(food => new Cell(food.cell.coordinates));
        const obstaclesCells = this.grid.obstacles.map(obstacle => new Cell(obstacle.cell.coordinates));
        return new GameSnapshot(characterCell, foodItemsCells, obstaclesCells);
    }

    public areThereFoodItemsLeft(): boolean {
        return this.grid.foodItems.length !== 0;
    }

    public getCharachterPosition(): number[] {
        return [this.grid.character.cell.coordinates.x.value, this.grid.character.cell.coordinates.y.value];
    }

    public isThereAFoodItemOnPosition(x: number, y: number): boolean {
        return this.grid.foodItems.filter(foodItem => {
            const coordinates = foodItem.cell.coordinates;
            return coordinates.x.value === x && coordinates.y.value === y;
        }).length !== 0;
    }

    public isThereAnObstacleOnPosition(x: number, y: number): boolean {
        return this.grid.obstacles.filter(obstacle => {
            const coordinates = obstacle.cell.coordinates;
            return coordinates.x.value === x && coordinates.y.value === y;
        }).length !== 0;
    }

    public isThereABoundaryOnPosition(x: number, y: number): boolean {
        return x < 0
            || x >= numberOfRows
            || y < 0
            || y >= numberOfColumns;
    }
}

export class GameSettings {
    public constructor(public readonly numberOfFoodItems: Setting,
                public readonly numberOfObstacles: Setting) {

        checkIsAssigned(numberOfFoodItems);
        checkIsAssigned(numberOfObstacles);
    }
}

export class GameSnapshot {
    public readonly cells: string[][];
    public constructor(readonly characterCell: Cell,
                readonly foodItemsCells: Cell[],
                readonly obstaclesCells: Cell[]) {

        checkIsAssigned(characterCell);
        checkIsAssigned(foodItemsCells);
        checkIsAssigned(obstaclesCells);

        this.cells = new Array(numberOfColumns);
        for (let i = 0; i < numberOfColumns; i++) {
            this.cells[i] = new Array(numberOfRows);
            for (let j = 0; j < numberOfRows; j++) {
                this.cells[i][j] = 'E';
            }
        }

        for (const foodItemCell of foodItemsCells) {
            this.cells[foodItemCell.coordinates.x.value][foodItemCell.coordinates.y.value] = 'F';
        }

        for (const obstacleCell of obstaclesCells) {
            this.cells[obstacleCell.coordinates.x.value][obstacleCell.coordinates.y.value] = 'O';
        }

        this.cells[characterCell.coordinates.x.value][characterCell.coordinates.y.value] = 'C';
    }
}


class Grid {
    constructor(public character: Character,
                public foodItems: Food[],
                public obstacles: Obstacle[]) {


        checkIsAssigned(character);
        checkIsAssigned(foodItems);
        checkIsAssigned(obstacles);
        checkArraySizeIsMax(foodItems, maxFoodItems);
        checkArraySizeIsMax(obstacles, maxObstacles);
    }

    public takeInput(input: Input): Output {
        let newX = this.character.cell.coordinates.x.value;
        let newY = this.character.cell.coordinates.y.value;
        switch (input) {
            case Input.Right:
                newX += 1;
                break;
            case Input.Left:
                newX -= 1;
                break;
            case Input.Up:
                newY += 1;
                break;
            case Input.Down:
                newY -= 1;
                break;
        }

        if (newX < 0 ||
            newX >= numberOfColumns ||
            newY < 0 ||
            newY >= numberOfRows) {

            return Output.Fail;
        }

        try {
            const newCoordinates = new Coordinates(new PositiveNumber(newX), new PositiveNumber(newY));

            if (this.obstacles.some(obstacle => obstacle.cell.coordinates.x.value === newCoordinates.x.value &&
                obstacle.cell.coordinates.y.value === newCoordinates.y.value)) {
                return Output.Fail;
            }

            this.foodItems = this.foodItems.filter(food => food.cell.coordinates.x.value !== newCoordinates.x.value ||
                food.cell.coordinates.y.value !== newCoordinates.y.value);

            this.character.cell = new Cell(newCoordinates);
            return Output.Ok;
        } catch (error) {
            console.log(error);
            return Output.Error;
        }
    }
}

export enum Input {
    Up = "Up",
    Down = "Down",
    Left = "Left",
    Right = "Right"
}

export enum Output {
    Ok = "Ok",
    Fail = "Fail",
    Error = "Error"
}

class Character {
    constructor(public cell: Cell) {
        checkIsAssigned(cell);
    }
}

class Food {
    constructor(public cell: Cell) {
        checkIsAssigned(cell);
    }
}

class Obstacle {
    constructor(public cell: Cell) {
        checkIsAssigned(cell);
    }
}

class Cell {
    constructor(public readonly coordinates: Coordinates) {
        checkIsAssigned(coordinates);
    }
}

class Coordinates {
    constructor(public readonly x: PositiveNumber, public readonly y: PositiveNumber) {
        checkIsAssigned(x);
        checkIsAssigned(y);
    }
}

export class Setting {
    constructor(public readonly value: number) {
        checkIsPositive(value);
    }
}

const newCell = (x: number, y: number): Cell => {
    return new Cell(new Coordinates(new PositiveNumber(x), new PositiveNumber(y)));
}

interface TestCoordinates {
    x: number,
    y: number
}

interface TestInitialisation {
    character: TestCoordinates;
    foodItems: TestCoordinates[];
    obstacles: TestCoordinates[];
}
export const GameTestData = {
    snapshotWithOneFoodItem: new GameSnapshot(
        newCell(5, 5),
        [newCell(0, 0)],
        []),

    snapshotWithOneFoodItem_customPosition: (x: number, y: number) => {
        return new GameSnapshot(
            newCell(5, 5),
            [newCell(x, y)],
            []);
    },

    snapshotWithCustomInitialisation: (testInitialisation: TestInitialisation) => {
        return new GameSnapshot(
            newCell(testInitialisation.character.x, testInitialisation.character.y),
            testInitialisation.foodItems.map(value => newCell(value.x, value.y)),
            testInitialisation.obstacles.map(value => newCell(value.x, value.y)));
    }
}



