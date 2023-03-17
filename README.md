# electron-RTMP
## To Use

To clone and run this repository you'll need [Git](https://git-scm.com) and [ffmpeg](https://ffmpeg.org/) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
git clone https://github.com/rChinnnn/electron-RTMP
# Go into the repository
cd electron-RTMP
# Install dependencies
npm install
# Run the app
npm start
```

### 將要測試直播的 mp4 檔案放入根目錄，並命名為 source.mp4，接著透過 ffmpeg 假裝是直播主透過 RTMP 協定進行推流

```bash
# -stream_loop -1 為重複推送指令，使直播不間斷
ffmpeg -re -stream_loop -1 -i source.mp4 -c copy -f flv rtmp://localhost/live/mark
```

### 接下來我們只要指定某個直播主就好，像上面這個直播主是用 mark 串流，在 Electron 頁面中輸入 mark 並且點選 Load，即可觀看直播

## License

[CC0 1.0 (Public Domain)](LICENSE.md)
