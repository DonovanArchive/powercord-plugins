const { React } = require('powercord/webpack');
const { TextInput } = require('powercord/components/settings');

module.exports = class PastebinSettings extends React.Component {
  constructor (props) {
    super();

    this.settings = props.settings;
    this.state = {
      pasteDevKey: props.settings.get('pasteDevKey', ''),
      pasteUserKey: props.settings.get('pasteUserKey', ''),
      pasteOption: props.settings.get('pasteOption', 'paste'),
      pastePrivacy: props.settings.get('pastePrivacy', 1),
      pasteTitle: props.settings.get('pasteTitle', 'Discord'),
      pasteExpiryDate: props.settings.get('pasteExpiryDate', 'N')
    };
  }

  render () {
    const settings = this.state;

    const set = (key, value = !settings[key], defaultValue) => {
      if (!value && defaultValue) {
        value = defaultValue;
      }

      this.settings.set(key, value);
      this.setState({
        [key]: value
      });
    };

    return (
      <div>
        <TextInput note='The post url used for pastebin' defaultValue={settings.postURL} required={true} onChange={val => set('postURL', val)}>
          Post API URL
        </TextInput>
        <TextInput note='The dev key used for pastebin' defaultValue={settings.pasteDevKey} required={true} onChange={val => set('pasteDevKey', val)}>
          Dev key
        </TextInput>
        <TextInput note='The user key used for pastebin' defaultValue={settings.pasteUserKey} required={true} onChange={val => set('pasteUserKey', val)}>
          User Key
        </TextInput>
        <TextInput note='The paste option used for pastebin' defaultValue={settings.pasteOption} required={true} onChange={val => set('pasteOption', val)}>
          Paste Option
        </TextInput>
        <TextInput note='The paste privacy used for pastebin: 0 - public, 1 - unlisted, 2 - private' defaultValue={settings.pastePrivacy} required={true} onChange={val => set('pastePrivacy', val)}>
          Paste Privacy
        </TextInput>
        <TextInput note='The paste title used for pastebin' defaultValue={settings.pasteTitle} required={true} onChange={val => set('pasteTitle', val)}>
          Paste Title
        </TextInput>
        <TextInput note='The paste expiry date used for pastebin, N - none' defaultValue={settings.pasteExpiryDate} required={true} onChange={val => set('pasteExpiryDate', val)}>
          Paste Expiry Date
        </TextInput>
      </div>
    );
  }
};
