/* =========================================================
   STORAGE
========================================================= */

const STORAGE_KEY =
  "mangaCollection_v5";


const VIEW_KEY =
  "mangaViewMode_v2";


const CUSTOM_OPTIONS_KEY =
  "mangaCustomOptions_v1";



/* =========================================================
   APP STATE
========================================================= */

let mangaData =
  loadMangaData();


let customOptionDefinitions =
  loadCustomOptions();


let currentCover =
  "";


let activeMangaId =
  null;


let activeVolumeNumber =
  null;


let volumeDetailDraft =
  null;


let deleteTargetId =
  null;


let html5QrCode =
  null;


let scanLocked =
  false;


let scannerPurpose =
  "new";



/* =========================================================
   DOM
========================================================= */

const editDialog =
  document.getElementById(
    "editDialog"
  );


const volumeDialog =
  document.getElementById(
    "volumeDialog"
  );


const volumeDetailDialog =
  document.getElementById(
    "volumeDetailDialog"
  );


const scannerDialog =
  document.getElementById(
    "scannerDialog"
  );


const deleteDialog =
  document.getElementById(
    "deleteDialog"
  );


const editId =
  document.getElementById(
    "editId"
  );


const titleInput =
  document.getElementById(
    "titleInput"
  );


const authorInput =
  document.getElementById(
    "authorInput"
  );


const publisherInput =
  document.getElementById(
    "publisherInput"
  );


const isbnInput =
  document.getElementById(
    "isbnInput"
  );


const totalInput =
  document.getElementById(
    "totalInput"
  );


const coverInput =
  document.getElementById(
    "coverInput"
  );


const coverPreview =
  document.getElementById(
    "coverPreview"
  );


const isbnStatus =
  document.getElementById(
    "isbnStatus"
  );


const scannerStatus =
  document.getElementById(
    "scannerStatus"
  );


const volumeOwnedInput =
  document.getElementById(
    "volumeOwnedInput"
  );


const volumeFirstEditionInput =
  document.getElementById(
    "volumeFirstEditionInput"
  );


const volumeObiInput =
  document.getElementById(
    "volumeObiInput"
  );



/* =========================================================
   LOAD DATA
========================================================= */

function loadMangaData() {

  const current =
    safeJSONParse(
      localStorage.getItem(
        STORAGE_KEY
      )
    );


  if (
    Array.isArray(
      current
    )
  ) {

    return current.map(
      normalizeManga
    );

  }


  /*
    自動讀取之前版本
  */

  const oldKeys = [

    "mangaCollection_v3",

    "mangaData_v2",

    "mangaData_v1",

    "mangaData"

  ];


  for (
    const key of oldKeys
  ) {

    const old =
      safeJSONParse(
        localStorage.getItem(
          key
        )
      );


    if (
      Array.isArray(
        old
      )
    ) {

      return old.map(
        normalizeManga
      );

    }

  }


  return [

    normalizeManga(
      {

        id:
          Date.now(),

        title:
          "我內心的糟糕念頭",

        total:
          13,

        owned:
          [
            1,
            2
          ]

      }
    )

  ];

}



/* =========================================================
   CUSTOM OPTIONS
========================================================= */

function loadCustomOptions() {

  const saved =
    safeJSONParse(
      localStorage.getItem(
        CUSTOM_OPTIONS_KEY
      )
    );


  if (
    Array.isArray(
      saved
    )
  ) {

    return saved;

  }


  /*
    預設幾個常用的
  */

  return [

    "特裝版",

    "店舖特典"

  ];

}



/* =========================================================
   NORMALIZE
========================================================= */

function normalizeManga(
  manga
) {

  const total =
    Math.max(
      1,
      Number(
        manga.total
      ) ||
      1
    );


  let volumes =
    {};


  /*
    新版資料
  */

  if (
    manga.volumes &&
    typeof manga.volumes ===
    "object"
  ) {

    for (
      let i = 1;
      i <= total;
      i++
    ) {

      const oldVolume =
        manga.volumes[i] ||
        manga.volumes[String(i)] ||
        {};


      volumes[i] =
        normalizeVolume(
          oldVolume
        );

    }

  }

  /*
    舊版 owned array
  */

  else {

    const ownedSet =
      new Set(
        Array.isArray(
          manga.owned
        )
        ?
        manga.owned.map(
          Number
        )
        :
        []
      );


    for (
      let i = 1;
      i <= total;
      i++
    ) {

      volumes[i] = {

        owned:
          ownedSet.has(
            i
          ),

        firstEdition:
          false,

        obi:
          false,

        extras:
          []

      };

    }

  }


  return {

    id:
      Number(
        manga.id
      ) ||
      Date.now(),

    title:
      String(
        manga.title ||
        "未命名漫畫"
      ),

    author:
      String(
        manga.author ||
        ""
      ),

    publisher:
      String(
        manga.publisher ||
        ""
      ),

    isbn:
      String(
        manga.isbn ||
        ""
      ),

    total,

    cover:
      String(
        manga.cover ||
        ""
      ),

    volumes

  };

}



