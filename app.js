'use strict';

const sourcesDiv = document.getElementById('sources');
const thumbSize = {width: 300, height: 300};
function getSources(type) { // eslint-disable-line no-unused-vars
    window.desktopCapturer.getSources({types: [type], thumbnailSize: thumbSize}, (err, sources) => {
        if (err) {
            console.error('desktopCapturer.getSources error', err);
            alert(JSON.stringify(err, null, 2)); // eslint-disable-line no-alert
        } else {
            console.info('desktopCapturer sources', JSON.stringify(sources, null, 2));

            sourcesDiv.innerHTML = '';
            sources.forEach(dcSource => {
                const item = document.createElement('div');

                const btn = document.createElement('button');
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

                const img = new Image();
                img.src = dcSource.thumbnail.toDataURL();

                item.appendChild(btn);
                item.appendChild(document.createElement('br'));
                item.appendChild(img);
                sourcesDiv.appendChild(item);
            });
        }
    });
}

const video = document.getElementById('video');
function setVideo(mediaConstraints) {
    stopVideo();
    navigator.mediaDevices.getUserMedia(mediaConstraints)
        .then(stream => {
            video.srcObject = stream;
        })
        .catch(err => {
            console.error('getUserMedia error', err);
            alert(JSON.stringify(err, null, 2)); // eslint-disable-line no-alert
        });
}

function stopVideo() {
    if (video.srcObject) {
        video.srcObject.getTracks().forEach(t => {
            t.stop();
        });

        video.srcObject = null;
    }
}

function captureScreen() { // eslint-disable-line no-unused-vars
    setVideo({
        audio: false,
        video: {
            mandatory: {
                chromeMediaSource: 'screen'
            }
        }
    });
}
