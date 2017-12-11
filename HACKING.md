# Notes for developers:

This is a Jekyll+Vue.JS project, hosted on Netlify. We have a separate backend at [mail-server][https://github.com/speakforme/mail-server].

* All vuejs code is in `public/app.js`
* All stylesheet is managed via `_sass`
* We use Jekyll include syntax to fastload data items to javascript
* See below for more detailed instructions on setup, javascript, and Jekyll usage

## Running

### If you have RVM setup:

```
rvm install 2.4
rvm use 2.4
rvm gemset create speakforme
rvm gemset use speakforme
gem install bundler
gem install jekyll
bundle exec jekyll serve --watch
```

### If you don't care about RVM:

```
gem install bundler
gem update bundler
gem install jekyll
jekyll serve --watch
```

Then open http://localhost:4000 in your browser. If you don't use RVM, skip the first 2 commands.

If you still get some errors, see the [Troubleshooting page](https://jekyllrb.com/docs/troubleshooting/#installation-problems). It covers errors with:

* native extension failing to build
* Jekyll & Mac OS X 10.11
* `ExecJS::RuntimeUnavailable`

### Setting up translations

Only needed if you are editing something inside `_locales` directory

```
npm install
./node_modules/.bin/gulp locales
```

This is require to copy over the extra localization files to JSON format.

## Translation

The `_data/i18n.yml` file holds the UI translations. Add a new language below. We fallback to english.

Work is ongoing for translating the constituency names, as well as the petition text

## Javascript

* All code is in `public/app.js`.
* Single component VueApp.
* We have mountpoints in 2 files: `_layouts/campaign.html` `_layouts/home.html`

# Styles

TODO

## Wanna Help?

We have a checklist of things to do at https://github.com/speakforme/frontend/issues/2
