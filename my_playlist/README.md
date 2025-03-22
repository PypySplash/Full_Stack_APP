# Web Programming #2

## Run the APP

Follow the instructions in this section to run the app locally.

### 0. node.js setup

Please make sure you have installed Node.js (students taking this course should already have it installed). If not, please refer to the published `HW0`. You can check by entering the following command:

```bash
node -v
# This will display your node version, which varies by user
```

It's recommended not to use a version of Node that is too new, as it might cause errors.

If you can't start the Server by following the steps below, please try changing your Node version to `v18.17.1`. Thank you.

If you're using fnm as your version manager, you can enter the following command to switch your Node version:

```bash
fnm use v18.17.1
```

If you're using `nvm`, please enter the following command:

```bash
nvm use v18.17.1
```

### 1. Install dapendencies

Install yarn in both /frontend and /backend directories

```bash
#in /hw2
cd frontend
yarn
cd ..
cd backend
yarn
```

### 2. setup backend `.env`

Start by copying the `.env.example` file to `.env`.

```bash
#in /hw2
cd backend
cp .env.example .env
```

Then, fill in the `MONGO_URL` field in `.env` with your MongoDB connection string and fill in the `PORT` field with the port you want to use. After that, you're `.env` file should look like this.

```bash
#in /backend/.env
PORT=8000
MONGO_URL="mongodb+srv://<username>:<password>@<cluster>.example.mongodb.net/?retryWrites=true&w=majority"
```

### 3. setup frontend `.env`

Start by copying the `.env.example` file to `.env`.

```bash
#in /hw2
cd frontend
cp .env.example .env
```

Then, fill in the `VITE_API_URL` field in `.env` with the url of your backend server. After that, you're `.env` file should look like this. Note that the `port` should be the same as the one you set in the backend `.env` file.

```bash
#in /frontend/.env
VITE_API_URL="http://localhost:8000/api"
```

### 4. start the backend server

Go to the /backend directory and execute the following command:

```bash
#in /backend
yarn dev
```

You should see a message similar to the following, indicating that the backend server has successfully started and connected to MongoDB:

```bash
Connected to MongoDB
Server running on port http://localhost:8000
```

### 5. start the frontend server

Go to the /frontend directory and execute the following command:

```bash
#in /frontend
yarn dev
```

Visit `http://localhost:5173` to see the app in action. That's it, you're done!

If no warning or error messages appear, it means the website has successfully started!

### 6. clear your mongodb

Please clear your MongoDB to avoid issues with the Schema not matching your database's existing content, which could cause the APP to malfunction.

Additionally, if you have problems communicating with the backend Server, please triple-check the settings or spelling in backend/.env (for example, check for unnecessary semicolons at the end of the URL).

## APP Usage Instructions

### **_PERFECT Requirements_**

1. User Prompts: When users fail to input information or perform incorrect operations, provide appropriate prompts. For example, when users add or edit a list without entering a title, a popup should prompt "Please enter a title."
使用者提示: 當使用者未輸入資訊或是進行錯誤操作時，給予適當提示。例如使用者新增或編輯清單時，未輸入標題，以彈窗提示「請輸入標題」。

2. Duplicate Name Detection: When adding playlists and songs, playlist names cannot be duplicated, and song names within the same playlist cannot be duplicated.
重複名稱檢測: 新增播放清單與歌曲時，播放清單名稱不可重複，同一播放清單內的歌曲名稱不可重複。



### Home Page

1. Title Bar: "WP Music" is displayed at the top of the page, with "My Playlists" displayed below it.
2. Each playlist is displayed at the bottom of the page, showing the playlist image, number of songs, and playlist name.
3. Clicking on a playlist image opens the corresponding playlist page, where you can browse its contents.
4. The page supports responsive web design (RWD), and the number of playlists per row will adjust based on screen size.
5. There are ADD and DELETE buttons in the upper right corner of the page, corresponding to the functions of adding and deleting playlists.
6. ADD Button: When clicked, a popup window appears where users can enter a playlist name and description. After completing the input, a new playlist will appear on the home page. Pressing CANCEL returns to the home page.
7. DELETE Button: When clicked, it enters delete mode, and the button text changes to DONE. A red delete button appears in the upper right corner of each playlist; clicking it deletes that playlist. Clicking the DONE button again makes the delete buttons disappear from the playlists, and the button text changes back to DELETE.



