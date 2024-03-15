# Submerged Structure

## prototype

<https://submergedstructure.github.io/>

## motivation

- listening and immersing in real content at an appropriate level to get a "feel" for the language
- there is so much to remember when studying a foreign language, vocab, grammar and a feel for the way that people express themselves in the language. Drilling isolated sentences and words and doing grammar exercises can be helpful sometimes. I think it is generally agreed by language learning experts though that language learners learn best by being as interested and engaged as possible. And it can be very helpful to be focused on, and interested in, the meaning of what you are hearing or reading rather than always being focused in a very conscious way on trying and failing to remember all the grammar rules.
- Grammar should probably be approached in small chunks and it can be often helpful to have already been exposed to grammatical structures that you perhaps cannot fully understand the mechanics of to begin to spark a curiosity in what is going on with the language.
- Quick, accessible, bite-sized uncovering of grammatical patterns as you consume content can aid in making sense of the language and can make the whole process a pleasurable exploration.

## capabilities of software

- lemmatisation and grammatical analysis with [spacy](https://spacy.io/)
  - gives the lemma and also parts of speech
  - versatile styling using CSS

## roadmap

- done
  - make the player stick to the top of the browser while you are scrolling through that player's transcript
  - allow the turning off and on of grammar syntax highlighting so that users can first read through a text and then turn on the highlighting to check their comprehension
  - add links to wiktionary to popup so that users can easily look up individual words from their lemmas.
  - think more about translation (toggle showing translation on the same page as text).
    - Google Translate is sufficient, so you can instantly see the meaning of words in this context, and also have the option to click through to wiktionary for more complex words.
  - once tool is stable we will generate static files in github and these can be edited to correct the small percentage of grammar mistakes that spacy makes.
- to do
  - allow the selection of different highlighting schemes??
  - key controls to go backwards, control speed and pause player
  - allow the upload of any audio or the grabbing of audio from video hosts such as youtube
    - analysis with whisper AI
    - word level time stamps
  - have a good interface to chatGPT so that we can quickly click through to chatgpt and then have a conversation with chatGPT to ask it more about the sentence and translation??
    - I have been experimenting with chatGPT and it is pretty accurate for giving in-depth language explanations often more useful than a teacher might
    - enables fast access to very good quality explanations of the language for a language learner
  - generate rss feeds of content suitable for consuming with a podcast player so that people listen on the go, even downloading content for offline usage.
  - we can also work with video probably hosted on youtube as well as audio.

## how others can get involved

- audio content in target languages needed
- adapting this tool for other languages?
  - preferably languages with quite complex grammar
  - what are helpful parts of the grammar to bring to the surface for learners