function normalizeVolume(
  volume
) {

  return {

    owned:
      Boolean(
        volume.owned
      ),

    firstEdition:
      Boolean(
        volume.firstEdition
      ),

    obi:
      Boolean(
        volume.obi
      ),

    extras:
      Array.isArray(
        volume.extras
      )
      ?
      volume.extras
        .map(
          String
        )
      :
      []

  };

}



/* =========================================================
   SAVE
========================================================= */

function saveData() {

  try {

    localStorage.setItem(

      STORAGE_KEY,

      JSON.stringify(
        mangaData
      )

    );


    localStorage.setItem(

      CUSTOM_OPTIONS_KEY,

      JSON.stringify(
        customOptionDefinitions
      )

    );

  }

  catch (
    error
  ) {

    console.error(
      error
    );


    alert(
      "瀏覽器儲存空間可能不足。\n建議使用較小的封面圖片。"
    );

  }

}



function safeJSONParse(
  value
) {

  try {

    return JSON.parse(
      value
    );

  }

  catch {

    return null;

  }

}



/* =========================================================
   ESCAPE
========================================================= */

function escapeHtml(
  value = ""
) {

  return String(
    value
  )

  .replaceAll(
    "&",
    "&amp;"
  )

  .replaceAll(
    "<",
    "&lt;"
  )

  .replaceAll(
    ">",
    "&gt;"
  )

  .replaceAll(
    "\"",
    "&quot;"
  )

  .replaceAll(
    "'",
    "&#039;"
  );

}



/* =========================================================
   PLACEHOLDER
========================================================= */

function placeholderCover() {

  return (
    "data:image/svg+xml;charset=UTF-8," +

    encodeURIComponent(
      `
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="600"
        height="800"
      >

        <rect
          width="600"
          height="800"
          fill="#111827"
        />

        <text
          x="300"
          y="370"
          text-anchor="middle"
          fill="white"
          font-size="65"
          font-family="sans-serif"
        >
          漫畫
        </text>

        <text
          x="300"
          y="440"
          text-anchor="middle"
          fill="#9ca3af"
          font-size="28"
          font-family="sans-serif"
        >
          NO COVER
        </text>

      </svg>
      `
    )
  );

}



/* =========================================================
   RENDER
========================================================= */

function render() {

  const container =
    document.getElementById(
      "mangaContainer"
    );


  const keyword =
    document
      .getElementById(
        "searchInput"
      )
      .value
      .trim()
      .toLowerCase();


  const filtered =
    mangaData.filter(
      manga => {

        const text = [

          manga.title,

          manga.author,

          manga.publisher,

          manga.isbn

        ]

        .join(
          " "
        )

        .toLowerCase();


        return text.includes(
          keyword
        );

      }
    );


  container.innerHTML =
    "";


  if (
    filtered.length ===
    0
  ) {

    container.innerHTML =
      `
      <div class="empty">

        找不到漫畫

        <br><br>

        <button
          onclick="openScannerForNew()"
        >
          📷 掃描條碼
        </button>

        <br><br>

        <button
          class="secondary"
          onclick="openAdd()"
        >
          ＋ 手動新增
        </button>

      </div>
      `;

  }


  for (
    const manga of filtered
  ) {

    const summary =
      getMangaSummary(
        manga
      );


    const card =
      document.createElement(
        "article"
      );


    card.className =
      "card";


    const missingText =
      summary.missing.length ===
      0

      ?
      `
      <span class="complete">
        ✓ 已收齊
      </span>
      `

      :
      `
      <span class="missing">
        缺：
        ${formatVolumeList(
          summary.missing
        )}
      </span>
      `;


    let badges =
      "";


    if (
      summary.firstEdition.length
    ) {

      badges +=
        `
        <span
          class="mini-badge first-badge"
        >
          ⭐ 首刷
          ${formatVolumeList(
            summary.firstEdition
          )}
        </span>
        `;

    }


    if (
      summary.obi.length
    ) {

      badges +=
        `
        <span
          class="mini-badge obi-badge"
        >
          🎗️ 書腰
          ${formatVolumeList(
            summary.obi
          )}
        </span>
        `;

    }


    card.innerHTML =
      `

      <img
        class="cover"
        src="${manga.cover || placeholderCover()}"
        alt="${escapeHtml(manga.title)}"
        onerror="
          this.onerror=null;
          this.src='${placeholderCover()}'
        "
      >


      <div class="card-body">

        <div class="manga-title">
          ${escapeHtml(
            manga.title
          )}
        </div>


        ${
          manga.author
          ?
          `
          <div class="meta">
            作者：
            ${escapeHtml(
              manga.author
            )}
          </div>
          `
          :
          ""
        }


        ${
          manga.publisher
          ?
          `
          <div class="meta">
            出版社：
            ${escapeHtml(
              manga.publisher
            )}
          </div>
          `
          :
          ""
        }


        <div class="meta">
          已收
          ${summary.owned.length}
          /
          ${manga.total}
          集
        </div>


        <div class="meta">
          ${missingText}
        </div>


        <div class="collection-badges">
          ${badges}
        </div>


        <div class="card-actions">

          <button
            onclick="openVolumes(${manga.id})"
          >
            管理集數
          </button>

          <button
            class="secondary"
            onclick="openEdit(${manga.id})"
          >
            編輯
          </button>

          <button
            class="danger"
            onclick="deleteManga(${manga.id})"
          >
            刪除
          </button>

        </div>

      </div>
      `;


    container.appendChild(
      card
    );

  }


  renderStats();


  saveData();

}



