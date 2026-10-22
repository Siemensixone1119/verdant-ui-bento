import {$,el} from './core/dom.js';
import {requests,services} from './core/demoData.js';
import {Toast} from './components/Toast.js';
import {openModal,confirmAction} from './components/Modal.js';
import {DataTable} from './components/DataTable.js';
import {Form} from './components/Form.js';
import {Tabs} from './components/Tabs.js';
import {Calendar} from './components/Calendar.js';
import {FileUpload} from './components/FileUpload.js';
import {lineChart} from './components/Chart.js';
import {dropdown} from './components/Dropdown.js';
import {Wizard} from './components/Wizard.js';
import {dataCards} from './components/DataCards.js';
import {authForm} from './components/Auth.js';
let rows=requests.map(r=>({...r})),id=110;
const cols=[{key:'id',label:'№',sortable:true},{key:'title',label:'Название',sortable:true},{key:'status',label:'Статус',type:'badge',sortable:true},{key:'owner',label:'Пользователь',sortable:true},{key:'date',label:'Дата',sortable:true}];
function update(){table.setData(rows);$('#statRequests').textContent=rows.length}
function newRecord(values){rows.unshift({id:++id,title:values.title,status:values.status||'Новая',owner:values.owner||'Вы',date:new Date().toLocaleDateString('ru-RU')});update();Toast.success('Заявка создана')}
function editRecord(row){const mount=el('div');new Form(mount,{fields:[{name:'title',label:'Название',required:true},{name:'status',label:'Статус',type:'select',options:['Новая','В работе','Завершена','Отменена'].map(x=>({value:x,label:x}))},{name:'owner',label:'Пользователь',required:true}],values:row,submitLabel:'Обновить',onSubmit:async data=>{Object.assign(row,data);update();close();Toast.success('Изменения сохранены')}});const close=openModal({title:`Редактирование #${row.id}`,content:mount})}
function createRecord(){const mount=el('div');new Form(mount,{fields:[{name:'title',label:'Название',required:true},{name:'owner',label:'Пользователь',required:true},{name:'status',label:'Статус',type:'select',options:[{value:'Новая',label:'Новая'},{value:'В работе',label:'В работе'}]}],onSubmit:async data=>{newRecord(data);close()}});const close=openModal({title:'Новая заявка',content:mount})}
const table=new DataTable('#requestsTable',{columns:cols,data:rows,onEdit:editRecord,onView:row=>openModal({title:`Заявка #${row.id}`,content:`${row.title} · ${row.owner} · ${row.status}`}),onDelete:row=>confirmAction(`Удалить заявку «${row.title}»?`,()=>{rows=rows.filter(r=>r.id!==row.id);update();Toast.success('Запись удалена')})});update();
for(const s of ['#heroAction','#addRequest','#quickCreate'])$(s).onclick=createRecord;
lineChart($('#chart'),[12,17,14,29,23,36,31]);
dataCards($('#serviceCards'),services,{onClick:s=>openModal({title:s.title,content:s.description})});$('#reloadCards').onclick=()=>{dataCards($('#serviceCards'),services,{onClick:s=>openModal({title:s.title,content:s.description})});Toast.success('Карточки обновлены')};
new Form('#requestForm',{fields:[{name:'title',label:'Название заявки',required:true,placeholder:'Введите название'},{name:'owner',label:'Ответственный',required:true,placeholder:'ФИО'},{name:'status',label:'Статус',type:'select',options:['Новая','В работе','Завершена'].map(x=>({label:x,value:x}))},{name:'description',label:'Описание',type:'textarea'}],submitLabel:'Создать заявку',onSubmit:async data=>newRecord(data)});
$('#showPassword').onclick=()=>{$('#samplePassword').type=$('#samplePassword').type==='password'?'text':'password'};
$('#buttonPrimary').onclick=()=>Toast.success('Кнопка нажата');$('#buttonDanger').onclick=()=>confirmAction('Это демонстрация подтверждения действия.',()=>Toast.success('Действие подтверждено'));
$('#buttonLoading').onclick=e=>{const b=e.currentTarget;b.disabled=true;b.textContent='⟳ Выполняется…';setTimeout(()=>{b.disabled=false;b.textContent='↻ Загрузка';Toast.success('Готово')},1200)};
$('#quickToast').onclick=$('#toastSuccess').onclick=()=>Toast.success('Данные сохранены');$('#toastError').onclick=()=>Toast.error('Не удалось выполнить запрос');$('#toastWarn').onclick=()=>Toast.warn('Проверьте введённые данные');$('#headerNotify').onclick=()=>Toast.success('Новых уведомлений нет');
$('#quickDrawer').onclick=()=>{const div=el('div');div.append(el('p','muted','Боковая панель для подробностей, фильтров и редактирования.'));new Form(div,{fields:[{name:'name',label:'Название',required:true}],onSubmit:async()=>Toast.success('Сохранено')});openModal({title:'Панель настроек',content:div,drawer:true})};$('#quickDelete').onclick=()=>confirmAction('Вы уверены, что хотите продолжить?',()=>Toast.success('Подтверждено'));
dropdown($('#dropdownButton'),[{label:'Создать заявку',action:createRecord},{label:'Открыть панель',action:()=>$('#quickDrawer').click()},{label:'Показать уведомление',action:()=>Toast.success('Действие выполнено')}]);$('#tooltipButton').title='Подсказки работают без внешних библиотек';
new Tabs('#tabs',[{label:'Описание',render:()=>el('p','muted','Используйте вкладки для переключения между разделами без перезагрузки.')},{label:'Данные',render:()=>el('p','muted',`${rows.length} записей доступно в демонстрационной таблице.`)},{label:'Настройки',render:()=>el('p','muted','Каждая вкладка может содержать любую DOM-разметку.')}]);
new Calendar('#calendar',{onSelect:d=>$('#chosenDate').textContent=d.toLocaleDateString('ru-RU')});new FileUpload('#upload',{onFiles:files=>Toast.success(`Выбрано файлов: ${files.length}`)});
$('#mockError').onclick=()=>{const root=$('#errorState');root.replaceChildren();const box=el('div','empty','Ошибка загрузки данных. '),b=el('button','btn outline','Повторить');b.onclick=()=>{root.replaceChildren();Toast.success('Данные успешно загружены')};box.append(b);root.append(box)};
new Wizard('#wizard',[{title:'Основная информация',description:'На этом этапе можно запросить имя и контакты.'},{title:'Параметры заявки',description:'Добавьте поля, относящиеся к задаче.'},{title:'Подтверждение',description:'Проверьте данные перед отправкой.',onFinish:()=>Toast.success('Мастер завершён')}]);
$('#bulkDelete').onclick=()=>{if(!table.selected.size){Toast.warn('Сначала выберите строки в таблице');return}confirmAction(`Удалить выбранные записи (${table.selected.size})?`,()=>{rows=rows.filter(r=>!table.selected.has(r.id));update();Toast.success('Выбранные записи удалены')})};
authForm('#loginForm',{onSubmit:async()=>Toast.success('Демо-вход выполнен')});authForm('#registrationForm',{mode:'register',onSubmit:async()=>Toast.success('Демо-регистрация выполнена')});
$('#profileSave').onclick=()=>{if(!$('#profileEmail').checkValidity())return Toast.error('Укажите корректную почту');Toast.success('Профиль обновлён')};$('#logout').onclick=()=>confirmAction('Выйти из демонстрационного профиля?',()=>Toast.success('Демо-выход выполнен'));
$('#menu').onclick=()=>$('#sidebar').classList.toggle('open');document.querySelectorAll('.nav-link').forEach(a=>a.onclick=()=>{document.querySelectorAll('.nav-link').forEach(x=>x.classList.remove('active'));a.classList.add('active');$('#sidebar').classList.remove('open')});

// Theme switcher: persisted preference, default follows the device.
const themeButton=document.getElementById('themeToggle');
function setTheme(theme){document.documentElement.dataset.theme=theme;localStorage.setItem('verdant-theme',theme);themeButton.textContent=theme==='light'?'☾ Тёмная тема':'☀ Светлая тема';themeButton.setAttribute('aria-label',theme==='light'?'Включить тёмную тему':'Включить светлую тему');}
setTheme(localStorage.getItem('verdant-theme') || (matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'));
themeButton.addEventListener('click',()=>setTheme(document.documentElement.dataset.theme==='dark'?'light':'dark'));
