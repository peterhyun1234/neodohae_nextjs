## Service Introduction and Download Guide

<br/>

https://neodohae.com/

<br/>

너도해는 룸메이트와의 생활 중 발생할 수 있는 불편함을 최소화하고, 보다 행복한 생활을 지원하기 위해 만들어진 서비스입니다. 이 서비스는 **PWA (Progressive Web App)** 기술을 활용하여 제작되었으므로, 웹 브라우저를 통해 바로 사용할 수 있으면서도, 네이티브 앱처럼 푸시 알림과 같은 기능을 지원합니다.

따라서, 사용자는 아래의 방법을 통해 너도해를 **Desktop/Mobile 어플리케이션**처럼 경험할 수 있습니다.

<br/>

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
  - [3.2. API Documentation](#32-api-documentation)
  - [3.3. API Server Interaction](#33-api-server-interaction)
  - [3.4. Group Room Chatting](#34-group-room-chatting)
  - [3.5. Push Notification](#35-push-notification)
- [4. How to use](#4-how-to-use)
- [Contacts](#contacts)


## 1. Feature Introduction

### 1.1. 개인별 스케줄 공유 및 조율
- **룸메이트 일정 확인**
- **공동 활동/중요 일정 조율**

<img src="https://github.com/peterhyun1234/neodohae_nextjs/assets/46476398/cb65e83e-d923-40c4-b052-08e643ef69c0" width="280" />


### 1.2. 공동 의무 관리 기능
- **공동 의무 자동 분배**
  - 청소, 설거지와 같은 공동 의무에 할당할 인원을 자동으로 분배 가능
- **반복 설정**
  - 매일, 매주 등으로 반복되는 할 일에 대해서 반복 설정 가능

<img src="https://github.com/peterhyun1234/neodohae_nextjs/assets/46476398/a5376534-f7d9-42e0-92a5-e146ab972323" width="280" />


### 1.3. 소통 채널(그룹 채팅) 제공

<img src="https://github.com/peterhyun1234/neodohae_nextjs/assets/46476398/127c2b3c-abfc-4cb1-b037-37c03d129da9" width="280" />

## 2. DevOps
### 2.1. DevOps pipeline

![image](https://github.com/peterhyun1234/neodohae_nextjs/assets/46476398/dff5ccdf-22c9-4a61-93e1-82f4803c0df9)

### 2.2. API Health Test
- 1분마다 각 API 호출을 통해서 서비스의 상태를 파악하고 관리자에게 알림을 보내는 시스템 구현

![image](https://github.com/peterhyun1234/neodohae_nextjs/assets/46476398/5e79b0b5-07ad-439b-bd6a-e64254c06600)


### 2.3. Monitoring
- Grafana, Loki, Promtail 기반 서버와 컨테이너의 메트릭, 로그를 수집하고 가시화하고 특정 상황에 맞게 알림 전송

![image](https://github.com/peterhyun1234/neodohae_nextjs/assets/46476398/482a85eb-95af-4b8f-b08c-e8a5dd88541e)

### 2.4. CI/CD pipeline
- Github actions를 통해서 ECR에 이미지가 저장되고, ArgoCD를 통해서 무중단 배포

![image](https://github.com/peterhyun1234/neodohae_nextjs/assets/46476398/cad3bdee-98ba-4e39-a08b-f1c99693e8eb)


## 3. Service Architecture
### 3.1. Infrastructure

<img src="https://github.com/peterhyun1234/neodohae_nextjs/assets/46476398/dd5cec9c-5ff5-4f67-8ac8-706799aa02c8" width="800" alt="Infrastructure">

### 3.1. API Server Interaction

<img src="https://github.com/peterhyun1234/neodohae_nextjs/assets/46476398/4aed92da-7187-4668-99ab-811bc2b67dc3" width="500" alt="API Server Interaction">

### 3.2. API Documentation
- Swagger를 통한 REST API 문서화

<img src="https://github.com/peterhyun1234/neodohae_nextjs/assets/46476398/46a89353-c4c1-4a2a-9cca-4179e075aa93" width="500" alt="Documentation">

### 3.3. Group(Room) Chatting

<img src="https://github.com/peterhyun1234/neodohae_nextjs/assets/46476398/0578a306-3eab-4103-baf6-521a68da1ca2" width="500" alt="Group(Room) Chatting">

### 3.4. Push Notification

<img src="https://github.com/peterhyun1234/neodohae_nextjs/assets/46476398/152748e5-549a-46aa-b5c5-540e5cf491bd" width="500" alt="Push Notification">


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
