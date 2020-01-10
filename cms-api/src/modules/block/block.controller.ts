
import { Model } from 'mongoose';
import { Block, IBlockModel } from './block.model';
import { ContentCtrl } from '../content';

export class BlockCtrl extends ContentCtrl<IBlockModel> {
    constructor() { super(Block); }
}