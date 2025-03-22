# Web Programming #1

## Run the app (Advanced implementation details explained below)

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

## Advanced Implementation Details

### 1. Restricting Valid Date Selection

Through HTML input settings, users are restricted to selecting only valid dates.

```bash
<input type="date" id="diaryDate" />
```

### 2, Filtering Diary Cards by Mood and Tags

In the frontend's script.js, a diary card filtering function has been added. In short, select the mood or tag to filter, then press the filter button to begin filtering. The function first re-renders all diary cards from the frontend while preserving the diary card data. After completion, it runs a loop - if a diary card's tag or mood matches the filter selection, it will be rendered. If "None" is selected (no filtering), all diary cards will be re-rendered on the screen using the data stored in the frontend, achieving the effect of displaying all diary cards.


```bash
 FilterDiaryBtn.addEventListener("click", function () {
    //console.log("Filter btn pressed");
    const ThingToFilter = document.getElementById("FilterSelect").value;

    // Delete all current diary card elements
    const diaryCards = document.querySelectorAll("details");
    diaryCards.forEach((card) => card.remove());

    // Check if ThingToFilter is "None"
    if (ThingToFilter === "無") {
      // Re-render all diary entries
      diaryData.forEach((entry) => {
        render_diary(entry);
      });
    } else {
      // Filter diary entries that match the specified mood (or tag)
      const filteredDiaries = diaryData.filter(
        (entry) => entry.mood === ThingToFilter || entry.tag === ThingToFilter,
      );

      // Re-render the filtered diary entries
      filteredDiaries.forEach((entry) => {
        render_diary(entry);
      });
    }
  });
```
## Lint Check Instructions

### 1. Check frontend
 
```bash
cd frontend
yarn lint
```

### 3. Check backend
 
```bash
cd backend
yarn lint
```
