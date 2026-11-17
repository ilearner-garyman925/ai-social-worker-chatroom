Add-Type -AssemblyName System.Speech
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
$synth.SelectVoice('Microsoft Zira Desktop')
$synth.Rate = -1
$clips = Get-Content 'dist/assets/voice/clips.json' -Raw | ConvertFrom-Json
foreach ($entry in $clips.PSObject.Properties) {
 $outputFile = Join-Path (Get-Location) ('dist/' + $entry.Value)
 $synth.SetOutputToWaveFile($outputFile)
 $synth.Speak($entry.Name)
 $synth.SetOutputToNull()
}
$synth.Dispose()
