import { Provider } from 'injection-js';
import { EventProvider, NodeEventEmitterProvider } from './event.provider';

const EventInjectorProviders: Provider[] = [{ provide: EventProvider, useClass: NodeEventEmitterProvider }]
export { EventProvider, EventInjectorProviders };