#eXist-db homepage XAR

This is the homepage app started in March 2014

NOTE:
This app is still not fully based upon app blueprint – There are some differences in the gruntfile. This app still relies upon ant for the actual XAR building. Should be changed with next release.

See http://addyosmani.com/blog/checking-in-front-end-dependencies/ for a discussion of version control of dependencies - opted for NOT checking dependencies in as we don't need to update these too often.


## Prerequisites & Installation
1. latest eXist-db development version (Status 2013-11-27)


## Building

There are two build components necessary at the moment:
* Ant (as before but with adapted targets)
* Gruntjs for CSS+JS optimization and dependency management of components

### Building xar with Ant

`ant local-xar`will create a xar for local **development** containing the non-optimized version of the site PLUS optionally the optimized version in subdir 'dist'. That means that the optimized and non-optimized versions can be deployed at the same time.

`ant local-min-xar` will create an optimized, **production** version of the xar just containing the minimized versions of the dependent components. The contents of this xar matches the content of directory 'dist' after running `grunt`in this directory.

#### Issue: working with Bower in xars

** Important notice: **

As just copying all Bower dependencies residing in the `components`directory would create a much too big xar file it is necessary to touch the `local-xar`target and specifically handle the dependencies one by one and copying just the files needed to make the original pathes in the html work. The build file needs to adapted when a new dependency is pulled in.

### Building with Grunt

#### Grunt Setup
This xar uses nodejs, bower, grunt combination to optimize e.g. css and manage dependencies

1. nodejs must be installed
1. install gruntjs via nodejs
1. install bower via nodejs

run `(sudo) npm install` to install all package dependencies including Grunt

run `bower install` once

After setup your should have a `components` directory in this directory containing the dependent components managed by bower. The gruntfile.js will rely on these components.

### Building the optimized version

** Some general warnings... ***
Working with optimized versions complicated the build process significantly and not every situation can be handled automatically. It needs special attention to not break things.

#### Some things to watch

** ! always do clean rebuilds of with grunt first and then by rebuilding the xar. ! **

** ! special caution is needed when using eXide with synchronization on - you might break pages (which got processed by grunt) when working live with an optimized version. ! **

** ! Never work on the optimized version. This should be the last step when deploying. !**


Working with optimized versions b
** Always execute this first before building a xar with Ant **


animate.css has its own optimization through Grunt. You should always run

`grunt watch`in directory `components/animate.css` and modify and store the file `.animate-config.json` to trigger optimization.


Afterwards create an optimized version of the whole app by running:

`grunt`

in the root of the application (this directory).

You should consult the `gruntfile.js` for details.

#### Attention with dynamically generated CSS classes

The grunt build tool uses `uncss`- a tool to discover and remove unused CSS classes from the resulting CSS. However this statically analyses one or more html pages. When JS routines dynamically add classes to the DOM at runtime these cannot be detected by `uncss`. Such classes can be held in a separate css file for instance.

Dynamic behavior should always be tested after optimization.
