# Web Programming HW#1

## Run the app (後面有說明進階條件實作內容)

Follow the instructions in this section to run the app locally.

### 1. setup backend `.env`

Start by creating the `.env` file in the backend folder, then fill the `PORT` and  `MONGO_URI` with 8000 and ur MongoDB URL.


```bash
PORT=8000
MONGO_URI="mongodb+srv://<username>:<password>@<cluster>.example.mongodb.net/?retryWrites=true&w=majority"
```

### 2. setup backend node_modules

Do this do bring back the node modules in backend.

```bash
cd backend
yarn install
```

### 3. setup frontend node_modules

Do this do bring back the node modules in frontend.

```bash
cd frontend
yarn install
```

### 4. Run the backend server 

Do this do start the server and connect to MongoDB.

```bash
cd backend
yarn start
```

### 5. Open the website

Open the index.html in the frontend file to open the webapp in the web browser, everything should work fine by now.

## 進階條件實作內容說明

### 1. 限制選取合法日期

透過html中的input設定，限制使用者只能選取合法日期。

```bash
<input type="date" id="diaryDate" />
```

### 2, 利用心情以及標籤篩選日記卡

在前端的script.js中，新增一個篩選日記卡功能，簡言之，選擇欲篩選之心情或標籤，按下篩選按鈕則會開始篩選，Function先在前端將所有日記卡re-render掉，但在前端保留日記卡資料，完成後，跑一個迴圈，若日記卡標籤或心情有符合篩選選擇，便將其render出來，若選擇無(不做任何篩選)，則會re-render畫面所有日記卡，然後利用前端站存的資料將所有日記卡render出來，以達到顯示所有日記卡的效果。


```bash
 FilterDiaryBtn.addEventListener("click", function () {
    //console.log("Filter btn pressed");
    const ThingToFilter = document.getElementById("FilterSelect").value;

    // 刪除所有當前的日記卡片元素
    const diaryCards = document.querySelectorAll("details");
    diaryCards.forEach((card) => card.remove());

    // 檢查ThingToFilter是否為"無"
    if (ThingToFilter === "無") {
      // 重新渲染所有日記條目
      diaryData.forEach((entry) => {
        render_diary(entry);
      });
    } else {
      // 過濾出符合指定心情（或標籤）的日記條目
      const filteredDiaries = diaryData.filter(
        (entry) => entry.mood === ThingToFilter || entry.tag === ThingToFilter,
      );

      // 重新渲染過濾後的日記條目
      filteredDiaries.forEach((entry) => {
        render_diary(entry);
      });
    }
  });
```
## Lint檢查說明

### 1. 檢查frontend
 
```bash
cd frontend
yarn lint
```

### 3. 檢查backend
 
```bash
cd backend
yarn lint
```
