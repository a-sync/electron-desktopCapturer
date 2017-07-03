'use strict';

const sourcesDiv = document.getElementById('sources');
const thumbSize = {width: 300, height: 300};
function getSources (type) {
    window.desktopCapturer.getSources({types: [type], thumbnailSize: thumbSize}, (err, sources) => {
        if (err) {
            console.error('desktopCapturer.getSources error', err);
            throw err;
        }

        console.info('desktopCapturer sources', JSON.stringify(sources, null, 2));

        sourcesDiv.innerHTML = '';
        sources.forEach(dcSource => {
            let item = document.createElement('div');

            let btn = document.createElement('button');
            btn.textContent = `${dcSource.name} (${dcSource.id})`;
            btn.onclick = function () {
                setVideo({
                    audio: false,
                    video: {
                        mandatory: {
                            chromeMediaSource: 'desktop',
                            chromeMediaSourceId: dcSource.id
                        }
                    }
                });
            };

            let img = new Image();
            img.src = dcSource.thumbnail.toDataURL();

            item.appendChild(btn);
            item.appendChild(document.createElement('br'));
            item.appendChild(img);
            sourcesDiv.appendChild(item);
        });
    });
}

const video = document.getElementById('video');
function setVideo (mediaConstraints) {
    navigator.mediaDevices.getUserMedia(mediaConstraints)
        .then(stream => {
            stopVideo();
            video.srcObject = stream;
        })
        .catch(err => {
            console.error('getUserMedia error', err);
            throw err;
        });
}

function stopVideo () {
    if (video.srcObject) {
        video.srcObject.getTracks().forEach(t => {
            t.stop();
        });

        video.srcObject = null;
    }
}

function captureScreen () {
    setVideo({
        audio: false,
        video: {
            mandatory: {
                chromeMediaSource: 'screen'
            }
        }
    });
}