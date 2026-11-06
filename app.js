const sourceJson = `{
  "event": {
    "title": "Ночь в музее",
    "date": "15 ноября, 18:30",
    "place": "Музей космонавтики, проспект Мира, 111",
    "description": "Вечерняя программа с выставкой и экскурсиями",
    "meeting": "Сбор: 18:30. Начало: 19:00."
  },
  "services": [
    { "id": "guide", "title": "  Экскурсия с гидом  ", "price": 500 },
    { "id": "audio", "title": "Аудиогид", "price": 350 },
    { "id": "catalog", "title": "Каталог выставки", "price": 250 }
  ]
}`;

// ---------- Элементы страницы ----------

const eventTitle = document.querySelector('#event-title');
const eventDate = document.querySelector('#event-date');
const eventPlace = document.querySelector('#event-place');
const eventDescription = document.querySelector('#event-description');
const showProgramButton = document.querySelector('#show-program');
const program = document.querySelector('#program');
const serviceForm = document.querySelector('#service-form');
const guideCheckbox = document.querySelector('#guide');
const audioCheckbox = document.querySelector('#audio');
const catalogCheckbox = document.querySelector('#catalog');
const choiceError = document.querySelector('#choice-error');
const dataError = document.querySelector('#data-error');
const result = document.querySelector('#result');
const reportJson = document.querySelector('#report-json');

// ---------- Разбор данных ----------

let data = null;

try {
  data = JSON.parse(sourceJson);
} catch (error) {
  data = null;
}

// ---------- Расчёт отчёта ----------

function buildReport(services, guideChecked, audioChecked, catalogChecked) {
  const selected = services.filter((service) => {
    if (service.id === 'guide') {
      return guideChecked;
    }
    if (service.id === 'audio') {
      return audioChecked;
    }
    if (service.id === 'catalog') {
      return catalogChecked;
    }
    return false;
  });

  const items = selected.map((service) => {
    const { title, price } = service;
    return { title: title.trim(), price };
  });

  const total = items.reduce((sum, item) => sum + item.price, 0);

  return {
    count: items.length,
    total,
    items,
  };
}

// ---------- Обработчики ----------

function showProgram() {
  program.innerHTML = data.event.meeting;
  program.hidden = false;
}

function handleSubmit(event) {
  event.preventDefault();

  const report = buildReport(
    data.services,
    guideCheckbox.checked,
    audioCheckbox.checked,
    catalogCheckbox.checked
  );

  if (report.count === 0) {
    choiceError.textContent = 'Выберите хотя бы одну услугу.';
    choiceError.hidden = false;
    result.hidden = true;
    reportJson.hidden = true;
    return;
  }

  const titles = report.items.map((item) => item.title);
  result.innerHTML =
    `Выбрано услуг: ${report.count}<br>Итого: ${report.total} руб.<br>` + titles.join('<br>');

  const json = JSON.stringify(report);
  try {
    JSON.parse(json);
    reportJson.textContent = json;
    reportJson.hidden = false;
  } catch (error) {
    reportJson.hidden = true;
  }

  choiceError.hidden = true;
  result.hidden = false;
}

// ---------- Запуск ----------

if (data === null) {
  dataError.textContent = 'Ошибка данных.';
  dataError.hidden = false;
  serviceForm.hidden = true;
  showProgramButton.disabled = true;
} else {
  const { title, date, place, description } = data.event;
  eventTitle.textContent = title;
  eventDate.textContent = date;
  eventPlace.textContent = place;
  eventDescription.textContent = description;

  serviceForm.hidden = false;
  showProgramButton.addEventListener('click', showProgram);
  serviceForm.addEventListener('submit', handleSubmit);
}
