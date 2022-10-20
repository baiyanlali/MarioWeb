## Build
+ Download CheerpJ from https://leaningtech.com/download-cheerpj/ and unzip it.
+ Pack the Java project (Mario-AI-Interface) into a runnable jar with eclipse, selecting *Play* as main class. I set the java compiler as 1.8 when packing jar (right click the project -> properties -> java compiler -> java compliance level). 
+ Run following cmd instructions:
  ```
  cd [where CheerjP is unziped]
  python cheerpjfy.py [path of the jar]
  ```
  A *.jar.js* file will be created.
+ Copy both *.jar* and *.jar.js* files into the project root.
+ Add a html file (See play.html as an example).
## Run
+ Start a web server at the project root. For example, go to project root path and run `python -m http.server 8080` or `http-server -p 8080` (NPM).
+ Access the url (e.g. 127.0.0.:8080/play.html) in a broswer.
## Resources
+ CheerpJ official website: https://leaningtech.com/cheerpj/
+ CheerpJ documentation: https://docs.leaningtech.com/cheerpj/
+ CheerpJ technical supporting community: https://gitter.im/leaningtech/cheerpj