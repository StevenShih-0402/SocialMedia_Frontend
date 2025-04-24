# 📱 Social Media - Frontend

本專案為簡易社群媒體系統的前端專案，使用 Vue 開發，提供使用者註冊、登入、發文、留言、編輯貼文等互動功能。

🔗 後端專案：[SocialMedia_Backend](https://github.com/StevenShih-0402/SocialMedia_Backend)

---

## 🧰 技術說明

| 技術 | 說明 |
|------|------|
| 前端框架 | Vue |
| 預設埠號 | `localhost:3000` |
| UI 行為 | - 下拉選單<br>- 按鈕狀態控制<br>- 一鍵滑動至頁首/頁尾功能<br>- 貼文依照「最後更新時間」排序，由新到舊 |

---

## 👥 使用情境

使用者註冊後即可登入系統，若已有帳號則可直接輸入電話與密碼登入。登入後可：

- 查看所有用戶的貼文
- 對貼文留言
- 發布新貼文讓其他人互動

![流程圖](https://github.com/user-attachments/assets/546359e5-fdf3-402a-8f9a-73173cb50f6e)

---

## 🧩 功能介紹

### ✅ 帳號管理

<details>
<summary>🔐 註冊 / 登入 / 登出 / 用戶資訊</summary>
   
- 電話需符合格式驗證（09 開頭、10 碼數字）
- 不可註冊重複的電話
- 登入後右上角顯示用戶姓名，點選可查看帳號資訊
- 可透過按鈕登出系統
   
![用戶登入](https://github.com/user-attachments/assets/4152d913-c853-4f59-afb7-a8eb40940a06)
![用戶註冊](https://github.com/user-attachments/assets/3c705b86-11be-4908-a897-2e2da10b4d76)
![登出介面](https://github.com/user-attachments/assets/095dd7c0-e3fe-42d8-a6eb-3d26fc194d61)
![用戶資訊](https://github.com/user-attachments/assets/9dc560e9-277d-4b76-a51f-81fda01eb147)

</details>

---

### 📝 發文互動

<details>
<summary>🧾 發布貼文</summary>

- 點選「發文」按鈕後可新增新文章
- 發文後系統自動新增一則含時間的留言
- 發布完成後請手動重新整理頁面

![發文畫面](https://github.com/user-attachments/assets/7697de23-f00a-4ab8-a314-43517d9cdde4)

</details>

<details>
<summary>📄 查看所有貼文</summary>

- 採用分頁載入設計，初始顯示最新 5 筆貼文
- 滑動至頁面底部後自動載入更多貼文

![查看留言](https://github.com/user-attachments/assets/ffaa78e7-1dcb-48bd-a0b3-4f9c135fb1bf)

<details>
<summary>💬 查看與發送留言</summary>

- 貼文內可查看所有留言
- 使用者可輸入留言回應該貼文

![發送留言](https://github.com/user-attachments/assets/3740832e-b21e-4cd9-adc7-3ca80e002529)

</details>

<details>
<summary>✏️ 編輯貼文（僅限本人）</summary>

- 點選「編輯」後可修改貼文內容
- 編輯完成會新增一則更新時間的留言
- 修改後自動重新整理頁面

![編輯前](https://github.com/user-attachments/assets/d280e602-4b45-4470-84a0-abb9b5380545)
![編輯後](https://github.com/user-attachments/assets/3dc6710d-5bf1-40f3-a758-05be4d565937)
![更新留言](https://github.com/user-attachments/assets/92730bab-bce0-402a-be8a-a1a292b9977c)

</details>

<details>
<summary>🗑 刪除貼文（僅限本人）</summary>

- 使用者可刪除自己的貼文
- 刪除後自動重新整理頁面

![刪除貼文](https://github.com/user-attachments/assets/5cd34cae-8838-47e0-9ed2-c32d166fcdd0)

</details>
</details>

---

## 🚀 專案啟動方式

### 📦 安裝套件
```bash
npm install
```

### 🔥 啟動本地開發伺服器
```bash
npm run serve
```

### 📦 打包正式版
```bash
npm run build
```

### 🧹 調整格式與修復 Lint 問題
```bash
npm run lint
```

🔧 更多設定請參考：[Vue CLI 官方文件](https://cli.vuejs.org/config/)
