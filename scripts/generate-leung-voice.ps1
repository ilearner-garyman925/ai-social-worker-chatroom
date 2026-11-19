$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Speech
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
$synth.SelectVoice('Microsoft David Desktop')
$synth.Rate = -1
$clips = Get-Content 'dist/assets/voice/leung-clips.json' -Raw | ConvertFrom-Json
try {
 foreach ($entry in $clips.PSObject.Properties) {
  $outputFile = Join-Path (Get-Location) ('dist/' + $entry.Value)
  $text = [System.Security.SecurityElement]::Escape($entry.Name)
  $synth.SetOutputToWaveFile($outputFile)
  $synth.SpeakSsml("<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='en-US'><prosody rate='-15%' pitch='-8%'>$text</prosody></speak>")
  $synth.SetOutputToNull()
 }
} finally { $synth.Dispose() }
