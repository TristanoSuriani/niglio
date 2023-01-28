import {checkArrayIsNotEmpty, checkIsAssigned} from "./shared";

export class Program {
    public constructor(public readonly statements: Statement[]) {
        checkIsAssigned(statements);
    }
}

export interface Statement {}

export class Move implements Statement {
    constructor(public direction: Direction) {
        checkIsAssigned(direction);
    }
}

export class IfThenElse implements Statement {
    constructor(public readonly condition: Condition,
                public readonly thenStatement: Statement,
                public readonly elseStatement?: Statement) {

        checkIsAssigned(condition);
        checkIsAssigned(thenStatement);
    }
}

export class RepeatUntil implements Statement {
    constructor(public readonly condition: Condition,
                public readonly statements: Statement[]) {

        checkIsAssigned(condition);
        checkIsAssigned(statements);
        checkArrayIsNotEmpty(statements);
    }
}

export class Condition {
    constructor(public readonly direction: Direction, public readonly conditionType: ConditionType) {
        checkIsAssigned(direction);
        checkIsAssigned(conditionType);
    }
}

export enum ConditionType {
    Is_Food = "Is food",
    Is_Obstacle = "Is obstacle",
    Is_Wall = "Is wall",
    Is_Not_Food = "Is not food",
    Is_Not_Obstacle = "Is not obstacle",
    Is_Not_Wall = "Is not wall"
}

export enum Direction {
    Up = "Up",
    Down = "Down",
    Left = "Left",
    Right = "Right"
}