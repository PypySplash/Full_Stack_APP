const itemTemplate = document.querySelector("#diary-card-template");
const diaryList = document.querySelector("#diarycontainer");

/* global axios */
const instance = axios.create({
  baseURL: "http://localhost:8000/api",
});

document.addEventListener("DOMContentLoaded", function () {
  // 获取各个页面元素

  const addDiaryBtn = document.getElementById("addDiaryBtn");
  const closeAddDiaryModal = document.getElementById("closeAddDiaryModal");
  const saveDiaryBtn = document.getElementById("saveDiaryBtn");
  const closeEditDiaryModal = document.getElementById("closeEditDiaryModalbtn");
  const saveEditBtn = document.getElementById("saveEditBtn");
  const viewDiaryDataBtn = document.getElementById("viewDiaryDataBtn");
  const FilterDiaryBtn = document.getElementById("FilterBtn");

  // 点击查看 Diary Data 按钮
  viewDiaryDataBtn.addEventListener("click", function () {
    const diaryDataContent = JSON.stringify(diaryData, null, 2);
    alert("Diary Data:\n" + diaryDataContent);
  });

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

  // 定義一個過濾日記的函數
  // function filterDiary(moodToFilter) {
  //   // 刪除所有當前的日記卡片元素
  //   const diaryCards = document.querySelectorAll("details");
  //   diaryCards.forEach((card) => card.remove());

  //   // 過濾出符合指定心情（或標籤）的日記條目
  //   const filteredDiaries = diaryData.filter(
  //     (entry) => entry.mood === moodToFilter || entry.tag === moodToFilter,
  //   );

  //   // 重新渲染這些日記條目
  //   filteredDiaries.forEach((entry) => {
  //     render_diary(entry);
  //   });
  // }

  // 保存日记数据的数组
  let diaryData = [];
  let currentid = 0;

  // 生成随机日记ID
  // function generateRandomId() {
  //   return Math.floor(Math.random() * 900) + 100;
  // }

  // 点击新增日记按钮
  addDiaryBtn.addEventListener("click", function () {
    document.getElementById("addDiaryModal").style.display = "block";
    document.getElementById("moodSelect").value = "快樂";
    document.getElementById("tagSelect").value = "學業";
  });

  // 点击关闭新增日记模态框按钮
  closeAddDiaryModal.addEventListener("click", function () {
    document.getElementById("addDiaryModal").style.display = "none";
  });

  // 点击保存日记按钮
  saveDiaryBtn.addEventListener("click", async function () {
    const date = document.getElementById("diaryDate").value;
    const diaryContent = document.getElementById("diaryContent").value;
    const moodSelect = document.getElementById("moodSelect").value;
    const tagSelect = document.getElementById("tagSelect").value;

    const dateObj = new Date(date);
    const dayIndex = dateObj.getDay();
    const days = [
      " (日)",
      " (一)",
      " (二)",
      " (三)",
      " (四)",
      " (五)",
      " (六)",
    ];
    const weekday = days[dayIndex];

    if (diaryContent.trim() !== "") {
      // const diaryId = generateRandomId();
      const diaryEntry = {
        id: "",
        date: date,
        content: diaryContent,
        mood: moodSelect,
        tag: tagSelect,
        weekday: weekday,
      };

      const newDiaryCard = await createDiaryCard({
        date,
        diaryContent,
        moodSelect,
        tagSelect,
        weekday,
      });
      diaryEntry.id = newDiaryCard.id; // Update local ID with server-assigned ID
      diaryData.push(diaryEntry);

      //diaryData.push(diaryEntry);
      document.getElementById("diaryDate").value = "";
      document.getElementById("diaryContent").value = "";
      document.getElementById("moodSelect").value = "快樂";
      document.getElementById("tagSelect").value = "學業";
      closeAddDiaryModal.click();
      // 在这里创建并填充日记卡片元素到 diaryContainer
      render_diary(diaryEntry);
    }
  });

  function render_diary(diaryEntry) {
    const diary = createDiaryCardElement(diaryEntry);
    diaryList.appendChild(diary);
  }

  // 创建日记卡片元素的函数，需要根据模板创建并填充数据
  function createDiaryCardElement(diaryEntry) {
    const item = itemTemplate.content.cloneNode(true);
    const container = item.querySelector(".diary-card");
    container.dataset.id = diaryEntry.id;

    const originalDate = diaryEntry.date;
    const formattedDate = originalDate.replace(/-/g, ".");

    const date = item.querySelector("p.diary-date");
    date.innerText = formattedDate + diaryEntry.weekday;
    //const weekday = item.querySelector("p.weekday");
    //console.log(weekday);
    //console.log("before 星期");

    //const dateObj = new Date(diaryEntry.date);
    // const dayIndex = dateObj.getDay();
    // const days = [" 日)", " (一)", " (二)", " (三)", " (四)", " (五)", " (六)"];
    //weekday.innerText = days[dayIndex];
    //weekday.dataset.id = "weekday" + diaryEntry.id;

    //console.log("after 星期");

    date.dataset.id = "date" + diaryEntry.id;
    const mood = item.querySelector("p.diary-mood");
    mood.innerText = diaryEntry.mood;
    mood.dataset.id = "mood" + diaryEntry.id;
    const tag = item.querySelector("p.diary-tag");
    tag.innerText = diaryEntry.tag;
    tag.dataset.id = "tag" + diaryEntry.id;
    const content = item.querySelector("p.diary-content");
    content.innerText = diaryEntry.content;
    content.dataset.id = "content" + diaryEntry.id;

    // 可能还需要设置其他元素（如图像等）

    const editButton = item.querySelector("button.edit-button");
    editButton.dataset.id = diaryEntry.id;
    currentid = diaryEntry.id;
    editButton.addEventListener("click", () => {
      // 添加编辑日记的逻辑
      //console.log("current diary id:", diaryEntry.id);
      document.getElementById("editDiaryModal").style.display = "block";

      document.getElementById("editDiaryDate").value = diaryEntry.date;
      document.getElementById("editDiaryContent").value = diaryEntry.content;
      document.getElementById("editMoodSelect").value = diaryEntry.mood;
      document.getElementById("editTagSelect").value = diaryEntry.tag;
    });

    const deleteButton = item.querySelector("button.delete-diary");
    deleteButton.addEventListener("click", () => {
      let diary_card = document.querySelector(
        `details[data-id='${diaryEntry.id}']`,
      );

      diary_card.remove();
      diaryData = diaryData.filter((entry) => entry.id !== diaryEntry.id);
      deleteDiaryCardById(diaryEntry.id);
      //console.log('filter succed');
    });

    // 必須把關閉編輯視窗寫在eddit中，因為當eddit被按下時，視窗出現後就已經進入這個function的領域
    // 所以若該功能被寫在外面，就無法被呼叫
    closeEditDiaryModal.addEventListener("click", () => {
      document.getElementById("editDiaryModal").style.display = "none";
    });

    //     deleteDiaryCardBtn.addEventListener("click", async () => {
    //   diary_card = document.querySelector(`details[data-id='${currentid}']`);
    //   diary_card.remove();
    //   await deleteDiaryCardById(currentid);
    // });

    // const diaryCardElement = document.getElementById(diaryEntry.id);
    // const diaryIndex = diaryData.findIndex((item) => item.id === diaryEntry.id);
    return item;
  }

  saveEditBtn.addEventListener("click", async function () {
    const diaryIndex = diaryData.findIndex((item) => item.id === currentid);

    const date = document.getElementById("editDiaryDate").value;
    const content = document.getElementById("editDiaryContent").value;
    const mood = document.getElementById("editMoodSelect").value;
    const tag = document.getElementById("editTagSelect").value;

    diaryData[diaryIndex].date = formatDate(date);
    diaryData[diaryIndex].content = content;
    diaryData[diaryIndex].mood = mood;
    diaryData[diaryIndex].tag = tag;

    let dateObj = new Date(document.getElementById("editDiaryDate").value);

    let dayIndex = dateObj.getDay();
    let days = [" (日)", " (一)", " (二)", " (三)", " (四)", " (五)", " (六)"];

    const weekday = days[dayIndex];

    diaryData[diaryIndex].weekday = weekday;

    // 获取对应的元素
    const dateElement = document.querySelector(`p[data-id='date${currentid}']`);
    const contentElement = document.querySelector(
      `p[data-id='content${currentid}']`,
    );
    const moodElement = document.querySelector(`p[data-id='mood${currentid}']`);
    const tagElement = document.querySelector(`p[data-id='tag${currentid}']`);

    // 更新元素的值

    const originalDate = document.getElementById("editDiaryDate").value;
    const formattedDate = originalDate.replace(/-/g, ".");

    dateElement.innerText = formattedDate + days[dayIndex];
    contentElement.innerText =
      document.getElementById("editDiaryContent").value;
    moodElement.innerText = document.getElementById("editMoodSelect").value;
    tagElement.innerText = document.getElementById("editTagSelect").value;

    document.getElementById("editDiaryModal").style.display = "none";

    await updateDiaryCard(currentid, { date, content, mood, tag, weekday });
  });

  // deleteDiaryCardBtn.addEventListener("click", async () => {
  //   diary_card = document.querySelector(`details[data-id='${currentid}']`);
  //   diary_card.remove();
  //   await deleteDiaryCardById(currentid);
  // });

  closeAddDiaryModal.addEventListener("click", function () {
    document.getElementById("addDiaryModal").style.display = "none";
  });

  closeEditDiaryModal.addEventListener("click", function () {
    document.getElementById("editDiaryModal").style.display = "none";
  });

  // Async function to get diary cards from the server
  async function getDiaryCards() {
    const response = await instance.get("/diaryCards");
    return response.data;
  }

  // Async function to create a new diary card
  async function createDiaryCard(diaryCard) {
    const response = await instance.post("/diaryCards", diaryCard);
    //console.log(response.data);
    return response.data;
  }

  // Async function to update a diary card
  async function updateDiaryCard(id, updatedData) {
    const response = await instance.put(`/diaryCards/${id}`, updatedData);
    return response.data;
  }

  // Async function to delete a diary card by ID
  async function deleteDiaryCardById(id) {
    const response = await instance.delete(`/diaryCards/${id}`);
    return response.data;
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  async function main() {
    //setupEventListeners();
    try {
      const diaries = await getDiaryCards();
      // diaries.forEach((diaries) => render_diary(diaries));
      diaries.forEach((diary) => {
        const diaryEntry = {
          id: diary.id,
          date: formatDate(diary.date),
          content: diary.diaryContent,
          mood: diary.moodSelect,
          tag: diary.tagSelect,
          weekday: diary.weekday,
        };
        render_diary(diaryEntry);
        diaryData.push(diaryEntry);
      });
    } catch (error) {
      console.log(error);
      alert("Failed to load diaries!");
    }
  }

  main();
});