/* =========================================================
   SUMMARY
========================================================= */

function getMangaSummary(
  manga
) {

  const owned =
    [];


  const missing =
    [];


  const firstEdition =
    [];


  const obi =
    [];


  for (
    let i = 1;
    i <= manga.total;
    i++
  ) {

    const volume =
      manga.volumes[i] ||
      normalizeVolume(
        {}
      );


    if (
      volume.owned
    ) {

      owned.push(
        i
      );

    }

    else {

      missing.push(
        i
      );

    }


    if (
      volume.firstEdition
    ) {

      firstEdition.push(
        i
      );

    }


    if (
      volume.obi
    ) {

      obi.push(
        i
      );

    }

  }


  return {

    owned,

    missing,

    firstEdition,

    obi

  };

}



/* =========================================================
   FORMAT VOLUME
========================================================= */

function formatVolumeList(
  numbers
) {

  if (
    !numbers.length
  ) {

    return "無";

  }


  /*
    太多時避免首頁超長
  */

  if (
    numbers.length >
    8
  ) {

    return (
      numbers
        .slice(
          0,
          8
        )
        .join(
          "、"
        ) +
      "…"
    );

  }


  return numbers.join(
    "、"
  );

}



/* =========================================================
   STATS
========================================================= */

function renderStats() {

  let ownedBooks =
    0;


  let firstEditionBooks =
    0;


  let obiBooks =
    0;


  let completeSeries =
    0;


  mangaData.forEach(
    manga => {

      const summary =
        getMangaSummary(
          manga
        );


      ownedBooks +=
        summary.owned.length;


      firstEditionBooks +=
        summary.firstEdition.length;


      obiBooks +=
        summary.obi.length;


      if (
        summary.missing.length ===
        0
      ) {

        completeSeries++;

      }

    }
  );


  document.getElementById(
    "stats"
  ).innerHTML =
    `

    <div class="stat">
      ${mangaData.length}
      套漫畫
    </div>

    <div class="stat">
      ${ownedBooks}
      本收藏
    </div>

    <div class="stat">
      ⭐
      ${firstEditionBooks}
      本首刷
    </div>

    <div class="stat">
      🎗️
      ${obiBooks}
      本有書腰
    </div>

    <div class="stat">
      ${completeSeries}
      套收齊
    </div>

    `;

}



/* =========================================================
   VIEW MODE
========================================================= */

function setViewMode(
  mode
) {

  const container =
    document.getElementById(
      "mangaContainer"
    );


  container.className =
    `manga-container ${mode}`;


  localStorage.setItem(
    VIEW_KEY,
    mode
  );


  document
    .getElementById(
      "gridViewButton"
    )
    .classList
    .toggle(
      "active",
      mode === "grid"
    );


  document
    .getElementById(
      "listViewButton"
    )
    .classList
    .toggle(
      "active",
      mode === "list"
    );

}



