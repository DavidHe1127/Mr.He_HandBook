* Add lines below in your theme file to change highlighted color for next match when finding and replacing things.
It is highly recommanded you use `PackageResourceViewer` to readily view and edit your theme file. Credits for the author.
```curl
<key>inactiveSelection</key>
<string>#622569</string>
```
* `ctrl + k + v` to see the list of copy history that you can paste from.
* `ctrl + k + l | u` to convert chars to either `l`owercase or `u`ppercase.
* To sync configs/pkgs onto a fresh sublime:
  1. Remove `User` folder under `~/Library/Application\ Support/Sublime\ Text\ 3/Packages/User`
  2. Clone the entire `User` folder from source Mac
  3. Install `Package Control`
  4. Restart your fresh sublime text
