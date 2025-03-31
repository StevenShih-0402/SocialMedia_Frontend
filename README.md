# Social Media - Frontend

> Backend：https://github.com/StevenShih-0402/SocialMedia_Backend

Note:
- localhost:3000
- 電話號碼有欄位驗證，必須輸入09開頭的10碼數字。且註冊時不能註冊重複的電話號碼
- 登入後右下角的箭頭按鈕，可以直接滑動到頁面最上層或最下層。
- 貼文依照最後更新時間由新到舊排序。

使用情境：

<details>
<summary>用戶在註冊帳號後可以直接登入系統，若已經註冊過，可以輸入電話號碼與密碼登入。登入後，可以看到系統內所有人的貼文，並在貼文底下留言，也可以自己發布文章給其他用戶看。</summary>

![image](https://github.com/user-attachments/assets/4152d913-c853-4f59-afb7-a8eb40940a06)
![image](https://github.com/user-attachments/assets/3c705b86-11be-4908-a897-2e2da10b4d76)

</details>
具體來說，可以使用的功能包含：

<details>
<summary> 1. 查看用戶資訊(點選右上角按鈕，按鈕名稱會和目前登入的用戶姓名一樣。)</summary>
   
   ![image](https://github.com/user-attachments/assets/26eb14a9-54a1-4a56-8f85-07ce6602d343)
</details>

<details>
<summary> 2. 發布文章(點選"發文"按鈕，新增文章後會自動新增一則包含發文時間的留言。)，發布後重新整理頁面。</summary>
   
   ![image](https://github.com/user-attachments/assets/7697de23-f00a-4ab8-a314-43517d9cdde4)
</details>

<details>
<summary> 3. 登出</summary>

   ![image](https://github.com/user-attachments/assets/095dd7c0-e3fe-42d8-a6eb-3d26fc194d61)
</details>

<details>
<summary>4. 查看系統內的所有文章 (有設計分頁，頁面最初只顯示5筆最新的貼文，滑動到頁面最底部才會繼續加載。)</summary>

   <details>
   <summary>4.1. 查看文章內的所有留言</summary>
      
   ![image](https://github.com/user-attachments/assets/ffaa78e7-1dcb-48bd-a0b3-4f9c135fb1bf)

   </details>
   
   <details>
   <summary>4.2. 在輸入欄對文章發送留言</summary>
      
   ![image](https://github.com/user-attachments/assets/3740832e-b21e-4cd9-adc7-3ca80e002529)

   </details>
   
   <details>
   <summary>4.3. 編輯文章(只有發文者可以編輯)，編輯後重新整理頁面，並在貼文新增一則更新時間的留言。</summary>
      
   ![image](https://github.com/user-attachments/assets/d280e602-4b45-4470-84a0-abb9b5380545)
   ![image](https://github.com/user-attachments/assets/3dc6710d-5bf1-40f3-a758-05be4d565937)
   ![image](https://github.com/user-attachments/assets/92730bab-bce0-402a-be8a-a1a292b9977c)

   </details>
   
   <details>
   <summary>4.4. 刪除文章(只有發文者可以刪除)，刪除後重新整理頁面</summary>
      
   ![image](https://github.com/user-attachments/assets/5cd34cae-8838-47e0-9ed2-c32d166fcdd0)

   </details>
</details>

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
