# dungemoji
My entry for GWGC2017 (http://gynvael.coldwind.pl/?id=668)

**Limitations**: Tactical turn-based game in <=20KB. All should be contained in a single index.html file.

**Target platform**: Windows10+Chrome

I made this in about 8 days, from scratch. The general idea was to make an abstraction of tactical movement without losing the possibility to "corner" the opponent or be cornered yourself.

Four days into the project I already hit the size limit (using uglifyjs, I never heard of jscrush before). My game wasn't even half done.

I then came up with the idea to gzip the code, and un-gzip it at runtime, all in JS.

A gulp task automatically gzips & base64s my entire codebase (index_dev.html) and writes the resulting string to a different HTML file (index.html).
The second HTML file contains:
 - a tiny inflation library (https://github.com/devongovett/tiny-inflate) which I hacked to support gzip and run in the browser instead of just in nodejs.
 - some javascript to inflate and decode the gzipped string again, and write it to document.
 
This approach deflated my 36KB codebase to just 19KB, including tiny-inflate and the decoding script. The actual codebase is compressed to just 14.9K!

For visuals I relied almost entirely on emoji, with some html and some css. Not a single image was used.
Unfortunately this limited what kind of monsters/players/animations I could use, but it was generally a very fun exercise to work around the constraints emojis imply.
Even the grey, tiled, repeating background is an emoji, drawn to a canvas, exported as data url and used as a repeating background image.

Most of the emojis are recolored through CSS filters. This unfortunately means that on different platforms it can look a bit strange.

Time constraints caused:
- The AI to be rather dumb.
- The level count to be low. Though the last is a repeating, random level to try and make up for it.
- Some extra mechanics to be dropped (objects blocking certain cells, variations of enemies and characters, bosses, reinforcements, larger levels with multiple battles)
- A LOT of technical shortcuts. I'm not willing to expand upon this code due to the amount of awful workarounds.
- The game to be not very well balanced.
- Almost no audio, as the Web Audio API was too time-intensive to learn.

Size constraints caused:
- Me to get creative with compression.
- No music, very little sound. It surprised me how large very short sound files are.
- Some weird visuals due to the lack of specific emoji (for example there's a bow-and-arrow, but no separate arrow, there is a mage, an elf, but nothing knight-like, ...)

