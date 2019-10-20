import EffectApplicator from './effectApplicator';

class ContinuousEffectApplicator extends EffectApplicator {
  constructor(effect, options) {
    super();

    this._effect = effect;
    this._duration = options.duration;

    this._isApplied = false;
    this._isFinished = false;
  }

  update(deltaTime) {
    if (this._isFinished) {
      return;
    }

    this._duration -= deltaTime;

    if (this._duration <= 0) {
      this._effect.onCancel();
      this._isFinished = true;
      return;
    }

    if (this._isApplied) {
      return;
    }

    this._effect.apply();
    this._isApplied = true;
  }

  cancel() {
    this._effect.onCancel();
  }

  isFinished() {
    return this._isFinished;
  }
}

export default ContinuousEffectApplicator;
