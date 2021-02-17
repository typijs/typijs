export enum CmsWidgetPosition {
    Top,
    Left,
    Right
}

export type CmsComponentConfig = {
    component: any,
    group?: string
    order: number,
    position: CmsWidgetPosition,
    isSplit?: boolean
};
