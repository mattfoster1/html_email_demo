INSTRUCTIONS: 

1. fill out the CMS. 
    NB. Any changes to the folder structure will need to also be reflected in:
      - the 'gulp deploy' taskrunner.
      - the 'inject-style-' tag in the HTML.
      - the embedded 'style' tag in the HTML.

2. Put your images in the src/assets/img/ file (or equivalent).

3. If you aren't going to put any CSS in the embedded style tag, comment it out or delete it.
    NB. The folder structure you use will be echoed on the server.

4. use the 'cd' terminal command to go to the project folder (in the terminal)

5. type 'npm install gulp' into terminal to install gulp (you may need to install node/npm first)

6. type 'npm install' into terminal to install the gulp taskrunners in the package.json file

7. Type 'gulp' into the terminal (or whenever you want to work on the project).

8. DO NOT work in the .css file. DO work in the .scss file, the HTML <head> or inline.

9. Make your email, etc...

10. Kill the 'gulp' process by typing '[Ctrl] + c' into the terminal.

11. (optional) To send off an automatic litmus test, type 'gulp test' into terminal.

12. Type 'gulp build' into terminal. In the 'build' folder will be a new, lovely 'index.html' file for you to paste into litmus/mailchimp.