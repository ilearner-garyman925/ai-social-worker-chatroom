# Academic Advisory Portal

Two-page English advisor prototype with a mist-blue/lavender interface.

## Run

`python -m http.server 5173 --directory dist`

## Current behaviour

- City University of Hong Kong welcome page and three advisors without subject badges.
- Desktop conversation: searchable voice-style history on the left, advisor in the centre, general health survey on the right.
- Start speaking enables browser speech recognition. A completed utterance is submitted automatically without a transcript review step. After the scripted advisor response finishes, listening resumes.
- User waveform uses 45% opacity and microphone amplitude; advisor waveform uses full-colour animated purple bars while browser speech synthesis plays. Advisor bars indicate playback, not measured output amplitude.
- State changes fade in/out. Reduced-motion preferences disable continuous animation. Captions and the bubble's top badges are removed; the speaking status appears in small text below the wave.
- Mute or ending stops audio and releases the microphone. Permission failures show a typed-input fallback. This is turn-taking, not simultaneous interruption/full-duplex voice.
- History offers Show text and speech-synthesis replay. History waveforms are illustrative, not saved recordings.
- Only the supplied survey question 3/12 is implemented, with neutral options and in-memory confirmation. No scoring, diagnosis, invented questions or claim that the entire survey is complete.

This frontend uses guided reply scripts, not a connected generative AI service. Transcripts stay in page memory and clear on a new session or reload. Browser speech recognition may use the browser vendor's service. Voice support depends on browser and microphone permissions.

## Validation

`node --check dist/app.js`

`node --test tests/voice-lifecycle.test.cjs`

Five lifecycle tests cover late microphone permission, duplicate recognition results, cleanup, automatic listening after advisor playback, recognition errors and a speech-playback startup timeout. Browser UI and microphone-denial fallback checked. Successful live microphone capture has not been verified in this environment.

The existing private Sites project is declared in `.openai/hosting.json`.
