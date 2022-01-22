import { ProcessorPlugin, ProcessorPluginOptions } from '../../../engine/processor';
import MouseInputCoordinatesProjector
  from '../../processors/mouseInputCoordinatesProjector/mouseInputCoordinatesProjector';

export class MouseInputCoordinatesProjectorPlugin implements ProcessorPlugin {
  load(options: ProcessorPluginOptions) {
    const {
      store,
      messageBus,
    } = options;

    return new MouseInputCoordinatesProjector({
      store,
      messageBus,
    });
  }
}
