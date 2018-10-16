# civic-jbrowse
civicdb jbrowse plugins

```
// install browserify
npm install browserify

// build civic-bundle
browserify civic2gff.js -o civic-bundle.js

// copy civic-bundle into jbrowse root.
cp civic-bundle.js ../jbrowse

```

include in jborowse/index.html
```
<script src="civic-bundle.js"></script>
```