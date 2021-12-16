import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`
/* custom variables */
  :root {
     /* ------------------ */ 
     /* color theme */
    --color-primary: #b5f5fa;
    --color-secondary: #b26caeff;
    --color-accent: #92f81d;
    --color-dark: #101c42ff;
    --color-light: #f5f2f8ff;
    /* ------------------- */
    /* https://coolors.co/101c42-f5f2f8-0ac2ff-b26cae-6cbc10 */
    /* color names */
    --capri: #0ac2ffff;
    --pearly-purple: #b26caeff;
    --kelly-green: #6cbc10ff;
    --oxford-blue: #101c42ff;
    --ghost-white: #f5f2f8ff;

    /* --------------------- */
    /* fonts */
    --font-heading: 'Alegreya Sans SC', sans-serif;
    --font-sub-heading: 'Fira Sans Extra Condensed', sans-serif;
    --font-body: 'Open Sans', Arial, Helvetica, sans-serif;
    /* --------------------- */
    /* sizes */
    --page-max-width: 1200px;
    }

  /* http://meyerweb.com/eric/tools/css/reset/
      v2.0 | 20110126
      License: none (public domain)
  */

html, body {
    height: 100vh;
    width: 100%;
    background-color: var(--color-dark);
}

#root {
    height: 100%;
    width: 100%;
}

  html, body, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, abbr, acronym, address, big, cite, code,
  del, dfn, em, img, ins, kbd, q, s, samp,
  small, strike, strong, sub, sup, tt, var,
  b, u, i, center,
  dl, dt, dd, ol, ul, li,
  fieldset, form, label, legend,
  caption, tbody, tfoot, thead, tr, th, td,
  article, aside, canvas, details, embed,
  figure, figcaption, footer, header, hgroup,
  menu, nav, output, ruby, section, summary,
  time, mark, audio, video {
      margin: 0;
      padding: 0;
      border: 0;
      box-sizing: border-box;
      font-size: 100%;
      vertical-align: baseline;
  }
  /* HTML5 display-role reset for older browsers */
  article, aside, details, figcaption, figure,
  footer, header, hgroup, menu, nav, section {
      display: block;
  }
  body {
      line-height: 1;
  }
  ol, ul {
      list-style: none;
  }
  blockquote, q {
      quotes: none;
  }
  blockquote:before, blockquote:after,
  q:before, q:after {
      content: '';
      content: none;
  }
  * {
      font-family: var(--font-body)
  }
  h1 {
      font-family: var(--font-heading)
  }
  h2, h3, h4, h5, h6 {
      font-family: var(--font-sub-heading)
  }
  
  `;
