import {Game, Input, Output} from "./game";
import {Direction, Move, Program, Statement} from "./program";

export class Runtime {
    public constructor(private readonly game: Game, private readonly program: Program) {
    }

    public execute(): Termination {
        if (!this.game.areThereFoodItemsLeft()) {
            return Termination.Success;
        }

        for (let statement of this.program.statements) {
            const maybeTermination = this.handleStatement(statement);

            if (maybeTermination.isPresent()) {
                return maybeTermination.value!;
            }

            if (!this.game.areThereFoodItemsLeft()) {
                return Termination.Success;
            }
        }

        return Termination.Failure;
    }

    private handleStatement(statement: Statement): MaybeTermination {
        const move = statement as Move;
        return this.handleMove(move);
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