function restoreViewMode() {

  const saved =
    localStorage.getItem(
      VIEW_KEY
    ) ||
    "grid";


  setViewMode(
    saved
  );

}



/* =========================================================
   ADD
========================================================= */

function openAdd() {

  clearEditForm();


  document.getElementById(
    "editTitle"
  ).textContent =
    "新增漫畫";


  editDialog.showModal();

}



/* =========================================================
   EDIT
========================================================= */

function openEdit(
  id
) {

  const manga =
    mangaData.find(
      item =>
        item.id === id
    );


  if (
    !manga
  ) {

    return;

  }


  document.getElementById(
    "editTitle"
  ).textContent =
    "編輯漫畫";


  editId.value =
    manga.id;


  titleInput.value =
    manga.title;


  authorInput.value =
    manga.author;


  publisherInput.value =
    manga.publisher;


  isbnInput.value =
    manga.isbn;


  totalInput.value =
    manga.total;


  currentCover =
    manga.cover;


  coverInput.value =
    "";


  if (
    currentCover
  ) {

    coverPreview.src =
      currentCover;


    coverPreview.style.display =
      "block";

  }

  else {

    coverPreview.style.display =
      "none";

  }


  setISBNStatus(
    "",
    ""
  );


  editDialog.showModal();

}



/* =========================================================
   CLEAR FORM
========================================================= */

function clearEditForm() {

  editId.value =
    "";


  titleInput.value =
    "";


  authorInput.value =
    "";


  publisherInput.value =
    "";


  isbnInput.value =
    "";


  totalInput.value =
    "";


  coverInput.value =
    "";


  currentCover =
    "";


  coverPreview.src =
    "";


  coverPreview.style.display =
    "none";


  setISBNStatus(
    "",
    ""
  );

}



/* =========================================================
   SAVE MANGA
========================================================= */

function saveManga() {

  const id =
    editId.value;


  const title =
    titleInput.value.trim();


  const author =
    authorInput.value.trim();


  const publisher =
    publisherInput.value.trim();


  const isbn =
    normalizeISBN(
      isbnInput.value
    );


  const total =
    Number(
      totalInput.value
    );


  if (
    !title
  ) {

    alert(
      "請輸入漫畫名稱。"
    );

    return;

  }


  if (
    !Number.isInteger(
      total
    ) ||
    total < 1
  ) {

    alert(
      "請輸入正確的出版集數。"
    );

    return;

  }


  if (
    id
  ) {

    const manga =
      mangaData.find(
        item =>
          item.id ===
          Number(
            id
          )
      );


    if (
      !manga
    ) {

      return;

    }


    manga.title =
      title;


    manga.author =
      author;


    manga.publisher =
      publisher;


    manga.isbn =
      isbn;


    manga.cover =
      currentCover;


    /*
      集數增加
    */

    if (
      total >
      manga.total
    ) {

      for (
        let i =
          manga.total + 1;

        i <= total;

        i++
      ) {

        manga.volumes[i] =
          normalizeVolume(
            {}
          );

      }

    }


    /*
      集數減少
    */

    if (
      total <
      manga.total
    ) {

      for (
        let i =
          total + 1;

        i <= manga.total;

        i++
      ) {

        delete manga.volumes[i];

      }

    }


    manga.total =
      total;

  }

  else {

    const volumes =
      {};


    for (
      let i = 1;
      i <= total;
      i++
    ) {

      volumes[i] =
        normalizeVolume(
          {}
        );

    }


    mangaData.push(
      {

        id:
          Date.now(),

        title,

        author,

        publisher,

        isbn,

        total,

        cover:
          currentCover,

        volumes

      }
    );

  }


  saveData();


  editDialog.close();


  render();

}



/* =========================================================
   CLOSE EDIT
========================================================= */

function closeEditDialog() {

  editDialog.close();

}



/* =========================================================
   DELETE
========================================================= */

function deleteManga(
  id
) {

  const manga =
    mangaData.find(
      item =>
        item.id === id
    );


  if (
    !manga
  ) {

    return;

  }


  deleteTargetId =
    id;


  document.getElementById(
    "deleteMessage"
  ).textContent =
    `確定要刪除「${manga.title}」嗎？`;


  deleteDialog.showModal();

}



function confirmDelete() {

  if (
    deleteTargetId ===
    null
  ) {

    return;

  }


  mangaData =
    mangaData.filter(
      item =>
        item.id !==
        deleteTargetId
    );


  deleteTargetId =
    null;


  deleteDialog.close();


  render();

}



