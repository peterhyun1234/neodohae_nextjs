# neodohae_nextjs
https://neodohae.com/

## Service Introduction and Download Guide
- TODO: PWA(푸시알림등) 내용 추가해서 너도해 한줄 설명 필요

![image](https://github.com/peterhyun1234/neodohae_nextjs/assets/46476398/c325ffce-8c0c-44b3-b984-ef77f2fab8a7)


## Table of Contents

- [1. Feature Introduction](#1-feature-introduction)
  - [1.1. 개인별 스케줄 공유 및 조율](#11-개인별-스케줄-공유-및-조율)
  - [1.2. 공동 의무 관리 기능](#12-공동-의무-관리-기능)
  - [1.3. 소통 채널(그룹 채팅) 제공](#13-소통-채널그룹-채팅-제공)
- [2. DevOps](#2-devops)
  - [2.1. DevOps pipeline](#21-devops-pipeline)
  - [2.2. API Health Test](#22-api-health-test)
  - [2.3. Monitoring](#23-monitoring)
  - [2.4. CI/CD pipeline](#24-cicd-pipeline)
- [3. Service Architecture](#3-service-architecture)
  - [3.1. Infrastructure](#31-infrastructure)
  - [3.2. API Server Interaction](#32-api-server-interaction)
  - [3.3. Group Room Chatting](#33-group-room-chatting)
  - [3.4. Push Notification](#34-push-notification)
- [4. How to use](#4-how-to-use)
- [Contacts](#contacts)


## 1. Feature Introduction

### 1.1. 개인별 스케줄 공유 및 조율
- **룸메이트 일정 확인**
- **공동 활동/중요 일정 조율**
- TODO: 기능에 대한 gif

### 1.2. 공동 의무 관리 기능
- **공동 의무 자동 분배**
  - 청소, 설거지와 같은 공동 의무에 할당할 인원을 자동으로 분배 가능
- **반복 설정**
  - 매일, 매주 등으로 반복되는 할 일에 대해서 반복 설정 가능
- TODO: 기능에 대한 gif

### 1.3. 소통 채널(그룹 채팅) 제공
- TODO: 기능에 대한 gif

## 2. DevOps
### 2.1. DevOps pipeline

![image](https://github.com/peterhyun1234/neodohae_nextjs/assets/46476398/dff5ccdf-22c9-4a61-93e1-82f4803c0df9)

### 2.2. API Health Test
- 1분마다 각 API 호출을 통해서 서비스의 상태를 파악하고 관리자에게 알림을 보내는 시스템 구현

![image](https://github.com/peterhyun1234/neodohae_nextjs/assets/46476398/5e79b0b5-07ad-439b-bd6a-e64254c06600)


### 2.3. Monitoring
http://grafana.neodohae.com/

![image](https://github.com/peterhyun1234/neodohae_nextjs/assets/46476398/482a85eb-95af-4b8f-b08c-e8a5dd88541e)

### 2.4. CI/CD pipeline
http://argo.neodohae.com/

![image](https://github.com/peterhyun1234/neodohae_nextjs/assets/46476398/cad3bdee-98ba-4e39-a08b-f1c99693e8eb)

## 3. Service Architecture
### 3.1. Infrastructure

![Untitled (3)](https://github.com/peterhyun1234/neodohae_nextjs/assets/46476398/dd5cec9c-5ff5-4f67-8ac8-706799aa02c8)

### 3.1. API Server Interaction

![Untitled](https://github.com/peterhyun1234/neodohae_nextjs/assets/46476398/4aed92da-7187-4668-99ab-811bc2b67dc3)

### 3.1. Group(Room) Chatting

![Untitled (1)](https://github.com/peterhyun1234/neodohae_nextjs/assets/46476398/0578a306-3eab-4103-baf6-521a68da1ca2)

### 3.1. Push Notification

![Untitled (2)](https://github.com/peterhyun1234/neodohae_nextjs/assets/46476398/152748e5-549a-46aa-b5c5-540e5cf491bd)


## 4. How to use
```bash

# Clone this repo
git clone https://github.com/peterhyun1234/neodohae_nextjs.git

# Create a files named `.env.development` and `.env.production` in the root directory of your project.
# Open the files and add the following environment variables:
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
KAKAO_CLIENT_ID
KAKAO_CLIENT_SECRET
NAVER_CLIENT_ID
NAVER_CLIENT_SECRET
SSO_GITHUB_CLIENT_ID
SSO_GITHUB_CLIENT_SECRET
NEXTAUTH_URL
NEXTAUTH_SECRET
JWT_SECRET
API_SERVER_URI
PORT
VAPID_PUBLIC_KEY

# Run
npm run dev
```

## Contacts
- email: peterhyun1234@gmail.com
- https://peterjeon.co.kr/
