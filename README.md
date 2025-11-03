# YouTube-Watch-History-Notifier

유튜브의 시청기록을 감지하고, 이미 본 영상이면 토스트 메시지로 알려주는 Tampermonkey 스크립트

⚙️ 작동 방식

1. 페이지 이동 감시
유튜브는 SPA(단일 페이지 앱)이므로 URL 변화만 감지하는 것이 아니라
MutationObserver로 DOM 변경을 감시해 영상이 바뀌면 자동 인식.

2. 시청기록 저장
localStorage에 { videoId: timestamp } 형식으로 저장.

3. 재생 감지
영상이 5초 이상 재생되면 "시청 완료"로 간주해 기록 추가.

4. 알림 표시
이미 본 영상이면: ⚠ “이미 시청한 영상입니다.”
처음 보는 영상이면: ▶ “새로운 영상 시청 시작”