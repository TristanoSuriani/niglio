import {Game, GameSettings, GameTestData, Setting} from "../../src/game";
import {Direction, Move, Program} from "../../src/program";
import {Runtime, Termination} from "../../src/runtime";

let game;
let program;
let runtime;

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