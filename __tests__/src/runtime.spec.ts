import {Game, GameSettings, GameTestData, Setting} from "../../src/game";
import {Condition, ConditionType, Direction, IfThenElse, Move, Program, RepeatUntil} from "../../src/program";
import {Runtime, Termination} from "../../src/runtime";

describe('Empty program', () => {
    it('No food items initiated (no shapshot loaded), 0 food items in settings -> succes', () => {
        const settings = givenSettings(0, 0);
        const game = new Game(settings);
        const program = new Program([]);
        const runtime = new Runtime(game, program);

        const termination = runtime.execute();

        expect(termination).toBe(Termination.Success);
    });

    it('No food items initiated (no shapshot loaded), 1 food item in settings -> succes', () => {
        const settings = givenSettings(1, 0);
        const game = new Game(settings);
        const program = new Program([]);
        const runtime = new Runtime(game, program);

        const termination = runtime.execute();

        expect(termination).toBe(Termination.Success);
    });

    it('Snapshot loaded with 1 food item, 1 food item in settings -> failure', () => {
        const settings = givenSettings(1, 0);
        const snapshot = GameTestData.snapshotWithOneFoodItem;
        const game = new Game(settings);
        const program = new Program([]);
        const runtime = new Runtime(game, program);

        game.loadSnapshot(snapshot);
        const termination = runtime.execute();

        expect(termination).toBe(Termination.Failure);
    });
});

describe('Non-empty program, only moves, no obstacles', () => {
    it('No food items initiated (no shapshot loaded), 0 food items in settings -> succes', () => {
        const settings = givenSettings(0, 0);
        const game = new Game(settings);
        const program = new Program([new Move(Direction.Right)]);
        const runtime = new Runtime(game, program);

        const termination = runtime.execute();

        expect(termination).toBe(Termination.Success);
    });

    it('No food items initiated (no shapshot loaded), 1 food item in settings -> succes', () => {
        const settings = givenSettings(1, 0);
        const game = new Game(settings);
        const program = new Program([new Move(Direction.Right)]);
        const runtime = new Runtime(game, program);

        const termination = runtime.execute();

        expect(termination).toBe(Termination.Success);
    });

    it('Snapshot loaded with 1 food item, 1 food item in settings, 1 food item after program execution -> failure', () => {
        const settings = givenSettings(1, 0);
        const snapshot = GameTestData.snapshotWithOneFoodItem_customPosition(6, 5);
        const game = new Game(settings);
        const program = new Program([new Move(Direction.Up)]);
        const runtime = new Runtime(game, program);

        game.loadSnapshot(snapshot);
        const termination = runtime.execute();

        expect(termination).toBe(Termination.Failure);
    });

    it('Snapshot loaded with 1 food item, 1 food item in settings, 0 food items after moving to the right matching the food item -> success', () => {
        const settings = givenSettings(1, 0);
        const snapshot = GameTestData.snapshotWithOneFoodItem_customPosition(6, 5);
        const game = new Game(settings);
        const program = new Program([new Move(Direction.Right)]);
        const runtime = new Runtime(game, program);

        game.loadSnapshot(snapshot);
        const termination = runtime.execute();

        expect(termination).toBe(Termination.Success);
    });

    it('Snapshot loaded with 1 food item, 1 food item in settings, 0 food items after moving to the left matching the food item -> success', () => {
        const settings = givenSettings(1, 0);
        const snapshot = GameTestData.snapshotWithOneFoodItem_customPosition(4, 5);
        const game = new Game(settings);
        const program = new Program([new Move(Direction.Left)]);
        const runtime = new Runtime(game, program);

        game.loadSnapshot(snapshot);
        const termination = runtime.execute();

        expect(termination).toBe(Termination.Success);
    });

    it('Snapshot loaded with 1 food item, 1 food item in settings, 0 food items after moving up matching the food item -> success', () => {
        const settings = givenSettings(1, 0);
        const snapshot = GameTestData.snapshotWithOneFoodItem_customPosition(5, 6);
        const game = new Game(settings);
        const program = new Program([new Move(Direction.Up)]);
        const runtime = new Runtime(game, program);

        game.loadSnapshot(snapshot);
        const termination = runtime.execute();

        expect(termination).toBe(Termination.Success);
    });

    it('Snapshot loaded with 1 food item, 1 food item in settings, 0 food items after moving down matching the food item -> success', () => {
        const settings = givenSettings(1, 0);
        const snapshot = GameTestData.snapshotWithOneFoodItem_customPosition(5, 4);
        const game = new Game(settings);
        const program = new Program([new Move(Direction.Down)]);
        const runtime = new Runtime(game, program);

        game.loadSnapshot(snapshot);
        const termination = runtime.execute();

        expect(termination).toBe(Termination.Success);
    });

    it('Snapshot loaded with 1 food item, 1 food item in settings, 0 food items after moving down 2 times matching the food item -> success', () => {
        const settings = givenSettings(1, 0);
        const snapshot = GameTestData.snapshotWithOneFoodItem_customPosition(5, 3);
        const game = new Game(settings);
        const program = new Program([
            new Move(Direction.Down),
            new Move(Direction.Down)
        ]);
        const runtime = new Runtime(game, program);

        game.loadSnapshot(snapshot);
        const termination = runtime.execute();

        expect(termination).toBe(Termination.Success);
    });

    it('Snapshot loaded with 1 food item, 1 food item in settings, 0 food items after moving down and then right matching the food item -> success', () => {
        const settings = givenSettings(1, 0);
        const snapshot = GameTestData.snapshotWithOneFoodItem_customPosition(6, 4);
        const game = new Game(settings);
        const program = new Program([
            new Move(Direction.Down),
            new Move(Direction.Right)
        ]);
        const runtime = new Runtime(game, program);

        game.loadSnapshot(snapshot);
        const termination = runtime.execute();

        expect(termination).toBe(Termination.Success);
    });

    it('Snapshot loaded with 2 food items, 2 food items in settings, 0 food items after moving down and then right matching the food items -> success', () => {
        const settings = givenSettings(2, 0);
        const snapshot = GameTestData.snapshotWithCustomInitialisation({
            character: { x: 5, y: 5 },
            foodItems: [{ x: 5, y: 4 }, { x: 6, y: 4 }],
            obstacles: []
        });
        const game = new Game(settings);
        const program = new Program([
            new Move(Direction.Down),
            new Move(Direction.Right)
        ]);
        const runtime = new Runtime(game, program);

        game.loadSnapshot(snapshot);
        const termination = runtime.execute();

        expect(termination).toBe(Termination.Success);
    });
});

