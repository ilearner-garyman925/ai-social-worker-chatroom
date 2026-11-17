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

## LivLiv avatar

Ms May now uses the supplied girl model with vendored @livliv-dev/player 0.3.0 (Apache-2.0; LICENSE and NOTICE included). Supplied natural idle code drives blinking, breathing and bounded gaze. The other two advisors retain their original artwork. The model and all textures are deployed locally. A portrait remains visible while loading or if WebGL fails.

Speaking motion follows browser TTS lifecycle and word-boundary cues, with procedural mouth movement between cues. It is illustrative, not audio-sampled or phoneme-accurate lip sync. Listening closes the mouth. Switching advisors disposes the Player; hidden tabs pause it. Reduced-motion settings disable breathing/sway/gaze motion.

Browser validation: model reached avatar-ready with no console errors, and layout retained history, survey and waveform. Browser TTS did not reliably start in the test environment, so audible lip-sync still needs user verification. Existing five voice lifecycle tests pass.

## Actual-audio lip sync update

The four fixed Ms May advisor replies now use locally generated Microsoft Zira WAV clips (regenerate with scripts/generate-demo-voice.ps1). LivLiv startLipSync analyses the same HTMLAudioElement that plays the clip, driving mouth openness and vowel shape from actual audio. Procedural mouth oscillation has been removed. Unscripted history text still uses browser TTS without pretending to have audio-driven lips. No external TTS service or AI backend was added.

Official Player idle is enabled for breathing, blinking, gaze and sway. A final driver scales head/body movement to 35%; voice motion is 0.35, bounce is false. A deployment copy of model.json enables modest sway/body response; the original supplied package remains untouched. Reduced motion disables sway/head movement. The UI and waveform styling are unchanged.

Browser validation observed avatar-ready, speaking mouth shape during actual WAV playback, and Ready to talk after the clip ended with no console errors. Eight lifecycle tests cover existing recording flow plus audio callbacks, late model readiness after stopping, and playback failure.

## Soft-focus advisory room

Ms May's stage now uses a generated empty campus advisory-room background, with diffuse window light, lavender-blue walls, pale wood shelves and plants. A light lavender tint and subtle avatar shadow blend the layers; the voice card remains legible. Only background CSS and its asset changed; LivLiv motion, lip sync and waveform behaviour are unchanged.

## Closer avatar framing

Ms May uses a closer upper-body camera crop (560 model units versus 760), with a width cap for narrow screens. The voice card is reduced to about 112px and moved lower, revealing more shoulders and torso. Background, motion drivers and audio sync are unchanged. Desktop composition visually checked during playback.

## Ms Lam woman avatar

Ms Lam now loads the supplied woman-rig-v1 model and textures via the shared LivLiv adapter. Ms May retains the girl and Mr Chan retains his illustration. Both photo-style avatars use the advisory room, close framing, official gentle idle and existing audio-driven demo clips (same Zira voice). Source woman-rig-v1 files remain unchanged; only the deployed copy enables the same modest body response. Model loading uses per-advisor configuration and correct canvas width/centre. Browser checked Ms Lam model, portrait, conversation and audio with no console errors; eight lifecycle tests pass.

## Calmer animation transitions

Both Ms Lam and Ms May retain LivLiv official idle targets but now ease body/head transitions over 0.9s, gaze over 0.65s and breathing over 1.2s using frame-rate-independent smoothing. This slows settling and softens sudden changes, rather than altering speech playback or the idle clock. Eye closure and mouth/vowel parameters bypass smoothing, preserving natural blinks and actual-audio lip sync. Reduced-motion settings remain immediate. Syntax check and eight voice lifecycle tests pass.

## Softer mouth transitions

Both photo avatars now smooth actual-audio mouth targets: 100ms opening response, 55ms closing response, and 140ms vowel-shape response (exponential time constants). Stopping playback resets mouth smoothing immediately. Speech speed, idle motion and sound wave are unchanged. These values reduce rapid shape changes while retaining quicker closure on pauses.
