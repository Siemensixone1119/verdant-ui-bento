export class ApiClient {
  constructor({baseUrl='/api',getToken=()=>null}={}){this.baseUrl=baseUrl;this.getToken=getToken}
  async request(path,{method='GET',body,headers={},signal}={}){
    const token=this.getToken();const h={...headers};if(token)h.Authorization=`Bearer ${token}`;
    if(body!=null && !(body instanceof FormData))h['Content-Type']='application/json';
    const res=await fetch(this.baseUrl+path,{method,headers:h,body:body==null?undefined:body instanceof FormData?body:JSON.stringify(body),signal});
    const type=res.headers.get('content-type')||'';const data=res.status===204?null:type.includes('application/json')?await res.json():await res.text();
    if(!res.ok){const msg=data?.message||data?.error||`HTTP ${res.status}`;throw Object.assign(new Error(Array.isArray(msg)?msg.join(', '):String(msg)),{status:res.status,data})}return data;
  }
  get(path,opt){return this.request(path,opt)} post(path,body){return this.request(path,{method:'POST',body})} patch(path,body){return this.request(path,{method:'PATCH',body})} put(path,body){return this.request(path,{method:'PUT',body})} delete(path){return this.request(path,{method:'DELETE'})}
}