/* =========================================================
   OPEN VOLUMES
========================================================= */

function openVolumes(
  mangaId
) {

  activeMangaId =
    mangaId;


  const manga =
    getActiveManga();


  if (
    !manga
  ) {

    return;

  }


  document.getElementById(
    "volumeTitle"
  ).textContent =
    `${manga.title}｜集數`;


  renderVolumeGrid();


  volumeDialog.showModal();

}



/* =========================================================
   VOLUME GRID
========================================================= */

function renderVolumeGrid() {

  const manga =
    getActiveManga();


  if (
    !manga
  ) {

    return;

  }


  const grid =
    document.getElementById(
      "volumeGrid"
    );


  grid.innerHTML =
    "";


  for (
    let i = 1;
    i <= manga.total;
    i++
  ) {

    const volume =
      manga.volumes[i];


    const button =
      document.createElement(
        "button"
      );


    button.className =
      "volume-card" +
      (
        volume.owned
        ?
        " owned"
        :
        ""
      );


    const icons = [

      volume.firstEdition
      ?
      "⭐"
      :
      "",

      volume.obi
      ?
      "🎗️"
      :
      ""

    ]

    .filter(
      Boolean
    )

    .join(
      ""
    );


    const extraCount =
      volume.extras.length;


    button.innerHTML =
      `

      <div class="volume-number">
        ${i}
      </div>

      <div class="volume-icons">
        ${icons}
      </div>

      ${
        extraCount
        ?
        `
        <div class="volume-extra-count">
          +${extraCount} 其他
        </div>
        `
        :
        ""
      }

      `;


    button.onclick =
      () =>
        openVolumeDetail(
          i
        );


    grid.appendChild(
      button
    );

  }

}



/* =========================================================
   OPEN VOLUME DETAIL
========================================================= */

function openVolumeDetail(
  volumeNumber
) {

  const manga =
    getActiveManga();


  if (
    !manga
  ) {

    return;

  }


  activeVolumeNumber =
    volumeNumber;


  const original =
    manga.volumes[
      volumeNumber
    ];


  volumeDetailDraft = {

    owned:
      original.owned,

    firstEdition:
      original.firstEdition,

    obi:
      original.obi,

    extras:
      [
        ...original.extras
      ]

  };


  document.getElementById(
    "volumeDetailTitle"
  ).textContent =
    `第 ${volumeNumber} 集`;


  volumeOwnedInput.checked =
    volumeDetailDraft.owned;


  volumeFirstEditionInput.checked =
    volumeDetailDraft.firstEdition;


  volumeObiInput.checked =
    volumeDetailDraft.obi;


  renderCustomOptions();


  volumeDetailDialog.showModal();

}



/* =========================================================
   CUSTOM OPTIONS
========================================================= */

function renderCustomOptions() {

  const container =
    document.getElementById(
      "customOptionsContainer"
    );


  container.innerHTML =
    "";


  if (
    customOptionDefinitions.length ===
    0
  ) {

    container.innerHTML =
      `
      <div class="meta">
        還沒有自訂項目。
      </div>
      `;

  }


  customOptionDefinitions.forEach(
    (
      option,
      index
    ) => {

      const row =
        document.createElement(
          "div"
        );


      row.className =
        "custom-option-row";


      const checked =
        volumeDetailDraft
          .extras
          .includes(
            option
          );


      row.innerHTML =
        `

        <input
          type="checkbox"
          id="customOption_${index}"
          ${checked ? "checked" : ""}
        >

        <label
          for="customOption_${index}"
        >
          ${escapeHtml(option)}
        </label>

        <button
          type="button"
          class="custom-delete"
          onclick="deleteCustomOption(${index})"
          title="刪除這個選項"
        >
          ✕
        </button>

        `;


      const checkbox =
        row.querySelector(
          "input"
        );


      checkbox.addEventListener(
        "change",
        () => {

          if (
            checkbox.checked
          ) {

            if (
              !volumeDetailDraft
                .extras
                .includes(
                  option
                )
            ) {

              volumeDetailDraft
                .extras
                .push(
                  option
                );

            }

          }

          else {

            volumeDetailDraft.extras =
              volumeDetailDraft
                .extras
                .filter(
                  item =>
                    item !== option
                );

          }

        }
      );


      container.appendChild(
        row
      );

    }
  );

}



/* =========================================================
   ADD CUSTOM OPTION
========================================================= */

