* Fundamentals
  * [ASCii](#ascii)
  * [Unicode](#unicode)
  * [UTF-8](#utf-8)

## ascii

* `8 bits = 1 byte` which forms `256` combinations of `1` and `0` from `00000000` to `11111111`.

* `ASCii` is comprised of `128` characters. i.e `A` is 65 (01000001), `SPACE` is 32 (00100000). `32` out of `128` is non-printable. Each char takes `7` bits and leave the first bit `0`.

* Can only suffice english characters not other chars from other languages.

## unicode

* A huge set of unique codes for all characters.
* Represents as `U+<codepoint>`. i.e `鱼` is `U+9C7C` 

## utf-8

* `UTF-8` implements `unicode`
* It has variable-length and uses `1~4` bytes to denote a single character

[Further reading](http://www.ruanyifeng.com/blog/2007/10/ascii_unicode_and_utf-8.html)
