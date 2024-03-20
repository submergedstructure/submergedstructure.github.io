
document.addEventListener('DOMContentLoaded', function() {

    function find_transcript_div(audio_element) {
        return audio_element.closest('.transcript_and_audio').querySelector('.transcript');
    }

    document.querySelectorAll('audio').forEach(function(audio_element) {
        //find child of parent div with class "transcript"

        
        audio_element.addEventListener('keydown', function(event) {
            // audio element passes the event to the transcript div
            find_transcript_div(audio_element).dispatchEvent(event);
        });


        const transcript_div = find_transcript_div(audio_element);
        
        // Example html structure:
        // <div class="transcript_and_audio disable_person_highlights">
        // <h2><a href="https://www.lingq.com/en/learn/pl/web/reader/29053838/">083A-DailyPolishStory</a></h2>
        // <audio data-transcipt-id="29053838" controls=""></audio>
        // <div class="transcript">
        //     <article>
        //         <section>
        //             <p>
        //                 <span data-m="1060" data-d="0" style="display: inline;">[speaker-0] </span><span data-m="1060"
        //                     data-d="500">Cześć! </span><span data-m="1960" data-d="400">Dziś </span><span data-m="2360"
        //                     data-d="500">zapraszam </span><span data-m="2960" data-d="160">na </span><span data-m="3120"
        //                     data-d="500">historyjkę </span><span data-m="3960" data-d="240">o </span><span data-m="4200"
        //                     data-d="500">Karolu. </span>
        //             </p>
        //             <p>
        //                 <span data-m="5220" data-d="320">Nie </span><span data-m="5540" data-d="300">będę </span><span
        //                     data-m="5840" data-d="500">zdradzał, </span><span data-m="6500" data-d="240">co </span><span
        //                     data-m="6740" data-d="500">przytrafiło </span><span data-m="7500" data-d="360">się
        //                 </span><span data-m="7860" data-d="500">Karolowi. </span>
        //             </p>
        //             <p>
        //                 <span data-m="9240" data-d="500">Posłuchaj </span><span data-m="9940" data-d="500">historyjki,
        //                 </span><span data-m="10840" data-d="120">a </span><span data-m="10960" data-d="500">wszystkiego
        //                 </span><span data-m="11720" data-d="260">się </span><span data-m="11980" data-d="500">dowiesz.
        //                 </span>
        //             </p>
        //          </section>
        //     </article>
        // </div>

        const transcript_words = [];
        //find all children of parent_div with attribute "data-m" and iterate through them
        transcript_div.querySelectorAll('[data-m]').forEach(function(timed_element) {
            // a dict that contains the data-m, data-d, and the element.
            const word_dict = {};
            word_dict['data-m'] = timed_element.getAttribute('data-m');
            word_dict['data-d'] = timed_element.getAttribute('data-d');
            word_dict['element'] = timed_element;
            transcript_words.push(word_dict);
        });

        audio_element.addEventListener('timeupdate', function() {
            const time = audio_element.currentTime;
            //iterate through transcript_words and find the word that is currently being spoken
            transcript_words.forEach(function(word) {
                if (time >= word['data-m'] / 1000 && time <= (word['data-m'] / 1000 + word['data-d'] / 1000)) {
                    word['element'].classList.add('active');
                } else {
                    word['element'].classList.remove('active');
                }
            });
            //find the first parent element of the clicked element that has a class of "transcript"            
        });

        audio_element.addEventListener('play', function() {
            //pause all other audio elements,
            //make the transcript div active
            //and remove the active class from all other transcript divs.
            document.getElementsByName('audio').forEach(function(document_audio) {
                if (document_audio !== audio_element) {
                    document_audio.pause();
                    find_transcript_div(document_audio).classList.remove('keyboardfocus');
                }
            });
            transcript_div.classList.add('keyboardfocus');
        });

        // add a click handler for all elements with data-m attribute
        transcript_div.addEventListener('click', function(event) {
            if (event.target.hasAttribute('data-m')) {
                // set the media player to the time from the data-m attribute
                audio_element.currentTime = event.target.getAttribute('data-m') / 1000;
                //if the media is paused, play it
                if (audio_element.paused) {
                    audio_element.play();
                }
                //prevent the default action of the click event
                event.preventDefault();
            }
        });

        // add a keydown handler to the document listented to by each transcript div
        document.addEventListener('keydown', function(event) {
            if (transcript_div.classList.contains('keyboardfocus')) {    
                if (event.key === ' ') {
                    // if the space key is pressed, prevent the default action
                    event.preventDefault();
                    // if the audio is paused, play it
                    if (audio_element.paused) {
                        audio_element.play();
                    } else {
                        // if the audio is playing, pause it
                        audio_element.pause();
                    }
                }
                if (event.key === 's') {
                    // if the space key is pressed, prevent the default action
                    event.preventDefault();
                    transcript_div.querySelector('.active').closest('span.sentence').querySelector('[data-m]').click();
                }
            }
        });
        
    });


});