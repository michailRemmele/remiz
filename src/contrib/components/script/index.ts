import { Component } from '../../../engine/component';

export interface ScriptConfig extends Record<string, unknown> {
  name: string
  options: Record<string, unknown>
}

export class ScriptComponent extends Component {
  name: string;
  options: Record<string, unknown>;

  constructor(componentName: string, config: Record<string, unknown>) {
    super(componentName);

    const scriptConfig = config as ScriptConfig;

    this.name = scriptConfig.name;
    this.options = { ...scriptConfig.options };
  }

  clone(): ScriptComponent {
    return new ScriptComponent(this.componentName, {
      name: this.name,
      options: this.options,
    });
  }
}
