
#Best Practice

#### Stay Organized
Declare most generic items first followed by not-so-generic ones - this lets you make good use of inheritence.
#### Useful Naming Conventions
*Name CSS elements based on what they are, not what they look like.* - Leave position or style specific words out of styles.
> If you must return to your HTML to change the presentation or styling of the page. You are doing it wrong!

```css
/* bad */
.comment-blue {}
.post-largefont {}
/* good */
.comment-beta {}
.post-title {}
```
#### Class and ID
```css
.profile-image
#user_image
```
#### Correct order
1. Draw layout/draft wireframe
2. Create a HTML structure representation of layout
3. Design CSS

#### Break down whole CSS block into separate stylesheets
`navs.css`, `typography.css`, `menus.css`, `colors.css` etc.
#### To center element
Use `margin: 0 auto;`.