function addCustomOption() {

  const input =
    document.getElementById(
      "newCustomOptionInput"
    );


  const value =
    input.value.trim();


  if (
    !value
  ) {

    return;

  }


  if (
    customOptionDefinitions.includes(
      value
    )
  ) {

    alert(
      "這個選項已經存在。"
    );

    return;

  }


  customOptionDefinitions.push(
    value
  );


  volumeDetailDraft.extras.push(
    value
  );


  input.value =
    "";


  saveData();


  renderCustomOptions();

}



/* =========================================================
   DELETE CUSTOM OPTION
========================================================= */

function deleteCustomOption(
  index
) {

  const option =
    customOptionDefinitions[
      index
    ];


  if (
    !confirm(
      `刪除「${option}」這個自訂選項？\n\n已經套用在其他集數的紀錄也會一起移除。`
    )
  ) {

    return;

  }


  customOptionDefinitions.splice(
    index,
    1
  );


  /*
    所有漫畫同步移除
  */

  mangaData.forEach(
    manga => {

      for (
        let i = 1;
        i <= manga.total;
        i++
      ) {

        manga.volumes[i].extras =
          manga.volumes[i]
            .extras
            .filter(
              item =>
                item !== option
            );

      }

    }
  );


  volumeDetailDraft.extras =
    volumeDetailDraft
      .extras
      .filter(
        item =>
          item !== option
      );


  saveData();


  renderCustomOptions();

}



/* =========================================================
   SAVE VOLUME DETAIL
========================================================= */

function saveVolumeDetail() {

  const manga =
    getActiveManga();


  if (
    !manga ||
    !activeVolumeNumber
  ) {

    return;

  }


  volumeDetailDraft.owned =
    volumeOwnedInput.checked;


  volumeDetailDraft.firstEdition =
    volumeFirstEditionInput.checked;


  volumeDetailDraft.obi =
    volumeObiInput.checked;


  /*
    有首刷、書腰或其他資料時
    自動認定這一集是已收藏
  */

  if (
    volumeDetailDraft.firstEdition ||
    volumeDetailDraft.obi ||
    volumeDetailDraft.extras.length
  ) {

    volumeDetailDraft.owned =
      true;

  }


  manga.volumes[
    activeVolumeNumber
  ] = {

    ...volumeDetailDraft,

    extras:
      [
        ...volumeDetailDraft.extras
      ]

  };


  volumeDetailDialog.close();


  saveData();


  renderVolumeGrid();


  render();

}



/* =========================================================
   CLOSE DETAIL
========================================================= */

function closeVolumeDetail() {

  volumeDetailDialog.close();

}



/* =========================================================
   ALL OWNED
========================================================= */

function setAllVolumesOwned(
  value
) {

  const manga =
    getActiveManga();


  if (
    !manga
  ) {

    return;

  }


  for (
    let i = 1;
    i <= manga.total;
    i++
  ) {

    manga.volumes[i].owned =
      value;


    /*
      全部取消時也清除收藏細節
    */

    if (
      !value
    ) {

      manga.volumes[i].firstEdition =
        false;


      manga.volumes[i].obi =
        false;


      manga.volumes[i].extras =
        [];

    }

  }


  saveData();


  renderVolumeGrid();


  render();

}



/* =========================================================
   ACTIVE MANGA
========================================================= */

function getActiveManga() {

  return mangaData.find(
    item =>
      item.id ===
      activeMangaId
  );

}



/* =========================================================
   IMAGE UPLOAD
========================================================= */

coverInput.addEventListener(

  "change",

  async event => {

    const file =
      event.target.files?.[0];


    if (
      !file
    ) {

      return;

    }


    if (
      !file.type.startsWith(
        "image/"
      )
    ) {

      alert(
        "請選擇圖片檔。"
      );

      return;

    }


    try {

      currentCover =
        await compressImage(
          file
        );


      coverPreview.src =
        currentCover;


      coverPreview.style.display =
        "block";

    }

    catch (
      error
    ) {

      console.error(
        error
      );


      alert(
        "圖片讀取失敗。"
      );

    }

  }

);



/* =========================================================
   IMAGE COMPRESSION
========================================================= */

