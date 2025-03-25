# Social Media - Frontend

Note:
- localhost:3000
- 電話號碼有欄位驗證，必須輸入09開頭的10碼數字。且註冊時不能註冊重複的電話號碼

登入系統後有以下功能可以使用：
1. 查看用戶資訊(點選右上角藍色按鈕，按鈕名稱會和目前登入的用戶姓名一樣。)
2. 發布文章(點選"發文"按鈕，新增文章後會自動新增一則包含發文時間的留言。)
3. 登出
4. 查看系統內的所有文章

   4.1. 查看文章內的所有留言
   
   4.2. 在輸入欄對文章發送留言
   
   4.3. 編輯文章(只有發文者可以編輯)
   
   4.4. 刪除文章(只有發文者可以刪除)

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