describe('Non-empty program, only moves, crashing', () => {
    it('Snapshot loaded with 1 food item, 1 food item in settings, crashing against obstacle when moving to the right -> crash', () => {
        const settings = givenSettings(1, 1);
        const snapshot = GameTestData.snapshotWithCustomInitialisation({
            character: {x: 5, y: 5},
            foodItems: [{x: 5, y: 4}],
            obstacles: [{x: 6, y: 5}]
        });
        const game = new Game(settings);
        const program = new Program([new Move(Direction.Right)]);
        const runtime = new Runtime(game, program);

        game.loadSnapshot(snapshot);
        const termination = runtime.execute();

        expect(termination).toBe(Termination.Crash);
    });

    it('Snapshot loaded with 1 food item, character located in upper left corner, go up against the wall -> crash', () => {
        const settings = givenSettings(1, 0);
        const snapshot = GameTestData.snapshotWithCustomInitialisation({
            character: {x: 0, y: 9},
            foodItems: [{x: 5, y: 4}],
            obstacles: []
        });
        const game = new Game(settings);
        const program = new Program([new Move(Direction.Up)]);
        const runtime = new Runtime(game, program);

        game.loadSnapshot(snapshot);
        const termination = runtime.execute();

        expect(termination).toBe(Termination.Crash);
    });

    it('Snapshot loaded with 1 food item, character located in upper left corner, go left against the wall -> crash', () => {
        const settings = givenSettings(1, 0);
        const snapshot = GameTestData.snapshotWithCustomInitialisation({
            character: {x: 0, y: 9},
            foodItems: [{x: 5, y: 4}],
            obstacles: []
        });
        const game = new Game(settings);
        const program = new Program([new Move(Direction.Left)]);
        const runtime = new Runtime(game, program);

        game.loadSnapshot(snapshot);
        const termination = runtime.execute();

        expect(termination).toBe(Termination.Crash);
    });

    it('Snapshot loaded with 1 food item, character located in bottom right corner, go right against the wall -> crash', () => {
        const settings = givenSettings(1, 0);
        const snapshot = GameTestData.snapshotWithCustomInitialisation({
            character: {x: 9, y: 0},
            foodItems: [{x: 5, y: 4}],
            obstacles: []
        });
        const game = new Game(settings);
        const program = new Program([new Move(Direction.Right)]);
        const runtime = new Runtime(game, program);

        game.loadSnapshot(snapshot);
        const termination = runtime.execute();

        expect(termination).toBe(Termination.Crash);
    });

    it('Snapshot loaded with 1 food item, character located in bottom right corner, go down against the wall -> crash', () => {
        const settings = givenSettings(1, 0);
        const snapshot = GameTestData.snapshotWithCustomInitialisation({
            character: {x: 9, y: 0},
            foodItems: [{x: 5, y: 4}],
            obstacles: []
        });
        const game = new Game(settings);
        const program = new Program([new Move(Direction.Down)]);
        const runtime = new Runtime(game, program);

        game.loadSnapshot(snapshot);
        const termination = runtime.execute();

        expect(termination).toBe(Termination.Crash);
    });
});

