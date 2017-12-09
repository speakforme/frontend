Notes for developers:

* All vuejs code is in `public/app.js`
* All stylesheet is managed via `_sass`
* We use Jekyll include syntax to fastload data items to javascript

## Running

## If you have RVM setup:

```
rvm install 2.4
rvm use 2.4
rvm gemset create speakforme
rvm gemset use speakforme
bundle install
bundle exec jekyll serve --watch
```

## If you don't care about RVM:

```
gem update bundler
gem install github-pages
jekyll serve --watch
```

Then open http://localhost:4000 in your browser. If you don't use RVM, skip the first 2 commands.
