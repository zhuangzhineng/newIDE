import Tab from './Tab.js'

export default class TabContainer{

	constructor(option){
		this.$tabContainer = $('#'+option.targetId);
		this.baseDom = `<div id='tabTemplate'>
		  <ul class='nav nav-tabs' role='tablist' name='tab-head'>
		  </ul>
		  <div class='tab-content' name='tab-content'>
		  </div>
		</div>`;
		this.$tabContainer.html(this.baseDom);
		this.stateDoms = {
			normal:`<i class = 'fa fa-times' aria-hidden='true'></i>`,
			changed:`<i class = 'fa fa-times-circle-o' aria-hidden='true'></i>`
		}
		this.tabFactory = {};
		this.bindCloseIconEvent();
		this.openTabStack=[];
	}
	addTab(option){
		let tab= new Tab($.extend({
			stateDoms:this.stateDoms
		},option));
		this.tabFactory[tab.id] = tab;
		this.renderTab(tab);
		//this.bindCloseIconEvent(tab);
		tab.active();
		this.openTabStack.push(tab.id);
		return tab;
	}
	removeTab(tabId){
		let toRemoveTab = this.tabFactory[tabId];
		toRemoveTab.removeSelf(this.$tabContainer);
		this.openTabStack.splice(this.openTabStack.indexOf(toRemoveTab.id),1);
		delete this.tabFactory[tabId];
	}
	bindCloseIconEvent(){
		let $tabContainer = this.$tabContainer;
		let self = this;
		$(document).on('mouseover mouseout','[name="closeIcon"]',function (e) {
			$(e.target).toggleClass('whiteColor');
		})
		$(document).on('click','[name="closeIcon"]',function (e) {
			let tabId = $(e.target).attr('target');
			self.removeTab(tabId);
			self.activeLast();
		})
	}
	active(tabId){
		let tab = this.findTab(tabId);
		tab&&tab.active();
	}
	activeLast(){
		let lastTab = this.openTabStack[this.openTabStack.length-1];
		this.active(lastTab);
	}
	renderTab(tab){
		tab.render(this.$tabContainer);
	}
	renderTabs(){

	}
	registState(state,stateDom){
		this.stateDoms[state] = stateDom;
	}
	findTab(tabId){
		return this.tabFactory[tabId];
	}
}

