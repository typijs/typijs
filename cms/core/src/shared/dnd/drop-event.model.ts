export class DropEvent {
    nativeEvent: any;
    dragData: any;
    index: number;

    constructor(event: any, data: any, index: number) {
        this.nativeEvent = event;
        this.dragData = data;
        this.index = index;
    }
}