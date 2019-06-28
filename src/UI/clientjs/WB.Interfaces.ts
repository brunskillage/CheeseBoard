/// <reference path="wb.common.ts" />

interface IStorage {
    saveboard(boardData: any): void;
    get_boards(): any;
}