function compressImage(
  file
) {

  return new Promise(
    (
      resolve,
      reject
    ) => {

      const reader =
        new FileReader();


      reader.onload =
        event => {

          const image =
            new Image();


          image.onload =
            () => {

              const maxWidth =
                800;


              const maxHeight =
                1100;


              const ratio =
                Math.min(

                  maxWidth /
                  image.width,

                  maxHeight /
                  image.height,

                  1

                );


              const width =
                Math.round(
                  image.width *
                  ratio
                );


              const height =
                Math.round(
                  image.height *
                  ratio
                );


              const canvas =
                document.createElement(
                  "canvas"
                );


              canvas.width =
                width;


              canvas.height =
                height;


              const ctx =
                canvas.getContext(
                  "2d"
                );


              ctx.drawImage(

                image,

                0,

                0,

                width,

                height

              );


              resolve(
                canvas.toDataURL(
                  "image/jpeg",
                  .78
                )
              );

            };


          image.onerror =
            reject;


          image.src =
            event.target.result;

        };


      reader.onerror =
        reject;


      reader.readAsDataURL(
        file
      );

    }
  );

}



/* =========================================================
   REMOVE COVER
========================================================= */

function removeCover() {

  currentCover =
    "";


  coverInput.value =
    "";


  coverPreview.src =
    "";


  coverPreview.style.display =
    "none";

}



/* =========================================================
   ISBN
========================================================= */

function normalizeISBN(
  value
) {

  return String(
    value ||
    ""
  )

  .replace(
    /[^0-9Xx]/g,
    ""
  )

  .toUpperCase();

}



/* =========================================================
   SCAN NEW
========================================================= */

async function openScannerForNew() {

  scannerPurpose =
    "new";


  clearEditForm();


  document.getElementById(
    "editTitle"
  ).textContent =
    "新增漫畫";


  await startBarcodeScan();

}



/* =========================================================
   SCAN EDIT
========================================================= */

async function startBarcodeScanFromEdit() {

  scannerPurpose =
    "edit";


  await startBarcodeScan();

}



/* =========================================================
   START SCANNER
========================================================= */

async function startBarcodeScan() {

  if (
    typeof Html5Qrcode ===
    "undefined"
  ) {

    alert(
      "條碼元件尚未載入，請重新整理頁面。"
    );

    return;

  }


  scanLocked =
    false;


  scannerStatus.textContent =
    "正在開啟相機…";


  scannerDialog.showModal();


  try {

    if (
      html5QrCode &&
      html5QrCode.isScanning
    ) {

      await html5QrCode.stop();

    }


    html5QrCode =
      new Html5Qrcode(
        "reader"
      );


    await html5QrCode.start(

      {
        facingMode:
          "environment"
      },

      {
        fps:
          12,

        qrbox:
          {
            width:
              300,

            height:
              140
          },

        formatsToSupport:
          [

            Html5QrcodeSupportedFormats.EAN_13,

            Html5QrcodeSupportedFormats.EAN_8,

            Html5QrcodeSupportedFormats.UPC_A

          ]

      },


      async decodedText => {

        if (
          scanLocked
        ) {

          return;

        }


        const isbn =
          normalizeISBN(
            decodedText
          );


        if (
          isbn.length === 13 &&
          (
            isbn.startsWith(
              "978"
            ) ||
            isbn.startsWith(
              "979"
            )
          )
        ) {

          scanLocked =
            true;


          scannerStatus.textContent =
            `掃描成功：${isbn}`;


          await stopBarcodeCamera();


          scannerDialog.close();


          if (
            scannerPurpose ===
            "new"
          ) {

            editDialog.showModal();

          }


          isbnInput.value =
            isbn;


          await lookupBookByISBN(
            isbn
          );

        }

        else {

          scannerStatus.textContent =
            `掃到 ${isbn}，請對準 978 或 979 開頭的 ISBN 條碼。`;

        }

      },

      () => {}

    );


    scannerStatus.textContent =
      "請將 ISBN 條碼放進框框。";

  }

  catch (
    error
  ) {

    console.error(
      error
    );


    scannerStatus.textContent =
      "相機無法開啟。";


    alert(
      "無法使用相機。\n\n請確認 Chrome 已允許相機權限，並使用 HTTPS 網址。"
    );

  }

}



/* =========================================================
   STOP SCANNER
========================================================= */

async function stopBarcodeCamera() {

  try {

    if (
      html5QrCode &&
      html5QrCode.isScanning
    ) {

      await html5QrCode.stop();

    }

  }

  catch (
    error
  ) {

    console.error(
      error
    );

  }

}



async function stopBarcodeScan() {

  await stopBarcodeCamera();


  if (
    scannerDialog.open
  ) {

    scannerDialog.close();

  }

}



/* =========================================================
   MANUAL ISBN
========================================================= */

