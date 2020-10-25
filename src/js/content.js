// import ParadifySpotifyAddContainer from './Content/ParadifySpotifyAddContainer.jsx';
import AddIconIntoPlayerBar from './Content/AddIconIntoPlayerBar.jsx';
import React from 'react';
import { render } from 'react-dom';
import { paradify } from './utils';

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message != undefined) {
    if (message.type == 'getTrackInfo') {
      var trackInfo = paradify.getTrackInfo(message.url);
      sendResponse(trackInfo);
    } else if (message.type == 'contextMenuClicked') {
      var returnUrl = paradify.contextMenuClicked(
        message.details.selectionText
      );
      sendResponse(returnUrl);
    }
  }
});

const injectParadifyAddContainer = () => {
  const paradifySpotifyAddContainer = window.document.createElement('div');
  paradifySpotifyAddContainer.id = 'paradify-spotify-add-container';
  paradifySpotifyAddContainer.style.cssText = 'display: none;';

  window.document.body.appendChild(paradifySpotifyAddContainer);
  render(
    <AddIconIntoPlayerBar />,
    window.document.getElementById('paradify-spotify-add-container'),
    function () {
      var spotifyButton = window.document.getElementById(
        'paradify-spotify-add-container'
      ).firstChild;
      try {
        const menuContainer = window.document.querySelector(
          '.ytp-chrome-controls .ytp-right-controls'
        );
        menuContainer.insertBefore(spotifyButton, menuContainer.firstChild);
      } catch (err) {
        console.log(err);
        paradifySpotifyAddContainer.style.cssText =
          'opacity: 1; right: 10px !important; position: fixed !important; bottom: 50px !important; margin: 5px; background-color: transparent; display: ;';
      }
    }
  );
};

const loadInjection = () => {
  injectParadifyAddContainer();
};

const onLoad = () => {
  paradify.pageLoad();

  setTimeout(() => {
    loadInjection();
  }, 2000);
};

window.addEventListener('load', onLoad, false);
