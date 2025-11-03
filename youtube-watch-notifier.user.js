// ==UserScript==
// @name         YouTube Watch History Notifier
// @namespace    https://github.com//FeelsBotMan/YouTube-Watch-History-Notifier
// @version      1.0
// @description  Show toast notification if the video has already been watched
// @author       FeelsBotMan
// @match        https://www.youtube.com/*
// @grant        GM_addStyle
// ==/UserScript==

(function () {
  'use strict';

  // 로컬스토리지 키
  const STORAGE_KEY = 'yt_watched_videos';
  const TOAST_ID = 'yt-toast-notification';

  // 간단한 토스트 스타일 추가
  GM_addStyle(`
    #${TOAST_ID} {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: rgba(0,0,0,0.8);
      color: #fff;
      padding: 12px 18px;
      border-radius: 8px;
      font-size: 14px;
      z-index: 99999;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    #${TOAST_ID}.show {
      opacity: 1;
    }
  `);

  // 토스트 표시 함수
  function showToast(message) {
    let toast = document.getElementById(TOAST_ID);
    if (!toast) {
      toast = document.createElement('div');
      toast.id = TOAST_ID;
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }

  // 시청기록 불러오기
  function getWatched() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch {
      return {};
    }
  }

  // 시청기록 저장
  function saveWatched(id) {
    const watched = getWatched();
    watched[id] = Date.now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(watched));
  }

  // 현재 영상 ID 가져오기
  function getVideoId() {
    const url = new URL(location.href);
    return url.searchParams.get('v');
  }

  // 페이지 변경 감시 (YouTube SPA 대응)
  let lastVideoId = null;
  const observer = new MutationObserver(() => {
    const currentId = getVideoId();
    if (!currentId || currentId === lastVideoId) return;

    lastVideoId = currentId;
    const watched = getWatched();

    // 이미 본 영상인지 확인
    if (watched[currentId]) {
      showToast('⚠ 이미 시청한 영상입니다.');
    } else {
      showToast('▶ 새로운 영상 시청 시작');
    }

    // 5초 이상 재생 시 본 것으로 기록
    let recorded = false;
    const checkInterval = setInterval(() => {
      const player = document.querySelector('video');
      if (!player) return;
      if (player.currentTime > 5 && !recorded) {
        saveWatched(currentId);
        recorded = true;
      }
      // 영상이 변경되면 중단
      if (getVideoId() !== currentId) clearInterval(checkInterval);
    }, 2000);
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
