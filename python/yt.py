import os
from pytubefix import YouTube

def download_audio(url, output_path="."):
    yt = YouTube(url)
    
    # Filter for audio-only streams and get the one with the highest bitrate
    audio_stream = yt.streams.filter(only_audio=True).first()
    
    print(f"Downloading audio: {yt.title}")
    
    # Download the file
    out_file = audio_stream.download(output_path=output_path)
    
    # Save the file with a .mp3 extension
    base, ext = os.path.splitext(out_file)
    new_file = base + '.mp3'
    os.rename(out_file, new_file)
    
    print(f"Download complete! Saved as: {new_file}")

url = "https://youtu.be/JqZ7Owwt2Cw?si=Zif0rzFrIkE6EQhn"
download_audio(url)