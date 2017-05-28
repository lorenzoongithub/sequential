![sequential](sequential.png)

# Read. Write. Show.


###### Distilling minimal code.


## What does it do?

sequential shows JavaScript code execution

```javascript
var i=5/4;
i++;
console.log(i);
≫ 2.25
console.log(i*2);
≫ 4.5
```

[live example](https://lorenzoongithub.github.io/sequential/render.html?%7B%22statements%22%3A%5B%22var%20i%3D5%2F4%3B%22%2C%22i%2B%2B%3B%22%2C%22console.log(i)%3B%22%2C%22console.log(i*2)%3B%22%5D%2C%22logs%22%3A%7B%222%22%3A%5B%222.25%22%5D%2C%223%22%3A%5B%224.5%22%5D%7D%2C%22timestamp%22%3A%222017-05-28T22%3A17%3A33.825Z%22%2C%22platform%22%3A%22Chrome%2058.0.3029.110%20on%20Windows%2010%2064-bit%22%7D)


## What is it for ?

The purpose of sequential is to provide an environment to show JavaScript code execution in a browser.

**sequential gives JavaScript author the means to write the most concise and most natural _(i.e. sequential)_ script to present any JavaScript work.**
 
A typical piece consists of all or some of those parts:
1. A comment describing what the code is about
2. The load function to access external JavaScript library (commonly relying on CDN services like rawgit, cdnjs, jsdelivr, unpkg and others)  
3. JavaScript code to set a use case.
4. console.log calls to display the outcome. 



## How does it compare with other code playgrounds such as codepen or jsfiddle ?

Those are bigger beasts than sequential: fully fledged solutions covering all aspects of Web Development (HTML,CSS,JS)
Instead, sequential focuses only on JavaScript execution without involving (as mush as possible) any DOM object.
sequential also records metadata such as the time and the platform where the snippet was executed (to help execution comparisons) 
In a sentence: **sequential is not executing code to create a page, is creating a page to show code execution.**


## The architecture.

sequential is a complete client side solution, meaning that everything is running on the browser.
The back-end (server) is only responsible to serve static resources (html, css, JavaScript and images)
 
There are three main web pages: editor.html, engine.html and render.html


Data flows from one page to another inside the URL. 

For example: 
/editor.html?{"code":"console.log('hello world');"}

Data is encoded as JSON and using the native encodeURIComponent/decodeURIComponent functions giving the URL a cryptic look. 


engine.html is the core of sequential.
It's responsible of parsing the snippet of code and executing it before calling render.html

It receives an input like
```javascript
{ 
   "code" : String 
}
```

On a successful execution, engine.html changes its address (location.replace) so to call 'render.html' with the result of the execution

```javascript
{
   "platform":String                     // The description of the platform where the code is executed       
   "timestamp":String                    // The browser's timestamp in ISO 8601 format                                   
   "statements":String[]                 // the array of statements (including the comments) that was executed.
   "logs": { number: [...], number: []}  // the logs at the given line.  
   "error": number                       // (optional) the line number of where the error occurs.
   "errorMessage": String                // (optional) the error message  
   "timeout": number                     // (optional) the line number for the first statement 
                                         //            which was not executed due to a time out.
} 
```



Here is an example: 
```javascript
engine.html?{ 
   "code": "var i=0; i++; console.log(i);console.log(i*100);" 
}
```

```javascript
render.html? 
{
  statements : ["var i=0;", "i++;","console.log(i);","console.log(i*100);"], 
  logs : {
      2 : "1",
      3 : "100" 
  },
  error : undefined,
  errorMessage : undefined,
  timeout : undefined, 
  timestamp : "2017-05-23T14:15:02.844Z"
  platform : "Firefox 42.0 32-bit on Windows 10 64-bit"
}
``` 

Rules: 
- "statements" is a mandatory object. Each statement (in the statements array) must be non-null. the array can be empty.
- "logs" is a mandatory object. its keys must be numbers between 0 and statements.length-1
- error is optional. If present must be a number between 0 and statements.length-1
- errorMessage is optional. It is present iff error is present. 
- timeout is optional. If present must be a number between 0 and statements.length-1
- if error is present timeout is not (and vice versa).
- if error is present    error >= max(keys in logs)   _(in other words: there are no logs following an error  since the remaining statements are not executed)_
- if timeout is present  timeout > max(keys in logs)  _(in other words: there are no logs following a timeout since the remaining statements are not executed)_
 
```javascript 
On a non-successful execution (intended as inability to parse the code) 'render.html' is called with 
render.html?
{
   syntaxError: String
   code: String 
   timestamp : String,
   platform : String
}
```   

Finally, if engine.html (in its search URL) is given an invalid JSON or a valid JSON for which no code can be retrieved
it simply stops and writes an error message.

 


## Design Considerations:

sequential does not _eval_ code in its entirety.
Instead, it breaks the code in statements which are then executed one at a time sequentially. 

Only the output returned by console.log is captured. 
Intent: It reduces the size of the response. It makes the tool opinionated (but in a good way) imposing a strict (yet elegant) way to write sequential JavaScript.
  
Fail fast. If an error occurs sequential doesn't continue. 
Intent: I am opinionated again: I assume that if an error happens there is no need to go any further.  
 
Sandboxing. Sandboxing JavaScript code execution is difficult. This is achieved by isolating the execution on its own page (engine.html) and by showing the result on a different page (render.html)
 
## Issues

Report any issue using GitHub and use notifications to track progress on them.

## Contributing

Want to hack on this project? Any kind of contribution is welcome! I am particularly interested in any JavaScript snippet you might want to share. 


## License

This project is licensed under the MIT license. 
 
