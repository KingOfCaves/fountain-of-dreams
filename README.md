# fountain-of-dreams

An internet radio with a Node.js backend. Based on the same idea as plaza.one, except more focused on more ambient / melancholic genres.

http://fountain.ddns.net

## TABLE OF CONTENTS

-   How to use it?
-   How it works?
-   What needs to be done?
-   Screenshots?

## HOW TO USE IT?

Clicking the link at the top will bring you to the main page of the radio web application. You can use this to listen, or you can use any third party media player that supports mp3 streams. To use something like VLC to listen, use the /radio endpoint.

http://fountain.ddns.net/radio

## HOW IT WORKS?

The server now has a proper host now. A Raspberry Pi 4 running Raspbian.

### Frontend

The frontend only shows the metadata (e.g. artist, etc.), and the volume / volume slider. There are a number of different shortcuts that can be viewed by clicking the help button the in the bottom right corner or by clicking the 'H' key.

### Backend

The main server that people connect to uses a basic frontend for ui and a node.js backend for handling requests and routes. The backend has a route for the root, a route for handling the radio server data and current song information and a catch-all so that people will get redirected back to the main page.

The route for the audio stream catches the icecast server being run in the background and uses socket-io in order to emit an event to all connected sockets. This event I conveniently named metadataUpdate sends the metadata from icecast to the front end where it is rendered as a title and an artist. Mixxx is running in the background alongside icecast and is the actual source of the audio and metadata. Icecast is relaying it to the client.

There are plans in the future for a gallery for looking at pictures of abandoned malls that I hand picked from places like r/deadmalls, r/abandonedporn, and Phil Donohue's tumblr/instagram. Props to those guys, a lot of these pictures are amazing. I also want to add a contact form for submitting songs and pictures for others to see and download, with a link to the original post / photographer page / bandcamp of course.

## SCREENSHOTS

need to take more pictor
