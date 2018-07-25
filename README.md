# Small size JS game template
Used in my entry for GWGC2017 (http://gynvael.coldwind.pl/?id=668)

This inlines all scripts and css in src/index.html, gzips it, and wraps the result in the a new index.html file in the build/ directory. 

Running the build decompresses the gzipped string and writes it back to body, saving a lot of space.

This project still requires node <= 6. Node 7 does not work with Gulp 3, but this will be resolved by upgrading to gulp 4 in the future.
