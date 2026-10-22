import {el} from '../../shared/js/core/dom.js';
import {requests,services} from '../../shared/js/core/demoData.js';
import {Toast} from '../../shared/js/components/Toast.js';
import {openModal,confirmAction} from '../../shared/js/components/Modal.js';
import {DataTable} from '../../shared/js/components/DataTable.js';
import {Form} from '../../shared/js/components/Form.js';
import {authForm} from '../../shared/js/components/Auth.js';
import {dropdown} from '../../shared/js/components/Dropdown.js';
import {dataCards} from '../../shared/js/components/DataCards.js';
import {Wizard} from '../../shared/js/components/Wizard.js';
import {Tabs} from '../../shared/js/components/Tabs.js';
import {FileUpload} from '../../shared/js/components/FileUpload.js';
import {Calendar} from '../../shared/js/components/Calendar.js';
import {lineChart} from '../../shared/js/components/Chart.js';
import {ApiClient} from '../../shared/js/core/api.js';
const api = new ApiClient({baseUrl:''});
const $=selector=>document.querySelector(selector);
const cols=[{key:'id',label:'№',sortable:true},{key:'title',label:'Название',sortable:true},{key:'status',label:'Статус',type:'badge',sortable:true},{key:'owner',label:'Ответственный',sortable:true},{key:'date',label:'Дата',sortable:true}];
const fields=[{name:'title',label:'Название',required:true},{name:'owner',label:'Ответственный',required:true},{name:'status',label:'Статус',type:'select',options:[{label:'Новая',value:'Новая'},{label:'В работе',value:'В работе'}]}];
const cloneRows=()=>requests.map(row=>({...row}));
async function loadRecords(){
  // Чтобы читать реальные данные: задайте window.VERDANT_API_ENDPOINT в HTML.
  if (!window.VERDANT_API_ENDPOINT) return cloneRows();
  const result=await api.get(window.VERDANT_API_ENDPOINT);
  const rows=Array.isArray(result)?result:(result?.items??result?.data);
  if(!Array.isArray(rows))throw new Error('Ожидался массив или объект с items/data');
  return rows;
}

$('#primary').onclick=()=>Toast.success('Кнопка нажата');$('#danger').onclick=()=>confirmAction('Подтвердить действие?',()=>Toast.success('Подтверждено'));$('#loadingBtn').onclick=async()=>{const b=$('#loadingBtn');b.disabled=true;b.textContent='Загрузка…';await new Promise(r=>setTimeout(r,700));b.disabled=false;b.textContent='Запустить загрузку';Toast.success('Готово')};
const theme=$('#theme');theme.addEventListener('click',()=>{const next=document.documentElement.dataset.theme==='light'?'dark':'light';document.documentElement.dataset.theme=next;localStorage.setItem('verdant-theme',next)});
