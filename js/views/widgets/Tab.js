export default class Tab{
	constructor(context){
		this.title = '';
		let uuid = generateUUID();
		let headId = 'bc-head'+uuid;
		this.id = context.id||headId;
		//this.headId = headId;
		this.context = $.extend(context,{
			id:this.id,
			contentId:'bc-content'+uuid
		});
		this.baseTabHeaderDom = template('tabHeaderTemplate',context);
		this.baseTabContentDom = template('tabBodyTemplate',context);
		this.$header;
		this.$content;
		this.data = {};
	}
	setState(state){

	}
	getHeaderDom(){
		return this.baseTabHeaderDom;
	}
	getContentDom(){
		return this.baseTabContentDom;
	}
	active(){
		$('#'+this.id).tab('show');
	}
	render($tabContainer){
		let $containerHeader = $('[name="tab-head"]', $tabContainer).append(this.getHeaderDom());
		let $containerContent = $('[name="tab-content"]', $tabContainer).append(this.getContentDom());
		this.$header = $(this.getHeaderDom(),$containerHeader);
		this.$content = $(this.getContentDom(),$containerContent);
		//$('a',this.$header).data('dom-tab',this);
	}
	removeSelf($tabContainer){
		$(`[tabId=${this.id}]`, $tabContainer).remove();
	}
	setData(key,value){
		this.data[key] = value;
	}
	getData(key){
		return this.data[key];
	}
}

function generateUUID() {
    let d = new Date().getTime();
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
};