async function lookupManualISBN() {

  const isbn =
    normalizeISBN(
      isbnInput.value
    );


  if (
    isbn.length !== 10 &&
    isbn.length !== 13
  ) {

    setISBNStatus(
      "ISBN 格式不正確。",
      "error"
    );

    return;

  }


  isbnInput.value =
    isbn;


  await lookupBookByISBN(
    isbn
  );

}



/* =========================================================
   LOOKUP
========================================================= */

async function lookupBookByISBN(
  isbn
) {

  setISBNStatus(

    `正在查詢 ${isbn}…`,

    ""

  );


  try {

    const googleBook =
      await searchGoogleBooks(
        isbn
      );


    if (
      googleBook
    ) {

      applyBookInfo(
        googleBook,
        isbn
      );


      setISBNStatus(

        `✓ 找到：${googleBook.title}`,

        "success"

      );


      return;

    }

  }

  catch (
    error
  ) {

    console.error(
      error
    );

  }


  try {

    const openLibraryBook =
      await searchOpenLibrary(
        isbn
      );


    if (
      openLibraryBook
    ) {

      applyBookInfo(

        openLibraryBook,

        isbn

      );


      setISBNStatus(

        `✓ 找到：${openLibraryBook.title}`,

        "success"

      );


      return;

    }

  }

  catch (
    error
  ) {

    console.error(
      error
    );

  }


  setISBNStatus(

    "找不到這本書，可以手動輸入漫畫資料。",

    "error"

  );

}



/* =========================================================
   GOOGLE BOOKS
========================================================= */

async function searchGoogleBooks(
  isbn
) {

  const response =
    await fetch(

      "https://www.googleapis.com/books/v1/volumes?q=" +

      encodeURIComponent(
        `isbn:${isbn}`
      )

    );


  if (
    !response.ok
  ) {

    return null;

  }


  const data =
    await response.json();


  if (
    !data.items?.length
  ) {

    return null;

  }


  const info =
    data.items[0]
      .volumeInfo ||
    {};


  const links =
    info.imageLinks ||
    {};


  let cover =

    links.extraLarge ||

    links.large ||

    links.medium ||

    links.small ||

    links.thumbnail ||

    links.smallThumbnail ||

    "";


  cover =
    cover.replace(
      /^http:/,
      "https:"
    );


  return {

    title:
      info.title ||
      "",

    author:
      Array.isArray(
        info.authors
      )
      ?
      info.authors.join(
        "、"
      )
      :
      "",

    publisher:
      info.publisher ||
      "",

    cover

  };

}



/* =========================================================
   OPEN LIBRARY
========================================================= */

async function searchOpenLibrary(
  isbn
) {

  const response =
    await fetch(

      `https://openlibrary.org/isbn/${encodeURIComponent(isbn)}.json`

    );


  if (
    !response.ok
  ) {

    return null;

  }


  const data =
    await response.json();


  return {

    title:
      data.title ||
      "",

    author:
      "",

    publisher:
      Array.isArray(
        data.publishers
      )
      ?
      data.publishers.join(
        "、"
      )
      :
      "",

    cover:
      `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg?default=false`

  };

}



/* =========================================================
   APPLY BOOK INFO
========================================================= */

function applyBookInfo(
  book,
  isbn
) {

  isbnInput.value =
    isbn;


  if (
    book.title
  ) {

    titleInput.value =
      book.title;

  }


  if (
    book.author
  ) {

    authorInput.value =
      book.author;

  }


  if (
    book.publisher
  ) {

    publisherInput.value =
      book.publisher;

  }


  if (
    !totalInput.value
  ) {

    totalInput.value =
      1;

  }


  if (
    book.cover
  ) {

    currentCover =
      book.cover;


    coverPreview.src =
      book.cover;


    coverPreview.style.display =
      "block";

  }

}



/* =========================================================
   ISBN STATUS
========================================================= */

function setISBNStatus(
  message,
  type
) {

  isbnStatus.textContent =
    message;


  isbnStatus.className =
    "status-text";


  if (
    type
  ) {

    isbnStatus.classList.add(
      type
    );

  }

}



/* =========================================================
   ENTER ADD CUSTOM
========================================================= */

document
  .getElementById(
    "newCustomOptionInput"
  )
  .addEventListener(
    "keydown",
    event => {

      if (
        event.key ===
        "Enter"
      ) {

        event.preventDefault();

        addCustomOption();

      }

    }
  );



/* =========================================================
   INIT
========================================================= */

mangaData =
  mangaData.map(
    normalizeManga
  );


restoreViewMode();


render();
