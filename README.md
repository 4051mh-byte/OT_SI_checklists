# SI-Cog CDA (Clinical Decision Architecture)

감각통합·인지 임상 의사결정 통합 시스템 — PWA (Progressive Web App)

## 📦 포함된 모듈

| Phase | 폴더명 | 앱 이름 | 설명 |
|---|---|---|---|
| A | `Phase A - cda-obs1/` | CDA-OBS1 | SI 운동능력 임상관찰 체크리스트 |
| A | `Phase A - cda-obs2/` | CDA-OBS2 | 기초인지 임상관찰 체크리스트 |
| B | `Phase B - cda-flag1/` | CDA-FLAG1 | SI 운동능력 Red Flag & 다학제 의뢰 가이드 |
| B | `Phase B - cda-flag2/` | CDA-FLAG2 | 기초인지 Red Flag & 다학제 팀 공유 가이드 |
| C | `Phase C - cda-std1/` | CDA-STD1 | K-CSP2 감각처리 프로파일 자동 채점기 |
| C | `Phase C - cda-std2/` | CDA-STD2 | K-DTVP-2 시지각 자동 채점기 |
| D | `Phase D - cda-rpt/` | CDA-RPT | SI-Cog 종합 프로파일 리포트 (교차분석 + 차트) |
| E | `Phase E - cda-ace/` | CDA-ACE | 중재 목표 & 활동 추천 엔진 |
| F | `Phase F - cda-msc/` | CDA-MSC | 다회기 비교 분석 |

각 폴더는 독립적인 PWA로, 자체 manifest·service worker·아이콘을 가집니다.

## 🚀 배포 방법 (GitHub Pages)

### 1. Repo 생성
1. GitHub → New repository
2. 이름: `si-cog-cda` (또는 원하는 이름)
3. **Public** 선택 (Pages 무료 사용)
4. Create repository

### 2. 파일 업로드
이 폴더 안의 **모든 파일·하위폴더**를 repo에 업로드합니다.  
웹 UI에서 드래그&드롭 가능 (Add file → Upload files)

또는 git CLI:
```bash
git init
git add .
git commit -m "initial PWA deploy"
git branch -M main
git remote add origin https://github.com/<USERNAME>/si-cog-cda.git
git push -u origin main
```

### 3. Pages 활성화
1. Repo → **Settings** → 좌측 메뉴 **Pages**
2. Source: **Deploy from a branch**
3. Branch: **`main`** / Folder: **`/ (root)`**
4. **Save**
5. 1~2분 후 상단에 URL 표시됨:  
   `https://<USERNAME>.github.io/si-cog-cda/`

### 4. 갤럭시 탭 / iPad에서 PWA 설치
1. Chrome (Android) 또는 Safari (iOS)로 위 URL 접속
2. 원하는 모듈 선택 후 페이지 로드 대기 (5~10초)
3. **Android Chrome**: 우측 상단 ⋮ → **"앱 설치"** 또는 **"홈 화면에 추가"**
4. **iOS Safari**: 하단 공유 버튼(□↑) → **"홈 화면에 추가"**
5. 홈 화면에 독립 앱으로 추가됨, 오프라인에서도 작동

## 🎨 아이콘 교체

각 폴더의 `icon-192.png`, `icon-512.png`를 같은 파일명으로 덮어쓰면 됩니다.  
현재는 임시 단색 아이콘이 들어 있습니다.

## 🔄 콘텐츠 업데이트 시

HTML을 수정하고 push하면 자동 재배포됩니다 (1~2분 소요).

**단**, Service Worker가 캐시한 옛날 버전이 보일 수 있습니다.  
그럴 땐 해당 폴더의 `sw.js` 안의 `CACHE` 버전 문자열을 올려서 push하세요.  
예: `'obs1-v2'` → `'obs1-v3'`

## ⚠️ "앱 설치" 메뉴가 안 보일 때

1. 주소창이 `https://`로 시작하는지 확인 (`http://`나 `file://`은 ❌)
2. 시크릿 탭이 아닌 일반 탭에서 열기
3. PC Chrome으로 같은 URL 열고 **F12 → Application → Manifest** 탭에서 에러 확인
4. 5~10초 더 기다려보기 (Chrome이 manifest+SW 검증 중)
