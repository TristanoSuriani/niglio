import {Game, Input, Output} from "./game";
import {Condition, ConditionType, Direction, IfThenElse, Move, Program, RepeatUntil, Statement} from "./program";

export class Runtime {
    public constructor(private readonly game: Game, private readonly program: Program) {
    }

    public execute(): Termination {
        if (!this.game.areThereFoodItemsLeft()) {
            return Termination.Success;
        }

        const maybeTermination = this.handleStatements(this.program.statements);
        if (maybeTermination.isPresent()) {
            return maybeTermination.value!;
        }
        return Termination.Failure;
    }

    private handleStatements(statements: Statement[]): MaybeTermination {
        for (let statement of statements) {
            const maybeTermination = this.handleStatement(statement);

            if (maybeTermination.isPresent()) {
                return maybeTermination;
            }

            if (!this.game.areThereFoodItemsLeft()) {
                return new MaybeTermination(Termination.Success);
            }
        }
        return new MaybeTermination();
    }

    private handleStatement(statement: Statement): MaybeTermination {
        if (statement instanceof Move) {
            const move = statement as Move;
            return this.handleMove(move);
        }

        if (statement instanceof IfThenElse) {
            const ifThenElse = statement as IfThenElse;
            return this.handleIfThenElse(ifThenElse);
        }

        if (statement instanceof RepeatUntil) {
            const repeatUntil = statement as RepeatUntil;
            return this.handleRepeatUntil(repeatUntil);
        }
        throw new Error('Unsupported statement type');
    }

    private handleMove(move: Move): MaybeTermination {
        const output = this.giveInput(move.direction);
        switch (output) {
            case Output.Ok: {
                return new MaybeTermination();
            }

            case Output.Fail: {
                return new MaybeTermination(Termination.Crash);
            }

            case Output.Error: {
                return new MaybeTermination(Termination.Error);
            }
        }
    }

    private handleIfThenElse(ifThenElse: IfThenElse): MaybeTermination {

        const condition = ifThenElse.condition;
        const thenStatements = ifThenElse.thenStatements;
        const elseStatements = ifThenElse.elseStatements;

        if (this.conditionIsSatisfied(condition)) {
            const maybeTermination = this.handleStatements(thenStatements);
            if (maybeTermination.isPresent()) {
                return maybeTermination;
            }
        }

        const maybeTermination = this.handleStatements(elseStatements);
        if (maybeTermination.isPresent()) {
            return maybeTermination;
        }
        return new MaybeTermination();
    }

    private handleRepeatUntil(repeatUntil: RepeatUntil): MaybeTermination {

        const condition = repeatUntil.condition;
        const statements = repeatUntil.statements;

        while (!this.conditionIsSatisfied(condition)) {
            const maybeTermination = this.handleStatements(statements);
            if (maybeTermination.isPresent()) {
                return maybeTermination;
            }
        }
        return new MaybeTermination();
    }

    private conditionIsSatisfied(condition: Condition): boolean {
        const position = this.resolveRelativePosition(condition);
        const x = position[0];
        const y = position[1];
        switch (condition.type) {
            case ConditionType.Is_Food: {
                return this.game.isThereAFoodItemOnPosition(x, y);
            }

            case ConditionType.Is_Not_Food: {
                return !this.game.isThereAFoodItemOnPosition(x, y);
            }

            case ConditionType.Is_Obstacle: {
                return this.game.isThereAnObstacleOnPosition(x, y);
            }

            case ConditionType.Is_Not_Obstacle: {
                return !this.game.isThereAnObstacleOnPosition(x, y);
            }

            case ConditionType.Is_Boundary: {
                return this.game.isThereABoundaryOnPosition(x, y);
            }

            case ConditionType.Is_Not_Boundary: {
                return !this.game.isThereABoundaryOnPosition(x, y);
            }
        }
    }

    private resolveRelativePosition(condition: Condition): number[] {
        const direction = condition.direction;
        const charachterPosition = this.game.getCharachterPosition();
        const x = charachterPosition[0];
        const y = charachterPosition[1];
        switch (direction) {
            case Direction.Up: {
                return [x, y + 1];
            }

            case Direction.Down: {
                return [x, y - 1];
            }

            case Direction.Left: {
                return [x - 1, y];
            }

            case Direction.Right: {
                return [x + 1, y];
            }
        }
    }


    private giveInput(direction: Direction): Output {
        switch(direction) {
            case Direction.Up: {
                return this.game.takeInput(Input.Up);
            }

            case Direction.Down: {
                return this.game.takeInput(Input.Down);
            }

            case Direction.Right: {
                return this.game.takeInput(Input.Right);
            }

            case Direction.Left: {
                return this.game.takeInput(Input.Left);
            }
        }
    }
}

export enum Termination {
    Success = "Success",
    Failure = "Failure",
    Crash = "Crash",
    Error = "Error"
}

export class MaybeTermination {
    constructor(readonly value?: Termination) {
    }

    isPresent(): boolean {
        return this.value != null;
    }
}