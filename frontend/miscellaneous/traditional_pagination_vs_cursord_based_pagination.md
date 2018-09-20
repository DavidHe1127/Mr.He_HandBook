## Traditional Pagination VS Cursor-based Pagination

### Problem with tradtional pagination (ONLY applicable to real time data)
Let's say we have 20 comments in total and want to display them in two pages so 10 for each.

```js
pg1 1 2 3 4 5 6 7 8 9 10
pg2 11 12 13 14 15 16 17 18 19 20
```

User A is reading all comments on page one. Everything works fine so far until someone adds a new comment.

Normally, the most recent comment should be presented at the top.

Now, User A goes to page 2 where it loads the next 10 comments as below
```js
SELECT * FROM comments ORDER BY date DESC LIMIT 10 SKIP 10
```

Since there is a new comment being pushed to the top, the next 10 comments will be (10 11 12 13 14 15 16 17 18 19).

It is obvious that the 10th comment that appeared previously at the bottom on page 1 now became the first one on page two.

User A sees 10th comment twice!

