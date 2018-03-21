#### What is `Web Safe Fonts`?
Those which are available across all OS - Arial, Times New Roman etc. In context of web, browser will load font that is specified in the `font-family` in your css from your OS.

#### Why use `Google Fonts`?
This is because the `Web safe fonts` is lack of some special fonts - handwriting & monospace.

#### How to use custom svg images in your app
The idiomatic way is 
  * Generate a font file like woff or woff2 from `svg` file(s)
  * Create a new `font-face`
    ```css
    @font-face {
      font-family: yourCustomFont;
      src: url(your_custom_font.woff);
    }
    
    // usage
    div {
      font-family: yourCustomFont;
    }
    ```
 See [this guide](https://survivejs.com/webpack/loading/fonts/) for fonts bundling in webpack 


