import { PlElement, html, css } from 'polylib';
import '@plcmp/pl-input';
import '@plcmp/pl-button';
import '@plcmp/pl-data-observer';

class PlDocObjectEditor extends PlElement {
  static properties = { record: { type: Object } };

  static css = css`
    :host { display: block; }
  `;

  static template = html`
    <pl-input id="nameInput" label="Имя в дочернем компоненте"
      value="{{record.name}}" stretch></pl-input>
  `;
}

customElements.define('pl-doc-object-editor', PlDocObjectEditor);

class PlDocObjectBindingsDemo extends PlElement {
  static properties = {
    oneProfile: { type: Object, value: () => ({ name: 'Анна' }) },
    twoProfile: { type: Object, value: () => ({ name: 'Анна' }) },
    oneChanged: { type: Boolean, value: false },
    twoChanged: { type: Boolean, value: false },
    oneInspection: { type: String, value: 'Модель ещё не прочитана.' },
    twoInspection: { type: String, value: 'Модель ещё не прочитана.' }
  };

  _parentEdit = 0;

  static css = css`
    :host { display: grid; gap: var(--pl-space-lg); }
    .comparison { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--pl-space-lg); }
    section { display: grid; align-content: start; gap: var(--pl-space-md); min-width: 0; padding: var(--pl-space-md); border: 1px solid var(--pl-grey-light); border-radius: var(--pl-border-radius); }
    h3 { margin: 0; font: var(--pl-text-font); font-weight: 600; }
    p, output { margin: 0; font: var(--pl-text-font); line-height: 1.6; overflow-wrap: anywhere; }
    .actions { display: flex; flex-wrap: wrap; gap: var(--pl-space-sm); }
    @media (max-width: 700px) { .comparison { grid-template-columns: 1fr; } }
  `;

  static template = html`
    <div class="comparison">
      <section>
        <h3>Односторонняя связь</h3>
        <pl-data-observer id="oneWatch" data="{{oneProfile}}" is-changed="{{oneChanged}}"></pl-data-observer>
        <pl-doc-object-editor id="oneEditor" record="[[oneProfile]]"></pl-doc-object-editor>
        <p>Имя в шаблоне родителя: <strong id="oneRendered">[[oneProfile.name]]</strong></p>
        <p id="oneStatus">[[changeStatus(oneChanged)]]</p>
        <div class="actions">
          <pl-button label="Прочитать модель" on-click="[[readOne]]"></pl-button>
          <pl-button label="Изменить у родителя" on-click="[[changeOne]]"></pl-button>
        </div>
        <output id="oneInspection" aria-live="polite">[[oneInspection]]</output>
      </section>
      <section>
        <h3>Двусторонняя связь</h3>
        <pl-data-observer id="twoWatch" data="{{twoProfile}}" is-changed="{{twoChanged}}"></pl-data-observer>
        <pl-doc-object-editor id="twoEditor" record="{{twoProfile}}"></pl-doc-object-editor>
        <p>Имя в шаблоне родителя: <strong id="twoRendered">[[twoProfile.name]]</strong></p>
        <p id="twoStatus">[[changeStatus(twoChanged)]]</p>
        <div class="actions">
          <pl-button label="Прочитать модель" on-click="[[readTwo]]"></pl-button>
          <pl-button label="Изменить у родителя" on-click="[[changeTwo]]"></pl-button>
        </div>
        <output id="twoInspection" aria-live="polite">[[twoInspection]]</output>
      </section>
    </div>
    <div class="actions"><pl-button label="Сбросить пример" on-click="[[resetExample]]"></pl-button></div>
  `;

  connectedCallback() {
    super.connectedCallback();
    this.takeSnapshots();
  }

  changeStatus(changed) {
    return changed ? 'pl-data-observer: есть изменения' : 'pl-data-observer: изменений нет';
  }

  readOne() {
    this.oneInspection = `Значение из модели родителя: ${this.oneProfile.name}.`;
  }

  readTwo() {
    this.twoInspection = `Значение из модели родителя: ${this.twoProfile.name}.`;
  }

  changeOne() {
    this.set('oneProfile.name', `Имя от родителя ${++this._parentEdit}`);
  }

  changeTwo() {
    this.set('twoProfile.name', `Имя от родителя ${++this._parentEdit}`);
  }

  takeSnapshots() {
    this.$.oneWatch.snapshot();
    this.$.twoWatch.snapshot();
  }

  resetExample() {
    this.oneProfile = { name: 'Анна' };
    this.twoProfile = { name: 'Анна' };
    this.oneInspection = 'Модель ещё не прочитана.';
    this.twoInspection = 'Модель ещё не прочитана.';
    this._parentEdit = 0;
    this.takeSnapshots();
  }
}

customElements.define('pl-doc-object-bindings-demo', PlDocObjectBindingsDemo);
