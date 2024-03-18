/*! (C) The Hyperaudio Project. MIT @license: en.wikipedia.org/wiki/MIT_License. */
/*! Version 2.1.7 */

'use strict';

function nativePlayer(instance) {
  this.player = instance.player;
  this.player.addEventListener('pause', instance.pausePlayHead, false);
  this.player.addEventListener('play', instance.preparePlayHead, false);
  this.paused = true;

  this.getTime = () => {
    return new Promise((resolve) => {
      resolve(this.player.currentTime);
    });
  }

  this.setTime = (seconds) => {
    this.player.currentTime = seconds;
  }

  this.play = () => {
    this.player.play();
    this.paused = false;
  }

  this.pause = () => {
    this.player.pause();
    this.paused = true;
  }
}


class HyperaudioLite {
  constructor(transcriptId, mediaElementId) {
    this.transcript = document.getElementById(transcriptId);

    this.wordIndex = 0;
    //Create the array of timed elements (wordArr)

    const words = this.transcript.querySelectorAll('[data-m]');
    this.wordArr = this.createWordArray(words);
    this.parentTag = words[0].parentElement.tagName;
    this.parentElements = this.transcript.getElementsByTagName(this.parentTag);
    this.player = document.getElementById(mediaElementId);

    // Grab the media source and type from the first section if it exists
    // and add it to the media element.

    const mediaSrc = this.transcript.querySelector('[data-media-src]');

    if (mediaSrc !== null &&  mediaSrc !== undefined) {
      this.player.src = mediaSrc.getAttribute('data-media-src');
    }

    this.myPlayer = new nativePlayer(this);
    words[0].classList.add('active');


    this.transcript.addEventListener('click', this.setPlayHead, false);
    this.transcript.addEventListener('click', this.checkPlayHead, false);

    document.addEventListener('keydown', (event) => {
      if (event.key === ' ') {
          event.preventDefault();
          console.log('Space key was pressed');
          if (this.myPlayer.paused === false ){
            this.myPlayer.pause(); 
            this.pausePlayHead();
          }
          
      }
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'a') {
        if (this.myPlayer.paused === false ){
          event.preventDefault();
          if (this.wordArr[this.wordIndex - 3]) {
            this.seekTo(this.wordArr[this.wordIndex - 3].m / 1000);
          }
        }
          
      }
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 's') {
        if (this.myPlayer.paused === false ){
          event.preventDefault();
          if (this.wordArr[this.wordIndex -2]) {
            this.seekTo(this.wordArr[this.wordIndex -2].m / 1000);
          }
        }
          
      }
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'd') {
        if (this.myPlayer.paused === false ){
          event.preventDefault();
          if (this.wordArr[this.wordIndex -1]) {
            this.seekTo(this.wordArr[this.wordIndex -1].m / 1000);
          }
          
        }
          
      }
    });


  };

  createWordArray = words => {
    let wordArr = [];

    words.forEach((word, i) => {
      const m = parseInt(word.getAttribute('data-m'));
      const d = parseInt(word.getAttribute('data-d'));
      let p = word.parentNode;
      while (p !== document) {
        if (
          p.tagName.toLowerCase() === 'p' ||
          p.tagName.toLowerCase() === 'figure' ||
          p.tagName.toLowerCase() === 'ul'
        ) {
          break;
        }
        p = p.parentNode;
      }
      wordArr[i] = { n: words[i], m: m, p: p, d: d};
    });

    return wordArr;
  };

  setPlayHead = e => {
    const target = e.target ? e.target : e.srcElement;

    const timeSecs = parseInt(target.getAttribute('data-m')) / 1000;

    this.seekTo(timeSecs);

  };

  seekTo = (timeSecs) => {
    this.wordIndex = this.updateTranscriptVisualState(timeSecs);

    if (!isNaN(parseFloat(timeSecs))) {
      this.myPlayer.setTime(timeSecs);
      this.myPlayer.play();
    }
  }

  clearTimer = () => {
    if (this.timer) clearTimeout(this.timer);
  };

  preparePlayHead = () => {
    this.myPlayer.paused = false;
    this.checkPlayHead();
  }

  pausePlayHead = () => {
    this.clearTimer();
    this.myPlayer.paused = true;
  }

  checkPlayHead = () => {

    this.clearTimer();

    (async (instance) => {
      instance.currentTime = await instance.myPlayer.getTime();
      instance.checkStatus();
    })(this);
  }

  checkStatus = () => {

    let interval = 0;

    if (this.myPlayer.paused === false) {


      let index = this.updateTranscriptVisualState(this.currentTime);
      this.wordIndex = index;

      if (this.wordArr[index]) {
        interval = parseInt(this.wordArr[index].n.getAttribute('data-m') - this.currentTime * 1000);
      }

      this.timer = setTimeout(() => {
        this.checkPlayHead();
      }, interval + 1); // +1 to avoid rounding issues (better to be over than under)
    } else {
      this.clearTimer();
    }
  };

  updateTranscriptVisualState = (currentTime) => {

    let index = 0;
    let words = this.wordArr.length - 1;

    // Binary search https://en.wikipedia.org/wiki/Binary_search_algorithm
    while (index <= words) {
      const guessIndex = index + ((words - index) >> 1); // >> 1 has the effect of halving and rounding down
      const difference = this.wordArr[guessIndex].m / 1000 - currentTime; // wordArr[guessIndex].m represents start time of word

      if (difference < 0) {
        // comes before the element
        index = guessIndex + 1;
      } else if (difference > 0) {
        // comes after the element
        words = guessIndex - 1;
      } else {
        // equals the element
        index = guessIndex;
        break;
      }
    }

    // clear elements with class='active'
    let activeElements = Array.from(this.transcript.getElementsByClassName('active'));

    activeElements.forEach(e => {
      e.classList.remove('active');
    });


    this.parentElements = this.transcript.getElementsByTagName(this.parentTag);

    //remove active class from all paras
    Array.from(this.parentElements).forEach(el => {
      if (el.classList.contains('active')) {
        el.classList.remove('active');
      }
    });

    // set current word and para to active

    if (index > 0) {
      if (this.myPlayer.paused === false) {
        this.wordArr[index - 1].n.classList.add('active');
      }

      if (this.wordArr[index - 1].n.parentNode !== null) {
        this.wordArr[index - 1].n.parentNode.classList.add('active');
      }
    } 

    return index;
  };


}
