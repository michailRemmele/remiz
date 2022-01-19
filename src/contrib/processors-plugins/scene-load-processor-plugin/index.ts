import { ProcessorPlugin, ProcessorPluginOptions } from '../../../engine/processor';
import SceneLoadProcessor from '../../processors/sceneLoadProcessor/sceneLoadProcessor';

export class SceneLoadProcessorPlugin implements ProcessorPlugin {
  load(options: ProcessorPluginOptions) {
    const { sceneController, messageBus } = options;

    return new SceneLoadProcessor({
      sceneController,
      messageBus,
    });
  }
}
