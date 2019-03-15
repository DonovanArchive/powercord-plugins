const Plugin = require('powercord/Plugin');
const { get, post } = require('powercord/http');
const { clipboard } = require('electron');
const { React } = require('powercord/webpack');

const Settings = require('./Settings.jsx');

module.exports = class Pastebin extends Plugin {
  start () {
    powercord
      .pluginManager
      .get('pc-settings')
      .register('pc-pastebin', 'Pastebin', () =>
        React.createElement(Settings, {
          settings: this.settings
        })
      );

    const pasteDevKey = this.settings.get('pasteDevKey', ''),
      pasteUserKey = this.settings.get('pasteUserKey', ''),
      pasteOption = this.settings.get('pasteOption', 'paste'),
      pastePrivacy = this.settings.get('pastePrivacy', 1),
      pasteTitle = this.settings.get('pasteTitle', 'Discord'),
      pasteExpiryDate = this.settings.get('pasteExpiryDate', 'N'),
      postURL = this.settings.get('postURL', 'https://pastebin.com/api/api_post.php'),
      prefix = powercord.pluginManager
        .get('pc-commands').settings
        .get('prefix', '.'); // @todo: make not ugly at time other than 4:30am

    powercord
      .pluginManager
      .get('pc-commands')
      .register(
        'pastebin',
        'Lets you paste content to Pastebin.',
        '{c} [ --send ] < --clipboard | FILE_URL >',
        async (args) => {
          const send = args.includes('--send')
            ? !!args.splice(args.indexOf('--send'), 1)
            : false;

          const data = args.includes('--clipboard')
            ? clipboard.readText()
            : await this.parseArguments(args);

          if (!data) {
            return {
              send: false,
              result: `Invalid arguments. Run \`${prefix}help pastebin\` for more information.`
            };
          }

          const { body } = await post(postURL)
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .send({
              api_dev_key: pasteDevKey,
              api_user_key: pasteUserKey,
              api_option: pasteOption,
              api_paste_code: data,
              api_paste_private: pastePrivacy,
              api_paste_name: pasteTitle,
              api_paste_expire_date: pasteExpiryDate
            });

          return {
            send,
            result: body
          };
        }
      );
  }

  unload () {
    powercord
      .pluginManager
      .get('pc-commands')
      .unregister('pastebin');

    powercord
      .pluginManager
      .get('pc-settings')
      .unregister('pc-pastebin');
  }

  parseArguments (args) {
    const input = args.join(' ');
    if (input.startsWith('https://cdn.discordapp.com/attachments')) {
      return get(input).then(res => res.raw);
    }

    return false;
  }
};