describe('Non-empty program, moves and ifs', () => {
    it('Snapshot loaded with 2 food items located one at the left of the character and one above the other one, move left and if up is food then move up -> success', () => {
        /*
               0 1 2 3 4 5 6 7 8 9
            9 | | | | | | | | | | |
            8 | | | | | | | | | | |
            7 | | | | | | | | | | |
            6 | | | | |F| | | | | |
            5 | | | | |F|C| | | | |
            4 | | | | | | | | | | |
            3 | | | | | | | | | | |
            2 | | | | | | | | | | |
            1 | | | | | | | | | | |
            0 | | | | | | | | | | |
         */

        const settings = givenSettings(1, 0);
        const snapshot = GameTestData.snapshotWithCustomInitialisation({
            character: {x: 5, y: 5},
            foodItems: [{x: 4, y: 5}, {x: 4, y: 6}],
            obstacles: []
        });
        const game = new Game(settings);
        const program = new Program([
            new Move(Direction.Left),
            new IfThenElse(new Condition(Direction.Up, ConditionType.Is_Food),
                [new Move(Direction.Up)],
                [])
        ]);
        const runtime = new Runtime(game, program);

        game.loadSnapshot(snapshot);
        const termination = runtime.execute();

        expect(termination).toBe(Termination.Success);
    });
});

describe('Non-empty program, moves and repeatUntil', () => {
    it('Snapshot loaded with 1 food item located on bottom left corner, character located in bottom right corner, repeat move left until left is food -> success', () => {
        /*
               0 1 2 3 4 5 6 7 8 9
            9 | | | | | | | | | | |
            8 | | | | | | | | | | |
            7 | | | | | | | | | | |
            6 | | | | | | | | | | |
            5 | | | | | | | | | | |
            4 | | | | | | | | | | |
            3 | | | | | | | | | | |
            2 | | | | | | | | | | |
            1 | | | | | | | | | | |
            0 |F| | | | | | | | |C|
         */
        const settings = givenSettings(1, 0);
        const snapshot = GameTestData.snapshotWithCustomInitialisation({
            character: {x: 9, y: 0},
            foodItems: [{x: 0, y: 0}],
            obstacles: []
        });
        const game = new Game(settings);
        const program = new Program([
            new RepeatUntil(new Condition(Direction.Left, ConditionType.Is_Food),
                [
                    new Move(Direction.Left)
                ]),
            new Move(Direction.Left)
        ]);
        const runtime = new Runtime(game, program);

        game.loadSnapshot(snapshot);
        const termination = runtime.execute();

        expect(termination).toBe(Termination.Success);
    });

    it('Snapshot loaded with 1 food item located on upper left corner, character located in bottom right corner, repeat left and up until left is food -> success', () => {
        /*
               0 1 2 3 4 5 6 7 8 9
            9 |F| | | | | | | | | |
            8 | | | | | | | | | | |
            7 | | | | | | | | | | |
            6 | | | | | | | | | | |
            5 | | | | | | | | | | |
            4 | | | | | | | | | | |
            3 | | | | | | | | | | |
            2 | | | | | | | | | | |
            1 | | | | | | | | | | |
            0 | | | | | | | | | |C|
         */

        const settings = givenSettings(1, 0);
        const snapshot = GameTestData.snapshotWithCustomInitialisation({
            character: {x: 9, y: 0},
            foodItems: [{x: 0, y: 9}],
            obstacles: []
        });
        const game = new Game(settings);
        const program = new Program([
            new RepeatUntil(new Condition(Direction.Left, ConditionType.Is_Food),
                [
                            new IfThenElse(new Condition(Direction.Up, ConditionType.Is_Not_Boundary),
                                [new Move(Direction.Up)],
                                []),
                            new Move(Direction.Left)
                ]),
            new Move(Direction.Left)
        ]);
        const runtime = new Runtime(game, program);

        game.loadSnapshot(snapshot);
        const termination = runtime.execute();

        expect(termination).toBe(Termination.Success);
    });
});

const givenSettings = (nFoodItems: number, nObstacles: number): GameSettings => {
    return new GameSettings(givenNumberOfFoodItemsSetting(nFoodItems),
                            givenNumberOfObstaclesSetting(nObstacles));
}

const givenNumberOfFoodItemsSetting = (n: number): Setting => {
    return new Setting(n);
}

const givenNumberOfObstaclesSetting = (n: number): Setting => {
    return new Setting(n);
}
