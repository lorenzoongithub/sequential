# yolpo

This is the primary codebase that powers yolpo - http://www.yolpo.com
 
## Quickstart.
 
To set up your own instance of yolpo to develop with, use any light-weight web-server to host the files and folders in /website/.

yolpo is a 100% clientside solution so all your webserver needs to do is serve static pages.
 
A simple build process is in place to ensure that that files are combined and minified before being served by the main site.
 
 
## Issues and Contribution Guidelines
 
Thanks for reading this and wanting to help make yolpo better !
First things first, though: my code is quite messy at the moment and likely to stay that way for a while; I don’t expect anybody to go there and make it better; besides I can work on this project only a few hours some weekends and very rarely some late evenings on week days so I would not have much time to merge pull requests.  
Instead, I would welcome feedback, ideas and issue reporting.
Also, it would be great if you could write github gists against any javascript api and let me know about them.
I would be very happy to add them in the explore page.
 
Happy hacking!
 
 
## A misty road map


There are many things I would like to add in yolpo. Here are a few: 

* better option to display interim results
* option to get underlying gist from GitHub. 
* concept of playlist - similar concept of a playlist for a video player 
* much better UI and UX - the UI and UX need to significantly improve. Currently editing is particularly unintuitive. 
* isomorphic API - currently yolpo's code is heavily dependent on some key dom components (e.g. IFrame for sandboxing the execution)
* GitHub sign in integration


