import { Provider, ReflectiveInjector, ResolvedReflectiveProvider } from 'injection-js';
import { MediaController } from './media.controller';
import { MediaRouter } from './media.route';
import { MediaService } from './media.service';
import { Multer, STORAGE_ENGINE } from './multer';
import { diskStorage, ImgurMulterStorageEngine } from './storage';

export const MediaProviders: Provider[] = [MediaService, MediaController, MediaRouter, Multer]
export const StorageProviders: Provider[] = [ImgurMulterStorageEngine, { provide: STORAGE_ENGINE, useValue: diskStorage }]

export const ResolveStorageProviders: ResolvedReflectiveProvider[] = ReflectiveInjector.resolve(StorageProviders);
export const ResolveMediaProviders: ResolvedReflectiveProvider[] = ReflectiveInjector.resolve(MediaProviders);