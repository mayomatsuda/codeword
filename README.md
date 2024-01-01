# Codeword

Daily two-player word puzzle built with React.

## Setup

In the project directory, run `npm install` and `npm start`.

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## How to play
The player is given 20 words (that change daily). They are responsible for coming up with a hint and a number.
The hint should relate to the number given amount of GREEN words.

Upon submitting, a URL is generated that the player can share. This URL leads to guess mode, where the colors
are not revealed to the player. If the player guesses the given number of green words related to the hint, they
win. If the player uncovers a red word, they lose.