### Playlist Page

1. The playlist's image, title, and description are displayed at the top of the page.
2. Both the playlist title and description can be edited. Clicking on the title or description text will display an editing field. The content is automatically saved and updated when you leave the field.
3. The songs in the playlist are displayed at the bottom of the screen. The first column has a Checkbox and titles for each row.
4. You can clearly see each song's title, artist, and song link. Song links are clickable and open in a new window. Each song has a Checkbox on the far left for selection. The Checkbox in the first column has a select-all function.
5. There is an edit button on the far right of each song's information. Clicking it opens a popup window where users can edit the song name, artist, and link.
6. In song editing mode, you can also add the song to other playlists by selecting the desired playlist from the list. After confirming, the song will be automatically added to the selected playlist (while remaining in the original playlist).
7. The page supports responsive web design (RWD), and the width of text and song lists will adjust based on screen size.
8. There are ADD and DELETE buttons to the right of the playlist description, corresponding to the functions of adding and deleting songs.
9. ADD Button: When clicked, a popup window appears where users can enter a song name, artist, and song link. After completing the input, a new song will appear on the playlist page. Pressing CANCEL returns to the playlist page.
10. DELETE Button: When clicked, a popup appears listing all checked songs and asking the user "Are you sure you want to delete?" If the user selects YES, all selected songs will be deleted. If they select NO, the deletion is canceled and they return to the playlist page.
11. If no songs are selected when the DELETE button is pressed, a prompt will appear saying "Please select songs."



### 首頁

1. 標題欄: WP Music 顯示於頁面上方，My Playlists 顯示於其下。
2. 各播放清單顯示於頁面下方，可看到清單圖片、歌曲數量、清單名稱。
3. 點擊清單圖片後即開啟對應之播放清單頁，可瀏覽其內容。
4. 頁面支援響應式設計(RWD)，每列之清單數量會根據螢幕大小進行調整。
5. 頁面右上方有 ADD 與 DELETE 按鈕，分別對應新增播放清單與刪除播放清單之功能。
6. ADD 按鈕。點擊後彈出視窗，使用者可輸入清單名稱與敘述，完成輸入後在首頁看到新的播放清單。若按 CANCEL 則返回首頁。
7. DELETE 按鈕。點擊後進入刪除模式，按鈕上文字變為 DONE。每個清單的右上角會出現紅色刪除按捻，點擊後該播放清單即被刪除。再次點擊 DONE 按鈕後，清單右上角之刪除按鈕消失，按鈕上文字也變回 DELETE。

### 播放清單頁

1. 頁面上方顯示播放清單之圖片、標題與敘述。
2. 播放清單之標題與敘述皆可編輯，點擊標題與敘述之文字便會出現編輯的欄位，離開欄位即自動儲存並更新內容。
3. 畫面下方顯示播放清單內之歌曲資訊。首欄有一個 Checkbox 與各行之標題。
4. 可以清楚看到各個歌曲之標題、歌手、與歌曲連結。歌曲連結可點擊，並以新視窗開啟。每個歌曲最左方有一個 Checkbox 可選取。而首欄之 Checkbox 具有全選功能。
5. 每個歌曲資訊的最右方有一個編輯按鍵，點擊後彈出視窗，使用者可編輯歌曲名稱、歌手與連結。
6. 在歌曲編輯模式下，亦可將歌曲新增置其他清單，於列表中選擇欲新增歌曲之清單，按下確認後即會在選擇之播放清單中自動新增(歌曲仍保留於原播放清單)。
7. 頁面支援響應式設計(RWD)，文字以及歌曲列表之寬度會根據螢幕大小進行調整。
8. 播放清單敘述之右方有 ADD 與 DELETE 按鈕，分別對應新增播放清單與刪除播放清單之功能。
9. ADD 按鈕。點擊後彈出視窗，使用者可輸入歌曲名稱、歌手與歌曲連結，完成輸入後在播放清單頁看到新的歌曲。若按 CANCEL 則返回播放清單頁。
10. DELETE 按鈕。點擊後跳出彈窗，將所有被勾選的歌曲資訊列出。並詢問使用者「是否確定刪除」。若使用者選擇 YES 則刪除所有已選取之歌曲，若否則取消刪除，返回播放清單頁。
11. 若無歌曲被全選時按下 DELETE 按鈕，則會提示「請勾選歌曲」。
