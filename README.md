![sequential](sequential.png)

## What does it do?

sequential shows JavaScript code execution

```javascript
var i=5/4;
i++;
console.log(i);
// > 2.25
```

[live example](https://sequential.js.org/live.html#G4QwTgBAlgvArAegCwG4BQUDUn0GMD2AdgM74A2ApgHRn4DmAFFAJQpA)


## What is it for ?

The purpose of sequential is to provide an environment to show JavaScript code execution in a browser.

**sequential gives JavaScript authors the means to write the most concise and most natural _(i.e. sequential)_ script to present any JavaScript work.**
 
A typical piece consists of all or some of those parts:
1. A comment describing what the code is about
2. The load function to access any external JavaScript library (commonly relying on CDN services like [rawgit](https://rawgit.com/), [cdnjs](https://cdnjs.com), [jsdelivr](https://www.jsdelivr.com/), [unpkg](https://unpkg.com/) and others)  
3. JavaScript code to set a use case.
4. console.log calls to display the outcome. 



## How does it compare with other code playgrounds such as codepen or jsfiddle ?

Those are bigger _beasts_ than sequential: fully fledged solutions covering all aspects of Web Development (HTML, CSS, JavaScript).
Instead, sequential focuses only on JavaScript execution without involving _(as mush as possible)_ any DOM object.

## The architecture.

sequential is a complete client side solution, meaning that everything is running on the browser.
The back-end (server) is only responsible to serve static resources (HTML, CSS, JavaScript and images)


## Roadmap

It's a misty one but those are a few things I'd like to have:

- Ability to easily embed on external site (e.g. IFrame , embed.ly, script )
- Ability to compare/diff executions (i.e. to highlight differences between browsers)

## Issues

Report any issue using GitHub and use notifications to track progress on them.

## Contributing

Want to hack on this project? Any kind of contribution is welcome! I am particularly interested in any JavaScript snippet you might want to share. 


## License

This project is licensed under the MIT license. 
 
